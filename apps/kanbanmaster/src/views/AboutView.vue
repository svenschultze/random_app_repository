<script setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="about-view">
    <AppHeader />
    
    <main class="main-content">
      <div class="about-container">
        <h2 class="about-title">About KanbanMaster</h2>
        
        <div class="about-section">
          <h3>What is KanbanMaster?</h3>
          <p>
            KanbanMaster is a demonstration application designed to showcase how a Kanban-based project management tool can work without requiring a backend server.
          </p>
          <p>
            This application generates random demo data to populate multiple Kanban boards so you can immediately experience the functionality without needing to set everything up from scratch.
          </p>
        </div>
        
        <div class="about-section">
          <h3>Features</h3>
          <ul class="features-list">
            <li>
              <div class="feature-title">Multiple Project Management</div>
              <div class="feature-desc">Create and manage multiple projects, each with its own Kanban board</div>
            </li>
            <li>
              <div class="feature-title">Customizable Columns</div>
              <div class="feature-desc">Add, edit, reorder, and remove columns to match your workflow</div>
            </li>
            <li>
              <div class="feature-title">Drag and Drop Interface</div>
              <div class="feature-desc">Intuitively move tasks between columns with a simple drag and drop</div>
            </li>
            <li>
              <div class="feature-title">Task Management</div>
              <div class="feature-desc">Create, edit, and delete tasks with detailed information</div>
            </li>
            <li>
              <div class="feature-title">Filtering and Searching</div>
              <div class="feature-desc">Quickly find tasks with filters for priority, assignee, and labels</div>
            </li>
            <li>
              <div class="feature-title">Dark Mode Support</div>
              <div class="feature-desc">Switch between light and dark themes based on your preference</div>
            </li>
            <li>
              <div class="feature-title">Local Storage</div>
              <div class="feature-desc">Your data is saved in your browser's local storage, so you can return later</div>
            </li>
            <li>
              <div class="feature-title">Demo Data Generator</div>
              <div class="feature-desc">Generate new random projects and tasks with a single click</div>
            </li>
          </ul>
        </div>
        
        <div class="about-section">
          <h3>How It Works</h3>
          <p>
            KanbanMaster is built as a single-page application using Vue.js. All data is stored in your browser's local storage, so there's no need for a server or database connection.
          </p>
          <p>
            When you first load the application, it automatically generates random demo projects and tasks so you can immediately start exploring the functionality.
          </p>
          <p>
            You can regenerate the demo data at any time by clicking the "Regenerate Demo Data" button in the header or in the Settings page.
          </p>
        </div>
        
        <div class="about-section">
          <h3>Technology Stack</h3>
          <ul>
            <li>Vue.js 3 with Composition API</li>
            <li>Vue Router for navigation</li>
            <li>Vuedraggable for drag-and-drop functionality</li>
            <li>CSS variables for theming</li>
            <li>Browser LocalStorage API for data persistence</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.about-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.about-container {
  max-width: 800px;
  margin: 0 auto;
}

.about-title {
  margin: 0 0 2rem 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
}

.about-section {
  margin-bottom: 3rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
}

.about-section h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.about-section p {
  margin-bottom: 1rem;
  line-height: 1.6;
  font-size: 1rem;
  color: var(--text-color);
}

.about-section p:last-child {
  margin-bottom: 0;
}

.about-section ul {
  padding-left: 1.25rem;
  margin-bottom: 0;
}

.about-section li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
  color: var(--text-color);
}

.features-list {
  list-style: none;
  padding: 0;
}

.features-list li {
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.features-list li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.feature-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-size: 1.1rem;
}

.feature-desc {
  color: var(--text-color);
  opacity: 0.9;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem;
  }
  
  .about-section {
    padding: 1.25rem;
  }
}
</style>
