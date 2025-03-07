<template>
  <div class="about">
    <h1>About FoodExpress</h1>
    
    <div class="about-content">
      <section class="about-section">
        <h2>Our Mission</h2>
        <p>FoodExpress is a demo food delivery platform that showcases a modern web application built with Vue.js. Our mission is to demonstrate how a client-side application can provide a seamless user experience without requiring a backend server.</p>
      </section>
      
      <section class="about-section">
        <h2>How It Works</h2>
        <p>This application is purely frontend-based, with all data generated and stored locally in your browser. When you load the app, we generate random restaurants, menus, and pricing to simulate a real food delivery service.</p>
        <p>Your cart information is stored in your browser's local storage, allowing you to come back and continue your order later.</p>
      </section>
      
      <section class="about-section">
        <h2>Demo Features</h2>
        <ul>
          <li>Browse random restaurants and menus</li>
          <li>Filter restaurants by cuisine or search</li>
          <li>Add items to cart with quantity controls</li>
          <li>Complete checkout process with mock payment</li>
          <li>Order tracking simulation</li>
          <li>Responsive design for all devices</li>
        </ul>
      </section>
      
      <section class="about-section">
        <h2>Technologies Used</h2>
        <ul>
          <li>Vue 3 with Composition API</li>
          <li>Vue Router for page navigation</li>
          <li>CSS with scoped styling</li>
          <li>LocalStorage for data persistence</li>
          <li>Responsive design with CSS Grid and Flexbox</li>
        </ul>
      </section>
      
      <section class="about-section">
        <h2>Disclaimer</h2>
        <p>This is a demo application. No real orders are processed, no payments are taken, and no food will be delivered. This application is for demonstration purposes only.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 2rem;
  text-align: center;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-section {
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.about-section h2 {
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.about-section p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #555;
}

.about-section p:last-child {
  margin-bottom: 0;
}

.about-section ul {
  padding-left: 1.5rem;
  margin-bottom: 0;
}

.about-section li {
  margin-bottom: 0.5rem;
  color: #555;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .about-section {
    padding: 1.25rem;
  }
}
</style>
