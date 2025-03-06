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
   generateCssVariableNameWithoutDoubleSlash,
   getFirstModeKey,
   isColorValue,
   isVariableAlias,
   cleanVariableName,
   rgbaToHex,
   sortVariables,
   formatFontFamily,
   formatSpacingKey,
   
} from "./utils";
import { ColorCollection, ColorVariable } from "./types";

const editorOptions = {
   minimap: { enabled: false },
   fontSize: 12,
   formatOnPaste: true,
   formatOnType: true,
   scrollBeyondLastLine: false,
} as const;

function Plugin() {
   const [content, setContent] = useState("");

   useEffect(() => {
      const handleSetVariables = (result: string) => {
         setContent(result);
      };

      const unsubscribe = on("SET_VARIABLES", handleSetVariables);

      return () => {
         unsubscribe();
      };
   }, []);

   const handleButtonClick = () => {
      emit("GET_VARIABLES");
   };


   return (
      <Container space="medium">
         <VerticalSpace space="small" />
         <Button fullWidth onClick={handleButtonClick}>
            Generate theme
         </Button>
         <VerticalSpace space="small" />
         <div
            style={{
               display: "flex",
               height: "590px",
            }}
         >
               <Editor
                  height="100%"
                  defaultLanguage={"css"}
                  value={content}
                  options={editorOptions}
                  theme="vs-dark"
               />
         </div>
      </Container>
   );
}

export default render(Plugin);
