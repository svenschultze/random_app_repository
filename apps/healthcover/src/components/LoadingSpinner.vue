<script setup>
const props = defineProps({
  message: {
    type: String,
    default: 'Loading...'
  }
});
</script>

<template>
  <div class="loading">
    <div class="loading-spinner"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.loading-message {
  color: var(--primary-color);
  font-size: 0.9rem;
}
</style>