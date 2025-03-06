<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import store from '../store';

const router = useRouter();

function goBack() {
  router.go(-1);
}

function toggleTheme() {
  store.toggleTheme();
}

// Notification settings
const notifyLikes = ref(true);
const notifyReplies = ref(true);
const notifyMentions = ref(true);
const notifyFollows = ref(true);

function updateNotificationSetting(setting, value) {
  // In a real app, this would update user preferences in a database
  // For this demo, we just update the local state
  setting.value = value;
}

// Language settings
const currentLanguage = ref('english');
const languages = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Español' },
  { value: 'french', label: 'Français' },
  { value: 'german', label: 'Deutsch' },
  { value: 'japanese', label: '日本語' }
];

function changeLanguage(language) {
  // In a real app, this would change the app's language
  // For this demo, we just update the local state
  currentLanguage.value = language;
}

// Content filtering
const contentFilter = ref('medium');
const contentFilters = [
  { value: 'off', label: 'Off - Show all content' },
  { value: 'medium', label: 'Medium - Hide potentially sensitive content' },
  { value: 'strict', label: 'Strict - Hide all sensitive content' }
];

function updateContentFilter(filter) {
  // In a real app, this would update the user's content filtering preferences
  // For this demo, we just update the local state
  contentFilter.value = filter;
}

// Accessibility
const fontSizeLevel = ref(2); // Default: Medium
const reducedMotion = ref(false);
const highContrast = ref(false);

function updateFontSize(level) {
  // In a real app, this would update the font size throughout the app
  fontSizeLevel.value = level;
  // Simulating application of the font size to the app
  // In a real app, you'd apply a CSS class or variable
}

function toggleReducedMotion() {
  reducedMotion.value = !reducedMotion.value;
  // In a real app, this would update the app's motion settings
}

function toggleHighContrast() {
  highContrast.value = !highContrast.value;
  // In a real app, this would update the app's contrast settings
}
</script>

<template>
  <AppLayout>
    <div class="settings-view">
      <div class="settings-view__header">
        <button 
          class="settings-view__back-btn" 
          @click="goBack"
          v-voix="'Go back'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 v-voix="'Settings'">Settings</h1>
      </div>
      
      <div class="settings-view__content">
        <!-- Display Section -->
        <div class="settings-view__section">
          <h2 class="settings-view__section-title">Display</h2>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">Theme</h3>
              <p class="settings-view__setting-description">Toggle between light and dark theme</p>
            </div>
            
            <div class="settings-view__setting-control">
              <button 
                class="settings-view__theme-toggle" 
                @click="toggleTheme"
                v-voix="'Toggle theme. Current theme: ' + (store.state.theme === 'light' ? 'light' : 'dark')"
              >
                <div class="settings-view__theme-toggle-track">
                  <div :class="['settings-view__theme-toggle-thumb', { 'settings-view__theme-toggle-thumb--active': store.state.theme === 'dark' }]"></div>
                </div>
                <span>{{ store.state.theme === 'light' ? 'Light' : 'Dark' }}</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Notifications Section -->
        <div class="settings-view__section">
          <h2 class="settings-view__section-title">Notifications</h2>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">Likes</h3>
              <p class="settings-view__setting-description">Notify when someone likes your thread</p>
            </div>
            
            <div class="settings-view__setting-control">
              <button 
                :class="['settings-view__toggle', { 'settings-view__toggle--active': notifyLikes }]" 
                @click="updateNotificationSetting(notifyLikes, !notifyLikes)"
                v-voix="'Toggle like notifications. Currently: ' + (notifyLikes ? 'on' : 'off')"
              >
                <div :class="['settings-view__toggle-track', { 'settings-view__toggle-track--active': notifyLikes }]">
                  <div :class="['settings-view__toggle-thumb', { 'settings-view__toggle-thumb--active': notifyLikes }]"></div>
                </div>
              </button>
            </div>
          </div>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">Replies</h3>
              <p class="settings-view__setting-description">Notify when someone replies to your thread</p>
            </div>
            
            <div class="settings-view__setting-control">
              <button 
                :class="['settings-view__toggle', { 'settings-view__toggle--active': notifyReplies }]" 
                @click="updateNotificationSetting(notifyReplies, !notifyReplies)"
                v-voix="'Toggle reply notifications. Currently: ' + (notifyReplies ? 'on' : 'off')"
              >
                <div :class="['settings-view__toggle-track', { 'settings-view__toggle-track--active': notifyReplies }]">
                  <div :class="['settings-view__toggle-thumb', { 'settings-view__toggle-thumb--active': notifyReplies }]"></div>
                </div>
              </button>
            </div>
          </div>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">Mentions</h3>
              <p class="settings-view__setting-description">Notify when someone mentions you</p>
            </div>
            
            <div class="settings-view__setting-control">
              <button 
                :class="['settings-view__toggle', { 'settings-view__toggle--active': notifyMentions }]" 
                @click="updateNotificationSetting(notifyMentions, !notifyMentions)"
                v-voix="'Toggle mention notifications. Currently: ' + (notifyMentions ? 'on' : 'off')"
              >
                <div :class="['settings-view__toggle-track', { 'settings-view__toggle-track--active': notifyMentions }]">
                  <div :class="['settings-view__toggle-thumb', { 'settings-view__toggle-thumb--active': notifyMentions }]"></div>
                </div>
              </button>
            </div>
          </div>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">New followers</h3>
              <p class="settings-view__setting-description">Notify when someone follows you</p>
            </div>
            
            <div class="settings-view__setting-control">
              <button 
                :class="['settings-view__toggle', { 'settings-view__toggle--active': notifyFollows }]" 
                @click="updateNotificationSetting(notifyFollows, !notifyFollows)"
                v-voix="'Toggle follower notifications. Currently: ' + (notifyFollows ? 'on' : 'off')"
              >
                <div :class="['settings-view__toggle-track', { 'settings-view__toggle-track--active': notifyFollows }]">
                  <div :class="['settings-view__toggle-thumb', { 'settings-view__toggle-thumb--active': notifyFollows }]"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Language Section -->
        <div class="settings-view__section">
          <h2 class="settings-view__section-title">Language</h2>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">Display language</h3>
              <p class="settings-view__setting-description">Choose your preferred language for the interface</p>
            </div>
            
            <div class="settings-view__setting-control">
              <select 
                class="settings-view__select" 
                :value="currentLanguage"
                @change="changeLanguage($event.target.value)"
                v-voix="'Language selection. Current language: ' + languages.find(l => l.value === currentLanguage).label"
              >
                <option 
                  v-for="language in languages" 
                  :key="language.value" 
                  :value="language.value"
                >
                  {{ language.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Content filtering Section -->
        <div class="settings-view__section">
          <h2 class="settings-view__section-title">Content Filtering</h2>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">Filter level</h3>
              <p class="settings-view__setting-description">Choose how sensitive content is filtered</p>
            </div>
            
            <div class="settings-view__setting-control">
              <div class="settings-view__radio-group">
                <div 
                  v-for="filter in contentFilters" 
                  :key="filter.value" 
                  class="settings-view__radio-option"
                >
                  <label class="settings-view__radio-label">
                    <input 
                      type="radio" 
                      :value="filter.value" 
                      :checked="contentFilter === filter.value"
                      @change="updateContentFilter(filter.value)"
                      v-voix="'Content filter option: ' + filter.label"
                    />
                    <span>{{ filter.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Accessibility Section -->
        <div class="settings-view__section">
          <h2 class="settings-view__section-title">Accessibility</h2>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">Font size</h3>
              <p class="settings-view__setting-description">Adjust the size of text throughout the app</p>
            </div>
            
            <div class="settings-view__setting-control">
              <div class="settings-view__font-size-control">
                <button 
                  class="settings-view__font-size-btn settings-view__font-size-btn--small" 
                  :class="{ 'settings-view__font-size-btn--active': fontSizeLevel === 1 }"
                  @click="updateFontSize(1)"
                  v-voix="'Small font size'"
                >
                  A
                </button>
                <button 
                  class="settings-view__font-size-btn settings-view__font-size-btn--medium" 
                  :class="{ 'settings-view__font-size-btn--active': fontSizeLevel === 2 }"
                  @click="updateFontSize(2)"
                  v-voix="'Medium font size'"
                >
                  A
                </button>
                <button 
                  class="settings-view__font-size-btn settings-view__font-size-btn--large" 
                  :class="{ 'settings-view__font-size-btn--active': fontSizeLevel === 3 }"
                  @click="updateFontSize(3)"
                  v-voix="'Large font size'"
                >
                  A
                </button>
              </div>
            </div>
          </div>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">Reduced motion</h3>
              <p class="settings-view__setting-description">Reduce animations and motion effects</p>
            </div>
            
            <div class="settings-view__setting-control">
              <button 
                :class="['settings-view__toggle', { 'settings-view__toggle--active': reducedMotion }]" 
                @click="toggleReducedMotion"
                v-voix="'Toggle reduced motion. Currently: ' + (reducedMotion ? 'on' : 'off')"
              >
                <div :class="['settings-view__toggle-track', { 'settings-view__toggle-track--active': reducedMotion }]">
                  <div :class="['settings-view__toggle-thumb', { 'settings-view__toggle-thumb--active': reducedMotion }]"></div>
                </div>
              </button>
            </div>
          </div>
          
          <div class="settings-view__setting-item">
            <div class="settings-view__setting-info">
              <h3 class="settings-view__setting-name">High contrast</h3>
              <p class="settings-view__setting-description">Increase contrast for better readability</p>
            </div>
            
            <div class="settings-view__setting-control">
              <button 
                :class="['settings-view__toggle', { 'settings-view__toggle--active': highContrast }]" 
                @click="toggleHighContrast"
                v-voix="'Toggle high contrast. Currently: ' + (highContrast ? 'on' : 'off')"
              >
                <div :class="['settings-view__toggle-track', { 'settings-view__toggle-track--active': highContrast }]">
                  <div :class="['settings-view__toggle-thumb', { 'settings-view__toggle-thumb--active': highContrast }]"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Demo Information Section -->
        <div class="settings-view__section">
          <h2 class="settings-view__section-title">Demo Information</h2>
          
          <div class="settings-view__info-box">
            <p>
              <strong>Threadly</strong> is a demo application that simulates a text-based social media platform. 
              All data is randomly generated on each refresh, and no real data is stored or transmitted.
            </p>
            <p>
              This demo showcases the UI and interactions of a social media platform. To generate a new set of
              random data, click the "Refresh Data" button in the sidebar.
            </p>
            <p class="settings-view__demo-credits">
              Created with Vue.js and Faker.js
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.settings-view {
  width: 100%;
}

.settings-view__header {
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  z-index: 10;
  display: flex;
  align-items: center;
}

.settings-view__back-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--color-text);
  transition: background-color 0.2s;
}

.settings-view__back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.settings-view__header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.settings-view__content {
  padding: 1rem;
}

.settings-view__section {
  margin-bottom: 2rem;
}

.settings-view__section-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.settings-view__setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border-soft);
}

.settings-view__setting-info {
  flex: 1;
}

.settings-view__setting-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.settings-view__setting-description {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0;
}

.settings-view__theme-toggle {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--color-text);
}

.settings-view__theme-toggle-track,
.settings-view__toggle-track {
  width: 48px;
  height: 24px;
  background-color: var(--color-border);
  border-radius: 24px;
  margin-right: 0.75rem;
  position: relative;
  transition: background-color 0.2s;
}

.settings-view__theme-toggle-thumb,
.settings-view__toggle-thumb {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.settings-view__theme-toggle-thumb--active,
.settings-view__toggle-thumb--active {
  transform: translateX(24px);
}

.settings-view__toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.settings-view__toggle-track {
  background-color: var(--color-border);
}

.settings-view__toggle-track--active {
  background-color: #1da1f2 !important;
}

.settings-view__select {
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  min-width: 120px;
  cursor: pointer;
}

.settings-view__radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.settings-view__radio-option {
  display: flex;
  align-items: center;
}

.settings-view__radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.settings-view__radio-label input {
  margin-right: 0.5rem;
}

.settings-view__font-size-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.settings-view__font-size-btn {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: bold;
}

.settings-view__font-size-btn--small {
  font-size: 0.8rem;
}

.settings-view__font-size-btn--medium {
  font-size: 1rem;
}

.settings-view__font-size-btn--large {
  font-size: 1.2rem;
}

.settings-view__font-size-btn--active {
  background-color: #1da1f2;
  color: white;
  border-color: #1da1f2;
}

.settings-view__info-box {
  background-color: var(--color-background-soft);
  border-radius: 0.75rem;
  padding: 1rem;
}

.settings-view__demo-credits {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0;
}

/* For dark mode */
:root[data-theme="dark"] .settings-view__toggle-track--active {
  background-color: #1da1f2 !important;
}

:root[data-theme="dark"] .settings-view__font-size-btn,
:root[data-theme="dark"] .settings-view__select {
  background-color: var(--color-background-soft);
  border-color: var(--color-border);
}

/* For dark mode */
:root[data-theme="dark"] .settings-view__header {
  background-color: rgba(21, 32, 43, 0.9);
}

:root[data-theme="dark"] .settings-view__back-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .settings-view__theme-toggle-track {
  background-color: #1da1f2;
}

:root[data-theme="dark"] .settings-view__theme-toggle-thumb {
  background-color: white;
}
</style>