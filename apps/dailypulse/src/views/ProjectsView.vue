<script setup>
import { ref, computed } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import moment from 'moment'

// Mock projects data
const projects = ref([
  {
    id: 1,
    name: 'Marketing Campaign',
    description: 'Q2 social media campaign for new product launch',
    manager: 'Demo User',
    team: ['John Smith', 'Jane Doe', 'Demo User'],
    startDate: '2025-03-01',
    endDate: '2025-04-30',
    status: 'In Progress',
    progress: 65,
    tasks: [
      { id: 101, title: 'Define target audience', status: 'Completed', assignee: 'John Smith', dueDate: '2025-03-05' },
      { id: 102, title: 'Create content calendar', status: 'Completed', assignee: 'Demo User', dueDate: '2025-03-10' },
      { id: 103, title: 'Design social media assets', status: 'In Progress', assignee: 'Jane Doe', dueDate: '2025-03-20' },
      { id: 104, title: 'Schedule posts', status: 'Not Started', assignee: 'Demo User', dueDate: '2025-03-25' },
      { id: 105, title: 'Launch campaign', status: 'Not Started', assignee: 'Demo User', dueDate: '2025-04-01' }
    ],
    discussions: [
      { id: 201, author: 'John Smith', date: '2025-03-03', content: 'I\'ve completed the audience analysis. Main demographics are professionals aged 25-45.' },
      { id: 202, author: 'Demo User', date: '2025-03-04', content: 'Great work! I\'ll use that to refine our content calendar.' },
      { id: 203, author: 'Jane Doe', date: '2025-03-12', content: 'Started working on asset designs. I\'ll share some concepts by tomorrow.' }
    ]
  },
  {
    id: 2,
    name: 'Website Redesign',
    description: 'Refresh company website with modern design and improved UX',
    manager: 'Jane Doe',
    team: ['Jane Doe', 'Demo User', 'Alex Johnson'],
    startDate: '2025-02-15',
    endDate: '2025-04-15',
    status: 'At Risk',
    progress: 40,
    tasks: [
      { id: 201, title: 'Analyze current site performance', status: 'Completed', assignee: 'Demo User', dueDate: '2025-02-20' },
      { id: 202, title: 'Create wireframes', status: 'Completed', assignee: 'Jane Doe', dueDate: '2025-03-01' },
      { id: 203, title: 'Develop mockups', status: 'In Progress', assignee: 'Jane Doe', dueDate: '2025-03-15' },
      { id: 204, title: 'Content revision', status: 'Not Started', assignee: 'Alex Johnson', dueDate: '2025-03-30' },
      { id: 205, title: 'Frontend implementation', status: 'Not Started', assignee: 'Demo User', dueDate: '2025-04-10' }
    ],
    discussions: [
      { id: 301, author: 'Jane Doe', date: '2025-02-25', content: 'Wireframes are mostly done. Let\'s schedule a review meeting next week.' },
      { id: 302, author: 'Demo User', date: '2025-02-26', content: 'Sounds good. I\'ll send a calendar invite for Monday.' },
      { id: 303, author: 'Alex Johnson', date: '2025-03-02', content: 'Wireframes look great. I have some feedback about the navigation flow, let\'s discuss.' },
      { id: 304, author: 'Jane Doe', date: '2025-03-10', content: 'I\'ve incorporated the feedback. Working on high-fidelity mockups now.' }
    ]
  },
  {
    id: 3,
    name: 'Client Presentations',
    description: 'Quarterly review presentations for major clients',
    manager: 'Demo User',
    team: ['Demo User', 'John Smith'],
    startDate: '2025-03-10',
    endDate: '2025-03-30',
    status: 'On Track',
    progress: 90,
    tasks: [
      { id: 301, title: 'Gather performance data', status: 'Completed', assignee: 'John Smith', dueDate: '2025-03-12' },
      { id: 302, title: 'Create presentation slides', status: 'Completed', assignee: 'Demo User', dueDate: '2025-03-18' },
      { id: 303, title: 'Internal review', status: 'Completed', assignee: 'Demo User', dueDate: '2025-03-20' },
      { id: 304, title: 'Client presentations', status: 'In Progress', assignee: 'Demo User', dueDate: '2025-03-28' }
    ],
    discussions: [
      { id: 401, author: 'John Smith', date: '2025-03-15', content: 'All the data has been compiled. Some really positive results to share!' },
      { id: 402, author: 'Demo User', date: '2025-03-16', content: 'Thanks, John. I\'ll highlight those wins in the presentation.' },
      { id: 403, author: 'Demo User', date: '2025-03-21', content: 'Slides are ready and reviewed. First presentation scheduled for Monday.' }
    ]
  }
])

// Filter state
const filter = ref({
  status: 'all',
  manager: 'all'
})

// Selected project for details view
const selectedProject = ref(null)

// New comment for discussion
const newComment = ref('')

// New task form
const showNewTaskForm = ref(false)
const newTask = ref({
  title: '',
  assignee: '',
  dueDate: '',
  status: 'Not Started'
})

// Filter projects
const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    return (filter.value.status === 'all' || project.status === filter.value.status) &&
           (filter.value.manager === 'all' || project.manager === filter.value.manager)
  })
})

// Get all managers for filter dropdown
const managers = computed(() => {
  const managerSet = new Set()
  projects.value.forEach(project => {
    if (project.manager) {
      managerSet.add(project.manager)
    }
  })
  return ['all', ...Array.from(managerSet)]
})

// Select a project to view details
const selectProject = (project) => {
  selectedProject.value = project
  newComment.value = ''
}

// Add a new comment to project discussion
const addComment = () => {
  if (!selectedProject.value || newComment.value.trim() === '') return
  
  const comment = {
    id: Math.max(0, ...selectedProject.value.discussions.map(d => d.id)) + 1,
    author: 'Demo User',
    date: moment().format('YYYY-MM-DD'),
    content: newComment.value.trim()
  }
  
  // Add to project's discussions array
  const projectIndex = projects.value.findIndex(p => p.id === selectedProject.value.id)
  if (projectIndex !== -1) {
    projects.value[projectIndex].discussions.push(comment)
    selectedProject.value.discussions.push(comment)
    newComment.value = ''
  }
}

// Open new task form
const openNewTaskForm = () => {
  if (!selectedProject.value) return
  
  newTask.value = {
    title: '',
    assignee: selectedProject.value.team[0] || 'Demo User',
    dueDate: '',
    status: 'Not Started'
  }
  
  showNewTaskForm.value = true
}

// Add a new task to the project
const addTask = () => {
  if (!selectedProject.value || newTask.value.title.trim() === '' || !newTask.value.dueDate) return
  
  const task = {
    id: Math.max(0, ...selectedProject.value.tasks.map(t => t.id)) + 1,
    title: newTask.value.title.trim(),
    assignee: newTask.value.assignee,
    dueDate: newTask.value.dueDate,
    status: newTask.value.status
  }
  
  // Add to project's tasks array
  const projectIndex = projects.value.findIndex(p => p.id === selectedProject.value.id)
  if (projectIndex !== -1) {
    projects.value[projectIndex].tasks.push(task)
    selectedProject.value.tasks.push(task)
    showNewTaskForm.value = false
  }
}

// Update task status
const updateTaskStatus = (taskId, newStatus) => {
  if (!selectedProject.value) return
  
  const projectIndex = projects.value.findIndex(p => p.id === selectedProject.value.id)
  if (projectIndex !== -1) {
    const taskIndex = projects.value[projectIndex].tasks.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      projects.value[projectIndex].tasks[taskIndex].status = newStatus
      
      // Also update in the selected project object
      const selectedTaskIndex = selectedProject.value.tasks.findIndex(t => t.id === taskId)
      if (selectedTaskIndex !== -1) {
        selectedProject.value.tasks[selectedTaskIndex].status = newStatus
      }
      
      // Update project progress based on completed tasks
      const totalTasks = projects.value[projectIndex].tasks.length
      const completedTasks = projects.value[projectIndex].tasks.filter(t => t.status === 'Completed').length
      projects.value[projectIndex].progress = Math.round((completedTasks / totalTasks) * 100)
      selectedProject.value.progress = projects.value[projectIndex].progress
    }
  }
}

// Format date for display
const formatDate = (dateString) => {
  return moment(dateString).format('MMM D, YYYY')
}

// Get status class for styling
const getStatusClass = (status) => {
  return {
    'On Track': 'status-on-track',
    'In Progress': 'status-progress',
    'At Risk': 'status-risk',
    'Completed': 'status-completed',
    'Not Started': 'status-not-started'
  }[status] || ''
}

</script>

<template>
  <div class="projects-view">
    <div class="page-header">
      <h1 class="page-title">Projects</h1>
    </div>

    <div v-if="!selectedProject" class="projects-list-view">
      <CardComponent title="Project Filters">
        <div class="filters">
          <div class="filter-group">
            <label for="status-filter">Status</label>
            <select 
              id="status-filter" 
              v-model="filter.status"
              v-voix="'status-filter'"
              hint="Filter projects by status"
            >
              <option value="all">All Statuses</option>
              <option value="On Track">On Track</option>
              <option value="In Progress">In Progress</option>
              <option value="At Risk">At Risk</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="manager-filter">Project Manager</label>
            <select 
              id="manager-filter" 
              v-model="filter.manager"
              v-voix="'manager-filter'"
              hint="Filter projects by manager"
            >
              <option value="all">All Managers</option>
              <option v-for="manager in managers.filter(m => m !== 'all')" :key="manager" :value="manager">
                {{ manager }}
              </option>
            </select>
          </div>
        </div>
      </CardComponent>

      <div class="projects-grid">
        <CardComponent 
          v-for="project in filteredProjects" 
          :key="project.id" 
          :title="project.name"
          class="project-card"
        >
          <div class="project-card-content">
            <div class="project-meta">
              <div class="meta-item">
                <span class="meta-label">Status:</span>
                <span :class="['status-badge', getStatusClass(project.status)]">{{ project.status }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Manager:</span>
                <span>{{ project.manager }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Timeline:</span>
                <span>{{ formatDate(project.startDate) }} - {{ formatDate(project.endDate) }}</span>
              </div>
            </div>
            
            <p class="project-description">{{ project.description }}</p>
            
            <div class="project-progress">
              <div class="progress-info">
                <span class="progress-label">Progress</span>
                <span class="progress-percentage">{{ project.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="`width: ${project.progress}%`"></div>
              </div>
            </div>
            
            <div class="project-team">
              <div class="team-label">Team:</div>
              <div class="team-members">
                <span 
                  v-for="(member, index) in project.team" 
                  :key="index" 
                  class="team-member"
                >
                  {{ member }}{{ index < project.team.length - 1 ? ', ' : '' }}
                </span>
              </div>
            </div>
            
            <ButtonComponent 
              @click="selectProject(project)" 
              variant="primary" 
              block
              v-voix="'view-project-' + project.id"
              :hint="`View details for project: ${project.name}`"
            >
              View Project
            </ButtonComponent>
          </div>
        </CardComponent>
      </div>
    </div>

    <div v-else class="project-detail-view">
      <div class="detail-header">
        <ButtonComponent 
          @click="selectedProject = null" 
          variant="secondary" 
          size="small"
          v-voix="'back-to-projects'"
          hint="Return to projects list"
        >
          &larr; Back to Projects
        </ButtonComponent>
      </div>
      
      <CardComponent :title="selectedProject.name">
        <div class="project-overview">
          <div class="project-status-bar">
            <div :class="['status-badge', getStatusClass(selectedProject.status)]">
              {{ selectedProject.status }}
            </div>
            <div class="project-dates">
              {{ formatDate(selectedProject.startDate) }} - {{ formatDate(selectedProject.endDate) }}
            </div>
          </div>
          
          <p class="project-description">{{ selectedProject.description }}</p>
          
          <div class="project-progress">
            <div class="progress-info">
              <span class="progress-label">Progress</span>
              <span class="progress-percentage">{{ selectedProject.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="`width: ${selectedProject.progress}%`"></div>
            </div>
          </div>
          
          <div class="project-meta-grid">
            <div class="meta-item">
              <div class="meta-label">Project Manager</div>
              <div class="meta-value">{{ selectedProject.manager }}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Team Members</div>
              <div class="meta-value">
                <span v-for="(member, index) in selectedProject.team" :key="index">
                  {{ member }}{{ index < selectedProject.team.length - 1 ? ', ' : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardComponent>
      
      <div class="project-tabs">
        <div class="tab-row">
          <CardComponent title="Tasks">
            <div class="tasks-header">
              <h3>Project Tasks</h3>
              <ButtonComponent 
                @click="openNewTaskForm" 
                variant="primary" 
                size="small"
                v-voix="'add-task-button'"
                hint="Add a new task to this project"
              >
                Add Task
              </ButtonComponent>
            </div>
            
            <table class="tasks-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="task in selectedProject.tasks" :key="task.id">
                  <td>{{ task.title }}</td>
                  <td>{{ task.assignee }}</td>
                  <td>{{ formatDate(task.dueDate) }}</td>
                  <td>
                    <span :class="['status-badge', getStatusClass(task.status)]">
                      {{ task.status }}
                    </span>
                  </td>
                  <td>
                    <div class="task-actions">
                      <select 
                        :value="task.status"
                        @change="updateTaskStatus(task.id, $event.target.value)"
                        class="status-select"
                        v-voix="'update-task-status-' + task.id"
                        :hint="`Update status for task: ${task.title}`"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- New Task Form -->
            <div class="modal" v-if="showNewTaskForm">
              <div class="modal-content">
                <div class="modal-header">
                  <h2>Add New Task</h2>
                  <button 
                    class="modal-close" 
                    @click="showNewTaskForm = false"
                    v-voix="'close-new-task-form'"
                    hint="Close new task form"
                  >
                    &times;
                  </button>
                </div>
                <div class="modal-body">
                  <form @submit.prevent="addTask">
                    <div class="form-group">
                      <label for="task-title">Task Title</label>
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
                      <label for="task-assignee">Assignee</label>
                      <select 
                        id="task-assignee" 
                        v-model="newTask.assignee"
                        v-voix="'task-assignee-input'"
                        hint="Select the team member to assign this task to"
                      >
                        <option v-for="member in selectedProject.team" :key="member" :value="member">
                          {{ member }}
                        </option>
                      </select>
                    </div>
                    
                    <div class="form-group">
                      <label for="task-due-date">Due Date</label>
                      <input 
                        type="date" 
                        id="task-due-date" 
                        v-model="newTask.dueDate" 
                        required
                        v-voix="'task-due-date-input'"
                        hint="Set the due date for this task"
                      />
                    </div>
                    
                    <div class="form-group">
                      <label for="task-status">Status</label>
                      <select 
                        id="task-status" 
                        v-model="newTask.status"
                        v-voix="'task-status-input'"
                        hint="Set the initial status for this task"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
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
                        hint="Add the new task"
                      >
                        Add Task
                      </ButtonComponent>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </CardComponent>
        </div>
        
        <div class="tab-row">
          <CardComponent title="Discussions">
            <div class="discussions-list">
              <div v-if="selectedProject.discussions.length === 0" class="no-discussions">
                No discussions yet. Start the conversation!
              </div>
              
              <div 
                v-for="comment in selectedProject.discussions" 
                :key="comment.id" 
                class="comment"
              >
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-date">{{ formatDate(comment.date) }}</span>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
              </div>
            </div>
            
            <div class="new-comment">
              <h4>Add Comment</h4>
              <div class="comment-form">
                <textarea 
                  v-model="newComment" 
                  placeholder="Type your comment here..." 
                  rows="3"
                  v-voix="'new-comment-input'"
                  hint="Enter your comment for the project discussion"
                ></textarea>
                <ButtonComponent 
                  @click="addComment" 
                  variant="primary"
                  :disabled="!newComment.trim()"
                  v-voix="'post-comment-button'"
                  hint="Post your comment to the project discussion"
                >
                  Post Comment
                </ButtonComponent>
              </div>
            </div>
          </CardComponent>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-view {
  margin: 0 auto;
  max-width: 1200px;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  margin: 0;
  font-weight: 600;
}

/* Filters */
.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 200px;
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

/* Project cards */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.project-card {
  height: 100%;
}

.project-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-meta {
  margin-bottom: 1rem;
}

.meta-item {
  margin-bottom: 0.5rem;
}

.meta-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.status-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-on-track {
  background-color: #e8f5e9;
  color: #27ae60;
}

.status-progress {
  background-color: #e3f2fd;
  color: #2196f3;
}

.status-risk {
  background-color: #fff8e1;
  color: #f57f17;
}

.status-completed {
  background-color: #e8f5e9;
  color: #27ae60;
}

.status-not-started {
  background-color: #f5f5f5;
  color: #757575;
}

.project-description {
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.project-progress {
  margin-bottom: 1.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-weight: 500;
}

.progress-percentage {
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
}

.project-team {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
}

.team-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.team-members {
  flex: 1;
}

/* Project details */
.detail-header {
  margin-bottom: 1.5rem;
}

.project-overview {
  margin-bottom: 1.5rem;
}

.project-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.project-dates {
  font-size: 0.9rem;
  color: #666;
}

.project-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.meta-item .meta-label {
  display: block;
  margin-bottom: 0.25rem;
  color: #666;
  font-size: 0.9rem;
}

.meta-item .meta-value {
  font-weight: 500;
}

.project-tabs {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tab-row {
  flex: 1;
}

/* Tasks */
.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tasks-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
}

.tasks-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  background-color: #f8f9fa;
  border-bottom: 2px solid var(--border-color);
}

.tasks-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.status-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.85rem;
}

/* Discussions */
.discussions-list {
  margin-bottom: 1.5rem;
}

.no-discussions {
  text-align: center;
  padding: 2rem 0;
  color: #666;
  font-style: italic;
}

.comment {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.comment:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
}

.comment-date {
  font-size: 0.85rem;
  color: #666;
}

.comment-content {
  line-height: 1.5;
}

.new-comment h4 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  resize: vertical;
}

.comment-form button {
  align-self: flex-end;
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

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .project-meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>