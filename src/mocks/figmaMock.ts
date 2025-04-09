/**
 * This file mocks the Figma plugin API for local testing without Figma
 */
import { mockFigmaVariables } from "./figmaVariables.ts";

// Create a global figma mock object
const figmaMock = {
   variables: {
      getLocalVariableCollectionsAsync: async () => {
         console.log("Mock: Getting local variable collections");
         console.log(
            "Collections data:",
            JSON.stringify(mockFigmaVariables.collections, null, 2)
         );
         return mockFigmaVariables.collections;
      },
      getLocalVariables: () => {
         console.log("Mock: Getting local variables");
         console.log(
            "Variables sample (first item):",
            JSON.stringify(mockFigmaVariables.variables[0], null, 2)
         );
         console.log(`Total variables: ${mockFigmaVariables.variables.length}`);
         return mockFigmaVariables.variables;
      },
   },
   ui: {
      onmessage: null as any,
      postMessage: (msg: any) => {
         console.log("Mock: UI message sent", msg);
      },
   },
   closePlugin: () => {
      console.log("Mock: Plugin closed");
   },
};

// Export a function to initialize the mock environment
export function initFigmaMock() {
   if (typeof figma === "undefined") {
      // @ts-ignore - Assign the mock to global figma if in a test environment
      global.figma = figmaMock;
      console.log("Figma mock initialized for testing");
   }
}
