<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { chatStore } from '../store'
import EmptyState from '../components/common/EmptyState.vue'

const router = useRouter()
const searchQuery = ref('')
const sortBy = ref('recent') // recent, name

const chats = computed(() => {
  const allChats = chatStore.getState().chats
  
  // Filter by search query
  let filteredChats = allChats
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filteredChats = allChats.filter(chat => 
      chat.peer.name.toLowerCase().includes(query) || 
      (chat.lastMessage && chat.lastMessage.content.toLowerCase().includes(query))
    )
  }
  
  // Sort chats
  if (sortBy.value === 'recent') {
    return [...filteredChats].sort((a, b) => {
      const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : new Date(a.createdAt).getTime()
      const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : new Date(b.createdAt).getTime()
      return bTime - aTime // newest first
    })
  } else if (sortBy.value === 'name') {
    return [...filteredChats].sort((a, b) => 
      a.peer.name.localeCompare(b.peer.name)
    )
  }
  
  return filteredChats
})

const navigateToChat = (chatId) => {
  router.push(`/chat/${chatId}`)
}

const navigateToPairing = () => {
  router.push('/pairing')
}

const getTimeDisplay = (timestamp) => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp)
  const now = new Date()
  
  // Today, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  // This week, show day
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (diff < 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  }
  
  // Otherwise, show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

onMounted(() => {
  // Initialize chats from local storage if needed
  if (!chatStore.getState().chats || chatStore.getState().chats.length === 0) {
    // We'll let the empty state handle this
  }
})
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="title" v-voix="'dashboard-title'">Chats</h1>
      
      <div class="dashboard-actions">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search chats..." 
            class="search-input"
            v-voix="'search-chats-input'"
            hint="Search for chats by name or message content"
          />
          <span class="material-symbols-outlined search-icon">search</span>
        </div>
        
        <div class="sort-container">
          <select 
            v-model="sortBy" 
            class="sort-select"
            v-voix="'sort-chats-select'"
            hint="Choose how to sort your chats"
          >
            <option value="recent">Recent</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="chats-list">
      <template v-if="chats.length > 0">
        <div 
          v-for="chat in chats" 
          :key="chat.id" 
          class="chat-item" 
          @click="navigateToChat(chat.id)"
          v-voix="'chat-item-' + chat.id"
          :hint="`Chat with ${chat.peer.name}. ${chat.unreadCount > 0 ? chat.unreadCount + ' unread messages.' : ''} ${chat.lastMessage ? 'Last message: ' + chat.lastMessage.content : ''}`"
        >
          <div class="chat-avatar">
            <img v-if="chat.peer.avatar" :src="chat.peer.avatar" alt="Contact avatar" />
            <span v-else class="material-symbols-outlined">person</span>
          </div>
          
          <div class="chat-details">
            <div class="chat-header">
              <h3 class="chat-name">{{ chat.peer.name }}</h3>
              <span class="chat-time">{{ chat.lastMessage ? getTimeDisplay(chat.lastMessage.timestamp) : getTimeDisplay(chat.createdAt) }}</span>
            </div>
            
            <div class="chat-preview">
              <p class="chat-message">
                {{ chat.lastMessage ? chat.lastMessage.content : 'No messages yet' }}
              </p>
              
              <div v-if="chat.unreadCount > 0" class="unread-badge">
                {{ chat.unreadCount }}
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <EmptyState 
        v-else 
        title="No Chats Yet"
        description="Connect with others to start chatting in a secure, peer-to-peer environment."
        icon="chat"
      >
        <button 
          class="btn-primary" 
          @click="navigateToPairing"
          v-voix="'start-new-chat-button'"
          hint="Start connecting with others"
        >
          Connect with Someone
        </button>
      </EmptyState>
    </div>
    
    <button 
      class="fab" 
      @click="navigateToPairing"
      v-voix="'new-connection-button'"
      hint="Create a new connection"
    >
      <span class="material-symbols-outlined">add</span>
    </button>
  </div>
</template>

<style scoped>
.dashboard-container {
  position: relative;
  padding: 1rem;
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.dashboard-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-container {
  position: relative;
  flex: 1;
}

.search-input {
  padding-right: 2.5rem;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.sort-container {
  width: 100%;
}

.sort-select {
  width: 100%;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

.chats-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat-item {
  display: flex;
  padding: 1rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.chat-item:hover {
  background-color: var(--light-bg);
  transform: translateY(-2px);
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--light-bg);
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-details {
  flex: 1;
  min-width: 0; /* for proper truncating */
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.chat-name {
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  margin-left: 0.5rem;
}

.chat-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-message {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
}

.unread-badge {
  background-color: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

.fab {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: transform 0.3s, background-color 0.3s;
}

.fab:hover, .fab:focus {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.fab .material-symbols-outlined {
  font-size: 24px;
  color: white;
}

@media (min-width: 768px) {
  .dashboard-container {
    padding: 2rem;
  }
  
  .dashboard-actions {
    flex-direction: row;
  }
  
  .sort-container {
    width: auto;
    min-width: 150px;
  }
  
  .fab {
    right: 2.5rem;
    bottom: 2.5rem;
  }
}
</style>