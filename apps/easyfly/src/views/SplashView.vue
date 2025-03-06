<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Redirect to home after 2 seconds
  setTimeout(() => {
    router.push('/')
  }, 2000)
})
</script>

<template>
  <div class="splash-view" v-voix="'Splash Screen'">
    <img alt="EasyFly logo" src="@/assets/logo.svg" class="logo" width="150" height="150" />
    <h1>EasyFly</h1>
    <p>Book flights with ease</p>
    <div class="loading-indicator" aria-hidden="true">
      <div class="loader"></div>
    </div>
  </div>
</template>

<style scoped>
.splash-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #4a90e2;
  color: white;
  text-align: center;
}

.logo {
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.loading-indicator {
  margin-top: 2rem;
}

.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid white;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>