<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useCalendarStore } from '../stores/calendar'
import { useNotificationsStore } from '../stores/notifications'
import { format, isToday, isPast, isFuture, parseISO } from 'date-fns'

const tasksStore = useTasksStore()
const calendarStore = useCalendarStore()
const notificationsStore = useNotificationsStore()

// State
const showTaskModal = ref(false)
const taskBeingEdited = ref(null)
const newTask = ref({
  title: '',
  description: '',
  dueDate: new Date().toISOString(),
  priority: 'medium',
  status: 'not-started',
  category: 'development',
  assignee: null,
  timeEstimate: 1,
  relatedEvents: [],
  isScheduled: false
})
const activeFilters = ref({
  status: null,
  priority: null,
  category: null,
  assignee: null,
  dueDate: null
})
const sortBy = ref('dueDate') // dueDate, priority, title
const sortOrder = ref('asc') // asc, desc
const searchQuery = ref('')
const showScheduleModal = ref(false)
const selectedTask = ref(null)

// Filter options
const statusOptions = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
]

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
]

const categoryOptions = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'research', label: 'Research' },
  { value: 'admin', label: 'Administrative' }
]

// Filtered and sorted tasks
const filteredTasks = computed(() => {
  // Start with all tasks
  let result = tasksStore.getTasks
  
  // Apply search filter
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(task => 
      task.title.toLowerCase().includes(query) || 
      task.description.toLowerCase().includes(query)
    )
  }
  
  // Apply active filters
  if (activeFilters.value.status) {
    result = result.filter(task => task.status === activeFilters.value.status)
  }
  
  if (activeFilters.value.priority) {
    result = result.filter(task => task.priority === activeFilters.value.priority)
  }
  
  if (activeFilters.value.category) {
    result = result.filter(task => task.category === activeFilters.value.category)
  }
  
  if (activeFilters.value.assignee) {
    result = result.filter(task => task.assignee === parseInt(activeFilters.value.assignee))
  }
  
  if (activeFilters.value.dueDate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (activeFilters.value.dueDate === 'today') {
      result = result.filter(task => isToday(new Date(task.dueDate)))
    } else if (activeFilters.value.dueDate === 'overdue') {
      result = result.filter(task => isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'completed')
    } else if (activeFilters.value.dueDate === 'upcoming') {
      result = result.filter(task => isFuture(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)))
    }
  }
  
  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0
    
    if (sortBy.value === 'dueDate') {
      comparison = new Date(a.dueDate) - new Date(b.dueDate)
    } else if (sortBy.value === 'priority') {
      const priorityWeight = { high: 3, medium: 2, low: 1 }
      comparison = priorityWeight[b.priority] - priorityWeight[a.priority]
    } else if (sortBy.value === 'title') {
      comparison = a.title.localeCompare(b.title)
    } else if (sortBy.value === 'status') {
      const statusWeight = { 'not-started': 1, 'in-progress': 2, 'completed': 3 }
      comparison = statusWeight[a.status] - statusWeight[b.status]
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
  
  return result
})

// Tasks grouped by status (for Kanban view)
const tasksByStatus = computed(() => {
  const grouped = {
    'not-started': [],
    'in-progress': [],
    'completed': []
  }
  
  filteredTasks.value.forEach(task => {
    grouped[task.status].push(task)
  })
  
  return grouped
})

// Open modal to create a new task
const openNewTaskModal = () => {
  // Initialize with defaults for current user
  newTask.value = {
    title: '',
    description: '',
    dueDate: new Date().toISOString(),
    priority: 'medium',
    status: 'not-started',
    category: 'development',
    assignee: calendarStore.users.find(user => user.role === calendarStore.currentRole)?.id,
    timeEstimate: 1,
    relatedEvents: [],
    isScheduled: false
  }
  
  taskBeingEdited.value = null
  showTaskModal.value = true
}

// Open modal to edit an existing task
const openEditTaskModal = (task) => {
  if (!calendarStore.hasEditPermission && 
      task.assignee !== calendarStore.users.find(user => user.role === calendarStore.currentRole)?.id) {
    notificationsStore.addNotification({
      type: 'system',
      message: 'You do not have permission to edit this task.'
    })
    return
  }
  
  taskBeingEdited.value = { ...task }
  showTaskModal.value = true
}

// Close the task modal
const closeTaskModal = () => {
  showTaskModal.value = false
  taskBeingEdited.value = null
}

// Save a task (create or update)
const saveTask = () => {
  if (taskBeingEdited.value) {
    // Update existing task
    tasksStore.updateTask(taskBeingEdited.value)
  } else {
    // Create new task
    const newTaskAdded = tasksStore.addTask(newTask.value)
    
    // If assigned to someone else, create a notification
    if (newTaskAdded.assignee && 
        newTaskAdded.assignee !== calendarStore.users.find(user => user.role === calendarStore.currentRole)?.id) {
      notificationsStore.addNotification({
        type: 'system',
        message: `New task "${newTaskAdded.title}" has been assigned to you.`,
        relatedId: newTaskAdded.id
      })
    }
  }
  
  closeTaskModal()
}

// Delete a task
const deleteTask = () => {
  if (taskBeingEdited.value) {
    tasksStore.deleteTask(taskBeingEdited.value.id)
    closeTaskModal()
  }
}

// Toggle a filter
const toggleFilter = (type, value) => {
  if (activeFilters.value[type] === value) {
    // If the same value is clicked again, clear the filter
    activeFilters.value[type] = null
  } else {
    // Set the new filter value
    activeFilters.value[type] = value
  }
}

// Change sorting
const changeSorting = (field) => {
  if (sortBy.value === field) {
    // Toggle sort order if the same field is clicked
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new sort field and default to ascending
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

// Clear all filters
const clearFilters = () => {
  activeFilters.value = {
    status: null,
    priority: null,
    category: null,
    assignee: null,
    dueDate: null
  }
  searchQuery.value = ''
}

// Toggle task status
const toggleTaskStatus = (task) => {
  if (!calendarStore.hasEditPermission && 
      task.assignee !== calendarStore.users.find(user => user.role === calendarStore.currentRole)?.id) {
    notificationsStore.addNotification({
      type: 'system',
      message: 'You do not have permission to update this task.'
    })
    return
  }
  
  tasksStore.toggleTaskStatus(task.id)
  
  // If task is now completed, create a notification
  if (task.status === 'not-started' || task.status === 'in-progress') {
    notificationsStore.addNotification({
      type: 'system',
      message: `Task "${task.title}" has been marked as completed.`
    })
  }
}

// Format a date for display
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return format(date, 'MMM d, yyyy')
}

// Check if a date is in the past
const isDateOverdue = (dateString) => {
  const date = new Date(dateString)
  date.setHours(23, 59, 59, 999) // End of the day
  return isPast(date) && !isToday(date)
}

// Get priority style
const getPriorityStyle = (priority) => {
  if (priority === 'high') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  if (priority === 'medium') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
}

// Get status style
const getStatusStyle = (status) => {
  if (status === 'completed') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
  if (status === 'in-progress') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
}

// Schedule a task on the calendar
const openScheduleTaskModal = (task) => {
  selectedTask.value = task
  showScheduleModal.value = true
}

// Create calendar event based on task
const scheduleTask = () => {
  if (!selectedTask.value) return
  
  const task = selectedTask.value
  const startDate = new Date()
  startDate.setHours(startDate.getHours() + 1, 0, 0, 0) // Start in the next hour
  
  const endDate = new Date(startDate)
  endDate.setHours(endDate.getHours() + task.timeEstimate)
  
  const newEvent = {
    title: `Task: ${task.title}`,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    description: `Focus time for task: ${task.description}`,
    attendees: task.assignee ? [task.assignee] : [],
    status: 'confirmed',
    location: '',
    isAllDay: false,
    color: '#10B981' // Green for tasks
  }
  
  const createdEvent = calendarStore.addEvent(newEvent)
  
  // Link the task to the event
  tasksStore.scheduleTask(task.id, createdEvent)
  
  showScheduleModal.value = false
  
  notificationsStore.addNotification({
    type: 'system',
    message: `Task "${task.title}" has been scheduled on the calendar.`
  })
}

// Get user name by ID
const getUserName = (userId) => {
  if (!userId) return 'Unassigned'
  const user = calendarStore.users.find(user => user.id === userId)
  return user ? user.name : 'Unknown'
}

// Computed properties for task form inputs
const taskTitleValue = computed({
  get: () => taskBeingEdited.value ? taskBeingEdited.value.title : newTask.value.title,
  set: (value) => {
    if (taskBeingEdited.value) {
      taskBeingEdited.value.title = value
    } else {
      newTask.value.title = value
    }
  }
})

const taskDueDateValue = computed({
  get: () => taskBeingEdited.value ? taskBeingEdited.value.dueDate.substring(0, 10) : newTask.value.dueDate.substring(0, 10),
  set: (value) => {
    if (taskBeingEdited.value) {
      taskBeingEdited.value.dueDate = value
    } else {
      newTask.value.dueDate = value
    }
  }
})

const taskDescriptionValue = computed({
  get: () => taskBeingEdited.value ? taskBeingEdited.value.description : newTask.value.description,
  set: (value) => {
    if (taskBeingEdited.value) {
      taskBeingEdited.value.description = value
    } else {
      newTask.value.description = value
    }
  }
})

const taskPriorityValue = computed({
  get: () => taskBeingEdited.value ? taskBeingEdited.value.priority : newTask.value.priority,
  set: (value) => {
    if (taskBeingEdited.value) {
      taskBeingEdited.value.priority = value
    } else {
      newTask.value.priority = value
    }
  }
})

const taskStatusValue = computed({
  get: () => taskBeingEdited.value ? taskBeingEdited.value.status : newTask.value.status,
  set: (value) => {
    if (taskBeingEdited.value) {
      taskBeingEdited.value.status = value
    } else {
      newTask.value.status = value
    }
  }
})

const taskCategoryValue = computed({
  get: () => taskBeingEdited.value ? taskBeingEdited.value.category : newTask.value.category,
  set: (value) => {
    if (taskBeingEdited.value) {
      taskBeingEdited.value.category = value
    } else {
      newTask.value.category = value
    }
  }
})

const taskTimeEstimateValue = computed({
  get: () => taskBeingEdited.value ? taskBeingEdited.value.timeEstimate : newTask.value.timeEstimate,
  set: (value) => {
    if (taskBeingEdited.value) {
      taskBeingEdited.value.timeEstimate = value
    } else {
      newTask.value.timeEstimate = value
    }
  }
})

const taskAssigneeValue = computed({
  get: () => taskBeingEdited.value ? taskBeingEdited.value.assignee : newTask.value.assignee,
  set: (value) => {
    if (taskBeingEdited.value) {
      taskBeingEdited.value.assignee = value
    } else {
      newTask.value.assignee = value
    }
  }
})
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-center">
      <h1 
        v-voix="'tasks-heading'" 
        class="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0"
      >
        Tasks & Project Management
      </h1>
      
      <div class="flex space-x-2">
        <button 
          v-voix="'create-task-button'" 
          hint="Create a new task"
          class="btn btn-primary inline-flex items-center"
          @click="openNewTaskModal"
          :disabled="calendarStore.currentRole === 'guest'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Create Task
        </button>
      </div>
    </div>
    
    <!-- Search and Filters -->
    <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div class="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <!-- Search -->
        <div class="w-full sm:w-1/3">
          <div class="relative">
            <input 
              v-voix="'search-tasks'" 
              hint="Search tasks by title or description"
              type="text" 
              v-model="searchQuery" 
              placeholder="Search tasks..." 
              class="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Sort options -->
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button 
            v-voix="'sort-by-due-date'" 
            hint="Sort tasks by due date"
            class="px-3 py-2 text-sm font-medium rounded-l-md border"
            :class="sortBy === 'dueDate' ? 
              'bg-indigo-600 text-white border-indigo-700' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="changeSorting('dueDate')"
          >
            Due Date
            <svg v-if="sortBy === 'dueDate'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" :transform="sortOrder === 'desc' ? 'rotate(180 10 10)' : ''" />
            </svg>
          </button>
          <button 
            v-voix="'sort-by-priority'" 
            hint="Sort tasks by priority"
            class="px-3 py-2 text-sm font-medium border-t border-b"
            :class="sortBy === 'priority' ? 
              'bg-indigo-600 text-white border-indigo-700' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="changeSorting('priority')"
          >
            Priority
            <svg v-if="sortBy === 'priority'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" :transform="sortOrder === 'desc' ? 'rotate(180 10 10)' : ''" />
            </svg>
          </button>
          <button 
            v-voix="'sort-by-status'" 
            hint="Sort tasks by status"
            class="px-3 py-2 text-sm font-medium rounded-r-md border"
            :class="sortBy === 'status' ? 
              'bg-indigo-600 text-white border-indigo-700' : 
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="changeSorting('status')"
          >
            Status
            <svg v-if="sortBy === 'status'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" :transform="sortOrder === 'desc' ? 'rotate(180 10 10)' : ''" />
            </svg>
          </button>
        </div>
        
        <button 
          v-voix="'clear-filters-button'" 
          hint="Clear all filters and search"
          class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>
      
      <!-- Filter chips -->
      <div class="flex flex-wrap gap-2 mb-2">
        <div class="text-sm text-gray-500 dark:text-gray-400 py-1">Filters:</div>
        
        <!-- Status filters -->
        <button 
          v-for="option in statusOptions" 
          :key="`status-${option.value}`"
          v-voix="`filter-status-${option.value}`" 
          :hint="`Filter tasks by ${option.label} status`"
          class="px-2 py-1 text-xs rounded-md"
          :class="activeFilters.status === option.value ? 
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700' : 
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'"
          @click="toggleFilter('status', option.value)"
        >
          Status: {{ option.label }}
        </button>
        
        <!-- Priority filters -->
        <button 
          v-for="option in priorityOptions" 
          :key="`priority-${option.value}`"
          v-voix="`filter-priority-${option.value}`" 
          :hint="`Filter tasks by ${option.label} priority`"
          class="px-2 py-1 text-xs rounded-md"
          :class="activeFilters.priority === option.value ? 
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700' : 
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'"
          @click="toggleFilter('priority', option.value)"
        >
          Priority: {{ option.label }}
        </button>
        
        <!-- Due date filters -->
        <button 
          v-voix="'filter-today'" 
          hint="Filter tasks due today"
          class="px-2 py-1 text-xs rounded-md"
          :class="activeFilters.dueDate === 'today' ? 
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700' : 
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'"
          @click="toggleFilter('dueDate', 'today')"
        >
          Due: Today
        </button>
        
        <button 
          v-voix="'filter-overdue'" 
          hint="Filter overdue tasks"
          class="px-2 py-1 text-xs rounded-md"
          :class="activeFilters.dueDate === 'overdue' ? 
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700' : 
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'"
          @click="toggleFilter('dueDate', 'overdue')"
        >
          Due: Overdue
        </button>
        
        <button 
          v-voix="'filter-upcoming'" 
          hint="Filter upcoming tasks"
          class="px-2 py-1 text-xs rounded-md"
          :class="activeFilters.dueDate === 'upcoming' ? 
            'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700' : 
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'"
          @click="toggleFilter('dueDate', 'upcoming')"
        >
          Due: Upcoming
        </button>
      </div>
    </div>
    
    <!-- Task List -->
    <div class="mb-8 space-y-4">
      <h2 
        v-voix="'task-list-heading'" 
        class="text-xl font-medium text-gray-900 dark:text-white mb-4"
      >
        Task List
        <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">
          {{ filteredTasks.length }} {{ filteredTasks.length === 1 ? 'task' : 'tasks' }}
        </span>
      </h2>
      
      <!-- Empty state -->
      <div 
        v-if="filteredTasks.length === 0" 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 mb-4">No tasks found matching your criteria</p>
        <button 
          v-voix="'create-new-task-button'" 
          hint="Create a new task"
          class="btn btn-primary"
          @click="openNewTaskModal"
          :disabled="calendarStore.currentRole === 'guest'"
        >
          Create New Task
        </button>
      </div>
      
      <!-- Tasks -->
      <div 
        v-else
        class="grid grid-cols-1 gap-4"
      >
        <div 
          v-for="task in filteredTasks" 
          :key="task.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <!-- Task details -->
              <div class="flex items-start flex-grow mb-4 sm:mb-0">
                <div class="flex-shrink-0 mr-3">
                  <button 
                    v-voix="`toggle-task-${task.id}`" 
                    hint="Toggle task completion status"
                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                    :class="task.status === 'completed' ? 
                      'border-green-500 bg-green-100 dark:bg-green-900/20' : 
                      task.status === 'in-progress' ? 
                        'border-blue-500 bg-blue-100 dark:bg-blue-900/20' : 
                        'border-gray-300 dark:border-gray-600'"
                    @click="toggleTaskStatus(task)"
                  >
                    <svg v-if="task.status === 'completed'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="task.status === 'in-progress'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div class="flex-grow">
                  <h3 
                    v-voix="`task-title-${task.id}`" 
                    class="text-lg font-medium text-gray-900 dark:text-white mb-1"
                    :class="{ 'line-through opacity-70': task.status === 'completed' }"
                  >
                    {{ task.title }}
                  </h3>
                  
                  <p 
                    class="text-gray-600 dark:text-gray-300 mb-3 text-sm line-clamp-2"
                    :class="{ 'opacity-70': task.status === 'completed' }"
                  >
                    {{ task.description }}
                  </p>
                  
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getPriorityStyle(task.priority)"
                    >
                      {{ task.priority === 'high' ? 'High' : task.priority === 'medium' ? 'Medium' : 'Low' }} Priority
                    </span>
                    
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusStyle(task.status)"
                    >
                      {{ task.status === 'completed' ? 'Completed' : task.status === 'in-progress' ? 'In Progress' : 'Not Started' }}
                    </span>
                    
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {{ task.category }}
                    </span>
                    
                    <span 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="isDateOverdue(task.dueDate) && task.status !== 'completed' ? 
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'"
                    >
                      Due: {{ formatDate(task.dueDate) }}
                      <span 
                        v-if="isDateOverdue(task.dueDate) && task.status !== 'completed'"
                        class="ml-1 font-bold"
                      >
                        (Overdue)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Action buttons -->
              <div class="flex flex-col space-y-2">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Assigned to: <span class="font-medium">{{ getUserName(task.assignee) }}</span>
                </div>
                
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Estimate: <span class="font-medium">{{ task.timeEstimate }} {{ task.timeEstimate === 1 ? 'hour' : 'hours' }}</span>
                </div>
                
                <div class="flex space-x-2">
                  <button 
                    v-voix="`edit-task-${task.id}`" 
                    hint="Edit this task"
                    class="px-2 py-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 border border-indigo-300 dark:border-indigo-700 rounded-md"
                    @click="openEditTaskModal(task)"
                  >
                    Edit
                  </button>
                  
                  <button 
                    v-if="!task.isScheduled"
                    v-voix="`schedule-task-${task.id}`" 
                    hint="Schedule this task on the calendar"
                    class="px-2 py-1 text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 border border-green-300 dark:border-green-700 rounded-md"
                    @click="openScheduleTaskModal(task)"
                  >
                    Schedule
                  </button>
                  
                  <span 
                    v-else
                    class="px-2 py-1 text-xs text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700 rounded-md bg-green-50 dark:bg-green-900/20"
                  >
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Task Modal -->
    <div 
      v-if="showTaskModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 
            v-voix="'task-modal-heading'" 
            class="text-xl font-medium text-gray-900 dark:text-white"
          >
            {{ taskBeingEdited ? 'Edit Task' : 'Create Task' }}
          </h3>
          <button 
            v-voix="'close-task-modal'" 
            hint="Close task modal"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            @click="closeTaskModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="saveTask">
            <div class="mb-4">
              <label v-voix="'task-title-label'" for="task-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title
              </label>
              <input 
                v-voix="'task-title-input'" 
                hint="Enter the title of the task"
                id="task-title"
                type="text" 
                v-model="taskTitleValue"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div class="mb-4">
              <label v-voix="'task-description-label'" for="task-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea 
                v-voix="'task-description-input'" 
                hint="Enter a description for the task"
                id="task-description"
                v-model="taskDescriptionValue"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label v-voix="'task-due-date-label'" for="task-due-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input 
                v-voix="'task-due-date-input'" 
                hint="Enter the due date of the task"
                id="task-due-date"
                type="date" 
                v-model="taskDueDateValue"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label v-voix="'task-priority-label'" for="task-priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select 
                  v-voix="'task-priority-select'" 
                  hint="Select the priority of the task"
                  id="task-priority"
                  v-model="taskPriorityValue"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label v-voix="'task-status-label'" for="task-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select 
                  v-voix="'task-status-select'" 
                  hint="Select the status of the task"
                  id="task-status"
                  v-model="taskStatusValue"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label v-voix="'task-category-label'" for="task-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select 
                  v-voix="'task-category-select'" 
                  hint="Select the category of the task"
                  id="task-category"
                  v-model="taskCategoryValue"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="research">Research</option>
                  <option value="admin">Administrative</option>
                </select>
              </div>
              
              <div>
                <label v-voix="'task-time-estimate-label'" for="task-time-estimate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time Estimate (hours)
                </label>
                <input 
                  v-voix="'task-time-estimate-input'" 
                  hint="Enter the estimated time in hours"
                  id="task-time-estimate"
                  type="number" 
                  min="0.5"
                  step="0.5"
                  v-model="taskTimeEstimateValue"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div class="mb-6">
              <label v-voix="'task-assignee-label'" for="task-assignee" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignee
              </label>
              <select 
                v-voix="'task-assignee-select'" 
                hint="Select who this task is assigned to"
                id="task-assignee"
                v-model="taskAssigneeValue"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option :value="null">Unassigned</option>
                <option v-for="user in calendarStore.users" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.role }})
                </option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                v-if="taskBeingEdited && calendarStore.hasEditPermission"
                v-voix="'delete-task-button'" 
                hint="Delete this task"
                type="button"
                class="px-4 py-2 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                @click="deleteTask"
              >
                Delete
              </button>
              
              <button 
                v-voix="'save-task-button'" 
                hint="Save this task"
                type="submit"
                class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Schedule Task Modal -->
    <div 
      v-if="showScheduleModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 
            v-voix="'schedule-task-heading'" 
            class="text-xl font-medium text-gray-900 dark:text-white"
          >
            Schedule Task on Calendar
          </h3>
          <button 
            v-voix="'close-schedule-modal'" 
            hint="Close schedule modal"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            @click="showScheduleModal = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <div v-if="selectedTask" class="mb-6">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">Task Details</h4>
            <p class="text-gray-700 dark:text-gray-300 text-sm mb-4">{{ selectedTask.title }}</p>
            
            <div class="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md">
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                This will create a calendar event for this task with estimated duration of 
                <span class="font-medium">{{ selectedTask.timeEstimate }} {{ selectedTask.timeEstimate === 1 ? 'hour' : 'hours' }}</span>.
              </p>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                The event will appear on your calendar and help you allocate time for completing this task.
              </p>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              v-voix="'cancel-schedule'" 
              hint="Cancel scheduling"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @click="showScheduleModal = false"
            >
              Cancel
            </button>
            
            <button 
              v-voix="'confirm-schedule'" 
              hint="Create calendar event from task"
              class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @click="scheduleTask"
            >
              Schedule on Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>