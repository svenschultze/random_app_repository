<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="landing">
    <div class="hero">
      <div class="logo-container">
        <div class="logo">SpeedDate</div>
      </div>
      <h1 v-voix="'SpeedDate app title'">SpeedDate</h1>
      <h2 v-voix="'SpeedDate app tagline'">Find meaningful connections in just 5 minutes</h2>
      
      <div class="cta-container">
        <RouterLink 
          to="/register" 
          class="cta-button" 
          v-voix="'Get Started Button'"
          hint="Click to begin the registration process">
          Get Started
        </RouterLink>
        <RouterLink 
          to="/onboarding" 
          class="secondary-button" 
          v-voix="'Learn More Button'"
          hint="Click to see how the app works">
          Learn More
        </RouterLink>
      </div>
    </div>
    
    <div class="features">
      <div class="feature-card">
        <div class="feature-icon">⏱️</div>
        <h3>Quick 5-minute dates</h3>
        <p>No awkward long meetings. Just 5 minutes to see if you click.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">👋</div>
        <h3>Meet people instantly</h3>
        <p>No endless swiping. Get matched and start talking right away.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🔍</div>
        <h3>Quality connections</h3>
        <p>Find people based on genuine interaction, not just photos.</p>
      </div>
    </div>
    
    <footer class="landing-footer">
      <p>&copy; 2025 SpeedDate. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.landing {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #ff4b7d, #ff7eb3);
  color: #fff;
}

.hero {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.logo-container {
  margin-bottom: 1rem;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

h2 {
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
}

.cta-button, .secondary-button {
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.2s, background-color 0.2s;
}

.cta-button {
  background-color: white;
  color: #ff4b7d;
}

.cta-button:hover {
  transform: translateY(-3px);
  background-color: #f8f8f8;
}

.secondary-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
}

.secondary-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 3rem 2rem;
  background-color: white;
  color: #333;
}

.feature-card {
  text-align: center;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: #ff4b7d;
}

.landing-footer {
  background-color: #333;
  color: #fff;
  padding: 1.5rem;
  text-align: center;
  margin-top: auto;
}

@media (min-width: 768px) {
  .features {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .cta-container {
    flex-direction: row;
    max-width: 400px;
  }
}
</style>