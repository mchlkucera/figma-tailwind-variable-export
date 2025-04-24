import { describe, test, expect, beforeAll } from "vitest";
import { mockFigmaVariables } from "../src/mocks/figmaVariables";
import { initFigmaMock } from "../src/mocks/figmaMock";
import generateTheme from "../src/generateTheme";
import { ColorCollection } from "../src/types";

describe("Improved Variable Sorting Algorithm", () => {
   let collections: ColorCollection[];
   let cssOutput: string;

   beforeAll(() => {
      // Initialize the Figma mock
      initFigmaMock();

      // Convert mock data to ColorCollection format
      collections = mockFigmaVariables.collections.map((collection) => ({
         name: collection.name,
         variables: mockFigmaVariables.variables.filter(
            (variable) => variable.variableCollectionId === collection.id
         ),
      }));

      // Generate the theme
      const result = generateTheme(collections);
      cssOutput = result.cssOutput;
   });

   test("Enumerated values come before aliased values", () => {
      // Test for radius variables
      const radiusSection = extractSection(cssOutput, "radius");

      // Check that all literal values appear before all aliased values
      const literalRadiusVars = [
         "--radius-none: 0;",
         "--radius-sm: 2;",
         "--radius-DEFAULT: 4;",
         "--radius-md: 6;",
         "--radius-lg: 8;",
         "--radius-xl: 12;",
         "--radius-2xl: 16;",
         "--radius-3xl: 24;",
         "--radius-4xl: 32;",
         "--radius-full: 9999;",
      ];

      const aliasedRadiusVars = [
         "--radius-badge: var(--radius-DEFAULT);",
         "--radius-button: var(--radius-md);",
         "--radius-checkbox: var(--radius-DEFAULT);",
         "--radius-counter: var(--radius-md);",
         "--radius-image: var(--radius-xl);",
         "--radius-inner: var(--radius-lg);",
         "--radius-input: var(--radius-md);",
         "--radius-label: var(--radius-xl);",
         "--radius-outer: var(--radius-xl);",
         "--radius-tag: var(--radius-full);",
         "--radius-flash-message: var(--radius-md);",
         "--radius-product-card: var(--radius-xl);",
      ];

      // Check for all literal values
      for (const varDeclaration of literalRadiusVars) {
         expect(radiusSection).toContain(varDeclaration);
      }

      // Check for all aliased values
      for (const varDeclaration of aliasedRadiusVars) {
         expect(radiusSection).toContain(varDeclaration);
      }

      // Check ordering by finding the index of the last literal value and the first aliased value
      const radiusLines = radiusSection.split("\n");

      // Find the index of the last literal value
      const lastLiteralIndex = radiusLines.findIndex((line) =>
         line.includes("--radius-full: 9999;")
      );

      // Find the index of the first aliased value
      const firstAliasedIndex = radiusLines.findIndex((line) =>
         line.includes("var(--")
      );

      // Verify that all literal values come before all aliased values
      expect(lastLiteralIndex).toBeLessThan(firstAliasedIndex);

      // Test for border-width variables (another example)
      const borderWidthSection = extractSection(cssOutput, "border-width");

      // Verify there are no aliased border-width variables in the mock data, if any
      // exist they would come after the literal values
      const borderWidthLines = borderWidthSection.split("\n");
      const literalBorderWidthCount = borderWidthLines.filter(
         (line) => !line.includes("var(--")
      ).length;

      expect(literalBorderWidthCount).toBeGreaterThan(0);
   });

   test("Color base values come before derived color values", () => {
      // Test that color base values (like brand/primary colors) come before
      // their derived semantic values
      const baseColorsFirst = [
         "color-base-black",
         "color-base-transparent",
         "color-base-white",
         "color-brand-",
         "color-gray-",
         "color-green-",
         "color-orange-",
         "color-primary-",
         "color-red-",
         "color-secondary-",
         "color-white-alpha-",
      ];

      const derivedColorsSecond = [
         "color-availability-",
         "color-background-",
         "color-badge-",
         "color-border-",
         "color-button-",
         "color-fill-",
         "color-flash-message-",
         "color-footer-",
         "color-icon-",
         "color-input-",
         "color-link-",
         "color-opening-status-",
         "color-price-",
         "color-table-",
         "color-tag-",
         "color-text-",
      ];

      // Get all occurrences of color variables
      const allColorLines = cssOutput
         .split("\n")
         .filter(
            (line) => line.trim().startsWith("--color-") && line.includes(":")
         );

      // Get the last base color index and the first derived color index
      let lastBaseColorIndex = -1;
      for (const prefix of baseColorsFirst) {
         const lines = allColorLines.filter((line) => line.includes(prefix));
         if (lines.length > 0) {
            const lastIndex = allColorLines.indexOf(lines[lines.length - 1]);
            lastBaseColorIndex = Math.max(lastBaseColorIndex, lastIndex);
         }
      }

      let firstDerivedColorIndex = allColorLines.length;
      for (const prefix of derivedColorsSecond) {
         const lines = allColorLines.filter((line) => line.includes(prefix));
         if (lines.length > 0) {
            const firstIndex = allColorLines.indexOf(lines[0]);
            if (firstIndex !== -1) {
               firstDerivedColorIndex = Math.min(
                  firstDerivedColorIndex,
                  firstIndex
               );
            }
         }
      }

      // Verify that all base colors come before all derived colors
      expect(lastBaseColorIndex).toBeLessThan(firstDerivedColorIndex);
   });
});

// Helper function to extract a section from the CSS output
function extractSection(css: string, prefix: string): string {
   const lines = css.split("\n");
   const sectionStart = lines.findIndex((line) =>
      line.trim().startsWith(`--${prefix}-`)
   );

   if (sectionStart === -1) return "";

   // Find where this section ends (next empty line or end of file)
   let sectionEnd = lines.findIndex(
      (line, index) =>
         index > sectionStart && (line.trim() === "" || line.trim() === "}")
   );

   if (sectionEnd === -1) sectionEnd = lines.length;

   return lines.slice(sectionStart, sectionEnd).join("\n");
}
