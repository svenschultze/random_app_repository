<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentStep = ref(1)
const totalSteps = 3

// Profile data (Step 1)
const profileData = ref({
  profilePicture: null,
  bio: '',
  location: '',
  timezone: 'UTC'
})

// Skills data (Step 2)
const skillsData = ref({
  teachSkills: [{ skill: '', level: 'Intermediate', description: '' }],
  learnSkills: [{ skill: '', level: 'Beginner', description: '' }]
})

// Preferences data (Step 3)
const preferencesData = ref({
  sessionPreference: 'both', // 'online', 'in-person', 'both'
  availableDays: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  },
  timePreferences: {
    morning: false,
    afternoon: false,
    evening: false
  },
  sessionDuration: 60, // minutes
  additionalNotes: ''
})

// Computed props
const progress = computed(() => {
  return (currentStep.value / totalSteps) * 100
})

const isSubmitting = ref(false)

// Step navigation
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    completeOnboarding()
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Skill management
const addTeachSkill = () => {
  skillsData.value.teachSkills.push({ skill: '', level: 'Intermediate', description: '' })
}

const removeTeachSkill = (index) => {
  if (skillsData.value.teachSkills.length > 1) {
    skillsData.value.teachSkills.splice(index, 1)
  }
}

const addLearnSkill = () => {
  skillsData.value.learnSkills.push({ skill: '', level: 'Beginner', description: '' })
}

const removeLearnSkill = (index) => {
  if (skillsData.value.learnSkills.length > 1) {
    skillsData.value.learnSkills.splice(index, 1)
  }
}

// Mock profile picture upload
const handleProfilePictureChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // In a real app, you would upload to server or process the file
    profileData.value.profilePicture = URL.createObjectURL(file)
  }
}

// Complete onboarding and navigate to dashboard
const completeOnboarding = () => {
  isSubmitting.value = true
  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false
    // For demo purposes, we'll store in localStorage
    localStorage.setItem('isLoggedIn', 'true')
    router.push('/dashboard')
  }, 1500)
}

const proficiencyLevels = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
]

const timezones = [
  'UTC',
  'UTC-12:00',
  'UTC-11:00',
  'UTC-10:00',
  'UTC-09:00',
  'UTC-08:00',
  'UTC-07:00',
  'UTC-06:00',
  'UTC-05:00',
  'UTC-04:00',
  'UTC-03:00',
  'UTC-02:00',
  'UTC-01:00',
  'UTC+01:00',
  'UTC+02:00',
  'UTC+03:00',
  'UTC+04:00',
  'UTC+05:00',
  'UTC+06:00',
  'UTC+07:00',
  'UTC+08:00',
  'UTC+09:00',
  'UTC+10:00',
  'UTC+11:00',
  'UTC+12:00'
]
</script>

<template>
  <div class="onboarding-container">
    <div class="onboarding-progress">
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${progress}%` }"
          v-voix="'progress-bar'"
          :hint="`Step ${currentStep} of ${totalSteps}, ${progress}% complete`"
        ></div>
      </div>
      <div class="steps-counter" v-voix="'steps-counter'">
        Step {{ currentStep }} of {{ totalSteps }}
      </div>
    </div>

    <div class="onboarding-card">
      <!-- Step 1: Profile Creation -->
      <div v-if="currentStep === 1" class="onboarding-step">
        <h2 class="step-title" v-voix="'profile-step-title'">Create Your Profile</h2>
        <p class="step-description" v-voix="'profile-step-description'">
          Let's set up your personal profile. This information helps others find and connect with you.
        </p>

        <div class="profile-picture-section">
          <div class="profile-picture-container">
            <img 
              v-if="profileData.profilePicture" 
              :src="profileData.profilePicture" 
              alt="Profile picture preview" 
              class="profile-picture-preview"
            >
            <div v-else class="profile-picture-placeholder">
              <span>👤</span>
            </div>
          </div>
          <div class="profile-picture-controls">
            <label for="profilePicture" class="upload-button" v-voix="'upload-photo-button'">
              <span>Upload Photo</span>
              <input 
                type="file" 
                id="profilePicture" 
                accept="image/*" 
                @change="handleProfilePictureChange" 
                class="file-input"
                v-voix="'profile-picture-input'"
                hint="Select a profile picture to upload"
              >
            </label>
            <p class="upload-hint">JPG, PNG or GIF, max 5MB</p>
          </div>
        </div>

        <div class="form-group">
          <label for="bio" v-voix="'bio-label'">About Me</label>
          <textarea 
            id="bio" 
            v-model="profileData.bio" 
            placeholder="Tell us a bit about yourself, your interests, and your background..."
            class="bio-textarea"
            v-voix="'bio-textarea'"
            hint="Write a brief description about yourself"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="location" v-voix="'location-label'">Location</label>
          <input 
            type="text" 
            id="location" 
            v-model="profileData.location" 
            placeholder="City, Country"
            v-voix="'location-input'"
            hint="Enter your city and country"
          >
        </div>

        <div class="form-group">
          <label for="timezone" v-voix="'timezone-label'">Time Zone</label>
          <select 
            id="timezone" 
            v-model="profileData.timezone"
            v-voix="'timezone-select'"
            hint="Select your time zone"
          >
            <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
          </select>
        </div>
      </div>

      <!-- Step 2: Skills Setup -->
      <div v-if="currentStep === 2" class="onboarding-step">
        <h2 class="step-title" v-voix="'skills-step-title'">Your Skills Exchange</h2>
        <p class="step-description" v-voix="'skills-step-description'">
          List skills you can teach and skills you want to learn. Be specific to find better matches.
        </p>

        <div class="skills-section">
          <h3 v-voix="'teach-skills-title'">Skills I Can Teach</h3>
          <div 
            v-for="(skill, index) in skillsData.teachSkills" 
            :key="`teach-${index}`" 
            class="skill-item"
          >
            <div class="skill-header">
              <h4 v-voix="`teach-skill-${index}-title`">Skill {{ index + 1 }}</h4>
              <button 
                v-if="skillsData.teachSkills.length > 1" 
                @click="removeTeachSkill(index)" 
                class="remove-skill-button"
                v-voix="`remove-teach-skill-${index}`"
                hint="Remove this teaching skill"
              >
                ✕
              </button>
            </div>
            
            <div class="skill-form">
              <div class="form-group">
                <label :for="`teach-skill-${index}`" v-voix="`teach-skill-${index}-label`">Skill Name</label>
                <input 
                  :id="`teach-skill-${index}`" 
                  v-model="skill.skill" 
                  placeholder="e.g., Spanish Language, JavaScript, Photography"
                  v-voix="`teach-skill-${index}-input`"
                  hint="Enter the name of a skill you can teach others"
                >
              </div>
              
              <div class="form-group">
                <label :for="`teach-level-${index}`" v-voix="`teach-level-${index}-label`">Proficiency Level</label>
                <select 
                  :id="`teach-level-${index}`" 
                  v-model="skill.level"
                  v-voix="`teach-level-${index}-select`"
                  hint="Select your proficiency level in this skill"
                >
                  <option v-for="level in proficiencyLevels" :key="level" :value="level">{{ level }}</option>
                </select>
              </div>
              
              <div class="form-group">
                <label :for="`teach-desc-${index}`" v-voix="`teach-desc-${index}-label`">Brief Description</label>
                <textarea 
                  :id="`teach-desc-${index}`" 
                  v-model="skill.description" 
                  placeholder="Describe your experience, approach to teaching, etc."
                  v-voix="`teach-desc-${index}-textarea`"
                  hint="Describe your experience with this skill and teaching approach"
                ></textarea>
              </div>
            </div>
          </div>
          
          <button 
            @click="addTeachSkill" 
            class="add-skill-button"
            v-voix="'add-teach-skill-button'"
            hint="Add another skill you can teach"
          >
            + Add Another Teaching Skill
          </button>
        </div>

        <div class="skills-section">
          <h3 v-voix="'learn-skills-title'">Skills I Want to Learn</h3>
          <div 
            v-for="(skill, index) in skillsData.learnSkills" 
            :key="`learn-${index}`" 
            class="skill-item"
          >
            <div class="skill-header">
              <h4 v-voix="`learn-skill-${index}-title`">Skill {{ index + 1 }}</h4>
              <button 
                v-if="skillsData.learnSkills.length > 1" 
                @click="removeLearnSkill(index)" 
                class="remove-skill-button"
                v-voix="`remove-learn-skill-${index}`"
                hint="Remove this learning skill"
              >
                ✕
              </button>
            </div>
            
            <div class="skill-form">
              <div class="form-group">
                <label :for="`learn-skill-${index}`" v-voix="`learn-skill-${index}-label`">Skill Name</label>
                <input 
                  :id="`learn-skill-${index}`" 
                  v-model="skill.skill" 
                  placeholder="e.g., Guitar, Python, Cooking"
                  v-voix="`learn-skill-${index}-input`"
                  hint="Enter the name of a skill you want to learn"
                >
              </div>
              
              <div class="form-group">
                <label :for="`learn-level-${index}`" v-voix="`learn-level-${index}-label`">Current Level</label>
                <select 
                  :id="`learn-level-${index}`" 
                  v-model="skill.level"
                  v-voix="`learn-level-${index}-select`"
                  hint="Select your current level in this skill"
                >
                  <option v-for="level in proficiencyLevels" :key="level" :value="level">{{ level }}</option>
                </select>
              </div>
              
              <div class="form-group">
                <label :for="`learn-desc-${index}`" v-voix="`learn-desc-${index}-label`">Learning Goals</label>
                <textarea 
                  :id="`learn-desc-${index}`" 
                  v-model="skill.description" 
                  placeholder="Describe what you want to achieve, specific areas of interest, etc."
                  v-voix="`learn-desc-${index}-textarea`"
                  hint="Describe your learning goals for this skill"
                ></textarea>
              </div>
            </div>
          </div>
          
          <button 
            @click="addLearnSkill" 
            class="add-skill-button"
            v-voix="'add-learn-skill-button'"
            hint="Add another skill you want to learn"
          >
            + Add Another Learning Skill
          </button>
        </div>
      </div>

      <!-- Step 3: Preferences & Availability -->
      <div v-if="currentStep === 3" class="onboarding-step">
        <h2 class="step-title" v-voix="'preferences-step-title'">Your Preferences</h2>
        <p class="step-description" v-voix="'preferences-step-description'">
          Set your preferences for skill exchange sessions to help us find the best matches for you.
        </p>

        <div class="form-group">
          <label v-voix="'session-type-label'">Session Type Preference</label>
          <div class="radio-group">
            <div class="radio-option">
              <input 
                type="radio" 
                id="online" 
                value="online" 
                v-model="preferencesData.sessionPreference"
                v-voix="'online-radio'"
                hint="Select for online sessions only"
              >
              <label for="online" v-voix="'online-label'">Online Only</label>
            </div>
            <div class="radio-option">
              <input 
                type="radio" 
                id="inPerson" 
                value="in-person" 
                v-model="preferencesData.sessionPreference"
                v-voix="'in-person-radio'"
                hint="Select for in-person sessions only"
              >
              <label for="inPerson" v-voix="'in-person-label'">In-Person Only</label>
            </div>
            <div class="radio-option">
              <input 
                type="radio" 
                id="both" 
                value="both" 
                v-model="preferencesData.sessionPreference"
                v-voix="'both-radio'"
                hint="Select for both online and in-person sessions"
              >
              <label for="both" v-voix="'both-label'">Both</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label v-voix="'available-days-label'">Available Days</label>
          <div class="checkbox-grid">
            <div class="day-checkbox">
              <input 
                type="checkbox" 
                id="monday" 
                v-model="preferencesData.availableDays.monday"
                v-voix="'monday-checkbox'"
                hint="Check if you're available on Mondays"
              >
              <label for="monday" v-voix="'monday-label'">Monday</label>
            </div>
            <div class="day-checkbox">
              <input 
                type="checkbox" 
                id="tuesday" 
                v-model="preferencesData.availableDays.tuesday"
                v-voix="'tuesday-checkbox'"
                hint="Check if you're available on Tuesdays"
              >
              <label for="tuesday" v-voix="'tuesday-label'">Tuesday</label>
            </div>
            <div class="day-checkbox">
              <input 
                type="checkbox" 
                id="wednesday" 
                v-model="preferencesData.availableDays.wednesday"
                v-voix="'wednesday-checkbox'"
                hint="Check if you're available on Wednesdays"
              >
              <label for="wednesday" v-voix="'wednesday-label'">Wednesday</label>
            </div>
            <div class="day-checkbox">
              <input 
                type="checkbox" 
                id="thursday" 
                v-model="preferencesData.availableDays.thursday"
                v-voix="'thursday-checkbox'"
                hint="Check if you're available on Thursdays"
              >
              <label for="thursday" v-voix="'thursday-label'">Thursday</label>
            </div>
            <div class="day-checkbox">
              <input 
                type="checkbox" 
                id="friday" 
                v-model="preferencesData.availableDays.friday"
                v-voix="'friday-checkbox'"
                hint="Check if you're available on Fridays"
              >
              <label for="friday" v-voix="'friday-label'">Friday</label>
            </div>
            <div class="day-checkbox">
              <input 
                type="checkbox" 
                id="saturday" 
                v-model="preferencesData.availableDays.saturday"
                v-voix="'saturday-checkbox'"
                hint="Check if you're available on Saturdays"
              >
              <label for="saturday" v-voix="'saturday-label'">Saturday</label>
            </div>
            <div class="day-checkbox">
              <input 
                type="checkbox" 
                id="sunday" 
                v-model="preferencesData.availableDays.sunday"
                v-voix="'sunday-checkbox'"
                hint="Check if you're available on Sundays"
              >
              <label for="sunday" v-voix="'sunday-label'">Sunday</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label v-voix="'time-preference-label'">Time of Day Preference</label>
          <div class="checkbox-group">
            <div class="time-checkbox">
              <input 
                type="checkbox" 
                id="morning" 
                v-model="preferencesData.timePreferences.morning"
                v-voix="'morning-checkbox'"
                hint="Check if you're available in the mornings"
              >
              <label for="morning" v-voix="'morning-label'">Morning (6am-12pm)</label>
            </div>
            <div class="time-checkbox">
              <input 
                type="checkbox" 
                id="afternoon" 
                v-model="preferencesData.timePreferences.afternoon"
                v-voix="'afternoon-checkbox'"
                hint="Check if you're available in the afternoons"
              >
              <label for="afternoon" v-voix="'afternoon-label'">Afternoon (12pm-5pm)</label>
            </div>
            <div class="time-checkbox">
              <input 
                type="checkbox" 
                id="evening" 
                v-model="preferencesData.timePreferences.evening"
                v-voix="'evening-checkbox'"
                hint="Check if you're available in the evenings"
              >
              <label for="evening" v-voix="'evening-label'">Evening (5pm-10pm)</label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="sessionDuration" v-voix="'duration-label'">Preferred Session Duration</label>
          <select 
            id="sessionDuration" 
            v-model="preferencesData.sessionDuration"
            v-voix="'duration-select'"
            hint="Select your preferred session length"
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">2 hours</option>
          </select>
        </div>

        <div class="form-group">
          <label for="additionalNotes" v-voix="'notes-label'">Additional Notes</label>
          <textarea 
            id="additionalNotes" 
            v-model="preferencesData.additionalNotes" 
            placeholder="Anything else potential matches should know about your preferences..."
            v-voix="'notes-textarea'"
            hint="Add any additional information about your preferences"
          ></textarea>
        </div>
      </div>

      <div class="navigation-buttons">
        <button 
          v-if="currentStep > 1" 
          @click="prevStep" 
          class="back-button"
          v-voix="'back-button'"
          hint="Go back to the previous step"
        >
          Back
        </button>
        <button 
          v-if="currentStep < totalSteps" 
          @click="nextStep" 
          class="next-button"
          v-voix="'next-button'"
          hint="Continue to the next step"
        >
          Next
        </button>
        <button 
          v-if="currentStep === totalSteps" 
          @click="completeOnboarding" 
          class="complete-button"
          :disabled="isSubmitting"
          v-voix="'complete-button'"
          hint="Complete the setup and go to your dashboard"
        >
          <span v-if="isSubmitting">Setting up your account...</span>
          <span v-else>Complete Setup</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-container {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--header-height));
  background-color: var(--background-color);
  padding: 2rem;
  width: 100%;
}

.onboarding-progress {
  max-width: 800px;
  width: 100%;
  margin: 0 auto 2rem;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.steps-counter {
  text-align: right;
  font-size: 0.875rem;
  color: var(--light-text);
}

.onboarding-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem;
}

.step-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-color);
}

.step-description {
  color: var(--light-text);
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Profile Picture Section */
.profile-picture-section {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: center;
}

.profile-picture-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
  border: 1px solid var(--border-color);
}

.profile-picture-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-picture-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #aaa;
}

.profile-picture-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
  display: inline-block;
  text-align: center;
}

.upload-button:hover {
  background-color: var(--secondary-color);
}

.file-input {
  display: none;
}

.upload-hint {
  font-size: 0.75rem;
  color: var(--light-text);
}

/* Form Controls */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

input[type="text"],
input[type="email"],
select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="email"]:focus,
select:focus,
textarea:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 140, 255, 0.2);
}

textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
}

.bio-textarea {
  min-height: 120px;
}

/* Skills Section */
.skills-section {
  margin-bottom: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #fafafa;
}

.skills-section h3 {
  margin-bottom: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  font-size: 1.25rem;
}

.skill-item {
  margin-bottom: 1.5rem;
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  padding: 1.25rem;
  background-color: white;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.skill-header h4 {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-color);
}

.remove-skill-button {
  background-color: transparent;
  color: var(--light-text);
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: var(--transition);
}

.remove-skill-button:hover {
  color: var(--error-color);
  background-color: rgba(239, 83, 80, 0.1);
}

.skill-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-skill-button {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px dashed var(--primary-color);
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
  font-weight: 500;
}

.add-skill-button:hover {
  background-color: rgba(74, 140, 255, 0.1);
}

/* Checkbox and Radio Groups */
.radio-group,
.checkbox-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radio-option,
.time-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.day-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Navigation Buttons */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.back-button {
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.back-button:hover {
  background-color: var(--background-color);
}

.next-button,
.complete-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.next-button:hover,
.complete-button:hover:not(:disabled) {
  background-color: var(--secondary-color);
}

.complete-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .onboarding-container {
    padding: 1rem;
  }
  
  .onboarding-card {
    padding: 1.5rem;
  }
  
  .profile-picture-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .radio-group,
  .checkbox-group {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .checkbox-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>