<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Navigate to route planning
const navigateToRoute = () => {
  router.push('/route')
}

// Navigate to ticket purchase
const navigateToTickets = () => {
  router.push('/tickets')
}

// Navigate to custom route planner
const navigateToPlanner = () => {
  router.push('/planner')
}
</script>

<template>
  <main class="home">
    <div class="hero">
      <div class="hero-content">
        <h1 v-voix="'stadtmobil-title'">StadtMobil</h1>
        <p class="tagline" v-voix="'stadtmobil-tagline'">Dein intelligenter Begleiter für den Nahverkehr</p>
        <p class="hero-prompt" v-voix="'journey-prompt'">Wohin möchtest du heute fahren?</p>
        
        <div class="action-cards">
          <div 
            class="action-card" 
            @click="navigateToRoute"
            v-voix="'plan-route-card'"
            hint="Klicken Sie hier, um eine Route zu planen">
            <div class="card-icon">🗺️</div>
            <h2>Route planen</h2>
            <p>Finde die schnellste Verbindung mit intelligenten Vorhersagen</p>
          </div>
          
          <div 
            class="action-card" 
            @click="navigateToTickets"
            v-voix="'buy-ticket-card'"
            hint="Klicken Sie hier, um ein Ticket zu kaufen">
            <div class="card-icon">🎫</div>
            <h2>Ticket kaufen</h2>
            <p>Entdecke unsere vielfältigen und flexiblen Ticketoptionen</p>
          </div>
          
          <div 
            class="action-card" 
            @click="navigateToPlanner"
            v-voix="'custom-planner-card'"
            hint="Klicken Sie hier, um den individuellen Routenplaner zu öffnen">
            <div class="card-icon">🔍</div>
            <h2>Individueller Planer</h2>
            <p>Plane deine eigene Route von A nach B mit dem umfassenden Routenplaner</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="features-preview">
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Schnelle Verbindungen</h3>
        <p>Intelligente Vorhersagen, die deine Zeit respektieren</p>
      </div>
      
      <div class="feature">
        <div class="feature-icon">💰</div>
        <h3>Clevere Preise</h3>
        <p>Automatische Preisanpassung für die besten Angebote</p>
      </div>
      
      <div class="feature">
        <div class="feature-icon">🔄</div>
        <h3>Echtzeit-Updates</h3>
        <p>Bleibe informiert über Verspätungen und Änderungen</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23007bff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.8;
}

.hero-content {
  max-width: 1200px;
  width: 100%;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  text-align: center;
}

h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #007bff;
  font-weight: 700;
}

.tagline {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #495057;
}

.hero-prompt {
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #212529;
  font-weight: 500;
}

.action-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;
}

.action-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 300px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.action-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h2 {
  margin-bottom: 1rem;
  color: #007bff;
}

.features-preview {
  display: flex;
  justify-content: space-around;
  padding: 4rem 2rem;
  background-color: white;
}

.feature {
  text-align: center;
  max-width: 300px;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature h3 {
  margin-bottom: 0.5rem;
  color: #343a40;
}

@media (max-width: 768px) {
  .action-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .action-card {
    width: 100%;
    max-width: 350px;
  }
  
  .features-preview {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  
  h1 {
    font-size: 3rem;
  }
  
  .hero-prompt {
    font-size: 1.5rem;
  }
}
</style>
