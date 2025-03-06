import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    nextId: 1,
  }),
  
  getters: {
    // Get all active notifications
    activeNotifications: (state) => {
      return state.notifications.filter(notification => !notification.read);
    },
    
    // Get number of unread notifications
    unreadCount: (state) => {
      return state.notifications.filter(notification => !notification.read).length;
    }
  },
  
  actions: {
    // Add a new notification
    addNotification(notification) {
      const id = this.nextId++;
      
      this.notifications.push({
        id,
        timestamp: new Date(),
        read: false,
        ...notification
      });
      
      // Auto-dismiss after delay if specified
      if (notification.autoDismiss) {
        setTimeout(() => {
          this.dismissNotification(id);
        }, notification.autoDismiss);
      }
      
      return id;
    },
    
    // Mark notification as read
    markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
    },
    
    // Mark all notifications as read
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    
    // Dismiss notification (remove from list)
    dismissNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    },
    
    // Add a level-up notification
    notifyLevelUp(level) {
      return this.addNotification({
        type: 'level-up',
        title: 'Level Up!',
        message: `Congratulations! You've reached level ${level}!`,
        autoDismiss: 5000, // Dismiss after 5 seconds
      });
    },
    
    // Add a badge earned notification
    notifyBadgeEarned(badge) {
      return this.addNotification({
        type: 'badge',
        title: 'Badge Earned!',
        message: `You've earned the "${badge.name}" badge!`,
        data: badge,
        autoDismiss: 5000,
      });
    },
    
    // Add a streak update notification
    notifyStreakUpdate(days) {
      return this.addNotification({
        type: 'streak',
        title: 'Streak Updated!',
        message: `You're on a ${days}-day streak! Keep it up!`,
        autoDismiss: 5000,
      });
    },
    
    // Add a lesson completed notification
    notifyLessonCompleted(lesson, xpEarned) {
      return this.addNotification({
        type: 'lesson-complete',
        title: 'Lesson Completed!',
        message: `You've completed "${lesson.title}" and earned ${xpEarned} XP!`,
        data: { lesson, xpEarned },
        autoDismiss: 5000,
      });
    }
  }
});