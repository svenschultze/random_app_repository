<script setup>
import { computed } from 'vue';

const props = defineProps({
  classEvent: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['view']);

const statusClass = computed(() => {
  if (props.classEvent.isCancelled) return 'cancelled';
  if (props.classEvent.isSpecialEvent) return 'special';
  return '';
});

const cardStyle = computed(() => ({
  borderLeftColor: props.classEvent.color
}));

const formattedTime = computed(() => {
  return `${props.classEvent.startTime} - ${props.classEvent.endTime}`;
});

// Function to create a unique ID for each action
const generateActionId = (action, eventId) => {
  return `${action}-event-${eventId}`;
};
</script>

<template>
  <div 
    class="class-card" 
    :class="statusClass" 
    :style="cardStyle"
    v-voix="'class-card-' + classEvent.id"
    :hint="`${classEvent.title} from ${classEvent.startTime} to ${classEvent.endTime}`"
  >
    <div class="card-header">
      <div class="subject-code">{{ classEvent.subject }}</div>
      <div class="time">{{ formattedTime }}</div>
    </div>
    
    <h3 class="class-title">{{ classEvent.title }}</h3>
    
    <div class="details">
      <p v-if="classEvent.instructor" class="instructor">
        <span class="label">Instructor:</span> {{ classEvent.instructor }}
      </p>
      <p v-if="classEvent.location" class="location">
        <span class="label">Location:</span> {{ classEvent.location }}
      </p>
    </div>
    
    <div v-if="classEvent.notes" class="notes">
      <p>{{ classEvent.notes }}</p>
    </div>
    
    <div v-if="classEvent.isCancelled" class="status cancelled">
      CANCELLED
    </div>
    
    <div class="card-actions">
      <button 
        class="action-btn" 
        @click="$emit('view')"
        v-voix="generateActionId('view', classEvent.id)"
        hint="View details of this class"
      >
        View Details
      </button>
    </div>
  </div>
</template>

<style scoped>
.class-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  border-left: 4px solid #4a6fa5;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.class-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.subject-code {
  font-weight: bold;
  color: #4a6fa5;
  background-color: rgba(74, 111, 165, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.time {
  font-size: 0.9rem;
  color: #6c757d;
}

.class-title {
  margin: 8px 0;
  font-size: 1.1rem;
  color: #212529;
}

.details {
  margin: 8px 0;
  font-size: 0.9rem;
}

.details p {
  margin: 4px 0;
}

.label {
  font-weight: 600;
  color: #495057;
}

.notes {
  font-size: 0.85rem;
  font-style: italic;
  color: #6c757d;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #dee2e6;
}

.status {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.cancelled {
  color: white;
  background-color: #dc3545;
}

.special {
  border-left-color: #fd7e14;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.action-btn {
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #3a5a84;
}
</style>