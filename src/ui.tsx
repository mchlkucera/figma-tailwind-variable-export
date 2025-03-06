import {
   Banner,
   Button,
   Checkbox,
   Container,
   IconWarning32,
   Modal,
   render,
   Text,
   Toggle,
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
} from "./helpers";
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
   const [errors, setErrors] = useState<string[]>([]);
   const [open, setOpen] = useState<boolean>(false);
   const [ignoreErrors, setIgnoreErrors] = useState<boolean>(false);

   useEffect(() => {
      const handleSetVariables = (result: {
         generatedTheme: string;
         errors: string[];
      }) => {
         setContent(result.generatedTheme);
         setErrors(result.errors);
      };

      const unsubscribe = on("SET_VARIABLES", handleSetVariables);

      return () => {
         unsubscribe();
      };
   }, []);

   useEffect(() => {
      if (errors.length > 0 && !ignoreErrors) {
         setOpen(true);
      }
   }, [errors, ignoreErrors]);

   const handleButtonClick = () => {
      emit("GET_VARIABLES");
   };

   return (
      <Container space="medium">
         <Modal open={open} onCloseButtonClick={() => setOpen(false)} title="Errors found">
            <div
               style={{
                  padding: "12px",
                  width: "380px",
               }}
            >
               <Banner icon={<IconWarning32 />} variant="warning">
                  {errors.length} errors found
               </Banner>
               <VerticalSpace space="small" />

               {errors.map((error) => (
                  <Text key={error} style={{ height:20,fontSize: 11 }}>
                     - {error}
                  </Text>
               ))}

               <VerticalSpace space="small" />

               <Button onClick={() => setOpen(false)} secondary>
                  Close
               </Button>
            </div>
         </Modal>

         <VerticalSpace space="small" />
         <Button fullWidth onClick={handleButtonClick}>
            Generate theme
         </Button>

         <div style={{ padding: "12px 0" }}>
            <Toggle
               onChange={(event) =>
                  setIgnoreErrors(event.currentTarget.checked)
               }
               value={ignoreErrors}
            >
               <Text>Ignore errors</Text>
            </Toggle>
         </div>

         <div
            style={{
               display: "flex",
               height: "560px",
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
