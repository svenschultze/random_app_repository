# Vue.js Project Guidelines

## Build Commands
- Development: `npm run dev` (Vite dev server with hot-reload)
- Build: `npm run build` (Production build)
- Preview: `npm run preview` (Preview production build locally)

## Code Style
- Vue 3 Composition API with `<script setup>` syntax
- Component structure: script → template → style
- CSS scoping with `<style scoped>` in components
- Path aliasing: `@/` for src directory references
- Two-space indentation, single quotes for imports
- PascalCase for component names and files (e.g., HelloWorld.vue)
- View files use suffix: `HomeView.vue`, `AboutView.vue`

## Development
- Use VSCode with Volar extension (disable Vetur)
- Props should have type and required validation
- Follow Vue Router patterns for navigation
- Component organization: reusable components in `/components`, pages in `/views`