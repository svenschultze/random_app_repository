<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToOnboarding = () => {
  router.push('/onboarding')
}
</script>

<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="logo-container">
        <h1 class="brand" v-voix="'app-name'">PeerMesh Chat</h1>
        <div class="tagline" v-voix="'app-tagline'">Secure. Decentralized. Private.</div>
      </div>
      
      <div class="features">
        <div class="feature">
          <div class="feature-icon">
            <span class="material-symbols-outlined">lock</span>
          </div>
          <div class="feature-text">
            <h3>Secure by Design</h3>
            <p>End-to-end encryption without central servers storing your data.</p>
          </div>
        </div>
        
        <div class="feature">
          <div class="feature-icon">
            <span class="material-symbols-outlined">hub</span>
          </div>
          <div class="feature-text">
            <h3>Peer-to-Peer</h3>
            <p>Direct connections between devices without intermediaries.</p>
          </div>
        </div>
        
        <div class="feature">
          <div class="feature-icon">
            <span class="material-symbols-outlined">devices</span>
          </div>
          <div class="feature-text">
            <h3>Works Everywhere</h3>
            <p>Use it on any device with a modern web browser.</p>
          </div>
        </div>
      </div>
      
      <div class="cta">
        <button 
          class="btn-primary get-started" 
          @click="navigateToOnboarding"
          v-voix="'get-started-button'"
          hint="Start creating your profile"
        >
          Get Started
        </button>
      </div>
      
      <div class="info-text">
        <p>
          PeerMesh Chat is a demonstration of serverless, peer-to-peer web technologies.
          Your data stays on your device and is shared directly with your contacts.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%);
}

.welcome-content {
  max-width: 800px;
  width: 100%;
}

.logo-container {
  text-align: center;
  margin-bottom: 3rem;
}

.brand {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.tagline {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature {
  display: flex;
  align-items: flex-start;
  background-color: white;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.feature-icon {
  margin-right: 1rem;
  background-color: rgba(79, 70, 229, 0.1);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon .material-symbols-outlined {
  color: var(--primary-color);
}

.feature-text h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.feature-text p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.cta {
  text-align: center;
  margin-bottom: 2rem;
}

.get-started {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
}

.info-text {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  max-width: 600px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .brand {
    font-size: 3rem;
  }
  
  .features {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .feature {
    flex-direction: column;
    text-align: center;
  }
  
  .feature-icon {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 4rem;
    height: 4rem;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>