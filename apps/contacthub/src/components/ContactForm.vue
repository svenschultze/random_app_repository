<script setup>
import { ref, reactive, onMounted } from 'vue';
import { generateId } from '../utils/contactModel';

const props = defineProps({
  contact: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save', 'cancel']);

// Available tags for selection
const availableTags = [
  'Family', 'Friend', 'Work', 'School', 'Important', 'Favorite'
];

// Create reactive form state
const formData = reactive({
  id: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
  tags: [],
  avatarUrl: ''
});

// Error state
const errors = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: ''
});

// Set up form data from contact prop if editing
onMounted(() => {
  if (props.contact) {
    Object.keys(formData).forEach(key => {
      if (key === 'tags' && props.contact.tags) {
        formData.tags = [...props.contact.tags];
      } else if (props.contact[key] !== undefined) {
        formData[key] = props.contact[key];
      }
    });
  } else {
    // For new contact, generate ID
    formData.id = generateId();
  }
});

// Validate form
const validateForm = () => {
  let isValid = true;
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '');
  
  // Validate first name
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
    isValid = false;
  }
  
  // Validate last name
  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
    isValid = false;
  }
  
  // Validate phone (simple validation)
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required';
    isValid = false;
  }
  
  // Validate email (simple validation)
  if (formData.email && !formData.email.includes('@')) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  return isValid;
};

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    emit('save', { ...formData });
  }
};

// Handle tag toggle
const toggleTag = (tag) => {
  const index = formData.tags.indexOf(tag);
  if (index === -1) {
    formData.tags.push(tag);
  } else {
    formData.tags.splice(index, 1);
  }
};

// Cancel form
const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="contact-form">
    <h2>{{ isEdit ? 'Edit Contact' : 'Add New Contact' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="firstName" v-voix="'input-first-name'">First Name *</label>
        <input 
          type="text" 
          id="firstName" 
          v-model="formData.firstName" 
          :class="{ 'error': errors.firstName }"
          v-voix="'first-name-input'"
          hint="Enter the contact's first name"
        >
        <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
      </div>
      
      <div class="form-group">
        <label for="lastName" v-voix="'input-last-name'">Last Name *</label>
        <input 
          type="text" 
          id="lastName" 
          v-model="formData.lastName" 
          :class="{ 'error': errors.lastName }"
          v-voix="'last-name-input'"
          hint="Enter the contact's last name"
        >
        <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
      </div>
      
      <div class="form-group">
        <label for="phone" v-voix="'input-phone'">Phone *</label>
        <input 
          type="tel" 
          id="phone" 
          v-model="formData.phone" 
          :class="{ 'error': errors.phone }"
          v-voix="'phone-input'"
          hint="Enter the contact's phone number"
        >
        <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
      </div>
      
      <div class="form-group">
        <label for="email" v-voix="'input-email'">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          :class="{ 'error': errors.email }"
          v-voix="'email-input'"
          hint="Enter the contact's email address"
        >
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>
      
      <div class="form-group">
        <label for="address" v-voix="'input-address'">Address</label>
        <input 
          type="text" 
          id="address" 
          v-model="formData.address"
          v-voix="'address-input'"
          hint="Enter the contact's address"
        >
      </div>
      
      <div class="form-group">
        <label for="notes" v-voix="'input-notes'">Notes</label>
        <textarea 
          id="notes" 
          v-model="formData.notes"
          rows="3"
          v-voix="'notes-input'"
          hint="Enter any additional notes about this contact"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label v-voix="'input-avatar'">Avatar URL</label>
        <input 
          type="url" 
          id="avatarUrl" 
          v-model="formData.avatarUrl"
          placeholder="http://example.com/avatar.jpg"
          v-voix="'avatar-url-input'"
          hint="Enter a URL for the contact's avatar image"
        >
        
        <div v-if="formData.avatarUrl" class="avatar-preview">
          <img :src="formData.avatarUrl" alt="Avatar preview">
        </div>
      </div>
      
      <div class="form-group">
        <label v-voix="'input-tags'">Tags</label>
        <div class="tags-container">
          <button 
            v-for="tag in availableTags" 
            :key="tag"
            type="button"
            @click="toggleTag(tag)"
            :class="{ 'selected': formData.tags.includes(tag) }"
            class="tag-button"
            v-voix="'tag-' + tag.toLowerCase()"
            hint="Click to toggle this tag for the contact"
          >
            {{ tag }}
          </button>
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          type="button" 
          class="cancel-button" 
          @click="handleCancel"
          v-voix="'cancel-button'"
          hint="Cancel and return to contact list"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="save-button"
          v-voix="'save-button'"
          hint="Save the contact information"
        >
          {{ isEdit ? 'Update Contact' : 'Add Contact' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.contact-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1.5rem;
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

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #5c6bc0;
}

input.error, textarea.error {
  border-color: #f44336;
}

.error-message {
  display: block;
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.avatar-preview {
  margin-top: 1rem;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-button.selected {
  background-color: #5c6bc0;
  color: white;
  border-color: #5c6bc0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button, .save-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.cancel-button {
  background-color: #e0e0e0;
  color: #555;
}

.save-button {
  background-color: #5c6bc0;
  color: white;
}

.cancel-button:hover {
  background-color: #d0d0d0;
}

.save-button:hover {
  background-color: #4a59b0;
}

@media (max-width: 640px) {
  .contact-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>