<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* Global CSS variables */
:root {
  /* Light theme (default) */
  --bg-color: #f8f9fa;
  --text-color: #212529;
  --border-color: #dee2e6;
  --border-color-light: #e9ecef;
  --hover-color: #f1f3f5;
  --text-color-muted: #6c757d;
  --accent-color: #007bff;
  
  /* Header */
  --header-bg: #2c3e50;
  --header-text: white;
  
  /* Toolbar */
  --toolbar-bg: #f0f0f0;
  --button-color: #333;
  --button-hover-bg: rgba(0, 0, 0, 0.1);
  --button-active-bg: rgba(0, 0, 0, 0.2);
  
  /* Editor specific */
  --editor-bg-color: white;
  
  /* Inputs */
  --input-bg: #fff;
  --input-text: #333;
  --input-border: #ced4da;
  
  /* Buttons */
  --button-text: white;
  --button-hover: rgba(255, 255, 255, 0.1);
  --save-button-bg: #28a745;
  --save-button-hover: #218838;
  --new-button-bg: #007bff;
  --new-button-hover: #0069d9;
  
  /* Status colors */
  --saving-color: #f0ad4e;
  --saved-color: #5cb85c;
  
  /* Symbols bar */
  --symbols-bar-bg: #f0f0f0;
  --button-border: #ccc;
  --button-bg: white;
  --button-hover-bg: #f5f5f5;
  --toggle-button-bg: #007bff;
  
  /* Scrollbars */
  --scrollbar-track: #f1f1f1;
  --scrollbar-thumb: #888;
  --scrollbar-thumb-hover: #555;
}

/* Dark theme will be applied by setting data-theme="dark" on the html element */
[data-theme="dark"] {
  --bg-color: #1e1e1e;
  --text-color: #e0e0e0;
  --border-color: #444;
  --border-color-light: #333;
  --hover-color: #2d2d2d;
  --text-color-muted: #888;
  --accent-color: #0078d7;
  
  /* Header */
  --header-bg: #252526;
  --header-text: #e0e0e0;
  
  /* Toolbar */
  --toolbar-bg: #333333;
  --button-color: #e0e0e0;
  --button-hover-bg: rgba(255, 255, 255, 0.1);
  --button-active-bg: rgba(255, 255, 255, 0.2);
  
  /* Editor specific */
  --editor-bg-color: #1e1e1e;
  
  /* Inputs */
  --input-bg: #3c3c3c;
  --input-text: #e0e0e0;
  --input-border: #555;
  
  /* Buttons remain same for visibility */
  
  /* Symbols bar */
  --symbols-bar-bg: #333333;
  --button-border: #555;
  --button-bg: #3c3c3c;
  --button-hover-bg: #4c4c4c;
  
  /* Scrollbars */
  --scrollbar-track: #1e1e1e;
  --scrollbar-thumb: #666;
  --scrollbar-thumb-hover: #888;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Mobile optimizations */
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

/* Improve touch targets */
button, 
a, 
.clickable {
  min-height: 44px;
  min-width: 44px;
}

/* Prevent text selection on interface elements */
button, 
.no-select {
  user-select: none;
}

/* Better focus styles for accessibility */
*:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* Override CodeMirror focus styles */
.cm-editor:focus-within {
  outline: none;
}
</style>
