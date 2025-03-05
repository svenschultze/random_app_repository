<script setup>
import { ref, computed, onMounted } from 'vue'
import CardComponent from '@/components/CardComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import moment from 'moment'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Clock in/out state
const isClockIn = ref(false)
const currentSession = ref(null)
const clockInTime = ref(null)

// Mock time logs data
const timeLogs = ref([
  { id: 1, date: '2025-03-05', timeIn: '08:30:00', timeOut: '17:00:00', project: 'Marketing Campaign', description: 'Created social media assets and scheduled posts', hours: 7.5, overtime: 0 },
  { id: 2, date: '2025-03-04', timeIn: '09:00:00', timeOut: '18:30:00', project: 'Website Redesign', description: 'Reviewed design mockups and provided feedback', hours: 8.5, overtime: 0.5 },
  { id: 3, date: '2025-03-03', timeIn: '08:45:00', timeOut: '16:45:00', project: 'Client Presentations', description: 'Prepared slides for quarterly review meeting', hours: 7, overtime: 0 },
  { id: 4, date: '2025-03-02', timeIn: '08:30:00', timeOut: '17:30:00', project: 'Marketing Campaign', description: 'Team meeting and campaign planning', hours: 8, overtime: 0 },
  { id: 5, date: '2025-03-01', timeIn: '09:15:00', timeOut: '17:45:00', project: 'Website Redesign', description: 'Created wireframes for homepage', hours: 7.5, overtime: 0 }
])

// Filter options
const weekStart = ref(moment().startOf('week').format('YYYY-MM-DD'))
const weekEnd = ref(moment().endOf('week').format('YYYY-MM-DD'))
const selectedProject = ref('all')
const dateRange = ref('week')

// Add break
const showBreakModal = ref(false)
const breakStartTime = ref(null)

// Project options (derived from logs data)
const projects = computed(() => {
  const projectSet = new Set()
  timeLogs.value.forEach(log => {
    if (log.project) {
      projectSet.add(log.project)
    }
  })
  return ['all', ...Array.from(projectSet)]
})

// Filter logs based on selected options
const filteredLogs = computed(() => {
  let logs = [...timeLogs.value]
  
  // Filter by date range
  if (dateRange.value === 'week') {
    logs = logs.filter(log => {
      return log.date >= weekStart.value && log.date <= weekEnd.value
    })
  } else if (dateRange.value === 'month') {
    const monthStart = moment().startOf('month').format('YYYY-MM-DD')
    const monthEnd = moment().endOf('month').format('YYYY-MM-DD')
    logs = logs.filter(log => {
      return log.date >= monthStart && log.date <= monthEnd
    })
  }
  
  // Filter by project
  if (selectedProject.value !== 'all') {
    logs = logs.filter(log => log.project === selectedProject.value)
  }
  
  // Sort by date descending
  logs.sort((a, b) => {
    return moment(b.date).valueOf() - moment(a.date).valueOf()
  })
  
  return logs
})

// Summary stats
const summaryStats = computed(() => {
  const logs = filteredLogs.value
  
  const totalHours = logs.reduce((acc, log) => acc + log.hours, 0)
  const totalOvertime = logs.reduce((acc, log) => acc + log.overtime, 0)
  const uniqueDays = new Set(logs.map(log => log.date)).size
  
  return {
    totalHours: totalHours.toFixed(1),
    totalOvertime: totalOvertime.toFixed(1),
    averageHours: uniqueDays > 0 ? (totalHours / uniqueDays).toFixed(1) : '0.0',
    daysLogged: uniqueDays
  }
})

// Change date range
const changeWeek = (direction) => {
  const startDate = moment(weekStart.value)
  const endDate = moment(weekEnd.value)
  
  if (direction === 'prev') {
    startDate.subtract(7, 'days')
    endDate.subtract(7, 'days')
  } else {
    startDate.add(7, 'days')
    endDate.add(7, 'days')
  }
  
  weekStart.value = startDate.format('YYYY-MM-DD')
  weekEnd.value = endDate.format('YYYY-MM-DD')
}

// Reset to current week
const goToCurrentWeek = () => {
  weekStart.value = moment().startOf('week').format('YYYY-MM-DD')
  weekEnd.value = moment().endOf('week').format('YYYY-MM-DD')
}

// Format dates for display
const formatDateRange = computed(() => {
  return `${moment(weekStart.value).format('MMM D')} - ${moment(weekEnd.value).format('MMM D, YYYY')}`
})

// Clock in functionality
const clockIn = () => {
  isClockIn.value = true
  clockInTime.value = moment()
  currentSession.value = {
    timeIn: clockInTime.value.format('HH:mm:ss'),
    project: selectedProject.value !== 'all' ? selectedProject.value : 'General Work',
    breaks: []
  }
}

// Clock out functionality
const clockOut = () => {
  if (!isClockIn.value) return
  
  const clockOutTime = moment()
  const date = moment().format('YYYY-MM-DD')
  
  // Calculate total break time
  const totalBreakMinutes = currentSession.value.breaks.reduce((total, breakItem) => {
    const breakStart = moment(breakItem.start)
    const breakEnd = moment(breakItem.end)
    return total + breakEnd.diff(breakStart, 'minutes')
  }, 0)
  
  // Calculate hours worked (excluding breaks)
  const totalMinutesWorked = clockOutTime.diff(clockInTime.value, 'minutes') - totalBreakMinutes
  const hoursWorked = totalMinutesWorked / 60
  
  // Determine overtime (anything over 8 hours)
  const overtime = Math.max(0, hoursWorked - 8)
  const regularHours = hoursWorked - overtime
  
  // Create new log entry
  const newLog = {
    id: timeLogs.value.length + 1,
    date,
    timeIn: currentSession.value.timeIn,
    timeOut: clockOutTime.format('HH:mm:ss'),
    project: currentSession.value.project,
    description: currentSession.value.description || 'No description provided',
    hours: hoursWorked,
    overtime
  }
  
  timeLogs.value.unshift(newLog)
  
  // Reset clock in state
  isClockIn.value = false
  clockInTime.value = null
  currentSession.value = null
}

// Start break
const startBreak = () => {
  if (!isClockIn.value || !currentSession.value) return
  
  breakStartTime.value = moment()
  showBreakModal.value = true
}

// End break
const endBreak = (description) => {
  if (!breakStartTime.value || !isClockIn.value) return
  
  const breakEndTime = moment()
  
  // Add break to current session
  currentSession.value.breaks.push({
    start: breakStartTime.value,
    end: breakEndTime,
    description: description || 'Break'
  })
  
  breakStartTime.value = null
  showBreakModal.value = false
}

// Calculate current session duration
const currentSessionDuration = computed(() => {
  if (!isClockIn.value || !clockInTime.value) return '00:00'
  
  const now = moment()
  const duration = moment.duration(now.diff(clockInTime.value))
  return `${Math.floor(duration.asHours())}:${duration.minutes().toString().padStart(2, '0')}`
})

// Update current project for session
const updateCurrentProject = (project) => {
  if (currentSession.value) {
    currentSession.value.project = project
  }
}

// Update current session description
const updateDescription = (description) => {
  if (currentSession.value) {
    currentSession.value.description = description
  }
}

onMounted(() => {
  renderWeeklyHoursChart()
})

const renderWeeklyHoursChart = () => {
  const ctx = document.getElementById('weeklyHoursChart')
  if (!ctx) return
  
  // Generate last 7 days
  const days = []
  const hoursData = []
  
  for (let i = 6; i >= 0; i--) {
    const day = moment().subtract(i, 'days')
    days.push(day.format('ddd'))
    
    // Find log for this day
    const dayLog = timeLogs.value.find(log => log.date === day.format('YYYY-MM-DD'))
    hoursData.push(dayLog ? dayLog.hours : 0)
  }
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [{
        label: 'Hours Worked',
        data: hoursData,
        backgroundColor: '#3498db',
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Hours'
          },
          ticks: {
            stepSize: 2
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Hours Worked (Last 7 Days)'
        }
      }
    }
  })
}
</script>

<template>
  <div class="time-tracking-view">
    <div class="page-header">
      <h1 class="page-title">Time Tracking</h1>
    </div>

    <div class="clock-container">
      <CardComponent title="Time Clock">
        <div class="clock-content">
          <div class="clock-time">{{ isClockIn ? currentSessionDuration : '00:00' }}</div>
          <div v-if="isClockIn" class="clock-in-time">
            Clocked in at {{ clockInTime ? clockInTime.format('h:mm A') : '' }}
          </div>
          
          <div class="clock-actions">
            <ButtonComponent 
              v-if="!isClockIn" 
              @click="clockIn" 
              variant="primary" 
              size="large"
              v-voix="'clock-in-button'"
              hint="Clock in to start your work session"
            >
              Clock In
            </ButtonComponent>
            <template v-else>
              <ButtonComponent 
                @click="startBreak" 
                variant="info"
                v-voix="'start-break-button'"
                hint="Start a break period"
              >
                Take Break
              </ButtonComponent>
              <ButtonComponent 
                @click="clockOut" 
                variant="secondary" 
                size="large"
                v-voix="'clock-out-button'"
                hint="Clock out and end your work session"
              >
                Clock Out
              </ButtonComponent>
            </template>
          </div>
          
          <div v-if="isClockIn" class="current-session-details">
            <div class="form-group">
              <label for="session-project">Project</label>
              <select 
                id="session-project" 
                :value="currentSession?.project"
                @change="updateCurrentProject($event.target.value)"
                v-voix="'session-project-select'"
                hint="Select project for current work session"
              >
                <option v-for="project in projects.filter(p => p !== 'all')" :key="project" :value="project">
                  {{ project }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="session-description">Description</label>
              <textarea 
                id="session-description" 
                :value="currentSession?.description"
                @input="updateDescription($event.target.value)"
                rows="3"
                placeholder="What are you working on?"
                v-voix="'session-description-input'"
                hint="Enter description of work being done"
              ></textarea>
            </div>
          </div>
        </div>
      </CardComponent>
    </div>

    <div class="timesheet-section">
      <div class="timesheet-header">
        <h2>Timesheet</h2>
        <div class="timesheet-filters">
          <div class="date-filter">
            <ButtonComponent 
              @click="changeWeek('prev')" 
              variant="secondary" 
              size="small"
              v-voix="'previous-week-button'"
              hint="View previous week"
            >
              &larr;
            </ButtonComponent>
            <span class="date-range">{{ formatDateRange }}</span>
            <ButtonComponent 
              @click="changeWeek('next')" 
              variant="secondary" 
              size="small"
              v-voix="'next-week-button'"
              hint="View next week"
            >
              &rarr;
            </ButtonComponent>
            <ButtonComponent 
              @click="goToCurrentWeek" 
              variant="info" 
              size="small"
              v-voix="'current-week-button'"
              hint="View current week"
            >
              Current Week
            </ButtonComponent>
          </div>
          
          <div class="project-filter">
            <label for="project-filter">Project</label>
            <select 
              id="project-filter" 
              v-model="selectedProject"
              v-voix="'project-filter'"
              hint="Filter timesheet by project"
            >
              <option v-for="project in projects" :key="project" :value="project">
                {{ project === 'all' ? 'All Projects' : project }}
              </option>
            </select>
          </div>
          
          <div class="range-filter">
            <label for="range-filter">Range</label>
            <select 
              id="range-filter" 
              v-model="dateRange"
              v-voix="'date-range-filter'"
              hint="Filter timesheet by date range"
            >
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="timesheet-summary">
        <CardComponent title="Summary" class="summary-card">
          <div class="summary-stats">
            <div class="stat-item">
              <div class="stat-value">{{ summaryStats.totalHours }}</div>
              <div class="stat-label">Total Hours</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ summaryStats.totalOvertime }}</div>
              <div class="stat-label">Overtime</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ summaryStats.averageHours }}</div>
              <div class="stat-label">Avg Hours/Day</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ summaryStats.daysLogged }}</div>
              <div class="stat-label">Days Logged</div>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="weeklyHoursChart"></canvas>
          </div>
        </CardComponent>
      </div>
      
      <CardComponent title="Time Logs">
        <div class="time-logs-table-container">
          <table class="time-logs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Project</th>
                <th>Hours</th>
                <th>Overtime</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in filteredLogs" :key="log.id" class="time-log-row">
                <td>{{ moment(log.date).format('MMM D, YYYY') }}</td>
                <td>{{ moment(log.timeIn, 'HH:mm:ss').format('h:mm A') }}</td>
                <td>{{ moment(log.timeOut, 'HH:mm:ss').format('h:mm A') }}</td>
                <td>{{ log.project }}</td>
                <td>{{ log.hours.toFixed(1) }}</td>
                <td>{{ log.overtime.toFixed(1) }}</td>
              </tr>
              <tr v-if="filteredLogs.length === 0">
                <td colspan="6" class="no-logs">No time logs found for the selected period.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardComponent>
    </div>

    <!-- Break Modal -->
    <div class="modal" v-if="showBreakModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Taking a Break</h2>
        </div>
        <div class="modal-body">
          <p>Your break started at {{ breakStartTime ? breakStartTime.format('h:mm A') : '' }}.</p>
          
          <div class="form-group">
            <label for="break-description">Break Description (Optional)</label>
            <input 
              type="text" 
              id="break-description" 
              placeholder="e.g., Lunch, Meeting, etc."
              v-voix="'break-description-input'"
              hint="Enter description for this break period"
            />
          </div>
          
          <div class="form-actions">
            <ButtonComponent 
              @click="endBreak(document.getElementById('break-description').value)" 
              variant="primary"
              v-voix="'end-break-button'"
              hint="End the break and return to work"
            >
              End Break
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time-tracking-view {
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

.clock-container {
  margin-bottom: 2rem;
}

.clock-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.clock-time {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: monospace;
}

.clock-in-time {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  color: #666;
}

.clock-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.current-session-details {
  width: 100%;
  max-width: 600px;
  margin-top: 1rem;
}

.timesheet-section {
  margin-bottom: 2rem;
}

.timesheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.timesheet-header h2 {
  margin: 0;
  font-weight: 600;
}

.timesheet-filters {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.date-filter,
.project-filter,
.range-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date-filter {
  display: flex;
  align-items: center;
}

.date-range {
  margin: 0 0.5rem;
  font-weight: 500;
}

.project-filter label,
.range-filter label {
  font-size: 0.9rem;
  color: #666;
}

.project-filter select,
.range-filter select {
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
}

.timesheet-summary {
  margin-bottom: 1.5rem;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.chart-container {
  height: 250px;
}

.time-logs-table-container {
  overflow-x: auto;
}

.time-logs-table {
  width: 100%;
  border-collapse: collapse;
}

.time-logs-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  background-color: #f8f9fa;
  border-bottom: 2px solid var(--border-color);
}

.time-logs-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.time-log-row:hover {
  background-color: rgba(52, 152, 219, 0.05);
}

.no-logs {
  text-align: center;
  padding: 2rem 0;
  color: #666;
  font-style: italic;
}

/* Form styles */
.form-group {
  margin-bottom: 1rem;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  text-align: left;
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
  justify-content: center;
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
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .timesheet-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .timesheet-filters {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>