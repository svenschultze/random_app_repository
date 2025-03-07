import { reactive } from 'vue'

// Demo data generator functions
function generateRandomId() {
  return Math.random().toString(36).substring(2, 10)
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Create random demo data
function generateDemoProjects() {
  const taskTitles = [
    'Create user authentication flow',
    'Design landing page mockup',
    'Implement responsive navigation',
    'Fix bug in payment gateway',
    'Update API documentation',
    'Refactor database queries',
    'Optimize image loading performance',
    'Integrate social media sharing',
    'Create automated test suite',
    'Add multilanguage support',
    'Deploy to production server',
    'Implement dark mode toggle',
    'Update privacy policy',
    'Create email templates',
    'Optimize for mobile devices',
    'Add form validation',
    'Create admin dashboard',
    'Design system documentation',
    'Fix login page layout',
    'Update dependencies',
  ]
  
  const taskDescriptions = [
    'This needs to be completed with careful attention to security best practices',
    'Make sure it follows our brand guidelines and is visually appealing',
    'Should work on all device sizes from mobile to desktop',
    'Users are reporting intermittent failures when processing payments',
    'Documentation is out of date and needs to reflect recent changes',
    'Current queries are inefficient and causing performance issues',
    'Page load time is too slow due to unoptimized images',
    'Add buttons for sharing content on Twitter, Facebook, and LinkedIn',
    'Create unit and integration tests for core functionality',
    'Website should support English, Spanish, and French',
    'Follow the deployment checklist and update DNS settings',
    'Allow users to switch between light and dark theme',
    'Update to comply with latest regulations',
    'Design templates for welcome, reset password, and notification emails',
    'Ensure smooth experience on mobile devices with touch support',
    'Add client-side validation with helpful error messages',
    'Create interfaces for managing users, content, and settings',
    'Document all UI components, colors, typography, and patterns',
    'Fix alignment issues and responsiveness on the login page',
    'Update all packages to their latest compatible versions',
  ]
  
  const priorities = ['Low', 'Medium', 'High', 'Critical']
  const assignees = ['Alex Smith', 'Jamie Taylor', 'Jordan Kim', 'Sam Chen', 'Morgan Lee']
  const labels = ['Feature', 'Bug', 'Documentation', 'Enhancement', 'Refactor', 'Testing']
  
  const projectNames = [
    'Website Redesign',
    'Mobile App Development',
    'API Integration',
    'E-commerce Platform',
    'Customer Portal',
    'Internal Tools'
  ]
  
  const columnSets = [
    ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'],
    ['To Do', 'In Progress', 'Testing', 'Done'],
    ['Backlog', 'Selected for Development', 'In Progress', 'Ready for Review', 'Done'],
    ['Ideas', 'Planning', 'Implementation', 'Verification', 'Release']
  ]
  
  const projects = []
  
  // Generate 3-5 projects
  const projectCount = Math.floor(Math.random() * 3) + 3
  
  for (let i = 0; i < projectCount; i++) {
    const projectName = projectNames[i % projectNames.length]
    const columnSet = getRandomElement(columnSets)
    
    const columns = columnSet.map((name, index) => {
      return {
        id: generateRandomId(),
        name,
        order: index
      }
    })
    
    const tasks = []
    
    // Generate 5-15 tasks for each project
    const taskCount = Math.floor(Math.random() * 11) + 5
    
    for (let j = 0; j < taskCount; j++) {
      const columnIndex = Math.floor(Math.random() * columns.length)
      
      const task = {
        id: generateRandomId(),
        title: taskTitles[j % taskTitles.length],
        description: taskDescriptions[j % taskDescriptions.length],
        columnId: columns[columnIndex].id,
        priority: getRandomElement(priorities),
        createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
        dueDate: getRandomDate(new Date(), new Date(2025, 11, 31)),
        assignee: getRandomElement(assignees),
        labels: [getRandomElement(labels)]
      }
      
      tasks.push(task)
    }
    
    projects.push({
      id: generateRandomId(),
      name: projectName,
      description: `A sample ${projectName.toLowerCase()} project for demonstration purposes`,
      columns,
      tasks
    })
  }
  
  return projects
}

// Create the store
const store = {
  state: reactive({
    projects: [],
    loaded: false
  }),
  
  init() {
    try {
      // Try to load from localStorage if available
      const savedData = localStorage.getItem('kanbanmaster-data')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        this.state.projects = parsedData
        this.state.loaded = true
      } else {
        // Generate demo data if nothing in localStorage
        this.regenerateData()
      }
    } catch (error) {
      console.error('Error initializing store:', error)
      this.regenerateData()
    }
  },
  
  regenerateData() {
    this.state.projects = generateDemoProjects()
    this.state.loaded = true
    this.saveToStorage()
  },
  
  saveToStorage() {
    try {
      localStorage.setItem('kanbanmaster-data', JSON.stringify(this.state.projects))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },
  
  // Project methods
  getProjects() {
    return this.state.projects
  },
  
  getProject(projectId) {
    return this.state.projects.find(project => project.id === projectId)
  },
  
  addProject(project) {
    this.state.projects.push({
      id: generateRandomId(),
      ...project,
      tasks: []
    })
    this.saveToStorage()
  },
  
  updateProject(projectId, updates) {
    const index = this.state.projects.findIndex(project => project.id === projectId)
    if (index !== -1) {
      this.state.projects[index] = { ...this.state.projects[index], ...updates }
      this.saveToStorage()
    }
  },
  
  deleteProject(projectId) {
    const index = this.state.projects.findIndex(project => project.id === projectId)
    if (index !== -1) {
      this.state.projects.splice(index, 1)
      this.saveToStorage()
    }
  },
  
  // Column methods
  getColumns(projectId) {
    const project = this.getProject(projectId)
    return project ? project.columns.sort((a, b) => a.order - b.order) : []
  },
  
  addColumn(projectId, column) {
    const project = this.getProject(projectId)
    if (project) {
      const newColumn = {
        id: generateRandomId(),
        order: project.columns.length,
        ...column
      }
      project.columns.push(newColumn)
      this.saveToStorage()
      return newColumn
    }
    return null
  },
  
  updateColumn(projectId, columnId, updates) {
    const project = this.getProject(projectId)
    if (project) {
      const column = project.columns.find(col => col.id === columnId)
      if (column) {
        Object.assign(column, updates)
        this.saveToStorage()
      }
    }
  },
  
  deleteColumn(projectId, columnId) {
    const project = this.getProject(projectId)
    if (project) {
      const columnIndex = project.columns.findIndex(col => col.id === columnId)
      if (columnIndex !== -1) {
        // Remove the column
        project.columns.splice(columnIndex, 1)
        
        // Remove all tasks in this column
        project.tasks = project.tasks.filter(task => task.columnId !== columnId)
        
        // Update order of remaining columns
        project.columns.forEach((col, index) => {
          col.order = index
        })
        
        this.saveToStorage()
      }
    }
  },
  
  updateColumnsOrder(projectId, columns) {
    const project = this.getProject(projectId)
    if (project) {
      // Update column order based on the new array order
      columns.forEach((column, index) => {
        const targetColumn = project.columns.find(col => col.id === column.id)
        if (targetColumn) {
          targetColumn.order = index
        }
      })
      this.saveToStorage()
    }
  },
  
  // Task methods
  getTasks(projectId, columnId = null) {
    const project = this.getProject(projectId)
    if (!project) return []
    
    if (columnId) {
      return project.tasks.filter(task => task.columnId === columnId)
    }
    return project.tasks
  },
  
  getTask(projectId, taskId) {
    const project = this.getProject(projectId)
    if (project) {
      return project.tasks.find(task => task.id === taskId)
    }
    return null
  },
  
  addTask(projectId, task) {
    const project = this.getProject(projectId)
    if (project) {
      const newTask = {
        id: generateRandomId(),
        createdAt: new Date(),
        ...task
      }
      project.tasks.push(newTask)
      this.saveToStorage()
      return newTask
    }
    return null
  },
  
  updateTask(projectId, taskId, updates) {
    const project = this.getProject(projectId)
    if (project) {
      const task = project.tasks.find(t => t.id === taskId)
      if (task) {
        Object.assign(task, updates)
        this.saveToStorage()
      }
    }
  },
  
  moveTask(projectId, taskId, newColumnId) {
    const project = this.getProject(projectId)
    if (project) {
      const task = project.tasks.find(t => t.id === taskId)
      if (task) {
        task.columnId = newColumnId
        this.saveToStorage()
      }
    }
  },
  
  deleteTask(projectId, taskId) {
    const project = this.getProject(projectId)
    if (project) {
      const taskIndex = project.tasks.findIndex(task => task.id === taskId)
      if (taskIndex !== -1) {
        project.tasks.splice(taskIndex, 1)
        this.saveToStorage()
      }
    }
  },
  
  searchTasks(projectId, searchTerm) {
    const project = this.getProject(projectId)
    if (!project || !searchTerm) return []
    
    const lowercaseTerm = searchTerm.toLowerCase()
    return project.tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseTerm) || 
      task.description.toLowerCase().includes(lowercaseTerm)
    )
  },
  
  filterTasks(projectId, filters) {
    const project = this.getProject(projectId)
    if (!project || !filters) return project.tasks
    
    return project.tasks.filter(task => {
      // Filter by assignee
      if (filters.assignee && task.assignee !== filters.assignee) {
        return false
      }
      
      // Filter by priority
      if (filters.priority && task.priority !== filters.priority) {
        return false
      }
      
      // Filter by label
      if (filters.label && !task.labels.includes(filters.label)) {
        return false
      }
      
      return true
    })
  }
}

export default store