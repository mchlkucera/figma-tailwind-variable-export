import {
   Banner,
   Button,
   Container,
   IconWarning32,
   Text,
   Toggle,
   VerticalSpace,
   Divider,
   Columns,
} from "@create-figma-plugin/ui";
import { h } from "preact";
import { render } from "@create-figma-plugin/ui";
import Editor from "@monaco-editor/react";
import { ErrorModal } from "./components/ErrorModal";
import { useThemeState } from "./hooks/useThemeState";
import { Bold } from "figma-ui-kit";

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

         <div
            style={{
               display: "flex",
               height: "600px",
            }}
         >
            {/* Left column with options */}
            <div
               style={{
                  width: "220px",
                  marginRight: "16px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
               }}
            >
               {/* Options section - takes up most of the space */}
               <div
                  style={{
                     flex: 1,
                     overflowY: "auto",
                     paddingRight: "8px",
                  }}
               >
                  <Text>
                     <Bold>Options</Bold>
                  </Text>
                  <VerticalSpace space="small" />
                  <Divider />
                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleErrorReport(e.currentTarget.checked)
                     }
                     value={state.showErrorReport}
                  >
                     <Text>Show error report</Text>
                  </Toggle>

                  <VerticalSpace space="extraLarge" />

                  <Text>
                     <Bold>Export options</Bold>
                  </Text>
                  <VerticalSpace space="small" />
                  <Divider />
                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleExportOption(
                           "font",
                           e.currentTarget.checked
                        )
                     }
                     value={state.exportOptions.font}
                  >
                     <Text>Font families</Text>
                  </Toggle>

                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleExportOption(
                           "fontWeight",
                           e.currentTarget.checked
                        )
                     }
                     value={state.exportOptions.fontWeight}
                  >
                     <Text>Font weights</Text>
                  </Toggle>

                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleExportOption(
                           "fontSpacing",
                           e.currentTarget.checked
                        )
                     }
                     value={state.exportOptions.fontSpacing}
                  >
                     <Text>Font letter spacing</Text>
                  </Toggle>

                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleExportOption(
                           "textSize",
                           e.currentTarget.checked
                        )
                     }
                     value={state.exportOptions.textSize}
                  >
                     <Text>Text sizes</Text>
                  </Toggle>

                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleExportOption(
                           "leading",
                           e.currentTarget.checked
                        )
                     }
                     value={state.exportOptions.leading}
                  >
                     <Text>Line heights</Text>
                  </Toggle>

                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleExportOption(
                           "color",
                           e.currentTarget.checked
                        )
                     }
                     value={state.exportOptions.color}
                  >
                     <Text>Colors</Text>
                  </Toggle>

                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleExportOption(
                           "spacing",
                           e.currentTarget.checked
                        )
                     }
                     value={state.exportOptions.spacing}
                  >
                     <Text>Spacing</Text>
                  </Toggle>

                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleExportOption(
                           "radius",
                           e.currentTarget.checked
                        )
                     }
                     value={state.exportOptions.radius}
                  >
                     <Text>Border radius</Text>
                  </Toggle>

                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleExportOption(
                           "border",
                           e.currentTarget.checked
                        )
                     }
                     value={state.exportOptions.border}
                  >
                     <Text>Borders</Text>
                  </Toggle>

                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleExportOption(
                           "breakpoint",
                           e.currentTarget.checked
                        )
                     }
                     value={state.exportOptions.breakpoint}
                  >
                     <Text>Breakpoints</Text>
                  </Toggle>

                  <VerticalSpace space="extraLarge" />

                  <Text>
                     <Bold>Filter options</Bold>
                  </Text>
                  <VerticalSpace space="small" />
                  <Divider />
                  <VerticalSpace space="small" />

                  <Toggle
                     onChange={(e) =>
                        actions.toggleIgnoreDeprecated(e.currentTarget.checked)
                     }
                     value={state.ignoreDeprecated}
                  >
                     <Text>Ignore variables with prefix 'DEPRECATED'</Text>
                  </Toggle>
               </div>

               {/* Generate button at the bottom of the left column */}
               <div style={{ paddingTop: "16px" }}>
                  <Button fullWidth onClick={actions.generateTheme}>
                     Generate theme
                  </Button>
               </div>
            </div>

            {/* Right column with editor - takes up all remaining space */}
            <div style={{ flex: 1 }}>
               <Editor
                  height="100%"
                  defaultLanguage="css"
                  value={state.content}
                  options={editorOptions}
                  theme="vs-dark"
               />
            </div>
         </div>
      </Container>
   );
}

export default render(Plugin);
