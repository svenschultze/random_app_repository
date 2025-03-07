<script setup>
import { ref, computed } from 'vue'

// Mock user data
const userData = ref({
  userType: 'candidate', // 'candidate' or 'company'
  fullName: 'Alex Johnson',
  email: 'alex@example.com',
  location: 'San Francisco, CA',
  title: 'Frontend Developer',
  about: 'Passionate frontend developer with 5+ years of experience building responsive and accessible web applications.',
  skills: ['JavaScript', 'Vue.js', 'CSS', 'HTML', 'React', 'TypeScript'],
  experience: [
    {
      id: 1,
      role: 'Senior Frontend Developer',
      company: 'TechStart Inc.',
      period: 'Jan 2023 - Present',
      description: 'Developing modern web applications using Vue.js and TypeScript.'
    },
    {
      id: 2,
      role: 'Frontend Developer',
      company: 'WebSolutions',
      period: 'Mar 2020 - Dec 2022',
      description: 'Built responsive UIs for e-commerce clients using React and Redux.'
    }
  ],
  education: [
    {
      id: 1,
      degree: 'B.S. Computer Science',
      institution: 'University of California',
      year: '2020'
    }
  ]
})

// Settings states
const isEditMode = ref(false)
const editedUserData = ref({...userData.value})

// Computed properties
const profileSections = computed(() => {
  if (userData.value.userType === 'candidate') {
    return [
      { id: 'about', label: 'About Me' },
      { id: 'skills', label: 'Skills' },
      { id: 'experience', label: 'Experience' },
      { id: 'education', label: 'Education' }
    ]
  } else {
    return [
      { id: 'about', label: 'About Company' },
      { id: 'openPositions', label: 'Open Positions' }
    ]
  }
})

// Methods
const toggleEditMode = () => {
  if (isEditMode.value) {
    // Save changes
    userData.value = {...editedUserData.value}
    isEditMode.value = false
  } else {
    // Start editing
    editedUserData.value = {...userData.value}
    isEditMode.value = true
  }
}

const addSkill = () => {
  editedUserData.value.skills.push('')
}

const removeSkill = (index) => {
  editedUserData.value.skills.splice(index, 1)
}

const addExperience = () => {
  const newExp = {
    id: Date.now(),
    role: '',
    company: '',
    period: '',
    description: ''
  }
  editedUserData.value.experience.push(newExp)
}

const removeExperience = (index) => {
  editedUserData.value.experience.splice(index, 1)
}

const addEducation = () => {
  const newEdu = {
    id: Date.now(),
    degree: '',
    institution: '',
    year: ''
  }
  editedUserData.value.education.push(newEdu)
}

const removeEducation = (index) => {
  editedUserData.value.education.splice(index, 1)
}

const cancelEdit = () => {
  isEditMode.value = false
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <h2 v-voix="'profile-heading'">{{ isEditMode ? 'Edit Profile' : 'Profile' }}</h2>
      
      <button 
        class="edit-button" 
        @click="toggleEditMode"
        v-voix="'edit-profile-button'"
        :hint="isEditMode ? 'Save profile changes' : 'Edit your profile information'"
      >
        {{ isEditMode ? 'Save Changes' : 'Edit Profile' }}
      </button>
    </div>
    
    <div class="profile-content">
      <!-- Basic Info Section - View Mode -->
      <div v-if="!isEditMode" class="profile-section basic-info">
        <h3 v-voix="'basic-info-heading'">Basic Information</h3>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Name</span>
            <span class="info-value">{{ userData.fullName }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">{{ userData.email }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">Location</span>
            <span class="info-value">{{ userData.location }}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">{{ userData.userType === 'candidate' ? 'Job Title' : 'Company Type' }}</span>
            <span class="info-value">{{ userData.title }}</span>
          </div>
        </div>
      </div>
      
      <!-- Basic Info Section - Edit Mode -->
      <div v-else class="profile-section basic-info edit-mode">
        <h3 v-voix="'edit-basic-info-heading'">Basic Information</h3>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="fullName" v-voix="'edit-name-label'">Name</label>
            <input 
              type="text" 
              id="fullName" 
              v-model="editedUserData.fullName"
              v-voix="'edit-name-input'"
              hint="Edit your full name"
            />
          </div>
          
          <div class="form-group">
            <label for="email" v-voix="'edit-email-label'">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="editedUserData.email"
              v-voix="'edit-email-input'"
              hint="Edit your email"
            />
          </div>
          
          <div class="form-group">
            <label for="location" v-voix="'edit-location-label'">Location</label>
            <input 
              type="text" 
              id="location" 
              v-model="editedUserData.location"
              v-voix="'edit-location-input'"
              hint="Edit your location"
            />
          </div>
          
          <div class="form-group">
            <label for="title" v-voix="'edit-title-label'">{{ userData.userType === 'candidate' ? 'Job Title' : 'Company Type' }}</label>
            <input 
              type="text" 
              id="title" 
              v-model="editedUserData.title"
              v-voix="'edit-title-input'"
              :hint="userData.userType === 'candidate' ? 'Edit your job title' : 'Edit your company type'"
            />
          </div>
        </div>
      </div>
      
      <!-- About Section - View Mode -->
      <div v-if="!isEditMode" class="profile-section">
        <h3 v-voix="'about-heading'">{{ userData.userType === 'candidate' ? 'About Me' : 'About Company' }}</h3>
        <p>{{ userData.about }}</p>
      </div>
      
      <!-- About Section - Edit Mode -->
      <div v-else class="profile-section edit-mode">
        <h3 v-voix="'edit-about-heading'">{{ userData.userType === 'candidate' ? 'About Me' : 'About Company' }}</h3>
        <div class="form-group">
          <label for="about" v-voix="'edit-about-label'">Description</label>
          <textarea 
            id="about" 
            v-model="editedUserData.about" 
            rows="4"
            v-voix="'edit-about-input'"
            hint="Edit your description"
          ></textarea>
        </div>
      </div>
      
      <!-- Skills Section - View Mode -->
      <div v-if="!isEditMode && userData.userType === 'candidate'" class="profile-section">
        <h3 v-voix="'skills-heading'">Skills</h3>
        <div class="skills-list">
          <span v-for="(skill, index) in userData.skills" :key="index" class="skill-tag">
            {{ skill }}
          </span>
        </div>
      </div>
      
      <!-- Skills Section - Edit Mode -->
      <div v-if="isEditMode && userData.userType === 'candidate'" class="profile-section edit-mode">
        <h3 v-voix="'edit-skills-heading'">Skills</h3>
        <div class="skills-edit">
          <div v-for="(skill, index) in editedUserData.skills" :key="index" class="skill-edit-item">
            <input 
              type="text" 
              v-model="editedUserData.skills[index]"
              v-voix="`edit-skill-${index}`"
              :hint="`Edit skill number ${index + 1}`"
            />
            <button 
              @click="removeSkill(index)"
              v-voix="`remove-skill-${index}`"
              :hint="`Remove skill ${skill}`"
            >
              ✕
            </button>
          </div>
          
          <button 
            class="add-button" 
            @click="addSkill"
            v-voix="'add-skill-button'"
            hint="Add a new skill"
          >
            + Add Skill
          </button>
        </div>
      </div>
      
      <!-- Experience Section - View Mode -->
      <div v-if="!isEditMode && userData.userType === 'candidate'" class="profile-section">
        <h3 v-voix="'experience-heading'">Experience</h3>
        <div class="experience-list">
          <div v-for="exp in userData.experience" :key="exp.id" class="experience-item">
            <div class="exp-header">
              <h4>{{ exp.role }}</h4>
              <span class="exp-company">{{ exp.company }}</span>
              <span class="exp-period">{{ exp.period }}</span>
            </div>
            <p class="exp-description">{{ exp.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Experience Section - Edit Mode -->
      <div v-if="isEditMode && userData.userType === 'candidate'" class="profile-section edit-mode">
        <h3 v-voix="'edit-experience-heading'">Experience</h3>
        <div class="experience-edit">
          <div v-for="(exp, index) in editedUserData.experience" :key="exp.id" class="experience-edit-item">
            <div class="form-group">
              <label v-voix="`edit-role-label-${index}`">Role</label>
              <input 
                type="text" 
                v-model="exp.role"
                v-voix="`edit-role-${index}`"
                :hint="`Edit role for experience ${index + 1}`"
              />
            </div>
            
            <div class="form-group">
              <label v-voix="`edit-company-label-${index}`">Company</label>
              <input 
                type="text" 
                v-model="exp.company"
                v-voix="`edit-company-${index}`"
                :hint="`Edit company for experience ${index + 1}`"
              />
            </div>
            
            <div class="form-group">
              <label v-voix="`edit-period-label-${index}`">Period</label>
              <input 
                type="text" 
                v-model="exp.period"
                v-voix="`edit-period-${index}`"
                :hint="`Edit time period for experience ${index + 1}`"
              />
            </div>
            
            <div class="form-group">
              <label v-voix="`edit-description-label-${index}`">Description</label>
              <textarea 
                v-model="exp.description" 
                rows="3"
                v-voix="`edit-description-${index}`"
                :hint="`Edit description for experience ${index + 1}`"
              ></textarea>
            </div>
            
            <button 
              class="remove-button"
              @click="removeExperience(index)"
              v-voix="`remove-experience-${index}`"
              :hint="`Remove ${exp.role} at ${exp.company} experience`"
            >
              Remove Experience
            </button>
          </div>
          
          <button 
            class="add-button" 
            @click="addExperience"
            v-voix="'add-experience-button'"
            hint="Add a new experience entry"
          >
            + Add Experience
          </button>
        </div>
      </div>
      
      <!-- Education Section - View Mode -->
      <div v-if="!isEditMode && userData.userType === 'candidate'" class="profile-section">
        <h3 v-voix="'education-heading'">Education</h3>
        <div class="education-list">
          <div v-for="edu in userData.education" :key="edu.id" class="education-item">
            <h4>{{ edu.degree }}</h4>
            <p>{{ edu.institution }}, {{ edu.year }}</p>
          </div>
        </div>
      </div>
      
      <!-- Education Section - Edit Mode -->
      <div v-if="isEditMode && userData.userType === 'candidate'" class="profile-section edit-mode">
        <h3 v-voix="'edit-education-heading'">Education</h3>
        <div class="education-edit">
          <div v-for="(edu, index) in editedUserData.education" :key="edu.id" class="education-edit-item">
            <div class="form-group">
              <label v-voix="`edit-degree-label-${index}`">Degree</label>
              <input 
                type="text" 
                v-model="edu.degree"
                v-voix="`edit-degree-${index}`"
                :hint="`Edit degree for education ${index + 1}`"
              />
            </div>
            
            <div class="form-group">
              <label v-voix="`edit-institution-label-${index}`">Institution</label>
              <input 
                type="text" 
                v-model="edu.institution"
                v-voix="`edit-institution-${index}`"
                :hint="`Edit institution for education ${index + 1}`"
              />
            </div>
            
            <div class="form-group">
              <label v-voix="`edit-year-label-${index}`">Year</label>
              <input 
                type="text" 
                v-model="edu.year"
                v-voix="`edit-year-${index}`"
                :hint="`Edit graduation year for education ${index + 1}`"
              />
            </div>
            
            <button 
              class="remove-button"
              @click="removeEducation(index)"
              v-voix="`remove-education-${index}`"
              :hint="`Remove ${edu.degree} from ${edu.institution} education entry`"
            >
              Remove Education
            </button>
          </div>
          
          <button 
            class="add-button" 
            @click="addEducation"
            v-voix="'add-education-button'"
            hint="Add a new education entry"
          >
            + Add Education
          </button>
        </div>
      </div>
      
      <div v-if="isEditMode" class="action-buttons">
        <button 
          class="cancel-button" 
          @click="cancelEdit"
          v-voix="'cancel-edit-button'"
          hint="Cancel editing and discard changes"
        >
          Cancel
        </button>
        <button 
          class="save-button" 
          @click="toggleEditMode"
          v-voix="'save-profile-button'"
          hint="Save all profile changes"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-header h2 {
  margin: 0;
  color: #333;
}

.edit-button {
  background-color: #ff5757;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #ff4343;
}

.profile-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.profile-section {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.profile-section h3 {
  margin-top: 0;
  margin-bottom: 1.2rem;
  color: #333;
  font-size: 1.3rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-weight: 600;
  color: #777;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.info-value {
  color: #333;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background-color: #f3f4f6;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.9rem;
  color: #555;
}

.experience-list, .education-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.experience-item h4, .education-item h4 {
  margin: 0 0 0.3rem 0;
  color: #333;
}

.exp-company, .exp-period {
  display: block;
  color: #555;
  margin-bottom: 0.3rem;
}

.exp-description {
  margin-top: 0.5rem;
  color: #555;
}

/* Edit Mode Styles */
.edit-mode {
  background-color: #f9f9f9;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
}

input, textarea {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #ff5757;
}

textarea {
  resize: vertical;
}

.skills-edit {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.skill-edit-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skill-edit-item input {
  flex: 1;
}

.skill-edit-item button {
  background: none;
  border: none;
  color: #ff5757;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.3rem;
}

.experience-edit, .education-edit {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.experience-edit-item, .education-edit-item {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.add-button {
  background-color: transparent;
  color: #ff5757;
  border: 1px dashed #ff5757;
  padding: 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: rgba(255, 87, 87, 0.1);
}

.remove-button {
  background-color: transparent;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
}

.cancel-button {
  background-color: white;
  color: #777;
  border: 1px solid #ddd;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #f3f3f3;
}

.save-button {
  background-color: #ff5757;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #ff4343;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>