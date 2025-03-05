import { defineStore } from 'pinia'
import { addDays, startOfToday } from 'date-fns'

// Generate mock tasks
const generateTasks = () => {
  const tasks = []
  const today = startOfToday()
  const priorities = ['high', 'medium', 'low']
  const statuses = ['not-started', 'in-progress', 'completed']
  const categories = ['development', 'design', 'marketing', 'research', 'admin']
  const titles = [
    'Complete API documentation',
    'Design landing page mockup',
    'Write blog post',
    'Fix navigation bug',
    'Review pull request',
    'Update user dashboard',
    'Create email template',
    'Research competitor features',
    'Prepare quarterly report',
    'Set up analytics',
    'Update team documentation',
    'Optimize image assets',
    'Design new logo concepts'
  ]
  
  // Generate random tasks
  for (let i = 0; i < 20; i++) {
    const dayOffset = Math.floor(Math.random() * 14) - 3 // Some tasks could be overdue
    const dueDate = addDays(today, dayOffset)
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]
    
    // Random assignee (including null for unassigned)
    const assignee = Math.random() > 0.2 ? Math.floor(Math.random() * 5) + 1 : null
    
    tasks.push({
      id: i + 1,
      title,
      description: `Task description for ${title}`,
      dueDate: dueDate.toISOString(),
      priority,
      status,
      category,
      assignee,
      timeEstimate: [0.5, 1, 2, 4, 8][Math.floor(Math.random() * 5)], // In hours
      relatedEvents: [],
      isScheduled: Math.random() > 0.6, // Some tasks are scheduled on calendar
      created: addDays(dueDate, -Math.floor(Math.random() * 10)).toISOString()
    })
  }
  
  return tasks
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: generateTasks(),
    taskFilters: {
      status: null,
      priority: null,
      category: null,
      assignee: null,
      dueDate: null
    },
    showCompletedTasks: true
  }),
  
  getters: {
    getTasks: (state) => state.tasks,
    
    getFilteredTasks: (state) => {
      return state.tasks.filter(task => {
        // Filter by status
        if (state.taskFilters.status && task.status !== state.taskFilters.status) {
          return false
        }
        
        // Filter by priority
        if (state.taskFilters.priority && task.priority !== state.taskFilters.priority) {
          return false
        }
        
        // Filter by category
        if (state.taskFilters.category && task.category !== state.taskFilters.category) {
          return false
        }
        
        // Filter by assignee
        if (state.taskFilters.assignee && task.assignee !== state.taskFilters.assignee) {
          return false
        }
        
        // Hide completed tasks if showCompletedTasks is false
        if (!state.showCompletedTasks && task.status === 'completed') {
          return false
        }
        
        return true
      })
    },
    
    getTaskById: (state) => {
      return (id) => state.tasks.find(task => task.id === id)
    },
    
    getTasksByAssignee: (state) => {
      return (assigneeId) => state.tasks.filter(task => task.assignee === assigneeId)
    },
    
    getTasksByDueDate: (state) => {
      return (date) => {
        const targetDate = new Date(date)
        return state.tasks.filter(task => {
          const taskDate = new Date(task.dueDate)
          return taskDate.getFullYear() === targetDate.getFullYear() &&
                 taskDate.getMonth() === targetDate.getMonth() &&
                 taskDate.getDate() === targetDate.getDate()
        })
      }
    },
    
    getOverdueTasks: (state) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      return state.tasks.filter(task => {
        const dueDate = new Date(task.dueDate)
        return dueDate < today && task.status !== 'completed'
      })
    },
    
    getTodaysTasks: (state) => {
      const today = new Date()
      
      return state.tasks.filter(task => {
        const dueDate = new Date(task.dueDate)
        return dueDate.getFullYear() === today.getFullYear() &&
               dueDate.getMonth() === today.getMonth() &&
               dueDate.getDate() === today.getDate()
      })
    }
  },
  
  actions: {
    addTask(task) {
      const nextId = Math.max(0, ...this.tasks.map(t => t.id)) + 1
      const newTask = {
        id: nextId,
        ...task
      }
      
      this.tasks.push(newTask)
      return newTask
    },
    
    updateTask(updatedTask) {
      const index = this.tasks.findIndex(task => task.id === updatedTask.id)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedTask }
      }
    },
    
    deleteTask(id) {
      const index = this.tasks.findIndex(task => task.id === id)
      if (index !== -1) {
        this.tasks.splice(index, 1)
      }
    },
    
    toggleTaskStatus(id) {
      const task = this.tasks.find(task => task.id === id)
      if (task) {
        switch (task.status) {
          case 'not-started':
            task.status = 'in-progress'
            break
          case 'in-progress':
            task.status = 'completed'
            break
          case 'completed':
            task.status = 'not-started'
            break
        }
      }
    },
    
    setTaskFilter(filterType, value) {
      this.taskFilters[filterType] = value
    },
    
    clearTaskFilters() {
      this.taskFilters = {
        status: null,
        priority: null,
        category: null,
        assignee: null,
        dueDate: null
      }
    },
    
    toggleCompletedTasksVisibility() {
      this.showCompletedTasks = !this.showCompletedTasks
    },
    
    scheduleTask(taskId, eventDetails) {
      const task = this.tasks.find(task => task.id === taskId)
      if (task) {
        task.isScheduled = true
        if (eventDetails && eventDetails.id) {
          if (!task.relatedEvents.includes(eventDetails.id)) {
            task.relatedEvents.push(eventDetails.id)
          }
        }
      }
    },
    
    unscheduleTask(taskId, eventId = null) {
      const task = this.tasks.find(task => task.id === taskId)
      if (task) {
        if (eventId !== null) {
          task.relatedEvents = task.relatedEvents.filter(id => id !== eventId)
          task.isScheduled = task.relatedEvents.length > 0
        } else {
          task.isScheduled = false
          task.relatedEvents = []
        }
      }
    }
  }
})