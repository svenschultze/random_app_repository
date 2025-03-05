<script setup>
import { ref, onMounted } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Mock performance data
const performanceMetrics = ref({
  tasks: {
    completed: 87,
    totalAssigned: 104,
    onTime: 76,
    overdue: 11,
    byMonth: [42, 45, 38, 52, 60, 65, 57, 63, 68, 75, 82, 87]
  },
  projects: {
    involved: 6,
    completed: 8,
    onTrack: 4,
    atRisk: 2,
    contribution: {
      'Marketing Campaign': 35,
      'Website Redesign': 20,
      'Mobile App Development': 15,
      'Client Presentations': 15,
      'Product Release': 10,
      'Team Training': 5
    }
  },
  time: {
    averageHours: 7.8,
    weeklyHours: [38.5, 40.2, 39.0, 42.5, 37.8, 41.2, 39.5, 38.0, 40.5, 41.0, 39.2, 40.8],
    utilization: 85,
    overtime: 12
  },
  feedback: [
    { 
      id: 1, 
      title: 'Q1 Performance Review', 
      date: '2025-01-15', 
      reviewer: 'Jane Doe', 
      rating: 4.2,
      strengths: ['Communication skills', 'Project management', 'Time management'],
      improvements: ['Technical documentation', 'Delegation'],
      comments: 'Consistently delivers high-quality work and meets deadlines. Shows excellent team leadership.'
    },
    { 
      id: 2, 
      title: 'Website Redesign Project', 
      date: '2025-02-28', 
      reviewer: 'John Smith', 
      rating: 4.5,
      strengths: ['UI/UX knowledge', 'Stakeholder management', 'Creative problem-solving'],
      improvements: ['Technical handoff documentation'],
      comments: 'Excellent work managing the website redesign project. Kept the team focused and delivered ahead of schedule.'
    }
  ],
  goals: [
    { 
      id: 1, 
      title: 'Complete Advanced Project Management Certification', 
      category: 'Professional Development',
      dueDate: '2025-06-30',
      progress: 65,
      status: 'On Track'
    },
    { 
      id: 2, 
      title: 'Improve Team Productivity by 15%', 
      category: 'Team Management',
      dueDate: '2025-12-31',
      progress: 40,
      status: 'On Track'
    },
    { 
      id: 3, 
      title: 'Reduce Project Delivery Time by 10%', 
      category: 'Efficiency',
      dueDate: '2025-09-30',
      progress: 30,
      status: 'At Risk'
    },
    { 
      id: 4, 
      title: 'Mentor Two Junior Team Members', 
      category: 'Leadership',
      dueDate: '2025-12-31',
      progress: 50,
      status: 'On Track'
    }
  ]
})

// Selected feedback for detailed view
const selectedFeedback = ref(null)

// New goal form
const showNewGoalForm = ref(false)
const newGoal = ref({
  title: '',
  category: 'Professional Development',
  dueDate: '',
  progress: 0,
  status: 'Not Started'
})

// Categories for goals
const goalCategories = [
  'Professional Development',
  'Team Management',
  'Efficiency',
  'Leadership',
  'Technical Skills',
  'Client Relations'
]

// Goal statuses
const goalStatuses = [
  'Not Started',
  'On Track',
  'At Risk',
  'Completed'
]

// Update goal progress
const updateGoalProgress = (goalId, newProgress) => {
  const goalIndex = performanceMetrics.value.goals.findIndex(goal => goal.id === goalId)
  if (goalIndex !== -1) {
    performanceMetrics.value.goals[goalIndex].progress = parseInt(newProgress, 10)
    
    // Update status based on progress
    const goal = performanceMetrics.value.goals[goalIndex]
    if (goal.progress === 100) {
      goal.status = 'Completed'
    } else if (goal.progress < 20 && goal.status !== 'At Risk') {
      goal.status = 'Not Started'
    } else if (goal.status !== 'At Risk') {
      goal.status = 'On Track'
    }
  }
}

// Update goal status
const updateGoalStatus = (goalId, newStatus) => {
  const goalIndex = performanceMetrics.value.goals.findIndex(goal => goal.id === goalId)
  if (goalIndex !== -1) {
    performanceMetrics.value.goals[goalIndex].status = newStatus
  }
}

// Add new goal
const addNewGoal = () => {
  if (newGoal.value.title.trim() === '' || !newGoal.value.dueDate) return
  
  const goal = {
    id: Math.max(0, ...performanceMetrics.value.goals.map(g => g.id)) + 1,
    title: newGoal.value.title.trim(),
    category: newGoal.value.category,
    dueDate: newGoal.value.dueDate,
    progress: parseInt(newGoal.value.progress, 10) || 0,
    status: newGoal.value.status
  }
  
  performanceMetrics.value.goals.push(goal)
  
  // Reset form
  newGoal.value = {
    title: '',
    category: 'Professional Development',
    dueDate: '',
    progress: 0,
    status: 'Not Started'
  }
  
  showNewGoalForm.value = false
}

// Show feedback details
const viewFeedbackDetails = (feedback) => {
  selectedFeedback.value = feedback
}

// Close feedback details
const closeFeedbackDetails = () => {
  selectedFeedback.value = null
}

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Get status class for styling
const getStatusClass = (status) => {
  return {
    'Not Started': 'status-not-started',
    'On Track': 'status-on-track',
    'At Risk': 'status-at-risk',
    'Completed': 'status-completed'
  }[status] || ''
}

// Initialize charts
onMounted(() => {
  renderTaskCompletionChart()
  renderProjectContributionChart()
  renderWeeklyHoursChart()
})

// Render task completion chart
const renderTaskCompletionChart = () => {
  const ctx = document.getElementById('taskCompletionChart')
  if (!ctx) return
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Tasks Completed',
        data: performanceMetrics.value.tasks.byMonth,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Monthly Task Completion'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Tasks'
          }
        }
      }
    }
  })
}

// Render project contribution chart
const renderProjectContributionChart = () => {
  const ctx = document.getElementById('projectContributionChart')
  if (!ctx) return
  
  const projectData = performanceMetrics.value.projects.contribution
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(projectData),
      datasets: [{
        data: Object.values(projectData),
        backgroundColor: [
          '#3498db',
          '#2ecc71',
          '#f39c12',
          '#e74c3c',
          '#9b59b6',
          '#1abc9c'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Project Contribution (%)'
        },
        legend: {
          position: 'right'
        }
      }
    }
  })
}

// Render weekly hours chart
const renderWeeklyHoursChart = () => {
  const ctx = document.getElementById('weeklyHoursChart')
  if (!ctx) return
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Weekly Hours Average',
        data: performanceMetrics.value.time.weeklyHours,
        backgroundColor: '#2ecc71'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Weekly Hours Worked'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Hours'
          }
        }
      }
    }
  })
}
</script>

<template>
  <div class="performance-view">
    <div class="page-header">
      <h1 class="page-title">Performance Tracking</h1>
    </div>

    <div class="metrics-overview">
      <div class="metrics-group">
        <CardComponent title="Task Metrics" class="metric-card">
          <div class="metric-content">
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.tasks.completed }}</div>
                <div class="metric-label">Tasks Completed</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.tasks.totalAssigned }}</div>
                <div class="metric-label">Total Assigned</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.tasks.onTime }}</div>
                <div class="metric-label">On Time</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.tasks.overdue }}</div>
                <div class="metric-label">Overdue</div>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="taskCompletionChart"></canvas>
            </div>
          </div>
        </CardComponent>
      </div>

      <div class="metrics-group">
        <CardComponent title="Project Metrics" class="metric-card">
          <div class="metric-content">
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.projects.involved }}</div>
                <div class="metric-label">Active Projects</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.projects.completed }}</div>
                <div class="metric-label">Completed</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.projects.onTrack }}</div>
                <div class="metric-label">On Track</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.projects.atRisk }}</div>
                <div class="metric-label">At Risk</div>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="projectContributionChart"></canvas>
            </div>
          </div>
        </CardComponent>
      </div>

      <div class="metrics-group">
        <CardComponent title="Time Metrics" class="metric-card">
          <div class="metric-content">
            <div class="metrics-row">
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.time.averageHours }}</div>
                <div class="metric-label">Avg. Daily Hours</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.time.utilization }}%</div>
                <div class="metric-label">Utilization</div>
              </div>
              <div class="metric-item">
                <div class="metric-value">{{ performanceMetrics.time.overtime }}</div>
                <div class="metric-label">Overtime Hours</div>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="weeklyHoursChart"></canvas>
            </div>
          </div>
        </CardComponent>
      </div>
    </div>

    <div class="goals-section">
      <CardComponent title="Performance Goals">
        <div class="goals-header">
          <h3>Your Goals</h3>
          <ButtonComponent 
            @click="showNewGoalForm = true" 
            variant="primary" 
            size="small"
            v-voix="'add-goal-button'"
            hint="Add a new performance goal"
          >
            Add Goal
          </ButtonComponent>
        </div>
        
        <div class="goals-list">
          <div v-for="goal in performanceMetrics.goals" :key="goal.id" class="goal-item">
            <div class="goal-header">
              <h4 class="goal-title">{{ goal.title }}</h4>
              <div :class="['goal-status', getStatusClass(goal.status)]">
                {{ goal.status }}
              </div>
            </div>
            
            <div class="goal-meta">
              <div class="goal-category">{{ goal.category }}</div>
              <div class="goal-due-date">Due: {{ formatDate(goal.dueDate) }}</div>
            </div>
            
            <div class="goal-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="`width: ${goal.progress}%`"></div>
              </div>
              <div class="progress-text">{{ goal.progress }}% Complete</div>
            </div>
            
            <div class="goal-actions">
              <div class="form-group">
                <label for="progress-{{ goal.id }}">Update Progress</label>
                <input 
                  type="range" 
                  :id="'progress-' + goal.id" 
                  :value="goal.progress" 
                  min="0" 
                  max="100" 
                  step="5"
                  @input="updateGoalProgress(goal.id, $event.target.value)"
                  v-voix="'update-progress-' + goal.id"
                  :hint="`Update progress for goal: ${goal.title}`"
                />
              </div>
              
              <div class="form-group">
                <label for="status-{{ goal.id }}">Status</label>
                <select 
                  :id="'status-' + goal.id" 
                  :value="goal.status"
                  @change="updateGoalStatus(goal.id, $event.target.value)"
                  v-voix="'update-status-' + goal.id"
                  :hint="`Update status for goal: ${goal.title}`"
                >
                  <option v-for="status in goalStatuses" :key="status" :value="status">
                    {{ status }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- New Goal Form Modal -->
        <div class="modal" v-if="showNewGoalForm">
          <div class="modal-content">
            <div class="modal-header">
              <h2>Add New Goal</h2>
              <button 
                class="modal-close" 
                @click="showNewGoalForm = false"
                v-voix="'close-new-goal-form'"
                hint="Close new goal form"
              >
                &times;
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addNewGoal">
                <div class="form-group">
                  <label for="goal-title">Goal Title</label>
                  <input 
                    type="text" 
                    id="goal-title" 
                    v-model="newGoal.title" 
                    required
                    v-voix="'goal-title-input'"
                    hint="Enter the goal title"
                  />
                </div>
                
                <div class="form-group">
                  <label for="goal-category">Category</label>
                  <select 
                    id="goal-category" 
                    v-model="newGoal.category"
                    v-voix="'goal-category-input'"
                    hint="Select the goal category"
                  >
                    <option v-for="category in goalCategories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="goal-due-date">Due Date</label>
                  <input 
                    type="date" 
                    id="goal-due-date" 
                    v-model="newGoal.dueDate" 
                    required
                    v-voix="'goal-due-date-input'"
                    hint="Set the goal due date"
                  />
                </div>
                
                <div class="form-group">
                  <label for="goal-status">Initial Status</label>
                  <select 
                    id="goal-status" 
                    v-model="newGoal.status"
                    v-voix="'goal-status-input'"
                    hint="Set the initial goal status"
                  >
                    <option v-for="status in goalStatuses" :key="status" :value="status">
                      {{ status }}
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="goal-progress">Initial Progress ({{ newGoal.progress }}%)</label>
                  <input 
                    type="range" 
                    id="goal-progress" 
                    v-model.number="newGoal.progress" 
                    min="0" 
                    max="100" 
                    step="5"
                    v-voix="'goal-progress-input'"
                    hint="Set the initial goal progress"
                  />
                </div>
                
                <div class="form-actions">
                  <ButtonComponent 
                    variant="secondary" 
                    @click="showNewGoalForm = false"
                    type="button"
                    v-voix="'cancel-goal-creation'"
                    hint="Cancel goal creation"
                  >
                    Cancel
                  </ButtonComponent>
                  <ButtonComponent 
                    variant="primary" 
                    type="submit"
                    v-voix="'submit-new-goal'"
                    hint="Add the new goal"
                  >
                    Add Goal
                  </ButtonComponent>
                </div>
              </form>
            </div>
          </div>
        </div>
      </CardComponent>
    </div>

    <div class="feedback-section">
      <CardComponent title="Performance Feedback">
        <div class="feedback-list">
          <div v-for="feedback in performanceMetrics.feedback" :key="feedback.id" class="feedback-item">
            <div class="feedback-header">
              <h4 class="feedback-title">{{ feedback.title }}</h4>
              <div class="feedback-rating">
                <span class="rating-value">{{ feedback.rating }}/5</span>
                <div class="rating-stars">
                  <span 
                    v-for="n in 5" 
                    :key="n" 
                    :class="['star', { filled: n <= Math.round(feedback.rating) }]"
                  >★</span>
                </div>
              </div>
            </div>
            
            <div class="feedback-meta">
              <div class="feedback-reviewer">By: {{ feedback.reviewer }}</div>
              <div class="feedback-date">{{ formatDate(feedback.date) }}</div>
            </div>
            
            <ButtonComponent 
              @click="viewFeedbackDetails(feedback)" 
              variant="secondary" 
              size="small" 
              block
              v-voix="'view-feedback-' + feedback.id"
              :hint="`View details for feedback: ${feedback.title}`"
            >
              View Details
            </ButtonComponent>
          </div>
        </div>
        
        <!-- Feedback Detail Modal -->
        <div class="modal" v-if="selectedFeedback">
          <div class="modal-content">
            <div class="modal-header">
              <h2>{{ selectedFeedback.title }}</h2>
              <button 
                class="modal-close" 
                @click="closeFeedbackDetails"
                v-voix="'close-feedback-details'"
                hint="Close feedback details"
              >
                &times;
              </button>
            </div>
            <div class="modal-body">
              <div class="feedback-detail">
                <div class="feedback-detail-header">
                  <div class="detail-meta">
                    <div class="meta-item">
                      <span class="meta-label">Reviewer:</span>
                      <span>{{ selectedFeedback.reviewer }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Date:</span>
                      <span>{{ formatDate(selectedFeedback.date) }}</span>
                    </div>
                  </div>
                  
                  <div class="detail-rating">
                    <span class="meta-label">Rating:</span>
                    <span class="rating-value">{{ selectedFeedback.rating }}/5</span>
                    <div class="rating-stars">
                      <span 
                        v-for="n in 5" 
                        :key="n" 
                        :class="['star', { filled: n <= Math.round(selectedFeedback.rating) }]"
                      >★</span>
                    </div>
                  </div>
                </div>
                
                <div class="feedback-strengths">
                  <h4>Strengths</h4>
                  <ul>
                    <li v-for="(strength, index) in selectedFeedback.strengths" :key="index">
                      {{ strength }}
                    </li>
                  </ul>
                </div>
                
                <div class="feedback-improvements">
                  <h4>Areas for Improvement</h4>
                  <ul>
                    <li v-for="(improvement, index) in selectedFeedback.improvements" :key="index">
                      {{ improvement }}
                    </li>
                  </ul>
                </div>
                
                <div class="feedback-comments">
                  <h4>Comments</h4>
                  <p>{{ selectedFeedback.comments }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardComponent>
    </div>
  </div>
</template>

<style scoped>
.performance-view {
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

/* Metrics Overview */
.metrics-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .metrics-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .metrics-overview {
    grid-template-columns: 1fr;
  }
}

.metric-card {
  height: 100%;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 1024px) {
  .metrics-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.metric-item {
  text-align: center;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.85rem;
  color: #666;
}

.chart-container {
  height: 250px;
}

/* Goals Section */
.goals-section {
  margin-bottom: 1.5rem;
}

.goals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.goals-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.goals-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.goal-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  background-color: white;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.goal-title {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.3;
  flex: 1;
  padding-right: 1rem;
}

.goal-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}

.status-not-started {
  background-color: #f5f5f5;
  color: #757575;
}

.status-on-track {
  background-color: #e8f5e9;
  color: #27ae60;
}

.status-at-risk {
  background-color: #fff8e1;
  color: #f57f17;
}

.status-completed {
  background-color: #e8f5e9;
  color: #27ae60;
}

.goal-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
}

.goal-progress {
  margin-bottom: 1.25rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
}

.progress-text {
  font-size: 0.85rem;
  text-align: right;
  color: #666;
}

.goal-actions {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

/* Feedback Section */
.feedback-section {
  margin-bottom: 1.5rem;
}

.feedback-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.feedback-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  background-color: white;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.feedback-title {
  margin: 0;
  font-size: 1.1rem;
  flex: 1;
  padding-right: 1rem;
}

.feedback-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.rating-value {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.rating-stars {
  display: flex;
}

.star {
  font-size: 1rem;
  color: #ddd;
}

.star.filled {
  color: #f39c12;
}

.feedback-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
}

/* Form styles */
.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.85rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-group input[type="range"] {
  padding: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
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

/* Feedback detail styles */
.feedback-detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.detail-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.feedback-strengths,
.feedback-improvements,
.feedback-comments {
  margin-bottom: 1.5rem;
}

.feedback-strengths h4,
.feedback-improvements h4,
.feedback-comments h4 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
}

.feedback-strengths ul,
.feedback-improvements ul {
  padding-left: 1.5rem;
  margin: 0;
}

.feedback-strengths li,
.feedback-improvements li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .goals-list,
  .feedback-list {
    grid-template-columns: 1fr;
  }
  
  .goal-actions {
    grid-template-columns: 1fr;
  }
  
  .feedback-detail-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .detail-rating {
    align-items: flex-start;
  }
}
</style>