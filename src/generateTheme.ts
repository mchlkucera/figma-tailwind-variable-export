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
 * Determines if a variable should be filtered based on the export options
 */
const shouldFilterVariable = (
   cssName: string,
   firstWord: string,
   options: GenerateThemeOptions = {}
) => {
   // Skip if the option is not enabled in exportOptions
   if (options.exportOptions) {
      // Check for font families specifically - these are specific name patterns
      if (
         options.ignoreFontFamilies ||
         (options.exportOptions.font === false &&
            (cssName === "font-accent" ||
               cssName === "font-body" ||
               cssName === "font-test" ||
               cssName.startsWith("font-family-")))
      ) {
         return true;
      }

      // Filter by category
      if (
         (firstWord === "color" && options.exportOptions.color === false) ||
         (firstWord === "spacing" && options.exportOptions.spacing === false) ||
         (firstWord === "radius" && options.exportOptions.radius === false) ||
         (firstWord === "border" && options.exportOptions.border === false) ||
         (firstWord === "breakpoint" &&
            options.exportOptions.breakpoint === false) ||
         (firstWord === "text" && options.exportOptions.textSize === false) ||
         (firstWord === "leading" && options.exportOptions.leading === false) ||
         (cssName.startsWith("font-letter-spacing") &&
            options.exportOptions.fontSpacing === false) ||
         (cssName.startsWith("font-weight") &&
            options.exportOptions.fontWeight === false)
      ) {
         return true;
      }
   }

   return false;
};

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

         // Skip variables with DEPRECATED prefix if the option is enabled
         if (
            options.ignoreDeprecated &&
            (variable.name.toUpperCase().includes("DEPRECATED") ||
               variable.name.includes("DEPRECTED")) // Handle possible typo in variable names
         ) {
            continue;
         }

         // Check if the variable should be filtered based on export options
         if (shouldFilterVariable(cssName, firstWord, options)) {
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
