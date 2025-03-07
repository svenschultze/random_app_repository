# MobileCode

A powerful mobile-friendly code editor built with Vue.js that allows developers to write, test, and run code on their mobile devices.

## Features

- **Touch-Optimized Interface**: Designed specifically for mobile screens with larger touch targets and mobile-friendly controls.
- **Multiple Language Support**: Edit JavaScript, HTML, CSS, and Python with proper syntax highlighting.
- **Advanced File Management**: Create, save, and organize files in folders with a full file explorer system.
- **Live Preview**: Preview HTML, CSS, and JavaScript code in real-time.
- **Code Execution**: Run JavaScript and Python code directly in the browser and see the output.
- **Syntax Error Detection**: Automatic detection and highlighting of syntax errors.
- **Console Output**: Integrated console panel to view code execution results.
- **Dark/Light Themes**: Eye-friendly themes for coding in different environments.
- **Mobile Coding Shortcuts**: Language-specific quick access to common coding symbols and snippets that are difficult to type on mobile keyboards.
- **Responsive Design**: Works on phones and tablets in various orientations.
- **Offline Support**: Works without an internet connection (browser storage).

## Technology Stack

- **Vue 3**: Frontend framework using Composition API
- **Pinia**: State management for the file system and code execution
- **CodeMirror 6**: Feature-rich code editor component with syntax highlighting and linting
- **Pyodide**: Python runtime for the browser (WebAssembly)
- **Vue Router**: For navigation
- **Vite**: Build tooling for fast development
- **LocalStorage API**: For persisting files and settings
- **CSS Variables**: For theming and consistent styling

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

## Usage

1. Create a new file or folder using the file explorer
2. Edit your code with full syntax highlighting
3. Use the symbols bar at the bottom for quick access to coding characters and snippets
4. For HTML and CSS, toggle the preview panel to see your output in real-time
5. For JavaScript and Python, run your code and see the output in the console panel
6. Organize your files into folders with the file explorer
7. Automatically detect syntax errors as you type

## Language-Specific Features

### JavaScript
- Run code directly in the browser
- Console output with JSON formatting
- Syntax error detection
- Code snippets for common patterns

### Python
- Full Python 3 support via Pyodide WebAssembly
- Console output panel for print statements
- Python-specific syntax highlighting
- Common Python snippets

### HTML/CSS
- Live preview panel
- Syntax highlighting
- Element and style snippets
- Mobile-friendly tag insertion

## Accessibility

This application includes comprehensive accessibility features through vue-voix, ensuring a better experience for all users including those using screen readers or other assistive technologies.

## License

MIT
