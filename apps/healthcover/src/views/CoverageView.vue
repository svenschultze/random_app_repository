<script setup>
import { computed, ref } from 'vue';
import store from '../store';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const policy = computed(() => store.state.policy);
const isLoading = computed(() => store.state.isLoading);
const selectedCategory = ref(null);

function selectCategory(category) {
  selectedCategory.value = category;
}

function closeDetails() {
  selectedCategory.value = null;
}
</script>

<template>
  <div class="coverage-view">
    <h2>Your Coverage</h2>
    
    <div v-if="isLoading">
      <LoadingSpinner message="Loading coverage data..." />
    </div>
    
    <div v-else-if="!policy">
      <div class="card">
        <p>No policy data available. Please go to the Dashboard to generate a policy.</p>
      </div>
    </div>
    
    <div v-else>
      <div class="coverage-intro card">
        <h3>Coverage Overview</h3>
        <p>Your health insurance policy includes coverage for the following categories. Click on each category to see detailed information.</p>
      </div>
      
      <div class="coverage-grid">
        <div 
          v-for="(plan, index) in policy.coveragePlans" 
          :key="index" 
          class="coverage-card card"
          @click="selectCategory(plan)"
        >
          <h3 class="coverage-card-title">{{ plan.category }}</h3>
          <div class="coverage-card-content">
            <div class="coverage-limit">
              <span class="limit-label">Coverage Limit:</span>
              <span class="limit-value">{{ plan.coverageLimit }}€</span>
            </div>
            <div class="coverage-details">
              <div class="coverage-detail">
                <span class="detail-label">Deductible:</span>
                <span class="detail-value">{{ plan.deductible }}€</span>
              </div>
              <div class="coverage-detail">
                <span class="detail-label">Co-Pay:</span>
                <span class="detail-value">{{ plan.coPayPercent }}%</span>
              </div>
            </div>
            <button class="btn coverage-details-btn">View Details</button>
          </div>
        </div>
      </div>
      
      <!-- Coverage Details Modal -->
      <div v-if="selectedCategory" class="modal-overlay" @click.self="closeDetails">
        <div class="modal-content card">
          <div class="modal-header">
            <h3>{{ selectedCategory.category }} Coverage Details</h3>
            <button class="close-btn" @click="closeDetails">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="modal-section">
              <h4>Coverage Summary</h4>
              <div class="coverage-detail">
                <span class="detail-label">Coverage Limit:</span>
                <span class="detail-value">{{ selectedCategory.coverageLimit }}€ per year</span>
              </div>
              <div class="coverage-detail">
                <span class="detail-label">Deductible:</span>
                <span class="detail-value">{{ selectedCategory.deductible }}€</span>
              </div>
              <div class="coverage-detail">
                <span class="detail-label">Co-Pay Percentage:</span>
                <span class="detail-value">{{ selectedCategory.coPayPercent }}%</span>
              </div>
              <div class="coverage-detail">
                <span class="detail-label">Waiting Period:</span>
                <span class="detail-value">
                  {{ selectedCategory.waitingPeriod }} {{ selectedCategory.waitingPeriod === 1 ? 'month' : 'months' }}
                </span>
              </div>
              <div class="coverage-detail" v-if="selectedCategory.maxVisitsPerYear">
                <span class="detail-label">Maximum Visits:</span>
                <span class="detail-value">{{ selectedCategory.maxVisitsPerYear }} per year</span>
              </div>
            </div>
            
            <div class="modal-section">
              <h4>What's Covered</h4>
              <ul class="coverage-list">
                <li v-if="selectedCategory.category === 'Outpatient'">
                  Doctor visits and consultations
                </li>
                <li v-if="selectedCategory.category === 'Outpatient'">
                  Diagnostic tests and lab work
                </li>
                <li v-if="selectedCategory.category === 'Outpatient'">
                  Preventive care and check-ups
                </li>
                <li v-if="selectedCategory.category === 'Inpatient'">
                  Hospital room and board
                </li>
                <li v-if="selectedCategory.category === 'Inpatient'">
                  Surgical procedures
                </li>
                <li v-if="selectedCategory.category === 'Inpatient'">
                  Intensive care
                </li>
                <li v-if="selectedCategory.category === 'Dental'">
                  Routine check-ups and cleanings
                </li>
                <li v-if="selectedCategory.category === 'Dental'">
                  Fillings and extractions
                </li>
                <li v-if="selectedCategory.category === 'Vision'">
                  Eye examinations
                </li>
                <li v-if="selectedCategory.category === 'Vision'">
                  Prescription glasses and contact lenses
                </li>
                <li v-if="selectedCategory.category === 'Pharmacy'">
                  Prescription medications
                </li>
                <li v-if="selectedCategory.category === 'Maternity'">
                  Prenatal and postnatal care
                </li>
                <li v-if="selectedCategory.category === 'Maternity'">
                  Delivery and hospital stay
                </li>
                <li v-if="selectedCategory.category === 'Mental Health'">
                  Therapy and counseling sessions
                </li>
                <li v-if="selectedCategory.category === 'Mental Health'">
                  Psychiatric consultations
                </li>
                <li v-if="selectedCategory.category === 'Emergency'">
                  Emergency room visits
                </li>
                <li v-if="selectedCategory.category === 'Emergency'">
                  Ambulance services
                </li>
              </ul>
            </div>
            
            <div class="modal-section">
              <h4>Important Notes</h4>
              <p>
                Some services may require pre-authorization. Please contact customer service
                before receiving non-emergency treatments to confirm coverage.
              </p>
              <p v-if="selectedCategory.waitingPeriod > 0">
                Please note that this coverage has a waiting period of 
                {{ selectedCategory.waitingPeriod }} {{ selectedCategory.waitingPeriod === 1 ? 'month' : 'months' }}.
                Services received during this period will not be covered.
              </p>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn" @click="closeDetails">Close Details</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coverage-intro {
  margin-bottom: 1.5rem;
}

.coverage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.coverage-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.coverage-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.coverage-card-title {
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.coverage-limit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1.1rem;
}

.coverage-details {
  margin-bottom: 1rem;
}

.coverage-detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.detail-label {
  color: #666;
}

.coverage-details-btn {
  width: 100%;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 1.5rem;
}

.modal-section {
  margin-bottom: 1.5rem;
}

.modal-section h4 {
  margin-bottom: 0.75rem;
  color: var(--primary-color);
}

.coverage-list {
  padding-left: 1.5rem;
}

.coverage-list li {
  margin-bottom: 0.5rem;
}

.modal-footer {
  border-top: 1px solid var(--border-color);
  padding: 1rem 1.5rem;
  text-align: right;
}
</style>