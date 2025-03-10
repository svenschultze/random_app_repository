<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getClassById, ClassEvent } from '../models/class';

const router = useRouter();
const route = useRoute();
const classEvent = ref(null);
const isEditing = ref(false);
const editableClass = ref(new ClassEvent());

// Load the class data
onMounted(() => {
  if (route.params.id) {
    // Editing existing class
    const foundClass = getClassById(route.params.id);
    if (foundClass) {
      classEvent.value = foundClass;
      editableClass.value = { ...foundClass };
    } else {
      router.push('/');
    }
  } else {
    // Creating a new class
    isEditing.value = true;
    classEvent.value = new ClassEvent();
    editableClass.value = { ...classEvent.value };
  }
});

// Format time range
const timeRange = computed(() => {
  if (!classEvent.value) return '';
  return `${classEvent.value.startTime} - ${classEvent.value.endTime}`;
});

// Enter edit mode
const startEditing = () => {
  editableClass.value = { ...classEvent.value };
  isEditing.value = true;
};

// Save changes
const saveChanges = () => {
  // In a real app, this would call an API to save the changes
  // For this demo, we'll just update our reference
  Object.assign(classEvent.value, editableClass.value);
  isEditing.value = false;
};

// Cancel editing
const cancelEditing = () => {
  if (!route.params.id) {
    // If creating a new class, go back to home
    router.push('/');
  } else {
    // Just exit edit mode
    isEditing.value = false;
  }
};

// Delete the class
const deleteClass = () => {
  // In a real app, this would call an API to delete the class
  // For this demo, we'll just go back
  router.push('/');
};

// Go back
const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="event-detail-view">
    <div class="view-header">
      <button 
        class="back-btn" 
        @click="goBack"
        v-voix="'go-back-button'"
        hint="Return to previous screen"
      >
        ← Back
      </button>
      <h2 v-voix="'event-detail-heading'">
        {{ isEditing ? (route.params.id ? 'Edit Event' : 'Add New Event') : 'Event Details' }}
      </h2>
    </div>
    
    <div v-if="classEvent" class="event-content">
      <!-- View Mode -->
      <div v-if="!isEditing" class="view-mode">
        <div class="event-header" :style="{ backgroundColor: classEvent.color }">
          <div class="event-subject">{{ classEvent.subject }}</div>
          <h3 class="event-title" v-voix="'event-title'">{{ classEvent.title }}</h3>
          <div v-if="classEvent.isCancelled" class="cancelled-badge">CANCELLED</div>
        </div>
        
        <div class="event-details">
          <div class="detail-item" v-voix="'event-time'">
            <span class="detail-label">Time:</span>
            <span>{{ timeRange }}</span>
          </div>
          
          <div class="detail-item" v-voix="'event-day'">
            <span class="detail-label">Day:</span>
            <span>{{ classEvent.day }}</span>
          </div>
          
          <div v-if="classEvent.instructor" class="detail-item" v-voix="'event-instructor'">
            <span class="detail-label">Instructor:</span>
            <span>{{ classEvent.instructor }}</span>
          </div>
          
          <div v-if="classEvent.location" class="detail-item" v-voix="'event-location'">
            <span class="detail-label">Location:</span>
            <span>{{ classEvent.location }}</span>
          </div>
          
          <div v-if="classEvent.recurring" class="detail-item" v-voix="'event-recurrence'">
            <span class="detail-label">Recurrence:</span>
            <span>{{ classEvent.recurrencePattern }}</span>
          </div>
          
          <div v-if="classEvent.notes" class="notes-section" v-voix="'event-notes'">
            <h4>Notes</h4>
            <p>{{ classEvent.notes }}</p>
          </div>
        </div>
        
        <div class="action-buttons">
          <button 
            class="edit-btn" 
            @click="startEditing"
            v-voix="'edit-event-button'"
            hint="Edit this event's details"
          >
            Edit
          </button>
          <button 
            class="delete-btn" 
            @click="deleteClass"
            v-voix="'delete-event-button'"
            hint="Delete this event"
          >
            Delete
          </button>
        </div>
      </div>
      
      <!-- Edit Mode -->
      <div v-else class="edit-mode">
        <form @submit.prevent="saveChanges">
          <div class="form-group">
            <label 
              for="title"
              v-voix="'title-input-label'"
              hint="Enter the name of the class or event"
            >
              Title
            </label>
            <input 
              type="text" 
              id="title" 
              v-model="editableClass.title" 
              required
              v-voix="'title-input'"
            />
          </div>
          
          <div class="form-group">
            <label 
              for="subject"
              v-voix="'subject-input-label'"
              hint="Enter the subject code, like CS101"
            >
              Subject Code
            </label>
            <input 
              type="text" 
              id="subject" 
              v-model="editableClass.subject"
              v-voix="'subject-input'"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label 
                for="startTime"
                v-voix="'start-time-input-label'"
                hint="Enter the start time"
              >
                Start Time
              </label>
              <input 
                type="time" 
                id="startTime" 
                v-model="editableClass.startTime" 
                required
                v-voix="'start-time-input'"
              />
            </div>
            
            <div class="form-group">
              <label 
                for="endTime"
                v-voix="'end-time-input-label'"
                hint="Enter the end time"
              >
                End Time
              </label>
              <input 
                type="time" 
                id="endTime" 
                v-model="editableClass.endTime" 
                required
                v-voix="'end-time-input'"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label 
              for="day"
              v-voix="'day-input-label'"
              hint="Select the day of week"
            >
              Day
            </label>
            <select 
              id="day" 
              v-model="editableClass.day" 
              required
              v-voix="'day-input'"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          
          <div class="form-group">
            <label 
              for="location"
              v-voix="'location-input-label'"
              hint="Enter the location of the class"
            >
              Location
            </label>
            <input 
              type="text" 
              id="location" 
              v-model="editableClass.location"
              v-voix="'location-input'"
            />
          </div>
          
          <div class="form-group">
            <label 
              for="instructor"
              v-voix="'instructor-input-label'"
              hint="Enter the name of the instructor"
            >
              Instructor
            </label>
            <input 
              type="text" 
              id="instructor" 
              v-model="editableClass.instructor"
              v-voix="'instructor-input'"
            />
          </div>
          
          <div class="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="recurring" 
              v-model="editableClass.recurring"
              v-voix="'recurring-checkbox'"
              hint="Check if this class repeats regularly"
            />
            <label for="recurring">Recurring Event</label>
          </div>
          
          <div v-if="editableClass.recurring" class="form-group">
            <label 
              for="recurrencePattern"
              v-voix="'recurrence-pattern-label'"
              hint="Select how often this event repeats"
            >
              Recurrence Pattern
            </label>
            <select 
              id="recurrencePattern" 
              v-model="editableClass.recurrencePattern"
              v-voix="'recurrence-pattern-input'"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div class="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="isSpecialEvent" 
              v-model="editableClass.isSpecialEvent"
              v-voix="'special-event-checkbox'"
              hint="Check if this is a special event like an exam"
            />
            <label for="isSpecialEvent">Special Event</label>
          </div>
          
          <div class="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="isCancelled" 
              v-model="editableClass.isCancelled"
              v-voix="'cancelled-checkbox'"
              hint="Check if this class is cancelled"
            />
            <label for="isCancelled">Cancelled</label>
          </div>
          
          <div class="form-group">
            <label 
              for="notes"
              v-voix="'notes-input-label'"
              hint="Enter any additional notes for this class"
            >
              Notes
            </label>
            <textarea 
              id="notes" 
              v-model="editableClass.notes" 
              rows="4"
              v-voix="'notes-input'"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label 
              for="color"
              v-voix="'color-input-label'"
              hint="Choose a color for this class"
            >
              Color
            </label>
            <input 
              type="color" 
              id="color" 
              v-model="editableClass.color"
              v-voix="'color-input'"
            />
          </div>
          
          <div class="form-actions">
            <button 
              type="button" 
              class="cancel-btn" 
              @click="cancelEditing"
              v-voix="'cancel-button'"
              hint="Cancel editing and discard changes"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="save-btn"
              v-voix="'save-button'"
              hint="Save changes to this event"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-detail-view {
  max-width: 800px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.back-btn {
  background: none;
  border: none;
  color: #4a6fa5;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
}

.back-btn:hover {
  text-decoration: underline;
}

.view-header h2 {
  margin: 0;
  color: #4a6fa5;
}

.event-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* View Mode Styles */
.event-header {
  padding: 20px;
  color: white;
  position: relative;
}

.event-subject {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
}

.event-title {
  margin: 0;
  font-size: 1.5rem;
}

.cancelled-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
}

.event-details {
  padding: 20px;
}

.detail-item {
  margin-bottom: 12px;
  display: flex;
}

.detail-label {
  font-weight: bold;
  color: #495057;
  width: 100px;
  flex-shrink: 0;
}

.notes-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.notes-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #495057;
}

.notes-section p {
  margin: 0;
  color: #6c757d;
  white-space: pre-wrap;
}

.action-buttons {
  padding: 0 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.edit-btn {
  background-color: #4a6fa5;
  color: white;
}

.edit-btn:hover {
  background-color: #3a5a84;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

/* Edit Mode Styles */
.edit-mode {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #495057;
}

input[type="text"], 
input[type="time"], 
select, 
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
}

textarea {
  resize: vertical;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-group label {
  margin-bottom: 0;
}

.checkbox-group input {
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn, .save-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.save-btn:hover {
  background-color: #218838;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .detail-item {
    flex-direction: column;
  }
  
  .detail-label {
    width: auto;
    margin-bottom: 4px;
  }
}
</style>