<template>
  <div class="about-container">
    <div class="about-content">
      <h1 v-voix="'about-heading'">About Survey Architect</h1>
      
      <div class="about-section">
        <h2 v-voix="'about-overview-heading'">Overview</h2>
        <p v-voix="'about-overview-text'">
          Survey Architect is a powerful frontend-only survey design tool that enables researchers and survey creators to design sophisticated surveys with various question types, branching logic, and multi-language support—all without requiring a backend server.
        </p>
      </div>
      
      <div class="about-section">
        <h2 v-voix="'about-features-heading'">Key Features</h2>
        <ul>
          <li v-voix="'feature-editor'">Interactive drag-and-drop editor for easy survey design</li>
          <li v-voix="'feature-questions'">Multiple question types, including multiple choice, Likert scales, open text, and more</li>
          <li v-voix="'feature-logic'">Branching logic to create adaptive surveys based on responses</li>
          <li v-voix="'feature-i18n'">Built-in internationalization for creating multilingual surveys</li>
          <li v-voix="'feature-export'">Export as standalone HTML files that work without a server</li>
          <li v-voix="'feature-preview'">Real-time preview to test your survey design</li>
        </ul>
      </div>
      
      <div class="about-section">
        <h2 v-voix="'about-tech-heading'">Technology</h2>
        <p v-voix="'about-tech-text'">
          Survey Architect is built with Vue.js 3 using the Composition API. The application leverages modern web technologies to provide a smooth and responsive user experience:
        </p>
        <ul>
          <li v-voix="'tech-vue'">Vue.js 3 frontend framework</li>
          <li v-voix="'tech-i18n'">Vue I18n for internationalization</li>
          <li v-voix="'tech-drag'">Vue Draggable for drag-and-drop functionality</li>
          <li v-voix="'tech-export'">Browser APIs for generating downloadable HTML files</li>
        </ul>
      </div>
      
      <div class="about-section">
        <h2 v-voix="'about-usage-heading'">How It Works</h2>
        <ol>
          <li v-voix="'usage-step-1'">Design your survey in the interactive editor</li>
          <li v-voix="'usage-step-2'">Add questions, set up branching rules, and create translations</li>
          <li v-voix="'usage-step-3'">Preview your survey to test the user experience</li>
          <li v-voix="'usage-step-4'">Export as a standalone HTML file that works offline</li>
          <li v-voix="'usage-step-5'">Share the HTML file with respondents or host it on any web server</li>
        </ol>
      </div>
      
      <div class="about-section">
        <h2 v-voix="'about-accessibility-heading'">Accessibility</h2>
        <p v-voix="'about-accessibility-text'">
          Survey Architect is designed with accessibility in mind. All surveys follow WCAG 2.1 guidelines to ensure they're usable by everyone, including people with disabilities. The application and exported surveys support keyboard navigation, screen readers, and proper color contrast.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
}

.about-content {
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
}

h1 {
  font-size: 2.5rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.about-section {
  margin-bottom: var(--spacing-xl);
}

h2 {
  font-size: 1.5rem;
  color: var(--accent-color);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
}

p {
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

ul, ol {
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  color: var(--text-secondary);
  line-height: 1.7;
}

li {
  margin-bottom: var(--spacing-sm);
  position: relative;
}

li::marker {
  color: var(--accent-color);
}

ol li::marker {
  font-weight: 600;
}

@media (max-width: 768px) {
  .about-container {
    padding: var(--spacing-md);
  }
  
  .about-content {
    padding: var(--spacing-lg);
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  h2 {
    font-size: 1.25rem;
  }
}
</style>
