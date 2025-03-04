<template>
  <div class="about-container">
    <div class="about-header">
      <h1 v-voix="'About JobTrek Title'">About JobTrek</h1>
      <p class="subheading">A daily career growth tracker for professional development</p>
    </div>

    <div class="about-content">
      <div class="about-card">
        <h2 v-voix="'About Application Section'">About the Application</h2>
        <p>JobTrek is a comprehensive career growth tracking platform designed to help professionals set, manage, and achieve their career goals through consistent tracking and reflection. The application empowers users to take control of their professional development journey with tools for goal setting, daily task management, progress tracking, and performance analytics.</p>
      </div>

      <div class="about-card">
        <h2 v-voix="'Key Features Section'">Key Features</h2>
        <ul class="features-list">
          <li>
            <div class="feature-icon">📊</div>
            <div class="feature-content">
              <h3>Dashboard</h3>
              <p>Centralized overview of your daily tasks, goals progress, and recent achievements.</p>
            </div>
          </li>
          <li>
            <div class="feature-icon">🎯</div>
            <div class="feature-content">
              <h3>Goal Management</h3>
              <p>Set and track short-term, mid-term, and long-term professional goals with detailed task breakdowns.</p>
            </div>
          </li>
          <li>
            <div class="feature-icon">📝</div>
            <div class="feature-content">
              <h3>Daily Log</h3>
              <p>Record daily professional accomplishments, reflections, and challenges in a structured journal format.</p>
            </div>
          </li>
          <li>
            <div class="feature-icon">📈</div>
            <div class="feature-content">
              <h3>Analytics</h3>
              <p>View performance insights and progress trends to optimize your professional development strategy.</p>
            </div>
          </li>
          <li>
            <div class="feature-icon">👥</div>
            <div class="feature-content">
              <h3>Professional Network</h3>
              <p>Connect with like-minded professionals and participate in career-focused events and discussions.</p>
            </div>
          </li>
          <li>
            <div class="feature-icon">👤</div>
            <div class="feature-content">
              <h3>Profile Management</h3>
              <p>Maintain a comprehensive professional profile with skills, education, certifications, and interests.</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="about-card">
        <h2 v-voix="'How It Works Section'">How JobTrek Works</h2>
        <ol class="workflow-list">
          <li>
            <h3>Set Your Goals</h3>
            <p>Define your professional goals for different timeframes: short-term (3-6 months), mid-term (6-18 months), and long-term (1.5-5 years).</p>
          </li>
          <li>
            <h3>Break Goals Into Tasks</h3>
            <p>Divide larger goals into actionable tasks that you can track and complete on a daily basis.</p>
          </li>
          <li>
            <h3>Track Daily Progress</h3>
            <p>Use the daily log to record your achievements, challenges, and reflections to maintain consistency.</p>
          </li>
          <li>
            <h3>Review and Analyze</h3>
            <p>Regularly check your analytics to understand performance patterns and optimize your approach.</p>
          </li>
          <li>
            <h3>Adjust and Improve</h3>
            <p>Based on insights and progress, refine your goals and strategies for continuous improvement.</p>
          </li>
        </ol>
      </div>

      <div class="about-card">
        <h2 v-voix="'Get Started Section'">Get Started Today</h2>
        <p>Begin your structured career development journey with JobTrek by completing the simple onboarding process. Set your initial goals, define your professional interests, and start tracking your daily progress toward career growth.</p>
        <div class="cta-buttons">
          <button 
            class="btn-primary"
            v-voix="'Start Onboarding Button'"
            hint="Begin the onboarding process"
          >
            Start Onboarding
          </button>
          <button 
            class="btn-secondary"
            v-voix="'Learn More Button'"
            hint="Get more information about JobTrek features"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
}

.about-header {
  text-align: center;
  margin-bottom: 2rem;
}

.about-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.subheading {
  color: #666;
  margin: 0;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.about-card h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.75rem;
}

.about-card p {
  line-height: 1.6;
  color: #444;
  margin-top: 0;
}

.features-list {
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.features-list li {
  display: flex;
  gap: 1rem;
}

.feature-icon {
  font-size: 2rem;
  min-width: 40px;
  text-align: center;
}

.feature-content h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.feature-content p {
  font-size: 0.95rem;
  margin: 0;
}

.workflow-list {
  padding-left: 1.5rem;
  margin: 0;
}

.workflow-list li {
  margin-bottom: 1.5rem;
}

.workflow-list li:last-child {
  margin-bottom: 0;
}

.workflow-list h3 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.workflow-list p {
  font-size: 0.95rem;
  margin: 0;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #3aa876;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .features-list {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
