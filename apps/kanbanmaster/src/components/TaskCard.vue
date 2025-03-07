<script setup>
import { computed } from 'vue'
import store from '@/store'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  columnName: {
    type: String,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  allColumns: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

// Format the due date to a readable format
const formattedDueDate = computed(() => {
  if (!props.task.dueDate) return null
  
  const date = new Date(props.task.dueDate)
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date)
})

// Determine if task is overdue
const isOverdue = computed(() => {
  if (!props.task.dueDate) return false
  
  const today = new Date()
  const dueDate = new Date(props.task.dueDate)
  
  // Remove time portion for comparison
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)
  
  return dueDate < today
})

// Determine priority class
const priorityClass = computed(() => {
  const priorities = {
    'Low': 'priority-low',
    'Medium': 'priority-medium',
    'High': 'priority-high',
    'Critical': 'priority-critical'
  }
  
  return priorities[props.task.priority] || 'priority-medium'
})

function editTask() {
  emit('edit', props.task)
}

function deleteTask() {
  emit('delete', props.task)
}

// Handle column change
function changeColumn(event) {
  const selectedColumn = props.allColumns.find(col => col.name === event.target.value)
  if (selectedColumn && selectedColumn.id !== props.task.columnId) {
    store.moveTask(props.projectId, props.task.id, selectedColumn.id)
  }
}
</script>

<template>
  <div 
    class="task-card" 
    :class="priorityClass"
    v-voix="'task-' + task.id"
    :hint="`Task ${task.title} with priority ${task.priority} in column ${columnName}`"
  >
    <div class="task-header">
      <h4 class="task-title">{{ task.title }}</h4>
    </div>
    
    <div class="task-labels" v-if="task.labels && task.labels.length">
      <div v-for="label in task.labels" :key="label" class="task-label">
        {{ label }}
      </div>
    </div>
    
    <div class="task-details">
      <div class="task-assignee" v-if="task.assignee">
        <span class="detail-icon">👤</span>
        <span class="detail-text">{{ task.assignee }}</span>
      </div>
      
      <div class="task-due-date" v-if="formattedDueDate" :class="{ 'overdue': isOverdue }">
        <span class="detail-icon">📅</span>
        <span class="detail-text">{{ formattedDueDate }}</span>
      </div>
    </div>
    
    <div class="task-actions">
      <button 
        @click.stop="editTask" 
        class="task-action-button"
        v-voix="'edit-task-' + task.id"
        :hint="`Edit task ${task.title}`"
      >
        Edit
      </button>
      <button 
        @click.stop="deleteTask" 
        class="task-action-button delete"
        v-voix="'delete-task-' + task.id"
        :hint="`Delete task ${task.title}`"
      >
        Delete
      </button>
    </div>
    
    <!-- Accessible column change control -->
    <div class="task-move-control" v-voix:description="'Dropdown selector to move task between board columns'">
      <label :for="`move-task-${task.id}`" v-voix:hidden="'move-task-label-' + task.id">Move task to column:</label>
      <select 
        :id="`move-task-${task.id}`" 
        @change="changeColumn" 
        :value="columnName"
        class="column-select"
        v-voix="'move-task-select-' + task.id"
        :hint="`Move task ${task.title} from ${columnName} to another column`"
        aria-label="Move task to column"
      >
        <option 
          v-for="column in allColumns" 
          :key="column.id" 
          :value="column.name"
          :aria-label="column.name + (column.id === task.columnId ? ' (Current column)' : '')"
          v-voix="'column-option-' + column.id"
          :hint="column.id === task.columnId ? 
                `${column.name} (Current column for this task)` : 
                `Move task to ${column.name} column`"
        >
          {{ column.name }}{{ column.id === task.columnId ? ' (Current)' : '' }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background-color: var(--bg-color);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--border-color);
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.task-header {
  margin-bottom: 0.75rem;
}

.task-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
}

.task-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.task-label {
  background-color: var(--light-bg-color);
  color: var(--text-color);
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.task-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

.task-assignee, .task-due-date {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.detail-icon {
  font-size: 0.9rem;
}

.detail-text {
  color: var(--text-color);
}

.overdue .detail-text {
  color: var(--error-color);
  font-weight: 500;
}

.task-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.task-action-button {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
}

.task-action-button:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.task-action-button.delete:hover {
  background-color: var(--error-color);
  border-color: var(--error-color);
}

/* Task move control styles */
.task-move-control {
  margin-top: 0.75rem;
  border-top: 1px dashed var(--border-color);
  padding-top: 0.75rem;
}

.task-move-control label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.8;
}

.column-select {
  width: 100%;
  padding: 0.4rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.column-select:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

/* Priority styling */
.priority-low {
  border-left-color: #27ae60;
}

.priority-medium {
  border-left-color: #f39c12;
}

.priority-high {
  border-left-color: #e67e22;
}

.priority-critical {
  border-left-color: #e74c3c;
}
</style>