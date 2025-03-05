<script setup>
// Simple placeholder for the session view
</script>

<template>
  <div class="session-container">
    <h1 v-voix="'session-title'">Session</h1>
    <p>This is a placeholder for the Session view. In a complete implementation, this would include a video chat interface for skill exchange sessions.</p>
  </div>
</template>

<style scoped>
.session-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.session-container h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-color);
}
</style>