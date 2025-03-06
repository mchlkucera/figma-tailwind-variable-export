# Figma to Tailwind Variable Export

Exports Figma design tokens to CSS custom properties for Tailwind CSS.

## Install & Run

```bash
npm install
npm run build
```

## Development
```bash
npm run watch
```

## Structure

## Features

- 🎨 Exports Figma variables to CSS custom properties
- 🔄 Real-time preview with Monaco editor
- ✨ Supports multiple variable types:
  - Colors
  - Typography
  - Spacing
  - Breakpoints
  - Borders
  - Shadows
  - Animations
- 🔍 Error validation

## Usage

1. Open the plugin in Figma
2. Click "Export Variables" to generate:
   -  CSS custom properties for your color variables
   -  A JavaScript mapping object for Tailwind configuration

The exported variables are organized into three categories:

-  Primitive Colors: Base color palette
-  Semantic Colors: Purpose-based color assignments
-  Component Variables: Component-specific color variables

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
