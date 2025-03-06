# CalcIntuitive

An intuitive, next-generation calculator built with Vue 3 that goes beyond basic arithmetic to support advanced, complex mathematical operations.

## Features

- **Dynamic Input Canvas**: The app adapts to the complexity of the user's calculation
- **Context-Driven Guidance**: Contextual suggestions and tooltips guide users through complex operations
- **Multiple Calculation Modes**:
  - Standard arithmetic operations
  - Symbolic math with variables and equations
  - Matrix operations
  - Calculus (derivatives, integrals, limits)
- **Interactive Graphing**: Visualize functions with an interactive graphing tool
- **Accessible Design**: All interactive elements are built with accessibility in mind

## Screenshots

(Screenshots will be added after implementation)

## Tech Stack

- **Vue 3**: With Composition API and `<script setup>` syntax
- **Vue Router**: For navigation between calculator modes
- **CSS**: Custom styling with CSS variables for theming
- **Vite**: Fast build tooling and development server

## Accessibility

CalcIntuitive is built with accessibility in mind:
- All interactive elements have proper voix IDs
- Semantic HTML structure
- Screen reader support
- Keyboard navigation

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Design Philosophy

CalcIntuitive is designed around these key principles:

1. **Context-Driven Guidance**: The calculator adapts to the complexity of the user's query, revealing options and input fields contextually.
2. **Immersive Interactions**: Replace the traditional grid of buttons with interactive panels, a flexible expression builder, and live previews of results.
3. **Flexibility & Depth**: Allow users to transition seamlessly between simple calculations, advanced algebraic manipulations, matrix computations, and visual graphing—all in one interface.

## Future Enhancements

- Integration with an actual mathematical computation engine
- Save and share calculations
- User-defined functions and variables
- More advanced graphing features (multiple functions, 3D plots)
- Dark/light theme support
