import { ColorVariableWithValues } from "../types";
import { SIZE_ORDER } from "../constants";
import { getSuffix } from "../helpers";

const getSizeOrder = (size: string): number => {
   const index = SIZE_ORDER.indexOf(size.toLowerCase() as any);
   return index === -1 ? 999 : index;
};

const isSizeVariable = (name: string): boolean => {
   const parts = name.split('-');
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
   
   const beforeSuffixA = nameA.slice(0, -suffixA.length || undefined).replace(/-$/, '');
   const beforeSuffixB = nameB.slice(0, -suffixB.length || undefined).replace(/-$/, '');
   
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

const sortVariablesByType = (variables: ColorVariableWithValues[]): ColorVariableWithValues[] => {
   const sizeVars = variables.filter(v => isSizeVariable(v.cssName));
   const otherVars = variables.filter(v => !isSizeVariable(v.cssName));
   
   const sortedSizeVars = [...sizeVars].sort((a, b) => {
      return compareBySize(getSuffix(a.cssName), getSuffix(b.cssName));
   });
   
   const sortedOtherVars = [...otherVars].sort((a, b) => {
      const nameA = a.cssName;
      const nameB = b.cssName;
      const suffixA = getSuffix(nameA);
      const suffixB = getSuffix(nameB);
      
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
   
   return [...sortedSizeVars, ...sortedOtherVars];
};

export const sortVariables = (variables: ColorVariableWithValues[]): ColorVariableWithValues[] => {
   const grouped = new Map<string, ColorVariableWithValues[]>();
   
   variables.forEach(variable => {
      const prefix = variable.cssName.split('-')[0];
      if (!grouped.has(prefix)) {
         grouped.set(prefix, []);
      }
      grouped.get(prefix)?.push(variable);
   });
   
   const result: ColorVariableWithValues[] = [];
   
   for (const [_, group] of Array.from(grouped.entries())) {
      result.push(...sortVariablesByType(group));
   }
   
   return result;
};
