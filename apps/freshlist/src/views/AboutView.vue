<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="about-page">
    <h1 v-voix="'about-title'">About FreshList Demo</h1>
    
    <div class="about-content">
      <section class="about-section" v-voix="'about-demo-section'">
        <h2>About This Demo</h2>
        <p>
          FreshList is a demonstration grocery shopping list application built with Vue.js. 
          It showcases interactive UI components, state management, and responsive design.
        </p>
        <p>
          <strong>Important:</strong> This is a demo application that generates random user data and 
          grocery lists on every page reload. No sign-up or authentication is required, and all 
          changes are session-only (they will be lost when you refresh the page).
        </p>
      </section>
      
      <section class="about-section" v-voix="'features-section'">
        <h2>Features</h2>
        <ul>
          <li>Randomly generated user profiles and grocery items on every reload</li>
          <li>Responsive design that works on both mobile and desktop devices</li>
          <li>Interactive grocery list with sorting and filtering capabilities</li>
          <li>Item details view with purchase status tracking</li>
          <li>Add and edit grocery items</li>
          <li>Category-based organization</li>
          <li>Progress tracking for purchased items</li>
        </ul>
      </section>
      
      <section class="about-section" v-voix="'tech-stack-section'">
        <h2>Technical Details</h2>
        <p>
          This demo application was built using:
        </p>
        <ul>
          <li>Vue 3 with Composition API</li>
          <li>Vue Router for navigation</li>
          <li>Faker.js for generating random data</li>
          <li>CSS with Flexbox and Grid for responsive layouts</li>
          <li>Vue Voix for accessibility enhancements</li>
        </ul>
        <p>
          In a production application, this would likely be connected to a backend API for data 
          persistence, user authentication, and real-time updates.
        </p>
      </section>
      
      <div class="action-buttons">
        <button @click="goToHome" class="btn primary" v-voix="'go-to-dashboard-button'" hint="Return to the main dashboard">
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-page h1 {
  margin: 0;
  color: #333;
}

.about-content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-section {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 2rem;
}

.about-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.about-section h2 {
  color: #4caf50;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.about-section p {
  line-height: 1.6;
  color: #555;
  margin: 0 0 1rem 0;
}

.about-section p:last-child {
  margin-bottom: 0;
}

.about-section ul {
  padding-left: 1.5rem;
  margin: 0;
}

.about-section li {
  line-height: 1.6;
  color: #555;
  margin-bottom: 0.5rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 1rem;
}

.btn.primary {
  background-color: #4caf50;
  color: white;
}

.btn.primary:hover {
  background-color: #3d9140;
}

@media (max-width: 768px) {
  .about-content {
    padding: 1.5rem;
  }
}
</style>