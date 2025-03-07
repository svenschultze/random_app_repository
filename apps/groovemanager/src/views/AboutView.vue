<template>
  <div class="about">
    <div class="about-content">
      <h1>About GrooveManager</h1>
      
      <section>
        <h2>Demo Music Library</h2>
        <p>GrooveManager is a front-end demo application that showcases how a music management interface works. It generates random music data on startup or on demand, giving you a fully populated library to explore without needing to upload your own files.</p>
      </section>
      
      <section>
        <h2>Features</h2>
        <ul>
          <li>Browse randomly generated artists, albums, and tracks</li>
          <li>Search and filter the music library</li>
          <li>Create custom playlists</li>
          <li>Simulated playback with player controls</li>
          <li>Responsive design that works on all devices</li>
        </ul>
      </section>
      
      <section>
        <h2>Demo Purpose</h2>
        <p>This application demonstrates UI/UX patterns for music streaming services without requiring real audio files or backend infrastructure. It's perfect for:</p>
        <ul>
          <li>Testing interface designs and user flows</li>
          <li>Demonstrating music app functionality to stakeholders</li>
          <li>Learning how music management apps are structured</li>
        </ul>
      </section>
      
      <section>
        <h2>Technology</h2>
        <p>Built with:</p>
        <ul>
          <li>Vue 3 with Composition API</li>
          <li>Pinia for state management</li>
          <li>Vue Router for navigation</li>
          <li>CSS with scoped styling</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding: 32px 24px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  margin-bottom: 32px;
  color: #bb86fc;
}

h2 {
  font-size: 1.5rem;
  margin: 24px 0 16px 0;
  color: #03dac6;
}

section {
  margin-bottom: 32px;
}

p {
  margin: 16px 0;
  line-height: 1.6;
}

ul {
  padding-left: 24px;
  margin: 16px 0;
}

li {
  margin-bottom: 8px;
  line-height: 1.6;
}

@media (min-width: 1024px) {
  .about {
    padding: 48px 32px;
  }
  
  h1 {
    font-size: 2.5rem;
  }
}
</style>
