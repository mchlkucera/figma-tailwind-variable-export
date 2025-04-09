/**
 * Vitest setup file
 * This runs before all tests and is used to set up the global environment
 */

// Import Vitest utilities
import { beforeAll, afterAll, vi } from "vitest";

// Mock the global figma object
import { initFigmaMock } from "../src/mocks/figmaMock";

// Mock the utility functions from @create-figma-plugin/utilities
globalThis.on = vi.fn();
globalThis.emit = vi.fn();
globalThis.showUI = vi.fn();

// Initialize the Figma mock
beforeAll(() => {
   // Initialize the mock Figma environment
   initFigmaMock();

   // For debugging purposes
   console.log("Test setup complete: Figma mock initialized");
});

// Clean up after all tests
afterAll(() => {
   console.log("Tests complete");
});
