<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useCalendarStore } from './stores/calendar'
import { useNotificationsStore } from './stores/notifications'

const calendarStore = useCalendarStore()
const notificationsStore = useNotificationsStore()
const route = useRoute()

const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
const unreadCount = ref(0)

// Watch for changes in notification count
watch(() => notificationsStore.getUnreadCount, (newCount) => {
  unreadCount.value = newCount
})

onMounted(() => {
  // Initialize dark mode based on user preference
  if (calendarStore.darkMode) {
    document.documentElement.classList.add('dark')
  }
  
  // Get initial unread count
  unreadCount.value = notificationsStore.getUnreadCount
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleDarkMode = () => {
  calendarStore.toggleDarkMode()
}

const toggleNotificationsPanel = () => {
  notificationsStore.toggleNotificationsPanel()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- Top navigation -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Mobile menu button -->
            <button 
              v-voix="'toggle-mobile-menu'" 
              hint="Open main menu on mobile devices" 
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 lg:hidden"
              @click="toggleMobileMenu"
            >
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <RouterLink v-voix="'logo-link'" to="/" class="flex items-center">
                <img class="h-8 w-auto mr-2" src="@/assets/logo.svg" alt="ChronoSync Logo" />
                <span class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">ChronoSync</span>
              </RouterLink>
            </div>
            
            <!-- Desktop Navigation -->
            <nav class="hidden lg:ml-6 lg:flex lg:space-x-4">
              <RouterLink 
                v-voix="'nav-home'" 
                to="/" 
                class="px-3 py-2 rounded-md text-sm font-medium"
                :class="route.path === '/' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                Home
              </RouterLink>
              <RouterLink 
                v-voix="'nav-calendar'" 
                to="/calendar" 
                class="px-3 py-2 rounded-md text-sm font-medium"
                :class="route.path === '/calendar' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                Calendar
              </RouterLink>
              <RouterLink 
                v-voix="'nav-tasks'" 
                to="/tasks" 
                class="px-3 py-2 rounded-md text-sm font-medium"
                :class="route.path === '/tasks' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                Tasks
              </RouterLink>
              <RouterLink 
                v-voix="'nav-analytics'" 
                to="/analytics" 
                class="px-3 py-2 rounded-md text-sm font-medium"
                :class="route.path === '/analytics' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                Analytics
              </RouterLink>
              <RouterLink 
                v-voix="'nav-availability'" 
                to="/availability" 
                class="px-3 py-2 rounded-md text-sm font-medium"
                :class="route.path === '/availability' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
              >
                Availability
              </RouterLink>
            </nav>
          </div>
          
          <!-- Right side buttons -->
          <div class="flex items-center">
            <!-- Role selector -->
            <div class="hidden md:block mr-4">
              <select 
                v-voix="'role-selector'" 
                hint="Change your role to see different permission levels"
                v-model="calendarStore.currentRole"
                class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3 text-sm"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
                <option value="guest">Guest</option>
              </select>
            </div>
            
            <!-- Notification Bell -->
            <button 
              v-voix="'notifications-button'" 
              hint="View notifications"
              class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 relative"
              @click="toggleNotificationsPanel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span v-if="unreadCount > 0" class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </button>
            
            <!-- Dark Mode Toggle -->
            <button 
              v-voix="'dark-mode-toggle'" 
              hint="Toggle between dark and light mode"
              class="ml-3 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              @click="toggleDarkMode"
            >
              <svg v-if="calendarStore.darkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            
            <!-- Settings -->
            <RouterLink 
              v-voix="'settings-link'" 
              to="/settings"
              class="ml-3 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </RouterLink>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu (shown/hidden based on menu state) -->
      <div v-if="isMobileMenuOpen" class="lg:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <RouterLink 
            v-voix="'mobile-nav-home'" 
            to="/" 
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="route.path === '/' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="isMobileMenuOpen = false"
          >
            Home
          </RouterLink>
          <RouterLink 
            v-voix="'mobile-nav-calendar'" 
            to="/calendar" 
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="route.path === '/calendar' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="isMobileMenuOpen = false"
          >
            Calendar
          </RouterLink>
          <RouterLink 
            v-voix="'mobile-nav-tasks'" 
            to="/tasks" 
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="route.path === '/tasks' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="isMobileMenuOpen = false"
          >
            Tasks
          </RouterLink>
          <RouterLink 
            v-voix="'mobile-nav-analytics'" 
            to="/analytics" 
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="route.path === '/analytics' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="isMobileMenuOpen = false"
          >
            Analytics
          </RouterLink>
          <RouterLink 
            v-voix="'mobile-nav-availability'" 
            to="/availability" 
            class="block px-3 py-2 rounded-md text-base font-medium"
            :class="route.path === '/availability' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="isMobileMenuOpen = false"
          >
            Availability
          </RouterLink>
          <div class="px-3 py-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select 
              v-voix="'mobile-role-selector'" 
              hint="Change your role to see different permission levels"
              v-model="calendarStore.currentRole"
              class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3 text-sm w-full"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
              <option value="guest">Guest</option>
            </select>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Notifications panel (if shown) -->
    <div v-if="notificationsStore.showNotificationsPanel" class="absolute right-0 mt-16 z-10 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
        <button 
          v-voix="'mark-all-read'" 
          hint="Mark all notifications as read"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          @click="notificationsStore.markAllAsRead"
        >
          Mark all as read
        </button>
      </div>
      <div class="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
        <div 
          v-for="notification in notificationsStore.notifications" 
          :key="notification.id"
          class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
          :class="{ 'bg-indigo-50 dark:bg-indigo-900/20': !notification.isRead }"
        >
          <div class="flex items-start">
            <!-- Notification icon based on type -->
            <div class="flex-shrink-0 mt-0.5">
              <svg v-if="notification.type === 'reminder'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <svg v-else-if="notification.type === 'approval'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              <svg v-else-if="notification.type === 'followup'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else-if="notification.type === 'mention'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            
            <!-- Notification content -->
            <div class="ml-3 flex-1">
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ notification.message }}</p>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </p>
            </div>
            
            <!-- Mark as read button -->
            <button 
              v-voix="'mark-notification-read'" 
              hint="Mark notification as read"
              class="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              @click="notificationsStore.markAsRead(notification.id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Empty state if no notifications -->
        <div v-if="notificationsStore.notifications.length === 0" class="px-4 py-8 text-center">
          <p class="text-gray-500 dark:text-gray-400">No notifications</p>
        </div>
      </div>
      
      <!-- Generate sample notifications for demo -->
      <div class="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
        <button 
          v-voix="'demo-notification'" 
          hint="Create demo notification"
          class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded"
          @click="notificationsStore.simulateNewNotification('reminder')"
        >
          Generate Demo Notification
        </button>
      </div>
    </div>
    
    <!-- Main content -->
    <main class="flex-1 overflow-hidden">
      <RouterView />
    </main>
    
    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">
            &copy; 2025 ChronoSync Demo. Developed with Vue.js
          </div>
          <div class="flex space-x-4">
            <RouterLink 
              v-voix="'footer-about'" 
              to="/about" 
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              About
            </RouterLink>
            <a 
              v-voix="'footer-help'"
              href="#" 
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Help
            </a>
            <a 
              v-voix="'footer-privacy'"
              href="#" 
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
