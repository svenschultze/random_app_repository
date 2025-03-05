<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addPoll } from '@/store/polls'

const router = useRouter()

const question = ref('')
const options = ref(['', ''])
const isSubmitting = ref(false)
const formErrors = ref({
  question: '',
  options: []
})

// Add a new option field
const addOption = () => {
  options.value.push('')
}

// Remove an option field
const removeOption = (index) => {
  if (options.value.length > 2) {
    options.value.splice(index, 1)
    formErrors.value.options.splice(index, 1)
  }
}

// Validate the form
const validateForm = () => {
  let isValid = true
  formErrors.value = {
    question: '',
    options: Array(options.value.length).fill('')
  }
  
  // Validate question
  if (!question.value.trim()) {
    formErrors.value.question = 'Question is required'
    isValid = false
  } else if (question.value.length < 5) {
    formErrors.value.question = 'Question must be at least 5 characters'
    isValid = false
  }
  
  // Validate options
  const nonEmptyOptions = options.value.filter(opt => opt.trim() !== '')
  if (nonEmptyOptions.length < 2) {
    formErrors.value.options[0] = 'At least 2 options are required'
    isValid = false
  }
  
  // Check for duplicate options
  const uniqueOptions = new Set(options.value.map(opt => opt.trim().toLowerCase()))
  if (uniqueOptions.size !== nonEmptyOptions.length) {
    formErrors.value.options[0] = 'Options must be unique'
    isValid = false
  }
  
  // Validate each option
  options.value.forEach((option, index) => {
    if (!option.trim() && index < 2) {
      formErrors.value.options[index] = 'Option is required'
      isValid = false
    }
  })
  
  return isValid
}

// Submit the form
const submitPoll = () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  // Filter out empty options
  const validOptions = options.value.filter(opt => opt.trim() !== '')
  
  // Create the poll
  const newPoll = addPoll({
    question: question.value.trim(),
    options: validOptions
  })
  
  // Redirect to the poll detail page
  router.push(`/poll/${newPoll.id}`)
}
</script>

<template>
  <main class="create-poll-page" v-voix="'create-poll-page'">
    <div class="container">
      <div class="back-link">
        <router-link to="/" v-voix="'back-to-home'">
          &larr; Back to Home
        </router-link>
      </div>
      
      <div class="form-container">
        <h1 class="page-title" v-voix="'create-poll-title'">Create a New Poll</h1>
        
        <form @submit.prevent="submitPoll" class="poll-form">
          <div class="form-group">
            <label for="question" class="form-label" v-voix="'question-label'">
              Poll Question
            </label>
            <input
              type="text"
              id="question"
              v-model="question"
              placeholder="Enter your question here..."
              class="form-input"
              :class="{ 'input-error': formErrors.question }"
              v-voix="'question-input'"
              hint="Type your poll question here"
            />
            <div v-if="formErrors.question" class="error-message">
              {{ formErrors.question }}
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label" v-voix="'options-label'">
              Answer Options
            </label>
            
            <div 
              v-for="(option, index) in options" 
              :key="index"
              class="option-row"
            >
              <input
                type="text"
                v-model="options[index]"
                :placeholder="`Option ${index + 1}`"
                class="form-input option-input"
                :class="{ 'input-error': formErrors.options[index] }"
                v-voix="'option-input-' + (index + 1)"
                :hint="`Type option ${index + 1} here`"
              />
              <button 
                type="button" 
                class="remove-btn"
                @click="removeOption(index)"
                :disabled="options.length <= 2"
                v-voix="'remove-option-' + (index + 1)"
              >
                &times;
              </button>
            </div>
            
            <div v-if="formErrors.options[0]" class="error-message">
              {{ formErrors.options[0] }}
            </div>
            
            <button 
              type="button" 
              class="add-option-btn" 
              @click="addOption"
              v-voix="'add-option-button'"
            >
              + Add Another Option
            </button>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="submit-btn" 
              :disabled="isSubmitting"
              v-voix="'create-poll-button'"
            >
              {{ isSubmitting ? 'Creating...' : 'Create Poll' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<style scoped>
.create-poll-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.back-link {
  margin-bottom: 20px;
}

.back-link a {
  color: #555;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link a:hover {
  color: #0084ff;
}

.form-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.page-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

.poll-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.form-input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #0084ff;
  outline: none;
}

.option-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.option-input {
  flex: 1;
}

.remove-btn {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  width: 36px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background-color: #d32f2f;
}

.remove-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.add-option-btn {
  background-color: transparent;
  color: #0084ff;
  border: 2px dashed #0084ff;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-option-btn:hover {
  background-color: rgba(0, 132, 255, 0.1);
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.submit-btn {
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 30px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #0066cc;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.input-error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 0.9rem;
  margin-top: 4px;
}
</style>