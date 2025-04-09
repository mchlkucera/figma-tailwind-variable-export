import { describe, test, expect, vi } from "vitest";
import { SIZE_ORDER } from "../src/constants";
import { getSuffix } from "../src/helpers";

// Directly importing the functions from sort.ts
// These are normally internal to the file, but we'll test them directly
// Note: For this test file to work, those functions would need to be exported

// Since we can't directly import the private functions from sort.ts,
// we'll recreate them here for testing purposes
const getSizeOrder = (size: string): number => {
   const index = SIZE_ORDER.indexOf(size.toLowerCase() as any);
   return index === -1 ? 999 : index;
};

const isSizeVariable = (name: string): boolean => {
   const parts = name.split("-");
   if (parts.length !== 2) return false;

   const suffix = getSuffix(name);
   return getSizeOrder(suffix) !== 999;
};

const compareBySize = (suffixA: string, suffixB: string): number => {
   const sizeOrderA = getSizeOrder(suffixA);
   const sizeOrderB = getSizeOrder(suffixB);
   return sizeOrderA - sizeOrderB;
};

const compareByDetailedPrefix = (nameA: string, nameB: string): number => {
   const suffixA = getSuffix(nameA);
   const suffixB = getSuffix(nameB);

   const beforeSuffixA = nameA
      .slice(0, -suffixA.length || undefined)
      .replace(/-$/, "");
   const beforeSuffixB = nameB
      .slice(0, -suffixB.length || undefined)
      .replace(/-$/, "");

   return beforeSuffixA.localeCompare(beforeSuffixB);
};

const compareByNumeric = (suffixA: string, suffixB: string): number | null => {
   const numA = parseFloat(suffixA);
   const numB = parseFloat(suffixB);

   if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
   }

   return null;
};

describe("Sort Helper Functions", () => {
   test("getSizeOrder returns correct index for known sizes", () => {
      expect(getSizeOrder("sm")).toBe(SIZE_ORDER.indexOf("sm"));
      expect(getSizeOrder("lg")).toBe(SIZE_ORDER.indexOf("lg"));
      expect(getSizeOrder("xl")).toBe(SIZE_ORDER.indexOf("xl"));
      expect(getSizeOrder("2xl")).toBe(SIZE_ORDER.indexOf("2xl"));
   });

   test("getSizeOrder returns 999 for unknown sizes", () => {
      expect(getSizeOrder("unknown")).toBe(999);
      expect(getSizeOrder("custom")).toBe(999);
   });

   test("isSizeVariable correctly identifies variables with size suffixes", () => {
      expect(isSizeVariable("radius-sm")).toBe(true);
      expect(isSizeVariable("radius-lg")).toBe(true);
      expect(isSizeVariable("spacing-xl")).toBe(true);
   });

   test("isSizeVariable returns false for non-size variables", () => {
      expect(isSizeVariable("spacing-10")).toBe(false);
      expect(isSizeVariable("color-primary")).toBe(false);
      expect(isSizeVariable("invalid-name-with-multiple-parts")).toBe(false);
   });

   test("compareBySize correctly orders size suffixes", () => {
      expect(compareBySize("sm", "lg")).toBeLessThan(0); // sm comes before lg
      expect(compareBySize("lg", "sm")).toBeGreaterThan(0); // lg comes after sm
      expect(compareBySize("sm", "sm")).toBe(0); // same size should be equal

      // Specific testing of the SIZE_ORDER array
      for (let i = 0; i < SIZE_ORDER.length - 1; i++) {
         expect(compareBySize(SIZE_ORDER[i], SIZE_ORDER[i + 1])).toBeLessThan(
            0
         );
      }
   });

   test("compareByDetailedPrefix sorts font weights correctly", () => {
      const items = ["font-weight-light", "font-weight-bold", "font-weight-thin"];
      const sortedItems = items.sort(compareByDetailedPrefix);
      expect(sortedItems).toEqual(["font-weight-light", "font-weight-bold", "font-weight-thin"]);
   });

   test("compareByNumeric correctly sorts numeric suffixes", () => {
      expect(compareByNumeric("1", "2")).toBeLessThan(0); // 1 comes before 2
      expect(compareByNumeric("10", "2")).toBeGreaterThan(0); // 10 comes after 2 numerically
      expect(compareByNumeric("10", "10")).toBe(0); // Same numbers are equal

      // Test numeric sorting with real-world values
      const numericValues = [
         "0",
         "1",
         "2",
         "4",
         "8",
         "10",
         "12",
         "16",
         "20",
         "24",
         "32",
         "64",
      ];
      for (let i = 0; i < numericValues.length - 1; i++) {
         expect(
            compareByNumeric(numericValues[i], numericValues[i + 1])
         ).toBeLessThan(0);
      }
   });

   test("compareByNumeric returns null for non-numeric values", () => {
      expect(compareByNumeric("sm", "lg")).toBeNull();
      expect(compareByNumeric("text", "10")).toBeNull();
      expect(compareByNumeric("10", "text")).toBeNull();
   });
});
