import { ColorValue, ValueByMode, ColorVariable } from "./types";

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

export function isColorValue(value: any): value is ColorValue {
   return (
      value &&
      typeof value.r === "number" &&
      typeof value.g === "number" &&
      typeof value.b === "number" &&
      typeof value.a === "number"
   );
}

export function getFirstModeKey(valuesByMode: {
   [key: string]: ValueByMode;
}): string | undefined {
   return Object.keys(valuesByMode)[0];
}

export function generateCssColorVariableName(name: string): string {
   return `--color-${name.replace(/\//g, "-")}`;
}

export function generateCssVariableName(name: string): string {
   return `--${name.replace(/[\/ ]/g, "-")}`;
}

export function sortPrimitives(variables: ColorVariable[]): ColorVariable[] {
   return variables.sort((a, b) => {
      const nameComparison = a.name.localeCompare(b.name);
      if (nameComparison !== 0) return nameComparison;

      const numA = parseInt(a.name.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.name.match(/\d+/)?.[0] || "0");
      return numA - numB;
   });
}

export function sortSemantics(variables: ColorVariable[]): ColorVariable[] {
   return variables.sort((a, b) => a.name.localeCompare(b.name));
}

export function resolveVariableValue(
   value: ValueByMode,
   variablesById: Map<string, ColorVariable>
): ValueByMode | null {
   let currentValue = value;
   const visited = new Set<string>();
   while (isVariableAlias(currentValue)) {
      if (visited.has(currentValue.id)) {
         // Circular reference detected
         return null;
      }
      visited.add(currentValue.id);
      const variable = variablesById.get(currentValue.id);
      if (!variable) return null;
      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return null;
      currentValue = variable.valuesByMode[modeKey];
   }
   return currentValue;
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
