<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const flightId = route.params.id

// Mock flight data
const flight = ref({
  id: flightId,
  airline: 'Delta Airlines',
  flightNumber: 'DL1234',
  aircraft: 'Boeing 737-800',
  departure: {
    airport: 'SFO',
    terminal: 'Terminal 2',
    gate: 'G34',
    time: '08:30',
    date: '2025-04-15'
  },
  arrival: {
    airport: 'NYC',
    terminal: 'Terminal 4',
    gate: 'B12',
    time: '16:45',
    date: '2025-04-15'
  },
  duration: '5h 15m',
  stops: 0,
  price: 399,
  baggage: {
    carryon: '1 bag included',
    checked: 'First bag $30'
  },
  amenities: ['Wi-Fi', 'Power outlets', 'In-flight entertainment']
})

// Selected add-ons state
const addOns = ref({
  extraBaggage: false,
  seatSelection: false,
  insurance: false
})

// Price calculation
const basePrice = ref(flight.value.price)
const taxesAndFees = ref(Math.round(basePrice.value * 0.15))

const calculateTotal = () => {
  let total = basePrice.value + taxesAndFees.value
  
  if (addOns.value.extraBaggage) total += 30
  if (addOns.value.seatSelection) total += 15
  if (addOns.value.insurance) total += 25
  
  return total
}

const proceedToBooking = () => {
  router.push(`/booking/${flightId}`)
}
</script>

<template>
  <div class="flight-details">
    <div class="back-link" v-voix="'Back to Search Results Link'">
      <button @click="router.push('/search-results')" class="back-button">
        ← Back to results
      </button>
    </div>
    
    <div class="details-card">
      <div class="flight-header" v-voix="'Flight Header Information'">
        <div class="airline-info">
          <h2>{{ flight.airline }}</h2>
          <div class="flight-number">Flight {{ flight.flightNumber }} | {{ flight.aircraft }}</div>
        </div>
      </div>
      
      <div class="flight-main-details">
        <div class="departure-info" v-voix="'Departure Information'">
          <div class="time">{{ flight.departure.time }}</div>
          <div class="date">{{ flight.departure.date }}</div>
          <div class="airport">{{ flight.departure.airport }}</div>
          <div class="terminal-gate">{{ flight.departure.terminal }}, Gate {{ flight.departure.gate }}</div>
        </div>
        
        <div class="flight-path">
          <div class="duration">{{ flight.duration }}</div>
          <div class="path-line"></div>
          <div class="stops-indicator">
            {{ flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop` }}
          </div>
        </div>
        
        <div class="arrival-info" v-voix="'Arrival Information'">
          <div class="time">{{ flight.arrival.time }}</div>
          <div class="date">{{ flight.arrival.date }}</div>
          <div class="airport">{{ flight.arrival.airport }}</div>
          <div class="terminal-gate">{{ flight.arrival.terminal }}, Gate {{ flight.arrival.gate }}</div>
        </div>
      </div>
      
      <div class="baggage-info" v-voix="'Baggage Information'">
        <h3>Baggage Information</h3>
        <div class="baggage-details">
          <div class="baggage-item">
            <span class="baggage-type">Carry-on:</span>
            <span class="baggage-allowance">{{ flight.baggage.carryon }}</span>
          </div>
          <div class="baggage-item">
            <span class="baggage-type">Checked:</span>
            <span class="baggage-allowance">{{ flight.baggage.checked }}</span>
          </div>
        </div>
      </div>
      
      <div class="amenities" v-voix="'Flight Amenities'">
        <h3>Amenities</h3>
        <div class="amenities-list">
          <div v-for="(amenity, index) in flight.amenities" :key="index" class="amenity-item">
            {{ amenity }}
          </div>
        </div>
      </div>
      
      <div class="add-ons" v-voix="'Optional Add-ons Section'">
        <h3>Optional Add-ons</h3>
        
        <div class="add-on-item">
          <label class="checkbox-container" v-voix="'Extra Baggage Checkbox'">
            <input type="checkbox" v-model="addOns.extraBaggage">
            <div class="add-on-details">
              <span class="add-on-name">Extra Checked Baggage</span>
              <span class="add-on-price">+$30</span>
            </div>
          </label>
        </div>
        
        <div class="add-on-item">
          <label class="checkbox-container" v-voix="'Seat Selection Checkbox'">
            <input type="checkbox" v-model="addOns.seatSelection">
            <div class="add-on-details">
              <span class="add-on-name">Seat Selection</span>
              <span class="add-on-price">+$15</span>
            </div>
          </label>
        </div>
        
        <div class="add-on-item">
          <label class="checkbox-container" v-voix="'Travel Insurance Checkbox'">
            <input type="checkbox" v-model="addOns.insurance">
            <div class="add-on-details">
              <span class="add-on-name">Travel Insurance</span>
              <span class="add-on-price">+$25</span>
            </div>
          </label>
        </div>
      </div>
      
      <div class="price-breakdown" v-voix="'Price Breakdown Section'">
        <h3>Price Breakdown</h3>
        
        <div class="price-item">
          <span class="price-label">Base fare</span>
          <span class="price-value">${{ basePrice }}</span>
        </div>
        
        <div class="price-item">
          <span class="price-label">Taxes & fees</span>
          <span class="price-value">${{ taxesAndFees }}</span>
        </div>
        
        <div class="price-item" v-if="addOns.extraBaggage">
          <span class="price-label">Extra baggage</span>
          <span class="price-value">$30</span>
        </div>
        
        <div class="price-item" v-if="addOns.seatSelection">
          <span class="price-label">Seat selection</span>
          <span class="price-value">$15</span>
        </div>
        
        <div class="price-item" v-if="addOns.insurance">
          <span class="price-label">Travel insurance</span>
          <span class="price-value">$25</span>
        </div>
        
        <div class="price-total">
          <span class="price-label">Total</span>
          <span class="price-value">${{ calculateTotal() }}</span>
        </div>
      </div>
      
      <div class="booking-action">
        <button 
          class="book-button" 
          @click="proceedToBooking"
          v-voix="'Book Now Button'"
          hint="Click to proceed to passenger details and payment"
        >
          Book Now
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flight-details {
  padding-bottom: 4rem;
}

.back-link {
  margin-bottom: 1rem;
}

.back-button {
  background: none;
  border: none;
  color: #4a90e2;
  cursor: pointer;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.details-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.flight-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.airline-info h2 {
  margin: 0 0 0.25rem;
}

.flight-number {
  color: #666;
}

.flight-main-details {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  margin-bottom: 2rem;
}

.departure-info, .arrival-info {
  display: flex;
  flex-direction: column;
}

.time {
  font-size: 1.5rem;
  font-weight: 500;
}

.date, .airport, .terminal-gate {
  color: #666;
  margin-top: 0.25rem;
}

.flight-path {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.duration {
  color: #666;
  margin-bottom: 0.5rem;
}

.path-line {
  width: 100%;
  height: 2px;
  background-color: #ddd;
  position: relative;
}

.stops-indicator {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding: 0 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.baggage-info, .amenities, .add-ons, .price-breakdown {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.baggage-info h3, .amenities h3, .add-ons h3, .price-breakdown h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.baggage-details {
  display: flex;
  gap: 2rem;
}

.baggage-item {
  display: flex;
  flex-direction: column;
}

.baggage-type {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.baggage-allowance {
  color: #666;
}

.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.amenity-item {
  background-color: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.add-on-item {
  margin-bottom: 1rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.add-on-details {
  margin-left: 0.75rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.add-on-name {
  font-weight: 500;
}

.add-on-price {
  color: #4a90e2;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.price-total {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-weight: bold;
  font-size: 1.1rem;
}

.booking-action {
  display: flex;
  justify-content: center;
}

.book-button {
  background-color: #4a90e2;
  color: white;
  padding: 0.75rem 2.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.book-button:hover {
  background-color: #3a80d2;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .flight-main-details {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 1.5rem;
  }
  
  .flight-path {
    order: 2;
    margin: 1rem 0;
  }
  
  .arrival-info {
    order: 3;
  }
  
  .baggage-details {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>