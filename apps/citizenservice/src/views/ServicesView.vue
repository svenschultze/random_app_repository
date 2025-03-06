<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const selectedCategory = ref('all')
const searchTerm = ref('')

const services = ref([
  {
    id: 'id-card',
    title: 'Personalausweis',
    description: 'Beantragen oder verlängern Sie Ihren Personalausweis',
    icon: '📇',
    category: 'documents',
    popular: true
  },
  {
    id: 'passport',
    title: 'Reisepass',
    description: 'Beantragen oder verlängern Sie Ihren Reisepass',
    icon: '🛂',
    category: 'documents',
    popular: true
  },
  {
    id: 'address-change',
    title: 'Ummeldung',
    description: 'Melden Sie Ihren neuen Wohnsitz an',
    icon: '🏠',
    category: 'residence',
    popular: true
  },
  {
    id: 'buergergeld',
    title: 'Bürgergeld',
    description: 'Beantragen Sie Bürgergeld oder Grundsicherung',
    icon: '💶',
    category: 'social',
    popular: true
  },
  {
    id: 'vehicle-registration',
    title: 'Kfz-Zulassung',
    description: 'Registrieren Sie Ihr Fahrzeug oder ändern Sie die Zulassung',
    icon: '🚗',
    category: 'mobility',
    popular: false
  },
  {
    id: 'birth-certificate',
    title: 'Geburtsurkunde',
    description: 'Beantragen Sie eine Geburtsurkunde',
    icon: '👶',
    category: 'documents',
    popular: false
  },
  {
    id: 'marriage-certificate',
    title: 'Eheurkunde',
    description: 'Beantragen Sie eine Eheurkunde',
    icon: '💍',
    category: 'documents',
    popular: false
  },
  {
    id: 'business-registration',
    title: 'Gewerbeanmeldung',
    description: 'Registrieren Sie ein neues Gewerbe',
    icon: '🏢',
    category: 'business',
    popular: false
  },
  {
    id: 'parental-allowance',
    title: 'Elterngeld',
    description: 'Beantragen Sie finanzielle Unterstützung für Eltern',
    icon: '👪',
    category: 'social',
    popular: false
  },
  {
    id: 'building-permit',
    title: 'Baugenehmigung',
    description: 'Beantragen Sie eine Genehmigung für Bauvorhaben',
    icon: '🏗️',
    category: 'housing',
    popular: false
  },
  {
    id: 'dog-tax',
    title: 'Hundesteuer',
    description: 'Melden Sie Ihren Hund an oder ab',
    icon: '🐕',
    category: 'taxes',
    popular: false
  },
  {
    id: 'waste-collection',
    title: 'Müllabfuhr',
    description: 'Beantragen oder ändern Sie Ihre Mülltonnen',
    icon: '🗑️',
    category: 'housing',
    popular: false
  }
])

const categories = [
  { id: 'all', name: 'Alle Dienste', icon: '🔍' },
  { id: 'documents', name: 'Ausweise & Dokumente', icon: '📄' },
  { id: 'residence', name: 'Wohnen & Umzug', icon: '🏠' },
  { id: 'social', name: 'Sozialleistungen', icon: '🤝' },
  { id: 'mobility', name: 'Mobilität & Verkehr', icon: '🚗' },
  { id: 'business', name: 'Wirtschaft & Gewerbe', icon: '💼' },
  { id: 'housing', name: 'Bauen & Wohnen', icon: '🏗️' },
  { id: 'taxes', name: 'Steuern & Abgaben', icon: '💰' }
]

const filteredServices = computed(() => {
  let result = services.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    result = result.filter(service => service.category === selectedCategory.value)
  }

  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(service => 
      service.title.toLowerCase().includes(term) || 
      service.description.toLowerCase().includes(term)
    )
  }

  return result
})

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
}

const navigateToService = (serviceId) => {
  router.push(`/service/${serviceId}`)
}

onMounted(() => {
  // Simulate API loading
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <div class="services-view">
    <section class="services-hero">
      <h1>Dienstleistungen</h1>
      <p>Finden Sie alle digitalen Behördendienste an einem Ort</p>
      
      <div class="search-container">
        <input 
          v-voix="'service-search'" 
          hint="Suchen Sie nach einer Dienstleistung"
          type="search" 
          v-model="searchTerm" 
          placeholder="Suchen Sie nach einer Dienstleistung..." 
          class="search-input" />
      </div>
    </section>
    
    <section class="categories-section">
      <div class="categories-list">
        <button 
          v-for="category in categories" 
          :key="category.id"
          v-voix="'category-' + category.id" 
          hint="Filtert die Dienstleistungen nach dieser Kategorie" 
          class="category-button" 
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)">
          <span class="category-icon">{{ category.icon }}</span>
          <span class="category-name">{{ category.name }}</span>
        </button>
      </div>
    </section>
    
    <section class="services-results">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Lade Dienstleistungen...</p>
      </div>
      
      <div v-else>
        <h2 v-if="selectedCategory === 'all' && !searchTerm">Alle Dienstleistungen</h2>
        <h2 v-else-if="searchTerm">Suchergebnisse für "{{ searchTerm }}"</h2>
        <h2 v-else>{{ categories.find(c => c.id === selectedCategory).name }}</h2>
        
        <div v-if="filteredServices.length === 0" class="no-results">
          <p>Keine Dienstleistungen gefunden.</p>
          <button 
            v-voix="'reset-filters'" 
            hint="Setzt alle Filter zurück und zeigt alle Dienstleistungen an"
            class="reset-button" 
            @click="selectedCategory = 'all'; searchTerm = ''">
            Filter zurücksetzen
          </button>
        </div>
        
        <div v-else class="services-grid">
          <div 
            v-for="service in filteredServices" 
            :key="service.id" 
            class="service-card"
            v-voix="service.id + '-card'"
            hint="Zeigt Details zur Dienstleistung an"
            @click="navigateToService(service.id)">
            <div class="service-header">
              <div class="service-icon">{{ service.icon }}</div>
              <h3>{{ service.title }}</h3>
            </div>
            <p class="service-description">{{ service.description }}</p>
            <div class="service-category">
              <span class="category-tag">{{ categories.find(c => c.id === service.category).name }}</span>
            </div>
            <button 
              v-voix="service.id + '-details'" 
              hint="Zeigt mehr Informationen zu dieser Dienstleistung"
              class="details-button">
              Details anzeigen
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.services-view {
  animation: fadeIn 0.5s ease-out;
}

.services-hero {
  text-align: center;
  margin-bottom: 2rem;
}

.services-hero h1 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.services-hero p {
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.search-container {
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
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

.categories-section {
  margin-bottom: 2rem;
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: var(--shadow);
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.category-button {
  display: flex;
  align-items: center;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color var(--transition-speed), transform var(--transition-speed);
}

.category-button:hover {
  background-color: var(--border-color);
  transform: translateY(-2px);
}

.category-button.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.category-icon {
  margin-right: 0.5rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.services-results h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.no-results {
  text-align: center;
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.reset-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
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
  height: 100%;
  border: 1px solid var(--border-color);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.service-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.service-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.service-card h3 {
  font-size: 1.25rem;
  color: var(--primary-color);
  margin: 0;
}

.service-description {
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.service-category {
  margin-bottom: 1rem;
}

.category-tag {
  display: inline-block;
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.details-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color var(--transition-speed);
  align-self: flex-start;
}

.details-button:hover {
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
  .services-hero h1 {
    font-size: 1.75rem;
  }
  
  .categories-list {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    justify-content: flex-start;
  }
  
  .category-button {
    flex-shrink: 0;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>