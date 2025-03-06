import { ColorValue } from "../types";


export const isVariableAlias = (value: any): value is VariableAlias => {
   return value && value.type === "VARIABLE_ALIAS";
};

export const isNumberValue = (value: any): value is number => {
   return Number.isFinite(Number(value));
};

export const isHexValue = (value: any): value is string => {
   return (
      typeof value === "string" &&
      value.startsWith("#") &&
      (value.length === 7 || value.length === 4 || value.length === 9)
   );
};

export const isRgbaValue = (value: any): value is ColorValue => {
   return (
      typeof value.r === "number" &&
      typeof value.g === "number" &&
      typeof value.b === "number" &&
      typeof value.a === "number"
   );
};

export const isColorValue = (value: any): value is ColorValue => {
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
};
