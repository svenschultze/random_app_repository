<template>
  <div class="about-view">
    <h1 class="page-title" v-voix="'About Nimbus Files'">About Nimbus Files</h1>
    
    <div class="about-content">
      <section class="about-section" v-voix="'What is Nimbus Files'">
        <h2>What is Nimbus Files?</h2>
        <p>
          Nimbus Files is a demonstration cloud file management application that showcases
          the capabilities of a modern web application built with Vue.js. It simulates the 
          experience of storing, organizing, and sharing files in the cloud.
        </p>
      </section>
      
      <section class="about-section" v-voix="'Features Section'">
        <h2>Features</h2>
        <ul class="features-list">
          <li>
            <span class="feature-icon">📁</span>
            <div class="feature-text">
              <h3 v-voix="'File Management'">File Management</h3>
              <p>Browse, organize, and manage your files and folders.</p>
            </div>
          </li>
          <li>
            <span class="feature-icon">🔍</span>
            <div class="feature-text">
              <h3 v-voix="'Search'">Search</h3>
              <p>Quickly find files by name across your storage.</p>
            </div>
          </li>
          <li>
            <span class="feature-icon">🔗</span>
            <div class="feature-text">
              <h3 v-voix="'File Sharing'">File Sharing</h3>
              <p>Share files with others through generated links.</p>
            </div>
          </li>
          <li>
            <span class="feature-icon">🗑️</span>
            <div class="feature-text">
              <h3 v-voix="'Trash Management'">Trash Management</h3>
              <p>Recover deleted files or permanently remove them.</p>
            </div>
          </li>
          <li>
            <span class="feature-icon">📱</span>
            <div class="feature-text">
              <h3 v-voix="'Responsive Design'">Responsive Design</h3>
              <p>Access your files from any device with a responsive interface.</p>
            </div>
          </li>
        </ul>
      </section>
      
      <section class="about-section" v-voix="'Technology Used'">
        <h2>Technology</h2>
        <p>
          This demo application is built using modern web technologies:
        </p>
        <ul class="tech-list">
          <li><strong>Vue.js 3</strong> - Progressive JavaScript framework</li>
          <li><strong>Composition API</strong> - For state management and component logic</li>
          <li><strong>Vue Router</strong> - For application navigation</li>
          <li><strong>CSS3</strong> - For responsive and adaptive layouts</li>
          <li><strong>Vue Voix</strong> - For accessibility features</li>
        </ul>
      </section>
      
      <section class="about-section disclaimer" v-voix="'Disclaimer'">
        <h2>Disclaimer</h2>
        <p>
          Nimbus Files is a demonstration application and does not actually store files
          in the cloud. All data is simulated and exists only in your browser's memory
          for the duration of your session. No actual files are uploaded or stored.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.page-title {
  font-size: 1.75rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.about-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.about-section {
  padding: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.about-section:last-child {
  border-bottom: none;
}

.about-section h2 {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #212529;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.features-list li:last-child {
  margin-bottom: 0;
}

.feature-icon {
  font-size: 1.75rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.feature-text h3 {
  font-size: 1.15rem;
  margin: 0 0 0.5rem 0;
  color: #343a40;
}

.feature-text p {
  margin: 0;
  color: #6c757d;
}

.tech-list {
  padding-left: 1.25rem;
  color: #495057;
}

.tech-list li {
  margin-bottom: 0.5rem;
}

.disclaimer {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .about-section {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .about-section h2 {
    font-size: 1.25rem;
  }
}
</style>
