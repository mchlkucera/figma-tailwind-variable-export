import { ColorValue, ColorVariable } from "../types";
import { SIZE_ORDER } from "../constants";
import { isRgbaValue, isHexValue } from "./typeGuards";

export * from "./css";

const toHex = (n: number) => {
   const scaled = Math.round(n * 255);
   return scaled.toString(16).padStart(2, "0");
};

export const rgbaToHex = ({ r, g, b, a = 1 }: ColorValue): string => {
   // If alpha is 1, return standard hex
   if (a === 1) {
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
   }
   // Otherwise include alpha channel
   return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
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

export const formatNumberValue = (value: number, cssName?: string): string => {
   const formattedValue = Number(value.toFixed(1));
   // Don't add px suffix for font-weight variables
   if (cssName && cssName.startsWith("font-weight")) {
      return `${formattedValue}`;
   }
   return `${formattedValue}px`;
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

export const transformSpacingValue = (name: string): string => {
   // Check if it's a spacing variable with a hyphenated decimal pattern (like spacing-0-5)
   const spacingDecimalRegex = /^spacing-(\d+)-(\d+)$/;
   const match = name.match(spacingDecimalRegex);

   if (match) {
      const wholePart = match[1];
      const decimalPart = match[2];
      return `spacing-${wholePart}.${decimalPart}`;
   }

   return name;
};

// Extract numeric part of spacing variable for sorting
export const getSpacingValue = (name: string): number => {
   // First try to extract decimal values (e.g., spacing-0.5)
   const decimalMatch = name.match(/^spacing-(\d+\.\d+)$/);
   if (decimalMatch) {
      return parseFloat(decimalMatch[1]);
   }

   // Try to extract hyphenated decimal values (e.g., spacing-0-5)
   const hyphenatedMatch = name.match(/^spacing-(\d+)-(\d+)$/);
   if (hyphenatedMatch) {
      return parseFloat(`${hyphenatedMatch[1]}.${hyphenatedMatch[2]}`);
   }

   // Handle px special case
   if (name === "spacing-px") {
      return 0.25; // Place between 0 and 0.5
   }

   // Handle regular integer values (e.g., spacing-4)
   const intMatch = name.match(/^spacing-(\d+)$/);
   if (intMatch) {
      return parseInt(intMatch[1], 10);
   }

   return 999; // Default high value for unknown formats
};

export const getFirstWord = (name: string): string => {
   return name.split("-")[0];
};
