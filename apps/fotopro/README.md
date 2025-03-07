# FotoPro Editor

FotoPro Editor is a Vue 3 application for organizing and editing photos with a clean, user-friendly interface.

## Features

- **Photo Organization**: Import, tag, and organize photos into albums
- **Photo Editing**: Adjust brightness, contrast, and saturation
- **Image Transformations**: Rotate and flip your images
- **Export Options**: Save edited photos in multiple formats (JPEG, PNG, WebP)
- **Batch Operations**: Apply tags or add to albums in batch

## Architecture

FotoPro is built with the following technologies:

- **Vue 3**: Using the Composition API with `<script setup>` syntax
- **Pinia**: For state management
- **Vue Router**: For navigation between views
- **Fabric.js**: For canvas-based image editing

The application is structured as follows:

- `/src/views`: Page components for the different sections of the app
- `/src/components`: Reusable UI components
- `/src/stores`: Pinia stores for state management
- `/src/assets`: CSS and other static assets

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

## Key Views

- **Library View**: The main landing page showing all photos with filtering and sorting options
- **Albums View**: Organize photos into albums
- **Tags View**: View and manage photos by tags
- **Editor View**: Edit individual photos with various tools

## Accessibility

This application is built with accessibility in mind, using the vue-voix library to enhance screen reader support.

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open your browser to the provided URL

## License

MIT
