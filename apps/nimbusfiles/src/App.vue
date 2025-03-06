<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

// Reference to control upload modal visibility
const showUploadModal = ref(false)

// Toggle upload modal
const toggleUploadModal = () => {
  showUploadModal.value = !showUploadModal.value
}
</script>

<template>
  <div class="app-container">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <div class="logo-container">
        <img alt="Nimbus Files logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
        <h1 class="app-title">Nimbus Files</h1>
      </div>
      
      <div class="sidebar-actions">
        <button 
          class="upload-btn" 
          @click="toggleUploadModal" 
          v-voix="'Upload New File'"
          hint="Click to upload a new file to Nimbus Files">
          <span class="btn-icon">+</span> Upload File
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <RouterLink to="/" v-voix="'My Files'" hint="View all your files and folders">
          <span class="nav-icon">📁</span> My Files
        </RouterLink>
        <RouterLink to="/shared" v-voix="'Shared Files'" hint="View files shared with you">
          <span class="nav-icon">🔗</span> Shared
        </RouterLink>
        <RouterLink to="/trash" v-voix="'Trash'" hint="View recently deleted files">
          <span class="nav-icon">🗑️</span> Trash
        </RouterLink>
        <RouterLink to="/about" v-voix="'About'" hint="Learn about Nimbus Files">
          <span class="nav-icon">ℹ️</span> About
        </RouterLink>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <div class="top-bar">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Search files..." 
            class="search-input" 
            v-voix="'Search Files'"
            hint="Type to search for files by name">
        </div>
        <div class="user-menu">
          <span class="user-icon">👤</span>
          <span class="username">Demo User</span>
        </div>
      </div>
      
      <div class="content-area">
        <RouterView />
      </div>
    </main>
    
    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="modal-overlay">
      <div class="modal-container" v-voix="'Upload File Modal'" hint="Modal for uploading a new file">
        <div class="modal-header">
          <h2>Upload File</h2>
          <button 
            class="close-modal" 
            @click="toggleUploadModal"
            v-voix="'Close Upload Modal'"
            hint="Close the upload file dialog">×</button>
        </div>
        <div class="modal-body">
          <div class="upload-area" v-voix="'Drop Zone'" hint="Area to drop files for upload">
            <span class="upload-icon">📤</span>
            <p>Drag and drop files here or click to browse</p>
          </div>
          <div class="upload-actions">
            <button 
              class="browse-btn"
              v-voix="'Browse Files'"
              hint="Open file browser to select files for upload">Browse Files</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e9ecef;
  padding: 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.app-title {
  font-size: 1.25rem;
  margin-left: 0.5rem;
  font-weight: 600;
}

.sidebar-actions {
  margin-bottom: 2rem;
}

.upload-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn:hover {
  background-color: #3a56d4;
}

.btn-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  color: #495057;
  text-decoration: none;
  margin-bottom: 0.5rem;
}

.sidebar-nav a:hover {
  background-color: #e9ecef;
}

.sidebar-nav a.router-link-active {
  background-color: #e9ecef;
  font-weight: 500;
}

.nav-icon {
  margin-right: 0.75rem;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e9ecef;
  background-color: white;
}

.search-container {
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.9rem;
}

.user-menu {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
}

.username {
  font-weight: 500;
}

.content-area {
  flex: 1;
  padding: 1.5rem 2rem;
  overflow-y: auto;
  background-color: #f8f9fa;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.upload-area {
  border: 2px dashed #ced4da;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  cursor: pointer;
}

.upload-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.upload-actions {
  display: flex;
  justify-content: center;
}

.browse-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.browse-btn:hover {
  background-color: #3a56d4;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }
  
  .sidebar-nav {
    flex-direction: row;
    overflow-x: auto;
    margin-bottom: 0.5rem;
  }
  
  .sidebar-nav a {
    white-space: nowrap;
  }
  
  .main-content {
    height: calc(100vh - 200px);
  }
}
</style>
