<script setup>
import { useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import ComposeInput from '../components/ComposeInput.vue';

const router = useRouter();

function goBack() {
  router.go(-1);
}

function handleSubmit(thread) {
  // Navigate to the new thread
  router.push({ name: 'thread', params: { id: thread.id }});
}

function handleCancel() {
  goBack();
}
</script>

<template>
  <AppLayout>
    <div class="compose-view">
      <div class="compose-view__header">
        <button 
          class="compose-view__back-btn" 
          @click="goBack"
          v-voix="'Cancel'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h1 v-voix="'Compose new thread'">Compose Thread</h1>
      </div>
      
      <div class="compose-view__content">
        <ComposeInput 
          placeholder="What's on your mind?" 
          @submit="handleSubmit" 
          @cancel="handleCancel" 
          auto-focus
        />
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.compose-view {
  width: 100%;
}

.compose-view__header {
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

.compose-view__back-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--color-text);
  transition: background-color 0.2s;
}

.compose-view__back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.compose-view__header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.compose-view__content {
  padding-bottom: 2rem;
}

/* For dark mode */
:root[data-theme="dark"] .compose-view__header {
  background-color: rgba(21, 32, 43, 0.9);
}

:root[data-theme="dark"] .compose-view__back-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>