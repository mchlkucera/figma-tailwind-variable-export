// Simple script to test the sorting algorithm
const { mockFigmaVariables } = require("../src/mocks/figmaVariables.ts");
const { initFigmaMock } = require("../src/mocks/figmaMock.ts");
const generateTheme = require("../src/generateTheme.ts").default;

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

// Output the CSS
console.log(cssOutput);
