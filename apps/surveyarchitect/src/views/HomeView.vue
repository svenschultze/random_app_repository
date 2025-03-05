<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const createNewSurvey = () => {
  router.push('/editor')
}

const loadSurvey = () => {
  // In a real app, this would open a file picker
  // For now, we'll just redirect to the editor
  router.push('/editor')
}
</script>

<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1 v-voix="'welcome-heading'" class="welcome-title">{{ t('welcome') }}</h1>
      <p v-voix="'welcome-description'" class="welcome-description">
        Design powerful scientific surveys with an intuitive drag-and-drop interface.
        Add questions, set up branching logic, manage translations, and export to a standalone HTML file.
      </p>
      
      <div class="action-buttons">
        <button 
          v-voix="'create-survey-button'" 
          @click="createNewSurvey" 
          class="primary-button"
          hint="Creates a new blank survey and takes you to the editor"
        >
          {{ t('create_survey') }}
        </button>
        
        <button 
          v-voix="'load-survey-button'" 
          @click="loadSurvey" 
          class="secondary-button"
          hint="Opens an existing survey file for editing"
        >
          {{ t('load_survey') }}
        </button>
      </div>
    </div>
    
    <div class="features-section">
      <div class="feature-card">
        <h3 v-voix="'feature-design-title'">Intuitive Design</h3>
        <p v-voix="'feature-design-description'">
          Create surveys using a drag-and-drop interface with multiple question types, customization options, and real-time preview.
        </p>
      </div>
      
      <div class="feature-card">
        <h3 v-voix="'feature-logic-title'">Branching Logic</h3>
        <p v-voix="'feature-logic-description'">
          Set up conditional flows and skip patterns to create adaptive surveys based on respondent answers.
        </p>
      </div>
      
      <div class="feature-card">
        <h3 v-voix="'feature-translation-title'">Multi-language Support</h3>
        <p v-voix="'feature-translation-description'">
          Build multilingual surveys with integrated translation management to reach global audiences.
        </p>
      </div>
      
      <div class="feature-card">
        <h3 v-voix="'feature-export-title'">Standalone Export</h3>
        <p v-voix="'feature-export-description'">
          Export your survey as a single HTML file that works offline without any server requirements.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxl);
}

.welcome-section {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
}

.welcome-title {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.welcome-description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
  flex-wrap: wrap;
}

.primary-button, .secondary-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button {
  background-color: var(--accent-color);
  color: white;
  border: none;
  box-shadow: var(--shadow-sm);
}

.primary-button:hover {
  background-color: var(--accent-hover);
  box-shadow: var(--shadow-md);
}

.secondary-button {
  background-color: white;
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
}

.secondary-button:hover {
  background-color: var(--accent-light);
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: var(--spacing-xl);
}

.feature-card {
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--neutral-300);
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  font-weight: 600;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-description {
    font-size: 1rem;
  }
  
  .features-section {
    grid-template-columns: 1fr;
  }
}
</style>
