<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmClass: {
    type: String,
    default: 'danger'
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => {
  emit('confirm')
}

const cancel = () => {
  emit('cancel')
}
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click="cancel">
    <div class="modal-container" @click.stop>
      <div class="modal-header" v-voix="'modal-title'">
        <h3>{{ title }}</h3>
      </div>
      
      <div class="modal-content" v-voix="'modal-message'">
        <p>{{ message }}</p>
      </div>
      
      <div class="modal-actions">
        <button 
          @click="cancel" 
          class="btn cancel-btn"
          v-voix="'modal-cancel-button'"
          hint="Cancel this action"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="confirm" 
          class="btn confirm-btn"
          :class="confirmClass"
          v-voix="'modal-confirm-button'"
          hint="Confirm this action"
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
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-container {
  width: 90%;
  max-width: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.modal-content {
  padding: 1.5rem;
  flex: 1;
}

.modal-content p {
  margin: 0;
  line-height: 1.6;
  color: #555;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  padding: 1.25rem;
  gap: 1rem;
  border-top: 1px solid #eee;
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #555;
}

.cancel-btn:hover {
  background-color: #eaeaea;
}

.confirm-btn.danger {
  background-color: #f44336;
  color: white;
}

.confirm-btn.danger:hover {
  background-color: #d32f2f;
}

.confirm-btn.primary {
  background-color: #4caf50;
  color: white;
}

.confirm-btn.primary:hover {
  background-color: #3d9140;
}

@media (max-width: 768px) {
  .modal-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }
}
</style>