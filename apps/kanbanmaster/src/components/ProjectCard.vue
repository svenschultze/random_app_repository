<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/store'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const emit = defineEmits(['edit', 'delete'])

const columnStats = computed(() => {
  const stats = {}
  
  props.project.columns.forEach(column => {
    const tasksInColumn = props.project.tasks.filter(task => task.columnId === column.id).length
    stats[column.id] = {
      name: column.name,
      count: tasksInColumn
    }
  })
  
  return stats
})

const totalTasks = computed(() => props.project.tasks.length)

function openBoard() {
  router.push({ name: 'board', params: { id: props.project.id } })
}

function editProject() {
  emit('edit', props.project)
}

function deleteProject() {
  if (confirm(`Are you sure you want to delete "${props.project.name}"?`)) {
    store.deleteProject(props.project.id)
    emit('delete', props.project.id)
  }
}
</script>

<template>
  <div class="project-card">
    <div class="project-header">
      <h3 class="project-title">{{ project.name }}</h3>
      <div class="project-actions">
        <button 
          @click="editProject" 
          class="action-button edit-button"
          v-voix="'edit-project-' + project.id"
          :hint="'Edit project ' + project.name"
        >
          Edit
        </button>
        <button 
          @click="deleteProject" 
          class="action-button delete-button"
          v-voix="'delete-project-' + project.id"
          :hint="'Delete project ' + project.name"
        >
          Delete
        </button>
      </div>
    </div>
    
    <p class="project-description">{{ project.description }}</p>
    
    <div class="project-stats">
      <div class="stat total-tasks">
        <span class="stat-label">Total Tasks:</span>
        <span class="stat-value">{{ totalTasks }}</span>
      </div>
      
      <div class="columns-stats">
        <div v-for="(stat, columnId) in columnStats" :key="columnId" class="column-stat">
          <span class="column-name">{{ stat.name }}:</span>
          <span class="column-count">{{ stat.count }}</span>
        </div>
      </div>
    </div>
    
    <button 
      @click="openBoard" 
      class="open-board-button"
      v-voix="'open-board-' + project.id"
      :hint="'Open kanban board for project ' + project.name"
    >
      Open Board
    </button>
  </div>
</template>

<style scoped>
.project-card {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.project-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.project-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.edit-button:hover {
  background-color: var(--info-color);
  border-color: var(--info-color);
  color: white;
}

.delete-button:hover {
  background-color: var(--error-color);
  border-color: var(--error-color);
  color: white;
}

.project-description {
  color: var(--text-color);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.project-stats {
  background-color: var(--light-bg-color);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-value {
  font-size: 0.9rem;
}

.columns-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.column-stat {
  background-color: var(--bg-color);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  display: flex;
  gap: 0.25rem;
  border: 1px solid var(--border-color);
}

.column-name {
  font-weight: 500;
}

.open-board-button {
  background-color: var(--primary-color);
  color: white;
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.open-board-button:hover {
  background-color: color-mix(in srgb, var(--primary-color) 80%, black);
}
</style>