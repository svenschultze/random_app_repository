<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const flightId = route.params.id

// Generate a random booking reference
const generateBookingReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Mock booking data
const booking = ref({
  id: flightId,
  reference: generateBookingReference(),
  status: 'Confirmed',
  passenger: {
    name: 'John Doe',
    email: 'john.doe@example.com'
  },
  flight: {
    airline: 'Delta Airlines',
    flightNumber: 'DL1234',
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
    }
  },
  total: 459
})

// Store booking in local storage
onMounted(() => {
  // In a real app, we would store this in localStorage
  console.log('Booking confirmed:', booking.value)
})

// View all bookings
const viewAllBookings = () => {
  router.push('/my-bookings')
}

// Return to home
const returnHome = () => {
  router.push('/')
}

// Share itinerary (in a real app, this would use the Web Share API or open a modal)
const shareItinerary = () => {
  alert('Share functionality would open here in a real app')
}
</script>

<template>
  <div class="confirmation-view">
    <div class="confirmation-card">
      <div class="success-icon" aria-hidden="true">✓</div>
      
      <h2 v-voix="'Booking Confirmed Heading'">Booking Confirmed!</h2>
      
      <div class="booking-reference" v-voix="'Booking Reference Section'">
        <div class="reference-label">Booking Reference:</div>
        <div class="reference-code">{{ booking.reference }}</div>
      </div>
      
      <div class="passenger-info" v-voix="'Passenger Information'">
        <div class="info-label">Passenger:</div>
        <div class="info-value">{{ booking.passenger.name }}</div>
      </div>
      
      <div class="confirmation-email" v-voix="'Confirmation Email'">
        <div class="info-label">Confirmation sent to:</div>
        <div class="info-value">{{ booking.passenger.email }}</div>
      </div>
      
      <div class="flight-details" v-voix="'Flight Details Section'">
        <h3>Flight Details</h3>
        
        <div class="flight-info">
          <div class="airline-info">
            {{ booking.flight.airline }} {{ booking.flight.flightNumber }}
          </div>
          
          <div class="route-info">
            <div class="departure">
              <div class="airport">{{ booking.flight.departure.airport }}</div>
              <div class="time">{{ booking.flight.departure.time }}</div>
              <div class="date">{{ booking.flight.departure.date }}</div>
              <div class="terminal">{{ booking.flight.departure.terminal }}, Gate {{ booking.flight.departure.gate }}</div>
            </div>
            
            <div class="flight-divider">
              <div class="flight-line"></div>
              <div class="flight-icon">✈</div>
            </div>
            
            <div class="arrival">
              <div class="airport">{{ booking.flight.arrival.airport }}</div>
              <div class="time">{{ booking.flight.arrival.time }}</div>
              <div class="date">{{ booking.flight.arrival.date }}</div>
              <div class="terminal">{{ booking.flight.arrival.terminal }}, Gate {{ booking.flight.arrival.gate }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="payment-summary" v-voix="'Payment Summary Section'">
        <h3>Payment Summary</h3>
        <div class="total-paid">
          <span class="total-label">Total Paid:</span>
          <span class="total-amount">${{ booking.total }}</span>
        </div>
      </div>
      
      <div class="actions-container">
        <button 
          class="primary-button" 
          @click="viewAllBookings"
          v-voix="'View My Bookings Button'"
          hint="Click to see all your booked flights"
        >
          View My Bookings
        </button>
        
        <button 
          class="secondary-button" 
          @click="shareItinerary"
          v-voix="'Share Itinerary Button'"
          hint="Click to share your flight details"
        >
          Share Itinerary
        </button>
        
        <button 
          class="text-button" 
          @click="returnHome"
          v-voix="'Return to Home Button'"
          hint="Click to return to the home page"
        >
          Return to Home
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirmation-view {
  display: flex;
  justify-content: center;
  padding-bottom: 4rem;
}

.confirmation-card {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.success-icon {
  background-color: #4caf50;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.booking-reference {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1.5rem;
}

.reference-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.reference-code {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.passenger-info, .confirmation-email {
  margin-bottom: 1rem;
}

.info-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.info-value {
  font-weight: 500;
}

.flight-details, .payment-summary {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.flight-details h3, .payment-summary h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
}

.airline-info {
  margin-bottom: 1rem;
  font-weight: 500;
}

.route-info {
  display: flex;
  align-items: center;
}

.departure, .arrival {
  flex: 1;
}

.airport {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.time, .date, .terminal {
  color: #666;
  margin-bottom: 0.25rem;
}

.flight-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1.5rem;
  position: relative;
}

.flight-line {
  width: 100px;
  height: 2px;
  background-color: #ddd;
}

.flight-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  padding: 0 0.5rem;
  color: #4a90e2;
}

.total-paid {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-weight: 500;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: bold;
  color: #4a90e2;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.primary-button, .secondary-button, .text-button {
  padding: 0.875rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
}

.primary-button {
  background-color: #4a90e2;
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: #3a80d2;
}

.secondary-button {
  background-color: white;
  color: #4a90e2;
  border: 1px solid #4a90e2;
}

.secondary-button:hover {
  background-color: #f0f7ff;
}

.text-button {
  background-color: transparent;
  color: #666;
  border: none;
}

.text-button:hover {
  color: #333;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .route-info {
    flex-direction: column;
  }
  
  .flight-divider {
    margin: 1.5rem 0;
    transform: rotate(90deg);
  }
  
  .departure, .arrival {
    text-align: center;
  }
}
</style>