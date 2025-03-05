<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFavoritesStore } from '@/stores/favorites'
import { useAlertsStore } from '@/stores/alerts'
// No longer need to import Toast
// Custom toast implementation
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.setAttribute('role', 'alert')
  
  const iconMap = {
    success: 'pi pi-check-circle',
    error: 'pi pi-times-circle',
    warning: 'pi pi-exclamation-triangle',
    info: 'pi pi-info-circle'
  }
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="${iconMap[type] || iconMap.info}"></i>
    </div>
    <div class="toast-content">
      <p>${message}</p>
    </div>
    <button class="toast-close" aria-label="Close notification">
      <i class="pi pi-times"></i>
    </button>
  `
  
  const container = document.getElementById('toast-container')
  if (container) {
    container.appendChild(toast)
    
    // Auto remove after duration
    setTimeout(() => {
      toast.classList.add('toast-hiding')
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast)
        }
      }, 300)
    }, duration)
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.classList.add('toast-hiding')
        setTimeout(() => {
          if (container.contains(toast)) {
            container.removeChild(toast)
          }
        }, 300)
      })
    }
  }
}

// For user dropdown menu
const userMenuOpen = ref(false)

const router = useRouter()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const alertsStore = useAlertsStore()
// Using our custom toast implementation

const userMenuItems = ref([])
const menuItems = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => router.push('/')
  },
  {
    label: 'Listings',
    icon: 'pi pi-list',
    command: () => router.push('/listings')
  }
])

// Update menu items based on authentication state
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isLandlord = computed(() => authStore.isLandlord)

// Initialize user menu based on authentication
watch(() => isAuthenticated.value, (newValue) => {
  if (newValue) {
    // User is logged in
    userMenuItems.value = [
      {
        label: authStore.user?.displayName || authStore.user?.email,
        icon: 'pi pi-user',
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-cog',
            command: () => router.push('/profile')
          },
          {
            label: 'Favorites',
            icon: 'pi pi-heart',
            command: () => router.push('/favorites')
          },
          {
            label: 'Alerts',
            icon: 'pi pi-bell',
            command: () => router.push('/alerts')
          },
          {
            separator: true
          },
          {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => handleSignOut()
          }
        ]
      }
    ]
    
    // Add landlord portal if user is a landlord
    if (isLandlord.value) {
      menuItems.value.push({
        label: 'Landlord Portal',
        icon: 'pi pi-building',
        command: () => router.push('/landlord')
      })
    }
    
    // Fetch user-specific data
    favoritesStore.fetchFavorites()
    alertsStore.fetchAlerts()
  } else {
    // User is logged out
    userMenuItems.value = [
      {
        label: 'Account',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Sign In',
            icon: 'pi pi-sign-in',
            command: () => router.push('/login')
          },
          {
            label: 'Create Account',
            icon: 'pi pi-user-plus',
            command: () => router.push('/signup')
          }
        ]
      }
    ]
    
    // Remove landlord portal if it exists
    const landlordIndex = menuItems.value.findIndex(item => item.label === 'Landlord Portal')
    if (landlordIndex !== -1) {
      menuItems.value.splice(landlordIndex, 1)
    }
  }
}, { immediate: true })

// Handle sign out
async function handleSignOut() {
  try {
    await authStore.signOut()
    favoritesStore.clearFavorites()
    alertsStore.clearAlerts()
    showToast('You have been successfully signed out', 'success')
    router.push('/')
  } catch (error) {
    showToast('Failed to sign out. Please try again.', 'error')
  }
}

// Add About to the menu
menuItems.value.push({
  label: 'About',
  icon: 'pi pi-info-circle',
  command: () => router.push('/about')
})

onMounted(() => {
  // Initialize auth state
  if (authStore.user) {
    favoritesStore.fetchFavorites()
    alertsStore.fetchAlerts()
  }
})
</script>

<template>
  <div class="app-container">
    <!-- Toast notifications -->
    <div id="toast-container" class="toast-container" aria-live="polite" v-voix="'Notification Area'" hint="Displays important notifications and alerts"></div>
    
    <!-- Header and Navigation -->
    <div class="header">
      <nav class="main-menu" v-voix="'Main Navigation Menu'" hint="Primary navigation menu with links to main sections of the site">
        <div class="nav-container">
          <div class="nav-start">
            <div class="logo" @click="router.push('/')" v-voix="'RentRadar Logo'" hint="Click to go to the home page">
              <img alt="RentRadar logo" class="logo-img" src="@/assets/logo.svg" width="40" height="40" />
              <span class="logo-text">RentRadar</span>
            </div>
            <ul class="nav-links">
              <li v-for="item in menuItems" :key="item.label">
                <a 
                  href="#" 
                  @click.prevent="item.command"
                  class="nav-link"
                  v-voix="item.label + ' Navigation Link'"
                >
                  <i v-if="item.icon" :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div class="nav-end">
            <!-- User menu -->
            <div class="user-menu" v-voix="'User Account Menu'" hint="Access your account settings, favorites, alerts, or sign in/out">
              <button 
                class="user-menu-button" 
                @click="userMenuOpen = !userMenuOpen"
                aria-haspopup="true"
                :aria-expanded="userMenuOpen"
              >
                <i class="pi pi-user"></i>
                <span>{{ isAuthenticated ? (authStore.user?.displayName || authStore.user?.email) : 'Account' }}</span>
                <i class="pi pi-chevron-down"></i>
              </button>
              
              <div v-if="userMenuOpen" class="user-dropdown">
                <ul>
                  <template v-if="isAuthenticated">
                    <li>
                      <a href="#" @click.prevent="router.push('/profile')">
                        <i class="pi pi-cog"></i>
                        <span>Profile</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" @click.prevent="router.push('/favorites')">
                        <i class="pi pi-heart"></i>
                        <span>Favorites</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" @click.prevent="router.push('/alerts')">
                        <i class="pi pi-bell"></i>
                        <span>Alerts</span>
                      </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                      <a href="#" @click.prevent="handleSignOut">
                        <i class="pi pi-sign-out"></i>
                        <span>Sign Out</span>
                      </a>
                    </li>
                  </template>
                  <template v-else>
                    <li>
                      <a href="#" @click.prevent="router.push('/login')">
                        <i class="pi pi-sign-in"></i>
                        <span>Sign In</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" @click.prevent="router.push('/signup')">
                        <i class="pi pi-user-plus"></i>
                        <span>Create Account</span>
                      </a>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    
    <!-- Main Content -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; {{ new Date().getFullYear() }} RentRadar. All rights reserved.</p>
        <div class="footer-links">
          <a href="#" v-voix="'Terms Link'" hint="View the terms and conditions of using RentRadar">Terms</a>
          <a href="#" v-voix="'Privacy Link'" hint="View the privacy policy of RentRadar">Privacy</a>
          <a href="#" v-voix="'Contact Link'" hint="Contact RentRadar support or team">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global styles */
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-family);
  background-color: var(--surface-ground);
  color: var(--text-color);
}

/* Layout styles */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  animation: fadeIn 0.5s ease-in-out;
}

.footer {
  background-color: var(--surface-card);
  padding: 2rem 1rem;
  margin-top: 2rem;
  border-top: 1px solid var(--surface-border);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links a {
  margin-left: 1.5rem;
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition-ease);
  font-weight: 500;
}

.footer-links a:hover {
  color: var(--primary-600);
  text-decoration: underline;
}

/* Logo styles */
.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: var(--transition-ease);
}

.logo:hover {
  transform: scale(1.05);
}

.logo-img {
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  margin-left: 0.5rem;
  color: var(--primary-color);
  letter-spacing: -0.5px;
}

/* Menu styles */
.main-menu {
  background-color: white;
  border: none;
  padding: 0.5rem 1rem;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.nav-start {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-left: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: background-color 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background-color: var(--surface-50);
  text-decoration: none;
}

.nav-link i {
  color: var(--primary-500);
}

.user-menu {
  position: relative;
}

.user-menu-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  color: var(--text-color);
  font-weight: 500;
  transition: background-color 0.2s;
}

.user-menu-button:hover {
  background-color: var(--surface-50);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.user-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.user-dropdown li {
  padding: 0;
}

.user-dropdown a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
}

.user-dropdown a:hover {
  background-color: var(--surface-50);
  text-decoration: none;
}

.user-dropdown .divider {
  border-top: 1px solid var(--surface-200);
  margin: 0.5rem 0;
}

/* Toast styles */
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: toastIn 0.3s ease forwards;
  max-width: 100%;
}

.toast-hiding {
  animation: toastOut 0.3s ease forwards;
}

.toast-icon {
  flex-shrink: 0;
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.toast-content {
  flex-grow: 1;
  padding-right: 1.5rem;
}

.toast-content p {
  margin: 0;
  font-size: 0.9rem;
}

.toast-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 0.25rem;
  font-size: 0.875rem;
}

.toast-success .toast-icon {
  color: #28a745;
}

.toast-error .toast-icon {
  color: #dc3545;
}

.toast-warning .toast-icon {
  color: #ffc107;
}

.toast-info .toast-icon {
  color: #17a2b8;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes toastOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0.5rem;
  }
  
  .footer {
    padding: 1.5rem 1rem;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .footer-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  
  .footer-links a {
    margin-left: 0;
    margin-right: 0;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
}
</style>
