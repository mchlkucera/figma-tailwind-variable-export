// Debug script to understand color variable ordering
import { mockFigmaVariables } from "./src/mocks/figmaVariables.ts";
import { initFigmaMock } from "./src/mocks/figmaMock.ts";
import generateTheme from "./src/generateTheme.ts";
import fs from "fs";

// Initialize mock
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

// Extract color variables
const colorLines = cssOutput
   .split("\n")
   .filter((line) => line.trim().startsWith("--color-") && line.includes(":"));

// Base colors to check
const baseColors = [
   "color-base-",
   "color-brand-",
   "color-gray-",
   "color-green-",
   "color-orange-",
   "color-primary-",
   "color-red-",
   "color-secondary-",
   "color-white-alpha-",
];

// Derived colors to check
const derivedColors = [
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

// Debug output file
const outputLines = [];
outputLines.push("COLOR VARIABLE ANALYSIS");
outputLines.push("======================");
outputLines.push(`Total color variables: ${colorLines.length}`);
outputLines.push("");

// Check which base colors appear in which positions
outputLines.push("BASE COLORS POSITIONS:");
baseColors.forEach((basePrefix) => {
   const matches = colorLines.filter((line) => line.includes(basePrefix));
   if (matches.length > 0) {
      const firstIndex = colorLines.indexOf(matches[0]);
      const lastIndex = colorLines.indexOf(matches[matches.length - 1]);
      outputLines.push(
         `${basePrefix}: first at ${firstIndex}, last at ${lastIndex}, count: ${matches.length}`
      );
   } else {
      outputLines.push(`${basePrefix}: No matches found`);
   }
});

outputLines.push("");
outputLines.push("DERIVED COLORS POSITIONS:");
derivedColors.forEach((derivedPrefix) => {
   const matches = colorLines.filter((line) => line.includes(derivedPrefix));
   if (matches.length > 0) {
      const firstIndex = colorLines.indexOf(matches[0]);
      const lastIndex = colorLines.indexOf(matches[matches.length - 1]);
      outputLines.push(
         `${derivedPrefix}: first at ${firstIndex}, last at ${lastIndex}, count: ${matches.length}`
      );
   } else {
      outputLines.push(`${derivedPrefix}: No matches found`);
   }
});

outputLines.push("");
outputLines.push("FIRST 10 COLOR LINES:");
colorLines.slice(0, 10).forEach((line, i) => {
   outputLines.push(`${i}: ${line}`);
});

outputLines.push("");
outputLines.push("LAST 10 COLOR LINES:");
colorLines.slice(-10).forEach((line, i) => {
   outputLines.push(`${colorLines.length - 10 + i}: ${line}`);
});

// Write debug info to file
fs.writeFileSync("color-debug.txt", outputLines.join("\n"));
console.log("Color debug information saved to color-debug.txt");
