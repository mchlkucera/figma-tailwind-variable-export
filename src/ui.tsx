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
   sortPrimitives,
   generateCssVariableName,
   getFirstModeKey,
   isColorValue,
   rgbaToHex,
   sortSemantics,
   isVariableAlias,
   resolveVariableValue,
} from "./utils";
import { ColorCollection, ColorVariable } from "./types";

function generatePrimitiveCssVariables(
   collection: ColorCollection,
   variableMap: Map<string, string>
): string {
   if (!collection.variables) return "";

   const sortedPrimitives = sortPrimitives(collection.variables);
   const cssLines = ["  /* Primitive Colors */"];

   sortedPrimitives.forEach((variable) => {
      const cssVariableName = generateCssVariableName(variable.name);
      variableMap.set(variable.id, cssVariableName);

      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return;

      const value = variable.valuesByMode[modeKey];
      if (isColorValue(value)) {
         const cssValue = rgbaToHex(value);
         cssLines.push(`  ${cssVariableName}: ${cssValue};`);
      }
   });

   return cssLines.join("\n");
}

function generateSemanticCssVariables(
   collection: ColorCollection,
   variableMap: Map<string, string>
): string {
   if (!collection.variables) return "";

   const sortedSemantics = sortSemantics(collection.variables);
   const cssLines = ["", "  /* Semantic Colors */"];

   sortedSemantics.forEach((variable) => {
      const cssVariableName = generateCssVariableName(variable.name);

      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return;

      const value = variable.valuesByMode[modeKey];

      if (isVariableAlias(value)) {
         const primitiveVarName = variableMap.get(value.id);
         if (primitiveVarName) {
            cssLines.push(`  ${cssVariableName}: var(${primitiveVarName});`);
         }
      } else if (isColorValue(value)) {
         const cssValue = rgbaToHex(value);
         cssLines.push(`  ${cssVariableName}: ${cssValue};`);
      }
   });

   return cssLines.join("\n");
}

function generateComponentCssVariables(
   collection: ColorCollection,
   variableMap: Map<string, string>
): string {
   if (!collection.variables) return "";

   const cssLines = ["", "  /* Component Variables */"];

   collection.variables.forEach((variable) => {
      const cssVariableName = generateCssVariableName(variable.name);
      variableMap.set(variable.id, cssVariableName);

      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return;

      const value = variable.valuesByMode[modeKey];

      if (isVariableAlias(value)) {
         const aliasVarName = variableMap.get(value.id);
         if (aliasVarName) {
            cssLines.push(`  ${cssVariableName}: var(${aliasVarName});`);
         }
      } else if (isColorValue(value)) {
         const cssValue = rgbaToHex(value);
         cssLines.push(`  ${cssVariableName}: ${cssValue};`);
      }
   });

   return cssLines.join("\n");
}

function generateCssVariables(data: ColorCollection[]): string {
   if (!Array.isArray(data) || data.length === 0) return "";

   const variableMap = new Map<string, string>();
   const cssLines: string[] = [":root {"];

   const primitiveCollection = data.find((c) => c.name === " 1. Colors");
   if (primitiveCollection) {
      const primitiveCss = generatePrimitiveCssVariables(
         primitiveCollection,
         variableMap
      );
      if (primitiveCss) {
         cssLines.push(primitiveCss);
      }
   }

   const semanticCollection = data.find((c) => c.name === "Semantic colors");
   if (semanticCollection) {
      const semanticCss = generateSemanticCssVariables(
         semanticCollection,
         variableMap
      );
      if (semanticCss) {
         cssLines.push(semanticCss);
      }
   }

   const componentCollection = data.find((c) => c.name === " 3. Components");
   if (componentCollection) {
      const componentCss = generateComponentCssVariables(
         componentCollection,
         variableMap
      );
      if (componentCss) {
         cssLines.push(componentCss);
      }
   }

   cssLines.push("}");
   return cssLines.join("\n");
}

function processPrimitives(
   primitives: ColorVariable[]
): Record<string, Record<string, string>> {
   return primitives.reduce((categories, variable) => {
      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return categories;

      const colorValue = variable.valuesByMode[modeKey];
      if (!isColorValue(colorValue)) return categories;

      const [category, shade] = variable.name.split("/");
      if (!category || !shade) return categories;

      if (!categories[category]) {
         categories[category] = {};
      }
      categories[category][shade] = rgbaToHex(colorValue);

      return categories;
   }, {} as Record<string, Record<string, string>>);
}

function processSemantics(
   semantics: ColorVariable[],
   variablePrefix: string = "--color-"
): { main: Record<string, any>; other: Record<string, any> } {
   const mainCategories = {
      backgroundColor: {} as Record<string, string>,
      borderColor: {} as Record<string, string>,
      textColor: {} as Record<string, string>,
   };

   const otherCategories: Record<string, Record<string, string>> = {};

   semantics.forEach((variable) => {
      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return;

      const value = variable.valuesByMode[modeKey];
      if (!isColorValue(value) && !isVariableAlias(value)) return;

      const varName = `var(${variablePrefix}${variable.name.replace(
         /\//g,
         "-"
      )})`;
      const name = variable.name.replace(/\//g, "-");

      const processCategory = (
         categoryName: string,
         categoryObj: Record<string, string>
      ) => {
         const rest = name.substring(categoryName.length + 1);
         categoryObj[rest] = varName;
      };

      if (name.startsWith("background-")) {
         processCategory("background", mainCategories.backgroundColor);
      } else if (name.startsWith("border-")) {
         processCategory("border", mainCategories.borderColor);
      } else if (name.startsWith("text-")) {
         processCategory("text", mainCategories.textColor);
      } else {
         const [category, ...rest] = name.split("-");
         if (!otherCategories[category]) otherCategories[category] = {};
         otherCategories[category][rest.join("-")] = varName;
      }
   });

   return { main: mainCategories, other: otherCategories };
}

function processComponents(
   components: ColorVariable[],
   variablesById: Map<string, ColorVariable>,
   variablePrefix: string = "--color-"
): Record<string, Record<string, string>> {
   const componentCategories: Record<string, Record<string, string>> = {};

   components.forEach((variable) => {
      const modeKey = getFirstModeKey(variable.valuesByMode);
      if (!modeKey) return;

      let value = variable.valuesByMode[modeKey];

      if (!isColorValue(value) && !isVariableAlias(value)) return;

      if (isVariableAlias(value)) {
         const resolvedValue = resolveVariableValue(value, variablesById);
         if (!resolvedValue) return;
         if (!isColorValue(resolvedValue)) return;

         value = resolvedValue;
      }

      const varName = `var(${variablePrefix}${variable.name.replace(
         /\//g,
         "-"
      )})`;
      const name = variable.name.replace(/\//g, "-");

      const [category, ...rest] = name.split("-");
      if (!componentCategories[category]) {
         componentCategories[category] = {};
      }
      componentCategories[category][rest.join("-")] = varName;
   });

   return componentCategories;
}

function generateJsMapping(data: ColorCollection[]): string {
   if (!Array.isArray(data) || data.length === 0) return "";

   const variablesById = new Map<string, ColorVariable>();
   data.forEach((collection) => {
      collection.variables.forEach((variable) => {
         variablesById.set(variable.id, variable);
      });
   });

   const primitiveCollection = data.find((c) => c.name === " 1. Colors");
   const primitives = primitiveCollection?.variables || [];
   const primitiveCategories = processPrimitives(primitives);

   const semanticCollection = data.find((c) => c.name === "Semantic colors");
   const semantics = semanticCollection?.variables || [];
   const { main, other } = processSemantics(semantics);

   const componentCollection = data.find((c) => c.name === " 3. Components");
   const components = componentCollection?.variables || [];
   const componentCategories = processComponents(components, variablesById);

   const result = {
      main,
      components: componentCategories,
      other: { ...primitiveCategories, ...other },
   };

   return JSON.stringify(result, null, 2);
}

function Plugin() {
   const [cssVariables, setCssVariables] = useState<string>("");
   const [jsMapping, setJsMapping] = useState<string>("");

   useEffect(() => {
      const handleSetVariables = (result: ColorCollection[]) => {
         setCssVariables(generateCssVariables(result));
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
