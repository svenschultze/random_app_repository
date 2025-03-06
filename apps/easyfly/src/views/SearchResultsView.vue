<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock flight search results
const flights = ref([
  {
    id: '1',
    airline: 'Delta Airlines',
    flightNumber: 'DL1234',
    departure: {
      airport: 'SFO',
      time: '08:30',
      date: '2025-04-15'
    },
    arrival: {
      airport: 'NYC',
      time: '16:45',
      date: '2025-04-15'
    },
    duration: '5h 15m',
    stops: 0,
    price: 399
  },
  {
    id: '2',
    airline: 'United Airlines',
    flightNumber: 'UA789',
    departure: {
      airport: 'SFO',
      time: '10:15',
      date: '2025-04-15'
    },
    arrival: {
      airport: 'NYC',
      time: '18:30',
      date: '2025-04-15'
    },
    duration: '5h 15m',
    stops: 0,
    price: 429
  },
  {
    id: '3',
    airline: 'American Airlines',
    flightNumber: 'AA456',
    departure: {
      airport: 'SFO',
      time: '07:20',
      date: '2025-04-15'
    },
    arrival: {
      airport: 'NYC',
      time: '18:45',
      date: '2025-04-15'
    },
    duration: '8h 25m',
    stops: 1,
    price: 349,
    stopDetails: [
      {
        airport: 'ORD',
        duration: '1h 30m'
      }
    ]
  },
  {
    id: '4',
    airline: 'JetBlue',
    flightNumber: 'B6789',
    departure: {
      airport: 'SFO',
      time: '14:10',
      date: '2025-04-15'
    },
    arrival: {
      airport: 'NYC',
      time: '22:30',
      date: '2025-04-15'
    },
    duration: '5h 20m',
    stops: 0,
    price: 379
  },
])

// State for filters and sorting
const sortOption = ref('price') // price, duration, departure
const filteredFlights = ref([...flights.value])

// Sort and filter options
const sortOptions = [
  { value: 'price', label: 'Cheapest' },
  { value: 'duration', label: 'Fastest' },
  { value: 'departure', label: 'Earliest Departure' }
]

// Applied filters
const filters = ref({
  nonStop: false,
  airlines: []
})

// Derived data for filters
const airlines = ref([
  'Delta Airlines',
  'United Airlines',
  'American Airlines',
  'JetBlue'
])

// Handle sorting and filtering
const applySort = () => {
  if (sortOption.value === 'price') {
    filteredFlights.value.sort((a, b) => a.price - b.price)
  } else if (sortOption.value === 'duration') {
    filteredFlights.value.sort((a, b) => {
      const durationA = parseInt(a.duration.split('h')[0])
      const durationB = parseInt(b.duration.split('h')[0])
      return durationA - durationB
    })
  } else if (sortOption.value === 'departure') {
    filteredFlights.value.sort((a, b) => {
      return a.departure.time.localeCompare(b.departure.time)
    })
  }
}

const applyFilters = () => {
  filteredFlights.value = flights.value.filter(flight => {
    // Filter by non-stop
    if (filters.value.nonStop && flight.stops > 0) {
      return false
    }
    
    // Filter by airlines
    if (filters.value.airlines.length > 0 && !filters.value.airlines.includes(flight.airline)) {
      return false
    }
    
    return true
  })
  
  // Apply current sort
  applySort()
}

const toggleAirlineFilter = (airline) => {
  const index = filters.value.airlines.indexOf(airline)
  if (index === -1) {
    filters.value.airlines.push(airline)
  } else {
    filters.value.airlines.splice(index, 1)
  }
  applyFilters()
}

const viewFlightDetails = (flightId) => {
  router.push(`/flight-details/${flightId}`)
}

// Initialize sorted results
onMounted(() => {
  applySort()
})
</script>

<template>
  <div class="search-results">
    <div class="search-summary">
      <div class="route-info" v-voix="'Search Route Summary'">
        <h2>SFO → NYC</h2>
        <p>Apr 15, 2025 • 1 Passenger</p>
      </div>
      <button 
        class="change-search-btn" 
        @click="router.push('/')"
        v-voix="'Change Search Button'"
        hint="Return to search page to modify your search"
      >
        Change
      </button>
    </div>
    
    <div class="filters-container">
      <div class="sorting-container">
        <label for="sort-select" v-voix="'Sort By Label'">Sort by:</label>
        <select 
          id="sort-select" 
          v-model="sortOption" 
          @change="applySort"
          v-voix="'Sort By Dropdown'"
          hint="Select how to sort flight results"
        >
          <option 
            v-for="option in sortOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      
      <div class="filter-options">
        <div class="filter-group">
          <h3 v-voix="'Stops Filter Heading'">Stops</h3>
          <label class="checkbox-container" v-voix="'Non-Stop Flights Checkbox'">
            <input 
              type="checkbox" 
              v-model="filters.nonStop" 
              @change="applyFilters"
            >
            <span class="checkbox-label">Non-stop only</span>
          </label>
        </div>
        
        <div class="filter-group">
          <h3 v-voix="'Airlines Filter Heading'">Airlines</h3>
          <div 
            v-for="airline in airlines" 
            :key="airline" 
            class="checkbox-container"
            v-voix="'Airline Filter Checkbox'"
            :hint="`Filter flights from ${airline}`"
          >
            <input 
              type="checkbox" 
              :checked="filters.airlines.includes(airline)" 
              @change="toggleAirlineFilter(airline)"
            >
            <span class="checkbox-label">{{ airline }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flight-results">
      <div 
        v-for="flight in filteredFlights" 
        :key="flight.id" 
        class="flight-card"
        @click="viewFlightDetails(flight.id)"
        v-voix="'Flight Result Card'"
        :hint="`${flight.airline} flight from ${flight.departure.airport} to ${flight.arrival.airport} for $${flight.price}`"
      >
        <div class="airline-info">
          <span class="airline-name">{{ flight.airline }}</span>
          <span class="flight-number">{{ flight.flightNumber }}</span>
        </div>
        
        <div class="flight-details">
          <div class="departure">
            <div class="time">{{ flight.departure.time }}</div>
            <div class="airport">{{ flight.departure.airport }}</div>
          </div>
          
          <div class="flight-path">
            <div class="duration">{{ flight.duration }}</div>
            <div class="path-line">
              <span class="stops-indicator" :class="{ 'non-stop': flight.stops === 0 }">
                {{ flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop` }}
              </span>
            </div>
          </div>
          
          <div class="arrival">
            <div class="time">{{ flight.arrival.time }}</div>
            <div class="airport">{{ flight.arrival.airport }}</div>
          </div>
          
          <div class="price-container">
            <div class="price">${{ flight.price }}</div>
            <button class="select-btn" v-voix="'Select Flight Button'">Select</button>
          </div>
        </div>
      </div>
      
      <div v-if="filteredFlights.length === 0" class="no-results" v-voix="'No Results Message'">
        <p>No flights match your current filters. Try adjusting your filters or search criteria.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-results {
  padding-bottom: 5rem;
}

.search-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.route-info h2 {
  margin: 0;
  font-size: 1.5rem;
}

.route-info p {
  margin: 0.25rem 0 0;
  color: #666;
}

.change-search-btn {
  background-color: transparent;
  border: 1px solid #4a90e2;
  color: #4a90e2;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.filters-container {
  display: flex;
  margin-bottom: 1.5rem;
}

.sorting-container {
  margin-right: 2rem;
}

.sorting-container label {
  margin-right: 0.5rem;
}

.sorting-container select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
}

.filter-group {
  margin-right: 2rem;
  margin-bottom: 1rem;
}

.filter-group h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.checkbox-label {
  margin-left: 0.5rem;
}

.flight-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flight-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.flight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.airline-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.airline-name {
  font-weight: 500;
}

.flight-number {
  margin-left: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.flight-details {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  align-items: center;
}

.departure, .arrival {
  display: flex;
  flex-direction: column;
}

.time {
  font-size: 1.25rem;
  font-weight: 500;
}

.airport {
  color: #666;
}

.flight-path {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.duration {
  color: #666;
  margin-bottom: 0.25rem;
}

.path-line {
  width: 100%;
  height: 2px;
  background-color: #ddd;
  position: relative;
}

.stops-indicator {
  position: absolute;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding: 0 0.5rem;
  font-size: 0.8rem;
  color: #666;
}

.stops-indicator.non-stop {
  color: #4caf50;
}

.price-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a90e2;
  margin-bottom: 0.5rem;
}

.select-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.select-btn:hover {
  background-color: #3a80d2;
}

.no-results {
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
  }
  
  .sorting-container {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .flight-details {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 1rem;
  }
  
  .flight-path {
    grid-column: span 2;
    margin: 0.5rem 0;
  }
  
  .price-container {
    grid-column: span 2;
    align-items: center;
    margin-top: 1rem;
  }
}
</style>