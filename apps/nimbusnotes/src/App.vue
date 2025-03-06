<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="app-container">
    <!-- Sidebar Navigation -->
    <aside class="sidebar" :class="{ 'collapsed': !isSidebarOpen }">
      <div class="sidebar-header">
        <img alt="NimbusNotes logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
        <h1 class="app-title">NimbusNotes</h1>
        <button 
          class="toggle-sidebar" 
          @click="toggleSidebar" 
          v-voix="'Toggle Sidebar'" 
          hint="Click to hide or show the sidebar menu">
          ≡
        </button>
      </div>

      <nav class="sidebar-nav">
        <RouterLink to="/" v-voix="'Home Dashboard'" hint="Go to main dashboard with recent notes">
          <span class="icon">🏠</span>
          <span class="link-text">Home</span>
        </RouterLink>
        <RouterLink to="/notes" v-voix="'All Notes'" hint="View all your notes organized by folders">
          <span class="icon">📝</span>
          <span class="link-text">Notes</span>
        </RouterLink>
        <RouterLink to="/search" v-voix="'Search Notes'" hint="Search and filter through your notes">
          <span class="icon">🔍</span>
          <span class="link-text">Search</span>
        </RouterLink>
        <RouterLink to="/tags" v-voix="'Tags Manager'" hint="Manage your note categories and tags">
          <span class="icon">🏷️</span>
          <span class="link-text">Tags</span>
        </RouterLink>
        <RouterLink to="/calendar" v-voix="'Calendar View'" hint="View notes in calendar and timeline view">
          <span class="icon">📅</span>
          <span class="link-text">Calendar</span>
        </RouterLink>
        <RouterLink to="/share" v-voix="'Share and Collaborate'" hint="Share notes and collaborate with others">
          <span class="icon">👥</span>
          <span class="link-text">Share</span>
        </RouterLink>
        <RouterLink to="/settings" v-voix="'Settings'" hint="Customize your NimbusNotes experience">
          <span class="icon">⚙️</span>
          <span class="link-text">Settings</span>
        </RouterLink>
        <RouterLink to="/about" v-voix="'About NimbusNotes'" hint="Learn about the app and its features">
          <span class="icon">ℹ️</span>
          <span class="link-text">About</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <button 
          class="new-note-button" 
          @click="$router.push('/notes/new')" 
          v-voix="'Create New Note'" 
          hint="Click to create a new note">
          <span class="icon">➕</span>
          <span class="button-text">New Note</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content" :class="{ 'expanded': !isSidebarOpen }">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.sidebar {
  display: flex;
  flex-direction: column;
  width: 250px;
  background-color: var(--color-background-soft);
  border-right: 1px solid var(--color-border);
  transition: width 0.3s ease;
  height: 100%;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.logo {
  width: 40px;
  height: 40px;
}

.app-title {
  margin-left: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.3s ease;
}

.toggle-sidebar {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text);
}

.sidebar-nav {
  flex-grow: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 4px;
  margin: 0.25rem 0.5rem;
  transition: background-color 0.3s ease;
}

.sidebar-nav a:hover {
  background-color: var(--color-background-mute);
}

.sidebar-nav a.router-link-active {
  background-color: var(--color-background-mute);
  font-weight: 600;
}

.icon {
  font-size: 1.2rem;
  margin-right: 0.75rem;
  width: 24px;
  text-align: center;
}

.link-text {
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .link-text,
.sidebar.collapsed .app-title {
  opacity: 0;
  width: 0;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.new-note-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  background-color: #4169E1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.button-text {
  margin-left: 0.5rem;
  transition: opacity 0.3s ease;
}

.sidebar.collapsed .button-text {
  opacity: 0;
  width: 0;
}

.new-note-button:hover {
  background-color: #3451B2;
}

.main-content {
  flex-grow: 1;
  padding: 1.5rem;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
}

.main-content.expanded {
  margin-left: 0;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 10;
    height: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar.collapsed {
    transform: translateX(-100%);
  }
  
  .main-content {
    margin-left: 0;
  }
}
</style>
