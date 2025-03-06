<template>
  <div class="about-container">
    <h1 class="view-title">About NimbusNotes</h1>
    
    <div class="about-content">
      <section class="about-section intro-section">
        <div class="logo-container">
          <img src="@/assets/logo.svg" alt="NimbusNotes Logo" class="about-logo" width="100" height="100" />
          <h2 class="app-name">NimbusNotes</h2>
          <p class="app-tagline">Your ideas, organized and accessible anywhere</p>
        </div>
        
        <div class="app-description">
          <p>NimbusNotes is a modern, versatile notes app designed for personal use, collaborative projects, and creative brainstorming. With a clean interface and powerful features, NimbusNotes helps you capture, organize, and find your ideas whenever inspiration strikes.</p>
        </div>
      </section>
      
      <section class="about-section features-section">
        <h2 class="section-title" v-voix="'Key Features'">Key Features</h2>
        
        <div class="features-grid">
          <div class="feature-card" v-voix="'Rich Text Editing'">
            <div class="feature-icon">📝</div>
            <h3 class="feature-title">Rich Text Editing</h3>
            <p class="feature-description">Create beautifully formatted notes with support for headings, lists, checkboxes, and more.</p>
          </div>
          
          <div class="feature-card" v-voix="'Organized Structure'">
            <div class="feature-icon">📂</div>
            <h3 class="feature-title">Organized Structure</h3>
            <p class="feature-description">Keep your thoughts organized with folders, tags, and customizable categories.</p>
          </div>
          
          <div class="feature-card" v-voix="'Powerful Search'">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">Powerful Search</h3>
            <p class="feature-description">Find what you need instantly with full-text search and advanced filtering options.</p>
          </div>
          
          <div class="feature-card" v-voix="'Cross-Device Sync'">
            <div class="feature-icon">🔄</div>
            <h3 class="feature-title">Cross-Device Sync</h3>
            <p class="feature-description">Access your notes on all your devices with seamless cloud synchronization.</p>
          </div>
          
          <div class="feature-card" v-voix="'Collaboration Tools'">
            <div class="feature-icon">👥</div>
            <h3 class="feature-title">Collaboration Tools</h3>
            <p class="feature-description">Share notes with colleagues and friends for real-time collaboration.</p>
          </div>
          
          <div class="feature-card" v-voix="'Calendar View'">
            <div class="feature-icon">📅</div>
            <h3 class="feature-title">Calendar View</h3>
            <p class="feature-description">Visualize your notes chronologically with calendar and timeline views.</p>
          </div>
        </div>
      </section>
      
      <section class="about-section usage-section">
        <h2 class="section-title" v-voix="'How to Use NimbusNotes'">How to Use NimbusNotes</h2>
        
        <div class="usage-steps">
          <div class="usage-step" v-voix="'Step 1: Create Notes'">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="step-title">Create Notes</h3>
              <p class="step-description">Click the "New Note" button to create a note. Add a title and start typing your content using rich text formatting.</p>
            </div>
          </div>
          
          <div class="usage-step" v-voix="'Step 2: Organize'">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="step-title">Organize</h3>
              <p class="step-description">Assign tags and folders to keep your notes organized. Pin important notes to access them quickly from the dashboard.</p>
            </div>
          </div>
          
          <div class="usage-step" v-voix="'Step 3: Find and Search'">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="step-title">Find and Search</h3>
              <p class="step-description">Use the search function to find notes by title, content, or tags. Filter results by date, folder, or other criteria.</p>
            </div>
          </div>
          
          <div class="usage-step" v-voix="'Step 4: Collaborate'">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3 class="step-title">Collaborate</h3>
              <p class="step-description">Share notes with others by email or shareable link. Collaborate in real-time on shared projects.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section class="about-section privacy-section">
        <h2 class="section-title" v-voix="'Privacy & Security'">Privacy & Security</h2>
        
        <div class="privacy-content">
          <p>At NimbusNotes, we take your privacy and data security seriously. All notes are encrypted, and your data is never sold to third parties. Our privacy-first approach means you can trust us with your most important ideas.</p>
          
          <div class="privacy-links">
            <a href="#" class="privacy-link" v-voix="'Privacy Policy'">Privacy Policy</a>
            <a href="#" class="privacy-link" v-voix="'Terms of Service'">Terms of Service</a>
          </div>
        </div>
      </section>
      
      <section class="about-section version-section">
        <h2 class="section-title" v-voix="'Version Information'">Version Information</h2>
        
        <div class="version-details">
          <div class="version-item">
            <div class="version-label" v-voix="'App Version'">App Version:</div>
            <div class="version-value">1.0.0</div>
          </div>
          
          <div class="version-item">
            <div class="version-label" v-voix="'Last Updated'">Last Updated:</div>
            <div class="version-value">March 6, 2025</div>
          </div>
          
          <div class="version-item">
            <div class="version-label" v-voix="'Built With'">Built With:</div>
            <div class="version-value">Vue.js 3, Vite</div>
          </div>
        </div>
      </section>
      
      <section class="about-section contact-section">
        <h2 class="section-title" v-voix="'Contact & Support'">Contact & Support</h2>
        
        <div class="contact-content">
          <p>Need help or have suggestions? We'd love to hear from you!</p>
          
          <div class="contact-methods">
            <a href="mailto:support@nimbusnotes.app" class="contact-link" v-voix="'Email Support'">
              <span class="contact-icon">✉️</span>
              <span class="contact-text">support@nimbusnotes.app</span>
            </a>
            
            <a href="#" class="contact-link" v-voix="'Documentation'">
              <span class="contact-icon">📚</span>
              <span class="contact-text">Documentation</span>
            </a>
            
            <a href="#" class="contact-link" v-voix="'Twitter'">
              <span class="contact-icon">🐦</span>
              <span class="contact-text">@NimbusNotes</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.view-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.about-section {
  padding: 1.5rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
}

.section-title {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

/* Intro Section */
.intro-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  text-align: center;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.about-logo {
  margin-bottom: 1rem;
}

.app-name {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-heading);
}

.app-tagline {
  font-size: 1.1rem;
  color: var(--color-text-light);
  margin: 0.5rem 0 0;
}

.app-description {
  max-width: 700px;
  line-height: 1.6;
}

/* Features Section */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 1.5rem;
  background-color: var(--color-background);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.1rem;
  margin: 0 0 0.75rem;
  color: var(--color-heading);
}

.feature-description {
  font-size: 0.9rem;
  color: var(--color-text);
  line-height: 1.5;
  margin: 0;
}

/* Usage Section */
.usage-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.usage-step {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #4169E1;
  color: white;
  border-radius: 50%;
  font-weight: 600;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.step-content {
  flex-grow: 1;
}

.step-title {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
  color: var(--color-heading);
}

.step-description {
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.5;
  margin: 0;
}

/* Privacy Section */
.privacy-content {
  line-height: 1.6;
}

.privacy-links {
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.privacy-link {
  color: #4169E1;
  text-decoration: none;
  font-weight: 500;
}

.privacy-link:hover {
  text-decoration: underline;
}

/* Version Section */
.version-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.version-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.version-label {
  font-weight: 600;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.version-value {
  font-size: 1.1rem;
  color: var(--color-text);
}

/* Contact Section */
.contact-content {
  text-align: center;
  line-height: 1.6;
}

.contact-methods {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-text);
  padding: 0.75rem 1.25rem;
  background-color: var(--color-background);
  border-radius: 40px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.contact-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #4169E1;
}

.contact-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .usage-step {
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .version-details {
    grid-template-columns: 1fr;
  }
  
  .contact-methods {
    flex-direction: column;
  }
  
  .contact-link {
    width: 100%;
    justify-content: center;
  }
}
</style>
