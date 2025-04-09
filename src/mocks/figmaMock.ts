/**
 * This file mocks the Figma plugin API for local testing without Figma
 */
import { mockFigmaVariables } from "./figmaVariables.ts";

// Create a global figma mock object
const figmaMock = {
   variables: {
      getLocalVariableCollectionsAsync: async () => {
         
         return mockFigmaVariables.collections;
      },
      getLocalVariables: () => {
         
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
