import { ColorVariable, ColorVariableWithValues } from "../types";
import { getFirstWord, getSuffix, transformSpacingValue } from ".";
import { AllowedPrefix } from "../types";
import { ALLOWED_PREFIXES } from "../constants";

export const generateCssVariableNameWithoutDoubleSlash = (
   variable: ColorVariable
): string => {
   const sanitized = variable.name.replace(/[\/ ]/g, "-");
   const suffix = getSuffix(sanitized);

   if (variable.resolvedType === "COLOR") {
      return `color-${sanitized}`;
   }

   if (ALLOWED_PREFIXES.includes(suffix as AllowedPrefix)) {
      const withoutSuffix = sanitized
         .slice(0, -suffix.length || undefined)
         .replace(/-$/, "");
      const cssName = `${suffix}-${withoutSuffix}`;

      return cssName;
   }

   return `${sanitized}`;
};

const shouldCompareSecondWord = (compareWord: string, cssName: string) => {
   return (
      (compareWord === "color" || compareWord === "font") &&
      cssName.split("-").length > 2
   );
};

const getSecondWord = (compareWord: string, cssName: string) => {
   return getFirstWord(cssName.slice(compareWord.length + 1));
};

export const generateCssOutput = (
   cssList: ColorVariableWithValues[]
): string => {
   const cssLines: string[] = [];
   let lastCompareWord: string | undefined = undefined;

   cssLines.push("@theme {");

   for (const css of cssList) {
      let compareWord = getFirstWord(css.cssName);

      if (shouldCompareSecondWord(compareWord, css.cssName)) {
         compareWord = getSecondWord(compareWord, css.cssName);
      }

      if (compareWord !== lastCompareWord && lastCompareWord !== undefined) {
         cssLines.push("");
      }

      // Apply spacing transformation here - this ensures it's applied at the time of CSS output
      const transformedCssName =
         compareWord === "spacing"
            ? transformSpacingValue(css.cssName)
            : css.cssName;

      cssLines.push(`  --${transformedCssName}: ${css.resolvedValue};`);

      lastCompareWord = compareWord;
   }

   cssLines.push("}");

   return cssLines.join("\n");
};

export const createCssVariableNameReference = (variable: string): string => {
   return `var(--${variable})`;
};
