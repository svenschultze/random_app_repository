import { ref, watchEffect } from 'vue';
import { getUserSettings, updateUserSettings } from './dataService';

// Available themes
const THEMES = {
  light: {
    '--primary-color': '#4CAF50',
    '--primary-dark': '#388E3C',
    '--primary-light': '#A5D6A7',
    '--accent-color': '#FF9800',
    '--text-color': '#333333',
    '--text-light': '#666666',
    '--background-color': '#f5f5f5',
    '--card-color': '#ffffff',
    '--border-color': '#e0e0e0',
  },
  dark: {
    '--primary-color': '#4CAF50',
    '--primary-dark': '#388E3C',
    '--primary-light': '#A5D6A7',
    '--accent-color': '#FF9800',
    '--text-color': '#e0e0e0',
    '--text-light': '#b0b0b0',
    '--background-color': '#121212',
    '--card-color': '#1e1e1e',
    '--border-color': '#333333',
  },
  highContrast: {
    '--primary-color': '#ffff00',
    '--primary-dark': '#e6e600',
    '--primary-light': '#ffffa8',
    '--accent-color': '#00ffff',
    '--text-color': '#ffffff',
    '--text-light': '#dddddd',
    '--background-color': '#000000',
    '--card-color': '#0a0a0a',
    '--border-color': '#555555',
  }
};

// Available accent colors
const ACCENT_COLORS = {
  green: {
    '--primary-color': '#4CAF50',
    '--primary-dark': '#388E3C',
    '--primary-light': '#A5D6A7',
  },
  blue: {
    '--primary-color': '#2196F3',
    '--primary-dark': '#1976D2',
    '--primary-light': '#BBDEFB',
  },
  purple: {
    '--primary-color': '#9C27B0',
    '--primary-dark': '#7B1FA2',
    '--primary-light': '#E1BEE7',
  },
  orange: {
    '--primary-color': '#FF9800',
    '--primary-dark': '#F57C00',
    '--primary-light': '#FFE0B2',
  },
  pink: {
    '--primary-color': '#E91E63',
    '--primary-dark': '#C2185B',
    '--primary-light': '#F8BBD0',
  }
};

// Current theme state
const currentTheme = ref('light');
const currentAccentColor = ref('green');
const isHighContrast = ref(false);
const isLargeText = ref(false);

// Apply theme to document
const applyTheme = () => {
  const userSettings = getUserSettings();
  currentTheme.value = userSettings.theme || 'light';
  currentAccentColor.value = userSettings.accentColor || 'green';
  isHighContrast.value = userSettings.highContrast || false;
  isLargeText.value = userSettings.largeText || false;

  // Apply base theme (light or dark)
  let baseTheme = THEMES[currentTheme.value];
  if (isHighContrast.value) {
    baseTheme = THEMES.highContrast;
  }

  // Apply theme variables to root
  Object.entries(baseTheme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });

  // Apply accent color
  const accentColorVars = ACCENT_COLORS[currentAccentColor.value];
  Object.entries(accentColorVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });

  // Apply text size if needed
  if (isLargeText.value) {
    document.documentElement.style.setProperty('font-size', '120%');
  } else {
    document.documentElement.style.setProperty('font-size', '100%');
  }

  // Update body class for theme
  document.body.className = isHighContrast.value 
    ? 'theme-high-contrast' 
    : `theme-${currentTheme.value}`;
  
  if (isLargeText.value) {
    document.body.classList.add('large-text');
  } else {
    document.body.classList.remove('large-text');
  }
};

// Update theme settings
const updateTheme = (themeSettings) => {
  const settings = getUserSettings();
  const updatedSettings = { 
    ...settings, 
    ...themeSettings
  };
  
  updateUserSettings(updatedSettings);
  applyTheme();
  return updatedSettings;
};

// Initialize theme on app start
const initializeTheme = () => {
  applyTheme();
};

export {
  THEMES,
  ACCENT_COLORS,
  currentTheme,
  currentAccentColor,
  isHighContrast,
  isLargeText,
  applyTheme,
  updateTheme,
  initializeTheme
};