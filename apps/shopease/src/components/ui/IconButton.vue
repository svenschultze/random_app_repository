<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'md'
  },
  disabled: {
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
    class="icon-button" 
    :class="[`color-${color}`, `size-${size}`, { disabled }]" 
    :disabled="disabled"
    v-voix="id"
    :hint="hint"
  >
    <span class="icon" v-html="icon"></span>
    <span class="label">{{ label }}</span>
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: transparent;
}

.icon-button:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.1;
  transition: opacity 0.3s ease;
}

.icon-button:hover:before {
  opacity: 0.2;
}

.icon-button:active:before {
  opacity: 0.3;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Sizes */
.size-sm {
  width: 32px;
  height: 32px;
  font-size: 18px;
}

.size-md {
  width: 40px;
  height: 40px;
  font-size: 20px;
}

.size-lg {
  width: 48px;
  height: 48px;
  font-size: 24px;
}

/* Colors */
.color-primary {
  color: var(--color-primary, #4361ee);
}

.color-secondary {
  color: var(--color-secondary, #3f37c9);
}

.color-accent {
  color: var(--color-accent, #f72585);
}

.color-dark {
  color: var(--color-text, #2b2b2b);
}

.color-light {
  color: var(--color-background, #ffffff);
}

/* Disabled state */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.disabled:hover:before {
  opacity: 0.1;
}
</style>