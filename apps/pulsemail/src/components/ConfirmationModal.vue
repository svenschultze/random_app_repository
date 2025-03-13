<script setup>
import { watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'warning', // warning, error, info
    validator: (value) => ['warning', 'error', 'info'].includes(value)
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};

// Handle clicks on the backdrop
const handleBackdropClick = (event) => {
  // Only close if clicking directly on the backdrop, not its children
  if (event.target === event.currentTarget) {
    emit('cancel');
  }
};

// Listen for Escape key to cancel
watch(() => props.show, (newValue) => {
  if (newValue) {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        emit('cancel');
        document.removeEventListener('keydown', handleEscapeKey);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
  }
});
</script>

<template>
  <div 
    v-if="show" 
    class="modal-backdrop"
    @click="handleBackdropClick"
    v-voix:role="'dialog'"
    v-voix:modal="true"
  >
    <div class="modal-container" :class="type">
      <div class="modal-header">
        <h3 class="modal-title" v-voix:role="'heading'" v-voix:level="2">{{ title }}</h3>
      </div>
      
      <div class="modal-body" v-voix:role="'text'">
        {{ message }}
      </div>
      
      <div class="modal-footer">
        <button 
          class="cancel-button" 
          @click="handleCancel"
          v-voix:role="'button'"
          v-voix:label="cancelText"
        >
          {{ cancelText }}
        </button>
        
        <button 
          class="confirm-button" 
          :class="type"
          @click="handleConfirm"
          v-voix:role="'button'"
          v-voix:label="confirmText"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  border-radius: 8px;
  max-width: 90%;
  width: 400px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.modal-body {
  padding: 20px 16px;
  font-size: 16px;
  line-height: 1.5;
}

.modal-footer {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}

.cancel-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.confirm-button {
  padding: 8px 16px;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

/* Button types */
.confirm-button.warning {
  background-color: #ff9800;
}

.confirm-button.error {
  background-color: #f44336;
}

.confirm-button.info {
  background-color: #2196f3;
}

/* Container types for border accents */
.modal-container.warning {
  border-top: 4px solid #ff9800;
}

.modal-container.error {
  border-top: 4px solid #f44336;
}

.modal-container.info {
  border-top: 4px solid #2196f3;
}
</style>