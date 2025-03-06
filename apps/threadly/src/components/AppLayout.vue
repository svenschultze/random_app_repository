<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '../store';

const router = useRouter();
const route = useRoute();

const currentUser = computed(() => store.state.mockData.currentUser);
const unreadNotifications = computed(() => {
  return store.state.mockData.notifications.filter(n => !n.isRead).length;
});

function navigateTo(routeName, params = {}) {
  if (routeName === 'refresh') {
    store.refreshMockData();
    return;
  }
  
  router.push({ name: routeName, params });
}

const activeRoute = computed(() => route.name);
</script>

<template>
  <div class="app-layout">
    <aside class="app-layout__sidebar">
      <div class="app-layout__logo">
        <div class="app-layout__logo-icon">
          <span>T</span>
        </div>
        <h1 class="app-layout__logo-text">Threadly</h1>
      </div>
      
      <nav class="app-layout__nav">
        <button 
          :class="['app-layout__nav-item', { 'app-layout__nav-item--active': activeRoute === 'home' }]" 
          @click="navigateTo('home')"
          v-voix="'Navigate to Home'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </button>
        
        <button 
          :class="['app-layout__nav-item', { 'app-layout__nav-item--active': activeRoute === 'explore' }]" 
          @click="navigateTo('explore')"
          v-voix="'Navigate to Explore'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Explore</span>
        </button>
        
        <button 
          :class="['app-layout__nav-item', { 'app-layout__nav-item--active': activeRoute === 'notifications' }]" 
          @click="navigateTo('notifications')"
          v-voix="'Navigate to Notifications'"
        >
          <div class="app-layout__nav-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span v-if="unreadNotifications > 0" class="app-layout__notification-badge">{{ unreadNotifications }}</span>
          </div>
          <span>Notifications</span>
        </button>
        
        <button 
          :class="['app-layout__nav-item', { 'app-layout__nav-item--active': activeRoute === 'profile' && route.params.id === currentUser.id }]" 
          @click="navigateTo('profile', { id: currentUser.id })"
          v-voix="'Navigate to Profile'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Profile</span>
        </button>
        
        <button 
          :class="['app-layout__nav-item', { 'app-layout__nav-item--active': activeRoute === 'settings' }]" 
          @click="navigateTo('settings')"
          v-voix="'Navigate to Settings'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span>Settings</span>
        </button>
        
        <button 
          class="app-layout__nav-item app-layout__nav-item--refresh"
          @click="navigateTo('refresh')"
          v-voix="'Refresh mock data'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
          <span>Refresh Data</span>
        </button>
        
        <button 
          class="app-layout__post-btn" 
          @click="navigateTo('compose')"
          v-voix="'Compose new thread'"
        >
          <span>Post</span>
        </button>
      </nav>
      
      <div class="app-layout__user-menu">
        <div 
          class="app-layout__user-info" 
          @click="navigateTo('profile', { id: currentUser.id })"
          v-voix="'View your profile'"
        >
          <img :src="currentUser.avatar" :alt="currentUser.username" />
          <div class="app-layout__user-details">
            <div class="app-layout__user-name">{{ currentUser.displayName }}</div>
            <div class="app-layout__user-username">@{{ currentUser.username }}</div>
          </div>
        </div>
      </div>
    </aside>
    
    <main class="app-layout__main">
      <slot></slot>
    </main>
    
    <aside class="app-layout__trends">
      <div class="app-layout__trends-header">
        <h2>What's happening</h2>
      </div>
      
      <div class="app-layout__trends-list">
        <div 
          v-for="topic in store.state.mockData.trendingTopics.slice(0, 5)" 
          :key="topic.id" 
          class="app-layout__trend-item"
          v-voix="'Trending topic: ' + topic.name"
        >
          <div class="app-layout__trend-name">{{ topic.name }}</div>
          <div class="app-layout__trend-count">{{ topic.postCount }} posts</div>
        </div>
      </div>
      
      <div class="app-layout__demo-note">
        <p>
          <strong>Note:</strong> This is a demo app with randomly generated data. Each time you refresh the data, new content is created.
        </p>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.app-layout {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
}

@media (min-width: 768px) {
  .app-layout {
    grid-template-columns: 275px 1fr;
  }
}

@media (min-width: 1200px) {
  .app-layout {
    grid-template-columns: 275px 1fr 350px;
  }
}

.app-layout__sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-right: 1px solid var(--color-border);
}

.app-layout__logo {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1.5rem;
}

.app-layout__logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1da1f2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.app-layout__logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
}

.app-layout__nav {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.app-layout__nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: 9999px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: none;
  color: var(--color-text);
  transition: background-color 0.2s;
  text-align: left;
}

.app-layout__nav-item svg {
  margin-right: 1rem;
}

.app-layout__nav-item:hover {
  background-color: rgba(29, 161, 242, 0.1);
}

.app-layout__nav-item--active {
  color: #1da1f2;
  font-weight: 700;
}

.app-layout__nav-icon-wrapper {
  position: relative;
  margin-right: 1rem;
}

.app-layout__notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #1da1f2;
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.app-layout__post-btn {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 9999px;
  background-color: #1da1f2;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.app-layout__post-btn:hover {
  background-color: #1a91da;
}

.app-layout__user-menu {
  margin-top: auto;
  padding-top: 1rem;
}

.app-layout__user-info {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.app-layout__user-info:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.app-layout__user-info img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.75rem;
  object-fit: cover;
}

.app-layout__user-details {
  overflow: hidden;
}

.app-layout__user-name {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-layout__user-username {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-layout__main {
  border-right: 1px solid var(--color-border);
  min-height: 100vh;
}

.app-layout__trends {
  padding: 1rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  display: none;
}

@media (min-width: 1200px) {
  .app-layout__trends {
    display: block;
  }
}

.app-layout__trends-header {
  padding: 0.75rem 1rem;
  font-weight: 800;
  font-size: 1.2rem;
}

.app-layout__trends-list {
  background-color: #f7f9fa;
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.app-layout__trend-item {
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.app-layout__trend-item:last-child {
  border-bottom: none;
}

.app-layout__trend-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.app-layout__trend-name {
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.app-layout__trend-count {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.app-layout__demo-note {
  background-color: #f7f9fa;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

/* Mobile navigation for smaller screens */
@media (max-width: 767px) {
  .app-layout__sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    height: auto;
    z-index: 10;
    flex-direction: row;
    justify-content: space-around;
    padding: 0.5rem;
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .app-layout__logo, 
  .app-layout__user-menu,
  .app-layout__nav-item span {
    display: none;
  }
  
  .app-layout__nav {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
  
  .app-layout__nav-item {
    padding: 0.5rem;
    margin: 0;
  }
  
  .app-layout__nav-item svg {
    margin-right: 0;
  }
  
  .app-layout__post-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  
  .app-layout__post-btn span {
    display: none;
  }
  
  .app-layout__post-btn::before {
    content: '+';
    font-size: 1.5rem;
  }
  
  .app-layout__nav-icon-wrapper {
    margin-right: 0;
  }
}

/* Dark mode styles */
:root[data-theme="dark"] .app-layout__trends-list,
:root[data-theme="dark"] .app-layout__demo-note {
  background-color: #192734;
}

:root[data-theme="dark"] .app-layout__trend-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .app-layout__trend-item:hover,
:root[data-theme="dark"] .app-layout__nav-item:hover,
:root[data-theme="dark"] .app-layout__user-info:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

@media (max-width: 767px) {
  :root[data-theme="dark"] .app-layout__sidebar {
    background-color: #15202b;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  }
}
</style>