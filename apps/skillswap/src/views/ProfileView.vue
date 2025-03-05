<script setup>
import { ref } from 'vue'

const userProfile = ref({
  name: 'Alex Johnson',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  bio: 'Software developer and photography enthusiast. Looking to exchange coding skills for Spanish language lessons.',
  location: 'Seattle, WA',
  timezone: 'UTC-08:00',
  skills: {
    teaching: [
      { id: 1, name: 'JavaScript Programming', level: 'Advanced', description: 'Modern JavaScript including ES6+, async/await, and frameworks like Vue and React.' },
      { id: 2, name: 'Digital Photography', level: 'Expert', description: 'Composition, lighting, editing in Lightroom and Photoshop. Specialized in landscape and portrait photography.' }
    ],
    learning: [
      { id: 1, name: 'Spanish Language', level: 'Beginner', description: 'Basic vocabulary and simple conversations. Looking to become conversationally fluent.' },
      { id: 2, name: 'Guitar', level: 'Intermediate', description: 'Can play basic chords and some songs. Want to learn music theory and advanced techniques.' }
    ]
  },
  reviews: {
    average: 4.8,
    count: 12,
    highlights: [
      { id: 101, author: 'Sarah M.', rating: 5, comment: 'Alex is an excellent JavaScript teacher! Patient and knowledgeable.', date: '2025-02-15' },
      { id: 102, author: 'Michael K.', rating: 5, comment: 'Great photography tips that immediately improved my work.', date: '2025-01-22' },
      { id: 103, author: 'Elena R.', rating: 4, comment: 'Very structured lessons and clear explanations.', date: '2025-01-05' }
    ]
  },
  preferences: {
    sessionType: 'Both online and in-person',
    availability: {
      days: ['Monday', 'Wednesday', 'Saturday', 'Sunday'],
      timeOfDay: ['Evening', 'Afternoon']
    }
  }
})

const isEditMode = ref(false)

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const saveProfile = () => {
  // In a real app, this would save to backend
  isEditMode.value = false
  // Show success message
  alert('Profile updated successfully!')
}

// For simplicity, this is just a placeholder component 
// In a real app, this would be more interactive with actual form editing
</script>

<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 v-voix="'profile-title'">My Profile</h1>
      <button 
        class="edit-profile-button" 
        @click="toggleEditMode"
        v-voix="'edit-profile-button'"
        hint="Toggle between view and edit modes"
      >
        {{ isEditMode ? 'Cancel Editing' : 'Edit Profile' }}
      </button>
    </div>

    <div class="profile-content">
      <!-- Profile Overview -->
      <div class="profile-overview">
        <div class="profile-avatar-container">
          <img :src="userProfile.avatar" :alt="userProfile.name" class="profile-avatar">
          <div v-if="isEditMode" class="avatar-edit-overlay">
            <span v-voix="'change-photo-text'">Change Photo</span>
          </div>
        </div>
        
        <div class="profile-details">
          <h2 class="profile-name" v-voix="'profile-name'">{{ userProfile.name }}</h2>
          <p class="profile-location" v-voix="'profile-location'">
            <span class="detail-icon">📍</span> {{ userProfile.location }}
          </p>
          <p class="profile-timezone" v-voix="'profile-timezone'">
            <span class="detail-icon">🕒</span> {{ userProfile.timezone }}
          </p>
          
          <div class="rating-container" v-voix="'profile-rating'">
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star">
                {{ i <= Math.round(userProfile.reviews.average) ? '★' : '☆' }}
              </span>
            </div>
            <span class="rating-text">{{ userProfile.reviews.average }} ({{ userProfile.reviews.count }} reviews)</span>
          </div>
          
          <div class="bio-container">
            <h3 v-voix="'bio-title'">About Me</h3>
            <p v-if="!isEditMode" class="bio-text" v-voix="'bio-text'">{{ userProfile.bio }}</p>
            <textarea 
              v-else 
              v-model="userProfile.bio" 
              class="bio-edit"
              v-voix="'bio-edit'"
              hint="Edit your bio description"
            ></textarea>
          </div>
          
          <div class="preferences-container">
            <h3 v-voix="'preferences-title'">Session Preferences</h3>
            <div class="preference-item" v-voix="'session-type-preference'">
              <span class="preference-label">Session Type:</span>
              <span v-if="!isEditMode" class="preference-value">{{ userProfile.preferences.sessionType }}</span>
              <select 
                v-else 
                v-model="userProfile.preferences.sessionType"
                class="preference-edit"
                v-voix="'session-type-select'"
                hint="Select your preferred session type"
              >
                <option value="Online only">Online only</option>
                <option value="In-person only">In-person only</option>
                <option value="Both online and in-person">Both online and in-person</option>
              </select>
            </div>
            
            <div class="preference-item" v-voix="'available-days'">
              <span class="preference-label">Available Days:</span>
              <span v-if="!isEditMode" class="preference-value">{{ userProfile.preferences.availability.days.join(', ') }}</span>
              <div v-else class="days-checkbox-group">
                <label v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']" :key="day">
                  <input 
                    type="checkbox" 
                    :value="day" 
                    v-model="userProfile.preferences.availability.days"
                    v-voix="`day-checkbox-${day.toLowerCase()}`"
                    :hint="`Check if you're available on ${day}`"
                  >
                  {{ day }}
                </label>
              </div>
            </div>
            
            <div class="preference-item" v-voix="'available-times'">
              <span class="preference-label">Time of Day:</span>
              <span v-if="!isEditMode" class="preference-value">{{ userProfile.preferences.availability.timeOfDay.join(', ') }}</span>
              <div v-else class="time-checkbox-group">
                <label v-for="time in ['Morning', 'Afternoon', 'Evening']" :key="time">
                  <input 
                    type="checkbox" 
                    :value="time" 
                    v-model="userProfile.preferences.availability.timeOfDay"
                    v-voix="`time-checkbox-${time.toLowerCase()}`"
                    :hint="`Check if you're available during ${time}`"
                  >
                  {{ time }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Skills Section -->
      <div class="skills-section">
        <h2 v-voix="'skills-title'">Skills Exchange</h2>
        
        <div class="skills-container">
          <div class="teaching-skills">
            <h3 v-voix="'teaching-skills-title'">Skills I Can Teach</h3>
            <div class="skill-cards">
              <div 
                v-for="skill in userProfile.skills.teaching" 
                :key="skill.id" 
                class="skill-card"
                v-voix="`teaching-skill-${skill.id}`"
              >
                <div class="skill-header">
                  <h4 class="skill-name">{{ skill.name }}</h4>
                  <span class="skill-level">{{ skill.level }}</span>
                </div>
                <p v-if="!isEditMode" class="skill-description">{{ skill.description }}</p>
                <textarea 
                  v-else 
                  v-model="skill.description" 
                  class="skill-description-edit"
                  v-voix="`teaching-skill-${skill.id}-edit`"
                  :hint="`Edit description for ${skill.name}`"
                ></textarea>
                <button 
                  v-if="isEditMode" 
                  class="remove-skill-button"
                  v-voix="`remove-teaching-skill-${skill.id}`"
                  :hint="`Remove ${skill.name} from your teaching skills`"
                >
                  Remove Skill
                </button>
              </div>
              <button 
                v-if="isEditMode" 
                class="add-skill-button"
                v-voix="'add-teaching-skill'"
                hint="Add a new skill you can teach"
              >
                + Add Teaching Skill
              </button>
            </div>
          </div>
          
          <div class="learning-skills">
            <h3 v-voix="'learning-skills-title'">Skills I Want to Learn</h3>
            <div class="skill-cards">
              <div 
                v-for="skill in userProfile.skills.learning" 
                :key="skill.id" 
                class="skill-card"
                v-voix="`learning-skill-${skill.id}`"
              >
                <div class="skill-header">
                  <h4 class="skill-name">{{ skill.name }}</h4>
                  <span class="skill-level">{{ skill.level }}</span>
                </div>
                <p v-if="!isEditMode" class="skill-description">{{ skill.description }}</p>
                <textarea 
                  v-else 
                  v-model="skill.description" 
                  class="skill-description-edit"
                  v-voix="`learning-skill-${skill.id}-edit`"
                  :hint="`Edit description for ${skill.name}`"
                ></textarea>
                <button 
                  v-if="isEditMode" 
                  class="remove-skill-button"
                  v-voix="`remove-learning-skill-${skill.id}`"
                  :hint="`Remove ${skill.name} from your learning skills`"
                >
                  Remove Skill
                </button>
              </div>
              <button 
                v-if="isEditMode" 
                class="add-skill-button"
                v-voix="'add-learning-skill'"
                hint="Add a new skill you want to learn"
              >
                + Add Learning Skill
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Reviews Section -->
      <div class="reviews-section">
        <h2 v-voix="'reviews-title'">Reviews</h2>
        <div class="reviews-container">
          <div 
            v-for="review in userProfile.reviews.highlights" 
            :key="review.id" 
            class="review-card"
            v-voix="`review-${review.id}`"
          >
            <div class="review-header">
              <div class="reviewer-name">{{ review.author }}</div>
              <div class="review-date">{{ new Date(review.date).toLocaleDateString() }}</div>
            </div>
            <div class="review-rating">
              <span v-for="i in 5" :key="i" class="star">
                {{ i <= review.rating ? '★' : '☆' }}
              </span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="isEditMode" class="profile-actions">
      <button 
        class="save-button" 
        @click="saveProfile"
        v-voix="'save-profile-button'"
        hint="Save changes to your profile"
      >
        Save Changes
      </button>
      <button 
        class="cancel-button" 
        @click="toggleEditMode"
        v-voix="'cancel-edit-button'"
        hint="Cancel profile editing"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
}

.edit-profile-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  transition: var(--transition);
}

.edit-profile-button:hover {
  background-color: var(--secondary-color);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Profile Overview Styles */
.profile-overview {
  display: flex;
  gap: 2rem;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--box-shadow);
}

.profile-avatar-container {
  position: relative;
  width: 180px;
  height: 180px;
  flex-shrink: 0;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color);
}

.avatar-edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.avatar-edit-overlay:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.profile-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.profile-location,
.profile-timezone {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--light-text);
}

.detail-icon {
  font-size: 1.1rem;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.stars {
  color: #ffb400;
  font-size: 1.25rem;
  letter-spacing: 2px;
}

.rating-text {
  color: var(--light-text);
  font-size: 0.95rem;
}

.bio-container,
.preferences-container {
  margin-top: 1.5rem;
}

.bio-container h3,
.preferences-container h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-color);
}

.bio-text {
  line-height: 1.6;
  color: var(--text-color);
}

.bio-edit {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.6;
  transition: border-color 0.3s;
}

.bio-edit:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 140, 255, 0.2);
}

.preference-item {
  margin-bottom: 1rem;
}

.preference-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.preference-value {
  color: var(--light-text);
}

.preference-edit {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
}

.days-checkbox-group,
.time-checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

/* Skills Section Styles */
.skills-section {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--box-shadow);
}

.skills-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.skills-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.teaching-skills h3,
.learning-skills h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-color);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.skill-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.skill-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-color);
}

.skill-level {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.teaching-skills .skill-level {
  background-color: var(--primary-color);
}

.learning-skills .skill-level {
  background-color: var(--secondary-color);
}

.skill-description {
  color: var(--light-text);
  line-height: 1.5;
}

.skill-description-edit {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.remove-skill-button {
  background-color: rgba(239, 83, 80, 0.1);
  color: var(--error-color);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  width: 100%;
  margin-top: 1rem;
  transition: var(--transition);
}

.remove-skill-button:hover {
  background-color: rgba(239, 83, 80, 0.2);
}

.add-skill-button {
  background-color: transparent;
  border: 1px dashed var(--primary-color);
  color: var(--primary-color);
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.add-skill-button:hover {
  background-color: rgba(74, 140, 255, 0.05);
}

/* Reviews Section Styles */
.reviews-section {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--box-shadow);
}

.reviews-section h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.reviews-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.review-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.reviewer-name {
  font-weight: 600;
  color: var(--text-color);
}

.review-date {
  color: var(--light-text);
  font-size: 0.9rem;
}

.review-rating {
  color: #ffb400;
  font-size: 1.1rem;
  letter-spacing: 2px;
  margin-bottom: 0.75rem;
}

.review-comment {
  color: var(--text-color);
  line-height: 1.5;
  font-style: italic;
}

/* Profile Actions */
.profile-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.save-button {
  background-color: var(--success-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: var(--transition);
}

.save-button:hover {
  background-color: #43a047;
}

.cancel-button {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: var(--transition);
}

.cancel-button:hover {
  background-color: var(--background-color);
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .skills-container {
    grid-template-columns: 1fr;
  }
  
  .learning-skills {
    margin-top: 2rem;
  }
}

@media (max-width: 768px) {
  .profile-overview {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .preference-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>