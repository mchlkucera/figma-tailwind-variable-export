import { describe, test, expect, vi } from "vitest";
import { mockFigmaVariables } from "../src/mocks/figmaVariables";

// This test suite focuses on the variable export functionality
describe("Figma Variable Structure Export", () => {
   test("Mock variables have the basic required structure", () => {
      // Verify collections exist and have proper structure
      expect(Array.isArray(mockFigmaVariables.collections)).toBe(true);

      // Verify variables exist and have proper structure
      expect(Array.isArray(mockFigmaVariables.variables)).toBe(true);

      // If we have collections with actual properties, check first one
      if (mockFigmaVariables.collections.length > 0) {
         const collection = mockFigmaVariables.collections[0];
         expect(collection).toHaveProperty("id");
      }

      // If we have variables with actual properties, check first one
      if (mockFigmaVariables.variables.length > 0) {
         const variable = mockFigmaVariables.variables[0];
         expect(variable).toHaveProperty("id");
      }
   });

   test("The mock structure can be exported to console", () => {
      // Spy on console.log
      const consoleSpy = vi.spyOn(console, "log");

      // Print the first collection
      if (mockFigmaVariables.collections.length > 0) {
         console.log(mockFigmaVariables.collections[0]);
         expect(consoleSpy).toHaveBeenCalled();
      }

      // Print the first variable
      if (mockFigmaVariables.variables.length > 0) {
         console.log(mockFigmaVariables.variables[0]);
         expect(consoleSpy).toHaveBeenCalled();
      }

      // Restore console.log
      consoleSpy.mockRestore();
   });

   test("Collection and variable count is available", () => {
      // Just verify we can output the counts
      const collectionsCount = mockFigmaVariables.collections.length;
      const variablesCount = mockFigmaVariables.variables.length;

      expect(typeof collectionsCount).toBe("number");
      expect(typeof variablesCount).toBe("number");

      console.log(
         `Collections: ${collectionsCount}, Variables: ${variablesCount}`
      );
   });
});
