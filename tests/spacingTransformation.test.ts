import { describe, test, expect } from "vitest";
import generateTheme from "../src/generateTheme";
import { ColorCollection } from "../src/types";

describe("Spacing Variable Transformation", () => {
   test("transforms spacing variables with hyphenated decimal values", () => {
      // Mock a collection with spacing variables that use hyphenated decimal format
      // Order is intentionally mixed to test sorting
      const mockCollections: ColorCollection[] = [
         {
            name: "Spacing",
            variables: [
               {
                  id: "space1",
                  name: "spacing/4",
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 4,
                  },
               },
               {
                  id: "space2",
                  name: "spacing/0",
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 0,
                  },
               },
               {
                  id: "space3",
                  name: "spacing/2-5", // Should transform to 2.5
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 2.5,
                  },
               },
               {
                  id: "space4",
                  name: "spacing/1-5", // Should transform to 1.5
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 1.5,
                  },
               },
               {
                  id: "space5",
                  name: "spacing/1",
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 1,
                  },
               },
               {
                  id: "space6",
                  name: "spacing/0-5", // Should transform to 0.5
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 0.5,
                  },
               },
               {
                  id: "space7",
                  name: "spacing/2",
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 2,
                  },
               },
               {
                  id: "space8",
                  name: "spacing/3-5", // Should transform to 3.5
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 3.5,
                  },
               },
               {
                  id: "space9",
                  name: "spacing/3",
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 3,
                  },
               },
               {
                  id: "space10",
                  name: "spacing/px",
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 1,
                  },
               },
            ],
         },
      ];

      const { cssOutput } = generateTheme(mockCollections);

      // Extract the spacing section from the CSS output
      const spacingLines = cssOutput
         .split("\n")
         .filter(
            (line) => line.trim().startsWith("--spacing-") && line.includes(":")
         );

      // Verify the transformed variable names in the CSS output
      expect(cssOutput).toContain("--spacing-0.5:");
      expect(cssOutput).toContain("--spacing-1.5:");
      expect(cssOutput).toContain("--spacing-2.5:");
      expect(cssOutput).toContain("--spacing-3.5:");

      // Check that the original hyphenated format is NOT present
      expect(cssOutput).not.toContain("--spacing-0-5:");
      expect(cssOutput).not.toContain("--spacing-1-5:");
      expect(cssOutput).not.toContain("--spacing-2-5:");
      expect(cssOutput).not.toContain("--spacing-3-5:");

      // Check the correct sorting order
      const expectedOrder = [
         "--spacing-0:",
         "--spacing-px:",
         "--spacing-0.5:",
         "--spacing-1:",
         "--spacing-1.5:",
         "--spacing-2:",
         "--spacing-2.5:",
         "--spacing-3:",
         "--spacing-3.5:",
         "--spacing-4:",
      ];

      // Check that each variable appears in the correct position relative to others
      for (let i = 0; i < expectedOrder.length - 1; i++) {
         const currentVar = expectedOrder[i];
         const nextVar = expectedOrder[i + 1];

         const currentIndex = spacingLines.findIndex((line) =>
            line.includes(currentVar)
         );
         const nextIndex = spacingLines.findIndex((line) =>
            line.includes(nextVar)
         );

         expect(currentIndex).not.toBe(-1);
         expect(nextIndex).not.toBe(-1);
         expect(currentIndex).toBeLessThan(nextIndex);
      }
   });
});
