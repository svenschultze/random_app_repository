<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const localValue = ref(props.modelValue);

// Watch for changes from parent
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue;
});

// Watch for local changes and emit to parent
watch(localValue, (newValue) => {
  emit('update:modelValue', newValue);
});

// Clear search
const clearSearch = () => {
  localValue.value = '';
  emit('update:modelValue', '');
};
</script>

<template>
  <div class="search-bar">
    <div class="search-input-container">
      <input
        type="text"
        class="search-input"
        placeholder="Search contacts..."
        v-model="localValue"
        v-voix="'search-contacts'"
        hint="Search for contacts by name, email, or phone number"
      />
      <button 
        v-if="localValue" 
        class="clear-button" 
        @click="clearSearch"
        v-voix="'clear-search'"
        hint="Clear the search field"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  margin: 1rem 0;
  width: 100%;
}

.search-input-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #5c6bc0;
  box-shadow: 0 2px 8px rgba(92, 107, 192, 0.2);
}

.clear-button {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

.clear-button:hover {
  background-color: #f0f0f0;
  color: #555;
}
</style>