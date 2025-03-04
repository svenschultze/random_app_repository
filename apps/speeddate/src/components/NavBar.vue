<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/dashboard" v-voix="'Navigate to Dashboard'" hint="Go to the main dashboard page">
      <i class="icon">🏠</i>
      <span>Home</span>
    </RouterLink>
    <RouterLink to="/matches" v-voix="'Navigate to Matches'" hint="See your speed dating matches">
      <i class="icon">❤️</i>
      <span>Matches</span>
    </RouterLink>
    <RouterLink to="/insights" v-voix="'Navigate to Insights'" hint="View your dating history and analytics">
      <i class="icon">📊</i>
      <span>Insights</span>
    </RouterLink>
    <RouterLink to="/settings" v-voix="'Navigate to Settings'" hint="Manage your profile and preferences">
      <i class="icon">⚙️</i>
      <span>Settings</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.navbar a {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #555;
  transition: color 0.3s;
}

.navbar a.router-link-active {
  color: #ff4b7d;
}

.icon {
  font-size: 1.5rem;
  margin-bottom: 3px;
}

span {
  font-size: 0.8rem;
}
</style>