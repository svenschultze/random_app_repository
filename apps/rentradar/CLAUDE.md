# RentRadar Project Guidelines

## Build Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- Add testing with: `npm install --save-dev vitest @vue/test-utils` 
- When tests are added: `npm test` - Run all tests
- When tests are added: `npm test -- path/to/component.spec.js` - Run single test

## Code Style Guidelines
- Use Vue 3 Composition API with `<script setup>` syntax
- Import order: Vue core → external libraries → local components → assets
- Use the `@/` alias for imports from the src directory
- Component names should be PascalCase (e.g., `PropertyCard.vue`)
- Prop names should be camelCase, with types defined (e.g., `defineProps({ item: Object })`)
- Consistent naming: views end with "View" (e.g., `ListingsView.vue`)
- Use single quotes for strings and 2-space indentation
- CSS follows BEM methodology with scoped styles
- Error handling with try/catch in async operations
- Use Pinia stores for state management
- Use composables for reusable logic
- Implement form validation with vee-validate
- Responsive design with mobile-first approach
- Leverage Vue Router for navigation
- Use PrimeVue components for UI consistency