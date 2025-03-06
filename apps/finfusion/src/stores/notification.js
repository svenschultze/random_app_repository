import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateNotifications } from '@/utils/mockData'

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref([])
  const isDataLoaded = ref(false)
  
  // Computed
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })
  
  const urgentNotifications = computed(() => {
    return notifications.value.filter(n => n.isUrgent)
  })
  
  const groupedNotifications = computed(() => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const todayItems = []
    const yesterdayItems = []
    const olderItems = []
    
    notifications.value.forEach(notification => {
      const notifDate = new Date(notification.date)
      
      if (notifDate.toDateString() === today.toDateString()) {
        todayItems.push(notification)
      } else if (notifDate.toDateString() === yesterday.toDateString()) {
        yesterdayItems.push(notification)
      } else {
        olderItems.push(notification)
      }
    })
    
    return {
      today: todayItems,
      yesterday: yesterdayItems,
      older: olderItems
    }
  })
  
  // Actions
  const initializeData = () => {
    notifications.value = generateNotifications(15)
    isDataLoaded.value = true
  }
  
  const refreshData = () => {
    notifications.value = generateNotifications(15)
  }
  
  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
  }
  
  const markAllAsRead = () => {
    notifications.value.forEach(notification => {
      notification.isRead = true
    })
  }
  
  const deleteNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  return {
    notifications,
    isDataLoaded,
    unreadCount,
    urgentNotifications,
    groupedNotifications,
    initializeData,
    refreshData,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
})