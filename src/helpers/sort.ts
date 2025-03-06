import { getSuffix, undefined, getSizeOrder } from ".";
import { ColorVariableWithValues } from "../types";
import { SIZE_ORDER } from "../constants";


export const sortVariables = (variables: ColorVariableWithValues[]): ColorVariableWithValues[] => {
   return variables.sort((a, b) => {
      const nameA = a.cssName;
      const nameB = b.cssName;

      const suffixA = getSuffix(nameA);
      const suffixB = getSuffix(nameB);

      const beforeSuffixA = nameA.slice(0, -suffixA.length || undefined).replace(/-$/, '');
      const beforeSuffixB = nameB.slice(0, -suffixB.length || undefined).replace(/-$/, '');

      const prefixComparison = beforeSuffixA.localeCompare(beforeSuffixB);
      if (prefixComparison !== 0) {
         return prefixComparison;
      }

      const hasSizeSuffixA = SIZE_ORDER.includes(suffixA);
      const hasSizeSuffixB = SIZE_ORDER.includes(suffixB);

      if (hasSizeSuffixA && hasSizeSuffixB) {
         return getSizeOrder(suffixA) - getSizeOrder(suffixB);
      }

      const numA = parseFloat(suffixA);
      const numB = parseFloat(suffixB);

      if (!isNaN(numA) && !isNaN(numB)) {
         return numA - numB;
      }

      return suffixA.localeCompare(suffixB);
   });
};
