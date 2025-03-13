<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEmailStore } from '@/stores/emailStore';

const router = useRouter();
const route = useRoute();
const emailStore = useEmailStore();

// Check if a route is active
const isActive = (routeName) => {
  return route.name === routeName;
};

// Navigate to a route
const navigateTo = (routeName) => {
  if (routeName === 'inbox') {
    emailStore.setCurrentView('inbox');
  } else if (routeName === 'sent') {
    emailStore.setCurrentView('sent');
  }
  router.push({ name: routeName });
};

// Compose a new email
const composeEmail = () => {
  router.push({ name: 'email-compose' });
};
</script>

<template>
  <div class="navigation-container">
    <!-- Material Design FAB (Floating Action Button) -->
    <button 
      @click="composeEmail" 
      class="compose-fab"
      v-voix:role="'button'"
      v-voix:label="'Compose new email'"
    >
      <span class="material-icons">edit</span>
    </button>
    
    <!-- Bottom Navigation -->
    <nav 
      class="bottom-navigation"
      v-voix:role="'navigation'"
      v-voix:label="'Main navigation'"
    >
      <button 
        @click="navigateTo('inbox')" 
        class="nav-button" 
        :class="{ 'active': isActive('inbox') }"
        v-voix:role="'button'"
        v-voix:label="'Inbox'"
        v-voix:pressed="isActive('inbox')"
      >
        <div class="nav-icon">📨</div>
        <div class="nav-label">Inbox</div>
      </button>
      
      <button 
        @click="navigateTo('sent')" 
        class="nav-button" 
        :class="{ 'active': isActive('sent') }"
        v-voix:role="'button'"
        v-voix:label="'Sent emails'"
        v-voix:pressed="isActive('sent')"
      >
        <div class="nav-icon">📤</div>
        <div class="nav-label">Sent</div>
      </button>
      
      <button 
        @click="navigateTo('settings')" 
        class="nav-button" 
        :class="{ 'active': isActive('settings') }"
        v-voix:role="'button'"
        v-voix:label="'Settings'"
        v-voix:pressed="isActive('settings')"
      >
        <div class="nav-icon">⚙️</div>
        <div class="nav-label">Settings</div>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.navigation-container {
  position: relative;
}

.bottom-navigation {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 100;
}

.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 8px;
  border: none;
  background: none;
  cursor: pointer;
  color: #666;
  flex: 1;
}

.nav-button.active {
  color: #1a73e8;
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-label {
  font-size: 12px;
}

/* Material Design FAB (Floating Action Button) */
.compose-fab {
  position: fixed;
  bottom: 70px; /* Position above the bottom navigation */
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: #1a73e8;
  color: white;
  border: none;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  z-index: 101;
  font-weight: bold;
}

.compose-fab:hover {
  background-color: #1765cc;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
  transform: translateX(-50%) scale(1.05);
}

.compose-fab:active {
  transform: translateX(-50%) scale(0.95);
}

.material-icons {
  font-size: 24px;
  line-height: 1;
}

@media (min-width: 768px) {
  .bottom-navigation {
    padding: 12px 0;
  }
  
  .nav-label {
    font-size: 14px;
  }
}
</style>