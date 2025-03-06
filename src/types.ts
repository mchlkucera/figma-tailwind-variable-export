import { ColorVariable } from "./types";

export type ColorValue = {
   r: number;
   g: number;
   b: number;
   a: number;
};
type VariableAlias = {
   type: "VARIABLE_ALIAS";
   id: string;
};

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
    value: string | number;
    cssName: string;
};

export type VariableMap = Map<string, ColorVariableWithValues>;

export type CssVariable = {
   name: string;
   value: VariableValue;
}