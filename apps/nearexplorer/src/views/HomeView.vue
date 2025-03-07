<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isFirstVisit = ref(true)

onMounted(() => {
  // Check if user has completed onboarding before
  const hasCompletedOnboarding = localStorage.getItem('nearexplorer-onboarding-completed')
  if (hasCompletedOnboarding === 'true') {
    isFirstVisit.value = false
  }
})

function startExploring() {
  if (isFirstVisit.value) {
    router.push('/onboarding')
  } else {
    router.push('/explore')
  }
}
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="hero-title">Discover the World Around You</h1>
      <p class="hero-subtitle">
        NearExplorer helps you find interesting places near you based on your preferences and context.
      </p>
      <button 
        class="btn btn-primary start-btn" 
        @click="startExploring" 
        v-voix="'start-exploring'"
        hint="Main button to begin using the app">
        {{ isFirstVisit ? 'Get Started' : 'Continue Exploring' }}
      </button>
    </div>
    
    <div class="features-section">
      <div class="feature-card">
        <div class="feature-icon">🗺️</div>
        <h3>Smart Recommendations</h3>
        <p>Discover places tailored to your interests, time of day, and context.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🔍</div>
        <h3>Easy Navigation</h3>
        <p>Get directions to interesting spots with just a tap.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">⭐</div>
        <h3>Save Favorites</h3>
        <p>Keep track of places you love and want to visit again.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero-section {
  text-align: center;
  padding: 4rem 1rem;
  background-image: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), 
                   url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="40" stroke="%233498db" stroke-width="2" fill="none"/></svg>');
  background-size: 120px;
  border-radius: 8px;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.start-btn {
  font-size: 1.1rem;
  padding: 1rem 2rem;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .features-section {
    grid-template-columns: 1fr;
  }
}
</style>
