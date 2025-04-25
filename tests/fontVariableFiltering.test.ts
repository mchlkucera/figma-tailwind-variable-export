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
   test("should include font families by default", () => {
      // Create mock collections with a font variable
      const mockCollection = {
         ...mockVariableCollection,
         variables: [
            ...mockVariableCollection.variables,
            {
               id: "font-test-id",
               name: "font/test",
               resolvedType: "STRING",
               valuesByMode: {
                  "1:0": "Arial",
               },
               scopes: [],
            },
         ],
      };

      const { cssOutput } = generateTheme([mockCollection]);

      // Font family should be included in the output
      expect(cssOutput).toContain("--font-test");
   });

   test("should filter out font families when ignoreFontFamilies option is set", () => {
      // Create mock collections with a font variable
      const mockCollection = {
         ...mockVariableCollection,
         variables: [
            ...mockVariableCollection.variables,
            {
               id: "font-test-id",
               name: "font/test",
               resolvedType: "STRING",
               valuesByMode: {
                  "1:0": "Arial",
               },
               scopes: [],
            },
         ],
      };

      const { cssOutput } = generateTheme([mockCollection], {
         ignoreFontFamilies: true,
      });

      // Font family should NOT be included in the output
      expect(cssOutput).not.toContain("--font-test");
   });
});
