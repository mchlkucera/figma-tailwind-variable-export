# Figma to Tailwind Variable Export

A Figma plugin that exports design tokens (variables) from Figma to CSS custom properties formatted for Tailwind CSS.

## Overview

This plugin extracts Figma design variables and converts them into properly formatted CSS custom properties ready to be used with Tailwind CSS. It handles various design token types and provides intelligent sorting and transformation.

## Features

-  Exports multiple variable types:
   -  Colors
   -  Typography (font families, weights, sizes, letter spacing)
   -  Spacing
   -  Border radius
   -  Borders
   -  Breakpoints
   -  Shadows and effects
   -  Animations
-  Real-time preview with Monaco editor
-  Configurable export options (select which variable types to include)
-  Smart filtering (e.g., ignore deprecated variables)
-  Intelligent sorting of variables by category and value
-  Error validation

## Installation & Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Development mode with live reloading
npm run watch
```

## Usage

1. Install the plugin in Figma
2. Open the plugin panel
3. Select desired export options
4. Click "Generate theme" to export variables
5. Copy the generated CSS output or use it directly in your project

## Transformation Rules

### Color Variables

-  RGB and RGBA values are automatically converted to hex format:

   -  RGB colors → `#RRGGBB` format
   -  RGBA colors → `#RRGGBBAA` format
   -  Example: `rgba(255, 0, 0, 0.5)` → `#ff0000aa`

-  Colors are categorized into:
   -  Base colors (color-base-, color-brand-, color-primary-, etc.)
   -  Semantic colors (color-text-, color-background-, color-border-, etc.)

### Typography Variables

-  Font weights are exported as numerical values without units:

   -  Example: `font-weight-bold: 700;`

-  Font families are exported as quoted strings:

   -  Example: `font-family-sans: "Inter, sans-serif";`

-  Text sizes and letter spacing include px units:
   -  Example: `text-lg: 18px;`
   -  Example: `font-letter-spacing-tight: -0.5px;`

### Spacing Variables

-  Hyphenated decimal values are automatically transformed:

   -  `spacing-0-5` → `spacing-0.5`
   -  `spacing-1-5` → `spacing-1.5`
   -  `spacing-2-5` → `spacing-2.5`

-  Special handling for `px` values between 0 and fractional values:

   -  Example: `spacing-0, spacing-px, spacing-0.5, spacing-1, ...`

-  Variables are sorted in numerical order following Tailwind's default spacing scale

### Size-based Variables

-  Variables with size suffixes are sorted according to a predefined order:
   -  `none, xxs, xs, sm, default, base, md, lg, xl, 2xl, 3xl, 4xl, 5xl, full`
   -  Example: `radius-sm, radius-md, radius-lg`

### Variable References

-  References to other variables are properly formatted as CSS variable references:
   -  Example: `color-text-primary: var(--color-brand-primary);`

### Output Format

-  Variables are wrapped in a `@theme {}` block:

```css
@theme {
   --color-primary: #0080ff;
   --color-secondary: #5a67d8;

   --spacing-0: 0px;
   --spacing-1: 4px;
   --spacing-2: 8px;
}
```

### Sorting Logic

-  Variables are grouped by prefix type (color, spacing, text, etc.)
-  Within each prefix group:
   -  Size-based variables follow a predefined size order
   -  Numeric variables are sorted by their numerical value
   -  Literal values come before referenced/aliased values
   -  Base colors come before semantic/derived colors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT

## Related Resources

-  [Figma Plugin API documentation](https://figma.com/plugin-docs/)
-  [Create Figma Plugin documentation](https://yuanqing.github.io/create-figma-plugin/)
