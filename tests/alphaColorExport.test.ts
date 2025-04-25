import { describe, test, expect } from "vitest";
import generateTheme from "../src/generateTheme";
import { ColorCollection } from "../src/types";

describe("Alpha Color Export Tests", () => {
   test("correctly preserves transparency in alpha colors", () => {
      // Create a test collection with a white color that has transparency
      const mockCollections: ColorCollection[] = [
         {
            name: "Colors",
            variables: [
               {
                  id: "white-alpha-500",
                  name: "white-alpha/500",
                  resolvedType: "COLOR",
                  valuesByMode: {
                     mode1: {
                        r: 1,
                        g: 1,
                        b: 1,
                        a: 0.16, // A transparency value like in the actual white-alpha-500
                     },
                  },
               },
               {
                  id: "solid-color",
                  name: "red/500",
                  resolvedType: "COLOR",
                  valuesByMode: {
                     mode1: {
                        r: 1,
                        g: 0,
                        b: 0,
                        a: 1, // Full opacity
                     },
                  },
               },
            ],
         },
      ];

      const { cssOutput } = generateTheme(mockCollections);

      // Check that white-alpha-500 includes transparency in the hex code (8 characters instead of 6)
      expect(cssOutput).toContain("--color-white-alpha-500:");

      // The alpha hex should be 8 characters long (RRGGBBAA)
      const whiteAlphaMatch = cssOutput.match(
         /--color-white-alpha-500: (#[0-9a-f]{8});/i
      );
      expect(whiteAlphaMatch).not.toBeNull();
      if (whiteAlphaMatch) {
         const hexCode = whiteAlphaMatch[1];
         expect(hexCode.length).toBe(9); // # + 8 characters
      }

      // For comparison, solid color should be 7 characters (# + RRGGBB)
      const solidColorMatch = cssOutput.match(
         /--color-red-500: (#[0-9a-f]{6});/i
      );
      expect(solidColorMatch).not.toBeNull();
      if (solidColorMatch) {
         const hexCode = solidColorMatch[1];
         expect(hexCode.length).toBe(7); // # + 6 characters
      }
   });
});
