import { describe, expect, test } from "vitest";
import generateTheme from "../src/generateTheme";
import { mockFigmaVariables } from "../src/mocks/figmaVariables";

// Create a mock collection for testing
const mockVariableCollection = {
   name: "Test Collection",
   variables: [
      {
         id: "color-test-id",
         name: "color/test",
         resolvedType: "COLOR",
         valuesByMode: {
            "1:0": { r: 1, g: 0, b: 0, a: 1 },
         },
         scopes: [],
      },
   ],
};

describe("Font family filtering", () => {
   test("should include font family variables by default", () => {
      // Create mock collections with font family variables
      const mockCollection = {
         ...mockVariableCollection,
         variables: [
            ...mockVariableCollection.variables,
            {
               id: "font-accent-id",
               name: "font/accent",
               resolvedType: "STRING",
               valuesByMode: {
                  "1:0": "Raleway",
               },
               scopes: [],
            },
            {
               id: "font-body-id",
               name: "font/body",
               resolvedType: "STRING",
               valuesByMode: {
                  "1:0": "Inter",
               },
               scopes: [],
            },
            {
               id: "font-letter-spacing-id",
               name: "font/letter-spacing/normal",
               resolvedType: "FLOAT",
               valuesByMode: {
                  "1:0": 0,
               },
               scopes: [],
            },
         ],
      };

      const { cssOutput } = generateTheme([mockCollection]);

      // Font family variables should be included in the output
      expect(cssOutput).toContain("--font-accent");
      expect(cssOutput).toContain("--font-body");
      // Other font variables should also be included
      expect(cssOutput).toContain("--font-letter-spacing-normal");
   });

   test("should filter out only font family variables when ignoreFontFamilies option is set", () => {
      // Create mock collections with font family and other font variables
      const mockCollection = {
         ...mockVariableCollection,
         variables: [
            ...mockVariableCollection.variables,
            {
               id: "font-accent-id",
               name: "font/accent",
               resolvedType: "STRING",
               valuesByMode: {
                  "1:0": "Raleway",
               },
               scopes: [],
            },
            {
               id: "font-body-id",
               name: "font/body",
               resolvedType: "STRING",
               valuesByMode: {
                  "1:0": "Inter",
               },
               scopes: [],
            },
            {
               id: "font-letter-spacing-id",
               name: "font/letter-spacing/normal",
               resolvedType: "FLOAT",
               valuesByMode: {
                  "1:0": 0,
               },
               scopes: [],
            },
         ],
      };

      const { cssOutput } = generateTheme([mockCollection], {
         ignoreFontFamilies: true,
      });

      // Font family variables should NOT be included in the output
      expect(cssOutput).not.toContain("--font-accent");
      expect(cssOutput).not.toContain("--font-body");
      // But other font variables should still be included
      expect(cssOutput).toContain("--font-letter-spacing-normal");
   });
});
