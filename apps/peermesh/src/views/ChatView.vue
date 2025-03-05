<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { chatStore, connectionStore } from '../store'
import p2pService from '../services/p2pService'
import MessageBubble from '../components/chat/MessageBubble.vue'
import EmptyState from '../components/common/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const messageInput = ref('')
const messagesEndRef = ref(null)
const isSending = ref(false)
const localId = p2pService.localId
const currentChat = ref(null)
const messages = ref([])

// Get chat ID from route
const chatId = computed(() => route.params.id)

// Set up a subscription to the chat store
const updateChat = () => {
  const foundChat = chatStore.getState().chats.find(c => c.id === chatId.value)
  if (foundChat) {
    currentChat.value = foundChat
    messages.value = [...foundChat.messages]
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// Subscribe to store changes
const unsubscribeChat = chatStore.subscribe(updateChat)

// Get chat data (for reactivity with the template)
const chat = computed(() => currentChat.value)

// Check if there's a connection to this peer
const isConnected = computed(() => {
  if (!chat.value) return false
  
  const connections = connectionStore.getState().connections
  return connections[chat.value.peer.id] ? connections[chat.value.peer.id].connected : false
})

// Set active chat
onMounted(() => {
  if (chatId.value) {
    chatStore.getState().setActiveChat(chatId.value)
  }
  
  // Initialize the chat immediately
  updateChat()
  
  scrollToBottom()
  
  // If chat not found, go back to dashboard
  if (!chat.value) {
    router.push('/dashboard')
  }
})

// Clear active chat on leave
onBeforeUnmount(() => {
  chatStore.setState({ activeChat: null })
  unsubscribeChat() // Unsubscribe from the store
})

// Send message
const sendMessage = async () => {
  if (!messageInput.value.trim()) return
  
  isSending.value = true
  
  try {
    // We removed the isConnected check since we're in demo mode
    const result = p2pService.sendMessage(chat.value.peer.id, messageInput.value)
    
    if (result) {
      messageInput.value = ''
      await nextTick()
      scrollToBottom()
      
      // After a short delay, scroll again to account for demo responses
      setTimeout(() => {
        scrollToBottom()
      }, 1500)
    }
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    isSending.value = false
  }
}

// Scroll to bottom of messages
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesEndRef.value) {
      messagesEndRef.value.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

// Go back to the dashboard
const goBack = () => {
  router.push('/dashboard')
}

// Reconnect to peer
const reconnect = () => {
  if (!chat.value) return
  
  router.push({
    name: 'pairing',
    query: { peerId: chat.value.peer.id }
  })
}

// Check if a message is from the current user
const isOwnMessage = (message) => {
  return message.senderId === 'local-user' || message.senderId === localId
}
</script>

<template>
  <div class="chat-view">
    <header class="chat-header">
      <button 
        class="back-button" 
        @click="goBack"
        v-voix="'back-to-dashboard-button'"
        hint="Return to the chat list"
      >
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      
      <div class="peer-info">
        <div v-if="chat" class="peer-avatar">
          <img v-if="chat.peer.avatar" :src="chat.peer.avatar" alt="Contact avatar" />
          <span v-else class="material-symbols-outlined">person</span>
        </div>
        
        <div class="peer-details">
          <h2 class="peer-name">{{ chat ? chat.peer.name : 'Chat' }}</h2>
          <div class="connection-status" :class="{ 'connected': isConnected }">
            {{ isConnected ? 'Connected' : 'Disconnected' }}
          </div>
        </div>
      </div>
    </header>
    
    <main class="chat-messages">
      <template v-if="chat && messages.length > 0">
        <div class="messages-container">
          <p v-voix:hidden="'message-history'">{{ JSON.stringify(messages) }}</p>
          <MessageBubble 
            v-for="message in messages" 
            :key="message.id" 
            :message="message" 
            :isOwn="isOwnMessage(message)"
            :aria-label="isOwnMessage(message) ? 'You: ' + message.content : 'Them: ' + message.content"
          />
          <div ref="messagesEndRef"></div>
        </div>
      </template>
      
      <EmptyState 
        v-else-if="chat" 
        title="No Messages Yet"
        description="Send a message to start the conversation."
        icon="chat_bubble_outline"
      />
      
      <EmptyState
        v-else
        title="Chat Not Found"
        description="This chat doesn't exist or was deleted."
        icon="error_outline"
      >
        <button 
          class="btn-primary" 
          @click="goBack"
          v-voix="'return-to-dashboard-button'"
          hint="Return to the dashboard"
        >
          Return to Dashboard
        </button>
      </EmptyState>
    </main>
    
    <!-- Reconnect banner disabled for demo mode 
    <div v-if="!isConnected && chat" class="reconnect-banner">
      <span>You're currently disconnected from this contact.</span>
      <button 
        class="btn-secondary reconnect-button" 
        @click="reconnect"
        v-voix="'reconnect-button'"
        hint="Reconnect to this contact"
      >
        Reconnect
      </button>
    </div>
    -->
    
    <footer v-if="chat" class="chat-input-container">
      <form @submit.prevent="sendMessage" class="message-form">
        <input 
          v-model="messageInput" 
          type="text" 
          placeholder="Type a message..." 
          :disabled="isSending"
          class="message-input"
          v-voix="'message-input'"
          hint="Type your message here"
        />
        
        <button 
          type="submit" 
          class="send-button" 
          :disabled="!messageInput.trim() || isSending"
          v-voix="'send-message-button'"
          hint="Send your message"
        >
          <span class="material-symbols-outlined">send</span>
        </button>
      </form>
    </footer>
  </div>
</template>

<style scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

.chat-header {
  background-color: white;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 2;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background-color: var(--light-bg);
}

.peer-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.peer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--light-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 0.75rem;
}

.peer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.peer-details {
  display: flex;
  flex-direction: column;
}

.peer-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.connection-status {
  font-size: 0.75rem;
  color: var(--error-color);
}

.connection-status.connected {
  color: var(--success-color);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reconnect-banner {
  background-color: #feedd7;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f7d6a3;
  font-size: 0.875rem;
  color: #92580f;
}

.reconnect-button {
  background-color: transparent;
  border: 1px solid #92580f;
  color: #92580f;
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

.reconnect-button:hover {
  background-color: rgba(146, 88, 15, 0.1);
}

.chat-input-container {
  padding: 0.75rem 1rem;
  background-color: white;
  border-top: 1px solid var(--border-color);
}

.message-form {
  display: flex;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  border-radius: 1.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: var(--primary-color);
}

.message-input:disabled {
  background-color: var(--light-bg);
  cursor: not-allowed;
}

.send-button {
  background-color: var(--primary-color);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.send-button:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.send-button:disabled {
  background-color: var(--light-bg);
  color: var(--text-secondary);
  cursor: not-allowed;
}
</style>