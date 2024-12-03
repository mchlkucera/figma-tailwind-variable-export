# Figma to Tailwind Variable Export

A Figma plugin that exports color variables from your Figma design system to CSS custom properties and Tailwind-compatible JavaScript mappings.

## Features

-  Exports Figma color variables to CSS custom properties
-  Generates a JavaScript mapping object for Tailwind configuration
-  Supports primitive colors, semantic colors, and component-specific colors
-  Handles variable aliases and resolves them to their final values
-  Real-time preview with Monaco editor
-  Dark mode support

## Installation

1. Clone this repository
2. Install dependencies:

```
$ npm install
```

3. Build the plugin:

```
$ npm run build
```

4. In Figma:
   -  Open a document
   -  Right-click and select "Plugins"
   -  Choose "Development" > "Import plugin from manifest..."
   -  Select the `manifest.json` file from your build directory

## Development

This plugin is built with:

-  [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/)
-  Preact
-  TailwindCSS
-  Monaco Editor

To start development:

```
$ npm run watch
```

This will:

-  Watch for changes in your TypeScript/CSS files
-  Rebuild the plugin automatically
-  Generate TailwindCSS styles

## Usage

1. Open the plugin in Figma
2. Click "Export Variables" to generate:
   -  CSS custom properties for your color variables
   -  A JavaScript mapping object for Tailwind configuration

The exported variables are organized into three categories:

-  Primitive Colors: Base color palette
-  Semantic Colors: Purpose-based color assignments
-  Component Variables: Component-specific color variables

## Project Structure

Key files:

```typescript:src/main.ts
startLine: 1
endLine: 30
```

Main plugin entry point that handles communication with Figma.

```typescript:src/ui.tsx
startLine: 295
endLine: 357
```

UI component that renders the export interface and Monaco editors.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT

## See Also

-  [Create Figma Plugin docs](https://yuanqing.github.io/create-figma-plugin/)
-  [Figma Plugin API docs](https://figma.com/plugin-docs/)
