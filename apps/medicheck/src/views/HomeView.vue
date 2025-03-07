<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1 class="title" v-voix="'home-title'">Welcome to MediCheck</h1>
      <p class="subtitle" v-voix="'home-subtitle'">Your trusted health companion for symptom assessment and medical guidance</p>
      <RouterLink to="/symptom-checker" class="cta-button" v-voix="'start-symptom-check'">
        Start Symptom Check
      </RouterLink>
    </section>

    <section class="features">
      <h2 v-voix="'features-heading'">How MediCheck helps you</h2>
      
      <div class="feature-grid">
        <div class="feature-card">
          <div class="icon">📋</div>
          <h3 v-voix="'symptom-analysis-heading'">Symptom Analysis</h3>
          <p>Input your symptoms and get potential diagnoses based on reliable medical data.</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">🩺</div>
          <h3 v-voix="'health-advice-heading'">Health Advice</h3>
          <p>Receive evidence-based recommendations for managing your symptoms.</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">📱</div>
          <h3 v-voix="'health-tracking-heading'">Health Tracking</h3>
          <p>Monitor your symptoms over time and keep a record of your health journey.</p>
        </div>
        
        <div class="feature-card">
          <div class="icon">🔒</div>
          <h3 v-voix="'privacy-heading'">Privacy First</h3>
          <p>Your health data is encrypted and handled with the highest privacy standards.</p>
        </div>
      </div>
    </section>

    <section class="disclaimer-section">
      <div class="disclaimer-box">
        <h3 v-voix="'important-notice-heading'">Important Notice</h3>
        <p>
          MediCheck is designed to provide information and suggestions only. It is not a replacement for 
          professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare 
          provider for medical concerns.
        </p>
        <p>
          If you're experiencing a medical emergency, please call your local emergency number immediately.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.hero {
  text-align: center;
  padding: 2rem 1rem;
  background-color: #f0f9ff;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  color: #2563eb;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.25rem;
  color: #4b5563;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  background-color: #2563eb;
  color: white;
  font-weight: bold;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.125rem;
  transition: background-color 0.2s, transform 0.2s;
}

.cta-button:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
}

.features {
  padding: 1rem;
}

.features h2 {
  text-align: center;
  font-size: 2rem;
  color: #1e40af;
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #4b5563;
  line-height: 1.6;
}

.disclaimer-section {
  padding: 1rem;
}

.disclaimer-box {
  background-color: #fff8f1;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 1.5rem;
}

.disclaimer-box h3 {
  color: #9a3412;
  margin-bottom: 0.5rem;
}

.disclaimer-box p {
  color: #7c2d12;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.disclaimer-box p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
