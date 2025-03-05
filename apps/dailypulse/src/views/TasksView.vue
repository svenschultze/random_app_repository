<script setup>
import { ref, computed } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

// Mock tasks data
const tasks = ref([
  { id: 1, title: 'Complete quarterly report', description: 'Update financial analysis and prepare summary for leadership team', assignee: 'Demo User', priority: 'High', deadline: '2025-03-06', status: 'In Progress', createdAt: '2025-02-28' },
  { id: 2, title: 'Review marketing strategy', description: 'Analyze current campaign performance and suggest improvements', assignee: 'Demo User', priority: 'Medium', deadline: '2025-03-08', status: 'Open', createdAt: '2025-03-01' },
  { id: 3, title: 'Prepare presentation for client meeting', description: 'Create slides for upcoming client review session', assignee: 'John Smith', priority: 'High', deadline: '2025-03-05', status: 'Open', createdAt: '2025-03-01' },
  { id: 4, title: 'Update website content', description: 'Refresh copy on homepage and about section', assignee: 'Demo User', priority: 'Low', deadline: '2025-03-10', status: 'In Progress', createdAt: '2025-03-02' },
  { id: 5, title: 'Research competitor products', description: 'Analyze competing products and identify strengths/weaknesses', assignee: 'Demo User', priority: 'Medium', deadline: '2025-03-15', status: 'Open', createdAt: '2025-03-03' },
  { id: 6, title: 'Finalize budget proposal', description: 'Complete Q2 budget proposal with department inputs', assignee: 'Jane Doe', priority: 'High', deadline: '2025-03-07', status: 'Open', createdAt: '2025-03-03' },
  { id: 7, title: 'Implement analytics tracking', description: 'Set up conversion tracking for new landing pages', assignee: 'Demo User', priority: 'Medium', deadline: '2025-03-12', status: 'Open', createdAt: '2025-03-04' },
  { id: 8, title: 'Organize team building event', description: 'Plan activities and logistics for quarterly team event', assignee: 'Demo User', priority: 'Low', deadline: '2025-03-20', status: 'Open', createdAt: '2025-03-05' }
])

// Create a new task form
const showNewTaskForm = ref(false)
const newTask = ref({
  title: '',
  description: '',
  assignee: 'Demo User',
  priority: 'Medium',
  deadline: '',
  status: 'Open'
})

// Task detail modal
const showTaskDetail = ref(false)
const selectedTask = ref(null)

// Filter and sort options
const filter = ref({
  status: 'all',
  priority: 'all',
  assignee: 'all'
})

const sortBy = ref('deadline')
const sortOrder = ref('asc')

// Filter tasks
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    return (filter.value.status === 'all' || task.status === filter.value.status) &&
           (filter.value.priority === 'all' || task.priority === filter.value.priority) &&
           (filter.value.assignee === 'all' || task.assignee === filter.value.assignee)
  })
})

// Sort tasks
const sortedTasks = computed(() => {
  return [...filteredTasks.value].sort((a, b) => {
    const aValue = a[sortBy.value]
    const bValue = b[sortBy.value]
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
})

// Toggle sort order
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// Change sort field
const changeSort = (field) => {
  if (sortBy.value === field) {
    toggleSortOrder()
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

// Create new task
const createTask = () => {
  if (newTask.value.title.trim() === '' || newTask.value.deadline === '') {
    return
  }
  
  const task = {
    id: tasks.value.length + 1,
    ...newTask.value,
    createdAt: new Date().toISOString().split('T')[0]
  }
  
  tasks.value.push(task)
  
  // Reset form
  newTask.value = {
    title: '',
    description: '',
    assignee: 'Demo User',
    priority: 'Medium',
    deadline: '',
    status: 'Open'
  }
  
  showNewTaskForm.value = false
}

// View task details
const viewTaskDetails = (task) => {
  selectedTask.value = { ...task }
  showTaskDetail.value = true
}

// Update task status
const updateTaskStatus = (task, newStatus) => {
  const index = tasks.value.findIndex(t => t.id === task.id)
  if (index !== -1) {
    tasks.value[index].status = newStatus
    if (selectedTask.value && selectedTask.value.id === task.id) {
      selectedTask.value.status = newStatus
    }
  }
}

// Helper function to get status class
const getStatusClass = (status) => {
  return {
    'Open': 'status-open',
    'In Progress': 'status-progress',
    'Completed': 'status-completed'
  }[status] || ''
}

// Helper function to get priority class
const getPriorityClass = (priority) => {
  return {
    'High': 'priority-high',
    'Medium': 'priority-medium',
    'Low': 'priority-low'
  }[priority] || ''
}
</script>

<template>
  <div class="tasks-view">
    <div class="page-header">
      <h1 class="page-title">Task Management</h1>
      <ButtonComponent 
        @click="showNewTaskForm = true" 
        variant="primary"
        v-voix="'create-task-button'"
        hint="Create a new task"
      >
        Create New Task
      </ButtonComponent>
    </div>

    <CardComponent title="Task Filters">
      <div class="filters">
        <div class="filter-group">
          <label for="status-filter">Status</label>
          <select 
            id="status-filter" 
            v-model="filter.status"
            v-voix="'status-filter'"
            hint="Filter tasks by status"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="priority-filter">Priority</label>
          <select 
            id="priority-filter" 
            v-model="filter.priority"
            v-voix="'priority-filter'"
            hint="Filter tasks by priority"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="assignee-filter">Assignee</label>
          <select 
            id="assignee-filter" 
            v-model="filter.assignee"
            v-voix="'assignee-filter'"
            hint="Filter tasks by assignee"
          >
            <option value="all">All Assignees</option>
            <option value="Demo User">Demo User</option>
            <option value="John Smith">John Smith</option>
            <option value="Jane Doe">Jane Doe</option>
          </select>
        </div>
      </div>
    </CardComponent>

    <CardComponent title="Task List">
      <div class="task-list-container">
        <table class="task-table">
          <thead>
            <tr>
              <th @click="changeSort('title')" class="sortable" v-voix="'sort-by-title'" hint="Sort tasks by title">
                Title
                <span v-if="sortBy === 'title'" class="sort-indicator">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="changeSort('priority')" class="sortable" v-voix="'sort-by-priority'" hint="Sort tasks by priority">
                Priority
                <span v-if="sortBy === 'priority'" class="sort-indicator">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="changeSort('deadline')" class="sortable" v-voix="'sort-by-deadline'" hint="Sort tasks by deadline">
                Deadline
                <span v-if="sortBy === 'deadline'" class="sort-indicator">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="changeSort('status')" class="sortable" v-voix="'sort-by-status'" hint="Sort tasks by status">
                Status
                <span v-if="sortBy === 'status'" class="sort-indicator">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in sortedTasks" :key="task.id">
              <td class="task-title">{{ task.title }}</td>
              <td class="task-priority">
                <span :class="['priority-badge', getPriorityClass(task.priority)]">
                  {{ task.priority }}
                </span>
              </td>
              <td class="task-deadline">{{ task.deadline }}</td>
              <td class="task-status">
                <span :class="['status-badge', getStatusClass(task.status)]">
                  {{ task.status }}
                </span>
              </td>
              <td class="task-actions">
                <ButtonComponent 
                  @click="viewTaskDetails(task)" 
                  variant="secondary" 
                  size="small"
                  v-voix="'view-task-' + task.id"
                  :hint="`View details for task: ${task.title}`"
                >
                  View
                </ButtonComponent>
              </td>
            </tr>
            <tr v-if="sortedTasks.length === 0">
              <td colspan="5" class="no-tasks">No tasks match your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardComponent>

    <!-- New Task Modal -->
    <div class="modal" v-if="showNewTaskForm">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create New Task</h2>
          <button 
            class="modal-close" 
            @click="showNewTaskForm = false"
            v-voix="'close-new-task-form'"
            hint="Close the new task form"
          >
            &times;
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createTask">
            <div class="form-group">
              <label for="task-title">Title</label>
              <input 
                type="text" 
                id="task-title" 
                v-model="newTask.title" 
                required
                v-voix="'task-title-input'"
                hint="Enter the task title"
              />
            </div>
            <div class="form-group">
              <label for="task-description">Description</label>
              <textarea 
                id="task-description" 
                v-model="newTask.description"
                rows="4"
                v-voix="'task-description-input'"
                hint="Enter the task description"
              ></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="task-assignee">Assignee</label>
                <select 
                  id="task-assignee" 
                  v-model="newTask.assignee"
                  v-voix="'task-assignee-input'"
                  hint="Select the person assigned to this task"
                >
                  <option value="Demo User">Demo User</option>
                  <option value="John Smith">John Smith</option>
                  <option value="Jane Doe">Jane Doe</option>
                </select>
              </div>
              <div class="form-group">
                <label for="task-priority">Priority</label>
                <select 
                  id="task-priority" 
                  v-model="newTask.priority"
                  v-voix="'task-priority-input'"
                  hint="Select the task priority"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="task-deadline">Deadline</label>
                <input 
                  type="date" 
                  id="task-deadline" 
                  v-model="newTask.deadline"
                  required
                  v-voix="'task-deadline-input'"
                  hint="Select the task deadline date"
                />
              </div>
              <div class="form-group">
                <label for="task-status">Status</label>
                <select 
                  id="task-status" 
                  v-model="newTask.status"
                  v-voix="'task-status-input'"
                  hint="Select the initial task status"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <ButtonComponent 
                variant="secondary" 
                @click="showNewTaskForm = false"
                type="button"
                v-voix="'cancel-task-creation'"
                hint="Cancel task creation"
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent 
                variant="primary" 
                type="submit"
                v-voix="'submit-new-task'"
                hint="Create the new task"
              >
                Create Task
              </ButtonComponent>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <div class="modal" v-if="showTaskDetail && selectedTask">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Task Details</h2>
          <button 
            class="modal-close" 
            @click="showTaskDetail = false"
            v-voix="'close-task-details'"
            hint="Close task details"
          >
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="task-detail">
            <h3 class="task-detail-title">{{ selectedTask.title }}</h3>
            
            <div class="task-detail-meta">
              <div class="meta-item">
                <span class="meta-label">Status:</span>
                <span :class="['status-badge', getStatusClass(selectedTask.status)]">
                  {{ selectedTask.status }}
                </span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Priority:</span>
                <span :class="['priority-badge', getPriorityClass(selectedTask.priority)]">
                  {{ selectedTask.priority }}
                </span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Deadline:</span>
                <span>{{ selectedTask.deadline }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Assignee:</span>
                <span>{{ selectedTask.assignee }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Created:</span>
                <span>{{ selectedTask.createdAt }}</span>
              </div>
            </div>
            
            <div class="task-detail-description">
              <h4>Description</h4>
              <p>{{ selectedTask.description || 'No description provided.' }}</p>
            </div>
            
            <div class="task-detail-actions">
              <h4>Update Status</h4>
              <div class="status-actions">
                <ButtonComponent 
                  @click="updateTaskStatus(selectedTask, 'Open')" 
                  variant="secondary" 
                  size="small"
                  :disabled="selectedTask.status === 'Open'"
                  v-voix="'set-task-open'"
                  hint="Set task status to Open"
                >
                  Mark as Open
                </ButtonComponent>
                <ButtonComponent 
                  @click="updateTaskStatus(selectedTask, 'In Progress')" 
                  variant="info" 
                  size="small"
                  :disabled="selectedTask.status === 'In Progress'"
                  v-voix="'set-task-in-progress'"
                  hint="Set task status to In Progress"
                >
                  Mark as In Progress
                </ButtonComponent>
                <ButtonComponent 
                  @click="updateTaskStatus(selectedTask, 'Completed')" 
                  variant="success" 
                  size="small"
                  :disabled="selectedTask.status === 'Completed'"
                  v-voix="'set-task-completed'"
                  hint="Set task status to Completed"
                >
                  Mark as Completed
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tasks-view {
  margin: 0 auto;
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  margin: 0;
  font-weight: 600;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.filter-group label {
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  color: #666;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
}

.task-list-container {
  overflow-x: auto;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
}

.task-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  background-color: #f8f9fa;
  border-bottom: 2px solid var(--border-color);
}

.task-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sort-indicator {
  margin-left: 0.25rem;
}

.priority-badge,
.status-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-high {
  background-color: #ffebee;
  color: #e74c3c;
}

.priority-medium {
  background-color: #fff8e1;
  color: #f39c12;
}

.priority-low {
  background-color: #e8f5e9;
  color: #27ae60;
}

.status-open {
  background-color: #f0f9ff;
  color: #3498db;
}

.status-progress {
  background-color: #fff8e1;
  color: #f39c12;
}

.status-completed {
  background-color: #e8f5e9;
  color: #27ae60;
}

.no-tasks {
  text-align: center;
  padding: 2rem 0;
  color: #666;
  font-style: italic;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1.5rem;
}

/* Form styles */
.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Task detail styles */
.task-detail-title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.task-detail-meta {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.task-detail-description {
  margin-bottom: 1.5rem;
}

.task-detail-description h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.status-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
}
</style>