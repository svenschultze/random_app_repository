<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const services = ref([
  {
    id: 'id-card',
    title: 'Personalausweis',
    description: 'Beantragen oder verlängern Sie Ihren Personalausweis',
    icon: '📇',
    popular: true
  },
  {
    id: 'passport',
    title: 'Reisepass',
    description: 'Beantragen oder verlängern Sie Ihren Reisepass',
    icon: '🛂',
    popular: true
  },
  {
    id: 'address-change',
    title: 'Ummeldung',
    description: 'Melden Sie Ihren neuen Wohnsitz an',
    icon: '🏠',
    popular: true
  },
  {
    id: 'buergergeld',
    title: 'Bürgergeld',
    description: 'Beantragen Sie Bürgergeld oder Grundsicherung',
    icon: '💶',
    popular: true
  },
  {
    id: 'vehicle-registration',
    title: 'Kfz-Zulassung',
    description: 'Registrieren Sie Ihr Fahrzeug oder ändern Sie die Zulassung',
    icon: '🚗',
    popular: false
  },
  {
    id: 'birth-certificate',
    title: 'Geburtsurkunde',
    description: 'Beantragen Sie eine Geburtsurkunde',
    icon: '👶',
    popular: false
  },
  {
    id: 'marriage-certificate',
    title: 'Eheurkunde',
    description: 'Beantragen Sie eine Eheurkunde',
    icon: '💍',
    popular: false
  },
  {
    id: 'business-registration',
    title: 'Gewerbeanmeldung',
    description: 'Registrieren Sie ein neues Gewerbe',
    icon: '🏢',
    popular: false
  }
])

const popularServices = ref([])
const searchTerm = ref('')
const filteredServices = ref([])

const navigateToService = (serviceId) => {
  router.push(`/service/${serviceId}`)
}

const updateFilteredServices = () => {
  if (!searchTerm.value) {
    filteredServices.value = services.value
    return
  }
  
  const term = searchTerm.value.toLowerCase()
  filteredServices.value = services.value.filter(service => 
    service.title.toLowerCase().includes(term) || 
    service.description.toLowerCase().includes(term)
  )
}

onMounted(() => {
  popularServices.value = services.value.filter(service => service.popular)
  filteredServices.value = services.value
})
</script>

<template>
  <div class="home-view">
    <section class="hero">
      <h1>Willkommen beim BehördenService Digital</h1>
      <p class="subtitle">Erledigen Sie Behördengänge bequem von zu Hause aus</p>
      
      <div class="search-container">
        <input 
          v-voix="'service-search'" 
          hint="Suchen Sie nach einem Dienst, zum Beispiel Personalausweis oder Ummeldung"
          type="search" 
          v-model="searchTerm" 
          @input="updateFilteredServices" 
          placeholder="Suchen Sie nach einer Dienstleistung..." 
          class="search-input" />
      </div>
    </section>

    <!-- Popular services section -->
    <section class="popular-services" v-if="popularServices.length && !searchTerm">
      <h2>Beliebte Dienstleistungen</h2>
      
      <div class="services-grid">
        <div 
          v-for="service in popularServices" 
          :key="service.id" 
          class="service-card popular"
          v-voix="service.id + '-card'"
          hint="Klicken Sie hier, um den Prozess für diese Dienstleistung zu starten"
          @click="navigateToService(service.id)">
          <div class="service-icon">{{ service.icon }}</div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <button 
            v-voix="service.id + '-button'"
            hint="Startet den Antragsprozess für diese Dienstleistung"
            class="service-button">
            Starten
          </button>
        </div>
      </div>
    </section>

    <!-- All services or search results -->
    <section class="all-services">
      <h2>{{ searchTerm ? 'Suchergebnisse' : 'Alle Dienstleistungen' }}</h2>
      
      <div v-if="filteredServices.length === 0" class="no-results">
        <p>Keine Ergebnisse für "{{ searchTerm }}" gefunden.</p>
        <button 
          v-voix="'clear-search'" 
          hint="Löscht die Suche und zeigt alle Dienstleistungen an"
          class="clear-search" 
          @click="searchTerm = ''; updateFilteredServices()">
          Suche zurücksetzen
        </button>
      </div>
      
      <div v-else class="services-grid">
        <div 
          v-for="service in filteredServices" 
          :key="service.id" 
          class="service-card"
          v-voix="service.id + '-card'"
          hint="Klicken Sie hier, um den Prozess für diese Dienstleistung zu starten"
          @click="navigateToService(service.id)">
          <div class="service-icon">{{ service.icon }}</div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <button 
            v-voix="service.id + '-button'"
            hint="Startet den Antragsprozess für diese Dienstleistung"
            class="service-button">
            Starten
          </button>
        </div>
      </div>
    </section>

    <!-- Information about digital services -->
    <section class="info-section">
      <div class="info-card">
        <h3>Wie funktioniert's?</h3>
        <ol>
          <li>Wählen Sie die gewünschte Dienstleistung aus</li>
          <li>Folgen Sie dem Schritt-für-Schritt-Prozess</li>
          <li>Reichen Sie Ihre Dokumente digital ein</li>
          <li>Verfolgen Sie den Status Ihres Antrags</li>
        </ol>
      </div>
      
      <div class="info-card">
        <h3>Ihre Vorteile</h3>
        <ul>
          <li>Sparen Sie Zeit und Wege</li>
          <li>24/7 verfügbar</li>
          <li>Einfach und verständlich</li>
          <li>Sichere Datenübertragung</li>
        </ul>
      </div>
      
      <div class="info-card">
        <h3>Unterstützung</h3>
        <p>Sie benötigen Hilfe? Unser Support-Team steht Ihnen zur Verfügung.</p>
        <button 
          v-voix="'help-button'" 
          hint="Navigiert zur Hilfeseite mit Support-Optionen"
          class="help-button" 
          @click="router.push('/help')">
          Hilfe bekommen
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  animation: fadeIn 0.5s ease-out;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-color);
  opacity: 0.8;
  margin-bottom: 2rem;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-background);
  color: var(--text-color);
  transition: border-color var(--transition-speed), box-shadow var(--transition-speed);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

h2 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.service-card {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.service-card.popular {
  border-top: 3px solid var(--accent-color);
}

.service-card.popular::before {
  content: '⭐ Beliebt';
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--accent-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
}

.service-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: inline-block;
}

.service-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
}

.service-card p {
  color: var(--text-color);
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.service-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
  align-self: flex-start;
  margin-top: auto;
}

.service-button:hover {
  background-color: var(--secondary-color);
}

.no-results {
  text-align: center;
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.clear-search {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.info-card {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.info-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-card ul, .info-card ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.info-card li {
  margin-bottom: 0.5rem;
}

.help-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.help-button:hover {
  background-color: var(--secondary-color);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
