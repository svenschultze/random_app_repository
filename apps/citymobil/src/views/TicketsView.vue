<script setup>
import { ref, reactive, computed, inject, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const appData = inject('appData')

// Active ticket section
const activeTab = ref('short-term')

// Form data for long term tickets
const formData = reactive({
  showForm: false,
  name: '',
  age: '',
  email: '',
  category: 'standard'
})

// Computed properties
const eligibleForDiscount = computed(() => {
  if (formData.category === 'student' || formData.category === 'senior' || formData.category === 'children') {
    return true
  }
  return false
})

// Selected ticket
const selectedTicket = ref(null)
const purchaseComplete = ref(false)

// Calculate discounted price
const calculateDiscountedPrice = (ticket) => {
  if (!eligibleForDiscount.value || !formData.category) {
    return ticket.basePrice
  }
  
  const discountPercent = ticket.discountOptions[formData.category]
  return (ticket.basePrice * (100 - discountPercent) / 100).toFixed(2)
}

// Select a ticket
const selectTicket = (ticket) => {
  selectedTicket.value = ticket
  
  // Show form only for long term tickets
  if (activeTab.value === 'long-term') {
    formData.showForm = true
  } else {
    // For short-term tickets, go straight to completion
    setTimeout(() => {
      purchaseComplete.value = true
    }, 1000)
  }
}

// Complete purchase
const completePurchase = () => {
  if (activeTab.value === 'long-term' && !formData.name) {
    return // Form validation - require at least a name
  }
  
  purchaseComplete.value = true
}

// Navigate back to home
const navigateToHome = () => {
  router.push('/')
}

// Reset all states
const resetPurchase = () => {
  selectedTicket.value = null
  purchaseComplete.value = false
  formData.showForm = false
  formData.name = ''
  formData.age = ''
  formData.email = ''
  formData.category = 'standard'
}
</script>

<template>
  <div class="tickets-view">
    <button 
      class="back-button" 
      @click="navigateToHome" 
      v-voix="'back-to-home-from-tickets'"
      hint="Zurück zur Startseite">
      ← Zurück
    </button>

    <div class="container">
      <h1 v-voix="'buy-ticket-title'">Ticket kaufen</h1>
      
      <div v-if="!selectedTicket" class="ticket-selection">
        <!-- Tab navigation -->
        <div class="tabs" v-voix="'ticket-type-tabs'" hint="Wählen Sie zwischen Kurzzeit- und Langzeittickets">
          <button 
            class="tab" 
            :class="{ active: activeTab === 'short-term' }" 
            @click="activeTab = 'short-term'"
            v-voix="'short-term-tab'"
            hint="Klicken für Kurzzeittickets">
            Kurzzeittickets
          </button>
          <button 
            class="tab" 
            :class="{ active: activeTab === 'long-term' }" 
            @click="activeTab = 'long-term'"
            v-voix="'long-term-tab'"
            hint="Klicken für Langzeittickets">
            Langzeittickets
          </button>
        </div>
        
        <!-- Short term tickets -->
        <div v-if="activeTab === 'short-term'" class="tickets-container">
          <div 
            v-for="ticket in appData.tickets.shortTerm" 
            :key="ticket.id"
            class="ticket-card"
            @click="selectTicket(ticket)"
            v-voix="'ticket-' + ticket.id"
            :hint="`${ticket.name}: ${ticket.description}. Preis: ${ticket.price.toFixed(2)} Euro. Gültigkeitsdauer: ${ticket.duration}.`">
            
            <div class="ticket-header">
              <h3>{{ ticket.name }}</h3>
              <div class="ticket-price">{{ ticket.price.toFixed(2) }} €</div>
            </div>
            
            <div class="ticket-details">
              <p class="ticket-description">{{ ticket.description }}</p>
              <p class="ticket-duration">Gültigkeitsdauer: {{ ticket.duration }}</p>
            </div>
            
            <button class="btn btn-primary ticket-cta" v-voix="'buy-' + ticket.id" hint="Dieses Ticket kaufen">
              Auswählen
            </button>
          </div>
        </div>
        
        <!-- Long term tickets -->
        <div v-if="activeTab === 'long-term'" class="tickets-container">
          <div 
            v-for="ticket in appData.tickets.longTerm" 
            :key="ticket.id"
            class="ticket-card"
            @click="selectTicket(ticket)"
            v-voix="'ticket-' + ticket.id"
            :hint="`${ticket.name}: ${ticket.description}. Grundpreis: ${ticket.basePrice.toFixed(2)} Euro. Gültigkeitsdauer: ${ticket.duration}.`">
            
            <div class="ticket-header">
              <h3>{{ ticket.name }}</h3>
              <div class="ticket-price">{{ ticket.basePrice.toFixed(2) }} €</div>
            </div>
            
            <div class="ticket-details">
              <p class="ticket-description">{{ ticket.description }}</p>
              <p class="ticket-duration">Gültigkeitsdauer: {{ ticket.duration }}</p>
              <p class="ticket-discount-hint">Ermäßigungen verfügbar für Studierende, Senioren und Kinder</p>
            </div>
            
            <button class="btn btn-primary ticket-cta" v-voix="'buy-' + ticket.id" hint="Dieses Ticket kaufen">
              Auswählen
            </button>
          </div>
        </div>
      </div>
      
      <!-- Personal data form for long term tickets -->
      <div v-else-if="formData.showForm && !purchaseComplete" class="personal-data-form">
        <h2>Persönliche Daten</h2>
        <p class="form-intro">
          Bitte gib deine persönlichen Daten ein, um ein personalisiertes 
          {{ selectedTicket.name }} zu erhalten.
        </p>
        
        <div class="form-group">
          <label for="name" v-voix="'name-label'" hint="Pflichtfeld">Name:</label>
          <input 
            type="text" 
            id="name" 
            class="form-control" 
            v-model="formData.name" 
            placeholder="Vollständiger Name"
            v-voix="'name-input'"
            hint="Geben Sie Ihren vollständigen Namen ein">
        </div>
        
        <div class="form-group">
          <label for="age" v-voix="'age-label'">Alter:</label>
          <input 
            type="number" 
            id="age" 
            class="form-control" 
            v-model="formData.age" 
            placeholder="Alter in Jahren"
            v-voix="'age-input'"
            hint="Geben Sie Ihr Alter ein">
        </div>
        
        <div class="form-group">
          <label for="email" v-voix="'email-label'">E-Mail:</label>
          <input 
            type="email" 
            id="email" 
            class="form-control" 
            v-model="formData.email" 
            placeholder="E-Mail-Adresse"
            v-voix="'email-input'"
            hint="Geben Sie Ihre E-Mail-Adresse ein">
        </div>
        
        <div class="form-group">
          <label for="category" v-voix="'category-label'">Kategorie:</label>
          <select 
            id="category" 
            class="form-control" 
            v-model="formData.category"
            v-voix="'category-select'"
            hint="Wählen Sie Ihre Kategorie aus">
            <option value="standard">Standard</option>
            <option value="student">Student/in</option>
            <option value="senior">Senior/in (65+)</option>
            <option value="children">Kind (bis 14 Jahre)</option>
          </select>
        </div>
        
        <div class="summary-box">
          <h3>Zusammenfassung</h3>
          <div class="summary-item">
            <span class="summary-label">Tickettyp:</span>
            <span class="summary-value">{{ selectedTicket.name }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Grundpreis:</span>
            <span class="summary-value">{{ selectedTicket.basePrice.toFixed(2) }} €</span>
          </div>
          <div class="summary-item" v-if="eligibleForDiscount">
            <span class="summary-label">Ermäßigung:</span>
            <span class="summary-value">{{ selectedTicket.discountOptions[formData.category] }}%</span>
          </div>
          <div class="summary-item final-price">
            <span class="summary-label">Endpreis:</span>
            <span class="summary-value">{{ calculateDiscountedPrice(selectedTicket) }} €</span>
          </div>
        </div>
        
        <div class="form-actions">
          <button 
            class="btn btn-secondary" 
            @click="resetPurchase"
            v-voix="'cancel-purchase'"
            hint="Kauf abbrechen und zur Ticketauswahl zurückkehren">
            Abbrechen
          </button>
          <button 
            class="btn btn-primary" 
            @click="completePurchase"
            :disabled="!formData.name"
            v-voix="'complete-purchase'"
            hint="Kauf abschließen">
            Kauf abschließen
          </button>
        </div>
      </div>
      
      <!-- Purchase confirmation -->
      <div v-else-if="purchaseComplete" class="purchase-confirmation">
        <div class="confirmation-icon">✓</div>
        <h2 v-voix="'purchase-complete'">Ticketkauf erfolgreich!</h2>
        
        <div class="ticket-preview">
          <div class="ticket-preview-header">
            <div class="ticket-logo">StadtMobil</div>
            <div class="ticket-type">{{ selectedTicket.name }}</div>
          </div>
          
          <div class="ticket-preview-details">
            <div class="ticket-qr">
              <!-- Simulated QR code with CSS -->
              <div class="qr-code"></div>
            </div>
            <div class="ticket-info">
              <div class="ticket-info-item" v-if="activeTab === 'long-term' && formData.name">
                <span class="info-label">Name:</span>
                <span class="info-value">{{ formData.name }}</span>
              </div>
              <div class="ticket-info-item">
                <span class="info-label">Gültig für:</span>
                <span class="info-value">{{ selectedTicket.duration }}</span>
              </div>
              <div class="ticket-info-item">
                <span class="info-label">Preis:</span>
                <span class="info-value">
                  {{ 
                    activeTab === 'long-term' 
                    ? calculateDiscountedPrice(selectedTicket) 
                    : selectedTicket.price.toFixed(2) 
                  }} €
                </span>
              </div>
            </div>
          </div>
          
          <p class="ticket-instructions">
            Dein Ticket wurde an deine E-Mail gesendet und ist auch in der StadtMobil App verfügbar.
          </p>
        </div>
        
        <button 
          class="btn btn-primary back-to-home" 
          @click="navigateToHome"
          v-voix="'return-to-home'"
          hint="Zur Startseite zurückkehren">
          Zurück zur Startseite
        </button>
      </div>
      
      <!-- Short term ticket direct purchase (no form) -->
      <div v-else-if="selectedTicket && activeTab === 'short-term' && !purchaseComplete" class="processing-purchase">
        <div class="loading-spinner"></div>
        <h3>Verarbeite Kauf...</h3>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tickets-view {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  background-color: #f8f9fa;
}

.back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: none;
  border: none;
  color: #007bff;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #007bff;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #dee2e6;
}

.tab {
  padding: 1rem 2rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #6c757d;
  position: relative;
}

.tab.active {
  color: #007bff;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #007bff;
}

/* Ticket cards */
.tickets-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.ticket-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.ticket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ticket-header h3 {
  margin: 0;
  color: #212529;
}

.ticket-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #007bff;
}

.ticket-details {
  flex: 1;
  margin-bottom: 1.5rem;
}

.ticket-description {
  margin-bottom: 0.5rem;
}

.ticket-duration {
  color: #6c757d;
  font-size: 0.9rem;
}

.ticket-discount-hint {
  font-size: 0.8rem;
  color: #28a745;
  margin-top: 0.5rem;
}

.ticket-cta {
  width: 100%;
}

/* Personal data form */
.personal-data-form {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-intro {
  margin-bottom: 2rem;
  color: #6c757d;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
}

/* Summary box */
.summary-box {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-label {
  color: #6c757d;
}

.summary-value {
  font-weight: 600;
}

.final-price {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.final-price .summary-value {
  color: #007bff;
  font-size: 1.2rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

/* Purchase confirmation */
.purchase-confirmation {
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.confirmation-icon {
  width: 80px;
  height: 80px;
  background-color: #28a745;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 2rem;
}

.ticket-preview {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
}

.ticket-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #007bff, #28a745);
}

.ticket-preview-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.ticket-logo {
  font-weight: 700;
  color: #007bff;
  font-size: 1.5rem;
}

.ticket-type {
  background-color: #e9ecef;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
}

.ticket-preview-details {
  display: flex;
  margin-bottom: 1.5rem;
}

.ticket-qr {
  flex: 0 0 120px;
  margin-right: 1.5rem;
}

.qr-code {
  width: 120px;
  height: 120px;
  background-color: #f8f9fa;
  position: relative;
  overflow: hidden;
}

.qr-code::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    repeating-linear-gradient(0deg, 
      transparent, transparent 10px, 
      #333 10px, #333 20px),
    repeating-linear-gradient(90deg, 
      transparent, transparent 10px, 
      #333 10px, #333 20px);
  background-size: 30% 30%;
  background-position: center;
  opacity: 0.2;
}

.ticket-info {
  flex: 1;
  text-align: left;
}

.ticket-info-item {
  margin-bottom: 0.75rem;
}

.info-label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.ticket-instructions {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 1.5rem;
}

.back-to-home {
  margin-top: 2rem;
}

/* Processing purchase */
.processing-purchase {
  text-align: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #e9ecef;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  margin: 0 auto 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .ticket-preview-details {
    flex-direction: column;
    align-items: center;
  }
  
  .ticket-qr {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
  
  .ticket-info {
    text-align: center;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>