<template>
  <div class="about-container">
    <div class="about-content">
      <h1 class="about-title">About NearExplorer</h1>
      
      <section class="about-section">
        <h2>Our Mission</h2>
        <p>
          NearExplorer is designed to help you discover interesting places around you that match your preferences and current context. 
          Whether you're looking for a quiet coffee shop in the morning, a lively nightspot in the evening, or a peaceful park on the weekend, 
          NearExplorer adapts its recommendations to your needs.
        </p>
      </section>
      
      <section class="about-section">
        <h2>Key Features</h2>
        <ul class="features-list">
          <li>
            <div class="feature-icon">🧠</div>
            <div class="feature-text">
              <h3>Smart Recommendations</h3>
              <p>Personalized suggestions based on your interests, time of day, and travel preferences.</p>
            </div>
          </li>
          <li>
            <div class="feature-icon">🗺️</div>
            <div class="feature-text">
              <h3>Interactive Maps</h3>
              <p>Intuitive map interface with customized markers for easy navigation and exploration.</p>
            </div>
          </li>
          <li>
            <div class="feature-icon">🔄</div>
            <div class="feature-text">
              <h3>Contextual Awareness</h3>
              <p>Recommendations that change based on time of day, day of week, and your current activity.</p>
            </div>
          </li>
          <li>
            <div class="feature-icon">🚶</div>
            <div class="feature-text">
              <h3>Multi-Modal Navigation</h3>
              <p>Directions for walking, biking, driving, or using public transportation.</p>
            </div>
          </li>
        </ul>
      </section>
      
      <section class="about-section">
        <h2>Privacy First</h2>
        <p>
          Your privacy matters to us. NearExplorer stores all your preferences locally on your device.
          We only request location access to provide you with relevant nearby suggestions and navigation.
          No personal data is sent to external servers or shared with third parties.
        </p>
      </section>
      
      <section class="about-section">
        <h2>Technical Details</h2>
        <p>
          NearExplorer is built with Vue.js 3 and uses the Mapbox API for mapping and navigation features.
          It's designed as a Progressive Web App (PWA) for cross-platform compatibility.
        </p>
      </section>
      
      <section class="about-section">
        <h2>Get Started</h2>
        <p>
          Ready to explore your surroundings in a whole new way? Complete the quick onboarding process to customize your experience.
        </p>
        <button 
          class="btn btn-primary start-btn" 
          @click="$router.push('/')"
          v-voix="'go-to-home'"
          hint="Return to home page to begin exploring">
          Start Exploring
        </button>
      </section>
      
      <footer class="about-footer">
        <p>&copy; 2025 NearExplorer | Demo Version 1.0</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.about-section {
  margin-bottom: 3rem;
}

.about-section h2 {
  font-size: 1.8rem;
  color: #3498db;
  margin-bottom: 1rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.about-section h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: #3498db;
}

.about-section p {
  color: #34495e;
  line-height: 1.6;
  font-size: 1.1rem;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  display: flex;
  margin-bottom: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.features-list li:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-right: 1.5rem;
  color: #3498db;
}

.feature-text h3 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
  font-size: 1.3rem;
}

.feature-text p {
  margin: 0;
  font-size: 1rem;
}

.start-btn {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  display: block;
  margin: 2rem auto 0;
}

.about-footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #ecf0f1;
  color: #7f8c8d;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .features-list li {
    flex-direction: column;
  }
  
  .feature-icon {
    margin-right: 0;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .about-title {
    font-size: 2rem;
  }
  
  .about-section h2 {
    font-size: 1.5rem;
  }
}
</style>
