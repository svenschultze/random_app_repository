<script setup>
import { ref, computed, watch } from 'vue';
import store from '@/store';
import Button from '@/components/ui/Button.vue';
import IconButton from '@/components/ui/IconButton.vue';

// Checkout form data
const shippingInfo = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US'
});

const paymentInfo = ref({
  cardName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  saveCard: false
});

// Step validation
const shippingValid = computed(() => {
  const s = shippingInfo.value;
  return s.fullName && s.email && s.phone && s.address && 
         s.city && s.state && s.postalCode && s.country;
});

const paymentValid = computed(() => {
  const p = paymentInfo.value;
  return p.cardName && p.cardNumber && p.expiryDate && p.cvv;
});

// Format card input
const formatCardNumber = (value) => {
  if (!value) return '';
  const input = value.replace(/\D/g, '');
  const formatted = input.substring(0, 16);
  const parts = [];
  for (let i = 0; i < formatted.length; i += 4) {
    parts.push(formatted.substring(i, i + 4));
  }
  return parts.join(' ');
};

const formatExpiryDate = (value) => {
  if (!value) return '';
  const input = value.replace(/\D/g, '');
  if (input.length > 2) {
    return `${input.substring(0, 2)}/${input.substring(2, 4)}`;
  }
  return input;
};

// Handle form input changes
const handleCardNumberChange = (e) => {
  paymentInfo.value.cardNumber = formatCardNumber(e.target.value);
};

const handleExpiryDateChange = (e) => {
  paymentInfo.value.expiryDate = formatExpiryDate(e.target.value);
};

const handleCVVChange = (e) => {
  paymentInfo.value.cvv = e.target.value.replace(/\D/g, '').substring(0, 4);
};

// Cart and checkout logic
const cartItems = computed(() => store.state.cart);
const cartTotal = computed(() => store.cartTotal());
const cartItemCount = computed(() => store.cartItemCount());
const currentStep = computed(() => store.state.ui.checkoutStep);

const nextStep = () => {
  store.nextCheckoutStep();
};

const prevStep = () => {
  store.previousCheckoutStep();
};

const cancelCheckout = () => {
  store.cancelCheckout();
};

const completeOrder = () => {
  // In a real app, we would send the order to a server here
  store.completeCheckout();
  showSuccessMessage();
};

// Success message
const showSuccess = ref(false);

const showSuccessMessage = () => {
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 5000);
};

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};
</script>

<template>
  <div class="checkout-overlay" v-if="store.state.ui.showCheckout">
    <div class="checkout-container">
      <div class="checkout-header">
        <h2 class="checkout-title">Checkout</h2>
        <IconButton 
          icon='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
          label="Close checkout"
          color="dark"
          @click="cancelCheckout"
          id="close-checkout"
          hint="Cancel checkout and return to shopping"
        />
      </div>
      
      <div class="checkout-steps">
        <div 
          class="checkout-step" 
          :class="{ active: currentStep >= 1, completed: currentStep > 1 }"
          v-voix="'checkout-step-1'"
          hint="Step 1: Review your order"
        >
          <div class="step-number">1</div>
          <div class="step-label">Review</div>
        </div>
        <div class="step-connector"></div>
        <div 
          class="checkout-step" 
          :class="{ active: currentStep >= 2, completed: currentStep > 2 }"
          v-voix="'checkout-step-2'"
          hint="Step 2: Enter shipping information"
        >
          <div class="step-number">2</div>
          <div class="step-label">Shipping</div>
        </div>
        <div class="step-connector"></div>
        <div 
          class="checkout-step" 
          :class="{ active: currentStep >= 3 }"
          v-voix="'checkout-step-3'"
          hint="Step 3: Enter payment information"
        >
          <div class="step-number">3</div>
          <div class="step-label">Payment</div>
        </div>
      </div>
      
      <div class="checkout-content">
        <!-- Step 1: Order review -->
        <div v-if="currentStep === 1" class="checkout-step-content">
          <h3 class="step-title">Review Your Order</h3>
          
          <div class="order-summary">
            <div class="order-items">
              <div v-for="item in cartItems" :key="item.productId" class="order-item">
                <div class="item-image">
                  <img :src="item.product.images[0]" :alt="item.product.name" />
                </div>
                <div class="item-details">
                  <h4 class="item-name">{{ item.product.name }}</h4>
                  <div class="item-meta">
                    <span class="item-quantity">Qty: {{ item.quantity }}</span>
                    <span class="item-price">
                      {{ formatPrice(item.product.discountPercentage > 0 
                        ? item.product.discountedPrice * item.quantity 
                        : item.product.price * item.quantity) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="order-totals">
              <div class="total-row">
                <span class="total-label">Subtotal</span>
                <span class="total-value">{{ cartTotal }}</span>
              </div>
              <div class="total-row">
                <span class="total-label">Shipping</span>
                <span class="total-value shipping">Free</span>
              </div>
              <div class="total-row">
                <span class="total-label">Tax</span>
                <span class="total-value">$0.00</span>
              </div>
              <div class="total-row grand-total">
                <span class="total-label">Total</span>
                <span class="total-value">{{ cartTotal }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Step 2: Shipping information -->
        <div v-if="currentStep === 2" class="checkout-step-content">
          <h3 class="step-title">Shipping Information</h3>
          
          <form class="shipping-form">
            <div class="form-row">
              <div class="form-group">
                <label for="fullName">Full Name</label>
                <input 
                  id="fullName" 
                  type="text" 
                  v-model="shippingInfo.fullName" 
                  placeholder="John Doe"
                  v-voix="'checkout-full-name'"
                  hint="Enter your full name"
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  id="email" 
                  type="email" 
                  v-model="shippingInfo.email" 
                  placeholder="johndoe@example.com"
                  v-voix="'checkout-email'"
                  hint="Enter your email address"
                  required
                />
              </div>
              <div class="form-group">
                <label for="phone">Phone</label>
                <input 
                  id="phone" 
                  type="tel" 
                  v-model="shippingInfo.phone" 
                  placeholder="(123) 456-7890"
                  v-voix="'checkout-phone'"
                  hint="Enter your phone number"
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="address">Address</label>
                <input 
                  id="address" 
                  type="text" 
                  v-model="shippingInfo.address" 
                  placeholder="123 Main St"
                  v-voix="'checkout-address'"
                  hint="Enter your street address"
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input 
                  id="city" 
                  type="text" 
                  v-model="shippingInfo.city" 
                  placeholder="New York"
                  v-voix="'checkout-city'"
                  hint="Enter your city"
                  required
                />
              </div>
              <div class="form-group">
                <label for="state">State</label>
                <input 
                  id="state" 
                  type="text" 
                  v-model="shippingInfo.state" 
                  placeholder="NY"
                  v-voix="'checkout-state'"
                  hint="Enter your state"
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="postalCode">Postal Code</label>
                <input 
                  id="postalCode" 
                  type="text" 
                  v-model="shippingInfo.postalCode" 
                  placeholder="10001"
                  v-voix="'checkout-postal-code'"
                  hint="Enter your postal code"
                  required
                />
              </div>
              <div class="form-group">
                <label for="country">Country</label>
                <select 
                  id="country" 
                  v-model="shippingInfo.country"
                  v-voix="'checkout-country'"
                  hint="Select your country"
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Step 3: Payment information -->
        <div v-if="currentStep === 3" class="checkout-step-content">
          <h3 class="step-title">Payment Information</h3>
          
          <form class="payment-form">
            <div class="form-row">
              <div class="form-group">
                <label for="cardName">Name on Card</label>
                <input 
                  id="cardName" 
                  type="text" 
                  v-model="paymentInfo.cardName" 
                  placeholder="John Doe"
                  v-voix="'checkout-card-name'"
                  hint="Enter the name as it appears on your card"
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="cardNumber">Card Number</label>
                <input 
                  id="cardNumber" 
                  type="text" 
                  v-model="paymentInfo.cardNumber" 
                  placeholder="1234 5678 9012 3456"
                  @input="handleCardNumberChange"
                  v-voix="'checkout-card-number'"
                  hint="Enter your credit card number"
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="expiryDate">Expiry Date</label>
                <input 
                  id="expiryDate" 
                  type="text" 
                  v-model="paymentInfo.expiryDate" 
                  placeholder="MM/YY"
                  @input="handleExpiryDateChange"
                  v-voix="'checkout-expiry-date'"
                  hint="Enter the expiration date of your card"
                  required
                />
              </div>
              <div class="form-group">
                <label for="cvv">CVV</label>
                <input 
                  id="cvv" 
                  type="text" 
                  v-model="paymentInfo.cvv" 
                  placeholder="123"
                  @input="handleCVVChange"
                  v-voix="'checkout-cvv'"
                  hint="Enter the security code on the back of your card"
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group checkbox-group">
                <input 
                  id="saveCard" 
                  type="checkbox" 
                  v-model="paymentInfo.saveCard"
                  v-voix="'checkout-save-card'"
                  hint="Check this to save your card information for future purchases"
                />
                <label for="saveCard">Save card for future purchases</label>
              </div>
            </div>
            
            <div class="payment-security">
              <div class="security-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <p class="security-text">
                Your payment information is secure. We use encryption to protect your data.
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <div class="checkout-footer">
        <div class="checkout-actions">
          <Button 
            v-if="currentStep > 1" 
            label="Back" 
            variant="outline" 
            @click="prevStep"
            id="checkout-back"
            hint="Go back to the previous step"
          />
          <Button 
            v-if="currentStep < 3" 
            label="Continue" 
            variant="primary" 
            @click="nextStep"
            :disabled="(currentStep === 2 && !shippingValid)"
            id="checkout-continue"
            hint="Continue to the next step"
          />
          <Button 
            v-if="currentStep === 3" 
            label="Place Order" 
            variant="primary" 
            @click="completeOrder"
            :disabled="!paymentValid"
            id="place-order"
            hint="Complete your purchase and place your order"
          />
        </div>
      </div>
      
      <!-- Success Message -->
      <div v-if="showSuccess" class="success-message">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="success-content">
          <h3>Order Placed Successfully!</h3>
          <p>Thank you for your purchase. You will receive a confirmation email shortly.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

.checkout-container {
  background-color: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.4s ease-out;
}

.checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}

.checkout-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text, #2b2b2b);
}

.checkout-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  background-color: var(--color-background-soft, #f5f5f5);
}

.checkout-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid var(--color-border, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--color-text-light, #646464);
  transition: all 0.3s ease;
}

.step-label {
  font-size: 0.875rem;
  color: var(--color-text-light, #646464);
  font-weight: 500;
  transition: color 0.3s ease;
}

.step-connector {
  height: 2px;
  background-color: var(--color-border, #e2e8f0);
  flex: 1;
  margin: 0 8px;
  position: relative;
  top: -18px;
  transition: background-color 0.3s ease;
}

.checkout-step.active .step-number {
  border-color: var(--color-primary, #4361ee);
  background-color: var(--color-primary, #4361ee);
  color: white;
}

.checkout-step.active .step-label {
  color: var(--color-primary, #4361ee);
  font-weight: 600;
}

.checkout-step.completed .step-number {
  background-color: var(--color-primary, #4361ee);
  border-color: var(--color-primary, #4361ee);
  color: white;
}

.checkout-step.completed .step-number::after {
  content: '✓';
}

.checkout-step.completed + .step-connector {
  background-color: var(--color-primary, #4361ee);
}

.checkout-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.checkout-step-content {
  animation: fadeIn 0.3s ease-out;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 24px;
  color: var(--color-text, #2b2b2b);
}

/* Order summary styling */
.order-summary {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text, #2b2b2b);
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-quantity {
  color: var(--color-text-light, #646464);
  font-size: 0.875rem;
}

.item-price {
  font-weight: 600;
}

.order-totals {
  background-color: var(--color-background-soft, #f5f5f5);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  color: var(--color-text-light, #646464);
}

.total-value {
  font-weight: 600;
}

.total-value.shipping {
  color: #22c55e;
}

.grand-total {
  padding-top: 12px;
  border-top: 1px dashed var(--color-border, #e2e8f0);
  font-size: 1.1rem;
}

.grand-total .total-label,
.grand-total .total-value {
  font-weight: 700;
  color: var(--color-text, #2b2b2b);
}

/* Form styling */
.shipping-form,
.payment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text, #2b2b2b);
}

input, select {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border, #e2e8f0);
  background-color: white;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--color-primary, #4361ee);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.checkbox-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.checkbox-group input {
  width: 18px;
  height: 18px;
}

.checkbox-group label {
  font-weight: 400;
  font-size: 0.9rem;
}

.payment-security {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: rgba(67, 97, 238, 0.1);
  padding: 12px;
  border-radius: 8px;
}

.security-icon {
  color: var(--color-primary, #4361ee);
}

.security-text {
  font-size: 0.875rem;
  color: var(--color-text-light, #646464);
  margin: 0;
}

/* Footer styling */
.checkout-footer {
  padding: 24px;
  border-top: 1px solid var(--color-border, #e2e8f0);
  background-color: var(--color-background-soft, #f5f5f5);
  position: sticky;
  bottom: 0;
}

.checkout-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

/* Success message */
.success-message {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: white;
  border-left: 5px solid #22c55e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  border-radius: 8px;
  animation: slideInRight 0.3s ease-out;
  max-width: 400px;
  z-index: 1100;
}

.success-icon {
  color: #22c55e;
  flex-shrink: 0;
}

.success-content h3 {
  margin: 0 0 8px;
  color: var(--color-text, #2b2b2b);
  font-size: 1.1rem;
}

.success-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-light, #646464);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Responsive styles */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
  
  .checkout-container {
    margin: 0;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .checkout-overlay {
    padding: 0;
  }
}

@media (max-width: 480px) {
  .checkout-steps {
    padding: 16px 12px;
  }
  
  .step-label {
    font-size: 0.75rem;
  }
  
  .step-number {
    width: 28px;
    height: 28px;
  }
  
  .step-connector {
    top: -14px;
  }
  
  .checkout-content,
  .checkout-footer {
    padding: 16px;
  }
  
  .checkout-actions {
    flex-direction: column-reverse;
  }
}
</style>