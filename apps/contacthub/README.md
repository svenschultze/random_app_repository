# ContactHub Demo

A client-side contact management web application built with Vue 3. ContactHub allows you to manage contact information locally in your browser without requiring any server-side code or database.

## Features

- Store contact information (names, phone numbers, emails, addresses)
- Generate random demo contacts for testing
- Add, edit, and delete contacts
- Search through contacts by name, email, or phone
- Tag and categorize contacts
- Data persists in your browser's local storage
- Fully accessible with ARIA and keyboard support

## Technology Stack

- **Vue 3** with Composition API and `<script setup>` syntax
- **Vue Router** for page navigation
- **Local Storage** for data persistence
- **Faker.js** for generating random demo data

## Privacy

ContactHub is completely client-side. Your contact data never leaves your browser - it's stored in your browser's local storage. This means:

- No server stores your contacts
- Your data remains on your device
- No tracking or analytics

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

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

## License

MIT
