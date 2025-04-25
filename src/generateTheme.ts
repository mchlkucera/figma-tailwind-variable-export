import {
   ColorCollection,
   VariableMap,
   TempVariableMap,
   GenerateThemeOptions,
} from "./types";
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

/**
 * Collects all variables from collections into a temporary map
 * for later reference resolution
 */
const collectAllVariablesValues = (
   collections: ColorCollection[],
   options: GenerateThemeOptions = {}
) => {
   const tempMap: TempVariableMap = new Map();
   const errors: string[] = [];

   for (const collection of collections) {
      for (const variable of collection.variables) {
         const modeKey = getFirstModeKey(variable.valuesByMode);
         if (!modeKey) continue;

         const cssName = generateCssVariableNameWithoutDoubleSlash(variable);
         const firstWord = getFirstWord(cssName);

         // Skip font family variables if the option is enabled
         if (
            options.ignoreFontFamilies &&
            firstWord === "font" &&
            (cssName === "font-test" ||
               cssName === "font-accent" ||
               cssName === "font-body")
         ) {
            continue;
         }

         if (!ALLOWED_PREFIXES.includes(firstWord as AllowedPrefix)) {
            errors.push(
               `${variable.name} has a prefix that is not allowed: ${firstWord}`
            );
            continue;
         }

         const rawValue = variable.valuesByMode[modeKey];

         tempMap.set(variable.id, {
            variableValue: rawValue,
            cssName,
            ...variable,
         });
      }
   }

   return { tempMap, errors };
};

/**
 * Resolves all variable values, including references to other variables
 */
const resolveVariableValues = (tempMap: TempVariableMap) => {
   const variableMap: VariableMap = new Map();
   const errors: string[] = [];

   for (const [id, tempVariable] of Array.from(tempMap)) {
      const variableValue = tempVariable.variableValue;
      let resolvedValue: string | number;

      if (isVariableAlias(variableValue)) {
         const referencedVariable = tempMap.get(variableValue.id);

         if (!referencedVariable) {
            errors.push(
               `Referenced variable not found for ${tempVariable.name}`
            );
            continue;
         }

         resolvedValue = createCssVariableNameReference(
            referencedVariable.cssName
         );
      } else if (isNumberValue(variableValue)) {
         resolvedValue = formatNumberValue(variableValue, tempVariable.cssName);
      } else if (isColorValue(variableValue)) {
         resolvedValue = formatColorValue(variableValue);
      } else if (isStringValue(variableValue)) {
         resolvedValue = formatStringValue(variableValue);
      } else {
         errors.push(
            `Unsupported value type for ${
               tempVariable.name
            }: ${typeof variableValue}`
         );
         continue;
      }

      variableMap.set(id, {
         ...tempVariable,
         resolvedValue: resolvedValue,
      });
   }

   return { variableMap, errors };
};

const createVariableMap = (
   collections: ColorCollection[],
   options: GenerateThemeOptions = {}
) => {
   const { tempMap, errors: collectionErrors } = collectAllVariablesValues(
      collections,
      options
   );
   const { variableMap, errors: resolutionErrors } =
      resolveVariableValues(tempMap);
   const errors = [...collectionErrors, ...resolutionErrors];

   return { variableMap, errors };
};

const generateTheme = (
   collections: ColorCollection[],
   options: GenerateThemeOptions = {}
) => {
   const { variableMap, errors } = createVariableMap(collections, options);
   const variablesArray = Array.from(variableMap.values());
   const sortedCssList = sortVariables(variablesArray);
   const cssOutput = generateCssOutput(sortedCssList);

   return { cssOutput, errors };
};

export default generateTheme;
