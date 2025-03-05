<script setup>
import { ref } from 'vue';

const contactForm = ref({
  name: '',
  email: '',
  message: ''
});

const errors = ref({});
const isSubmitting = ref(false);
const isSubmitted = ref(false);

function validateForm() {
  const newErrors = {};
  
  if (!contactForm.value.name) {
    newErrors.name = 'Name is required';
  }
  
  if (!contactForm.value.email) {
    newErrors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.value.email)) {
    newErrors.email = 'Please enter a valid email address';
  }
  
  if (!contactForm.value.message) {
    newErrors.message = 'Message is required';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
}

function submitForm() {
  if (!validateForm()) {
    return;
  }
  
  isSubmitting.value = true;
  
  // Simulate form submission delay
  setTimeout(() => {
    isSubmitting.value = false;
    isSubmitted.value = true;
    
    // Reset form
    contactForm.value = {
      name: '',
      email: '',
      message: ''
    };
  }, 1000);
}
</script>

<template>
  <div class="contact-view" v-voix="'contact-view'" hint="Contact page with feedback form">
    <h1 v-voix="'contact-heading'">Contact Us</h1>
    
    <div class="contact-container">
      <div class="contact-info">
        <h2 v-voix="'contact-info-heading'">Get in Touch</h2>
        <p v-voix="'contact-description'">
          We'd love to hear from you! Whether you have a question about our recipes, want to
          suggest a feature, or just want to say hello, please fill out the form and we'll
          get back to you as soon as possible.
        </p>
        
        <div class="contact-details" v-voix="'contact-details-section'">
          <div class="contact-item">
            <strong>Email:</strong> info@myrecipebook.demo
          </div>
          <div class="contact-item">
            <strong>Hours:</strong> Monday - Friday, 9am - 5pm
          </div>
        </div>
        
        <div class="faq-section" v-voix="'faq-section'">
          <h3 v-voix="'faq-heading'">Frequently Asked Questions</h3>
          <div class="faq-item" v-voix="'faq-item-1'">
            <h4>How do I save a recipe?</h4>
            <p>Click the "Add to Favorites" button on any recipe page to save it to your favorites.</p>
          </div>
          <div class="faq-item" v-voix="'faq-item-2'">
            <h4>Can I edit a recipe after submitting it?</h4>
            <p>Currently, this demo version doesn't support editing recipes after submission.</p>
          </div>
          <div class="faq-item" v-voix="'faq-item-3'">
            <h4>How do I format my recipe instructions?</h4>
            <p>Use markdown formatting in the instructions field when adding a recipe. Check the 
              preview button to see how your formatting looks before submitting.</p>
          </div>
        </div>
      </div>
      
      <div class="contact-form-container">
        <div v-if="!isSubmitted">
          <h2 v-voix="'contact-form-heading'">Send Us a Message</h2>
          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-group">
              <label for="name" v-voix="'name-label'">Name *</label>
              <input 
                type="text" 
                id="name" 
                v-model="contactForm.name" 
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                v-voix="'name-input'"
                hint="Enter your full name"
              />
              <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
            </div>
            
            <div class="form-group">
              <label for="email" v-voix="'email-label'">Email *</label>
              <input 
                type="email" 
                id="email" 
                v-model="contactForm.email" 
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                v-voix="'email-input'"
                hint="Enter your email address"
              />
              <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            </div>
            
            <div class="form-group">
              <label for="message" v-voix="'message-label'">Message *</label>
              <textarea 
                id="message" 
                v-model="contactForm.message" 
                rows="6"
                class="form-control"
                :class="{ 'is-invalid': errors.message }"
                v-voix="'message-input'"
                hint="Enter your message or feedback"
              ></textarea>
              <div v-if="errors.message" class="error-message">{{ errors.message }}</div>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="submit-button" 
                :disabled="isSubmitting"
                v-voix="'submit-button'"
                hint="Click to send your message"
              >
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </div>
          </form>
        </div>
        
        <div v-else class="thank-you-message" v-voix="'thank-you-message'">
          <h2>Thank You!</h2>
          <p>Your message has been sent successfully. We'll get back to you soon!</p>
          <button 
            @click="isSubmitted = false" 
            class="new-message-button"
            v-voix="'new-message-button'"
            hint="Click to send another message"
          >
            Send Another Message
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-view {
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.contact-info, .contact-form-container {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.contact-info h2, .contact-form-container h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.contact-details {
  margin: 1.5rem 0;
}

.contact-item {
  margin-bottom: 0.8rem;
}

.faq-section {
  margin-top: 2rem;
}

.faq-section h3 {
  margin-bottom: 1.2rem;
  color: #333;
}

.faq-item {
  margin-bottom: 1.5rem;
}

.faq-item h4 {
  margin-bottom: 0.5rem;
  color: #555;
}

.faq-item p {
  margin: 0;
  color: #666;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  margin-top: 2rem;
}

.submit-button, .new-message-button {
  padding: 0.8rem 1.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled), .new-message-button:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
}

.submit-button:disabled {
  background-color: #ffa5a5;
  cursor: not-allowed;
}

.thank-you-message {
  text-align: center;
  padding: 2rem;
}

.thank-you-message h2 {
  color: #4caf50;
  margin-bottom: 1rem;
}

.thank-you-message p {
  margin-bottom: 2rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
}
</style>