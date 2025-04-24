// Test script to verify sorting
import { mockFigmaVariables } from "./src/mocks/figmaVariables.ts";
import { initFigmaMock } from "./src/mocks/figmaMock.ts";
import generateTheme from "./src/generateTheme.ts";

// Initialize Figma mock
initFigmaMock();

// Convert mock data to ColorCollection format
const collections = mockFigmaVariables.collections.map((collection) => ({
   name: collection.name,
   variables: mockFigmaVariables.variables.filter(
      (variable) => variable.variableCollectionId === collection.id
   ),
}));

// Generate the theme
const { cssOutput, errors } = generateTheme(collections);

// Output radius section first to see if our sorting works
function extractSection(css, prefix) {
   const lines = css.split("\n");
   const sectionStart = lines.findIndex((line) =>
      line.trim().startsWith(`--${prefix}-`)
   );

   if (sectionStart === -1) return "";

   let sectionEnd = lines.findIndex(
      (line, index) =>
         index > sectionStart && (line.trim() === "" || line.trim() === "}")
   );

   if (sectionEnd === -1) sectionEnd = lines.length;

   return lines.slice(sectionStart, sectionEnd).join("\n");
}

// Display radius section to verify our sorting
const radiusSection = extractSection(cssOutput, "radius");
console.log("RADIUS SECTION:");
console.log(radiusSection);

// Verify literals vs aliases
const radiusLines = radiusSection.split("\n");
const literalLines = radiusLines.filter((line) => !line.includes("var(--"));
const aliasedLines = radiusLines.filter((line) => line.includes("var(--"));

console.log("\nLITERAL VALUES:");
console.log(literalLines.join("\n"));

console.log("\nALIASED VALUES:");
console.log(aliasedLines.join("\n"));

// Check if all literal values come before all aliased values
const allLiteralsBeforeAliases =
   radiusLines.indexOf(literalLines[literalLines.length - 1]) <
   radiusLines.indexOf(aliasedLines[0]);

console.log(
   "\nAll literals before aliases:",
   allLiteralsBeforeAliases ? "✓ YES" : "✗ NO"
);

// Also display the color section to verify base colors vs semantic ones
const allColorLines = cssOutput
   .split("\n")
   .filter((line) => line.trim().startsWith("--color-") && line.includes(":"));

// Display first 10 and last 10 color lines
console.log("\nFIRST 10 COLOR LINES:");
console.log(allColorLines.slice(0, 10).join("\n"));

console.log("\nLAST 10 COLOR LINES:");
console.log(allColorLines.slice(-10).join("\n"));
