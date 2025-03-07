<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="about">
    <div class="about-content">
      <h1>About ContactHub</h1>
      
      <p>
        ContactHub is a client-side web application designed to help you manage your contacts efficiently without
        storing any data on a server. All your contact information stays local to your browser.
      </p>
      
      <h2>Features</h2>
      <ul>
        <li>Store contact information (names, phone numbers, emails, addresses)</li>
        <li>Generate random demo contacts for testing</li>
        <li>Add, edit and delete contacts</li>
        <li>Search through your contacts by name, email, or phone</li>
        <li>Tag and categorize your contacts</li>
        <li>Data persists in your browser's local storage</li>
      </ul>
      
      <h2>Privacy</h2>
      <p>
        ContactHub is completely client-side. Your contact data never leaves your browser - it's
        stored in your browser's local storage. This means:
      </p>
      <ul>
        <li>No server stores your contacts</li>
        <li>Your data remains on your device</li>
        <li>No tracking or analytics</li>
      </ul>
      
      <p>
        <RouterLink to="/" v-voix="'return-to-contacts'">
          &larr; Return to Contacts
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.about {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about-content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

h2 {
  color: var(--color-text);
  margin: 1.5rem 0 1rem;
}

p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

ul {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}
</style>
