<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToSignup = () => {
  router.push('/signup')
}

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1 v-voix="'home-title'">Find Your Perfect Match</h1>
      <p class="subtitle">Swipe right on your dream job or ideal candidate</p>
      
      <div class="cta-buttons">
        <button 
          class="btn btn-primary" 
          @click="navigateToSignup"
          v-voix="'signup-btn'"
          hint="Create a new account"
        >
          Get Started
        </button>
        
        <button 
          class="btn btn-secondary" 
          @click="navigateToLogin"
          v-voix="'login-btn'"
          hint="Login to your existing account"
        >
          Login
        </button>
      </div>
    </section>
    
    <section class="features">
      <h2 v-voix="'features-heading'">How It Works</h2>
      
      <div class="feature-grid">
        <div class="feature-card">
          <h3>For Job Seekers</h3>
          <p>Create a profile highlighting your skills and experience. Swipe through job postings that match your preferences.</p>
        </div>
        
        <div class="feature-card">
          <h3>For Companies</h3>
          <p>Post your job openings and company details. Swipe through qualified candidates to find the perfect match.</p>
        </div>
        
        <div class="feature-card">
          <h3>Match & Connect</h3>
          <p>When both parties swipe right, it's a match! Connect through in-app messaging to schedule interviews.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero {
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  border-radius: 12px;
  color: white;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  font-size: 1rem;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: #ff5757;
  color: white;
}

.btn-secondary {
  background-color: white;
  color: #333;
}

.features {
  margin-top: 3rem;
}

.features h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  margin-bottom: 1rem;
  color: #ff5757;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.2rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
    margin-bottom: 1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
