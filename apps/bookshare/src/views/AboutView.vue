<template>
  <div class="about">
    <h1 v-voix="'about-title'">About BookShare</h1>
    
    <div class="about-content">
      <p>BookShare is a collaborative reading platform that allows users to read books together and share notes, highlights, and comments.</p>
      
      <h2>Features</h2>
      <ul>
        <li>Read digital books with a clean, distraction-free interface</li>
        <li>Highlight important passages with customizable colors</li>
        <li>Add comments and notes to share your thoughts</li>
        <li>View others' annotations and engage in discussion</li>
        <li>Track your reading progress across multiple books</li>
      </ul>
      
      <h2>How to Use</h2>
      <ol>
        <li>Browse the library on the home page</li>
        <li>Select a book to start reading</li>
        <li>Click and drag text to highlight or add comments</li>
        <li>Use the sidebar to view all annotations</li>
        <li>Participate in discussions with other readers</li>
      </ol>
      
      <div class="note">
        <h3>Note</h3>
        <p>This is a demo application. All books and annotations are stored locally on your device and no actual user accounts or online collaboration is implemented. The collaborative features are simulated for demonstration purposes.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

ul, ol {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.note {
  background-color: #f8f9fa;
  border-left: 4px solid #2c3e50;
  padding: 1rem 1.5rem;
  margin-top: 2rem;
  border-radius: 4px;
}

.note h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.note p {
  margin-bottom: 0;
}
</style>
