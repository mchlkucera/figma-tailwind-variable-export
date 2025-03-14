import { ColorVariableWithValues } from "../types";
import { SIZE_ORDER } from "../constants";
import { getSuffix } from "../helpers";

const getSizeOrder = (size: string): number => {
   const index = SIZE_ORDER.indexOf(size.toLowerCase() as any);
   return index === -1 ? 999 : index;
};

export const sortVariables = (variables: ColorVariableWithValues[]): ColorVariableWithValues[] => {
   return variables.sort((a, b) => {
      const nameA = a.cssName;
      const nameB = b.cssName;

      const suffixA = getSuffix(nameA);
      const suffixB = getSuffix(nameB);

      const beforeSuffixA = nameA.slice(0, -suffixA.length || undefined).replace(/-$/, '');
      const beforeSuffixB = nameB.slice(0, -suffixB.length || undefined).replace(/-$/, '');

      if (beforeSuffixA !== beforeSuffixB) {
         return beforeSuffixA.localeCompare(beforeSuffixB);
      }

      const sizeOrderA = getSizeOrder(suffixA);
      const sizeOrderB = getSizeOrder(suffixB);

      if (sizeOrderA !== 999 || sizeOrderB !== 999) {
         return sizeOrderA - sizeOrderB;
      }

      const numA = parseFloat(suffixA);
      const numB = parseFloat(suffixB);

      if (!isNaN(numA) && !isNaN(numB)) {
         return numA - numB;
      }

      return suffixA.localeCompare(suffixB);
   });
};
