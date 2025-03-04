<script setup>
import { ref } from 'vue'

// User profile data
const userProfile = ref({
  name: 'Jane Doe',
  jobTitle: 'UX Designer',
  company: 'DesignHub Inc.',
  industry: 'Technology',
  experience: 'Mid-Career (6-10 years)',
  location: 'San Francisco, CA',
  bio: 'Passionate UX designer with 8 years of experience creating user-centered digital products. Specialized in design systems and interactive prototyping. Continuously seeking to improve user experiences through thoughtful design and research.',
  email: 'jane.doe@example.com',
  skills: [
    { id: 1, name: 'UX Design', level: 90 },
    { id: 2, name: 'UI Design', level: 85 },
    { id: 3, name: 'User Research', level: 75 },
    { id: 4, name: 'Figma', level: 95 },
    { id: 5, name: 'Design Systems', level: 80 },
    { id: 6, name: 'Prototyping', level: 85 },
    { id: 7, name: 'Wireframing', level: 90 },
    { id: 8, name: 'User Testing', level: 70 }
  ],
  education: [
    { id: 1, degree: 'Master of Design', institution: 'California Design Institute', year: '2017' },
    { id: 2, degree: 'Bachelor of Arts in Visual Communication', institution: 'State University', year: '2015' }
  ],
  certifications: [
    { id: 1, name: 'UX Design Certification', issuer: 'Nielsen Norman Group', year: '2019' },
    { id: 2, name: 'Design Thinking Certification', issuer: 'IDEO', year: '2020' }
  ],
  interests: ['Design', 'UX Research', 'Leadership', 'Creative Work', 'Mentoring']
})

// Profile edit mode
const isEditing = ref(false)
const editForm = ref({...userProfile.value})

// Skill being edited
const newSkill = ref({ name: '', level: 50 })
const editingSkill = ref(null)

// New education or certification items
const newEducation = ref({ degree: '', institution: '', year: '' })
const newCertification = ref({ name: '', issuer: '', year: '' })

// Interest input
const interestInput = ref('')

// Toggle edit mode
const toggleEditMode = () => {
  if (isEditing.value) {
    // Save changes
    userProfile.value = {...editForm.value}
    isEditing.value = false
  } else {
    // Enter edit mode
    editForm.value = JSON.parse(JSON.stringify(userProfile.value))
    isEditing.value = true
  }
}

// Cancel editing
const cancelEdit = () => {
  isEditing.value = false
}

// Add new skill
const addSkill = () => {
  if (newSkill.value.name.trim()) {
    editForm.value.skills.push({
      id: Date.now(),
      name: newSkill.value.name,
      level: newSkill.value.level
    })
    newSkill.value = { name: '', level: 50 }
  }
}

// Start editing a skill
const startEditingSkill = (skill) => {
  editingSkill.value = { ...skill }
}

// Save skill edit
const saveSkillEdit = () => {
  if (editingSkill.value) {
    const index = editForm.value.skills.findIndex(s => s.id === editingSkill.value.id)
    if (index !== -1) {
      editForm.value.skills[index] = { ...editingSkill.value }
    }
    editingSkill.value = null
  }
}

// Cancel skill edit
const cancelSkillEdit = () => {
  editingSkill.value = null
}

// Remove skill
const removeSkill = (skillId) => {
  editForm.value.skills = editForm.value.skills.filter(skill => skill.id !== skillId)
}

// Add education
const addEducation = () => {
  if (newEducation.value.degree && newEducation.value.institution) {
    editForm.value.education.push({
      id: Date.now(),
      ...newEducation.value
    })
    newEducation.value = { degree: '', institution: '', year: '' }
  }
}

// Remove education
const removeEducation = (educationId) => {
  editForm.value.education = editForm.value.education.filter(edu => edu.id !== educationId)
}

// Add certification
const addCertification = () => {
  if (newCertification.value.name && newCertification.value.issuer) {
    editForm.value.certifications.push({
      id: Date.now(),
      ...newCertification.value
    })
    newCertification.value = { name: '', issuer: '', year: '' }
  }
}

// Remove certification
const removeCertification = (certificationId) => {
  editForm.value.certifications = editForm.value.certifications.filter(cert => cert.id !== certificationId)
}

// Add interest
const addInterest = () => {
  if (interestInput.value.trim() && !editForm.value.interests.includes(interestInput.value.trim())) {
    editForm.value.interests.push(interestInput.value.trim())
    interestInput.value = ''
  }
}

// Remove interest
const removeInterest = (interest) => {
  editForm.value.interests = editForm.value.interests.filter(i => i !== interest)
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 v-if="!isEditing" v-voix="'Profile Title'">Professional Profile</h1>
      <h1 v-else v-voix="'Edit Profile Title'">Edit Your Profile</h1>
      <button 
        class="btn-primary edit-toggle-btn"
        @click="toggleEditMode"
        v-voix="'Toggle Edit Mode Button'"
        :hint="isEditing ? 'Save your profile changes' : 'Edit your profile information'"
      >
        {{ isEditing ? 'Save Profile' : 'Edit Profile' }}
      </button>
    </div>

    <!-- View Mode -->
    <div v-if="!isEditing" class="profile-content">
      <!-- Basic Information Card -->
      <div class="profile-card basic-info" v-voix="'Basic Information Section'">
        <div class="profile-picture">
          {{ userProfile.name.charAt(0) }}
        </div>
        
        <div class="basic-info-content">
          <h2 class="profile-name">{{ userProfile.name }}</h2>
          <div class="profile-title">{{ userProfile.jobTitle }} at {{ userProfile.company }}</div>
          <div class="profile-details">
            <div class="detail-item">
              <span class="detail-label">Industry:</span>
              <span class="detail-value">{{ userProfile.industry }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Experience:</span>
              <span class="detail-value">{{ userProfile.experience }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Location:</span>
              <span class="detail-value">{{ userProfile.location }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email:</span>
              <span class="detail-value">{{ userProfile.email }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bio Card -->
      <div class="profile-card" v-voix="'Professional Bio Section'">
        <h3>Professional Bio</h3>
        <p class="profile-bio">{{ userProfile.bio }}</p>
      </div>

      <!-- Skills Card -->
      <div class="profile-card" v-voix="'Skills Section'">
        <h3>Skills</h3>
        <div class="skills-grid">
          <div v-for="skill in userProfile.skills" :key="skill.id" class="skill-item">
            <div class="skill-header">
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-level-text">{{ skill.level }}%</div>
            </div>
            <div class="skill-bar">
              <div class="skill-level" :style="{ width: `${skill.level}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Education Card -->
      <div class="profile-card" v-voix="'Education Section'">
        <h3>Education</h3>
        <div class="education-list">
          <div v-for="education in userProfile.education" :key="education.id" class="education-item">
            <div class="education-degree">{{ education.degree }}</div>
            <div class="education-institution">{{ education.institution }}</div>
            <div class="education-year">{{ education.year }}</div>
          </div>
        </div>
      </div>

      <!-- Certifications Card -->
      <div class="profile-card" v-voix="'Certifications Section'">
        <h3>Certifications</h3>
        <div class="certifications-list">
          <div v-for="certification in userProfile.certifications" :key="certification.id" class="certification-item">
            <div class="certification-name">{{ certification.name }}</div>
            <div class="certification-issuer">{{ certification.issuer }}</div>
            <div class="certification-year">{{ certification.year }}</div>
          </div>
        </div>
      </div>

      <!-- Interests Card -->
      <div class="profile-card" v-voix="'Interests Section'">
        <h3>Professional Interests</h3>
        <div class="interests-list">
          <div v-for="(interest, index) in userProfile.interests" :key="index" class="interest-tag">
            {{ interest }}
          </div>
        </div>
      </div>

      <!-- Export and Visibility Options -->
      <div class="profile-actions">
        <button 
          class="btn-secondary"
          v-voix="'Export Profile Button'"
          hint="Export your profile as a PDF document"
        >
          Export as PDF
        </button>
        <button 
          class="btn-secondary"
          v-voix="'Manage Visibility Button'"
          hint="Configure who can see your profile information"
        >
          Manage Visibility
        </button>
      </div>
    </div>

    <!-- Edit Mode -->
    <div v-else class="profile-content edit-mode">
      <!-- Basic Information Card -->
      <div class="profile-card" v-voix="'Edit Basic Information Section'">
        <h3>Basic Information</h3>
        
        <div class="form-group">
          <label for="editName" v-voix="'Edit Name Label'">Name</label>
          <input 
            id="editName" 
            type="text" 
            v-model="editForm.name"
            v-voix="'Name Input Field'"
            hint="Edit your full name"
          />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="editJobTitle" v-voix="'Edit Job Title Label'">Job Title</label>
            <input 
              id="editJobTitle" 
              type="text" 
              v-model="editForm.jobTitle"
              v-voix="'Job Title Input Field'"
              hint="Edit your current job title"
            />
          </div>
          
          <div class="form-group">
            <label for="editCompany" v-voix="'Edit Company Label'">Company</label>
            <input 
              id="editCompany" 
              type="text" 
              v-model="editForm.company"
              v-voix="'Company Input Field'"
              hint="Edit your current company name"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="editIndustry" v-voix="'Edit Industry Label'">Industry</label>
            <input 
              id="editIndustry" 
              type="text" 
              v-model="editForm.industry"
              v-voix="'Industry Input Field'"
              hint="Edit your industry sector"
            />
          </div>
          
          <div class="form-group">
            <label for="editExperience" v-voix="'Edit Experience Label'">Experience Level</label>
            <input 
              id="editExperience" 
              type="text" 
              v-model="editForm.experience"
              v-voix="'Experience Input Field'"
              hint="Edit your professional experience level"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="editLocation" v-voix="'Edit Location Label'">Location</label>
            <input 
              id="editLocation" 
              type="text" 
              v-model="editForm.location"
              v-voix="'Location Input Field'"
              hint="Edit your location"
            />
          </div>
          
          <div class="form-group">
            <label for="editEmail" v-voix="'Edit Email Label'">Email</label>
            <input 
              id="editEmail" 
              type="email" 
              v-model="editForm.email"
              v-voix="'Email Input Field'"
              hint="Edit your email address"
            />
          </div>
        </div>
      </div>

      <!-- Bio Card -->
      <div class="profile-card" v-voix="'Edit Professional Bio Section'">
        <h3>Professional Bio</h3>
        
        <div class="form-group">
          <textarea 
            v-model="editForm.bio" 
            rows="5"
            v-voix="'Bio Text Area'"
            hint="Edit your professional biography"
          ></textarea>
        </div>
      </div>

      <!-- Skills Card -->
      <div class="profile-card" v-voix="'Edit Skills Section'">
        <h3>Skills</h3>
        
        <div class="skills-list-edit">
          <div v-for="skill in editForm.skills" :key="skill.id" class="skill-item-edit">
            <div v-if="editingSkill && editingSkill.id === skill.id" class="skill-edit-form">
              <input 
                type="text" 
                v-model="editingSkill.name"
                v-voix="'Edit Skill Name Field'"
                hint="Edit this skill's name"
              />
              <div class="level-slider-container">
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  v-model.number="editingSkill.level"
                  v-voix="'Edit Skill Level Slider'"
                  hint="Adjust this skill's proficiency level"
                />
                <span class="level-value">{{ editingSkill.level }}%</span>
              </div>
              <div class="edit-actions">
                <button 
                  class="btn-small save-btn"
                  @click="saveSkillEdit"
                  v-voix="'Save Skill Button'"
                  hint="Save changes to this skill"
                >
                  Save
                </button>
                <button 
                  class="btn-small cancel-btn"
                  @click="cancelSkillEdit"
                  v-voix="'Cancel Skill Edit Button'"
                  hint="Cancel editing this skill"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div v-else class="skill-display">
              <div class="skill-name">{{ skill.name }} ({{ skill.level }}%)</div>
              <div class="skill-actions">
                <button 
                  class="btn-icon edit-btn"
                  @click="startEditingSkill(skill)"
                  v-voix="`Edit Skill ${skill.name} Button`"
                  hint="Edit this skill"
                >
                  ✏️
                </button>
                <button 
                  class="btn-icon delete-btn"
                  @click="removeSkill(skill.id)"
                  v-voix="`Remove Skill ${skill.name} Button`"
                  hint="Remove this skill"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="add-skill-form">
          <div class="form-row">
            <div class="form-group">
              <input 
                type="text" 
                placeholder="Add a new skill"
                v-model="newSkill.name"
                v-voix="'New Skill Name Input'"
                hint="Enter the name of a new skill to add"
              />
            </div>
            <div class="form-group level-input">
              <input 
                type="range" 
                min="1" 
                max="100" 
                v-model.number="newSkill.level"
                v-voix="'New Skill Level Slider'"
                hint="Set the proficiency level for this new skill"
              />
              <span class="level-value">{{ newSkill.level }}%</span>
            </div>
          </div>
          <button 
            class="btn-secondary add-btn"
            @click="addSkill"
            v-voix="'Add New Skill Button'"
            hint="Add this new skill to your profile"
          >
            Add Skill
          </button>
        </div>
      </div>

      <!-- Education Card -->
      <div class="profile-card" v-voix="'Edit Education Section'">
        <h3>Education</h3>
        
        <div class="education-list-edit">
          <div v-for="education in editForm.education" :key="education.id" class="education-item-edit">
            <div class="education-details">
              <div class="education-degree">{{ education.degree }}</div>
              <div class="education-institution">{{ education.institution }} ({{ education.year }})</div>
            </div>
            <button 
              class="btn-icon delete-btn"
              @click="removeEducation(education.id)"
              v-voix="`Remove Education ${education.degree} Button`"
              hint="Remove this education entry"
            >
              ×
            </button>
          </div>
        </div>
        
        <div class="add-education-form">
          <div class="form-row">
            <div class="form-group">
              <input 
                type="text" 
                placeholder="Degree/Qualification"
                v-model="newEducation.degree"
                v-voix="'New Education Degree Input'"
                hint="Enter your degree or qualification"
              />
            </div>
            <div class="form-group">
              <input 
                type="text" 
                placeholder="Institution"
                v-model="newEducation.institution"
                v-voix="'New Education Institution Input'"
                hint="Enter the institution name"
              />
            </div>
            <div class="form-group year-input">
              <input 
                type="text" 
                placeholder="Year"
                v-model="newEducation.year"
                v-voix="'New Education Year Input'"
                hint="Enter the graduation year"
              />
            </div>
          </div>
          <button 
            class="btn-secondary add-btn"
            @click="addEducation"
            v-voix="'Add Education Button'"
            hint="Add this education entry to your profile"
          >
            Add Education
          </button>
        </div>
      </div>

      <!-- Certifications Card -->
      <div class="profile-card" v-voix="'Edit Certifications Section'">
        <h3>Certifications</h3>
        
        <div class="certifications-list-edit">
          <div v-for="certification in editForm.certifications" :key="certification.id" class="certification-item-edit">
            <div class="certification-details">
              <div class="certification-name">{{ certification.name }}</div>
              <div class="certification-issuer">{{ certification.issuer }} ({{ certification.year }})</div>
            </div>
            <button 
              class="btn-icon delete-btn"
              @click="removeCertification(certification.id)"
              v-voix="`Remove Certification ${certification.name} Button`"
              hint="Remove this certification"
            >
              ×
            </button>
          </div>
        </div>
        
        <div class="add-certification-form">
          <div class="form-row">
            <div class="form-group">
              <input 
                type="text" 
                placeholder="Certification Name"
                v-model="newCertification.name"
                v-voix="'New Certification Name Input'"
                hint="Enter the certification name"
              />
            </div>
            <div class="form-group">
              <input 
                type="text" 
                placeholder="Issuing Organization"
                v-model="newCertification.issuer"
                v-voix="'New Certification Issuer Input'"
                hint="Enter the certification issuer"
              />
            </div>
            <div class="form-group year-input">
              <input 
                type="text" 
                placeholder="Year"
                v-model="newCertification.year"
                v-voix="'New Certification Year Input'"
                hint="Enter the certification year"
              />
            </div>
          </div>
          <button 
            class="btn-secondary add-btn"
            @click="addCertification"
            v-voix="'Add Certification Button'"
            hint="Add this certification to your profile"
          >
            Add Certification
          </button>
        </div>
      </div>

      <!-- Interests Card -->
      <div class="profile-card" v-voix="'Edit Interests Section'">
        <h3>Professional Interests</h3>
        
        <div class="interests-edit">
          <div class="interests-list">
            <div v-for="(interest, index) in editForm.interests" :key="index" class="interest-tag with-delete">
              {{ interest }}
              <button 
                class="interest-delete"
                @click="removeInterest(interest)"
                v-voix="`Remove Interest ${interest} Button`"
                hint="Remove this interest"
              >
                ×
              </button>
            </div>
          </div>
          
          <div class="add-interest-form">
            <input 
              type="text" 
              placeholder="Add new interest"
              v-model="interestInput"
              @keyup.enter="addInterest"
              v-voix="'New Interest Input'"
              hint="Enter a new professional interest"
            />
            <button 
              class="btn-secondary add-btn"
              @click="addInterest"
              v-voix="'Add Interest Button'"
              hint="Add this interest to your profile"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="edit-form-actions">
        <button 
          class="btn-secondary cancel-btn"
          @click="cancelEdit"
          v-voix="'Cancel Edit Button'"
          hint="Cancel all changes and exit edit mode"
        >
          Cancel
        </button>
        <button 
          class="btn-primary save-btn"
          @click="toggleEditMode"
          v-voix="'Save Profile Button'"
          hint="Save all changes to your profile"
        >
          Save Profile
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.edit-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.profile-card h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.basic-info {
  display: flex;
  gap: 1.5rem;
}

.profile-picture {
  width: 100px;
  height: 100px;
  background-color: #42b983;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: 700;
}

.basic-info-content {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.profile-title {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.25rem;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  font-size: 0.95rem;
}

.detail-label {
  font-weight: 600;
  color: #2c3e50;
  margin-right: 0.5rem;
}

.detail-value {
  color: #666;
}

.profile-bio {
  line-height: 1.6;
  color: #444;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.skill-item {
  margin-bottom: 1rem;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.skill-name {
  font-weight: 600;
  color: #2c3e50;
}

.skill-level-text {
  color: #666;
  font-size: 0.9rem;
}

.skill-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.skill-level {
  height: 100%;
  background-color: #42b983;
  border-radius: 4px;
}

.education-list, .certifications-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.education-item, .certification-item {
  border-left: 3px solid #42b983;
  padding-left: 1rem;
}

.education-degree, .certification-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.education-institution, .certification-issuer {
  color: #666;
  margin-bottom: 0.25rem;
}

.education-year, .certification-year {
  font-size: 0.9rem;
  color: #888;
}

.interests-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.interest-tag {
  background-color: #e8f4f0;
  color: #42b983;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 30px;
}

.profile-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Edit mode styles */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.year-input {
  max-width: 100px;
}

.level-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.level-slider-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.level-value {
  font-size: 0.9rem;
  color: #666;
  width: 45px;
}

.skills-list-edit,
.education-list-edit,
.certifications-list-edit {
  margin-bottom: 1.5rem;
}

.skill-item-edit,
.education-item-edit,
.certification-item-edit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.skill-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.skill-name {
  font-weight: 600;
}

.skill-actions,
.education-actions,
.certification-actions {
  display: flex;
  gap: 0.5rem;
}

.skill-edit-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.25rem;
  color: #666;
  transition: color 0.3s;
}

.btn-icon.edit-btn:hover {
  color: #42b983;
}

.btn-icon.delete-btn:hover {
  color: #e74c3c;
}

.add-skill-form,
.add-education-form,
.add-certification-form {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.add-interest-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.interest-tag.with-delete {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.interest-delete {
  background: none;
  border: none;
  color: #42b983;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
  line-height: 1;
}

.interest-delete:hover {
  color: #e74c3c;
}

.edit-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #3aa876;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-small {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
}

.add-btn {
  white-space: nowrap;
}

.education-details,
.certification-details {
  flex: 1;
}

@media (max-width: 768px) {
  .basic-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-details {
    text-align: left;
  }
  
  .profile-actions,
  .edit-form-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
  
  .add-interest-form {
    flex-direction: column;
  }
}
</style>