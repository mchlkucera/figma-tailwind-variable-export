import {
   ColorValue,
   ColorVariable,
} from "../types";
import { SIZE_ORDER } from "../constants";
import { isRgbaValue, isHexValue } from "./typeGuards";

export * from "./css";

const toHex = (n: number) => {
   const scaled = Math.round(n * 255);
   return scaled.toString(16).padStart(2, "0");
};

export const rgbaToHex = ({ r, g, b }: ColorValue): string => {
   return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const formatColorValue = (value: ColorValue): string => {
   if (isRgbaValue(value)) {
      return rgbaToHex(value);
   }

   if (isHexValue(value)) {
      return value;
   }

   throw new Error(`Unsupported value type: ${typeof value}`);
};

export const formatStringValue = (value: string): string => {
   return `"${value}"`;
};

export const formatNumberValue = (value: number): string => {
   return Number(Number(value).toFixed(1)).toString();
};

export const isStringValue = (value: any): value is string => {
   return typeof value === "string";
};

export const getFirstModeKey = (
   valuesByMode: ColorVariable["valuesByMode"]
): string | undefined => {
   return Object.keys(valuesByMode)[0];
};

export const getPrefix = (name: string): string => {
   return name.match(/^[^0-9-]+|^[^-]+-/)?.[0] || name;
};

export const extractNumber = (name: string): number => {
   return parseFloat(name.replace(/[^0-9.]/g, "")) || 0;
};

export const getSizeOrder = (size: string): number => {
   return SIZE_ORDER.indexOf(size);
};

export const getSuffix = (name: string): string => {
   const match = name.match(/-([^-]+)$/);
   return match ? match[1] : "";
};

export const getFirstWord = (name: string): string => {
   return name.split("-")[0];
};
