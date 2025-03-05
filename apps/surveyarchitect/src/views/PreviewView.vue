<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Get survey from sessionStorage
const surveyState = ref(null)
const loading = ref(true)
const error = ref(null)
const router = useRouter()

// Computed state
const hasData = computed(() => surveyState.value !== null)

// Load the survey from sessionStorage
onMounted(() => {
  try {
    const surveyData = sessionStorage.getItem('previewSurvey')
    
    if (!surveyData) {
      error.value = 'No survey data found. Please return to the editor and preview from there.'
      loading.value = false
      return
    }
    
    surveyState.value = JSON.parse(surveyData)
    loading.value = false
  } catch (e) {
    console.error('Failed to load survey preview:', e)
    error.value = 'Failed to load survey preview. Please try again.'
    loading.value = false
  }
})

// Return to editor
const backToEditor = () => {
  router.push('/editor')
}
</script>

<template>
  <div class="preview-container">
    <div class="preview-header">
      <h1 v-voix="'preview-heading'">Survey Preview</h1>
      <button 
        @click="backToEditor" 
        class="back-button"
        v-voix="'back-to-editor-button'"
        hint="Return to the survey editor"
      >
        &larr; Back to Editor
      </button>
    </div>
    
    <div v-if="loading" class="loading-container">
      <p>Loading preview...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button 
        @click="backToEditor" 
        class="primary-button"
        v-voix="'go-to-editor-button'"
        hint="Go to the survey editor to create a survey"
      >
        Go to Editor
      </button>
    </div>
    
    <div v-else-if="hasData" class="survey-preview">
      <div class="survey-container">
        <div class="survey-header">
          <h2 class="survey-title">{{ surveyState.title }}</h2>
          <p class="survey-description">{{ surveyState.description }}</p>
        </div>
        
        <div class="questions-preview">
          <div 
            v-for="(question, index) in surveyState.questions" 
            :key="question.id" 
            class="question-preview-card"
          >
            <div class="question-header">
              <span class="question-number">Question {{ index + 1 }}</span>
              <span class="question-type">{{ question.type.replace('_', ' ') }}</span>
            </div>
            
            <div class="question-content">
              <h3 class="question-text">
                {{ question.text.en }}
                <span v-if="question.required" class="required-indicator">*</span>
              </h3>
              
              <p v-if="question.description.en" class="question-description">
                {{ question.description.en }}
              </p>
              
              <!-- Multiple Choice Question -->
              <div v-if="question.type === 'multiple_choice'" class="question-options">
                <div v-for="option in question.options" :key="option.id" class="option-item">
                  <input type="radio" :id="'opt-'+option.id" :name="'q'+question.id" disabled>
                  <label :for="'opt-'+option.id">{{ option.text.en }}</label>
                </div>
                
                <div v-if="question.properties.allowOther" class="option-item">
                  <input type="radio" :id="'opt-other-'+question.id" :name="'q'+question.id" disabled>
                  <label :for="'opt-other-'+question.id">Other:</label>
                  <input type="text" disabled placeholder="Enter other option" class="other-input">
                </div>
              </div>
              
              <!-- Checkbox Group Question -->
              <div v-else-if="question.type === 'checkbox_group'" class="question-options">
                <div v-for="option in question.options" :key="option.id" class="option-item">
                  <input type="checkbox" :id="'opt-'+option.id" disabled>
                  <label :for="'opt-'+option.id">{{ option.text.en }}</label>
                </div>
                
                <div v-if="question.properties.allowOther" class="option-item">
                  <input type="checkbox" :id="'opt-other-'+question.id" disabled>
                  <label :for="'opt-other-'+question.id">Other:</label>
                  <input type="text" disabled placeholder="Enter other option" class="other-input">
                </div>
                
                <p v-if="question.properties.minSelections > 0 || question.properties.maxSelections" class="selection-limits">
                  <small v-if="question.properties.minSelections > 0 && question.properties.maxSelections">
                    Please select between {{ question.properties.minSelections }} and {{ question.properties.maxSelections }} options.
                  </small>
                  <small v-else-if="question.properties.minSelections > 0">
                    Please select at least {{ question.properties.minSelections }} options.
                  </small>
                  <small v-else-if="question.properties.maxSelections">
                    Please select at most {{ question.properties.maxSelections }} options.
                  </small>
                </p>
              </div>
              
              <!-- Likert Scale Question -->
              <div v-else-if="question.type === 'likert_scale'" class="likert-container">
                <div class="likert-labels">
                  <span class="likert-start">{{ question.properties.labels.start.en }}</span>
                  <span class="likert-end">{{ question.properties.labels.end.en }}</span>
                </div>
                
                <div class="likert-scale">
                  <div v-for="n in question.properties.scale" :key="n" class="likert-option">
                    <input type="radio" :id="'q'+question.id+'-'+n" :name="'q'+question.id" disabled>
                    <label v-if="question.properties.showValues" :for="'q'+question.id+'-'+n">{{ n }}</label>
                  </div>
                </div>
              </div>
              
              <!-- Open Text Question -->
              <div v-else-if="question.type === 'open_text'" class="open-text-container">
                <div v-if="question.properties.multiline">
                  <textarea 
                    disabled 
                    :placeholder="question.properties.placeholder.en || 'Enter your answer here...'" 
                    class="text-area"
                  ></textarea>
                </div>
                <div v-else>
                  <input 
                    type="text" 
                    disabled 
                    :placeholder="question.properties.placeholder.en || 'Enter your answer here...'" 
                    class="text-input"
                  >
                </div>
              </div>
              
              <!-- Dropdown Question -->
              <div v-else-if="question.type === 'dropdown'" class="dropdown-container">
                <select disabled class="dropdown-select">
                  <option disabled selected>{{ question.properties.placeholder.en || '-- Select an option --' }}</option>
                  <option v-for="option in question.options" :key="option.id" disabled>
                    {{ option.text.en }}
                  </option>
                </select>
              </div>
              
              <!-- Matrix Question -->
              <div v-else-if="question.type === 'matrix'" class="matrix-container">
                <table class="matrix-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th v-for="column in question.columns" :key="column.id">
                        {{ column.text.en }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in question.rows" :key="row.id">
                      <td>{{ row.text.en }}</td>
                      <td v-for="column in question.columns" :key="column.id" class="matrix-cell">
                        <input type="radio" disabled>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Numeric Question -->
              <div v-else-if="question.type === 'numeric'" class="numeric-container">
                <div class="numeric-input-row">
                  <input type="number" disabled class="numeric-input">
                  <span v-if="question.properties.unit.en" class="unit-label">
                    {{ question.properties.unit.en }}
                  </span>
                </div>
                
                <p v-if="question.properties.min !== null || question.properties.max !== null" class="range-hint">
                  <small>
                    <template v-if="question.properties.min !== null && question.properties.max !== null">
                      Value must be between {{ question.properties.min }} and {{ question.properties.max }}.
                    </template>
                    <template v-else-if="question.properties.min !== null">
                      Value must be at least {{ question.properties.min }}.
                    </template>
                    <template v-else-if="question.properties.max !== null">
                      Value must be at most {{ question.properties.max }}.
                    </template>
                  </small>
                </p>
              </div>
              
              <!-- Date Question -->
              <div v-else-if="question.type === 'date'" class="date-container">
                <input type="date" disabled class="date-input">
              </div>
              
              <!-- Other question types -->
              <div v-else class="generic-preview">
                <p class="preview-placeholder">{{ question.type.replace('_', ' ') }} question</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="preview-actions">
          <button class="primary-button" disabled>Submit Survey</button>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-container">
      <p>No survey data available.</p>
      <button 
        @click="backToEditor" 
        class="primary-button"
        v-voix="'create-survey-button'"
        hint="Go to the survey editor to create a survey"
      >
        Create a Survey
      </button>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-md);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.preview-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.back-button {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: var(--accent-light);
}

.loading-container,
.error-container,
.empty-container {
  text-align: center;
  padding: var(--spacing-xxl);
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.error-container {
  border-left: 4px solid var(--error-color);
}

.error-container p {
  margin-bottom: var(--spacing-lg);
  color: var(--error-color);
}

.survey-container {
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.survey-header {
  padding: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--neutral-50);
}

.survey-title {
  margin: 0 0 var(--spacing-sm);
  font-size: 1.25rem;
  color: var(--accent-color);
}

.survey-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.questions-preview {
  padding: var(--spacing-xl);
}

.question-preview-card {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.question-number {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-color);
}

.question-type {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-transform: capitalize;
}

.question-text {
  margin: 0 0 var(--spacing-sm);
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 500;
}

.required-indicator {
  color: var(--error-color);
  margin-left: var(--spacing-xs);
}

.question-description {
  margin: 0 0 var(--spacing-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Multiple Choice & Checkbox styles */
.question-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.option-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.option-item input[type="radio"],
.option-item input[type="checkbox"] {
  accent-color: var(--accent-color);
}

.other-input {
  flex: 1;
  margin-left: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}

.selection-limits {
  margin-top: var(--spacing-sm);
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

/* Likert Scale styles */
.likert-container {
  margin: var(--spacing-md) 0;
}

.likert-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.likert-scale {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.likert-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

/* Open text styles */
.text-input,
.text-area,
.numeric-input,
.date-input,
.dropdown-select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  background-color: var(--neutral-50);
}

.text-area {
  min-height: 100px;
  resize: vertical;
}

/* Matrix styles */
.matrix-container {
  overflow-x: auto;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
}

.matrix-table th,
.matrix-table td {
  padding: var(--spacing-sm);
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
}

.matrix-table th {
  color: var(--text-secondary);
  font-weight: 500;
}

.matrix-table td:first-child {
  text-align: left;
  font-weight: 500;
}

.matrix-cell {
  text-align: center;
}

/* Numeric styles */
.numeric-input-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.numeric-input {
  width: 150px;
}

.unit-label {
  color: var(--text-secondary);
}

.range-hint {
  margin-top: var(--spacing-xs);
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

/* Generic preview */
.generic-preview {
  background-color: var(--neutral-100);
  padding: var(--spacing-lg);
  border-radius: var(--radius-sm);
  text-align: center;
}

.preview-placeholder {
  color: var(--text-tertiary);
  margin: 0;
  font-style: italic;
}

/* Preview actions */
.preview-actions {
  padding: var(--spacing-xl);
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.primary-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .preview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .matrix-table {
    font-size: 0.75rem;
  }
  
  .matrix-table th,
  .matrix-table td {
    padding: var(--spacing-xs);
  }
}
</style>