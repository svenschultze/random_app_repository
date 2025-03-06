<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['dismiss'])

const isVisible = ref(true)
const notificationRef = ref(null)

// Get icon based on notification type
const icon = computed(() => {
  switch (props.notification.type) {
    case 'level-up':
      return '🎖️'
    case 'badge':
      return '🏆'
    case 'streak':
      return '🔥'
    case 'lesson-complete':
      return '✅'
    default:
      return '📢'
  }
})

// Get background color based on notification type
const bgColor = computed(() => {
  switch (props.notification.type) {
    case 'level-up':
      return 'var(--primary-color)'
    case 'badge':
      return 'var(--accent-color)'
    case 'streak':
      return 'var(--warning-color)'
    case 'lesson-complete':
      return 'var(--success-color)'
    default:
      return 'var(--info-color)'
  }
})

// Format the timestamp
const formattedTime = computed(() => {
  if (!props.notification.timestamp) return ''
  
  const date = new Date(props.notification.timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const handleDismiss = () => {
  isVisible.value = false
  
  // Emit the dismiss event after animation completes
  setTimeout(() => {
    emit('dismiss', props.notification.id)
  }, 300)
}

// Auto-dismiss based on notification's autoDismiss property
onMounted(() => {
  if (props.notification.autoDismiss) {
    setTimeout(() => {
      handleDismiss()
    }, props.notification.autoDismiss)
  }
  
  // Add entrance animation
  setTimeout(() => {
    if (notificationRef.value) {
      notificationRef.value.style.transform = 'translateX(0)'
      notificationRef.value.style.opacity = '1'
    }
  }, 10)
})
</script>

<template>
  <div 
    v-if="isVisible" 
    class="notification-toast" 
    :style="{ backgroundColor: bgColor }"
    ref="notificationRef"
    v-voix="'notification-toast'"
    :hint="`Notification: ${notification.title}`"
  >
    <div class="notification-icon">{{ icon }}</div>
    <div class="notification-content">
      <h3 class="notification-title">{{ notification.title }}</h3>
      <p class="notification-message">{{ notification.message }}</p>
      <span class="notification-time">{{ formattedTime }}</span>
    </div>
    <button 
      class="notification-close-btn" 
      @click="handleDismiss"
      v-voix="'dismiss-notification'"
      hint="Close this notification"
    >
      &times;
    </button>
  </div>
</template>

<style scoped>
.notification-toast {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 320px;
  max-width: 100%;
  transform: translateX(120%);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.notification-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.notification-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 0.25rem;
}

.notification-close-btn:hover {
  opacity: 1;
}
</style>