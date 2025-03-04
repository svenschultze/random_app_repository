# BudgetBuddy Development Guidelines

## Commands
- Build: `npm run build` - Builds the app for production
- Development: `npm run dev` - Starts development server
- Preview: `npm run preview` - Preview production build locally

## Code Style Guidelines
- Use Vue 3 Composition API with `<script setup>` syntax
- Follow Vue.js style guide (Priority A & B) from official docs
- Use '@/' imports for src directory paths
- Component names should be PascalCase (e.g., HelloWorld.vue)
- Vue files should follow SFC structure: <script> → <template> → <style>
- Use scoped CSS in components with `<style scoped>`
- Prefer CSS variables for theming (see assets/base.css)
- Router files should be organized by feature in /router directory
- File organization: components in /components, views in /views
- Use vue-router for navigation between pages
- Use ESM imports/exports (`import` instead of `require`)