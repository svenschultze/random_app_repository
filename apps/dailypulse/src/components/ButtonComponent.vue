<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  emit('click', event)
}
</script>

<template>
  <button 
    class="button" 
    :class="[
      `button-${variant}`, 
      `button-${size}`, 
      { 'button-block': block, 'button-disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.button-block {
  display: flex;
  width: 100%;
}

.button-disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Sizes */
.button-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.button-medium {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.button-large {
  padding: 0.75rem 1.25rem;
  font-size: 1.125rem;
}

/* Variants */
.button-primary {
  background-color: var(--primary-color);
  color: white;
}

.button-primary:hover:not(.button-disabled) {
  background-color: #2980b9;
}

.button-secondary {
  background-color: #95a5a6;
  color: white;
}

.button-secondary:hover:not(.button-disabled) {
  background-color: #7f8c8d;
}

.button-success {
  background-color: #27ae60;
  color: white;
}

.button-success:hover:not(.button-disabled) {
  background-color: #2ecc71;
}

.button-danger {
  background-color: #e74c3c;
  color: white;
}

.button-danger:hover:not(.button-disabled) {
  background-color: #c0392b;
}

.button-warning {
  background-color: #f39c12;
  color: white;
}

.button-warning:hover:not(.button-disabled) {
  background-color: #f1c40f;
}

.button-info {
  background-color: #00b894;
  color: white;
}

.button-info:hover:not(.button-disabled) {
  background-color: #55efc4;
  color: #2d3436;
}
</style>