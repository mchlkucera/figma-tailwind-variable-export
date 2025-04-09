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

   test("Plugin initializes correctly", () => {
      // Run the main function to initialize the plugin
      main();

      // Check that showUI was called
      expect(globalThis.showUI).toHaveBeenCalled();

      // Check that an event handler was registered for GET_VARIABLES
      expect(globalThis.on).toHaveBeenCalledWith(
         "GET_VARIABLES",
         expect.any(Function)
      );
   });

   test("Plugin retrieves and logs variables correctly", async () => {
      // Initialize the plugin
      main();

      // Simulate the GET_VARIABLES event
      eventEmitter.emit("GET_VARIABLES");

      // Check that console.log was called with the expected debug outputs
      expect(consoleLogSpy).toHaveBeenCalledWith(
         expect.stringContaining("RAW_FIGMA_DATA"),
         expect.anything()
      );

      // Check that the emit function was called with SET_VARIABLES
      expect(globalThis.emit).toHaveBeenCalledWith(
         "SET_VARIABLES",
         expect.objectContaining({
            generatedTheme: expect.any(String),
            errors: expect.any(Array),
         })
      );
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
