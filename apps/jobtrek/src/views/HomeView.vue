<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(1)
const totalSteps = 4

// Form data
const userData = ref({
  name: '',
  jobTitle: '',
  industry: '',
  experience: '',
  goals: {
    shortTerm: '',
    midTerm: '',
    longTerm: ''
  },
  interests: [],
  trackingPreferences: {
    dailyReminders: true,
    weeklyReports: true,
    communityFeatures: false
  }
})

// Available industries and interest options
const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 
  'Marketing', 'Design', 'Manufacturing', 'Retail',
  'Hospitality', 'Construction', 'Legal', 'Other'
]

const interestOptions = [
  'Leadership', 'Technical Skills', 'Communication', 
  'Project Management', 'Creative Work', 'Research',
  'Teaching/Mentoring', 'Entrepreneurship', 'Remote Work'
]

// Experience levels
const experienceLevels = [
  'Entry Level (0-2 years)',
  'Early Career (3-5 years)',
  'Mid-Career (6-10 years)',
  'Experienced (11-15 years)',
  'Senior (16+ years)'
]

const toggleInterest = (interest) => {
  const index = userData.value.interests.indexOf(interest)
  if (index === -1) {
    userData.value.interests.push(interest)
  } else {
    userData.value.interests.splice(index, 1)
  }
}

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    // Complete onboarding and redirect to dashboard
    router.push('/dashboard')
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const skipOnboarding = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="home-container">
    <!-- Welcome splash for first-time users -->
    <section class="welcome-splash">
      <h1 v-voix="'JobTrek App Welcome Heading'">Welcome to JobTrek</h1>
      <p>Your daily companion for career growth and professional development</p>
    </section>

    <!-- Onboarding Process -->
    <div class="onboarding-container">
      <div class="onboarding-progress">
        <div class="progress-bar">
          <div class="progress-indicator" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
        </div>
        <div class="step-indicator">Step {{ currentStep }} of {{ totalSteps }}</div>
      </div>

      <!-- Step 1: Personal Info -->
      <div v-if="currentStep === 1" class="onboarding-step">
        <h2 v-voix="'Personal Information Section'">Tell us about yourself</h2>
        
        <div class="form-group">
          <label for="name" v-voix="'Enter Your Name'">Name</label>
          <input 
            id="name" 
            type="text" 
            v-model="userData.name" 
            v-voix="'Name Input Field'"
            hint="Enter your full name"
          />
        </div>
        
        <div class="form-group">
          <label for="jobTitle" v-voix="'Enter Your Job Title'">Current Job Title</label>
          <input 
            id="jobTitle" 
            type="text" 
            v-model="userData.jobTitle" 
            v-voix="'Job Title Input Field'"
            hint="Enter your current job title"
          />
        </div>
        
        <div class="form-group">
          <label for="industry" v-voix="'Select Your Industry'">Industry</label>
          <select 
            id="industry" 
            v-model="userData.industry"
            v-voix="'Industry Selection Dropdown'"
            hint="Select the industry you work in"
          >
            <option value="" disabled>Select your industry</option>
            <option v-for="industry in industries" :key="industry" :value="industry">
              {{ industry }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="experience" v-voix="'Select Your Experience Level'">Experience Level</label>
          <select 
            id="experience" 
            v-model="userData.experience"
            v-voix="'Experience Level Selection Dropdown'"
            hint="Select your level of professional experience"
          >
            <option value="" disabled>Select your experience level</option>
            <option v-for="level in experienceLevels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </div>
      </div>

      <!-- Step 2: Career Goals -->
      <div v-if="currentStep === 2" class="onboarding-step">
        <h2 v-voix="'Career Goals Section'">Set your career goals</h2>
        <p>Define what you'd like to achieve in your professional journey</p>
        
        <div class="form-group">
          <label for="shortTerm" v-voix="'Enter Short Term Goal'">Short-term Goal (Next 3-6 months)</label>
          <textarea 
            id="shortTerm" 
            v-model="userData.goals.shortTerm" 
            rows="2"
            v-voix="'Short Term Goal Input Field'"
            hint="Enter a professional goal you want to achieve within 6 months"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="midTerm" v-voix="'Enter Mid Term Goal'">Mid-term Goal (6-18 months)</label>
          <textarea 
            id="midTerm" 
            v-model="userData.goals.midTerm" 
            rows="2"
            v-voix="'Mid Term Goal Input Field'"
            hint="Enter a professional goal you want to achieve within 18 months"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="longTerm" v-voix="'Enter Long Term Goal'">Long-term Goal (2-5 years)</label>
          <textarea 
            id="longTerm" 
            v-model="userData.goals.longTerm" 
            rows="2"
            v-voix="'Long Term Goal Input Field'"
            hint="Enter a professional goal you want to achieve within 5 years"
          ></textarea>
        </div>
      </div>

      <!-- Step 3: Professional Interests -->
      <div v-if="currentStep === 3" class="onboarding-step">
        <h2 v-voix="'Professional Interests Section'">Professional interests</h2>
        <p>Select areas you're interested in developing</p>
        
        <div class="interests-selection">
          <div 
            v-for="interest in interestOptions" 
            :key="interest"
            class="interest-chip"
            :class="{ selected: userData.interests.includes(interest) }"
            @click="toggleInterest(interest)"
            v-voix="`Toggle Interest ${interest}`"
            :hint="`Select or deselect ${interest} as an area of interest`"
          >
            {{ interest }}
          </div>
        </div>
      </div>

      <!-- Step 4: Preferences -->
      <div v-if="currentStep === 4" class="onboarding-step">
        <h2 v-voix="'Preferences Section'">Tracking preferences</h2>
        <p>Customize how JobTrek works for you</p>
        
        <div class="preference-option">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              v-model="userData.trackingPreferences.dailyReminders"
              v-voix="'Toggle Daily Reminders'"
              hint="Enable or disable daily reminder notifications"
            />
            <span class="toggle-switch"></span>
            <span class="toggle-text">Daily reminders to log progress</span>
          </label>
        </div>
        
        <div class="preference-option">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              v-model="userData.trackingPreferences.weeklyReports"
              v-voix="'Toggle Weekly Reports'"
              hint="Enable or disable weekly progress report emails"
            />
            <span class="toggle-switch"></span>
            <span class="toggle-text">Weekly progress report emails</span>
          </label>
        </div>
        
        <div class="preference-option">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              v-model="userData.trackingPreferences.communityFeatures"
              v-voix="'Toggle Community Features'"
              hint="Enable or disable community networking features"
            />
            <span class="toggle-switch"></span>
            <span class="toggle-text">Enable community networking features</span>
          </label>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="onboarding-actions">
        <button 
          v-if="currentStep > 1" 
          @click="prevStep" 
          class="btn-secondary"
          v-voix="'Previous Step Button'"
          hint="Go back to the previous step"
        >
          Back
        </button>
        
        <button 
          @click="nextStep" 
          class="btn-primary"
          v-voix="'Next Step Button'"
          hint="Continue to the next step or complete onboarding"
        >
          {{ currentStep === totalSteps ? 'Get Started' : 'Next' }}
        </button>
        
        <button 
          @click="skipOnboarding" 
          class="btn-text"
          v-voix="'Skip Onboarding Button'"
          hint="Skip the onboarding process and go to dashboard"
        >
          Skip
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.welcome-splash {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-splash h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.onboarding-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.onboarding-progress {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-indicator {
  height: 100%;
  background-color: #42b983;
  transition: width 0.3s ease;
}

.step-indicator {
  margin-top: 0.5rem;
  text-align: right;
  font-size: 0.9rem;
  color: #666;
}

.onboarding-step {
  margin-bottom: 2rem;
}

.onboarding-step h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.interests-selection {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.interest-chip {
  padding: 0.75rem 1.25rem;
  background-color: #f5f5f5;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.interest-chip.selected {
  background-color: #42b983;
  color: white;
}

.preference-option {
  margin-bottom: 1.25rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  background-color: #e0e0e0;
  border-radius: 12px;
  margin-right: 12px;
  transition: background-color 0.3s ease;
}

.toggle-label input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label input:checked + .toggle-switch {
  background-color: #42b983;
}

.toggle-switch:after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  transition: left 0.3s ease;
}

.toggle-label input:checked + .toggle-switch:after {
  left: 28px;
}

.toggle-text {
  font-size: 1rem;
}

.onboarding-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #3aa876;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-text {
  background: none;
  border: none;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
}

.btn-text:hover {
  color: #333;
  text-decoration: underline;
}
</style>
