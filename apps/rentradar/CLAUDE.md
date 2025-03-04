# RentRadar Project Guidelines

## App Features
- User authentication and profiles
- Property search with advanced filtering
- Map and list views for browsing properties
- Favorites and saved searches
- Real-time alerts for matching listings
- Landlord portal for property management

## Build Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Code Style Guidelines
- Use Vue 3 Composition API with `<script setup>` syntax
- Import order: Vue core → external libraries → local components → assets
- Use the `@/` alias for imports from the src directory
- Component names should be PascalCase (e.g., `PropertyCard.vue`)
- Prop names should be camelCase
- CSS follows BEM methodology where applicable
- Use single quotes for strings
- Use 2-space indentation
- Components should be modular and reusable
- Consistent naming: views end with "View" (e.g., `ListingsView.vue`)
- Style blocks should use `scoped` attribute
- Use CSS variables for theming (see `assets/base.css`)

## Best Practices
- Responsive design with mobile-first approach
- Use Vue Router for navigation
- Implement state management with Pinia for user data and favorites
- Error handling with try/catch in async operations
- Use data fetching composables for API interactions
- Implement form validation for search and user input