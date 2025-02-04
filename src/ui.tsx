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


function Plugin() {
   const [value, setValue] = useState<string>("");

   useEffect(() => {
      const handleSetVariables = (result: ColorCollection[]) => {

         // REPLACE THIS STUFF

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
            
         <Editor
            height="100%"
            defaultLanguage={"css"}
            value={value}
            options={editorOptions}
            theme="vs-dark"
         />
         
      </Container>
   );
}

export default render(Plugin);
