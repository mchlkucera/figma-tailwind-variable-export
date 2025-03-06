import {
   Banner,
   Button,
   Container,
   IconWarning32,
   Text,
   Toggle,
   VerticalSpace,
} from "@create-figma-plugin/ui";
import { h } from "preact";
import { render } from "@create-figma-plugin/ui";
import Editor from "@monaco-editor/react";
import { ErrorModal } from "./components/ErrorModal";
import { useThemeState } from "./hooks/useThemeState";

const editorOptions = {
   minimap: { enabled: false },
   fontSize: 12,
   formatOnPaste: true,
   formatOnType: true,
   scrollBeyondLastLine: false,
} as const;

function Plugin() {
   const { state, actions } = useThemeState();

   return (
      <Container space="medium">
         <ErrorModal
            isOpen={state.showModal}
            onClose={actions.closeModal}
            title="Errors found"
         >
            <Banner icon={<IconWarning32 />} variant="warning">
               {state.errors.length} errors found
            </Banner>
            <VerticalSpace space="small" />
            {state.errors.map((error) => (
               <Text key={error} style={{ height: 20, fontSize: 11 }}>
                  - {error}
               </Text>
            ))}
            <VerticalSpace space="small" />
            <Button onClick={actions.closeModal} secondary>
               Close
            </Button>
         </ErrorModal>

         <VerticalSpace space="small" />
         <Button fullWidth onClick={actions.generateTheme}>
            Generate theme
         </Button>

         <div style={{ padding: "12px 0" }}>
            <Toggle
               onChange={(e) => actions.toggleErrors(e.currentTarget.checked)}
               value={state.ignoreErrors}
            >
               <Text>Ignore errors</Text>
            </Toggle>
         </div>

         <div style={{ display: "flex", height: "560px" }}>
            <Editor
               height="100%"
               defaultLanguage="css"
               value={state.content}
               options={editorOptions}
               theme="vs-dark"
            />
         </div>
      </Container>
   );
}

export default render(Plugin);
