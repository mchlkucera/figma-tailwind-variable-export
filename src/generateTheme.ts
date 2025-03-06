import { ColorCollection, ColorVariable, ColorVariableWithValues, VariableMap } from "./types";
import {
   formatColorValue,
   formatNumberValue,
   formatStringValue,
   generateCssVariableNameWithoutDoubleSlash,
   generateTailwindTheme,
   getFirstModeKey,
   isColorValue,
   isNumberValue,
   isStringValue,
   isVariableAlias,
   rgbaToHex,
   sortVariableMap,
   sortVariables,
} from "./utils";

const createVariableMap = (collections: ColorCollection[]) => {
   const variableMap: VariableMap = new Map();

   for (const collection of collections) {
      for (const variable of collection.variables) {
         const modeKey = getFirstModeKey(variable.valuesByMode);
         if (!modeKey) continue;

         const cssName = generateCssVariableNameWithoutDoubleSlash(variable)

         let value = variable.valuesByMode[modeKey];

         let returnedValue: string | number;

         if (isVariableAlias(value)) {
            const referencedVariable = variableMap.get(value.id);

            if (!referencedVariable?.value) {
               continue;
            }

            returnedValue = `var(--${referencedVariable.cssName})`;
         }

         else if (isNumberValue(value)) {
            returnedValue = formatNumberValue(value);
         } else if (isColorValue(value)) {
            returnedValue = formatColorValue(value);
         } else if (isStringValue(value)) {
            returnedValue = formatStringValue(value);
         } else {
            throw new Error(`Unsupported value type: ${typeof value}`);
         }

         variableMap.set(variable.id, {
             value: returnedValue,
             cssName,
            ...variable,
         });
      }
   }

   return variableMap;
};


const generateTheme = (collections: ColorCollection[]) => {
   const variableMap = createVariableMap(collections);
   const generatedTheme = generateTailwindTheme(variableMap);

   return generatedTheme;
};

export default generateTheme;
