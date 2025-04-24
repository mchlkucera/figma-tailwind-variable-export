// Generate and save CSS output to verify sorting
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

// Log any errors
if (errors.length > 0) {
   console.error("Errors:", errors);
}

// Save the output to a file
fs.writeFileSync("sorted-output.css", cssOutput);

console.log("CSS output saved to sorted-output.css");
