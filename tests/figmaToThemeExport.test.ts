import { describe, test, expect, vi } from "vitest";
import generateTheme from "../src/generateTheme";
import { ColorCollection } from "../src/types";

describe("Figma Variables to Theme Export", () => {
   test("converts simple color variables correctly", () => {
      // Mock a simple collection with color variables
      const mockCollections: ColorCollection[] = [
         {
            name: "Colors",
            variables: [
               {
                  id: "1",
                  name: "primary",
                  resolvedType: "COLOR",
                  valuesByMode: {
                     mode1: {
                        r: 0,
                        g: 0.5,
                        b: 1,
                        a: 1,
                     },
                  },
               },
               {
                  id: "2",
                  name: "secondary",
                  resolvedType: "COLOR",
                  valuesByMode: {
                     mode1: {
                        r: 1,
                        g: 0,
                        b: 0.5,
                        a: 1,
                     },
                  },
               },
            ],
         },
      ];

      const { cssOutput } = generateTheme(mockCollections);

      // Verify the generated CSS contains our color variables in hex format
      expect(cssOutput).toContain("--color-primary");
      expect(cssOutput).toContain("#0080ff"); // Hex value for rgb(0, 128, 255)

      expect(cssOutput).toContain("--color-secondary");
      expect(cssOutput).toContain("#ff0080"); // Hex value for the secondary color
   });

   test("handles variable references/aliases correctly", () => {
      // Mock a collection with variables that reference other variables
      const mockCollections: ColorCollection[] = [
         {
            name: "Theme",
            variables: [
               {
                  id: "color1",
                  name: "base",
                  resolvedType: "COLOR",
                  valuesByMode: {
                     mode1: {
                        r: 0,
                        g: 0.5,
                        b: 1,
                        a: 1,
                     },
                  },
               },
               {
                  id: "color2",
                  name: "primary",
                  resolvedType: "COLOR",
                  valuesByMode: {
                     mode1: {
                        type: "VARIABLE_ALIAS",
                        id: "color1",
                     },
                  },
               },
            ],
         },
      ];

      const { cssOutput } = generateTheme(mockCollections);

      // Verify that the reference is converted to a CSS variable reference
      expect(cssOutput).toContain("--color-primary: var(--color-base);");
   });

   test("sorts variables according to the sorting logic", () => {
      // Create variables that will test the sorting logic
      const mockCollections: ColorCollection[] = [
         {
            name: "Spacing",
            variables: [
               {
                  id: "spacing1",
                  name: "spacing/4",
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 16,
                  },
               },
               {
                  id: "spacing2",
                  name: "spacing/2",
                  resolvedType: "FLOAT",
                  valuesByMode: {
                     mode1: 8,
                  },
               },
            ],
         },
      ];

      const { cssOutput } = generateTheme(mockCollections);

      // Check the order in the CSS output - spacing-2 should come before spacing-4
      const spacing2Index = cssOutput.indexOf("--spacing-2");
      const spacing4Index = cssOutput.indexOf("--spacing-4");

      expect(spacing2Index).not.toBe(-1);
      expect(spacing4Index).not.toBe(-1);
      expect(spacing2Index).toBeLessThan(spacing4Index);
   });

   test("handles string values correctly", () => {
      const mockCollections: ColorCollection[] = [
         {
            name: "Fonts",
            variables: [
               {
                  id: "font1",
                  name: "font/family/body",
                  resolvedType: "STRING",
                  valuesByMode: {
                     mode1: "Inter, sans-serif",
                  },
               },
            ],
         },
      ];

      const { cssOutput } = generateTheme(mockCollections);

      expect(cssOutput).toContain("--font-family-body");
      expect(cssOutput).toContain("Inter, sans-serif");
   });

   test("reports errors for missing variable references", () => {
      const mockCollections: ColorCollection[] = [
         {
            name: "Missing References",
            variables: [
               {
                  id: "color1",
                  name: "color/primary",
                  resolvedType: "COLOR",
                  valuesByMode: {
                     mode1: {
                        type: "VARIABLE_ALIAS",
                        id: "non-existent-id",
                     },
                  },
               },
            ],
         },
      ];

      const { errors } = generateTheme(mockCollections);

      // Verify that an error was reported for the missing reference
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("Referenced variable not found");
   });
});
