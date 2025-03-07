<script setup>
import { RouterLink } from 'vue-router';
import store from '../store';

function resetDemoData() {
  store.resetPolicy();
}
</script>

<template>
  <div class="about">
    <h2>About HealthCover Demo</h2>
    
    <div class="about-content">
      <div class="card">
        <h3>What is HealthCover Demo?</h3>
        <p>
          HealthCover Demo is a front-end demonstration of a health insurance management portal. 
          It's designed to showcase typical health insurance features without requiring any backend service.
        </p>
        <p>
          All data in this application is generated randomly and stored locally in your browser.
          No real insurance coverage is provided, and no actual claims are processed.
        </p>
      </div>
      
      <div class="card">
        <h3>Demo Features</h3>
        <ul class="feature-list">
          <li>
            <strong>Policy Dashboard:</strong> View your policy details, coverage summary, and recent claims.
          </li>
          <li>
            <strong>Coverage Information:</strong> Browse different coverage categories with detailed information.
          </li>
          <li>
            <strong>Claims Management:</strong> View claim history and submit new claims (simulated).
          </li>
          <li>
            <strong>Digital ID Card:</strong> Access your insurance card digitally.
          </li>
          <li>
            <strong>Local Storage:</strong> Your data persists between sessions using browser localStorage.
          </li>
        </ul>
      </div>
      
      <div class="card">
        <h3>Technical Information</h3>
        <p>
          This application is built with:
        </p>
        <ul class="tech-list">
          <li>Vue.js 3 (Composition API)</li>
          <li>Vue Router for navigation</li>
          <li>Local browser storage for data persistence</li>
          <li>CSS for styling (no external component libraries)</li>
        </ul>
        <p>
          No backend or API calls are used - all data is generated on the client side.
        </p>
      </div>
      
      <div class="card">
        <h3>Demo Controls</h3>
        <p>
          You can reset the demo data at any time to generate a new random policy:
        </p>
        <div class="demo-actions">
          <button class="btn btn-danger" @click="resetDemoData">Reset Demo Data</button>
          <RouterLink to="/" class="btn">Return to Dashboard</RouterLink>
        </div>
        <p class="demo-note">
          Resetting will clear all current policy data and generate new random information.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.about-content {
  margin-top: 1.5rem;
}

.feature-list, .tech-list {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.feature-list li, .tech-list li {
  margin-bottom: 0.5rem;
}

.demo-actions {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.demo-note {
  font-size: 0.9rem;
  color: #6c757d;
  font-style: italic;
}
</style>
