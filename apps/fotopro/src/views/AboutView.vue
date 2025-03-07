<script setup>
</script>

<template>
  <div class="about">
    <h1 v-voix="'about-heading'">About FotoPro Editor</h1>
    <div class="about-content">
      <section v-voix="'about-app-section'">
        <h2>About the Application</h2>
        <p>FotoPro Editor is a web-based photo organization and editing tool that allows you to easily manage your photo collection. With FotoPro, you can import photos, organize them into albums, add tags for easy searching, and apply various edits.</p>
      </section>
      
      <section v-voix="'features-section'">
        <h2>Features</h2>
        <ul>
          <li><strong>Photo Organization:</strong> Create albums and tags to keep your photos organized</li>
          <li><strong>Photo Editing:</strong> Adjust brightness, contrast, and saturation</li>
          <li><strong>Image Transformations:</strong> Rotate and flip your photos</li>
          <li><strong>Export Options:</strong> Save your edited photos in different formats (JPEG, PNG, WebP)</li>
          <li><strong>Batch Operations:</strong> Apply tags or add to albums in batch</li>
        </ul>
      </section>
      
      <section v-voix="'usage-section'">
        <h2>How to Use</h2>
        <ol>
          <li>Import photos using the upload button in the Library view</li>
          <li>Organize photos into albums or apply tags for categorization</li>
          <li>Click on a photo to open it in the editor</li>
          <li>Use the editing tools to enhance your photo</li>
          <li>Save your changes or export the final result</li>
        </ol>
      </section>
      
      <section v-voix="'technologies-section'">
        <h2>Technologies Used</h2>
        <ul>
          <li>Vue.js 3 with Composition API</li>
          <li>Pinia for state management</li>
          <li>Fabric.js for image editing canvas</li>
          <li>Vue Router for navigation</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.about-content {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
}

section {
  margin-bottom: 30px;
}

h2 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

ul, ol {
  padding-left: 20px;
}

li {
  margin-bottom: 10px;
}
</style>
