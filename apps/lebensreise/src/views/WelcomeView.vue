<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (route) => {
  router.push(route)
}
</script>

<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <h1 class="welcome-title">Willkommen zu deiner LebensReise</h1>
      <p class="welcome-subtitle">Entdecke dich selbst durch Reflexion, Gewohnheiten und Stimmungen</p>
      
      <div class="welcome-cards">
        <div class="welcome-card" v-voix="'tagebuch-card'">
          <h2>Tagebuch</h2>
          <p>Halte deine täglichen Erlebnisse, Gedanken und Erfahrungen fest</p>
          <button 
            class="btn btn-primary"
            @click="navigateTo('/diary')"
            v-voix="'tagebuch-button'"
            hint="Klicken Sie hier, um zu Ihrem Tagebuch zu gelangen">
            Tagebuch schreiben
          </button>
        </div>
        
        <div class="welcome-card" v-voix="'gewohnheiten-card'">
          <h2>Gewohnheiten</h2>
          <p>Verfolge und verbessere deine täglichen Routinen und Gewohnheiten</p>
          <button 
            class="btn btn-primary"
            @click="navigateTo('/habits')"
            v-voix="'gewohnheiten-button'"
            hint="Klicken Sie hier, um Ihre Gewohnheiten zu verfolgen">
            Gewohnheiten tracken
          </button>
        </div>
        
        <div class="welcome-card" v-voix="'stimmung-card'">
          <h2>Stimmung</h2>
          <p>Beobachte deine emotionale Reise und entdecke Muster über die Zeit</p>
          <button 
            class="btn btn-primary"
            @click="navigateTo('/mood')"
            v-voix="'stimmung-button'"
            hint="Klicken Sie hier, um Ihre Stimmung zu dokumentieren">
            Stimmung eintragen
          </button>
        </div>
      </div>
      
      <div class="welcome-insights">
        <button 
          class="btn btn-secondary"
          @click="navigateTo('/insights')"
          v-voix="'insights-button'"
          hint="Klicken Sie hier, um Ihre persönlichen Einsichten zu sehen">
          Meine Einsichten ansehen
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.welcome-content {
  max-width: 1200px;
  width: 100%;
  text-align: center;
}

.welcome-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

.welcome-subtitle {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: var(--dark-text);
  opacity: 0.8;
}

.welcome-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.welcome-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
  transition: transform var(--transition-speed) ease;
}

.welcome-card:hover {
  transform: translateY(-5px);
}

.welcome-card h2 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.welcome-card p {
  margin-bottom: 1.5rem;
  color: var(--dark-text);
  opacity: 0.8;
}

.welcome-insights {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .welcome-cards {
    grid-template-columns: 1fr;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
}
</style>