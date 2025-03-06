<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import GlobalSearch from '@/components/GlobalSearch.vue';
import SettingsPanel from '@/components/SettingsPanel.vue';

const route = useRoute();
const isSettingsOpen = ref(false);
const userSettings = ref({
  theme: 'light',
  autoRefresh: false,
  refreshInterval: 30,
  colorMode: 'default',
  showStatusIcons: true,
  compactView: false,
  showAllRoutes: false,
  logRetention: 100
});

// Determine if current route is one of the main pages
const isMainPage = computed(() => {
  return route.name === 'home' || route.name === 'about';
});

// Toggle settings panel
const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value;
};

// Update settings
const updateSettings = (settings) => {
  userSettings.value = settings;
};

// Apply theme based on settings
const applyTheme = () => {
  const { theme } = userSettings.value;
  const htmlElement = document.documentElement;
  
  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
};

// Watch for theme changes
watch(() => userSettings.value.theme, () => {
  applyTheme();
});

// Initialize
onMounted(() => {
  // Load settings from localStorage
  const savedSettings = localStorage.getItem('backdash_settings');
  if (savedSettings) {
    userSettings.value = JSON.parse(savedSettings);
  }
  
  // Apply theme
  applyTheme();
  
  // Watch for system theme changes if using system theme
  if (userSettings.value.theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyTheme);
  }
});
</script>

<template>
  <div class="app" :class="{ 'compact-view': userSettings.compactView }">
    <!-- Header/Navbar -->
    <header class="bg-gray-800 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center">
          <RouterLink to="/" class="text-xl font-bold flex items-center" v-voix="'app-logo'">
            <span class="text-blue-400 mr-1">Back</span><span>Dash</span>
          </RouterLink>
        </div>
        
        <div class="flex items-center space-x-6">
          <!-- Global Search -->
          <GlobalSearch />
          
          <!-- Main Navigation -->
          <nav class="hidden md:flex items-center space-x-4">
            <RouterLink to="/" class="px-3 py-2 rounded hover:bg-gray-700 transition-colors" v-voix="'home-nav-link'">
              Dashboard
            </RouterLink>
            <RouterLink to="/comparison" class="px-3 py-2 rounded hover:bg-gray-700 transition-colors" v-voix="'comparison-nav-link'">
              Comparison
            </RouterLink>
            <RouterLink to="/logs" class="px-3 py-2 rounded hover:bg-gray-700 transition-colors" v-voix="'logs-nav-link'">
              Logs
            </RouterLink>
            <RouterLink to="/insights" class="px-3 py-2 rounded hover:bg-gray-700 transition-colors" v-voix="'insights-nav-link'">
              Insights
            </RouterLink>
          </nav>
          
          <!-- Settings Button -->
          <button 
            v-voix="'settings-button'"
            hint="Open dashboard settings"
            @click="toggleSettings" 
            class="text-gray-300 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <!-- Mobile Menu Button (for future implementation) -->
          <button 
            v-voix="'mobile-menu-button'"
            class="text-gray-300 hover:text-white md:hidden"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <RouterView />

    <!-- Settings Panel -->
    <SettingsPanel
      :isOpen="isSettingsOpen"
      @close="isSettingsOpen = false"
      @updateSettings="updateSettings"
    />

    <!-- Footer (only on main pages) -->
    <footer v-if="isMainPage" class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <div class="text-lg font-semibold">BackDash</div>
            <div class="text-sm text-gray-400">Microservices Dashboard Demo</div>
          </div>
          
          <div class="flex items-center space-x-4">
            <RouterLink to="/about" class="text-gray-300 hover:text-white" v-voix="'about-footer-link'">
              About
            </RouterLink>
            <RouterLink to="/comparison" class="text-gray-300 hover:text-white" v-voix="'comparison-footer-link'">
              Compare Services
            </RouterLink>
          </div>
          
          <div class="text-sm text-gray-400 mt-4 md:mt-0">
            <p>All data is generated randomly upon page load</p>
            <p>© 2025 BackDash - Demo Project</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
@import '@/assets/main.css';
@import '@/assets/dark-mode.css';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: 500;
}

/* Compact view styles */
.compact-view .card,
.compact-view .bg-white,
.compact-view .rounded-lg {
  padding: 0.75rem !important;
}

.compact-view h1 {
  font-size: 1.5rem !important;
}

.compact-view h2 {
  font-size: 1.25rem !important;
}

.compact-view h3 {
  font-size: 1.125rem !important;
}

.compact-view .grid {
  gap: 0.75rem !important;
}

.compact-view .mb-8 {
  margin-bottom: 1.5rem !important;
}

.compact-view .mb-6 {
  margin-bottom: 1rem !important;
}

.compact-view .px-4 {
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}

.compact-view .py-6 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}
</style>
