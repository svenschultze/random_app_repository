import { defineStore } from 'pinia'
import { format, parseISO, addDays, addHours, startOfToday, getHours } from 'date-fns'

// Generate random events for the next 30 days
const generateEvents = () => {
  const events = []
  const today = startOfToday()
  const statusOptions = ['confirmed', 'pending', 'cancelled']
  const userIds = [1, 2, 3, 4, 5]
  const titles = [
    'Team Meeting', 'Project Review', 'Client Call', 'Sprint Planning',
    'Design Review', 'Marketing Strategy', 'Budget Discussion', 'Product Demo',
    'One-on-One', 'Workshop', 'Training Session', 'Focus Time', 'Lunch Break'
  ]
  
  // Generate some random events
  for (let i = 0; i < 50; i++) {
    const dayOffset = Math.floor(Math.random() * 30)
    const startDate = addDays(today, dayOffset)
    const hour = 9 + Math.floor(Math.random() * 8) // Between 9 AM and 5 PM
    const duration = [0.5, 1, 1.5, 2][Math.floor(Math.random() * 4)] // Duration in hours
    
    startDate.setHours(hour)
    startDate.setMinutes(Math.random() < 0.5 ? 0 : 30)
    
    const endDate = addHours(startDate, duration)
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]
    
    // Randomly assign attendees (1-4 attendees per event)
    const attendees = []
    const numAttendees = 1 + Math.floor(Math.random() * 4)
    const shuffledUsers = [...userIds].sort(() => 0.5 - Math.random())
    
    for (let j = 0; j < numAttendees; j++) {
      if (j < shuffledUsers.length) {
        attendees.push(shuffledUsers[j])
      }
    }
    
    events.push({
      id: i + 1,
      title: titles[Math.floor(Math.random() * titles.length)],
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      status,
      attendees,
      description: 'Generated event description',
      isAllDay: false,
      location: Math.random() > 0.7 ? 'Conference Room A' : 'Virtual',
      color: ['#4F46E5', '#EC4899', '#10B981', '#F59E0B'][Math.floor(Math.random() * 4)]
    })
  }
  
  // Add a few all-day events
  for (let i = 0; i < 5; i++) {
    const dayOffset = Math.floor(Math.random() * 30)
    const startDate = addDays(today, dayOffset)
    
    events.push({
      id: events.length + 1,
      title: ['Company Holiday', 'Team Building', 'Conference', 'Out of Office', 'Training Day'][i],
      start: startDate.toISOString(),
      end: addDays(startDate, 1).toISOString(),
      status: 'confirmed',
      attendees: userIds,
      description: 'All-day event',
      isAllDay: true,
      location: i === 2 ? 'Convention Center' : '',
      color: '#3B82F6'
    })
  }
  
  return events
}

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    events: generateEvents(),
    currentView: 'week', // day, week, month
    selectedDate: new Date().toISOString(),
    timeZone: 'America/New_York',
    darkMode: false,
    currentRole: 'admin', // admin, manager, employee, guest
    showModal: false,
    modalType: null,
    selectedEventId: null,
    pendingApprovals: [],
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', avatar: 'https://i.pravatar.cc/150?img=1', timezone: 'America/New_York' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', avatar: 'https://i.pravatar.cc/150?img=5', timezone: 'America/Los_Angeles' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'employee', avatar: 'https://i.pravatar.cc/150?img=7', timezone: 'Europe/London' },
      { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'employee', avatar: 'https://i.pravatar.cc/150?img=9', timezone: 'Asia/Tokyo' },
      { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'guest', avatar: 'https://i.pravatar.cc/150?img=8', timezone: 'America/Chicago' }
    ],
    availabilityData: generateAvailabilityData(),
    sharedCalendars: [
      { 
        id: 1, 
        ownerId: 1, 
        name: 'Team Calendar', 
        description: 'Company-wide events and meetings',
        isShared: true,
        permissions: [
          { userId: 2, access: 'edit' },
          { userId: 3, access: 'view' },
          { userId: 4, access: 'view' },
          { userId: 5, access: 'view' }
        ]
      },
      { 
        id: 2, 
        ownerId: 2, 
        name: 'Marketing Calendar', 
        description: 'Marketing team events and campaigns',
        isShared: true,
        permissions: [
          { userId: 1, access: 'edit' },
          { userId: 3, access: 'edit' },
          { userId: 4, access: 'view' }
        ]
      }
    ]
  }),
  
  getters: {
    getEvents: (state) => state.events,
    
    getFilteredEvents: (state) => {
      return (dateFilter = () => true, userFilter = () => true) => {
        return state.events.filter(event => {
          if (!dateFilter(event)) return false
          if (!userFilter(event)) return false
          return true
        })
      }
    },
    
    getEventById: (state) => {
      return (id) => state.events.find(event => event.id === id)
    },
    
    getPendingEvents: (state) => {
      return state.events.filter(event => event.status === 'pending')
    },
    
    hasEditPermission: (state) => {
      return state.currentRole === 'admin' || state.currentRole === 'manager'
    },
    
    getUserById: (state) => {
      return (id) => state.users.find(user => user.id === id)
    },
    
    getSelectedEvent: (state) => {
      return state.selectedEventId ? state.events.find(event => event.id === state.selectedEventId) : null
    }
  },
  
  actions: {
    addEvent(event) {
      // Calculate next ID
      const nextId = Math.max(0, ...this.events.map(e => e.id)) + 1
      const newEvent = { 
        id: nextId,
        ...event
      }
      
      this.events.push(newEvent)
      return newEvent
    },
    
    updateEvent(updatedEvent) {
      const index = this.events.findIndex(event => event.id === updatedEvent.id)
      if (index !== -1) {
        this.events[index] = { ...this.events[index], ...updatedEvent }
      }
    },
    
    deleteEvent(id) {
      const index = this.events.findIndex(event => event.id === id)
      if (index !== -1) {
        this.events.splice(index, 1)
      }
    },
    
    setCurrentView(view) {
      this.currentView = view
    },
    
    setSelectedDate(date) {
      this.selectedDate = date
    },
    
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      document.documentElement.classList.toggle('dark', this.darkMode)
    },
    
    setCurrentRole(role) {
      this.currentRole = role
    },
    
    openModal(type, eventId = null) {
      this.modalType = type
      this.selectedEventId = eventId
      this.showModal = true
    },
    
    closeModal() {
      this.showModal = false
      this.modalType = null
      this.selectedEventId = null
    },
    
    approveEvent(id) {
      const event = this.events.find(event => event.id === id)
      if (event) {
        event.status = 'confirmed'
      }
    },
    
    rejectEvent(id) {
      const event = this.events.find(event => event.id === id)
      if (event) {
        event.status = 'cancelled'
      }
    },
    
    // Simulate AI scheduling recommendation
    findOptimalTime(duration, requiredAttendees) {
      // Simulated AI logic that would analyze available time slots
      const suggestions = []
      const today = new Date()
      
      // Simple algorithm to find 3 available time slots
      for (let day = 1; day <= 5; day++) {
        const date = addDays(today, day)
        
        // Check times throughout the day
        for (let hour = 9; hour <= 16; hour++) {
          // Skip lunch hour
          if (hour === 12) continue
          
          // Check if this timeslot conflicts with existing events
          const conflicts = this.events.filter(event => {
            const eventStart = new Date(event.start)
            const eventDay = eventStart.getDate()
            const eventHour = eventStart.getHours()
            
            return eventDay === date.getDate() && 
                  Math.abs(eventHour - hour) < 2 &&
                  event.attendees.some(id => requiredAttendees.includes(id))
          })
          
          if (conflicts.length === 0) {
            const startTime = new Date(date)
            startTime.setHours(hour)
            startTime.setMinutes(0)
            startTime.setSeconds(0)
            
            const endTime = addHours(startTime, duration)
            
            suggestions.push({
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              score: 100 - day * 10 - Math.abs(hour - 14) * 5 // Higher score for sooner dates and closer to middle of day
            })
            
            if (suggestions.length >= 3) break
          }
        }
        
        if (suggestions.length >= 3) break
      }
      
      return suggestions.sort((a, b) => b.score - a.score)
    },
    
    setTimeZone(timeZone) {
      this.timeZone = timeZone
    },
    
    // Calendar sharing methods
    getSharedCalendars() {
      return this.sharedCalendars
    },
    
    getCalendarById(id) {
      return this.sharedCalendars.find(calendar => calendar.id === id)
    },
    
    getUserCalendars(userId) {
      return this.sharedCalendars.filter(calendar => 
        calendar.ownerId === userId || 
        calendar.permissions.some(p => p.userId === userId)
      )
    },
    
    createSharedCalendar(calendar) {
      const nextId = Math.max(0, ...this.sharedCalendars.map(c => c.id)) + 1
      const newCalendar = {
        id: nextId,
        ...calendar
      }
      this.sharedCalendars.push(newCalendar)
      return newCalendar
    },
    
    updateSharedCalendar(calendarId, updates) {
      const index = this.sharedCalendars.findIndex(c => c.id === calendarId)
      if (index !== -1) {
        this.sharedCalendars[index] = { ...this.sharedCalendars[index], ...updates }
      }
    },
    
    shareCalendarWithUser(calendarId, userId, accessLevel = 'view') {
      const calendar = this.getCalendarById(calendarId)
      if (!calendar) return false
      
      // Remove existing permission if any
      calendar.permissions = calendar.permissions.filter(p => p.userId !== userId)
      
      // Add new permission
      calendar.permissions.push({ userId, access: accessLevel })
      calendar.isShared = true
      
      return true
    },
    
    removeCalendarSharing(calendarId, userId) {
      const calendar = this.getCalendarById(calendarId)
      if (!calendar) return false
      
      calendar.permissions = calendar.permissions.filter(p => p.userId !== userId)
      
      // If no more permissions, mark as not shared
      if (calendar.permissions.length === 0) {
        calendar.isShared = false
      }
      
      return true
    },
    
    // Check if user has access to a calendar
    hasCalendarAccess(calendarId, userId, requiredAccess = 'view') {
      const calendar = this.getCalendarById(calendarId)
      if (!calendar) return false
      
      // Owner has full access
      if (calendar.ownerId === userId) return true
      
      // Check permissions
      const userPermission = calendar.permissions.find(p => p.userId === userId)
      if (!userPermission) return false
      
      // For edit access, user must have edit permission
      if (requiredAccess === 'edit') {
        return userPermission.access === 'edit'
      }
      
      // For view access, either view or edit is sufficient
      return ['view', 'edit'].includes(userPermission.access)
    }
  }
})

function generateAvailabilityData() {
  const users = [1, 2, 3, 4, 5]
  const availability = {}
  
  users.forEach(userId => {
    availability[userId] = []
    
    // Generate 5 days of availability
    for (let day = 0; day < 5; day++) {
      const date = addDays(startOfToday(), day)
      
      // Morning availability (9 AM - 12 PM)
      if (Math.random() > 0.3) {
        availability[userId].push({
          start: (() => {
            const d = new Date(date)
            d.setHours(9)
            d.setMinutes(0)
            return d.toISOString()
          })(),
          end: (() => {
            const d = new Date(date)
            d.setHours(12)
            d.setMinutes(0)
            return d.toISOString()
          })()
        })
      }
      
      // Afternoon availability (1 PM - 5 PM)
      if (Math.random() > 0.3) {
        availability[userId].push({
          start: (() => {
            const d = new Date(date)
            d.setHours(13)
            d.setMinutes(0)
            return d.toISOString()
          })(),
          end: (() => {
            const d = new Date(date)
            d.setHours(17)
            d.setMinutes(0)
            return d.toISOString()
          })()
        })
      }
    }
  })
  
  return availability
}