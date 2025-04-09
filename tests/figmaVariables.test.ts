import { describe, test, expect, vi, beforeEach } from "vitest";
import { mockFigmaVariables } from "../src/mocks/figmaVariables";
import { initFigmaMock } from "../src/mocks/figmaMock";
import main from "../src/main";

describe("Figma Variables Export", () => {
   // Create a spy for console.log to capture its output
   let consoleLogSpy: any;
   let eventEmitter: any;

   beforeEach(() => {
      // Reset mocks before each test
      vi.resetAllMocks();

      // Spy on console.log
      consoleLogSpy = vi.spyOn(console, "log");

      // Create an event emitter to simulate Figma plugin events
      eventEmitter = {
         listeners: new Map(),
         on(event: string, callback: Function) {
            this.listeners.set(event, callback);
            return this;
         },
         emit(event: string, ...args: any[]) {
            const callback = this.listeners.get(event);
            if (callback) {
               callback(...args);
            }
            return this;
         },
      };

      // Mock the utility functions
      globalThis.on = vi.fn((event, callback) => {
         eventEmitter.on(event, callback);
      });

      globalThis.emit = vi.fn((event, ...args) => {
         eventEmitter.emit(event, ...args);
      });

      globalThis.showUI = vi.fn();
   });


   test("Mock data has the expected structure", () => {
      // Check that collections exist and have the required structure
      expect(mockFigmaVariables.collections).toBeInstanceOf(Array);
      if (mockFigmaVariables.collections.length > 0) {
         const collection = mockFigmaVariables.collections[0];
         expect(collection).toHaveProperty("id");
      }

      // Check that variables exist and have the required structure
      expect(mockFigmaVariables.variables).toBeInstanceOf(Array);
      if (mockFigmaVariables.variables.length > 0) {
         const variable = mockFigmaVariables.variables[0];
         expect(variable).toHaveProperty("id");
      }
   });
});
