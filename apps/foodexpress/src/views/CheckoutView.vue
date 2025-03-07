<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useRestaurantStore } from '@/stores/foodStore'

const router = useRouter()
const { cart, clearCart } = useRestaurantStore()

// Step tracking
const currentStep = ref(1)
const totalSteps = 3

// Customer info form
const customerInfo = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zipCode: '',
  instructions: ''
})

// Payment info form
const paymentInfo = reactive({
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: ''
})

// Order calculations
const subtotal = computed(() => cart.total)
const tax = computed(() => subtotal.value * 0.08) // 8% tax
const deliveryFee = computed(() => subtotal.value > 0 ? 2.99 : 0)
const total = computed(() => subtotal.value + tax.value + deliveryFee.value)

// Format price
const formatPrice = (price) => {
  return `$${price.toFixed(2)}`
}

// Form validations
const isCustomerInfoValid = computed(() => {
  return customerInfo.firstName.trim() !== '' &&
         customerInfo.lastName.trim() !== '' &&
         customerInfo.email.trim() !== '' &&
         customerInfo.phone.trim() !== '' &&
         customerInfo.address.trim() !== '' &&
         customerInfo.city.trim() !== '' &&
         customerInfo.zipCode.trim() !== ''
})

const isPaymentInfoValid = computed(() => {
  return paymentInfo.cardNumber.trim() !== '' &&
         paymentInfo.cardName.trim() !== '' &&
         paymentInfo.expiryDate.trim() !== '' &&
         paymentInfo.cvv.trim() !== ''
})

// Navigation functions
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    // Validate current step before proceeding
    if (currentStep.value === 1 && !isCustomerInfoValid.value) {
      return
    } else if (currentStep.value === 2 && !isPaymentInfoValid.value) {
      return
    }
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Place order
const placeOrder = () => {
  // Generate a random order number
  const orderNumber = Math.floor(Math.random() * 10000) + 1000
  
  // Simulate order placement and clear cart
  clearCart()
  
  // Redirect to confirmation page
  router.push({ 
    name: 'confirmation', 
    params: { 
      orderNumber: orderNumber.toString() 
    },
    query: {
      name: `${customerInfo.firstName} ${customerInfo.lastName}`,
      email: customerInfo.email,
      address: customerInfo.address,
      total: total.value.toFixed(2)
    }
  })
}

// Check if cart is empty and redirect if needed
if (cart.items.length === 0) {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="checkout-view">
    <h1>Checkout</h1>
    
    <div class="checkout-container">
      <div class="checkout-steps">
        <div 
          v-for="step in totalSteps" 
          :key="step" 
          class="step" 
          :class="{ active: step === currentStep, completed: step < currentStep }"
          v-voix="`CheckoutStep_${step}`"
          :hint="`Checkout step ${step} of ${totalSteps}`"
        >
          <div class="step-number">{{ step }}</div>
          <div class="step-title">
            {{ step === 1 ? 'Delivery Info' : step === 2 ? 'Payment' : 'Review' }}
          </div>
        </div>
      </div>
      
      <div class="checkout-content">
        <!-- Step 1: Delivery Information -->
        <div v-if="currentStep === 1" class="checkout-step-content">
          <h2>Delivery Information</h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="first-name" v-voix="'FirstNameLabel'">First Name</label>
              <input 
                type="text" 
                id="first-name" 
                v-model="customerInfo.firstName" 
                required
                v-voix="'FirstNameInput'"
                hint="Enter your first name"
              >
            </div>
            
            <div class="form-group">
              <label for="last-name" v-voix="'LastNameLabel'">Last Name</label>
              <input 
                type="text" 
                id="last-name" 
                v-model="customerInfo.lastName" 
                required
                v-voix="'LastNameInput'"
                hint="Enter your last name"
              >
            </div>
            
            <div class="form-group">
              <label for="email" v-voix="'EmailLabel'">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="customerInfo.email" 
                required
                v-voix="'EmailInput'"
                hint="Enter your email address"
              >
            </div>
            
            <div class="form-group">
              <label for="phone" v-voix="'PhoneLabel'">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="customerInfo.phone" 
                required
                v-voix="'PhoneInput'"
                hint="Enter your phone number"
              >
            </div>
            
            <div class="form-group full-width">
              <label for="address" v-voix="'AddressLabel'">Delivery Address</label>
              <input 
                type="text" 
                id="address" 
                v-model="customerInfo.address" 
                required
                v-voix="'AddressInput'"
                hint="Enter your street address"
              >
            </div>
            
            <div class="form-group">
              <label for="city" v-voix="'CityLabel'">City</label>
              <input 
                type="text" 
                id="city" 
                v-model="customerInfo.city" 
                required
                v-voix="'CityInput'"
                hint="Enter your city"
              >
            </div>
            
            <div class="form-group">
              <label for="zip-code" v-voix="'ZipCodeLabel'">ZIP Code</label>
              <input 
                type="text" 
                id="zip-code" 
                v-model="customerInfo.zipCode" 
                required
                v-voix="'ZipCodeInput'"
                hint="Enter your ZIP code"
              >
            </div>
            
            <div class="form-group full-width">
              <label for="instructions" v-voix="'InstructionsLabel'">Delivery Instructions (Optional)</label>
              <textarea 
                id="instructions" 
                v-model="customerInfo.instructions"
                v-voix="'InstructionsInput'"
                hint="Add any special delivery instructions if needed"
              ></textarea>
            </div>
          </div>
          
          <div class="step-buttons">
            <button 
              class="back-btn" 
              @click="router.push({ name: 'cart' })"
              v-voix="'BackToCartButton'"
              hint="Return to your shopping cart"
            >
              Back to Cart
            </button>
            <button 
              class="next-btn" 
              @click="nextStep" 
              :disabled="!isCustomerInfoValid"
              v-voix="'NextStepButton'"
              hint="Continue to payment details"
            >
              Continue to Payment
            </button>
          </div>
        </div>
        
        <!-- Step 2: Payment Information -->
        <div v-if="currentStep === 2" class="checkout-step-content">
          <h2>Payment Information</h2>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="card-number" v-voix="'CardNumberLabel'">Card Number</label>
              <input 
                type="text" 
                id="card-number" 
                v-model="paymentInfo.cardNumber" 
                placeholder="XXXX XXXX XXXX XXXX" 
                required
                v-voix="'CardNumberInput'"
                hint="Enter your credit card number"
              >
            </div>
            
            <div class="form-group full-width">
              <label for="card-name" v-voix="'CardNameLabel'">Name on Card</label>
              <input 
                type="text" 
                id="card-name" 
                v-model="paymentInfo.cardName" 
                required
                v-voix="'CardNameInput'"
                hint="Enter the name as it appears on your card"
              >
            </div>
            
            <div class="form-group">
              <label for="expiry-date" v-voix="'ExpiryDateLabel'">Expiry Date</label>
              <input 
                type="text" 
                id="expiry-date" 
                v-model="paymentInfo.expiryDate" 
                placeholder="MM/YY" 
                required
                v-voix="'ExpiryDateInput'"
                hint="Enter the expiration date on your card"
              >
            </div>
            
            <div class="form-group">
              <label for="cvv" v-voix="'CVVLabel'">CVV</label>
              <input 
                type="text" 
                id="cvv" 
                v-model="paymentInfo.cvv" 
                placeholder="XXX" 
                required
                v-voix="'CVVInput'"
                hint="Enter the 3 or 4 digit security code on your card"
              >
            </div>
          </div>
          
          <div class="payment-note">
            <p>This is a demo application. No actual payment will be processed.</p>
          </div>
          
          <div class="step-buttons">
            <button 
              class="back-btn" 
              @click="prevStep"
              v-voix="'BackToDeliveryButton'"
              hint="Return to delivery information"
            >
              Back
            </button>
            <button 
              class="next-btn" 
              @click="nextStep" 
              :disabled="!isPaymentInfoValid"
              v-voix="'ReviewOrderButton'"
              hint="Continue to order review"
            >
              Review Order
            </button>
          </div>
        </div>
        
        <!-- Step 3: Review Order -->
        <div v-if="currentStep === 3" class="checkout-step-content">
          <h2>Review Your Order</h2>
          
          <div class="order-review">
            <div class="review-section">
              <h3>Delivery Information</h3>
              <div class="review-details">
                <p><strong>Name:</strong> {{ customerInfo.firstName }} {{ customerInfo.lastName }}</p>
                <p><strong>Contact:</strong> {{ customerInfo.email }} | {{ customerInfo.phone }}</p>
                <p><strong>Address:</strong> {{ customerInfo.address }}, {{ customerInfo.city }}, {{ customerInfo.zipCode }}</p>
                <p v-if="customerInfo.instructions"><strong>Instructions:</strong> {{ customerInfo.instructions }}</p>
              </div>
            </div>
            
            <div class="review-section">
              <h3>Payment Method</h3>
              <div class="review-details">
                <p><strong>Card:</strong> **** **** **** {{ paymentInfo.cardNumber.slice(-4) }}</p>
                <p><strong>Name on Card:</strong> {{ paymentInfo.cardName }}</p>
              </div>
            </div>
            
            <div class="review-section">
              <h3>Order Summary</h3>
              <div class="review-details">
                <div class="summary-item">
                  <span>Subtotal</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                
                <div class="summary-item">
                  <span>Tax (8%)</span>
                  <span>{{ formatPrice(tax) }}</span>
                </div>
                
                <div class="summary-item">
                  <span>Delivery Fee</span>
                  <span>{{ formatPrice(deliveryFee) }}</span>
                </div>
                
                <div class="summary-total">
                  <span>Total</span>
                  <span>{{ formatPrice(total) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="step-buttons">
            <button 
              class="back-btn" 
              @click="prevStep"
              v-voix="'BackToPaymentButton'"
              hint="Return to payment details"
            >
              Back
            </button>
            <button 
              class="place-order-btn" 
              @click="placeOrder"
              v-voix="'PlaceOrderButton'"
              hint="Submit your order"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
      
      <div class="order-summary">
        <h3>Order Summary</h3>
        
        <div v-for="item in cart.items" :key="item.itemId" class="summary-item-card">
          <div class="item-qty">{{ item.quantity }}×</div>
          <div class="item-name">{{ item.name }}</div>
          <div class="item-price">{{ formatPrice(item.price * (1 - item.discount / 100) * item.quantity) }}</div>
        </div>
        
        <div class="summary-divider"></div>
        
        <div class="summary-line">
          <span>Subtotal</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        
        <div class="summary-line">
          <span>Tax (8%)</span>
          <span>{{ formatPrice(tax) }}</span>
        </div>
        
        <div class="summary-line">
          <span>Delivery Fee</span>
          <span>{{ formatPrice(deliveryFee) }}</span>
        </div>
        
        <div class="summary-total">
          <span>Total</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: var(--text-color);
}

.checkout-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

/* Step indicators */
.checkout-steps {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  grid-column: 1;
}

.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 24px;
  right: -50%;
  width: 100%;
  height: 2px;
  background-color: var(--border-color);
  z-index: 1;
}

.step.active:not(:last-child)::after,
.step.completed:not(:last-child)::after {
  background-color: var(--primary-color);
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 2;
  border: 2px solid var(--border-color);
}

.step.active .step-number {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.step.completed .step-number {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.step-title {
  font-size: 0.9rem;
  color: #666;
}

.step.active .step-title {
  color: var(--primary-color);
  font-weight: bold;
}

/* Step content */
.checkout-content {
  grid-column: 1;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.checkout-step-content h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: var(--text-color);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

label {
  font-weight: 500;
  color: #555;
}

input, textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.step-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.back-btn, .next-btn, .place-order-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.back-btn:hover {
  background-color: #f5f5f5;
}

.next-btn, .place-order-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.next-btn:hover, .place-order-btn:hover {
  background-color: #ff5252;
}

.next-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.payment-note {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

/* Order review */
.order-review {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-section {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.review-section:last-child {
  border-bottom: none;
}

.review-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--text-color);
}

.review-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.review-details p {
  margin: 0;
  color: #555;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

/* Order summary sidebar */
.order-summary {
  grid-column: 2;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.order-summary h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-item-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.item-qty {
  font-weight: bold;
  color: #666;
}

.item-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-weight: 500;
}

.summary-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 1rem 0;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }
  
  .checkout-content, .order-summary {
    grid-column: 1;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .step:not(:last-child)::after {
    right: -25%;
    width: 50%;
  }
  
  .step-number {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
  
  .step-title {
    font-size: 0.8rem;
  }
}
</style>