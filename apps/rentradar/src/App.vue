<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFavoritesStore } from '@/stores/favorites'
import { useAlertsStore } from '@/stores/alerts'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const alertsStore = useAlertsStore()
const toast = useToast()

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
    toast.add({
      severity: 'success',
      summary: 'Signed Out',
      detail: 'You have been successfully signed out',
      life: 3000
    })
    router.push('/')
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to sign out. Please try again.',
      life: 3000
    })
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
    <Toast position="top-right" />
    
    <!-- Header and Navigation -->
    <div class="header">
      <Menubar :model="menuItems" class="main-menu">
        <template #start>
          <div class="logo" @click="router.push('/')">
            <img alt="RentRadar logo" class="logo-img" src="@/assets/logo.svg" width="40" height="40" />
            <span class="logo-text">RentRadar</span>
          </div>
        </template>
        <template #end>
          <Menubar :model="userMenuItems" class="user-menu" />
        </template>
      </Menubar>
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
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: var(--surface-card);
  padding: 1rem;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links a {
  margin-left: 1rem;
  color: var(--primary-color);
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

/* Logo styles */
.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 0.5rem;
  color: var(--primary-color);
}

/* Menu styles */
.main-menu {
  background-color: var(--surface-card);
}

.user-menu {
  background: transparent;
  border: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .footer-links {
    display: flex;
    gap: 1rem;
  }
  
  .footer-links a {
    margin-left: 0;
  }
}
</style>
