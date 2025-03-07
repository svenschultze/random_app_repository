<template>
  <div class="about-container">
    <h1 v-voix="'about-heading'">About JobSwipe</h1>
    
    <section class="about-section">
      <h2 v-voix="'what-is-jobswipe-heading'">What is JobSwipe?</h2>
      <p>JobSwipe is a modern recruitment platform that connects job seekers with companies through an intuitive swipe-based interface. Inspired by dating apps, we have created a fun and efficient way for candidates and employers to find their perfect match.</p>
    </section>
    
    <section class="about-section">
      <h2 v-voix="'how-it-works-heading'">How It Works</h2>
      
      <div class="info-card">
        <h3>For Job Seekers</h3>
        <ul>
          <li>Create a profile highlighting your skills, experience, and preferences</li>
          <li>Swipe through job opportunities that match your criteria</li>
          <li>When you "like" a job and the company also "likes" your profile, it's a match!</li>
          <li>Connect directly with potential employers through our in-app messaging</li>
        </ul>
      </div>
      
      <div class="info-card">
        <h3>For Companies</h3>
        <ul>
          <li>Create company profiles and post job openings</li>
          <li>Swipe through candidates with relevant skills and experience</li>
          <li>Get instantly connected when there's mutual interest</li>
          <li>Streamline your recruitment process and save time</li>
        </ul>
      </div>
    </section>
    
    <section class="about-section">
      <h2 v-voix="'benefits-heading'">Benefits of JobSwipe</h2>
      
      <div class="benefits-grid">
        <div class="benefit-item">
          <h3>Time-Saving</h3>
          <p>No more endless application forms or sifting through hundreds of CVs.</p>
        </div>
        
        <div class="benefit-item">
          <h3>Fun Experience</h3>
          <p>We have made job hunting and recruitment engaging and enjoyable.</p>
        </div>
        
        <div class="benefit-item">
          <h3>Mutual Interest</h3>
          <p>Matches only happen when both parties are interested, meaning higher quality connections.</p>
        </div>
        
        <div class="benefit-item">
          <h3>Direct Communication</h3>
          <p>Our in-app messaging system allows for immediate and direct interaction.</p>
        </div>
      </div>
    </section>
    
    <section class="about-section">
      <h2 v-voix="'get-started-heading'">Ready to Get Started?</h2>
      <p>Join thousands of job seekers and companies who are already finding their perfect match on JobSwipe.</p>
      
      <div class="cta-buttons">
        <RouterLink 
          to="/signup" 
          class="cta-button primary"
          v-voix="'about-signup-button'"
          hint="Navigate to signup page to create an account"
        >
          Create an Account
        </RouterLink>
        
        <RouterLink 
          to="/login" 
          class="cta-button secondary"
          v-voix="'about-login-button'"
          hint="Navigate to login page if you already have an account"
        >
          Login
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.about-section {
  margin-bottom: 3rem;
}

.about-section h2 {
  color: #ff5757;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.about-section p {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: #555;
}

.info-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.info-card ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info-card li {
  margin-bottom: 0.8rem;
  color: #555;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.benefit-item {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.benefit-item h3 {
  margin-top: 0;
  margin-bottom: 0.8rem;
  color: #333;
}

.benefit-item p {
  margin: 0;
  color: #555;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.cta-button {
  padding: 0.8rem 2rem;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  font-size: 1rem;
  text-decoration: none;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cta-button.primary {
  background-color: #ff5757;
  color: white;
}

.cta-button.secondary {
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
}

@media (max-width: 768px) {
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button {
    width: 100%;
    max-width: 300px;
    margin-bottom: 1rem;
    text-align: center;
  }
}
</style>
