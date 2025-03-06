import { ColorVariable, ColorVariableWithValues } from "../types";
import { getSuffix } from ".";
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
      return `${suffix}-${withoutSuffix}`;
   }

   return `${sanitized}`;
};

export const generateCssOutput = (
   cssList: ColorVariableWithValues[]
): string => {
   const cssLines: string[] = [];

   cssLines.push("@theme {");

   for (const css of cssList) {
      cssLines.push(`  --${css.cssName}: ${css.value};`);
   }

   cssLines.push("}");

   return cssLines.join("\n");
};

export const createCssVariableNameReference = (variable: string): string => {
   return `var(--${variable})`
}