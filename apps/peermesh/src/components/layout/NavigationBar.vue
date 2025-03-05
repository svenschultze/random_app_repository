<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userProfileStore } from '../../store'

const router = useRouter()
const profile = computed(() => userProfileStore.getState().profile)
const isMenuOpen = ref(false)

const navigateTo = (path) => {
  router.push(path)
  isMenuOpen.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand" v-voix="'peermesh-logo'">
        <span class="logo">PeerMesh</span>
      </div>
      
      <div class="navbar-menu">
        <button 
          class="btn-icon menu-toggle" 
          @click="toggleMenu" 
          v-voix="'toggle-navigation-menu'"
          hint="Opens the navigation menu"
        >
          <span class="material-symbols-outlined">menu</span>
        </button>
        
        <div class="navbar-links" :class="{ 'is-active': isMenuOpen }">
          <button 
            class="navbar-item" 
            @click="navigateTo('/dashboard')" 
            v-voix="'navigate-to-dashboard'"
            hint="Go to chat dashboard"
          >
            <span class="material-symbols-outlined">chat</span>
            <span>Chats</span>
          </button>
          
          <button 
            class="navbar-item" 
            @click="navigateTo('/pairing')" 
            v-voix="'navigate-to-pairing'"
            hint="Go to connection management"
          >
            <span class="material-symbols-outlined">link</span>
            <span>Connect</span>
          </button>
          
          <button 
            class="navbar-item" 
            @click="navigateTo('/settings')" 
            v-voix="'navigate-to-settings'"
            hint="Go to application settings"
          >
            <span class="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </button>
          
          <div class="navbar-item profile" @click="navigateTo('/settings')">
            <div class="avatar">
              <img v-if="profile && profile.avatar" :src="profile.avatar" alt="Profile photo" />
              <span v-else class="material-symbols-outlined">person</span>
            </div>
            <span>{{ profile ? profile.name : 'Profile' }}</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.navbar-menu {
  position: relative;
}

.menu-toggle {
  display: block;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.material-symbols-outlined {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48;
  font-size: 1.5rem;
  color: var(--text-secondary);
}

.navbar-links {
  display: none;
  flex-direction: column;
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 0.5rem 0;
  z-index: 20;
}

.navbar-links.is-active {
  display: flex;
}

.navbar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: transparent;
  border: none;
  width: 100%;
  text-align: left;
  color: var(--text-primary);
}

.navbar-item:hover {
  background-color: var(--light-bg);
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--light-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile {
  border-top: 1px solid var(--border-color);
  margin-top: 0.5rem;
  padding-top: 0.75rem;
}

@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }
  
  .navbar-links {
    display: flex;
    flex-direction: row;
    position: static;
    width: auto;
    box-shadow: none;
    padding: 0;
    align-items: center;
  }
  
  .navbar-links.is-active {
    display: flex;
  }
  
  .navbar-item {
    padding: 0.5rem 0.75rem;
  }
  
  .profile {
    border-top: none;
    margin-top: 0;
    padding-top: 0;
    margin-left: 1rem;
  }
}
</style>