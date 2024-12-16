import {
   Button,
   Container,
   render,
   VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import Editor from "@monaco-editor/react";
import {
   generateCssColorVariableName,
   getFirstModeKey,
   isColorValue,
   isVariableAlias,
   cleanVariableName,
   rgbaToHex,
   sortPrimitives,
   formatFontFamily,
   formatSpacingKey,
   generateCssVariableName,
} from "./utils";
import { ColorCollection, ColorVariable } from "./types";

const outputMap = {
   primitives: [
      {
         collection: "Tailwind Variables",
         others: {
            screens: "breakpoint",
            fontFamily: "font/family",
            fontSize: "font/size",
            fontWeight: "font/weight",
            letterSpacing: "font/letter-spacing",
            lineHeight: "leading",
            borderWidth: "border-width",
            borderRadius: "radius",
            spacing: "spacing",
         },
      },
      {
         collection: " 1. Colors",
         colors: {
            general: true, // all colors go to primitives.colors.general
         },
      },
   ],
   semantics: [
      {
         collection: "Semantic Colors",
         colors: {
            specific: {
               backgroundColor: "background",
               textColor: "text",
               borderColor: "border",
            },
            general: true, // all other colors go to semantics.colors.general
         },
      },
      {
         collection: " 2. Others",
         colors: {
            specific: {
               radius: "radius",
            },
         },
      },
   ],
   components: [
      {
         collection: " 3. Components",
      },
   ],
};

const output = {
   primitives: {
      colors: {
         general: {
            gray: {
               "100": "#fafafa", // Hex colors stay as is
               "200": "#eaeaea",
               "300": "#e3e3e3",
               "400": "#e0e0e0",
               "500": "#d9d9d9",
               "600": "#cacaca",
               "700": "#92939e",
               "800": "#727588",
               "900": "#25283d",
            },
            brand: {
               "100": "#acdeff",
               "200": "#73c7ff",
               "300": "#39b1ff",
               "400": "#009aff",
               "500": "#008ae5",
               "600": "#065fdb",
               "700": "#004eb6",
               "800": "#0f00a0",
               "900": "#0a0066",
            },
            secondary: {
               "100": "#f4faff",
               "200": "#e1e6ef",
               "300": "#b6c3d8",
               "400": "#97abca",
               "500": "#7892bc",
               "600": "#5575aa",
               "700": "#445e88",
               "800": "#334666",
               "900": "#222f44",
            },
         },
         others: {
            screens: {
               xl: "1240px", // Pixel values stay as is with px
               lg: "1024px",
               md: "768px",
               "3xl": "1536px",
               "2xl": "1400px",
               xxs: "360px",
               xs: "375px",
               sm: "640px",
            },
            fontFamily: {
               accent: "Raleway", // No extra quotes needed for font names
               body: "Inter",
            },
            fontSize: {
               xs: "12px",
               sm: "14px",
               base: "16px",
               lg: "18px",
               xl: "20px",
               "2xl": "24px",
               "3xl": "28px",
               "4xl": "32px",
               "5xl": "36px",
               xxs: "10px",
            },
            fontWeight: {
               thin: 100,
               extralight: 200,
               light: 300,
               normal: 400,
               medium: 500,
               semibold: 600,
               bold: 700,
               extrabold: 800,
               black: 900,
            },
            letterSpacing: {
               tighter: "-0.8", // Numbers should be rounded to 1 decimal place
               tight: "-0.4",
               normal: "0",
               wide: "0.4",
               wider: "0.8",
               widest: "1.6",
               "5": "5",
               tightest: "-1",
            },
            lineHeight: {
               "3": "12px",
               "4": "16px",
               "5": "20px",
               "6": "24px",
               "7": "28px",
               "8": "32px",
               "9": "36px",
               "10": "40px",
               none: "0",
            },
            borderWidth: {
               "0": "0px",
               "1": "1px",
               "2": "2px",
               "4": "4px",
               "8": "8px",
            },
            borderRadius: {
               none: "0px",
               sm: "2px",
               DEFAULT: "4px",
               md: "6px",
               lg: "8px",
               xl: "12px",
               "2xl": "16px",
               "3xl": "24px",
               "4xl": "32px",
               full: "9999px",
            },
            spacing: {
               "0": "0px",
               "0.5": "2px", // "0-5" maps to "0.5"
               "1": "4px",
               "1.5": "6px",
               "2": "8px",
            },
         },
      },
      others: { screens: {}, fontFamily: {}, fontSize: {} /*...*/ },
   },
   semantics: {
      colors: {
         backgroundColor: {
            default: "var(--color-background-default)",
            most: "var(--color-background-most)",
            dark: "var(--color-background-dark)",
            brand: "var(--color-background-brand)",
            "brand-less": "var(--color-background-brand-less)",
            accent: "var(--color-background-accent)",
            "accent-less": "var(--color-background-accent-less)",
            "accent-more": "var(--color-background-accent-more)",
            error: "var(--color-background-error)",
            more: "var(--color-background-more)",
            success: "var(--color-background-success)",
            "success-more": "var(--color-background-success-more)",
            warning: "var(--color-background-warning)",
            "warning-more": "var(--color-background-warning-more)",
         },
         textColor: {
            default: "var(--color-text-default)",
            accent: "var(--color-text-accent)",
            inverted: "var(--color-text-inverted)",
            primary: "var(--color-text-primary)",
            error: "var(--color-text-error)",
            warning: "var(--color-text-warning)",
            less: "var(--color-text-less)",
            success: "var(--color-text-success)",
            disabled: "var(--color-text-disabled)",
         },
         borderColor: {
            default: "var(--color-border-default)",
            disabled: "var(--color-border-disabled)",
            active: "var(--color-border-active)",
            error: "var(--color-border-error)",
            less: "var(--color-border-less)",
            success: "var(--color-border-success)",
         },
         general: {
            icon: {
               inverted: "var(--color-icon-inverted)",
               default: "var(--color-icon-default)",
               "accent-red": "var(--color-icon-accent-red)",
               primary: "var(--color-icon-primary)",
               error: "var(--color-icon-error)",
               warning: "var(--color-icon-warning)",
               less: "var(--color-icon-less)",
               accent: "var(--color-icon-accent)",
               success: "var(--color-icon-success)",
               "accent-brand-less": "var(--color-icon-accent-brand-less)",
            },
            link: {
               default: "var(--color-link-default)",
               disabled: "var(--color-link-disabled)",
               active: "var(--color-link-active)",
               visited: "var(--color-link-visited)",
               hover: "var(--color-link-hover)",
               "inverted-default": "var(--color-link-inverted-default)",
               "inverted-disabled": "var(--color-link-inverted-disabled)",
               "inverted-hovered": "var(--color-link-inverted-hovered)",
            },
         },
      },
      others: { screens: {}, fontFamily: {}, fontSize: {} /*...*/ },
   },
   components: {
      input: {
         "bg-default": "var(--color-input-bg-default)",
         "required-star": "var(--color-input-required-star)",
         "bg-active": "var(--color-input-bg-active)",
         "bg-error": "var(--color-input-bg-error)",
         "bg-hover": "var(--color-input-bg-hover)",
      },
      button: {
         "primary-icon-default": "var(--color-button-primary-icon-default)",
         "primary-icon-hovered": "var(--color-button-primary-icon-hovered)",
      },
      badge: {
         text: "var(--color-badge-text)",
      },
      tag: {
         "dark-bg-default": "var(--color-tag-dark-bg-default)",
         "dark-bg-hovered": "var(--color-tag-dark-bg-hovered)",
      },
   },
};

// First, let's create a type for our CSS variables structure
type CssVariableSet = {
   name: string;
   value: string | number;
   category?: string;
   comment?: string;
};

type CssVariablesObject = {
   tailwind: {
      screens: CssVariableSet[];
      fontFamily: CssVariableSet[];
      fontSize: CssVariableSet[];
      fontWeight: CssVariableSet[];
      letterSpacing: CssVariableSet[];
      lineHeight: CssVariableSet[];
      borderWidth: CssVariableSet[];
      borderRadius: CssVariableSet[];
      spacing: CssVariableSet[];
   };
};

function generateTailwindVariables(
   collection: ColorCollection,
   variableMap: Map<string, string>
): CssVariablesObject {
   const variables: CssVariablesObject = {
      tailwind: {
         screens: [],
         fontFamily: [],
         fontSize: [],
         fontWeight: [],
         letterSpacing: [],
         lineHeight: [],
         borderWidth: [],
         borderRadius: [],
         spacing: [],
      },
   };

   if (!collection.variables) return variables;

   collection.variables.forEach((variable) => {
      const cssVariableName = generateCssVariableName(variable.name);
      variableMap.set(variable.id, cssVariableName);

      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return;

      let value = variable.valuesByMode[modeKey];
      const [category, ...rest] = variable.name.split("/");
      const key = rest.join("/");

      // Round decimal numbers if it's a number
      if (typeof value === "number") {
         value = Number(value.toFixed(1));
      }

      const variableSet: CssVariableSet = {
         name: cssVariableName,
         value: value,
      };

      if (category === "breakpoint") {
         variables.tailwind.screens.push(variableSet);
      } else if (category === "font") {
         if (rest[0] === "family") {
            variableSet.value = `"${value}"`;
            variables.tailwind.fontFamily.push(variableSet);
         } else if (rest[0] === "size") {
            variables.tailwind.fontSize.push(variableSet);
         } else if (rest[0] === "weight") {
            variables.tailwind.fontWeight.push(variableSet);
         } else if (rest[0] === "letter-spacing") {
            variables.tailwind.letterSpacing.push(variableSet);
         }
      } else if (category === "leading") {
         variables.tailwind.lineHeight.push(variableSet);
      } else if (category === "border-width") {
         variables.tailwind.borderWidth.push(variableSet);
      } else if (category === "radius") {
         variables.tailwind.borderRadius.push(variableSet);
      } else if (category === "spacing") {
         variables.tailwind.spacing.push(variableSet);
      }
   });

   return variables;
}

function generateJsMapping(data: ColorCollection[]): string {
   if (!Array.isArray(data) || data.length === 0) return "";

   const result = processVariables(data);
   return JSON.stringify(result, null, 2);
}

function processPrimitives(primitives: ColorVariable[]): {
   colors: { general: Record<string, Record<string, string>> };
} {
   const general: Record<string, Record<string, string>> = {};

   primitives.forEach((variable) => {
      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return;

      const colorValue = variable.valuesByMode[modeKey];
      if (!isColorValue(colorValue)) return;

      const [category, shade] = variable.name.split("/");
      if (!category || !shade) return;

      if (!general[category]) {
         general[category] = {};
      }
      general[category][shade] = rgbaToHex(colorValue);
   });

   return { colors: { general } };
}

function processSemantics(semantics: ColorVariable[]): {
   colors: {
      backgroundColor: Record<string, string>;
      textColor: Record<string, string>;
      borderColor: Record<string, string>;
      general: Record<string, Record<string, string>>;
   };
} {
   const result = {
      backgroundColor: {},
      textColor: {},
      borderColor: {},
      general: {},
   };

   semantics.forEach((variable) => {
      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return;

      const value = `var(--color-${variable.name.replace(/\//g, "-")})`;
      const [category, ...rest] = variable.name.split("/");

      if (category === "background") {
         result.backgroundColor[rest.join("-")] = value;
      } else if (category === "text") {
         result.textColor[rest.join("-")] = value;
      } else if (category === "border") {
         result.borderColor[rest.join("-")] = value;
      } else {
         if (!result.general[category]) {
            result.general[category] = {};
         }
         result.general[category][rest.join("-")] = value;
      }
   });

   return { colors: result };
}

function processComponents(
   components: ColorVariable[]
): Record<string, Record<string, string>> {
   const result: Record<string, Record<string, string>> = {};

   components.forEach((variable) => {
      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return;

      const [component, ...rest] = variable.name.split("/");
      if (!result[component]) {
         result[component] = {};
      }

      result[component][rest.join("-")] = `var(--color-${variable.name.replace(
         /\//g,
         "-"
      )})`;
   });

   return result;
}

function processTailwind(variables: ColorVariable[]): {
   others: Record<string, Record<string, string>>;
} {
   const others: Record<string, Record<string, string>> = {
      screens: {},
      fontFamily: {},
      fontSize: {},
      fontWeight: {},
      letterSpacing: {},
      lineHeight: {},
      borderWidth: {},
      borderRadius: {},
      spacing: {},
   };

   variables.forEach((variable) => {
      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return;

      let value = variable.valuesByMode[modeKey];
      const [category, ...rest] = variable.name.split("/");
      let key = cleanVariableName(variable.name);

      // Handle each category
      if (category === "breakpoint") {
         others.screens[key] = `${value}px`;
      } else if (category === "font") {
         if (rest[0] === "family") {
            value = formatFontFamily(value);
            others.fontFamily[key] = value;
         } else if (rest[0] === "size") {
            others.fontSize[key] = `${value}px`;
         } else if (rest[0] === "weight") {
            others.fontWeight[key] = value.toString();
         } else if (rest[0] === "letter-spacing") {
            others.letterSpacing[key] = Number(value).toFixed(1);
         }
      } else if (category === "leading") {
         others.lineHeight[key] = `${value}px`;
      } else if (category === "border-width") {
         others.borderWidth[key] = `${value}px`;
      } else if (category === "radius") {
         others.borderRadius[key] = `${value}px`;
      } else if (category === "spacing") {
         key = formatSpacingKey(key);
         value = typeof value === "number" ? `${value}px` : value;
         others.spacing[key] = value;
      }
   });

   return { others };
}

function generateCssFromAllCollections(data: ColorCollection[]): string {
   const cssLines: string[] = [":root {"];
   // Create a map of variable IDs to their names
   const variableMap = new Map<string, string>();

   // First pass: build the variable map
   data.forEach((collection) => {
      collection.variables?.forEach((variable) => {
         variableMap.set(variable.id, variable.name);
      });
   });

   // Process Tailwind variables
   const tailwindCollection = data.find((c) => c.name === "Tailwind setup");
   const tailwindVariables = generateTailwindVariables(
      tailwindCollection || { variables: [] },
      variableMap
   );

   // Add Tailwind variables
   cssLines.push("  /* Tailwind Variables */");
   Object.entries(tailwindVariables.tailwind).forEach(([category, vars]) => {
      if (vars.length > 0) {
         cssLines.push(`  /* ${category} */`);
         vars.forEach((variable) => {
            cssLines.push(`  ${variable.name}: ${variable.value};`);
         });
         cssLines.push("");
      }
   });

   // Process Primitives (Colors only)
   const primitiveCollection = data.find((c) => c.name === " 1. Colors");
   if (primitiveCollection?.variables) {
      cssLines.push("  /* Primitives */");
      const sortedVariables = sortPrimitives(primitiveCollection.variables);
      sortedVariables.forEach((variable) => {
         const modeKey = getFirstModeKey(variable.valuesByMode);
         if (!modeKey) return;

         const value = variable.valuesByMode[modeKey];
         if (isColorValue(value)) {
            const cssVarName = generateCssColorVariableName(variable.name);
            cssLines.push(`  ${cssVarName}: ${rgbaToHex(value)};`);
         }
      });
      cssLines.push("");
   }

   // Process Semantic Colors
   const semanticCollection = data.find((c) => c.name === "Semantic colors");
   if (semanticCollection?.variables) {
      cssLines.push("  /* Semantic Colors */");
      semanticCollection.variables.forEach((variable) => {
         const modeKey = getFirstModeKey(variable.valuesByMode);
         if (!modeKey) return;

         const value = variable.valuesByMode[modeKey];
         if (isColorValue(value)) {
            const cssVarName = generateCssColorVariableName(variable.name);
            cssLines.push(`  ${cssVarName}: ${rgbaToHex(value)};`);
         } else if (isVariableAlias(value)) {
            const cssVarName = generateCssColorVariableName(variable.name);
            const referencedVarName = variableMap.get(value.id);
            if (referencedVarName) {
               const referencedVar =
                  generateCssColorVariableName(referencedVarName);
               cssLines.push(`  ${cssVarName}: var(${referencedVar});`);
            }
         }
      });
      cssLines.push("");
   }

   // Process Component Colors
   const componentCollection = data.find((c) => c.name === " 3. Components");
   if (componentCollection?.variables) {
      cssLines.push("  /* Component Colors */");
      componentCollection.variables.forEach((variable) => {
         const modeKey = getFirstModeKey(variable.valuesByMode);
         if (!modeKey) return;

         const value = variable.valuesByMode[modeKey];
         if (isColorValue(value)) {
            const cssVarName = generateCssColorVariableName(variable.name);
            cssLines.push(`  ${cssVarName}: ${rgbaToHex(value)};`);
         } else if (isVariableAlias(value)) {
            const cssVarName = generateCssColorVariableName(variable.name);
            const referencedVarName = variableMap.get(value.id);
            if (referencedVarName) {
               const referencedVar =
                  generateCssColorVariableName(referencedVarName);
               cssLines.push(`  ${cssVarName}: var(${referencedVar});`);
            }
         }
      });
      cssLines.push("");
   }

   cssLines.push("}");
   return cssLines.join("\n");
}

// Add type safety for our output structure
type OutputStructure = {
   primitives: {
      colors: {
         general: Record<string, Record<string, string>>;
      };
      others: {
         screens: Record<string, string>;
         fontFamily: Record<string, string>;
         fontSize: Record<string, string>;
         fontWeight: Record<string, string>;
         letterSpacing: Record<string, string>;
         lineHeight: Record<string, string>;
         borderWidth: Record<string, string>;
         borderRadius: Record<string, string>;
         spacing: Record<string, string>;
      };
   };
   semantics: {
      colors: {
         backgroundColor: Record<string, string>;
         textColor: Record<string, string>;
         borderColor: Record<string, string>;
         general: Record<string, Record<string, string>>;
      };
   };
   components: Record<string, Record<string, string>>;
};

// Update the processVariables return type
function processVariables(collections: ColorCollection[]): OutputStructure {
   const result = {
      primitives: {
         colors: { general: {} },
         others: {},
      },
      semantics: {
         colors: {
            backgroundColor: {},
            textColor: {},
            borderColor: {},
            general: {},
         },
      },
      components: {},
   };

   collections.forEach((collection) => {
      if (collection.name === " 1. Colors") {
         Object.assign(
            result.primitives,
            processPrimitives(collection.variables || [])
         );
      } else if (collection.name === "Tailwind setup") {
         Object.assign(
            result.primitives,
            processTailwind(collection.variables || [])
         );
      } else if (collection.name === "Semantic colors") {
         Object.assign(
            result.semantics,
            processSemantics(collection.variables || [])
         );
      } else if (collection.name === " 3. Components") {
         result.components = processComponents(collection.variables || []);
      }
   });

   return result;
}

function Plugin() {
   const [cssVariables, setCssVariables] = useState<string>("");
   const [jsMapping, setJsMapping] = useState<string>("");

   useEffect(() => {
      const handleSetVariables = (result: ColorCollection[]) => {
         setCssVariables(generateCssFromAllCollections(result));
         setJsMapping(generateJsMapping(result));
      };

      const unsubscribe = on("SET_VARIABLES", handleSetVariables);

      return () => {
         unsubscribe();
      };
   }, []);

   const handleExport = () => {
      emit("GET_VARIABLES");
   };

   const editorOptions = {
      minimap: { enabled: false },
      fontSize: 12,
      formatOnPaste: true,
      formatOnType: true,
      scrollBeyondLastLine: false,
   } as const;

   return (
      <Container space="medium">
         <Button fullWidth onClick={handleExport}>
            Export Variables
         </Button>
         <VerticalSpace space="small" />
         <div
            style={{
               display: "flex",
               gap: "16px",
               height: "600px",
            }}
         >
            {["css", "json"].map((language, index) => (
               <div
                  key={language}
                  style={{
                     flex: 1,
                     border: "1px solid #ccc",
                  }}
               >
                  <Editor
                     height="100%"
                     defaultLanguage={language}
                     value={index === 0 ? cssVariables : jsMapping}
                     options={editorOptions}
                     theme="vs-dark"
                  />
               </div>
            ))}
         </div>
      </Container>
   );
}

export default render(Plugin);
