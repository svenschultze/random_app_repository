<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isOpen = ref(false);
const searchQuery = ref('');
const voiceActive = ref(false);

// Trending topics data
const trendingTopics = ref([
  { name: 'Climate Action', count: 1243 },
  { name: 'AI Ethics', count: 856 },
  { name: 'Space Exploration', count: 721 },
  { name: 'Healthcare Innovation', count: 689 },
  { name: 'Digital Privacy', count: 542 }
]);

// Navigation links
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Headlines', path: '/headlines' },
  { name: 'Categories', path: '/categories' },
  { name: 'Trending', path: '/trending' },
  { name: 'Saved', path: '/saved' },
  { name: 'About', path: '/about' }
];

// Toggle the navigation overlay
const toggleNav = () => {
  isOpen.value = !isOpen.value;
  
  // When opening the menu, set focus to the search input for accessibility
  if (isOpen.value) {
    setTimeout(() => {
      document.getElementById('nav-search').focus();
    }, 300);
  }
};

// Close the navigation overlay
const closeNav = () => {
  isOpen.value = false;
};

// Handle search submission
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } });
    closeNav();
    searchQuery.value = '';
  }
};

// Toggle voice command mode
const toggleVoiceCommand = () => {
  voiceActive.value = !voiceActive.value;
  // In a real implementation, this would integrate with speech recognition
};

// Handle route navigation
const navigateTo = (path) => {
  router.push(path);
  closeNav();
};

// Handle keyboard accessibility
const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    closeNav();
  }
};

onMounted(() => {
  // Add event listener for keyboard navigation
  window.addEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="navigation-container">
    <!-- Hamburger menu button (always visible) -->
    <button
      class="hamburger-button"
      @click="toggleNav"
      aria-label="Toggle navigation menu"
      v-voix="'toggle-navigation'"
      hint="Click to open or close the navigation menu"
    >
      <div class="hamburger-icon" :class="{ 'open': isOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>

    <!-- Overlay navigation panel -->
    <div
      class="navigation-overlay"
      :class="{ 'open': isOpen }"
      aria-hidden="!isOpen"
      v-voix="'navigation-overlay'"
      hint="Navigation panel with search and menu options"
    >
      <div class="overlay-content">
        <!-- Search section -->
        <div class="search-section">
          <form @submit.prevent="handleSearch" class="search-form">
            <input
              id="nav-search"
              type="search"
              v-model="searchQuery"
              placeholder="Search news..."
              aria-label="Search news articles"
              v-voix="'search-input'"
              hint="Enter keywords to search for news"
            />
            <button
              type="submit"
              class="search-button"
              aria-label="Submit search"
              v-voix="'search-button'"
              hint="Click to search for entered keywords"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>

        <!-- Navigation links -->
        <nav class="nav-links" aria-label="Main navigation">
          <ul>
            <li v-for="link in navLinks" :key="link.path">
              <a
                @click.prevent="navigateTo(link.path)"
                :class="{ 'active': $route.path === link.path }"
                v-voix="'nav-' + link.name.toLowerCase()"
                :hint="'Navigate to ' + link.name"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </nav>

        <!-- Trending topics section -->
        <div class="trending-section">
          <h3 
            class="section-title"
            v-voix="'trending-section-title'"
            hint="Section for trending topics"
          >
            Trending Topics
          </h3>
          <ul class="trending-list">
            <li 
              v-for="topic in trendingTopics" 
              :key="topic.name" 
              class="trending-item"
              v-voix="'trending-' + topic.name.toLowerCase().replace(' ', '-')"
              :hint="'Trending topic: ' + topic.name + ' with ' + topic.count + ' articles'"
            >
              <span class="topic-name">#{{ topic.name }}</span>
              <span class="topic-count">{{ topic.count }}</span>
            </li>
          </ul>
        </div>

        <!-- User profile placeholder -->
        <div 
          class="user-section"
          v-voix="'user-section'"
          hint="User profile and account settings"
        >
          <h3 class="section-title">Your Account</h3>
          <div class="user-profile">
            <div class="profile-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="profile-info">
              <span class="profile-name">Guest User</span>
              <a 
                class="profile-action"
                v-voix="'sign-in'"
                hint="Click to sign in to your account"
              >
                Sign In / Register
              </a>
            </div>
          </div>
          <div class="settings-options">
            <button 
              class="settings-button"
              v-voix="'settings-button'"
              hint="Click to access app settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </button>
            <button 
              class="theme-button"
              v-voix="'theme-button'"
              hint="Click to toggle between light and dark theme"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              Dark Mode
            </button>
          </div>
        </div>

        <!-- Voice command indicator -->
        <div 
          class="voice-indicator"
          :class="{ 'active': voiceActive }"
          @click="toggleVoiceCommand"
          v-voix="'voice-command'"
          hint="Click to activate voice commands"
        >
          <div class="voice-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </div>
          <span class="voice-text">{{ voiceActive ? 'Listening...' : 'Voice Commands' }}</span>
          <div class="voice-pulse" v-if="voiceActive"></div>
        </div>
      </div>
    </div>

    <!-- Overlay backdrop -->
    <div
      class="overlay-backdrop"
      :class="{ 'open': isOpen }"
      @click="closeNav"
      aria-hidden="true"
    ></div>
  </div>
</template>

<style scoped>
.navigation-container {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
}

/* Hamburger button */
.hamburger-button {
  position: fixed;
  z-index: 102;
  top: 20px;
  left: 20px;
  background-color: var(--primary-color, #3498db);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.hamburger-button:hover {
  transform: scale(1.05);
  background-color: var(--primary-600, #2980b9);
}

.hamburger-button:focus {
  outline: 2px solid white;
  outline-offset: 2px;
}

.hamburger-icon {
  width: 22px;
  height: 16px;
  position: relative;
}

.hamburger-icon span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
  transition: all 0.3s ease;
}

.hamburger-icon span:nth-child(1) {
  top: 0;
}

.hamburger-icon span:nth-child(2) {
  top: 7px;
}

.hamburger-icon span:nth-child(3) {
  bottom: 0;
}

.hamburger-icon.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger-icon.open span:nth-child(2) {
  opacity: 0;
}

.hamburger-icon.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Navigation overlay */
.navigation-overlay {
  position: fixed;
  z-index: 101;
  top: 0;
  left: 0;
  width: 320px;
  max-width: 90vw;
  height: 100%;
  background-color: var(--background-color-alt, #fff);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  overflow-x: hidden;
}

.navigation-overlay.open {
  transform: translateX(0);
}

.overlay-content {
  padding: 80px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.overlay-backdrop {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay-backdrop.open {
  visibility: visible;
  opacity: 1;
}

/* Search section */
.search-section {
  margin-bottom: 10px;
}

.search-form {
  display: flex;
  position: relative;
}

.search-form input {
  width: 100%;
  padding: 12px 44px 12px 16px;
  border: 1px solid var(--border-color, #e1e8ed);
  border-radius: var(--border-radius, 8px);
  font-size: 15px;
  background-color: var(--background-color, #f8f9fa);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-form input:focus {
  outline: none;
  border-color: var(--primary-color, #3498db);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
}

.search-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--primary-color, #3498db);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: rgba(52, 152, 219, 0.1);
}

/* Navigation links */
.nav-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links li {
  margin-bottom: 2px;
}

.nav-links a {
  display: block;
  padding: 12px 15px;
  color: var(--text-color, #333);
  font-weight: 500;
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-links a:hover, .nav-links a.active {
  background-color: var(--background-color, #f8f9fa);
  color: var(--primary-color, #3498db);
}

.nav-links a.active {
  font-weight: 600;
}

/* Trending section */
.trending-section {
  border-top: 1px solid var(--border-color, #e1e8ed);
  padding-top: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--text-color, #333);
}

.trending-list {
  list-style: none;
  padding: 0;
}

.trending-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color, #e1e8ed);
  transition: background-color 0.3s;
  cursor: pointer;
}

.trending-item:hover {
  background-color: var(--background-color, #f8f9fa);
}

.topic-name {
  font-size: 14px;
  color: var(--primary-color, #3498db);
}

.topic-count {
  background-color: var(--background-color, #f8f9fa);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-color-light, #666);
}

/* User section */
.user-section {
  border-top: 1px solid var(--border-color, #e1e8ed);
  padding-top: 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: var(--background-color, #f8f9fa);
  border-radius: var(--border-radius, 8px);
  margin-bottom: 15px;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  background-color: var(--primary-color, #3498db);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-weight: 500;
  margin-bottom: 3px;
}

.profile-action {
  font-size: 13px;
  color: var(--primary-color, #3498db);
  cursor: pointer;
}

.settings-options {
  display: flex;
  gap: 10px;
}

.settings-button, .theme-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background-color: var(--background-color, #f8f9fa);
  border: 1px solid var(--border-color, #e1e8ed);
  border-radius: var(--border-radius, 8px);
  font-size: 13px;
  color: var(--text-color, #333);
  cursor: pointer;
  transition: background-color 0.3s;
}

.settings-button:hover, .theme-button:hover {
  background-color: var(--background-color-mute, #f2f2f2);
}

/* Voice command indicator */
.voice-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background-color: var(--background-color, #f8f9fa);
  border-radius: var(--border-radius, 8px);
  margin-top: auto;
  cursor: pointer;
  transition: background-color 0.3s;
  border: 1px solid var(--border-color, #e1e8ed);
}

.voice-indicator:hover {
  background-color: var(--background-color-mute, #f2f2f2);
}

.voice-indicator.active {
  background-color: rgba(52, 152, 219, 0.1);
  border-color: var(--primary-color, #3498db);
}

.voice-icon {
  color: var(--primary-color, #3498db);
}

.voice-text {
  font-size: 14px;
  font-weight: 500;
}

.voice-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--primary-color, #3498db);
  margin-left: auto;
  position: relative;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
  }
}

@media (prefers-color-scheme: dark) {
  .hamburger-button {
    background-color: var(--primary-color, #3498db);
  }
  
  .navigation-overlay {
    background-color: var(--background-color-alt, #222);
  }
  
  .search-form input {
    background-color: var(--background-color-mute, #282828);
    border-color: var(--border-color, rgba(84, 84, 84, 0.48));
    color: var(--color-text, rgba(235, 235, 235, 0.64));
  }
  
  .profile-avatar, .voice-indicator.active {
    background-color: rgba(52, 152, 219, 0.2);
  }
  
  .nav-links a:hover, .nav-links a.active,
  .settings-button, .theme-button,
  .user-profile, .voice-indicator {
    background-color: var(--background-color-mute, #282828);
  }
  
  .voice-indicator:hover, .settings-button:hover, .theme-button:hover {
    background-color: var(--background-color-soft, #222222);
  }
}
</style>