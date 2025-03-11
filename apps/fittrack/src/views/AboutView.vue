<template>
  <div class="about-view">
    <div class="header-actions">
      <h1 v-voix="'about-heading'">About FitTrack Demo</h1>
    </div>
    
    <div class="about-container">
      <section class="about-section">
        <h2 class="section-title" v-voix="'app-overview-heading'">Application Overview</h2>
        <p v-voix="'app-description'">
          FitTrack Demo is a front-end demonstration application designed to showcase how a fitness tracking application might work. It's built with Vue.js and features random data generation to populate the application with realistic fitness metrics.
        </p>
        <p v-voix="'data-storage-description'">
          All data is stored locally in your browser's localStorage and is not sent to any server. This application is for demonstration purposes only and is not intended for tracking real fitness data.
        </p>
      </section>

      <section class="features-section">
        <h2 class="section-title" v-voix="'features-heading'">Key Features</h2>
        <ul class="features-list">
          <li v-voix="'dashboard-feature'">
            <strong>Dashboard:</strong> View your daily progress and weekly statistics at a glance
          </li>
          <li v-voix="'workout-tracking-feature'">
            <strong>Workout Tracking:</strong> Log various types of workouts with duration, distance, and calories burned
          </li>
          <li v-voix="'data-visualization-feature'">
            <strong>Data Visualization:</strong> See your activity trends with interactive charts
          </li>
          <li v-voix="'goal-setting-feature'">
            <strong>Goal Setting:</strong> Set and track personal fitness goals
          </li>
          <li v-voix="'streak-tracking-feature'">
            <strong>Streak Tracking:</strong> Monitor your consistency with streak counting
          </li>
        </ul>
      </section>

      <section class="tech-section">
        <h2 class="section-title" v-voix="'technologies-heading'">Technologies Used</h2>
        <ul class="tech-list">
          <li v-voix="'vue-technology'">
            <strong>Vue.js:</strong> Front-end framework
          </li>
          <li v-voix="'vue-router-technology'">
            <strong>Vue Router:</strong> Client-side routing
          </li>
          <li v-voix="'chartjs-technology'">
            <strong>Chart.js:</strong> Data visualization library
          </li>
          <li v-voix="'localstorage-technology'">
            <strong>Local Storage:</strong> Browser-based data persistence
          </li>
          <li v-voix="'fakerjs-technology'">
            <strong>Faker.js:</strong> Random data generation
          </li>
        </ul>
      </section>

      <section class="demo-section">
        <h2 class="section-title" v-voix="'demo-data-heading'">Demo Data</h2>
        <p v-voix="'demo-data-description'">
          The application generates random fitness data when you first load it or when you click the "Generate Demo Data" button on the dashboard. This simulates having several weeks of fitness tracking data for demonstration purposes.
        </p>
        <p v-voix="'customize-note'">
          You can customize your fitness goals in the Settings page to see how progress tracking works with different targets.
        </p>
      </section>

      <section class="disclaimer-section">
        <h2 class="section-title" v-voix="'disclaimer-heading'">Disclaimer</h2>
        <p v-voix="'disclaimer-content'">
          This application is for demonstration purposes only. It is not intended to provide health or fitness advice. The generated data is random and does not represent real fitness metrics. Always consult with healthcare professionals before starting any fitness program.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  max-width: 100%;
}

.header-actions {
  margin-bottom: 2rem;
}

h1 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin: 0;
}

.about-container {
  max-width: 800px;
  margin: 0 auto;
}

section {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  margin-bottom: 1.25rem;
  color: var(--text-color);
}

p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--text-color);
}

.features-list,
.tech-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.features-list li,
.tech-list li {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.6;
}

.features-list li:before,
.tech-list li:before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

.disclaimer-section {
  background-color: #fff8e1;
  border-left: 4px solid #ffc107;
}

.disclaimer-section .section-title {
  color: #f57c00;
}

.disclaimer-section p {
  color: #5d4037;
}
</style>
