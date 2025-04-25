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

## Transformation Rules

This plugin provides several transformations to convert Figma variables into properly formatted CSS variables:

### Spacing Variables

-  Spacing variables with hyphenated decimal values are automatically transformed to use decimal points:

   -  `spacing-0-5` → `spacing-0.5`
   -  `spacing-1-5` → `spacing-1.5`
   -  `spacing-2-5` → `spacing-2.5`
   -  `spacing-3-5` → `spacing-3.5`

-  Spacing variables are sorted in numerical order with special considerations:
   -  `spacing-0` comes first
   -  `spacing-px` is positioned between `spacing-0` and `spacing-0.5`
   -  Decimal values (like `spacing-0.5`) are positioned between their integer neighbors
   -  The complete sorting order follows Tailwind's default spacing scale:
      ```
      spacing-0, spacing-px, spacing-0.5, spacing-1, spacing-1.5, spacing-2,
      spacing-2.5, spacing-3, spacing-3.5, spacing-4, spacing-5, etc.
      ```

### Sorting Rules

-  Variables are sorted by prefix type, then by numeric value when applicable
-  Size-based variables are sorted according to predefined size order (xxs, xs, sm, md, lg, xl, etc.)
-  Color variables are categorized into base colors and semantic colors
-  Literal values come before referenced/aliased values

## Features

-  🎨 Exports Figma variables to CSS custom properties
-  🔄 Real-time preview with Monaco editor
-  ✨ Supports multiple variable types:
   -  Colors
   -  Typography
   -  Spacing
   -  Breakpoints
   -  Borders
   -  Shadows
   -  Animations
-  🔍 Error validation

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
