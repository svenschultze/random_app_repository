<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form data
const name = ref('')
const age = ref('')
const gender = ref('')
const lookingFor = ref([])
const bio = ref('')
const interests = ref([])
const selectedInterests = ref([])
const photos = ref([])
const currentStep = ref(1)
const isLoading = ref(false)

// Available interests for selection
interests.value = [
  'Travel', 'Movies', 'Music', 'Food', 'Art', 
  'Reading', 'Sports', 'Fitness', 'Technology', 
  'Photography', 'Gaming', 'Cooking', 'Dancing', 
  'Hiking', 'Yoga', 'Fashion', 'Pets', 'Nature'
]

function toggleInterest(interest) {
  const index = selectedInterests.value.indexOf(interest)
  if (index === -1) {
    if (selectedInterests.value.length < 5) {
      selectedInterests.value.push(interest)
    }
  } else {
    selectedInterests.value.splice(index, 1)
  }
}

function handleFileChange(e) {
  const files = e.target.files
  if (!files.length) return
  
  // Add selected files to photos array
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()
    
    reader.onload = (e) => {
      // Add photo to list (max 6 photos)
      if (photos.value.length < 6) {
        photos.value.push({
          id: Date.now() + i,
          src: e.target.result
        })
      }
    }
    
    reader.readAsDataURL(file)
  }
}

function removePhoto(index) {
  photos.value.splice(index, 1)
}

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++
  } else {
    // Submit profile
    completeSetup()
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function completeSetup() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    router.push('/dashboard')
  }, 1500)
}
</script>

<template>
  <div class="profile-setup">
    <div class="setup-container">
      <h1 v-voix="'Profile setup title'">Create Your Profile</h1>
      
      <div class="steps-indicator">
        <div 
          v-for="step in 3" 
          :key="step" 
          :class="['step', { active: step === currentStep, completed: step < currentStep }]"
          v-voix="'Profile setup step ' + step"
          :hint="'Step ' + step + ' of 3 in the profile setup process'">
          {{ step }}
        </div>
      </div>
      
      <!-- Step 1: Basic Information -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 v-voix="'Basic information section'">Basic Information</h2>
        
        <div class="form-group">
          <label for="name" v-voix="'Name label'">Full Name</label>
          <input 
            id="name" 
            type="text" 
            v-model="name" 
            placeholder="Enter your name" 
            v-voix="'Name input'" 
            hint="Type your full name here"
          />
        </div>
        
        <div class="form-group">
          <label for="age" v-voix="'Age label'">Age</label>
          <input 
            id="age" 
            type="number" 
            v-model="age" 
            min="18" 
            max="100" 
            placeholder="Your age" 
            v-voix="'Age input'" 
            hint="Enter your age, must be 18 or older"
          />
        </div>
        
        <div class="form-group">
          <label v-voix="'Gender label'">Gender</label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="gender" 
                value="Male" 
                v-voix="'Male gender option'" 
                hint="Select if you identify as male"
              />
              <span>Male</span>
            </label>
            
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="gender" 
                value="Female" 
                v-voix="'Female gender option'" 
                hint="Select if you identify as female"
              />
              <span>Female</span>
            </label>
            
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="gender" 
                value="Non-binary" 
                v-voix="'Non-binary gender option'" 
                hint="Select if you identify as non-binary"
              />
              <span>Non-binary</span>
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label v-voix="'Looking for label'">Looking for</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                value="Men" 
                v-model="lookingFor" 
                v-voix="'Looking for men checkbox'" 
                hint="Select if you're interested in meeting men"
              />
              <span>Men</span>
            </label>
            
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                value="Women" 
                v-model="lookingFor" 
                v-voix="'Looking for women checkbox'" 
                hint="Select if you're interested in meeting women"
              />
              <span>Women</span>
            </label>
            
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                value="Non-binary" 
                v-model="lookingFor" 
                v-voix="'Looking for non-binary checkbox'" 
                hint="Select if you're interested in meeting non-binary people"
              />
              <span>Non-binary</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Step 2: Bio & Interests -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 v-voix="'Bio and interests section'">Bio & Interests</h2>
        
        <div class="form-group">
          <label for="bio" v-voix="'Bio label'">About Me</label>
          <textarea 
            id="bio" 
            v-model="bio" 
            rows="4" 
            placeholder="Tell others about yourself..." 
            maxlength="300"
            v-voix="'Bio input'" 
            hint="Write a short description about yourself"
          ></textarea>
          <div class="char-count">{{ bio.length }}/300</div>
        </div>
        
        <div class="form-group">
          <label v-voix="'Interests label'">Interests (select up to 5)</label>
          <div class="interests-container">
            <button 
              v-for="interest in interests" 
              :key="interest"
              :class="['interest-tag', { selected: selectedInterests.includes(interest) }]"
              @click="toggleInterest(interest)"
              type="button"
              v-voix="interest + ' interest tag'"
              :hint="selectedInterests.includes(interest) ? 'Click to remove ' + interest : 'Click to add ' + interest"
            >
              {{ interest }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Step 3: Photos -->
      <div v-if="currentStep === 3" class="step-content">
        <h2 v-voix="'Photos section'">Profile Photos</h2>
        <p>Add up to 6 photos that show your best self!</p>
        
        <div class="photos-grid">
          <div 
            v-for="(photo, index) in photos" 
            :key="photo.id" 
            class="photo-container"
          >
            <img :src="photo.src" alt="Profile photo" />
            <button 
              class="remove-photo" 
              @click="removePhoto(index)"
              v-voix="'Remove photo ' + (index + 1)"
              hint="Click to remove this photo"
            >
              ✕
            </button>
          </div>
          
          <div v-if="photos.length < 6" class="photo-upload">
            <input 
              type="file" 
              accept="image/*" 
              @change="handleFileChange" 
              id="photo-upload" 
              multiple
              v-voix="'Upload photo input'" 
              hint="Click to select photos from your device"
            />
            <label for="photo-upload">
              <div class="upload-icon">+</div>
              <span>Add Photo</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Navigation buttons -->
      <div class="step-actions">
        <button 
          v-if="currentStep > 1" 
          class="button secondary" 
          @click="previousStep"
          v-voix="'Previous step button'" 
          hint="Go back to the previous step"
        >
          Back
        </button>
        
        <button 
          class="button primary" 
          @click="nextStep" 
          :disabled="isLoading"
          v-voix="currentStep < 3 ? 'Next step button' : 'Complete profile button'"
          :hint="currentStep < 3 ? 'Move to the next step' : 'Finish creating your profile'"
        >
          <span v-if="isLoading">Saving...</span>
          <span v-else>{{ currentStep < 3 ? 'Next' : 'Complete Profile' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-setup {
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 2rem 1rem;
}

.setup-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

h2 {
  color: #555;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.steps-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.step {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 15px;
  color: #777;
  position: relative;
}

.step::after {
  content: '';
  position: absolute;
  height: 2px;
  background-color: #eee;
  width: 30px;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
}

.step:last-child::after {
  display: none;
}

.step.active {
  background-color: #ff4b7d;
  color: white;
}

.step.completed {
  background-color: #4cd964;
  color: white;
}

.step.completed::after {
  background-color: #4cd964;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  padding: 0.875rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

input:focus,
textarea:focus {
  border-color: #ff4b7d;
  outline: none;
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.3rem;
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label span,
.checkbox-label span {
  margin-left: 0.5rem;
}

.interests-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.interest-tag {
  background-color: #f0f0f0;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.interest-tag.selected {
  background-color: #ff4b7d;
  color: white;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.photo-container {
  position: relative;
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
}

.photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.photo-upload {
  aspect-ratio: 1/1;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.photo-upload input {
  display: none;
}

.photo-upload label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.button {
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
}

.button.primary {
  background-color: #ff4b7d;
  color: white;
}

.button.primary:hover {
  background-color: #ff3367;
}

.button.secondary {
  background-color: #f0f0f0;
  color: #555;
}

.button.secondary:hover {
  background-color: #e0e0e0;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .photos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>