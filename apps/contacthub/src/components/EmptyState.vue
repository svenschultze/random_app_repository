<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'No contacts found'
  },
  message: {
    type: String,
    default: 'Try adding a new contact.'
  }
});
</script>

<template>
  <div class="empty-state">
    <div class="empty-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    </div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 2rem 0;
}

.empty-icon {
  margin-bottom: 1.5rem;
  color: #b0b0b0;
}

h3 {
  margin: 0 0 0.75rem;
  color: #444;
  font-size: 1.5rem;
}

p {
  margin: 0 0 2rem;
  color: #777;
  max-width: 400px;
}

</style>