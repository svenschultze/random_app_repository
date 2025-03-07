<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Get order info from route params and query
const orderNumber = route.params.orderNumber || Math.floor(Math.random() * 10000) + 1000
const customerName = route.query.name || 'Guest'
const customerEmail = route.query.email || ''
const customerAddress = route.query.address || ''
const orderTotal = route.query.total || '0.00'

// Delivery status stages
const deliveryStages = [
  { title: 'Order Received', description: 'We\'ve received your order and are processing it', icon: '✓', completed: true },
  { title: 'Preparing Your Food', description: 'The restaurant is preparing your order', icon: '🍳', completed: true },
  { title: 'Driver Pickup', description: 'Order will be picked up by delivery partner', icon: '🛵', completed: false },
  { title: 'On the Way', description: 'Your order is on the way to your address', icon: '🚚', completed: false },
  { title: 'Delivered', description: 'Enjoy your meal!', icon: '🎉', completed: false }
]

// Estimated delivery time
const minutes = Math.floor(Math.random() * 30) + 30 // 30-60 minutes
const deliveryTime = new Date()
deliveryTime.setMinutes(deliveryTime.getMinutes() + minutes)

const formattedDeliveryTime = deliveryTime.toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit'
})

// Current progress step (1-based)
const currentStep = ref(2)

// Simulate delivery progress
onMounted(() => {
  // Every few seconds, advance the delivery status
  const stageInterval = setInterval(() => {
    if (currentStep.value < deliveryStages.length) {
      currentStep.value++
      deliveryStages[currentStep.value - 1].completed = true
    } else {
      clearInterval(stageInterval)
    }
  }, 5000) // Update every 5 seconds

  // Cleanup interval on component unmount
  return () => clearInterval(stageInterval)
})

// Return to home
const backToHome = () => {
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="confirmation-view">
    <div class="confirmation-container">
      <div class="order-success">
        <div class="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. We'll deliver your food shortly.</p>
      </div>
      
      <div class="order-info">
        <div class="info-section">
          <h2>Order Information</h2>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Order Number:</span>
              <span class="info-value" v-voix="'OrderNumberValue'">{{ orderNumber }}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Customer Name:</span>
              <span class="info-value" v-voix="'CustomerNameValue'">{{ customerName }}</span>
            </div>
            
            <div class="info-item" v-if="customerEmail">
              <span class="info-label">Email:</span>
              <span class="info-value" v-voix="'CustomerEmailValue'">{{ customerEmail }}</span>
            </div>
            
            <div class="info-item" v-if="customerAddress">
              <span class="info-label">Delivery Address:</span>
              <span class="info-value" v-voix="'CustomerAddressValue'">{{ customerAddress }}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Order Total:</span>
              <span class="info-value" v-voix="'OrderTotalValue'">${{ orderTotal }}</span>
            </div>
            
            <div class="info-item">
              <span class="info-label">Estimated Delivery:</span>
              <span class="info-value" v-voix="'DeliveryTimeValue'">{{ formattedDeliveryTime }}</span>
            </div>
          </div>
        </div>
        
        <div class="delivery-status">
          <h2>Delivery Status</h2>
          
          <div class="status-timeline">
            <div 
              v-for="(stage, index) in deliveryStages" 
              :key="index"
              class="status-step"
              :class="{ 
                active: index + 1 === currentStep, 
                completed: index + 1 < currentStep || stage.completed 
              }"
              v-voix="`DeliveryStage_${index + 1}`"
              :hint="`Delivery stage ${index + 1}: ${stage.title}. ${index + 1 <= currentStep ? 'Completed' : 'Pending'}`"
            >
              <div class="step-icon">{{ stage.icon }}</div>
              <div class="step-content">
                <h3>{{ stage.title }}</h3>
                <p>{{ stage.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button 
          class="home-btn" 
          @click="backToHome"
          v-voix="'BackToHomeButton'"
          hint="Return to restaurant list"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirmation-view {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 300px);
}

.confirmation-container {
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
}

.order-success {
  text-align: center;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--success-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  margin: 0 auto 1.5rem;
}

.order-success h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.order-success p {
  color: #666;
  font-size: 1.1rem;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section h2, .delivery-status h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.info-value {
  font-size: 1.1rem;
  color: var(--text-color);
}

.status-timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.status-step {
  display: flex;
  gap: 1.5rem;
  opacity: 0.5;
}

.status-step.completed, .status-step.active {
  opacity: 1;
}

.step-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.status-step.completed .step-icon {
  background-color: var(--success-color);
}

.status-step.active .step-icon {
  background-color: var(--primary-color);
}

.step-content {
  flex: 1;
}

.step-content h3 {
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.step-content p {
  color: #666;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.home-btn {
  padding: 0.75rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.home-btn:hover {
  background-color: #ff5252;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .confirmation-container {
    padding: 1.5rem;
  }
}
</style>