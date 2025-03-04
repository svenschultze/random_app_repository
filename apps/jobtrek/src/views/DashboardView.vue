<script setup>
import { ref, onMounted, computed } from 'vue'

// Dashboard data
const userData = ref({
  name: 'Jane Doe',
  jobTitle: 'UX Designer',
  industry: 'Technology',
  todayTasksCount: 3,
  completedTasksCount: 2,
})

// Tasks for today
const todayTasks = ref([
  { id: 1, title: 'Complete UX design for new feature', priority: 'high', completed: true, goalCategory: 'short-term' },
  { id: 2, title: 'Review feedback from usability testing', priority: 'medium', completed: true, goalCategory: 'short-term' },
  { id: 3, title: 'Schedule training for new design tools', priority: 'low', completed: false, goalCategory: 'mid-term' },
])

// Recent achievements
const recentAchievements = ref([
  { id: 1, date: '2025-03-02', title: 'Presented design system at team meeting' },
  { id: 2, date: '2025-03-01', title: 'Completed advanced Figma certification' },
])

// Goals progress data
const goalsProgress = ref({
  shortTerm: 65, // Percentage complete
  midTerm: 42,
  longTerm: 20,
})

// Current date
const currentDate = ref(new Date())

const formattedDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return currentDate.value.toLocaleDateString('en-US', options)
})

// Toggle task completion
const toggleTaskCompletion = (taskId) => {
  const task = todayTasks.value.find(task => task.id === taskId)
  if (task) {
    task.completed = !task.completed
    
    // Update completed count
    userData.value.completedTasksCount = todayTasks.value.filter(task => task.completed).length
  }
}

// Task completion progress
const taskCompletionPercentage = computed(() => {
  if (todayTasks.value.length === 0) return 0
  return Math.round((userData.value.completedTasksCount / userData.value.todayTasksCount) * 100)
})

// Upcoming deadline
const nextDeadline = ref('March 15, 2025 - Portfolio Review')

onMounted(() => {
  // In a real app, this would fetch data from API
  console.log('Dashboard mounted, data would be fetched here')
})
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 v-voix="'Dashboard Title'">My Dashboard</h1>
      <p class="current-date" v-voix="'Current Date'">{{ formattedDate }}</p>
    </div>

    <div class="dashboard-greeting">
      <h2 v-voix="'Dashboard Welcome Message'">Welcome back, {{ userData.name }}!</h2>
      <p>{{ userData.jobTitle }} in {{ userData.industry }}</p>
    </div>

    <div class="dashboard-grid">
      <!-- Today's Tasks Card -->
      <div class="dashboard-card tasks-card">
        <div class="card-header">
          <h3 v-voix="'Today Tasks Section'">Today's Tasks</h3>
          <span class="badge" v-voix="'Task Completion Status'">
            {{ userData.completedTasksCount }}/{{ userData.todayTasksCount }}
          </span>
        </div>
        
        <div class="progress-bar">
          <div class="progress-indicator" :style="{ width: `${taskCompletionPercentage}%` }"></div>
        </div>
        
        <ul class="tasks-list">
          <li 
            v-for="task in todayTasks" 
            :key="task.id" 
            class="task-item"
            :class="{ completed: task.completed }"
          >
            <label class="task-checkbox-label">
              <input 
                type="checkbox" 
                :checked="task.completed" 
                @change="toggleTaskCompletion(task.id)"
                v-voix="`Toggle Task ${task.id} Completion`"
                :hint="`Mark task '${task.title}' as ${task.completed ? 'incomplete' : 'complete'}`"
              />
              <span class="task-checkbox"></span>
            </label>
            <div class="task-content">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-priority" :class="task.priority">{{ task.priority }}</span>
            </div>
          </li>
        </ul>
        
        <button 
          class="btn-text view-all-btn"
          v-voix="'View All Tasks Button'"
          hint="Go to the full tasks list page"
        >
          View all tasks
        </button>
      </div>

      <!-- Goals Progress Card -->
      <div class="dashboard-card goals-card">
        <div class="card-header">
          <h3 v-voix="'Goals Progress Section'">Goals Progress</h3>
        </div>
        
        <div class="goal-progress-item">
          <div class="goal-label">
            <span>Short-term Goals</span>
            <span>{{ goalsProgress.shortTerm }}%</span>
          </div>
          <div class="goal-progress-bar">
            <div class="goal-progress-indicator" :style="{ width: `${goalsProgress.shortTerm}%` }"></div>
          </div>
        </div>
        
        <div class="goal-progress-item">
          <div class="goal-label">
            <span>Mid-term Goals</span>
            <span>{{ goalsProgress.midTerm }}%</span>
          </div>
          <div class="goal-progress-bar">
            <div class="goal-progress-indicator" :style="{ width: `${goalsProgress.midTerm}%` }"></div>
          </div>
        </div>
        
        <div class="goal-progress-item">
          <div class="goal-label">
            <span>Long-term Goals</span>
            <span>{{ goalsProgress.longTerm }}%</span>
          </div>
          <div class="goal-progress-bar">
            <div class="goal-progress-indicator" :style="{ width: `${goalsProgress.longTerm}%` }"></div>
          </div>
        </div>
        
        <button 
          class="btn-text view-all-btn"
          v-voix="'View All Goals Button'"
          hint="Go to the goals management page"
        >
          Manage goals
        </button>
      </div>

      <!-- Recent Achievements Card -->
      <div class="dashboard-card achievements-card">
        <div class="card-header">
          <h3 v-voix="'Recent Achievements Section'">Recent Achievements</h3>
        </div>
        
        <ul class="achievements-list">
          <li 
            v-for="achievement in recentAchievements" 
            :key="achievement.id"
            class="achievement-item"
            v-voix="`Achievement ${achievement.id}`"
          >
            <div class="achievement-date">{{ new Date(achievement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</div>
            <div class="achievement-title">{{ achievement.title }}</div>
          </li>
        </ul>
        
        <button 
          class="btn-primary add-achievement-btn"
          v-voix="'Add New Achievement Button'"
          hint="Record a new professional achievement"
        >
          Add achievement
        </button>
      </div>

      <!-- Quick Stats Card -->
      <div class="dashboard-card stats-card">
        <div class="card-header">
          <h3 v-voix="'Quick Stats Section'">Quick Stats</h3>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item" v-voix="'Weekly Progress Statistic'">
            <div class="stat-value">12</div>
            <div class="stat-label">Tasks this week</div>
          </div>
          
          <div class="stat-item" v-voix="'Monthly Progress Statistic'">
            <div class="stat-value">42</div>
            <div class="stat-label">Tasks this month</div>
          </div>
          
          <div class="stat-item" v-voix="'Streak Statistic'">
            <div class="stat-value">7</div>
            <div class="stat-label">Day streak</div>
          </div>
          
          <div class="stat-item" v-voix="'Next Deadline Statistic'">
            <div class="stat-value">
              <span class="deadline-label">Next deadline</span>
            </div>
            <div class="stat-label deadline-value">{{ nextDeadline }}</div>
          </div>
        </div>
        
        <button 
          class="btn-text view-all-btn"
          v-voix="'View Analytics Button'"
          hint="Go to the detailed analytics page"
        >
          View analytics
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.dashboard-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.current-date {
  color: #666;
  font-size: 0.9rem;
}

.dashboard-greeting {
  margin-bottom: 2rem;
}

.dashboard-greeting h2 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.dashboard-greeting p {
  color: #666;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.dashboard-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  font-size: 1.2rem;
  margin: 0;
  color: #2c3e50;
}

.badge {
  background-color: #42b983;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.progress-bar {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.progress-indicator {
  height: 100%;
  background-color: #42b983;
  transition: width 0.3s ease;
}

.tasks-list {
  padding: 0;
  margin: 0 0 1rem 0;
  list-style-type: none;
}

.task-item {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #999;
}

.task-checkbox-label {
  display: block;
  position: relative;
  padding-left: 30px;
  margin-right: 15px;
  cursor: pointer;
  user-select: none;
}

.task-checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.task-checkbox {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 4px;
}

.task-checkbox-label:hover input ~ .task-checkbox {
  background-color: #ccc;
}

.task-checkbox-label input:checked ~ .task-checkbox {
  background-color: #42b983;
}

.task-checkbox:after {
  content: "";
  position: absolute;
  display: none;
}

.task-checkbox-label input:checked ~ .task-checkbox:after {
  display: block;
}

.task-checkbox-label .task-checkbox:after {
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.task-content {
  flex: 1;
}

.task-title {
  display: block;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.task-priority {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  text-transform: uppercase;
}

.task-priority.high {
  background-color: #ffebee;
  color: #e53935;
}

.task-priority.medium {
  background-color: #fff8e1;
  color: #ffa000;
}

.task-priority.low {
  background-color: #e8f5e9;
  color: #43a047;
}

.goal-progress-item {
  margin-bottom: 1.25rem;
}

.goal-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.goal-progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.goal-progress-indicator {
  height: 100%;
  background-color: #42b983;
  transition: width 0.3s ease;
}

.achievements-list {
  padding: 0;
  margin: 0 0 1.5rem 0;
  list-style-type: none;
}

.achievement-item {
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.achievement-item:last-child {
  border-bottom: none;
}

.achievement-date {
  min-width: 80px;
  font-size: 0.85rem;
  color: #666;
}

.achievement-title {
  flex: 1;
  font-size: 0.95rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.deadline-label {
  font-size: 0.9rem;
}

.deadline-value {
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.view-all-btn {
  display: block;
  width: 100%;
  text-align: center;
  border: none;
  background: none;
  color: #42b983;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  margin-top: 0.5rem;
}

.view-all-btn:hover {
  text-decoration: underline;
}

.btn-primary {
  width: 100%;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #3aa876;
}

.btn-text {
  background: none;
  border: none;
  color: #42b983;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.5rem;
}

.btn-text:hover {
  text-decoration: underline;
}

.add-achievement-btn {
  margin-top: 1rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .current-date {
    margin-top: 0.5rem;
  }
}
</style>