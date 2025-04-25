import { ColorVariableWithValues } from "../types";
import { SIZE_ORDER } from "../constants";
import { getSuffix, getSpacingValue } from "../helpers";

// Base colors come before derived semantic colors
const BASE_COLORS = [
   "color-base-",
   "color-brand-",
   "color-gray-",
   "color-green-",
   "color-orange-",
   "color-primary-",
   "color-red-",
   "color-secondary-",
   "color-white-alpha-",
];

// Derived semantic colors come after base colors
const DERIVED_COLORS = [
   "color-availability-",
   "color-background-",
   "color-badge-",
   "color-border-",
   "color-button-",
   "color-fill-",
   "color-flash-message-",
   "color-footer-",
   "color-icon-",
   "color-input-",
   "color-link-",
   "color-opening-status-",
   "color-price-",
   "color-table-",
   "color-tag-",
   "color-text-",
];

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

/**
 * Check if a variable's resolved value is a reference to another variable
 */
const isVariableReference = (variable: ColorVariableWithValues): boolean => {
   return (
      typeof variable.resolvedValue === "string" &&
      variable.resolvedValue.startsWith("var(--")
   );
};

/**
 * Check if a variable is a base color (not a semantic/derived color)
 */
const isBaseColor = (cssName: string): boolean => {
   return BASE_COLORS.some((prefix) => cssName.startsWith(prefix));
};

/**
 * Check if a variable is a derived semantic color
 */
const isDerivedColor = (cssName: string): boolean => {
   return DERIVED_COLORS.some((prefix) => cssName.startsWith(prefix));
};

// Main sorting function for variables within the same group
const sortVariablesByType = (
   variables: ColorVariableWithValues[]
): ColorVariableWithValues[] => {
   // Special case for color variables - separate base colors and derived colors
   if (variables.length > 0 && variables[0].cssName.startsWith("color-")) {
      // First divide all color variables into base and derived categories
      const baseColorVars = variables.filter((v) => isBaseColor(v.cssName));
      const derivedColorVars = variables.filter((v) =>
         isDerivedColor(v.cssName)
      );
      const otherColorVars = variables.filter(
         (v) => !isBaseColor(v.cssName) && !isDerivedColor(v.cssName)
      );

      // For each category, separate literal values from references
      const baseColorLiterals = baseColorVars.filter(
         (v) => !isVariableReference(v)
      );
      const baseColorRefs = baseColorVars.filter((v) => isVariableReference(v));

      const derivedColorLiterals = derivedColorVars.filter(
         (v) => !isVariableReference(v)
      );
      const derivedColorRefs = derivedColorVars.filter((v) =>
         isVariableReference(v)
      );

      const otherColorLiterals = otherColorVars.filter(
         (v) => !isVariableReference(v)
      );
      const otherColorRefs = otherColorVars.filter((v) =>
         isVariableReference(v)
      );

      // Sort each subcategory
      const sortColorGroup = (vars: ColorVariableWithValues[]) => {
         return [...vars].sort((a, b) => {
            const nameA = a.cssName;
            const nameB = b.cssName;
            const suffixA = getSuffix(nameA);
            const suffixB = getSuffix(nameB);

            const detailedPrefixComparison = compareByDetailedPrefix(
               nameA,
               nameB
            );
            if (detailedPrefixComparison !== 0) {
               return detailedPrefixComparison;
            }

            const numericComparison = compareByNumeric(suffixA, suffixB);
            if (numericComparison !== null) {
               return numericComparison;
            }

            return suffixA.localeCompare(suffixB);
         });
      };

      // Sort all subcategories
      const sortedBaseColorLiterals = sortColorGroup(baseColorLiterals);
      const sortedBaseColorRefs = sortColorGroup(baseColorRefs);
      const sortedDerivedColorLiterals = sortColorGroup(derivedColorLiterals);
      const sortedDerivedColorRefs = sortColorGroup(derivedColorRefs);
      const sortedOtherColorLiterals = sortColorGroup(otherColorLiterals);
      const sortedOtherColorRefs = sortColorGroup(otherColorRefs);

      // Return all categories in the desired order
      return [
         ...sortedBaseColorLiterals,
         ...sortedBaseColorRefs,
         ...sortedOtherColorLiterals,
         ...sortedOtherColorRefs,
         ...sortedDerivedColorLiterals,
         ...sortedDerivedColorRefs,
      ];
   }

   // For non-color variables, use our existing algorithm
   // First divide variables into those with literal values and those with references
   const literalVars = variables.filter((v) => !isVariableReference(v));
   const referenceVars = variables.filter((v) => isVariableReference(v));

   // Further sort literals by size variables and others
   const sizeLiteralVars = literalVars.filter((v) => isSizeVariable(v.cssName));
   const otherLiteralVars = literalVars.filter(
      (v) => !isSizeVariable(v.cssName)
   );

   // Sort size variables by the SIZE_ORDER
   const sortedSizeLiteralVars = [...sizeLiteralVars].sort((a, b) => {
      return compareBySize(getSuffix(a.cssName), getSuffix(b.cssName));
   });

   // Sort other literal variables with more complex logic
   const sortedOtherLiteralVars = [...otherLiteralVars].sort((a, b) => {
      const nameA = a.cssName;
      const nameB = b.cssName;
      const suffixA = getSuffix(nameA);
      const suffixB = getSuffix(nameB);

      // Special handling for spacing variables - sort numerically
      if (nameA.startsWith("spacing-") && nameB.startsWith("spacing-")) {
         const valueA = getSpacingValue(nameA);
         const valueB = getSpacingValue(nameB);
         return valueA - valueB;
      }

      const detailedPrefixComparison = compareByDetailedPrefix(nameA, nameB);
      if (detailedPrefixComparison !== 0) {
         return detailedPrefixComparison;
      }

      const numericComparison = compareByNumeric(suffixA, suffixB);
      if (numericComparison !== null) {
         return numericComparison;
      }

      return suffixA.localeCompare(suffixB);
   });

   // Sort reference variables similarly to literal vars
   const sortedReferenceVars = [...referenceVars].sort((a, b) => {
      const nameA = a.cssName;
      const nameB = b.cssName;
      const suffixA = getSuffix(nameA);
      const suffixB = getSuffix(nameB);

      // Special handling for spacing variables - sort numerically
      if (nameA.startsWith("spacing-") && nameB.startsWith("spacing-")) {
         const valueA = getSpacingValue(nameA);
         const valueB = getSpacingValue(nameB);
         return valueA - valueB;
      }

      const detailedPrefixComparison = compareByDetailedPrefix(nameA, nameB);
      if (detailedPrefixComparison !== 0) {
         return detailedPrefixComparison;
      }

      const numericComparison = compareByNumeric(suffixA, suffixB);
      if (numericComparison !== null) {
         return numericComparison;
      }

      return suffixA.localeCompare(suffixB);
   });

   // Combine all sorted groups, with literal values first, then references
   return [
      ...sortedSizeLiteralVars,
      ...sortedOtherLiteralVars,
      ...sortedReferenceVars,
   ];
};

export const sortVariables = (
   variables: ColorVariableWithValues[]
): ColorVariableWithValues[] => {
   // First, separate color variables from others
   const colorVars = variables.filter((v) => v.cssName.startsWith("color-"));
   const nonColorVars = variables.filter(
      (v) => !v.cssName.startsWith("color-")
   );

   // For non-color variables, group by prefix and sort normally
   const grouped = new Map<string, ColorVariableWithValues[]>();

   nonColorVars.forEach((variable) => {
      const prefix = variable.cssName.split("-")[0];
      if (!grouped.has(prefix)) {
         grouped.set(prefix, []);
      }
      grouped.get(prefix)?.push(variable);
   });

   const result: ColorVariableWithValues[] = [];

   // Sort each non-color group individually
   for (const [_, group] of Array.from(grouped.entries())) {
      result.push(...sortVariablesByType(group));
   }

   // For color variables, sort them as a single group
   // This ensures base colors come before semantic colors
   if (colorVars.length > 0) {
      const sortedColorVars = sortVariablesByType(colorVars);
      result.push(...sortedColorVars);
   }

   return result;
};
