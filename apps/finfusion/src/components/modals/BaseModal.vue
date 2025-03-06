<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    required: true
  },
  maxWidth: {
    type: String,
    default: '600px'
  }
});

const emit = defineEmits(['close']);

// Close on escape key
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && props.show) {
    emit('close');
  }
};

// Prevent body scrolling when modal is open
const preventBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

const restoreBodyScroll = () => {
  document.body.style.overflow = 'auto';
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  if (props.show) {
    preventBodyScroll();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
  restoreBodyScroll();
});

// Watch for changes in show prop
const watchShow = () => {
  if (props.show) {
    preventBodyScroll();
  } else {
    restoreBodyScroll();
  }
};

const handleBackdropClick = (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    emit('close');
  }
};
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="modal-backdrop"
      @click="handleBackdropClick"
      v-voix="'Modal Dialog'"
    >
      <div 
        class="modal-container" 
        :style="{ maxWidth }"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-header">
          <h2 class="modal-title" v-if="title">{{ title }}</h2>
          <button 
            class="modal-close" 
            @click="$emit('close')"
            v-voix="'Close Modal'"
          >
            <span>×</span>
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  animation: modal-appear 0.2s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--text-color);
  opacity: 0.7;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.2s, opacity 0.2s;
}

.modal-close:hover {
  background-color: rgba(0, 0, 0, 0.05);
  opacity: 1;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@keyframes modal-appear {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .modal-container {
    max-height: calc(100vh - 20px);
  }

  .modal-backdrop {
    padding: 10px;
  }
}
</style>