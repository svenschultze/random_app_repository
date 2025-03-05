<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EmptyState from '../components/common/EmptyState.vue'

const router = useRouter()
const route = useRoute()

// Navigate back to dashboard
const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="group-chat-view">
    <header class="chat-header">
      <button 
        class="back-button" 
        @click="goBack"
        v-voix="'back-to-dashboard-button'"
        hint="Return to the chat list"
      >
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      
      <h1 class="title">Group Chat</h1>
    </header>
    
    <div class="coming-soon">
      <EmptyState
        title="Coming Soon"
        description="Group chat functionality will be available in a future update."
        icon="groups"
      >
        <button 
          class="btn-primary" 
          @click="goBack"
          v-voix="'return-to-dashboard-button'"
          hint="Return to the dashboard"
        >
          Return to Dashboard
        </button>
      </EmptyState>
    </div>
  </div>
</template>

<style scoped>
.group-chat-view {
  padding: 1rem;
  min-height: 100vh;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background-color: var(--light-bg);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
}
</style>