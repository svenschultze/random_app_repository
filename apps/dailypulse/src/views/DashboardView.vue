<script setup>
import { ref, onMounted } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const tasks = ref([
  { id: 1, title: 'Complete quarterly report', priority: 'High', deadline: '2025-03-06', status: 'In Progress' },
  { id: 2, title: 'Review marketing strategy', priority: 'Medium', deadline: '2025-03-08', status: 'Open' },
  { id: 3, title: 'Prepare presentation for client meeting', priority: 'High', deadline: '2025-03-05', status: 'Open' },
  { id: 4, title: 'Update website content', priority: 'Low', deadline: '2025-03-10', status: 'In Progress' }
])

const meetings = ref([
  { id: 1, title: 'Team Sync', time: '10:30 AM', duration: '30 min', location: 'Conference Room A' },
  { id: 2, title: 'Client Call', time: '02:00 PM', duration: '1 hour', location: 'Zoom Meeting' },
  { id: 3, title: 'Project Kickoff', time: '04:00 PM', duration: '45 min', location: 'Conference Room B' }
])

const timeLogs = ref([
  { id: 1, date: '2025-03-05', timeIn: '08:30 AM', timeOut: '05:00 PM', project: 'Marketing Campaign', hours: 7.5 },
  { id: 2, date: '2025-03-04', timeIn: '09:00 AM', timeOut: '06:30 PM', project: 'Website Redesign', hours: 8.5 },
  { id: 3, date: '2025-03-03', timeIn: '08:45 AM', timeOut: '04:45 PM', project: 'Client Presentations', hours: 7 }
])

const projects = ref([
  { id: 1, name: 'Marketing Campaign', progress: 65, status: 'On Track' },
  { id: 2, name: 'Website Redesign', progress: 40, status: 'Delayed' },
  { id: 3, name: 'Client Presentations', progress: 90, status: 'On Track' }
])

const metrics = ref({
  tasksCompleted: 24,
  tasksInProgress: 10,
  totalProjects: 6,
  hoursLogged: 145.5
})

onMounted(() => {
  // Render Chart
  renderPerformanceChart()
})

const renderPerformanceChart = () => {
  const ctx = document.getElementById('performanceChart')
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          {
            label: 'Tasks Completed',
            data: [4, 6, 8, 5, 7],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Hours Logged',
            data: [7.5, 8, 7, 8.5, 7.2],
            borderColor: '#27ae60',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Weekly Performance'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
}

const getStatusClass = (status) => {
  return {
    'Open': 'status-open',
    'In Progress': 'status-progress',
    'Completed': 'status-completed',
    'On Track': 'status-on-track',
    'Delayed': 'status-delayed'
  }[status] || ''
}
</script>

<template>
  <div class="dashboard">
    <h1 class="page-title">Dashboard</h1>
    
    <div class="metrics-row">
      <CardComponent title="Tasks" class="metric-card">
        <div class="metric-content">
          <div class="metric-value">{{ metrics.tasksCompleted }}</div>
          <div class="metric-label">Tasks Completed</div>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ metrics.tasksInProgress }}</div>
          <div class="metric-label">In Progress</div>
        </div>
      </CardComponent>
      
      <CardComponent title="Projects" class="metric-card">
        <div class="metric-content">
          <div class="metric-value">{{ metrics.totalProjects }}</div>
          <div class="metric-label">Active Projects</div>
        </div>
      </CardComponent>
      
      <CardComponent title="Time" class="metric-card">
        <div class="metric-content">
          <div class="metric-value">{{ metrics.hoursLogged }}</div>
          <div class="metric-label">Hours Logged</div>
        </div>
      </CardComponent>
    </div>

    <div class="dashboard-row">
      <div class="dashboard-col">
        <CardComponent title="Today's Tasks">
          <ul class="task-list">
            <li v-for="task in tasks" :key="task.id" class="task-item">
              <div class="task-details">
                <h4 class="task-title">{{ task.title }}</h4>
                <div class="task-meta">
                  <span class="task-deadline">Due: {{ task.deadline }}</span>
                  <span :class="['task-status', getStatusClass(task.status)]">{{ task.status }}</span>
                </div>
              </div>
              <div class="task-priority" :class="`priority-${task.priority.toLowerCase()}`">
                {{ task.priority }}
              </div>
            </li>
          </ul>
          <div class="view-all-link">
            <RouterLink to="/tasks" v-voix="'view-all-tasks'" hint="Navigate to all tasks">View All Tasks</RouterLink>
          </div>
        </CardComponent>

        <CardComponent title="Upcoming Meetings">
          <ul class="meeting-list">
            <li v-for="meeting in meetings" :key="meeting.id" class="meeting-item">
              <div class="meeting-time">{{ meeting.time }}</div>
              <div class="meeting-details">
                <h4 class="meeting-title">{{ meeting.title }}</h4>
                <div class="meeting-meta">
                  <span class="meeting-duration">{{ meeting.duration }}</span>
                  <span class="meeting-location">{{ meeting.location }}</span>
                </div>
              </div>
            </li>
          </ul>
          <div class="view-all-link">
            <RouterLink to="/schedule" v-voix="'view-schedule'" hint="Navigate to full schedule">View Full Schedule</RouterLink>
          </div>
        </CardComponent>
      </div>

      <div class="dashboard-col">
        <CardComponent title="Recent Time Logs">
          <ul class="time-log-list">
            <li v-for="log in timeLogs" :key="log.id" class="time-log-item">
              <div class="time-log-date">{{ log.date }}</div>
              <div class="time-log-details">
                <div class="time-log-hours">{{ log.hours }} hours</div>
                <div class="time-log-project">{{ log.project }}</div>
                <div class="time-log-time">{{ log.timeIn }} - {{ log.timeOut }}</div>
              </div>
            </li>
          </ul>
          <div class="clock-actions">
            <ButtonComponent variant="primary" v-voix="'clock-in-button'" hint="Clock in for your shift">
              Clock In
            </ButtonComponent>
            <ButtonComponent variant="secondary" v-voix="'clock-out-button'" hint="Clock out for your shift">
              Clock Out
            </ButtonComponent>
          </div>
          <div class="view-all-link">
            <RouterLink to="/time-tracking" v-voix="'view-time-tracking'" hint="Navigate to time tracking">View Time Tracking</RouterLink>
          </div>
        </CardComponent>

        <CardComponent title="Project Progress">
          <ul class="project-list">
            <li v-for="project in projects" :key="project.id" class="project-item">
              <div class="project-details">
                <h4 class="project-title">{{ project.name }}</h4>
                <span :class="['project-status', getStatusClass(project.status)]">{{ project.status }}</span>
              </div>
              <div class="project-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="`width: ${project.progress}%`"></div>
                </div>
                <span class="progress-text">{{ project.progress }}%</span>
              </div>
            </li>
          </ul>
          <div class="view-all-link">
            <RouterLink to="/projects" v-voix="'view-projects'" hint="Navigate to projects">View All Projects</RouterLink>
          </div>
        </CardComponent>
      </div>
    </div>

    <CardComponent title="Performance Metrics">
      <div class="chart-container">
        <canvas id="performanceChart"></canvas>
      </div>
    </CardComponent>
  </div>
</template>

<style scoped>
.dashboard {
  margin: 0 auto;
  max-width: 1200px;
}

.page-title {
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  margin-bottom: 0;
}

.metric-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.5rem 0;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.metric-label {
  font-size: 0.9rem;
  color: #666;
}

.dashboard-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.task-list,
.meeting-list,
.time-log-list,
.project-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item,
.meeting-item,
.time-log-item,
.project-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.task-item:last-child,
.meeting-item:last-child,
.time-log-item:last-child,
.project-item:last-child {
  border-bottom: none;
}

.task-details,
.meeting-details,
.time-log-details,
.project-details {
  flex: 1;
}

.task-title,
.meeting-title,
.project-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 500;
}

.task-meta,
.meeting-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
}

.task-status,
.project-status {
  font-weight: 500;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
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

.status-on-track {
  background-color: #e8f5e9;
  color: #27ae60;
}

.status-delayed {
  background-color: #ffebee;
  color: #e74c3c;
}

.task-priority {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
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

.meeting-time {
  background-color: #ecf0f1;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.time-log-date {
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  background-color: #ecf0f1;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.time-log-hours {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.time-log-project {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.time-log-time {
  font-size: 0.85rem;
  color: #666;
}

.project-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  min-width: 120px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  border-radius: 4px;
}

.progress-text {
  font-size: 0.85rem;
  font-weight: 500;
}

.chart-container {
  height: 300px;
  max-width: 100%;
}

.view-all-link {
  text-align: center;
  margin-top: 1rem;
}

.view-all-link a {
  font-size: 0.9rem;
  color: var(--primary-color);
  text-decoration: none;
}

.view-all-link a:hover {
  text-decoration: underline;
}

.clock-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .metrics-row,
  .dashboard-row {
    grid-template-columns: 1fr;
  }
}
</style>