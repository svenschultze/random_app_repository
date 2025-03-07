<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock diagnosis data - in a real app, this would come from an API
const mockDiagnoses = [
  {
    name: 'Common Cold',
    probability: 'High',
    description: 'A viral infection of the upper respiratory tract that primarily affects the nose and throat.',
    selfCare: [
      'Rest and drink plenty of fluids',
      'Use over-the-counter pain relievers like acetaminophen to reduce fever and discomfort',
      'Use saline nasal spray to relieve congestion',
      'Gargle with salt water to soothe a sore throat'
    ],
    whenToSeeDoctor: 'If symptoms worsen after 7 days, or if you develop high fever, severe headache, or persistent cough.'
  },
  {
    name: 'Seasonal Allergies',
    probability: 'Medium',
    description: 'An immune response to environmental triggers like pollen, dust, or pet dander that causes inflammation in the nasal passages.',
    selfCare: [
      'Avoid known allergens when possible',
      'Use over-the-counter antihistamines to reduce symptoms',
      'Try nasal irrigation with saline solution',
      'Keep windows closed during high pollen seasons'
    ],
    whenToSeeDoctor: 'If over-the-counter medications don\'t provide relief, or if allergies interfere with daily activities or sleep.'
  },
  {
    name: 'Sinusitis',
    probability: 'Low',
    description: 'Inflammation of the sinuses, which are air-filled cavities in the facial bones. It can be caused by viruses, bacteria, or allergies.',
    selfCare: [
      'Apply warm compresses to the face to relieve pressure',
      'Use a humidifier to add moisture to the air',
      'Use over-the-counter decongestants (short-term only)',
      'Stay hydrated to thin mucus'
    ],
    whenToSeeDoctor: 'If symptoms last more than 10 days, if you have severe pain and swelling around your eyes or forehead, or if you have a fever over 102°F (38.9°C).'
  }
]

// User data
const userData = ref(null)
const selectedDiagnosis = ref(null)
const isLoading = ref(true)

onMounted(() => {
  // Get data from sessionStorage
  try {
    const storedData = sessionStorage.getItem('symptomData')
    if (storedData) {
      userData.value = JSON.parse(storedData)
    } else {
      // If no data, redirect back to symptom checker
      router.push('/symptom-checker')
    }
  } catch (e) {
    console.error('Error retrieving symptom data:', e)
  }

  // Simulate API call delay
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

// View detailed diagnosis
const viewDiagnosis = (diagnosis) => {
  selectedDiagnosis.value = diagnosis
  // Scroll to details section
  setTimeout(() => {
    document.getElementById('diagnosis-details')?.scrollIntoView({ behavior: 'smooth' })
  }, 100)
}

// Start over
const startOver = () => {
  sessionStorage.removeItem('symptomData')
  router.push('/symptom-checker')
}
</script>

<template>
  <div class="symptom-result">
    <div class="page-header">
      <h1 v-voix="'results-title'">Symptom Analysis Results</h1>
      <p class="subtitle">Based on the information you provided</p>
    </div>
    
    <div v-if="isLoading" class="loading-container">
      <div class="loader"></div>
      <p>Analyzing your symptoms...</p>
    </div>
    
    <div v-else class="results-container">
      <!-- Summary of user input -->
      <section class="user-input-summary">
        <h2 v-voix="'symptoms-reported-heading'">Symptoms Reported</h2>
        <div class="symptoms-list">
          <span 
            v-for="(symptom, index) in userData.symptoms" 
            :key="index" 
            class="symptom-tag"
          >
            {{ symptom }}
          </span>
        </div>
        <div class="input-details">
          <p><strong>Duration:</strong> {{ userData.duration }}</p>
          <p><strong>Severity:</strong> {{ userData.severity }}</p>
          <p v-if="userData.notes"><strong>Additional notes:</strong> {{ userData.notes }}</p>
        </div>
      </section>
      
      <!-- Potential diagnoses -->
      <section class="diagnoses-section">
        <h2 v-voix="'potential-diagnoses-heading'">Potential Diagnoses</h2>
        <p class="disclaimer">
          These potential diagnoses are based on the symptoms you reported and are for informational purposes only. 
          They are not a definitive medical diagnosis.
        </p>
        
        <div class="diagnoses-list">
          <div 
            v-for="(diagnosis, index) in mockDiagnoses" 
            :key="index"
            class="diagnosis-card"
            @click="viewDiagnosis(diagnosis)"
            v-voix="'diagnosis-' + diagnosis.name.toLowerCase().replace(/\s+/g, '-')"
          >
            <div class="diagnosis-header">
              <h3>{{ diagnosis.name }}</h3>
              <div 
                class="probability-badge"
                :class="{
                  'high': diagnosis.probability === 'High',
                  'medium': diagnosis.probability === 'Medium',
                  'low': diagnosis.probability === 'Low'
                }"
              >
                {{ diagnosis.probability }} probability
              </div>
            </div>
            <p class="diagnosis-description">{{ diagnosis.description }}</p>
            <button class="view-details-button">View Details</button>
          </div>
        </div>
      </section>
      
      <!-- Detailed diagnosis information -->
      <section v-if="selectedDiagnosis" id="diagnosis-details" class="diagnosis-details">
        <h2 v-voix="'diagnosis-details-heading'">{{ selectedDiagnosis.name }} Details</h2>
        
        <div class="info-box description-box">
          <h3 v-voix="'about-condition-heading'">About this condition</h3>
          <p>{{ selectedDiagnosis.description }}</p>
        </div>
        
        <div class="info-box self-care-box">
          <h3 v-voix="'self-care-heading'">Self-Care Recommendations</h3>
          <ul>
            <li v-for="(care, index) in selectedDiagnosis.selfCare" :key="index">
              {{ care }}
            </li>
          </ul>
        </div>
        
        <div class="info-box doctor-box">
          <h3 v-voix="'when-to-see-doctor-heading'">When to See a Doctor</h3>
          <p>{{ selectedDiagnosis.whenToSeeDoctor }}</p>
        </div>
        
        <div class="disclaimer-box">
          <p>
            <strong>IMPORTANT:</strong> This information is provided for educational purposes only 
            and is not intended to replace professional medical advice, diagnosis, or treatment. 
            If you are concerned about your health, please consult a healthcare professional.
          </p>
        </div>
      </section>
      
      <!-- Action buttons -->
      <div class="action-buttons">
        <button 
          class="start-over-button" 
          @click="startOver"
          v-voix="'start-over-button'"
        >
          Start Over
        </button>
        <a 
          href="#" 
          class="save-button"
          v-voix="'save-results-button'"
        >
          Save Results
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.symptom-result {
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.user-input-summary {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.user-input-summary h2 {
  color: #1e40af;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.symptoms-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.symptom-tag {
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.input-details {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
  color: #4b5563;
}

.input-details p {
  margin: 0.5rem 0;
}

.diagnoses-section {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.diagnoses-section h2 {
  color: #1e40af;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.disclaimer {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.diagnoses-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.diagnosis-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.diagnosis-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.diagnosis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.diagnosis-header h3 {
  margin: 0;
  color: #1e40af;
  font-size: 1.25rem;
}

.probability-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-weight: 500;
}

.probability-badge.high {
  background-color: #dcfce7;
  color: #166534;
}

.probability-badge.medium {
  background-color: #fef9c3;
  color: #854d0e;
}

.probability-badge.low {
  background-color: #fee2e2;
  color: #991b1b;
}

.diagnosis-description {
  color: #4b5563;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.view-details-button {
  background: none;
  border: 1px solid #2563eb;
  color: #2563eb;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.view-details-button:hover {
  background-color: #2563eb;
  color: white;
}

.diagnosis-details {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.diagnosis-details h2 {
  color: #1e40af;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.info-box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

.info-box h3 {
  color: #1e40af;
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.info-box p,
.info-box ul {
  color: #4b5563;
  margin: 0;
}

.info-box ul {
  padding-left: 1.5rem;
}

.info-box li {
  margin-bottom: 0.5rem;
}

.self-care-box {
  background-color: #f0f9ff;
  border-color: #bae6fd;
}

.doctor-box {
  background-color: #fff7ed;
  border-color: #ffedd5;
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

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.start-over-button {
  flex: 1;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
}

.save-button {
  flex: 1;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  text-align: center;
}

.start-over-button:hover {
  background-color: #e5e7eb;
}

.save-button:hover {
  background-color: #1d4ed8;
}

@media (min-width: 768px) {
  .diagnoses-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 640px) {
  .diagnosis-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>