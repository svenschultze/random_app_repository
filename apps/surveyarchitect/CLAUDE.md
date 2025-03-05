# Vue.js Project Guidelines

## Build Commands
- Development: `npm run dev` (Vite dev server with hot-reload)
- Build: `npm run build` (Production build)
- Preview: `npm run preview` (Preview production build locally)
- Lint: `npm run lint` (Run ESLint)

## Testing
- No test runner currently configured
- Add testing with: `npm install -D vitest @vue/test-utils`
- Single test run: `vitest run src/path/to/test.spec.js`

## Code Style
- Vue 3 Composition API with `<script setup>` syntax
- Component structure: script → template → style
- CSS scoping with `<style scoped>` in components
- Path aliasing: `@/` refers to src directory
- Two-space indentation, single quotes for strings/imports
- PascalCase for component filenames (`HelloWorld.vue`)
- View files suffixed with "View" (`HomeView.vue`)
- ES modules with explicit `.js` extensions

## Development Guidelines
- VSCode with Volar extension (disable Vetur)
- Props require type and validation
- Component organization: `/components` for reusable, `/views` for pages
- Error handling: try/catch for async operations
- Vue Router for navigation between views