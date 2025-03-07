<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const router = useRouter();
const policy = computed(() => store.state.policy);
const isLoading = computed(() => store.state.isLoading);
const submitSuccess = ref(false);
const submitError = ref(false);

// Form data
const formData = ref({
  dateOfService: new Date().toISOString().split('T')[0],
  category: '',
  amount: '',
  description: ''
});

// Form validation
const errors = ref({});

function validateForm() {
  errors.value = {};
  let isValid = true;
  
  if (!formData.value.dateOfService) {
    errors.value.dateOfService = 'Date of service is required';
    isValid = false;
  }
  
  if (!formData.value.category) {
    errors.value.category = 'Coverage category is required';
    isValid = false;
  }
  
  if (!formData.value.amount) {
    errors.value.amount = 'Amount is required';
    isValid = false;
  } else if (isNaN(formData.value.amount) || formData.value.amount <= 0) {
    errors.value.amount = 'Amount must be a positive number';
    isValid = false;
  }
  
  if (!formData.value.description) {
    errors.value.description = 'Description is required';
    isValid = false;
  }
  
  return isValid;
}

function submitClaim() {
  if (!validateForm()) {
    return;
  }
  
  // Convert amount to number
  const claimData = {
    ...formData.value,
    amount: Number(formData.value.amount)
  };
  
  const success = store.submitClaim(claimData);
  
  if (success) {
    submitSuccess.value = true;
    
    // Redirect to claims page after 2 seconds
    setTimeout(() => {
      router.push('/claims');
    }, 2000);
  } else {
    submitError.value = true;
  }
}

function resetForm() {
  formData.value = {
    dateOfService: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: ''
  };
  errors.value = {};
  submitSuccess.value = false;
  submitError.value = false;
}
</script>

<template>
  <div class="new-claim-view">
    <h2>Submit New Claim</h2>
    
    <div v-if="isLoading">
      <LoadingSpinner message="Processing..." />
    </div>
    
    <div v-else-if="!policy">
      <div class="card">
        <p>No policy data available. Please go to the Dashboard to generate a policy.</p>
      </div>
    </div>
    
    <div v-else-if="submitSuccess" class="card success-card">
      <div class="success-message">
        <h3>Claim Submitted Successfully!</h3>
        <p>Your claim has been submitted and is now pending review.</p>
        <p>You will be redirected to the claims page shortly...</p>
      </div>
    </div>
    
    <div v-else>
      <div class="claim-form card">
        <div v-if="submitError" class="alert error">
          Failed to submit claim. Please try again.
        </div>
        
        <form @submit.prevent="submitClaim">
          <div class="form-group">
            <label for="dateOfService">Date of Service*</label>
            <input 
              type="date" 
              id="dateOfService" 
              v-model="formData.dateOfService"
              :class="{ 'error-input': errors.dateOfService }"
            >
            <div v-if="errors.dateOfService" class="error-message">{{ errors.dateOfService }}</div>
          </div>
          
          <div class="form-group">
            <label for="category">Coverage Category*</label>
            <select 
              id="category" 
              v-model="formData.category"
              :class="{ 'error-input': errors.category }"
            >
              <option value="">Select a category</option>
              <option 
                v-for="(plan, index) in policy.coveragePlans" 
                :key="index" 
                :value="plan.category"
              >
                {{ plan.category }}
              </option>
            </select>
            <div v-if="errors.category" class="error-message">{{ errors.category }}</div>
          </div>
          
          <div class="form-group">
            <label for="amount">Amount (€)*</label>
            <input 
              type="number" 
              id="amount" 
              v-model="formData.amount"
              placeholder="0.00"
              min="0"
              step="0.01"
              :class="{ 'error-input': errors.amount }"
            >
            <div v-if="errors.amount" class="error-message">{{ errors.amount }}</div>
          </div>
          
          <div class="form-group">
            <label for="description">Description*</label>
            <textarea 
              id="description" 
              v-model="formData.description"
              rows="3"
              placeholder="Briefly describe the medical service..."
              :class="{ 'error-input': errors.description }"
            ></textarea>
            <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
          </div>
          
          <div class="form-group file-upload">
            <label>Receipts (Optional)</label>
            <input type="file" disabled>
            <p class="upload-info">Receipt upload is disabled in this demo.</p>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="resetForm">Reset</button>
            <button type="submit" class="btn">Submit Claim</button>
          </div>
        </form>
      </div>
      
      <div class="claim-info card">
        <h3>How to Submit a Claim</h3>
        <ol class="claim-instructions">
          <li>Fill in the date when you received the medical service.</li>
          <li>Select the appropriate coverage category for your claim.</li>
          <li>Enter the total amount you paid for the service.</li>
          <li>Provide a brief description of the service received.</li>
          <li>In a real application, you would attach receipts or supporting documents.</li>
        </ol>
        <p class="claim-note">
          <strong>Note:</strong> In this demo, all claims will be automatically set to "Pending" status.
          No actual submission will occur as this is a demonstration application.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-claim-view {
  max-width: 800px;
  margin: 0 auto;
}

.claim-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.error-input {
  border-color: #dc3545 !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.alert {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.alert.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.upload-info {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

.claim-info {
  background-color: #f8f9fa;
}

.claim-instructions {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.claim-instructions li {
  margin-bottom: 0.5rem;
}

.claim-note {
  font-size: 0.9rem;
  color: #6c757d;
}

.success-card {
  background-color: #d4edda;
  color: #155724;
  text-align: center;
  padding: 2rem;
}

.success-message h3 {
  margin-bottom: 1rem;
}
</style>