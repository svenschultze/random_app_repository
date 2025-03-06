<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Flight search state
const from = ref('')
const to = ref('')
const departureDate = ref('')
const returnDate = ref('')
const passengers = ref(1)
const tripType = ref('oneWay') // oneWay or roundTrip

// Mock recent searches
const recentSearches = ref([
  { from: 'SFO', to: 'NYC', date: '2025-04-15' },
  { from: 'LAX', to: 'LHR', date: '2025-04-20' }
])

// Mock deals
const deals = ref([
  { from: 'SFO', to: 'LAS', price: 99, date: '2025-04-22' },
  { from: 'LAX', to: 'SEA', price: 129, date: '2025-05-01' },
  { from: 'NYC', to: 'MIA', price: 149, date: '2025-04-18' }
])

const searchFlights = () => {
  // Save the search in localStorage for recent searches
  const searchData = {
    from: from.value,
    to: to.value,
    departureDate: departureDate.value,
    returnDate: returnDate.value,
    passengers: passengers.value,
    tripType: tripType.value
  }
  
  // In a real app, we would save this to localStorage
  console.log('Search data:', searchData)
  
  // Navigate to search results
  router.push('/search-results')
}

const loadRecentSearch = (search) => {
  from.value = search.from
  to.value = search.to
  departureDate.value = search.date
  tripType.value = 'oneWay'
}
</script>

<template>
  <div class="home-view">
    <section class="search-section">
      <h2 v-voix="'Flight Search Heading'">Find Your Flight</h2>
      
      <div class="trip-type-selector">
        <label class="radio-container" v-voix="'One Way Trip Type Option'">
          <input 
            type="radio" 
            name="tripType" 
            value="oneWay"
            v-model="tripType"
          >
          <span class="radio-label">One Way</span>
        </label>
        
        <label class="radio-container" v-voix="'Round Trip Type Option'">
          <input 
            type="radio" 
            name="tripType" 
            value="roundTrip" 
            v-model="tripType"
          >
          <span class="radio-label">Round Trip</span>
        </label>
      </div>
      
      <div class="search-form">
        <div class="form-group">
          <label for="from" v-voix="'Departure Airport Label'">From</label>
          <input 
            type="text" 
            id="from" 
            v-model="from" 
            placeholder="City or airport" 
            v-voix="'Departure Airport Input'"
            hint="Enter your departure city or airport code"
          >
        </div>
        
        <div class="form-group">
          <label for="to" v-voix="'Arrival Airport Label'">To</label>
          <input 
            type="text" 
            id="to" 
            v-model="to" 
            placeholder="City or airport" 
            v-voix="'Arrival Airport Input'"
            hint="Enter your destination city or airport code"
          >
        </div>
        
        <div class="form-group">
          <label for="departure-date" v-voix="'Departure Date Label'">Departure Date</label>
          <input 
            type="date" 
            id="departure-date" 
            v-model="departureDate" 
            v-voix="'Departure Date Input'"
            hint="Select your departure date"
          >
        </div>
        
        <div class="form-group" v-if="tripType === 'roundTrip'">
          <label for="return-date" v-voix="'Return Date Label'">Return Date</label>
          <input 
            type="date" 
            id="return-date" 
            v-model="returnDate" 
            v-voix="'Return Date Input'"
            hint="Select your return date"
          >
        </div>
        
        <div class="form-group">
          <label for="passengers" v-voix="'Passengers Label'">Passengers</label>
          <input 
            type="number" 
            id="passengers" 
            v-model="passengers" 
            min="1" 
            max="9" 
            v-voix="'Passengers Input'"
            hint="Select number of passengers"
          >
        </div>
        
        <button 
          class="search-button" 
          @click="searchFlights" 
          v-voix="'Search Flights Button'"
          hint="Click to search for flights with your criteria"
        >
          Search Flights
        </button>
      </div>
    </section>
    
    <section class="recent-searches" v-if="recentSearches.length > 0">
      <h3 v-voix="'Recent Searches Heading'">Recent Searches</h3>
      <div class="recent-searches-list">
        <div 
          v-for="(search, index) in recentSearches" 
          :key="index" 
          class="recent-search-item"
          @click="loadRecentSearch(search)"
          v-voix="'Recent Search Item'"
          :hint="`${search.from} to ${search.to} on ${search.date}`"
        >
          <div class="search-route">{{ search.from }} → {{ search.to }}</div>
          <div class="search-date">{{ search.date }}</div>
        </div>
      </div>
    </section>
    
    <section class="deals-section">
      <h3 v-voix="'Featured Deals Heading'">Featured Deals</h3>
      <div class="deals-list">
        <div 
          v-for="(deal, index) in deals" 
          :key="index" 
          class="deal-card"
          v-voix="'Deal Card'"
          :hint="`${deal.from} to ${deal.to} for $${deal.price}`"
        >
          <div class="deal-route">{{ deal.from }} → {{ deal.to }}</div>
          <div class="deal-price">${{ deal.price }}</div>
          <div class="deal-date">{{ deal.date }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  padding-bottom: 4rem;
}

.search-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.trip-type-selector {
  display: flex;
  margin-bottom: 1.5rem;
}

.radio-container {
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label {
  margin-left: 0.5rem;
}

.search-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-button {
  grid-column: span 2;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #3a80d2;
}

/* Recent Searches */
.recent-searches, .deals-section {
  margin-bottom: 2rem;
}

.recent-searches h3, .deals-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.recent-searches-list {
  display: flex;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.recent-search-item {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 1rem;
  margin-right: 1rem;
  min-width: 150px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.recent-search-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-route {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.search-date {
  color: #666;
  font-size: 0.9rem;
}

/* Deals Section */
.deals-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.deal-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.deal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.deal-route {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.deal-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a90e2;
  margin-bottom: 0.5rem;
}

.deal-date {
  color: #666;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .search-form {
    grid-template-columns: 1fr;
  }
  
  .search-button {
    grid-column: span 1;
  }
}
</style>
