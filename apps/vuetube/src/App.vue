<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { currentUser } from './stores/videoStore'

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      path: '/search', 
      query: { q: searchQuery.value.trim() } 
    })
  }
}
</script>

<template>
  <div class="app-container">
    <header class="header">
      <div class="logo-container">
        <RouterLink to="/" v-voix="'Home'" hint="Return to homepage">
          <div class="logo">
            <span class="vue">Vue</span><span class="tube">Tube</span>
          </div>
        </RouterLink>
      </div>

      <div class="search-container">
        <form @submit.prevent="handleSearch" class="search-form">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search videos" 
            class="search-input"
            v-voix="'SearchInput'"
            hint="Enter keywords to search for videos"
          />
          <button 
            type="submit" 
            class="search-button"
            v-voix="'SearchButton'"
            hint="Click to search for videos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </form>
      </div>

      <div class="nav-actions">
        <RouterLink 
          to="/upload" 
          class="upload-btn"
          v-voix="'UploadVideo'"
          hint="Upload a new video"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6z"/>
          </svg>
        </RouterLink>
        
        <RouterLink 
          :to="`/channel/${currentUser.id}`" 
          class="profile-link"
          v-voix="'UserProfile'"
          hint="Go to your channel page"
        >
          <img 
            :src="currentUser.profilePicture" 
            class="profile-pic" 
            :alt="currentUser.name"
          />
        </RouterLink>
      </div>
    </header>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #0f0f0f;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.vue {
  color: #41b883;
}

.tube {
  color: #ff0000;
}

.search-container {
  flex: 1;
  max-width: 600px;
  margin: 0 2rem;
}

.search-form {
  display: flex;
  width: 100%;
}

.search-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-right: none;
  border-radius: 2px 0 0 2px;
  font-size: 1rem;
}

.search-button {
  background-color: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 0 2px 2px 0;
  padding: 0 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.search-button:hover {
  background-color: #f0f0f0;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.upload-btn {
  color: #606060;
  display: flex;
  align-items: center;
}

.upload-btn:hover {
  color: #0f0f0f;
}

.profile-link {
  display: flex;
  align-items: center;
}

.profile-pic {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.main-content {
  flex: 1;
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}

@media (max-width: 768px) {
  .header {
    padding: 0.5rem;
  }
  
  .search-container {
    margin: 0 0.5rem;
  }
  
  .logo-container {
    margin-right: 0.5rem;
  }
}

@media (max-width: 480px) {
  .search-container {
    max-width: none;
    margin: 0 0.5rem;
  }
}
</style>
