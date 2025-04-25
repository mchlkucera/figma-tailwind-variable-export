import { useState, useEffect } from "preact/hooks";
import { emit, on } from "@create-figma-plugin/utilities";

export const useThemeState = () => {
   const [state, setState] = useState({
      content: "",
      errors: [] as string[],
      showModal: false,
      showErrorReport: false,
      ignoreFontFamilies: false,
      ignoreDeprecated: true,
      exportOptions: {
         font: true,
         color: true,
         spacing: true,
         radius: true,
         border: true,
         fontWeight: true, // New option
         fontSpacing: true, // New option
         textSize: true, // New option
         leading: true, // New option
         breakpoint: true, // New option
      },
   });

   useEffect(() => {
      const handleSetVariables = (result: {
         generatedTheme: string;
         errors: string[];
      }) => {
         setState((prev) => ({
            ...prev,
            content: result.generatedTheme,
            errors: result.errors,
            showModal: result.errors.length > 0 && prev.showErrorReport,
         }));
      };

      return on("SET_VARIABLES", handleSetVariables);
   }, []);

   const actions = {
      generateTheme: () =>
         emit("GET_VARIABLES", {
            ignoreFontFamilies: state.ignoreFontFamilies,
            ignoreDeprecated: state.ignoreDeprecated,
            exportOptions: state.exportOptions,
         }),
      toggleErrorReport: (checked: boolean) =>
         setState((prev) => ({ ...prev, showErrorReport: checked })),
      toggleIgnoreFontFamilies: (checked: boolean) =>
         setState((prev) => ({ ...prev, ignoreFontFamilies: checked })),
      toggleIgnoreDeprecated: (checked: boolean) =>
         setState((prev) => ({ ...prev, ignoreDeprecated: checked })),
      toggleExportOption: (
         option: keyof typeof state.exportOptions,
         checked: boolean
      ) =>
         setState((prev) => ({
            ...prev,
            exportOptions: {
               ...prev.exportOptions,
               [option]: checked,
            },
         })),
      closeModal: () => setState((prev) => ({ ...prev, showModal: false })),
   };

   return { state, actions };
};
