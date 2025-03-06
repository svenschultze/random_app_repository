<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'accent'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <button
    class="btn"
    :class="[
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-full-width': fullWidth, 'btn-loading': loading, 'btn-with-icon': icon }
    ]"
    :disabled="disabled || loading"
    v-voix="id"
    :hint="hint"
  >
    <span v-if="loading" class="loader"></span>
    <span v-else-if="icon && iconPosition === 'left'" class="icon icon-left" v-html="icon"></span>
    <span class="label">{{ label }}</span>
    <span v-if="icon && iconPosition === 'right'" class="icon icon-right" v-html="icon"></span>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  gap: 8px;
}

.btn:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.5s ease, height 0.5s ease;
}

.btn:hover:before {
  width: 200%;
  height: 200%;
}

.btn:active {
  transform: translateY(1px);
}

/* Size variants */
.btn-sm {
  height: 32px;
  padding: 0 12px;
  font-size: 0.875rem;
}

.btn-md {
  height: 40px;
  padding: 0 16px;
  font-size: 1rem;
}

.btn-lg {
  height: 48px;
  padding: 0 24px;
  font-size: 1.125rem;
}

/* Color variants */
.btn-primary {
  background-color: var(--color-primary, #4361ee);
  color: white;
}

.btn-secondary {
  background-color: var(--color-secondary, #3f37c9);
  color: white;
}

.btn-accent {
  background-color: var(--color-accent, #f72585);
  color: white;
}

.btn-outline {
  background-color: transparent;
  border-color: var(--color-primary, #4361ee);
  color: var(--color-primary, #4361ee);
}

.btn-outline:hover {
  background-color: rgba(67, 97, 238, 0.1);
}

.btn-ghost {
  background-color: transparent;
  color: var(--color-text, #2b2b2b);
}

.btn-ghost:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* States */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:disabled:before {
  display: none;
}

.btn-full-width {
  width: 100%;
}

/* Loading state */
.btn-loading {
  color: transparent;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -10px;
  margin-left: -10px;
}

.btn-outline .loader {
  border: 2px solid rgba(67, 97, 238, 0.3);
  border-top-color: var(--color-primary, #4361ee);
}

.btn-ghost .loader {
  border: 2px solid rgba(43, 43, 43, 0.3);
  border-top-color: var(--color-text, #2b2b2b);
}

/* Icon positioning */
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>