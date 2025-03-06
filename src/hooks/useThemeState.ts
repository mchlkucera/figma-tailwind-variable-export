import { useState, useEffect } from "preact/hooks";
import { emit, on } from "@create-figma-plugin/utilities";

export const useThemeState = () => {
   const [state, setState] = useState({
      content: "",
      errors: [] as string[],
      showModal: false,
      ignoreErrors: true
   });

   useEffect(() => {
      const handleSetVariables = (result: {
         generatedTheme: string;
         errors: string[];
      }) => {
         setState(prev => ({
            ...prev,
            content: result.generatedTheme,
            errors: result.errors,
            showModal: result.errors.length > 0 && !prev.ignoreErrors
         }));
      };

      return on("SET_VARIABLES", handleSetVariables);
   }, []);

   const actions = {
      generateTheme: () => emit("GET_VARIABLES"),
      toggleErrors: (checked: boolean) => setState(prev => ({ ...prev, ignoreErrors: checked })),
      closeModal: () => setState(prev => ({ ...prev, showModal: false }))
   };

   return { state, actions };
}; 