import { ALLOWED_PREFIXES } from "./constants";

// Compatible with both RGB and RGBA types
export type ColorValue = {
   r: number;
   g: number;
   b: number;
   a?: number;
};
type VariableAlias = {
   type: "VARIABLE_ALIAS";
   id: string;
};

export type VariableValue =
   | ColorValue
   | VariableAlias
   | string
   | number
   | boolean;
export type ValueByMode = ColorValue | VariableAlias;

export type ColorVariable = {
   id: string;
   name: string;
   resolvedType: string;
   valuesByMode: {
      [key: string]: VariableValue;
   };
};
export type ColorCollection = {
   name: string;
   variables: ColorVariable[];
};

export type ColorVariableWithValues = ColorVariable & {
   resolvedValue: string | number;
   cssName: string;
};

export type VariableMap = Map<string, ColorVariableWithValues>;
export type TempVariableMap = Map<
   string,
   Omit<ColorVariableWithValues, "resolvedValue"> & {
      variableValue: VariableValue;
   }
>;

export type CssVariable = {
   name: string;
   value: VariableValue;
};

export type AllowedPrefix = (typeof ALLOWED_PREFIXES)[number];

export interface GenerateThemeOptions {
   ignoreFontFamilies?: boolean;
}
