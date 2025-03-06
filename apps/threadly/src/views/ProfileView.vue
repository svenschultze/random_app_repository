<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import ThreadItem from '../components/ThreadItem.vue';
import store from '../store';
import { getUserThreads, getTimeSince } from '../services/mockData';

const route = useRoute();
const router = useRouter();

const userId = computed(() => route.params.id);
const activeTab = ref('threads');

const user = computed(() => {
  return store.state.mockData.users.find(u => u.id === userId.value);
});

const userThreads = computed(() => {
  if (!user.value) return [];
  
  const threads = getUserThreads(store.state.mockData.threads, userId.value);
  // Sort by timestamp (newest first)
  return threads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

const isCurrentUser = computed(() => {
  return user.value?.id === store.state.mockData.currentUser.id;
});

const joinDate = computed(() => {
  if (!user.value?.joinDate) return '';
  const date = new Date(user.value.joinDate);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

function goBack() {
  router.go(-1);
}

function toggleFollow() {
  store.toggleFollow(userId.value);
}

function setActiveTab(tab) {
  activeTab.value = tab;
}
</script>

<template>
  <AppLayout>
    <div class="profile-view">
      <div class="profile-view__header">
        <button 
          class="profile-view__back-btn" 
          @click="goBack"
          v-voix="'Go back'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="profile-view__header-title">
          <h1 v-voix="'Profile of ' + (user?.displayName || 'User')">{{ user?.displayName || 'User' }}</h1>
          <span class="profile-view__thread-count">{{ userThreads.length }} threads</span>
        </div>
      </div>
      
      <div v-if="!user" class="profile-view__not-found">
        <p>User not found</p>
        <button 
          class="profile-view__back-to-home" 
          @click="router.push({ name: 'home' })"
          v-voix="'Back to home'"
        >
          Back to Home
        </button>
      </div>
      
      <div v-else class="profile-view__content">
        <div class="profile-view__banner"></div>
        
        <div class="profile-view__profile-header">
          <div class="profile-view__avatar">
            <img :src="user.avatar" :alt="user.username" v-voix="'Profile avatar'" />
          </div>
          
          <div class="profile-view__profile-actions">
            <button 
              v-if="!isCurrentUser" 
              :class="['profile-view__follow-btn', { 'profile-view__follow-btn--following': user.isFollowedByCurrentUser }]" 
              @click="toggleFollow"
              v-voix="user.isFollowedByCurrentUser ? 'Unfollow' : 'Follow'"
            >
              {{ user.isFollowedByCurrentUser ? 'Following' : 'Follow' }}
            </button>
            
            <button 
              v-if="isCurrentUser" 
              class="profile-view__edit-btn"
              v-voix="'Edit profile'"
            >
              Edit profile
            </button>
          </div>
          
          <div class="profile-view__profile-info">
            <h2 class="profile-view__display-name">{{ user.displayName }}</h2>
            <div class="profile-view__username">@{{ user.username }}</div>
            
            <div class="profile-view__bio">
              {{ user.bio }}
            </div>
            
            <div class="profile-view__join-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Joined {{ joinDate }}</span>
            </div>
            
            <div class="profile-view__stats">
              <div class="profile-view__stat">
                <span class="profile-view__stat-value">{{ user.following }}</span>
                <span class="profile-view__stat-label">Following</span>
              </div>
              <div class="profile-view__stat">
                <span class="profile-view__stat-value">{{ user.followers }}</span>
                <span class="profile-view__stat-label">Followers</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile-view__tabs">
          <button 
            :class="['profile-view__tab', { 'profile-view__tab--active': activeTab === 'threads' }]" 
            @click="setActiveTab('threads')"
            v-voix="'Threads tab'"
          >
            Threads
          </button>
          <button 
            :class="['profile-view__tab', { 'profile-view__tab--active': activeTab === 'likes' }]" 
            @click="setActiveTab('likes')"
            v-voix="'Likes tab'"
          >
            Likes
          </button>
        </div>
        
        <div v-if="activeTab === 'threads'" class="profile-view__threads">
          <div v-if="userThreads.length === 0" class="profile-view__empty">
            <p>No threads yet</p>
          </div>
          
          <ThreadItem 
            v-for="thread in userThreads" 
            :key="thread.id" 
            :thread="thread" 
          />
        </div>
        
        <div v-if="activeTab === 'likes'" class="profile-view__likes">
          <div class="profile-view__empty">
            <p>This is a demo feature. Liked threads are not tracked in this demo.</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.profile-view {
  width: 100%;
}

.profile-view__header {
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  z-index: 10;
  display: flex;
  align-items: center;
}

.profile-view__back-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--color-text);
  transition: background-color 0.2s;
}

.profile-view__back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.profile-view__header-title {
  display: flex;
  flex-direction: column;
}

.profile-view__header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.profile-view__thread-count {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.profile-view__not-found {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

.profile-view__back-to-home {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
}

.profile-view__banner {
  height: 150px;
  background-color: #1da1f2;
  background-image: linear-gradient(45deg, #1da1f2, #0d8fd8);
}

.profile-view__profile-header {
  padding: 0 1rem;
  margin-bottom: 1rem;
  position: relative;
}

.profile-view__avatar {
  margin-top: -60px;
  margin-bottom: 1rem;
}

.profile-view__avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  background-color: white;
  object-fit: cover;
}

.profile-view__profile-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.profile-view__follow-btn,
.profile-view__edit-btn {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.profile-view__follow-btn {
  background-color: #000;
  color: white;
  border: none;
}

.profile-view__follow-btn--following {
  background-color: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.profile-view__edit-btn {
  background-color: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.profile-view__edit-btn:hover,
.profile-view__follow-btn--following:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.profile-view__profile-info {
  margin-bottom: 1rem;
}

.profile-view__display-name {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.25rem;
}

.profile-view__username {
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.profile-view__bio {
  margin-bottom: 0.75rem;
  white-space: pre-line;
}

.profile-view__join-date {
  display: flex;
  align-items: center;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.profile-view__join-date svg {
  margin-right: 0.5rem;
}

.profile-view__stats {
  display: flex;
  margin-top: 0.75rem;
}

.profile-view__stat {
  margin-right: 1.5rem;
  display: flex;
}

.profile-view__stat-value {
  font-weight: 700;
  margin-right: 0.25rem;
}

.profile-view__stat-label {
  color: var(--color-text-muted);
}

.profile-view__tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.profile-view__tab {
  flex: 1;
  text-align: center;
  padding: 1rem;
  background: none;
  border: none;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.profile-view__tab--active {
  color: var(--color-text);
}

.profile-view__tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: #1da1f2;
  border-radius: 4px 4px 0 0;
}

.profile-view__empty {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

/* For dark mode */
:root[data-theme="dark"] .profile-view__header {
  background-color: rgba(21, 32, 43, 0.9);
}

:root[data-theme="dark"] .profile-view__back-btn:hover,
:root[data-theme="dark"] .profile-view__edit-btn:hover,
:root[data-theme="dark"] .profile-view__follow-btn--following:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

:root[data-theme="dark"] .profile-view__avatar img {
  border-color: #15202b;
  background-color: #15202b;
}
</style>