<script setup>
import { ref, onMounted } from 'vue'
import store from '@/store'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  task: {
    type: Object,
    default: null
  },
  columnId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

// Form data
const formData = ref({
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: '',
  assignee: '',
  labels: []
})

// Available options
const priorities = ['Low', 'Medium', 'High', 'Critical']
const assignees = ['Alex Smith', 'Jamie Taylor', 'Jordan Kim', 'Sam Chen', 'Morgan Lee']
const availableLabels = ['Feature', 'Bug', 'Documentation', 'Enhancement', 'Refactor', 'Testing']

// Selected labels (multiple)
const selectedLabels = ref([])

// Initialize form with task data if editing
onMounted(() => {
  if (props.task) {
    formData.value.title = props.task.title
    formData.value.description = props.task.description
    formData.value.priority = props.task.priority
    
    // Format date for input field
    if (props.task.dueDate) {
      const date = new Date(props.task.dueDate)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      formData.value.dueDate = `${year}-${month}-${day}`
    }
    
    formData.value.assignee = props.task.assignee
    selectedLabels.value = props.task.labels || []
  }
})

function toggleLabel(label) {
  if (selectedLabels.value.includes(label)) {
    selectedLabels.value = selectedLabels.value.filter(l => l !== label)
  } else {
    selectedLabels.value.push(label)
  }
}

function isLabelSelected(label) {
  return selectedLabels.value.includes(label)
}

function saveTask() {
  if (!formData.value.title.trim()) {
    alert('Please enter a task title')
    return
  }
  
  // Create task data object
  const taskData = {
    title: formData.value.title,
    description: formData.value.description,
    priority: formData.value.priority,
    assignee: formData.value.assignee,
    labels: selectedLabels.value
  }
  
  // Add due date if provided
  if (formData.value.dueDate) {
    taskData.dueDate = new Date(formData.value.dueDate)
  }
  
  if (props.task) {
    // Update existing task
    store.updateTask(props.projectId, props.task.id, taskData)
  } else {
    // Add column ID for new task
    taskData.columnId = props.columnId
    
    // Create new task
    store.addTask(props.projectId, taskData)
  }
  
  emit('saved')
  emit('close')
}

function cancel() {
  emit('close')
}
</script>

<template>
  <div class="task-form-container">
    <div class="task-form">
      <div class="form-header">
        <h2>{{ task ? 'Edit Task' : 'New Task' }}</h2>
        <button 
          @click="cancel" 
          class="close-button"
          v-voix="'close-task-form'"
          hint="Close the task form without saving"
        >
          ✕
        </button>
      </div>
      
      <div class="form-body">
        <div class="form-group">
          <label for="task-title">Title</label>
          <input 
            type="text" 
            id="task-title" 
            v-model="formData.title" 
            placeholder="Enter task title" 
            v-voix="'task-title-input'"
            hint="Enter the title for the task"
          />
        </div>
        
        <div class="form-group">
          <label for="task-description">Description</label>
          <textarea 
            id="task-description" 
            v-model="formData.description" 
            placeholder="Enter task description" 
            rows="3"
            v-voix="'task-description-input'"
            hint="Enter a detailed description of the task"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="task-priority">Priority</label>
          <select 
            id="task-priority" 
            v-model="formData.priority"
            v-voix="'task-priority-select'"
            hint="Select the priority level for this task"
          >
            <option v-for="priority in priorities" :key="priority" :value="priority">
              {{ priority }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="task-due-date">Due Date</label>
          <input 
            type="date" 
            id="task-due-date" 
            v-model="formData.dueDate"
            v-voix="'task-due-date-input'"
            hint="Select a due date for the task"
          />
        </div>
        
        <div class="form-group">
          <label for="task-assignee">Assignee</label>
          <select 
            id="task-assignee" 
            v-model="formData.assignee"
            v-voix="'task-assignee-select'"
            hint="Select who should be assigned to this task"
          >
            <option value="">Not Assigned</option>
            <option v-for="assignee in assignees" :key="assignee" :value="assignee">
              {{ assignee }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Labels</label>
          <div class="labels-container">
            <button 
              v-for="label in availableLabels" 
              :key="label"
              class="label-toggle"
              :class="{ 'selected': isLabelSelected(label) }"
              @click="toggleLabel(label)"
              v-voix="'label-toggle-' + label"
              :hint="'Toggle ' + label + ' label'"
            >
              {{ label }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          @click="cancel" 
          class="cancel-button"
          v-voix="'cancel-task-form'"
          hint="Cancel and close the form"
        >
          Cancel
        </button>
        <button 
          @click="saveTask" 
          class="save-button"
          v-voix="'save-task-button'"
          hint="Save the task"
        >
          {{ task ? 'Update Task' : 'Create Task' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-form-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.task-form {
  background-color: var(--bg-color);
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.form-header {
  padding: 1rem;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.form-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 0.95rem;
}

.form-group textarea {
  resize: vertical;
}

.labels-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.label-toggle {
  background-color: var(--light-bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-color);
}

.label-toggle:hover {
  border-color: var(--primary-color);
}

.label-toggle.selected {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.form-actions {
  padding: 1rem 1.5rem;
  background-color: var(--light-bg-color);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid var(--border-color);
}

.cancel-button {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.save-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.save-button:hover {
  background-color: color-mix(in srgb, var(--primary-color) 80%, black);
}

.cancel-button:hover {
  background-color: var(--hover-bg-color);
}

@media (max-width: 600px) {
  .task-form {
    width: 90%;
    max-height: 90vh;
  }
  
  .form-body {
    max-height: 70vh;
  }
}
</style>