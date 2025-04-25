import { once, showUI, on, emit } from "@create-figma-plugin/utilities";
import generateTheme from "./generateTheme";

export default function () {
   on(
      "GET_VARIABLES",
      async function (data: { ignoreFontFamilies?: boolean } = {}) {
         const collections =
            await figma.variables.getLocalVariableCollectionsAsync();
         const variables = figma.variables.getLocalVariables();

         const mappedCollections = collections.map((collection) => ({
            id: collection.id,
            name: collection.name,
            modes: collection.modes,
            variables: variables
               .filter((v) => v.variableCollectionId === collection.id)
               .map((v) => ({
                  id: v.id,
                  name: v.name,
                  resolvedType: v.resolvedType,
                  valuesByMode: v.valuesByMode,
                  scopes: v.scopes,
               })),
         }));

         const { cssOutput, errors } = generateTheme(mappedCollections, {
            ignoreFontFamilies: data.ignoreFontFamilies,
         });

         emit("SET_VARIABLES", { generatedTheme: cssOutput, errors });
      }
   );

   showUI({
      height: 650,
      width: 800,
   });
}
