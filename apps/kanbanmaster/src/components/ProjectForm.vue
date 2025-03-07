<script setup>
import { ref, onMounted } from 'vue'
import store from '@/store'

const props = defineProps({
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

// Form data
const formData = ref({
  name: '',
  description: '',
  columns: [
    { name: 'Backlog', order: 0 },
    { name: 'To Do', order: 1 },
    { name: 'In Progress', order: 2 },
    { name: 'Done', order: 3 }
  ]
})

// Additional column input
const newColumnName = ref('')

// Initialize form with project data if editing
onMounted(() => {
  if (props.project) {
    formData.value.name = props.project.name
    formData.value.description = props.project.description
    
    // Sort columns by order
    const sortedColumns = [...props.project.columns].sort((a, b) => a.order - b.order)
    
    // Map columns to only include name and order (not ids)
    formData.value.columns = sortedColumns.map(column => ({
      name: column.name,
      order: column.order
    }))
  }
})

function addColumn() {
  if (!newColumnName.value.trim()) return
  
  formData.value.columns.push({
    name: newColumnName.value.trim(),
    order: formData.value.columns.length
  })
  
  newColumnName.value = ''
}

function removeColumn(index) {
  formData.value.columns.splice(index, 1)
  
  // Update order of remaining columns
  formData.value.columns.forEach((column, idx) => {
    column.order = idx
  })
}

function moveColumnUp(index) {
  if (index === 0) return
  
  // Swap with previous column
  const temp = formData.value.columns[index]
  formData.value.columns[index] = formData.value.columns[index - 1]
  formData.value.columns[index - 1] = temp
  
  // Update order values
  formData.value.columns.forEach((column, idx) => {
    column.order = idx
  })
}

function moveColumnDown(index) {
  if (index === formData.value.columns.length - 1) return
  
  // Swap with next column
  const temp = formData.value.columns[index]
  formData.value.columns[index] = formData.value.columns[index + 1]
  formData.value.columns[index + 1] = temp
  
  // Update order values
  formData.value.columns.forEach((column, idx) => {
    column.order = idx
  })
}

function saveProject() {
  if (!formData.value.name.trim()) {
    alert('Please enter a project name')
    return
  }
  
  if (formData.value.columns.length === 0) {
    alert('Please add at least one column')
    return
  }
  
  // Create project data object
  const projectData = {
    name: formData.value.name,
    description: formData.value.description,
    columns: formData.value.columns
  }
  
  if (props.project) {
    // Update existing project
    store.updateProject(props.project.id, projectData)
    
    // Handle column updates separately
    // This is a bit more complex since we need to manage column IDs
    const existingColumns = props.project.columns
    
    // Create a map of column name to ID for existing columns
    const columnNameToId = {}
    existingColumns.forEach(column => {
      columnNameToId[column.name] = column.id
    })
    
    // Process each column in the form
    projectData.columns.forEach((column, index) => {
      if (columnNameToId[column.name]) {
        // This column already exists, update it
        store.updateColumn(props.project.id, columnNameToId[column.name], { 
          name: column.name, 
          order: index 
        })
      } else {
        // This is a new column, add it
        store.addColumn(props.project.id, { 
          name: column.name, 
          order: index 
        })
      }
    })
    
    // Delete columns that are no longer in the form
    existingColumns.forEach(column => {
      const stillExists = projectData.columns.some(c => c.name === column.name)
      if (!stillExists) {
        store.deleteColumn(props.project.id, column.id)
      }
    })
  } else {
    // Create new project
    store.addProject(projectData)
  }
  
  emit('saved')
  emit('close')
}

function cancel() {
  emit('close')
}
</script>

<template>
  <div class="project-form-container">
    <div class="project-form">
      <div class="form-header">
        <h2>{{ project ? 'Edit Project' : 'New Project' }}</h2>
        <button 
          @click="cancel" 
          class="close-button"
          v-voix="'close-project-form'"
          hint="Close the project form without saving"
        >
          ✕
        </button>
      </div>
      
      <div class="form-body">
        <div class="form-group">
          <label for="project-name">Project Name</label>
          <input 
            type="text" 
            id="project-name" 
            v-model="formData.name" 
            placeholder="Enter project name"
            v-voix="'project-name-input'"
            hint="Enter the name for the project"
          />
        </div>
        
        <div class="form-group">
          <label for="project-description">Description</label>
          <textarea 
            id="project-description" 
            v-model="formData.description" 
            placeholder="Enter project description" 
            rows="3"
            v-voix="'project-description-input'"
            hint="Enter a detailed description of the project"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Columns</label>
          <div class="columns-list">
            <div v-for="(column, index) in formData.columns" :key="index" class="column-item">
              <span class="column-name">{{ column.name }}</span>
              <div class="column-actions">
                <button 
                  @click="moveColumnUp(index)" 
                  class="column-action-button" 
                  :disabled="index === 0"
                  v-voix="'move-column-up-' + index"
                  :hint="`Move column ${column.name} up`"
                >
                  ↑
                </button>
                <button 
                  @click="moveColumnDown(index)" 
                  class="column-action-button" 
                  :disabled="index === formData.columns.length - 1"
                  v-voix="'move-column-down-' + index"
                  :hint="`Move column ${column.name} down`"
                >
                  ↓
                </button>
                <button 
                  @click="removeColumn(index)" 
                  class="column-action-button delete"
                  v-voix="'remove-column-' + index"
                  :hint="`Remove column ${column.name}`"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="new-column">Add Column</label>
          <div class="add-column-input">
            <input 
              type="text" 
              id="new-column" 
              v-model="newColumnName" 
              placeholder="Enter column name"
              v-voix="'new-column-input'"
              hint="Enter name for a new column"
            />
            <button 
              @click="addColumn" 
              class="add-column-button"
              v-voix="'add-column-button'"
              hint="Add the new column"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          @click="cancel" 
          class="cancel-button"
          v-voix="'cancel-project-form'"
          hint="Cancel and close the form"
        >
          Cancel
        </button>
        <button 
          @click="saveProject" 
          class="save-button"
          v-voix="'save-project-button'"
          hint="Save the project"
        >
          {{ project ? 'Update Project' : 'Create Project' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-form-container {
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

.project-form {
  background-color: var(--bg-color);
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
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
  max-height: 70vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
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

.columns-list {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.column-item {
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-color);
}

.column-item:last-child {
  border-bottom: none;
}

.column-name {
  font-weight: 500;
  font-size: 0.95rem;
}

.column-actions {
  display: flex;
  gap: 0.5rem;
}

.column-action-button {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.column-action-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.column-action-button:not(:disabled):hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.column-action-button.delete:not(:disabled):hover {
  background-color: var(--error-color);
  border-color: var(--error-color);
}

.add-column-input {
  display: flex;
  gap: 0.5rem;
}

.add-column-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
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

@media (max-width: 650px) {
  .project-form {
    width: 90%;
    max-height: 90vh;
  }
  
  .form-body {
    max-height: 70vh;
  }
}
</style>