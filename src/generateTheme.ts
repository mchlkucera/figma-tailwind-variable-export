import { ColorCollection, VariableMap } from "./types";
import {
   formatColorValue,
   formatNumberValue,
   formatStringValue,
   getFirstModeKey,
   getFirstWord,
   isStringValue,
} from "./helpers";
import {
   isColorValue,
   isNumberValue,
   isVariableAlias,
} from "./helpers/typeGuards";
import { sortVariables } from "./helpers/sort";
import {
   createCssVariableNameReference,
   generateCssOutput,
} from "./helpers/css";
import { generateCssVariableNameWithoutDoubleSlash } from "./helpers/css";
import { AllowedPrefix } from "./types";
import { ALLOWED_PREFIXES } from "./constants";

const createVariableMap = (collections: ColorCollection[]) => {
   const variableMap: VariableMap = new Map();
   const errors: string[] = [];

   for (const collection of collections) {
      for (const variable of collection.variables) {
         const modeKey = getFirstModeKey(variable.valuesByMode);
         if (!modeKey) continue;

         const cssName = generateCssVariableNameWithoutDoubleSlash(variable);
         const firstWord = getFirstWord(cssName);

         if (!ALLOWED_PREFIXES.includes(firstWord as AllowedPrefix)) {
            errors.push(
               `${variable.name} has a prefix that is not allowed: ${firstWord}`
            );
            continue;
         }

         let value = variable.valuesByMode[modeKey];
         let returnedValue: string | number;

         if (isVariableAlias(value)) {
            const referencedVariable = variableMap.get(value.id);

            if (!referencedVariable?.value) {
               continue;
            }

            returnedValue = createCssVariableNameReference(
               referencedVariable.cssName
            );
         } else if (isNumberValue(value)) {
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

   return { variableMap, errors };
};

const generateTheme = (collections: ColorCollection[]) => {
   const { variableMap, errors } = createVariableMap(collections);
   const variablesArray = Array.from(variableMap.values());
   const sortedCssList = sortVariables(variablesArray);
   const cssOutput = generateCssOutput(sortedCssList);

   return { cssOutput, errors };
};

export default generateTheme;
