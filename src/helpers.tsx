import { ColorValue, ValueByMode, ColorVariable, VariableMap, ColorVariableWithValues, CssVariable } from "./types";

export function rgbaToHex({ r, g, b }: ColorValue): string {
   const toHex = (n: number) => {
      const scaled = Math.round(n * 255);
      return scaled.toString(16).padStart(2, "0");
   };
   return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function isVariableAlias(value: any): value is VariableAlias {
   return value && value.type === "VARIABLE_ALIAS";
}

export function isNumberValue(value: any): value is number {
   return Number.isFinite(Number(value));
}

function isHexValue(value: any): value is string {
   return (
      typeof value === "string" &&
      value.startsWith("#") &&
      (value.length === 7 || value.length === 4 || value.length === 9)
   );
}

function isRgbaValue(value: any): value is ColorValue {
   return (
      typeof value.r === "number" &&
      typeof value.g === "number" &&
      typeof value.b === "number" &&
      typeof value.a === "number"
   );
}

export function isColorValue(value: any): value is ColorValue {
   if (!value) {
      return false;
   }

   if (isRgbaValue(value)) {
      return true;
   }

   if (isHexValue(value)) {
      return true;
   }

   return false;
}

export function formatColorValue(value: ColorValue): string {
   if (isRgbaValue(value)) {
      return rgbaToHex(value);
   }

   if (isHexValue(value)) {
      return value;
   }

   throw new Error(`Unsupported value type: ${typeof value}`);
}

export function formatStringValue(value: string): string {
   return `"${value}"`;
}

export function formatNumberValue(value: number): string {
   return Number(Number(value).toFixed(1)).toString();
}

export function isStringValue(value: any): value is string {
   return typeof value === "string";
}

export function getFirstModeKey(
   valuesByMode: ColorVariable["valuesByMode"]
): string | undefined {
   return Object.keys(valuesByMode)[0];
}

export const ALLOWED_PREFIXES = [
    'text',
    'breakpoint',
    'spacing',
    'radius',
    'border',
    'font',
    'color',
    'font-weight',
    'tracking',
    'leading',
    'container',
    'shadow',
    'inset-shadow',
    'drop-shadow',
    'blur',
    'perspective',
    'aspect',
    'ease',
    'animate'
] as const;

export type AllowedPrefix = typeof ALLOWED_PREFIXES[number];

export function generateCssVariableNameWithoutDoubleSlash(variable: ColorVariable): string {
   const sanitized = variable.name.replace(/[\/ ]/g, "-")
   const suffix = getSuffix(sanitized)

   if (variable.resolvedType === "COLOR") {
      return `color-${sanitized}`;
   }

   if (ALLOWED_PREFIXES.includes(suffix as AllowedPrefix)) {
      const withoutSuffix = sanitized.slice(0, -suffix.length || undefined).replace(/-$/, '');
      return `${suffix}-${withoutSuffix}`;
   }
   
   return `${sanitized}`;
}


export function sortVariables(variables: ColorVariableWithValues[]): ColorVariableWithValues[] {
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
}

export function sortSemantics(variables: ColorVariable[]): ColorVariable[] {
   return variables.sort((a, b) => a.name.localeCompare(b.name));
}

export function formatFontFamily(value: string): string {
   return value.replace(/^["']|["']$/g, ""); // Remove surrounding quotes
}

export function formatSpacingKey(key: string): string {
   return key.replace(/(\d+)-(\d+)/, "$1.$2"); // Convert "0-5" to "0.5"
}

export function cleanVariableName(name: string): string {
   const [category, ...rest] = name.split("/");
   return rest
      .join("-")
      .replace(/^(size-|family-|weight-|letter-spacing-)/, "")
      .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

function getPrefix(name: string): string {
   return name.match(/^[^0-9-]+|^[^-]+-/)?.[0] || name;
}

function extractNumber(name: string): number {
   return parseFloat(name.replace(/[^0-9.]/g, "")) || 0;
}

function compareByPrefix(nameA: string, nameB: string): number {
   const prefixA = getPrefix(nameA);
   const prefixB = getPrefix(nameB);
   return prefixA.localeCompare(prefixB);
}

function compareByNumber(nameA: string, nameB: string): number {
   const numA = extractNumber(nameA);
   const numB = extractNumber(nameB);

   if (numA === numB) {
      return nameA.localeCompare(nameB);
   }
   return numA - numB;
}

const SIZE_ORDER = [
   "xxs",
   "xs",
   "sm",
   "default",
   "base",
   "md",
   "lg",
   "xl",
   "2xl",
   "3xl",
   "4xl",
   "5xl",
];

function getSizeOrder(size: string): number {
   return SIZE_ORDER.indexOf(size);
}

function getSuffix(name: string): string {
   const match = name.match(/-([^-]+)$/);
   return match ? match[1] : "";
}

export function getFirstWord(name: string): string {
   return name.split('-')[0]
}


const generateCssOutput = (cssList: ColorVariableWithValues[]) => {
   const cssLines: string[] = []

   cssLines.push("@theme {");
   
   for (const css of cssList) {
      cssLines.push(`  --${css.cssName}: ${css.value};`);
   }

   cssLines.push("}");

   return cssLines.join("\n");
}

export const generateTailwindTheme = (variables: VariableMap  ) => {

   const variablesArray = Array.from(variables.values());
   const sortedCssList = sortVariables(variablesArray);

   return generateCssOutput(sortedCssList);

};
