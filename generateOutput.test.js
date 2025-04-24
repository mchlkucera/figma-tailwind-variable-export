import { describe, test, afterAll } from "vitest";
import { mockFigmaVariables } from "./src/mocks/figmaVariables.ts";
import { initFigmaMock } from "./src/mocks/figmaMock.ts";
import generateTheme from "./src/generateTheme.ts";
import fs from "fs";

// Test that writes our sorted output to a file
describe("Generate sorted CSS output", () => {
   let cssOutput;

   test("Generate and save sorted CSS", () => {
      // Initialize mock
      initFigmaMock();

      // Convert mock data to collections
      const collections = mockFigmaVariables.collections.map((collection) => ({
         name: collection.name,
         variables: mockFigmaVariables.variables.filter(
            (variable) => variable.variableCollectionId === collection.id
         ),
      }));

      // Generate the theme with our improved sorting algorithm
      const result = generateTheme(collections);
      cssOutput = result.cssOutput;
   });

   afterAll(() => {
      // Save the output file after tests complete
      if (cssOutput) {
         fs.writeFileSync("sorted-output.css", cssOutput);
         console.log("Sorted CSS saved to sorted-output.css");
      }
   });
});
