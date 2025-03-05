import { defineStore } from 'pinia'
import { addMinutes, format, parseISO } from 'date-fns'

// Generate mock notifications
const generateNotifications = () => {
  const notifications = []
  const types = ['reminder', 'approval', 'followup', 'mention', 'system']
  const messages = [
    'Meeting starts in 15 minutes',
    'New meeting request needs your approval',
    'Follow up on yesterday\'s team meeting',
    'You were mentioned in a shared calendar',
    'Calendar integration is now available',
    'Your scheduled event has been updated',
    'New task has been assigned to you',
    'Upcoming deadline for project delivery',
    'Meeting was rescheduled by the organizer'
  ]
  
  // Generate random notifications
  for (let i = 0; i < 12; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const message = messages[Math.floor(Math.random() * messages.length)]
    const isRead = Math.random() > 0.6
    const createdAt = new Date()
    createdAt.setMinutes(createdAt.getMinutes() - Math.floor(Math.random() * 120))
    
    let relatedId = null
    if (type === 'reminder' || type === 'approval' || type === 'followup') {
      relatedId = Math.floor(Math.random() * 50) + 1 // Random event ID
    }
    
    notifications.push({
      id: i + 1,
      type,
      message,
      isRead,
      relatedId,
      createdAt: createdAt.toISOString()
    })
  }
  
  return notifications
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: generateNotifications(),
    showNotificationsPanel: false,
    userPreferences: {
      emailNotifications: true,
      browserNotifications: true,
      reminders: {
        defaultTiming: 15, // minutes before event
        enabled: true
      },
      notifyOnNewTasks: true,
      notifyOnMentions: true
    }
  }),
  
  getters: {
    getNotifications: (state) => state.notifications,
    
    getUnreadNotifications: (state) => {
      return state.notifications.filter(notification => !notification.isRead)
    },
    
    getNotificationsByType: (state) => {
      return (type) => state.notifications.filter(notification => notification.type === type)
    },
    
    getUnreadCount: (state) => {
      return state.notifications.filter(notification => !notification.isRead).length
    },
    
    getApprovalCount: (state) => {
      return state.notifications.filter(notification => 
        notification.type === 'approval' && !notification.isRead
      ).length
    }
  },
  
  actions: {
    addNotification(notification) {
      const nextId = Math.max(0, ...this.notifications.map(n => n.id)) + 1
      const newNotification = {
        id: nextId,
        isRead: false,
        createdAt: new Date().toISOString(),
        ...notification
      }
      
      this.notifications.unshift(newNotification)
      return newNotification
    },
    
    markAsRead(id) {
      const notification = this.notifications.find(notification => notification.id === id)
      if (notification) {
        notification.isRead = true
      }
    },
    
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.isRead = true
      })
    },
    
    deleteNotification(id) {
      const index = this.notifications.findIndex(notification => notification.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },
    
    clearAllNotifications() {
      this.notifications = []
    },
    
    toggleNotificationsPanel() {
      this.showNotificationsPanel = !this.showNotificationsPanel
    },
    
    // Create a notification for an upcoming event
    createEventReminder(event, minutesBefore = null) {
      const eventStart = new Date(event.start)
      const reminderTime = minutesBefore || this.userPreferences.reminders.defaultTiming
      
      const notificationTime = addMinutes(eventStart, -reminderTime)
      
      // This would normally be handled by a server-side job scheduler
      // For the demo, we'll simulate it with setTimeout if the time is in the future
      const now = new Date()
      
      if (notificationTime > now) {
        const delayMs = notificationTime.getTime() - now.getTime()
        
        // Only set timeout if it's within the next hour (for demo purposes)
        if (delayMs < 3600000) {
          setTimeout(() => {
            this.addNotification({
              type: 'reminder',
              message: `${event.title} starts in ${reminderTime} minutes`,
              relatedId: event.id
            })
          }, delayMs)
        }
      }
    },
    
    // Simulate receiving a new notification (for demo purposes)
    simulateNewNotification(type) {
      let message = ''
      let relatedId = null
      
      switch (type) {
        case 'reminder':
          message = 'Demo: Upcoming meeting reminder'
          relatedId = Math.floor(Math.random() * 50) + 1
          break
        case 'approval':
          message = 'Demo: New meeting requires your approval'
          relatedId = Math.floor(Math.random() * 50) + 1
          break
        case 'followup':
          message = 'Demo: Follow up needed for yesterday\'s meeting'
          relatedId = Math.floor(Math.random() * 50) + 1
          break
        case 'mention':
          message = 'Demo: You were mentioned in a calendar comment'
          break
        case 'system':
          message = 'Demo: System notification - Calendar updated'
          break
        default:
          message = 'Demo: New notification'
      }
      
      return this.addNotification({
        type,
        message,
        relatedId
      })
    },
    
    updateNotificationPreferences(preferences) {
      this.userPreferences = {
        ...this.userPreferences,
        ...preferences
      }
    }
  }
})