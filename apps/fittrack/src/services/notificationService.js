import { ref } from 'vue';
import { getUserSettings, updateUserSettings } from './dataService';

// Notification permission state
const notificationPermission = ref('default');

// Check if browser supports notifications
const isNotificationsSupported = () => {
  return 'Notification' in window;
};

// Update notification permission status
const updatePermissionStatus = () => {
  if (isNotificationsSupported()) {
    notificationPermission.value = Notification.permission;
  }
};

// Request notification permission
const requestNotificationPermission = async () => {
  if (!isNotificationsSupported()) {
    return { granted: false, reason: 'not-supported' };
  }
  
  try {
    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;
    
    const settings = getUserSettings();
    
    // Auto-enable notifications if permission is granted
    if (permission === 'granted' && !settings.enableNotifications) {
      updateUserSettings({
        ...settings,
        enableNotifications: true
      });
    }
    
    return { granted: permission === 'granted' };
  } catch (error) {
    return { granted: false, reason: 'error', error: error.message };
  }
};

// Show a notification
const showNotification = (title, options = {}) => {
  const settings = getUserSettings();
  
  if (!settings.enableNotifications || !isNotificationsSupported() || Notification.permission !== 'granted') {
    return false;
  }
  
  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      ...options
    });
    
    if (options.duration) {
      setTimeout(() => {
        notification.close();
      }, options.duration);
    }
    
    return true;
  } catch (error) {
    console.error('Notification error:', error);
    return false;
  }
};

// Schedule workout reminder
const scheduleWorkoutReminder = (time, workoutName) => {
  const settings = getUserSettings();
  
  if (!settings.enableNotifications || !settings.workoutReminders) {
    return false;
  }
  
  const now = new Date();
  const scheduleTime = new Date(time);
  const timeUntilWorkout = scheduleTime.getTime() - now.getTime();
  
  if (timeUntilWorkout <= 0) {
    return false;
  }
  
  setTimeout(() => {
    showNotification('Workout Reminder', {
      body: `It's time for your ${workoutName} workout!`,
      tag: 'workout-reminder'
    });
  }, timeUntilWorkout);
  
  return true;
};

// Goal achievement notification
const notifyGoalAchievement = (goalType, achieved, target) => {
  const settings = getUserSettings();
  
  if (!settings.enableNotifications || !settings.goalAchievements) {
    return false;
  }
  
  const percentage = Math.round((achieved / target) * 100);
  
  let title = 'Goal Update';
  let body = '';
  
  if (percentage >= 100) {
    title = 'Goal Achieved! 🎉';
    body = `Congratulations! You've reached your ${goalType} goal of ${target}!`;
  } else if (percentage >= 75) {
    title = 'Almost There!';
    body = `You're at ${percentage}% of your ${goalType} goal. Keep going!`;
  } else if (percentage >= 50) {
    title = 'Halfway There!';
    body = `You've completed ${percentage}% of your ${goalType} goal!`;
  }
  
  if (body) {
    return showNotification(title, {
      body,
      tag: 'goal-achievement'
    });
  }
  
  return false;
};

// Update notification settings
const updateNotificationSettings = (notificationSettings) => {
  const settings = getUserSettings();
  const updatedSettings = { 
    ...settings, 
    ...notificationSettings 
  };
  
  updateUserSettings(updatedSettings);
  
  // Request permission if enabling notifications
  if (notificationSettings.enableNotifications && 
      notificationPermission.value !== 'granted' && 
      notificationPermission.value !== 'denied') {
    requestNotificationPermission();
  }
  
  return updatedSettings;
};

// Initialize notification service
const initializeNotificationService = () => {
  updatePermissionStatus();
  
  // Check if we need to request permission
  const settings = getUserSettings();
  if (settings.enableNotifications && 
      notificationPermission.value !== 'granted' && 
      notificationPermission.value !== 'denied') {
    requestNotificationPermission();
  }
};

export {
  notificationPermission,
  isNotificationsSupported,
  requestNotificationPermission,
  showNotification,
  scheduleWorkoutReminder,
  notifyGoalAchievement,
  updateNotificationSettings,
  initializeNotificationService
};