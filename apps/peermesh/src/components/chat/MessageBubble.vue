<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isOwn: {
    type: Boolean,
    default: false
  }
})

const formattedTime = computed(() => {
  if (!props.message.timestamp) return ''
  
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const messageStatusIcon = computed(() => {
  if (props.message.type === 'system') {
    return null
  }
  
  if (!props.isOwn) {
    return null
  }
  
  switch (props.message.status) {
    case 'sending':
      return 'schedule'
    case 'sent':
      return 'check'
    case 'delivered':
      return 'done_all'
    case 'read':
      return 'done_all'
    default:
      return 'check'
  }
})

const messageTypeClass = computed(() => {
  if (props.message.type === 'system') {
    return 'system-message'
  }
  
  return props.isOwn ? 'own-message' : 'other-message'
})
</script>

<template>
  <div class="message-bubble" :class="messageTypeClass">
    <div v-if="message.type === 'system'" class="system-content">
      {{ message.content }}
    </div>
    
    <template v-else>
      <div class="message-content">
        {{ message.content }}
      </div>
      
      <div class="message-footer">
        <span class="message-time">{{ formattedTime }}</span>
        
        <span 
          v-if="messageStatusIcon" 
          class="material-symbols-outlined status-icon"
          :class="{ 'read': message.status === 'read' }"
        >
          {{ messageStatusIcon }}
        </span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.message-bubble {
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  position: relative;
}

.own-message {
  align-self: flex-end;
  background-color: var(--primary-color);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.other-message {
  align-self: flex-start;
  background-color: white;
  color: var(--text-primary);
  border-bottom-left-radius: 0.25rem;
}

.system-message {
  align-self: center;
  background-color: var(--light-bg);
  color: var(--text-secondary);
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  max-width: 80%;
  text-align: center;
}

.message-content {
  word-break: break-word;
}

.message-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.message-time {
  font-size: 0.6875rem;
  opacity: 0.8;
}

.status-icon {
  font-size: 0.875rem;
  opacity: 0.8;
}

.read {
  color: #4ade80;
}
</style>