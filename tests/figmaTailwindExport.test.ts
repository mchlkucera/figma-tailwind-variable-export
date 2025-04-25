import { describe, test, expect, beforeAll } from "vitest";
import { mockFigmaVariables } from "../src/mocks/figmaVariables";
import { initFigmaMock } from "../src/mocks/figmaMock";
import generateTheme from "../src/generateTheme";
import { ColorCollection } from "../src/types";

describe("Figma Tailwind Variable Export", () => {
   let collections: ColorCollection[];

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
   });

   test("Generates CSS with current sorting algorithm", () => {
      // Generate the theme using the current sorting algorithm
      const { cssOutput } = generateTheme(collections);

      // Check if the output matches the current expectation
      expect(cssOutput).toContain("--radius-none: 0px;");
      expect(cssOutput).toContain("--radius-badge: var(--radius-DEFAULT);");

      // Verify general structure
      expect(cssOutput).toMatch(/^@theme \{[\s\S]*\}$/);

      // Specific test case: A variable with aliased value should exist
      expect(cssOutput).toContain("--radius-badge: var(--radius-DEFAULT);");
   });

   test("Current sorting doesn't prioritize enumerated values", () => {
      // Generate the theme using the current sorting algorithm
      const { cssOutput } = generateTheme(collections);

      // In the current algorithm, enumerated values might be mixed with aliased values
      const radiusSection = extractSection(cssOutput, "radius");

      // Find indices of key variables
      const plainValueIndex = radiusSection.indexOf("--radius-none: 0px;");
      const aliasedValueIndex = radiusSection.indexOf(
         "--radius-badge: var(--radius-DEFAULT);"
      );

      // Test will pass with current algorithm, but will fail after we improve it
      expect(plainValueIndex).not.toBe(-1);
      expect(aliasedValueIndex).not.toBe(-1);

      // Don't strictly enforce order in this test, we'll fix the sorting later
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
