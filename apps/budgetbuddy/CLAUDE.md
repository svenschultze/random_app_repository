# BudgetBuddy Development Guidelines

## Commands
- Build: `npm run build` - Builds the app for production
- Development: `npm run dev` - Starts development server with hot reload
- Preview: `npm run preview` - Preview production build locally
- Lint: `npm run lint` - Runs ESLint to check code quality
- Format: `npm run format` - Formats code with Prettier

## Code Style Guidelines
- Use Vue 3 Composition API with `<script setup>` syntax
- Follow Vue.js style guide (Priority A & B) from official docs
- File organization: components in /components, views in /views
- Component names should be PascalCase (e.g., HelloWorld.vue)
- Use '@/' imports for src directory paths (aliased in jsconfig.json)
- Vue files follow SFC structure: <script> → <template> → <style>
- Use scoped CSS in components with `<style scoped>`
- Prefer CSS variables for theming (see assets/base.css)
- Use ES modules syntax (`import`/`export`) exclusively
- Error handling: Use try/catch for async operations
- Responsive design: Use media queries for mobile layouts
- Router: Use named routes and organize by feature
- Comments: Document complex logic and component props
- State management: Use Vue's Composition API refs and reactive

## Accessibility Guidelines
- Add v-voix accessibility attributes to all interactive elements
- Use v-voix="'UniqueIdentifier'" for screen reader identification
- Add hint="Description" attribute for additional context when needed
- Include voix-description in router meta for page-level descriptions
- Ensure all form inputs have proper labels and accessibility attributes
- Test with screenreader compatibility enabled