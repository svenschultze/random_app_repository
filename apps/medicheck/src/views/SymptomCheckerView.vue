<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Symptom data
const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Sore Throat', 'Fatigue',
  'Shortness of Breath', 'Nausea', 'Vomiting', 'Diarrhea',
  'Muscle Pain', 'Joint Pain', 'Rash', 'Chest Pain',
  'Abdominal Pain', 'Dizziness', 'Congestion'
]

// User input data
const selectedSymptoms = reactive([])
const additionalSymptom = ref('')
const symptomDuration = ref('')
const symptomSeverity = ref('')
const additionalNotes = ref('')

// Form step
const currentStep = ref(1)
const totalSteps = 3

// UI states
const isSubmitting = ref(false)

// Form navigation
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Symptom selection
const toggleSymptom = (symptom) => {
  const index = selectedSymptoms.indexOf(symptom)
  if (index === -1) {
    selectedSymptoms.push(symptom)
  } else {
    selectedSymptoms.splice(index, 1)
  }
}

const addCustomSymptom = () => {
  if (additionalSymptom.value.trim() && !selectedSymptoms.includes(additionalSymptom.value.trim())) {
    selectedSymptoms.push(additionalSymptom.value.trim())
    additionalSymptom.value = ''
  }
}

// Form submission
const submitSymptoms = () => {
  isSubmitting.value = true
  
  // In a real app, you would send the data to your backend
  // Here we'll simulate a delay and redirect to the results page
  setTimeout(() => {
    // Store data in sessionStorage for the results page
    sessionStorage.setItem('symptomData', JSON.stringify({
      symptoms: selectedSymptoms,
      duration: symptomDuration.value,
      severity: symptomSeverity.value,
      notes: additionalNotes.value
    }))
    
    // Navigate to results
    router.push('/symptom-result')
    isSubmitting.value = false
  }, 1500)
}
</script>

<template>
  <div class="symptom-checker">
    <div class="page-header">
      <h1 v-voix="'symptom-checker-title'">Symptom Checker</h1>
      <p class="subtitle">Answer a few questions to receive potential diagnoses and recommendations.</p>
    </div>
    
    <div class="progress-bar">
      <div class="progress" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
    </div>
    
    <!-- Step 1: Symptom Selection -->
    <div v-if="currentStep === 1" class="step-container">
      <h2 v-voix="'select-symptoms-heading'">Select Your Symptoms</h2>
      <p class="instruction">Check all symptoms you are currently experiencing:</p>
      
      <div class="symptom-grid">
        <div 
          v-for="symptom in commonSymptoms" 
          :key="symptom"
          class="symptom-chip"
          :class="{ selected: selectedSymptoms.includes(symptom) }"
          @click="toggleSymptom(symptom)"
          v-voix="'symptom-' + symptom.toLowerCase().replace(' ', '-')"
        >
          {{ symptom }}
        </div>
      </div>
      
      <div class="custom-symptom">
        <label for="additional-symptom" v-voix="'additional-symptom-label'">
          Add another symptom:
        </label>
        <div class="input-group">
          <input 
            id="additional-symptom"
            v-model="additionalSymptom" 
            type="text" 
            placeholder="Type symptom here"
            @keyup.enter="addCustomSymptom"
            v-voix="'additional-symptom-input'"
            hint="Type any additional symptom not listed above"
          />
          <button 
            @click="addCustomSymptom" 
            class="add-button"
            :disabled="!additionalSymptom.trim()"
            v-voix="'add-symptom-button'"
          >
            Add
          </button>
        </div>
      </div>
      
      <div class="selected-symptoms" v-if="selectedSymptoms.length > 0">
        <h3 v-voix="'selected-symptoms-heading'">Selected Symptoms:</h3>
        <div class="selected-list">
          <div 
            v-for="(symptom, index) in selectedSymptoms" 
            :key="index" 
            class="selected-chip"
          >
            {{ symptom }}
            <button 
              @click="toggleSymptom(symptom)" 
              class="remove-button"
              v-voix="'remove-symptom-' + symptom.toLowerCase().replace(' ', '-')"
              :aria-label="'Remove ' + symptom"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
      
      <div class="form-navigation">
        <button 
          class="next-button" 
          :disabled="selectedSymptoms.length === 0" 
          @click="nextStep"
          v-voix="'next-button-symptoms'"
        >
          Continue
        </button>
      </div>
    </div>
    
    <!-- Step 2: Symptom Details -->
    <div v-if="currentStep === 2" class="step-container">
      <h2 v-voix="'symptom-details-heading'">Symptom Details</h2>
      <p class="instruction">Provide more details about your symptoms:</p>
      
      <div class="form-group">
        <label for="symptom-duration" v-voix="'duration-label'">
          How long have you been experiencing these symptoms?
        </label>
        <select 
          id="symptom-duration" 
          v-model="symptomDuration"
          v-voix="'duration-select'"
          hint="Select the duration of your symptoms"
        >
          <option value="">Select duration</option>
          <option value="Less than 24 hours">Less than 24 hours</option>
          <option value="1-3 days">1-3 days</option>
          <option value="3-7 days">3-7 days</option>
          <option value="1-2 weeks">1-2 weeks</option>
          <option value="2-4 weeks">2-4 weeks</option>
          <option value="More than 4 weeks">More than 4 weeks</option>
        </select>
      </div>
      
      <div class="form-group">
        <label v-voix="'severity-label'">How severe are the symptoms overall?</label>
        <div class="severity-options">
          <div 
            class="severity-option"
            :class="{ selected: symptomSeverity === 'Mild' }"
            @click="symptomSeverity = 'Mild'"
            v-voix="'severity-mild'"
          >
            <span class="severity-icon">😐</span>
            <span class="severity-text">Mild</span>
          </div>
          <div 
            class="severity-option"
            :class="{ selected: symptomSeverity === 'Moderate' }"
            @click="symptomSeverity = 'Moderate'"
            v-voix="'severity-moderate'"
          >
            <span class="severity-icon">😟</span>
            <span class="severity-text">Moderate</span>
          </div>
          <div 
            class="severity-option"
            :class="{ selected: symptomSeverity === 'Severe' }"
            @click="symptomSeverity = 'Severe'"
            v-voix="'severity-severe'"
          >
            <span class="severity-icon">😫</span>
            <span class="severity-text">Severe</span>
          </div>
        </div>
      </div>
      
      <div class="form-navigation">
        <button 
          class="back-button" 
          @click="prevStep"
          v-voix="'back-button-details'"
        >
          Back
        </button>
        <button 
          class="next-button" 
          :disabled="!symptomDuration || !symptomSeverity" 
          @click="nextStep"
          v-voix="'next-button-details'"
        >
          Continue
        </button>
      </div>
    </div>
    
    <!-- Step 3: Additional Information -->
    <div v-if="currentStep === 3" class="step-container">
      <h2 v-voix="'additional-info-heading'">Additional Information</h2>
      <p class="instruction">Add any additional notes that might be relevant:</p>
      
      <div class="form-group">
        <label for="additional-notes" v-voix="'notes-label'">
          Notes (allergies, medical history, etc.):
        </label>
        <textarea 
          id="additional-notes" 
          v-model="additionalNotes" 
          rows="4" 
          placeholder="Add any other information that might be helpful..."
          v-voix="'notes-textarea'"
          hint="Enter any relevant medical history, medications, allergies, or other details"
        ></textarea>
      </div>
      
      <div class="disclaimer-box">
        <p>
          <strong>IMPORTANT:</strong> This symptom checker provides information only and is not a substitute 
          for professional medical advice. If you're experiencing severe or life-threatening symptoms, 
          please seek emergency medical attention immediately.
        </p>
      </div>
      
      <div class="form-navigation">
        <button 
          class="back-button" 
          @click="prevStep"
          v-voix="'back-button-notes'"
        >
          Back
        </button>
        <button 
          class="submit-button" 
          :disabled="isSubmitting" 
          @click="submitSymptoms"
          v-voix="'submit-button'"
        >
          {{ isSubmitting ? 'Analyzing...' : 'Get Results' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.symptom-checker {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #4b5563;
}

.progress-bar {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #2563eb;
  transition: width 0.3s ease;
}

.step-container {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.step-container h2 {
  color: #1e40af;
  margin-bottom: 1rem;
}

.instruction {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.symptom-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.symptom-chip {
  background-color: #f3f4f6;
  border-radius: 50px;
  padding: 0.75rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.symptom-chip:hover {
  background-color: #e5e7eb;
}

.symptom-chip.selected {
  background-color: #2563eb;
  color: white;
}

.custom-symptom {
  margin-bottom: 2rem;
}

.custom-symptom label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-weight: 500;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input-group input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.add-button {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 1rem;
  cursor: pointer;
}

.add-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.selected-symptoms {
  margin-bottom: 2rem;
}

.selected-symptoms h3 {
  color: #1e40af;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-chip {
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-button {
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-weight: 500;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.severity-options {
  display: flex;
  gap: 1rem;
}

.severity-option {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.severity-option:hover {
  background-color: #f3f4f6;
}

.severity-option.selected {
  background-color: #dbeafe;
  border-color: #2563eb;
}

.severity-icon {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.disclaimer-box {
  background-color: #fff8f1;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.disclaimer-box p {
  color: #7c2d12;
  margin: 0;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
}

.next-button,
.submit-button {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.next-button:hover,
.submit-button:hover {
  background-color: #1d4ed8;
}

.next-button:disabled,
.submit-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.back-button {
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #e5e7eb;
}

@media (max-width: 640px) {
  .symptom-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .severity-options {
    flex-direction: column;
  }
  
  .form-navigation {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .back-button,
  .next-button,
  .submit-button {
    width: 100%;
  }
}
</style>