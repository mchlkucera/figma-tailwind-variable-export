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
      [key: string]: ValueByMode;
   };
};
export type ColorCollection = {
   name: string;
   variables: ColorVariable[];
};
