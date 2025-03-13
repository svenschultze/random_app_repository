<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success', // success, error, info
    validator: (value) => ['success', 'error', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000 // milliseconds
  },
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const isVisible = ref(props.show);
let timeoutId = null;

// Watch for show prop changes
watch(() => props.show, (newValue) => {
  isVisible.value = newValue;
  if (newValue) {
    startTimer();
  } else {
    clearTimeout(timeoutId);
  }
});

// Start auto-hide timer
const startTimer = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    close();
  }, props.duration);
};

// Close the notification
const close = () => {
  isVisible.value = false;
  emit('close');
};

// Start timer on mount if shown
onMounted(() => {
  if (props.show) {
    startTimer();
  }
});
</script>

<template>
  <transition name="notification-fade">
    <div 
      v-if="isVisible" 
      class="notification-banner" 
      :class="type"
      v-voix:role="'alert'"
      v-voix:label="message"
      v-voix:live="'assertive'"
    >
      <div class="notification-content">
        <div class="notification-icon">
          <span v-if="type === 'success'">✓</span>
          <span v-else-if="type === 'error'">✗</span>
          <span v-else>ℹ</span>
        </div>
        <div class="notification-message">{{ message }}</div>
      </div>
      <button 
        class="notification-close" 
        @click="close"
        v-voix:role="'button'"
        v-voix:label="'Close notification'"
      >
        ✕
      </button>
    </div>
  </transition>
</template>

<style scoped>
.notification-banner {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 300px;
  max-width: 90%;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.notification-content {
  display: flex;
  align-items: center;
}

.notification-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  font-weight: bold;
}

.notification-message {
  font-size: 14px;
}

.notification-close {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  margin-left: 16px;
  opacity: 0.7;
}

.notification-close:hover {
  opacity: 1;
}

/* Types */
.success {
  background-color: #edf7ed;
  border-left: 4px solid #4caf50;
  color: #1e4620;
}

.success .notification-icon {
  background-color: #4caf50;
}

.error {
  background-color: #fdeded;
  border-left: 4px solid #f44336;
  color: #5f2120;
}

.error .notification-icon {
  background-color: #f44336;
}

.info {
  background-color: #e8f4fd;
  border-left: 4px solid #2196f3;
  color: #0d3c61;
}

.info .notification-icon {
  background-color: #2196f3;
}

/* Animation */
.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: all 0.3s ease;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>