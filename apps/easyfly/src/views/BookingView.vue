<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const flightId = route.params.id

// Mock flight data
const flight = ref({
  id: flightId,
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
  price: 399,
  taxesAndFees: 60,
  total: 459
})

// Passenger form data
const passengerData = ref({
  firstName: '',
  lastName: '',
  dob: '',
  email: '',
  phone: '',
  saveInfo: false
})

// Payment form data
const paymentData = ref({
  cardNumber: '',
  cardHolder: '',
  expiry: '',
  cvv: '',
  savePayment: false
})

// Form validation
const errors = ref({})

const validateForm = () => {
  const formErrors = {}
  
  // Validate passenger details
  if (!passengerData.value.firstName) formErrors.firstName = 'First name is required'
  if (!passengerData.value.lastName) formErrors.lastName = 'Last name is required'
  if (!passengerData.value.dob) formErrors.dob = 'Date of birth is required'
  if (!passengerData.value.email) formErrors.email = 'Email is required'
  if (!passengerData.value.phone) formErrors.phone = 'Phone number is required'
  
  // Validate payment details
  if (!paymentData.value.cardNumber) formErrors.cardNumber = 'Card number is required'
  if (!paymentData.value.cardHolder) formErrors.cardHolder = 'Card holder name is required'
  if (!paymentData.value.expiry) formErrors.expiry = 'Expiry date is required'
  if (!paymentData.value.cvv) formErrors.cvv = 'CVV code is required'
  
  errors.value = formErrors
  return Object.keys(formErrors).length === 0
}

const completeBooking = () => {
  if (validateForm()) {
    // In a real app, we would save the booking to local storage
    // and process the payment
    
    // For this demo, we'll just navigate to the confirmation page
    router.push(`/confirmation/${flightId}`)
  } else {
    // Scroll to the first error
    const firstError = document.querySelector('.error-message')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

// Check if we have saved passenger info (would be retrieved from localStorage in a real app)
const loadSavedInfo = () => {
  const savedInfo = localStorage.getItem('passengerInfo')
  if (savedInfo) {
    passengerData.value = JSON.parse(savedInfo)
    passengerData.value.saveInfo = true
  }
}

// Check if this is a real app
loadSavedInfo()
</script>

<template>
  <div class="booking-view">
    <div class="back-link" v-voix="'Back to Flight Details Link'">
      <button @click="router.push(`/flight-details/${flightId}`)" class="back-button">
        ← Back to flight details
      </button>
    </div>
    
    <div class="booking-grid">
      <div class="booking-form">
        <h2 v-voix="'Passenger Details Heading'">Passenger Details</h2>
        
        <div class="form-section">
          <div class="form-row">
            <div class="form-group" :class="{ 'has-error': errors.firstName }">
              <label for="first-name" v-voix="'First Name Label'">First Name</label>
              <input 
                type="text" 
                id="first-name" 
                v-model="passengerData.firstName"
                v-voix="'First Name Input'"
                hint="Enter passenger's first name"
              >
              <div class="error-message" v-if="errors.firstName">{{ errors.firstName }}</div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.lastName }">
              <label for="last-name" v-voix="'Last Name Label'">Last Name</label>
              <input 
                type="text" 
                id="last-name" 
                v-model="passengerData.lastName"
                v-voix="'Last Name Input'"
                hint="Enter passenger's last name"
              >
              <div class="error-message" v-if="errors.lastName">{{ errors.lastName }}</div>
            </div>
          </div>
          
          <div class="form-group" :class="{ 'has-error': errors.dob }">
            <label for="dob" v-voix="'Date of Birth Label'">Date of Birth</label>
            <input 
              type="date" 
              id="dob" 
              v-model="passengerData.dob"
              v-voix="'Date of Birth Input'"
              hint="Enter passenger's date of birth"
            >
            <div class="error-message" v-if="errors.dob">{{ errors.dob }}</div>
          </div>
          
          <div class="form-group" :class="{ 'has-error': errors.email }">
            <label for="email" v-voix="'Email Label'">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="passengerData.email"
              v-voix="'Email Input'"
              hint="Enter your email for booking confirmation"
            >
            <div class="error-message" v-if="errors.email">{{ errors.email }}</div>
          </div>
          
          <div class="form-group" :class="{ 'has-error': errors.phone }">
            <label for="phone" v-voix="'Phone Label'">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="passengerData.phone"
              v-voix="'Phone Input'"
              hint="Enter your phone number"
            >
            <div class="error-message" v-if="errors.phone">{{ errors.phone }}</div>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-container" v-voix="'Save Passenger Info Checkbox'">
              <input type="checkbox" v-model="passengerData.saveInfo">
              <span class="checkbox-label">Save passenger info for future bookings</span>
            </label>
          </div>
        </div>
        
        <h2 v-voix="'Payment Details Heading'">Payment Details</h2>
        
        <div class="form-section">
          <div class="form-group" :class="{ 'has-error': errors.cardNumber }">
            <label for="card-number" v-voix="'Card Number Label'">Card Number</label>
            <input 
              type="text" 
              id="card-number" 
              v-model="paymentData.cardNumber" 
              placeholder="•••• •••• •••• ••••"
              v-voix="'Card Number Input'"
              hint="Enter your credit card number"
            >
            <div class="error-message" v-if="errors.cardNumber">{{ errors.cardNumber }}</div>
          </div>
          
          <div class="form-group" :class="{ 'has-error': errors.cardHolder }">
            <label for="card-holder" v-voix="'Card Holder Label'">Card Holder Name</label>
            <input 
              type="text" 
              id="card-holder" 
              v-model="paymentData.cardHolder"
              v-voix="'Card Holder Input'"
              hint="Enter name as it appears on your card"
            >
            <div class="error-message" v-if="errors.cardHolder">{{ errors.cardHolder }}</div>
          </div>
          
          <div class="form-row">
            <div class="form-group" :class="{ 'has-error': errors.expiry }">
              <label for="expiry" v-voix="'Expiry Date Label'">Expiry Date</label>
              <input 
                type="text" 
                id="expiry" 
                v-model="paymentData.expiry" 
                placeholder="MM/YY"
                v-voix="'Expiry Date Input'"
                hint="Enter card expiry date"
              >
              <div class="error-message" v-if="errors.expiry">{{ errors.expiry }}</div>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.cvv }">
              <label for="cvv" v-voix="'CVV Label'">CVV</label>
              <input 
                type="text" 
                id="cvv" 
                v-model="paymentData.cvv" 
                placeholder="•••"
                v-voix="'CVV Input'"
                hint="Enter 3 or 4 digit security code"
              >
              <div class="error-message" v-if="errors.cvv">{{ errors.cvv }}</div>
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-container" v-voix="'Save Payment Info Checkbox'">
              <input type="checkbox" v-model="paymentData.savePayment">
              <span class="checkbox-label">Save payment info for future bookings</span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="booking-summary">
        <div class="summary-card">
          <h3 v-voix="'Booking Summary Heading'">Booking Summary</h3>
          
          <div class="flight-summary" v-voix="'Flight Summary'">
            <div class="summary-route">{{ flight.departure.airport }} → {{ flight.arrival.airport }}</div>
            <div class="summary-date">{{ flight.departure.date }}</div>
            <div class="summary-time">{{ flight.departure.time }} - {{ flight.arrival.time }}</div>
            <div class="summary-airline">{{ flight.airline }} {{ flight.flightNumber }}</div>
          </div>
          
          <div class="price-summary" v-voix="'Price Summary'">
            <div class="price-item">
              <span class="price-label">Base fare</span>
              <span class="price-value">${{ flight.price }}</span>
            </div>
            
            <div class="price-item">
              <span class="price-label">Taxes & fees</span>
              <span class="price-value">${{ flight.taxesAndFees }}</span>
            </div>
            
            <div class="price-total">
              <span class="price-label">Total</span>
              <span class="price-value">${{ flight.total }}</span>
            </div>
          </div>
          
          <button 
            class="pay-button" 
            @click="completeBooking"
            v-voix="'Complete Booking Button'"
            hint="Click to complete your booking and proceed to payment"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-view {
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

.booking-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.booking-form h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group.has-error input {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.checkbox-group {
  margin-top: 1rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label {
  margin-left: 0.75rem;
}

.booking-summary {
  position: sticky;
  top: 2rem;
  align-self: start;
}

.summary-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.summary-card h3 {
  margin-top: 0;
  margin-bottom: 1.25rem;
  color: #333;
}

.flight-summary {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.summary-route {
  font-weight: 500;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.summary-date, .summary-time, .summary-airline {
  color: #666;
  margin-bottom: 0.25rem;
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

.pay-button {
  width: 100%;
  background-color: #4a90e2;
  color: white;
  padding: 0.875rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1.5rem;
}

.pay-button:hover {
  background-color: #3a80d2;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .booking-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .booking-summary {
    position: static;
    margin-bottom: 2rem;
  }
}
</style>