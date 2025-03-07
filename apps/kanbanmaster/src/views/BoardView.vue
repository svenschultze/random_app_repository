<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import BoardColumn from '@/components/BoardColumn.vue'
import TaskForm from '@/components/TaskForm.vue'
import store from '@/store'

const route = useRoute()
const router = useRouter()
const projectId = computed(() => route.params.id)

// Data
const project = computed(() => store.getProject(projectId.value))
const columns = computed(() => store.getColumns(projectId.value))
const tasks = computed(() => store.getTasks(projectId.value))

// Task form
const showTaskForm = ref(false)
const editingTask = ref(null)
const selectedColumnId = ref(null)

// Filters
const searchQuery = ref('')
const filterPriority = ref('')
const filterAssignee = ref('')
const filterLabel = ref('')

// Project not found handling
const projectNotFound = ref(false)

// Get assignees and labels for filter dropdowns
const assignees = computed(() => {
  const assigneesSet = new Set()
  tasks.value.forEach(task => {
    if (task.assignee) {
      assigneesSet.add(task.assignee)
    }
  })
  return Array.from(assigneesSet)
})

const labels = computed(() => {
  const labelsSet = new Set()
  tasks.value.forEach(task => {
    if (task.labels && task.labels.length) {
      task.labels.forEach(label => labelsSet.add(label))
    }
  })
  return Array.from(labelsSet)
})

// Filtered tasks
const filteredTasks = computed(() => {
  let filtered = [...tasks.value]
  
  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(query) || 
      task.description.toLowerCase().includes(query)
    )
  }
  
  // Apply filters
  if (filterPriority.value) {
    filtered = filtered.filter(task => task.priority === filterPriority.value)
  }
  
  if (filterAssignee.value) {
    filtered = filtered.filter(task => task.assignee === filterAssignee.value)
  }
  
  if (filterLabel.value) {
    filtered = filtered.filter(task => 
      task.labels && task.labels.includes(filterLabel.value)
    )
  }
  
  return filtered
})

// Get tasks for a specific column, applying filters
function getColumnTasks(columnId) {
  return filteredTasks.value.filter(task => task.columnId === columnId)
}

// Task form handlers
function openAddTaskForm(columnId) {
  editingTask.value = null
  selectedColumnId.value = columnId
  showTaskForm.value = true
}

function openEditTaskForm(task) {
  editingTask.value = task
  selectedColumnId.value = null
  showTaskForm.value = true
}

function closeTaskForm() {
  showTaskForm.value = false
  editingTask.value = null
  selectedColumnId.value = null
}

// Clear all filters
function clearFilters() {
  searchQuery.value = ''
  filterPriority.value = ''
  filterAssignee.value = ''
  filterLabel.value = ''
}

// Watch for project not found
watch(project, (newProject) => {
  if (!newProject && store.state.loaded) {
    projectNotFound.value = true
  }
})

// Initialize store when component mounts
onMounted(() => {
  if (!store.state.loaded) {
    store.init()
  }
})

function goToProjects() {
  router.push({ name: 'projects' })
}
</script>

<template>
  <div class="board-view">
    <AppHeader />
    
    <main class="main-content">
      <!-- Project Not Found -->
      <div v-if="projectNotFound" class="not-found">
        <div class="not-found-container">
          <h2>Project Not Found</h2>
          <p>The project you're looking for doesn't exist or has been deleted.</p>
          <button 
            @click="goToProjects" 
            class="back-button"
            v-voix="'go-back-to-projects'"
            hint="Return to projects list"
          >
            ← Back to Projects
          </button>
        </div>
      </div>
      
      <!-- Board Content -->
      <div v-else-if="project" class="board-container">
        <div class="board-header">
          <div class="board-title">
            <h2>{{ project.name }}</h2>
            <p v-if="project.description" class="board-description">{{ project.description }}</p>
            
            <!-- Screen reader instructions -->
            <div class="sr-only" aria-live="polite">
              This board uses a drag and drop interface. For keyboard and screen reader users, each task card has a dropdown menu at the bottom that you can use to move the task to a different column. Select the desired destination column and the task will be moved automatically.
            </div>
          </div>
          
          <div class="board-filters">
            <div class="search-container">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Search tasks..." 
                class="search-input"
                v-voix="'search-tasks'"
                hint="Search for tasks by title or description"
              />
            </div>
            
            <div class="filter-container">
              <select 
                v-model="filterPriority" 
                class="filter-select"
                v-voix="'filter-by-priority'"
                hint="Filter tasks by priority level"
              >
                <option value="">Priority: All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              
              <select 
                v-model="filterAssignee" 
                class="filter-select"
                v-voix="'filter-by-assignee'"
                hint="Filter tasks by assignee"
              >
                <option value="">Assignee: All</option>
                <option v-for="assignee in assignees" :key="assignee" :value="assignee">
                  {{ assignee }}
                </option>
              </select>
              
              <select 
                v-model="filterLabel" 
                class="filter-select"
                v-voix="'filter-by-label'"
                hint="Filter tasks by label"
              >
                <option value="">Label: All</option>
                <option v-for="label in labels" :key="label" :value="label">
                  {{ label }}
                </option>
              </select>
              
              <button 
                @click="clearFilters" 
                class="clear-filters-button" 
                :disabled="!searchQuery && !filterPriority && !filterAssignee && !filterLabel"
                v-voix="'clear-all-filters'"
                hint="Clear all search filters"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        
        <div class="board-content">
          <div class="board-columns">
            <BoardColumn
              v-for="column in columns"
              :key="column.id"
              :column="column"
              :projectId="projectId"
              :tasks="getColumnTasks(column.id)"
              :allColumns="columns"
              @editTask="openEditTaskForm"
              @addTask="openAddTaskForm"
            />
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-else class="loading-state">
        <p>Loading project...</p>
      </div>
    </main>
    
    <!-- Task Form Modal -->
    <TaskForm
      v-if="showTaskForm"
      :projectId="projectId"
      :task="editingTask"
      :columnId="selectedColumnId"
      @close="closeTaskForm"
      @saved="closeTaskForm"
    />
  </div>
</template>

<style scoped>
.board-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.not-found, .loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 2rem;
}

.not-found-container {
  text-align: center;
  max-width: 500px;
  padding: 2rem;
  background-color: var(--light-bg-color);
  border-radius: 8px;
}

.not-found-container h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.not-found-container p {
  margin-bottom: 1.5rem;
}

.back-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  font-weight: 500;
}

.board-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.board-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.board-title {
  margin-bottom: 1rem;
}

.board-title h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.board-description {
  color: var(--text-color);
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.9;
}

.board-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.search-container {
  flex: 1 1 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.clear-filters-button {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.clear-filters-button:not(:disabled):hover {
  background-color: var(--hover-bg-color);
}

.board-content {
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
}

.board-columns {
  display: flex;
  gap: 1.25rem;
  height: 100%;
  min-height: 500px;
}

@media (max-width: 768px) {
  .board-header {
    padding: 1rem;
  }
  
  .board-filters {
    flex-direction: column;
  }
  
  .filter-container {
    flex-direction: column;
  }
  
  .board-content {
    padding: 1rem;
  }
  
  .board-columns {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>