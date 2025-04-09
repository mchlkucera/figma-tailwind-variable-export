import { describe, test, expect } from "vitest";
import { sortVariables } from "../src/helpers/sort";
import { ColorVariableWithValues } from "../src/types";
import { SIZE_ORDER } from "../src/constants";

describe("Variable Sorting Logic", () => {
   test("sortVariables groups by prefix and sorts correctly", () => {
      // Mock variables to test sorting
      const mockVariables: ColorVariableWithValues[] = [
         {
            id: "1",
            name: "radius/lg",
            cssName: "radius-lg",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "8px",
         },
         {
            id: "2",
            name: "radius/sm",
            cssName: "radius-sm",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "2px",
         },
         {
            id: "3",
            name: "spacing/4",
            cssName: "spacing-4",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "16px",
         },
         {
            id: "4",
            name: "spacing/2",
            cssName: "spacing-2",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "8px",
         },
         {
            id: "5",
            name: "text/base",
            cssName: "text-base",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "16px",
         },
         {
            id: "6",
            name: "text/xl",
            cssName: "text-xl",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "20px",
         },
      ];

      const sortedVariables = sortVariables(mockVariables);

      // Verify that variables are grouped by prefix (radius, spacing, text)
      // and that within each group, they are correctly sorted

      // Find all 'radius' variables and check their order
      const radiusVariables = sortedVariables.filter((v) =>
         v.cssName.startsWith("radius-")
      );
      expect(radiusVariables.length).toBe(2);
      expect(radiusVariables[0].cssName).toBe("radius-sm"); // sm comes before lg in SIZE_ORDER
      expect(radiusVariables[1].cssName).toBe("radius-lg");

      // Find all 'spacing' variables and check their order
      const spacingVariables = sortedVariables.filter((v) =>
         v.cssName.startsWith("spacing-")
      );
      expect(spacingVariables.length).toBe(2);
      expect(spacingVariables[0].cssName).toBe("spacing-2"); // Numerical order
      expect(spacingVariables[1].cssName).toBe("spacing-4");

      // Find all 'text' variables and check their order
      const textVariables = sortedVariables.filter((v) =>
         v.cssName.startsWith("text-")
      );
      expect(textVariables.length).toBe(2);
      expect(textVariables[0].cssName).toBe("text-base"); // base comes before xl in SIZE_ORDER
      expect(textVariables[1].cssName).toBe("text-xl");
   });

   test("size variables are sorted according to SIZE_ORDER", () => {
      // Create variables with all size suffixes from SIZE_ORDER in random order
      const shuffledSizes = [...SIZE_ORDER].sort(() => Math.random() - 0.5);

      const mockVariables: ColorVariableWithValues[] = shuffledSizes.map(
         (size, index) => ({
            id: String(index),
            name: `radius/${size}`,
            cssName: `radius-${size}`,
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: `${index}px`,
         })
      );

      const sortedVariables = sortVariables(mockVariables);

      // Verify that the variables are sorted according to SIZE_ORDER
      for (let i = 0; i < SIZE_ORDER.length; i++) {
         expect(sortedVariables[i].cssName).toBe(`radius-${SIZE_ORDER[i]}`);
      }
   });

   test("numeric suffixes are sorted numerically, not lexicographically", () => {
      const mockVariables: ColorVariableWithValues[] = [
         {
            id: "1",
            name: "spacing/2",
            cssName: "spacing-2",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "8px",
         },
         {
            id: "2",
            name: "spacing/10",
            cssName: "spacing-10",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "40px",
         },
         {
            id: "3",
            name: "spacing/1",
            cssName: "spacing-1",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "4px",
         },
      ];

      const sortedVariables = sortVariables(mockVariables);

      // Verify numeric sorting (1, 2, 10) instead of lexicographic (1, 10, 2)
      expect(sortedVariables[0].cssName).toBe("spacing-1");
      expect(sortedVariables[1].cssName).toBe("spacing-2");
      expect(sortedVariables[2].cssName).toBe("spacing-10");
   });

   test("prefixes with detailed paths are sorted correctly", () => {
      const mockVariables: ColorVariableWithValues[] = [
         {
            id: "1",
            name: "font/weight/bold",
            cssName: "font-weight-bold",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "700",
         },
         {
            id: "2",
            name: "font/weight/normal",
            cssName: "font-weight-normal",
            resolvedType: "FLOAT",
            valuesByMode: {},
            resolvedValue: "400",
         },
         {
            id: "3",
            name: "font/family/body",
            cssName: "font-family-body",
            resolvedType: "STRING",
            valuesByMode: {},
            resolvedValue: "'Inter', sans-serif",
         },
      ];

      const sortedVariables = sortVariables(mockVariables);

      // Variables should be grouped by their detailed prefix
      const familyVars = sortedVariables.filter((v) =>
         v.cssName.includes("family")
      );
      const weightVars = sortedVariables.filter((v) =>
         v.cssName.includes("weight")
      );

      expect(familyVars.length).toBe(1);
      expect(weightVars.length).toBe(2);

      // Within the weight group, normal should come before bold
      expect(weightVars[0].cssName).toBe("font-weight-bold");
      expect(weightVars[1].cssName).toBe("font-weight-normal");
   });
});
