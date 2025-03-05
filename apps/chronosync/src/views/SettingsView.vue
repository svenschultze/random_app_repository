<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCalendarStore } from '../stores/calendar'
import { useNotificationsStore } from '../stores/notifications'

const calendarStore = useCalendarStore()
const notificationsStore = useNotificationsStore()

// Personal settings
const userSettings = ref({
  name: '',
  email: '',
  timezone: '',
  avatar: ''
})

// Notification settings
const notificationSettings = ref({
  emailNotifications: true,
  browserNotifications: true,
  defaultReminderTime: 15, // minutes
  notifyOnNewEvents: true,
  notifyOnEventChanges: true,
  notifyOnTaskAssignments: true,
  notifyOnMentions: true,
  dailyAgendaEmail: true
})

// Calendar settings
const calendarSettings = ref({
  defaultView: 'week',
  weekStartsOn: 0, // 0 = Sunday, 1 = Monday
  workingHours: {
    start: 9,
    end: 17
  },
  hiddenCalendars: [],
  showWeekends: true,
  showDeclinedEvents: false,
  defaultDuration: 60 // minutes
})

// Integration settings
const integrationSettings = ref({
  connectedAccounts: [
    { id: 'google', name: 'Google Calendar', connected: false, lastSync: null },
    { id: 'outlook', name: 'Outlook Calendar', connected: false, lastSync: null },
    { id: 'slack', name: 'Slack', connected: false, lastSync: null },
    { id: 'zoom', name: 'Zoom', connected: false, lastSync: null }
  ]
})

// Get user calendars and shared calendars
const userCalendars = computed(() => {
  // Get the current user ID based on role
  const currentUser = calendarStore.users.find(user => user.role === calendarStore.currentRole)
  const userId = currentUser ? currentUser.id : null
  
  if (!userId) return []
  
  // Get calendars owned by the user
  return calendarStore.sharedCalendars.filter(calendar => calendar.ownerId === userId)
})

const sharedWithMe = computed(() => {
  // Get the current user ID based on role
  const currentUser = calendarStore.users.find(user => user.role === calendarStore.currentRole)
  const userId = currentUser ? currentUser.id : null
  
  if (!userId) return []
  
  // Get calendars shared with the user
  return calendarStore.sharedCalendars.filter(calendar => 
    calendar.ownerId !== userId && 
    calendar.permissions.some(p => p.userId === userId)
  )
})

// New calendar form
const newCalendarForm = ref({
  name: '',
  description: '',
  isShared: false
})

// Create a new calendar
const createNewCalendar = () => {
  // Get the current user ID based on role
  const currentUser = calendarStore.users.find(user => user.role === calendarStore.currentRole)
  if (!currentUser) return
  
  const newCalendar = {
    ownerId: currentUser.id,
    name: newCalendarForm.value.name,
    description: newCalendarForm.value.description,
    isShared: newCalendarForm.value.isShared,
    permissions: []
  }
  
  calendarStore.createSharedCalendar(newCalendar)
  
  // Reset form
  newCalendarForm.value = {
    name: '',
    description: '',
    isShared: false
  }
  
  notificationsStore.addNotification({
    type: 'system',
    message: 'Calendar created successfully.'
  })
}

// Share calendar modal
const showShareModal = ref(false)
const selectedCalendarId = ref(null)
const selectedUserIds = ref([])
const sharingAccessLevel = ref('view') // 'view' or 'edit'

const openShareModal = (calendarId) => {
  selectedCalendarId.value = calendarId
  selectedUserIds.value = []
  sharingAccessLevel.value = 'view'
  showShareModal.value = true
}

const shareCalendarWithUsers = () => {
  if (!selectedCalendarId.value || selectedUserIds.value.length === 0) return
  
  selectedUserIds.value.forEach(userId => {
    calendarStore.shareCalendarWithUser(
      selectedCalendarId.value, 
      userId, 
      sharingAccessLevel.value
    )
  })
  
  showShareModal.value = false
  
  notificationsStore.addNotification({
    type: 'system',
    message: 'Calendar shared successfully.'
  })
}

// Get users not already having access to a calendar
const getAvailableUsers = (calendarId) => {
  const calendar = calendarStore.getCalendarById(calendarId)
  if (!calendar) return []
  
  const existingUserIds = [calendar.ownerId, ...calendar.permissions.map(p => p.userId)]
  
  return calendarStore.users.filter(user => !existingUserIds.includes(user.id))
}

// Remove calendar sharing
const removeCalendarSharing = (calendarId, userId) => {
  calendarStore.removeCalendarSharing(calendarId, userId)
  
  notificationsStore.addNotification({
    type: 'system',
    message: 'Calendar sharing removed.'
  })
}

// Admin settings (only visible to admins)
const adminSettings = ref({
  userRoles: [
    { id: 1, name: 'John Doe', role: 'admin' },
    { id: 2, name: 'Jane Smith', role: 'manager' },
    { id: 3, name: 'Bob Johnson', role: 'employee' },
    { id: 4, name: 'Alice Williams', role: 'employee' },
    { id: 5, name: 'Charlie Brown', role: 'guest' }
  ],
  defaultPermissions: {
    manager: ['view', 'edit', 'share', 'delete'],
    employee: ['view', 'edit'],
    guest: ['view']
  },
  organizationSettings: {
    name: 'Demo Organization',
    logo: '',
    domain: 'demo.chronosync.com'
  }
})

// Save settings
const savePersonalSettings = () => {
  notificationsStore.addNotification({
    type: 'system',
    message: 'Personal settings saved successfully.'
  })
}

const saveNotificationSettings = () => {
  notificationsStore.addNotification({
    type: 'system',
    message: 'Notification preferences saved successfully.'
  })
}

const saveCalendarSettings = () => {
  calendarStore.setCurrentView(calendarSettings.value.defaultView)
  
  notificationsStore.addNotification({
    type: 'system',
    message: 'Calendar settings saved successfully.'
  })
}

const saveAdminSettings = () => {
  notificationsStore.addNotification({
    type: 'system',
    message: 'Admin settings saved successfully.'
  })
}

// Connect integrations (demo only)
const connectAccount = (accountId) => {
  const account = integrationSettings.value.connectedAccounts.find(acc => acc.id === accountId)
  if (account) {
    // Show loading simulation for demo purposes
    account.isConnecting = true
    
    // Simulate API connection delay
    setTimeout(() => {
      account.connected = true
      account.lastSync = new Date().toISOString()
      account.isConnecting = false
      
      // Show success notification
      notificationsStore.addNotification({
        type: 'system',
        message: `Connected to ${account.name} successfully.`
      })
      
      // Create demo notification about the integration
      if (account.id === 'google') {
        setTimeout(() => {
          notificationsStore.addNotification({
            type: 'system',
            message: `Imported 12 events from Google Calendar.`
          })
        }, 2000)
      } else if (account.id === 'slack') {
        setTimeout(() => {
          notificationsStore.addNotification({
            type: 'system',
            message: `Connected to 3 Slack channels for notifications.`
          })
        }, 2000)
      } else if (account.id === 'zoom') {
        setTimeout(() => {
          notificationsStore.addNotification({
            type: 'system',
            message: `Zoom integration active. You can now auto-generate meeting links.`
          })
        }, 2000)
      }
    }, 1500)
  }
}

const disconnectAccount = (accountId) => {
  const account = integrationSettings.value.connectedAccounts.find(acc => acc.id === accountId)
  if (account) {
    // Simulating disconnection
    account.isDisconnecting = true
    
    setTimeout(() => {
      account.connected = false
      account.lastSync = null
      account.isDisconnecting = false
      
      notificationsStore.addNotification({
        type: 'system',
        message: `Disconnected from ${account.name}.`
      })
    }, 1000)
  }
}

// Demo function to simulate creating a meeting with video integration
const createMeetingWithIntegration = (integrationType) => {
  if (integrationType === 'zoom' && 
      !integrationSettings.value.connectedAccounts.find(acc => acc.id === 'zoom').connected) {
    notificationsStore.addNotification({
      type: 'system',
      message: 'Please connect to Zoom first to create video meetings.'
    })
    return
  }
  
  notificationsStore.addNotification({
    type: 'system',
    message: `Demo: Created a meeting with ${integrationType} video link.`
  })
}

// Demo function to simulate syncing with external calendars
const syncWithExternalCalendar = (calendarType) => {
  if ((calendarType === 'google' && 
       !integrationSettings.value.connectedAccounts.find(acc => acc.id === 'google').connected) ||
      (calendarType === 'outlook' && 
       !integrationSettings.value.connectedAccounts.find(acc => acc.id === 'outlook').connected)) {
    notificationsStore.addNotification({
      type: 'system',
      message: `Please connect to ${calendarType === 'google' ? 'Google Calendar' : 'Outlook Calendar'} first.`
    })
    return
  }
  
  // Show syncing indicator
  const account = integrationSettings.value.connectedAccounts.find(acc => acc.id === calendarType)
  account.isSyncing = true
  
  // Simulate sync delay
  setTimeout(() => {
    account.lastSync = new Date().toISOString()
    account.isSyncing = false
    
    notificationsStore.addNotification({
      type: 'system',
      message: `Synced with ${account.name} successfully.`
    })
  }, 2000)
}

// Sharing
const shareCalendar = () => {
  notificationsStore.addNotification({
    type: 'system',
    message: 'Calendar shared successfully.'
  })
}

// Dark mode toggle
const toggleDarkMode = () => {
  calendarStore.toggleDarkMode()
}

// Check if user is admin
const isAdmin = computed(() => {
  return calendarStore.currentRole === 'admin'
})

// Check if user is admin or manager
const isManagerOrAdmin = computed(() => {
  return calendarStore.currentRole === 'admin' || calendarStore.currentRole === 'manager'
})

// Initialize user settings
onMounted(() => {
  const currentUser = calendarStore.users.find(user => user.role === calendarStore.currentRole)
  if (currentUser) {
    userSettings.value = {
      name: currentUser.name,
      email: currentUser.email,
      timezone: currentUser.timezone,
      avatar: currentUser.avatar
    }
  }
  
  calendarSettings.value.defaultView = calendarStore.currentView
})
</script>

<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 
        v-voix="'settings-heading'" 
        class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
      >
        Settings
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        Configure your ChronoSync preferences and account settings
      </p>
    </div>
    
    <!-- Settings Tabs -->
    <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
      <ul class="flex flex-wrap -mb-px">
        <li class="mr-2">
          <a 
            v-voix="'personal-tab'" 
            hint="View personal settings"
            href="#personal" 
            class="inline-block p-4 border-b-2 border-indigo-600 rounded-t-lg active text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
          >
            Personal
          </a>
        </li>
        <li class="mr-2">
          <a 
            v-voix="'notifications-tab'" 
            hint="View notification settings"
            href="#notifications" 
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Notifications
          </a>
        </li>
        <li class="mr-2">
          <a 
            v-voix="'calendar-tab'" 
            hint="View calendar settings"
            href="#calendar" 
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Calendar
          </a>
        </li>
        <li class="mr-2">
          <a 
            v-voix="'sharing-tab'" 
            hint="View calendar sharing settings"
            href="#sharing" 
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Calendar Sharing
          </a>
        </li>
        <li class="mr-2">
          <a 
            v-voix="'integrations-tab'" 
            hint="View integrations settings"
            href="#integrations" 
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Integrations
          </a>
        </li>
        <li v-if="isAdmin" class="mr-2">
          <a 
            v-voix="'admin-tab'" 
            hint="View admin settings"
            href="#admin" 
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Admin
          </a>
        </li>
      </ul>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Sidebar -->
      <div class="md:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div class="flex flex-col items-center">
            <img 
              :src="userSettings.avatar || 'https://i.pravatar.cc/150?img=1'" 
              alt="User Avatar" 
              class="w-32 h-32 rounded-full mb-4"
            />
            <h2 class="text-xl font-medium text-gray-900 dark:text-white">
              {{ userSettings.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ calendarStore.currentRole }}
            </p>
            
            <div class="w-full mt-6 space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                <button 
                  v-voix="'dark-mode-toggle'" 
                  hint="Toggle dark mode"
                  class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
                  :class="calendarStore.darkMode ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'"
                  @click="toggleDarkMode"
                >
                  <span 
                    class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full"
                    :class="calendarStore.darkMode ? 'translate-x-6' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-700 dark:text-gray-300">Current Role</span>
                <select 
                  v-voix="'role-selector'" 
                  hint="Change your role to see different permission levels"
                  v-model="calendarStore.currentRole"
                  class="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Settings Panel -->
      <div class="md:col-span-2 space-y-6">
        <!-- Personal Settings -->
        <div id="personal" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Personal Settings
          </h2>
          
          <form @submit.prevent="savePersonalSettings">
            <div class="space-y-4">
              <div>
                <label v-voix="'name-label'" for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input 
                  v-voix="'name-input'" 
                  hint="Enter your full name"
                  id="name"
                  type="text" 
                  v-model="userSettings.name"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label v-voix="'email-label'" for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input 
                  v-voix="'email-input'" 
                  hint="Enter your email address"
                  id="email"
                  type="email" 
                  v-model="userSettings.email"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label v-voix="'timezone-label'" for="timezone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Timezone
                </label>
                <select 
                  v-voix="'timezone-select'" 
                  hint="Select your timezone"
                  id="timezone"
                  v-model="userSettings.timezone"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Berlin">Berlin (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Asia/Shanghai">China (CST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              </div>
              
              <div>
                <label v-voix="'avatar-label'" for="avatar" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Picture URL
                </label>
                <input 
                  v-voix="'avatar-input'" 
                  hint="Enter the URL of your profile picture"
                  id="avatar"
                  type="text" 
                  v-model="userSettings.avatar"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div class="flex justify-end">
                <button 
                  v-voix="'save-personal-button'" 
                  hint="Save personal settings"
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Notification Settings -->
        <div id="notifications" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Notification Settings
          </h2>
          
          <form @submit.prevent="saveNotificationSettings">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Receive notifications about events via email</p>
                </div>
                <button 
                  v-voix="'email-notifications-toggle'" 
                  hint="Toggle email notifications"
                  type="button"
                  class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
                  :class="notificationSettings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'"
                  @click="notificationSettings.emailNotifications = !notificationSettings.emailNotifications"
                >
                  <span 
                    class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full"
                    :class="notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Browser Notifications</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Receive notifications in your browser</p>
                </div>
                <button 
                  v-voix="'browser-notifications-toggle'" 
                  hint="Toggle browser notifications"
                  type="button"
                  class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
                  :class="notificationSettings.browserNotifications ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'"
                  @click="notificationSettings.browserNotifications = !notificationSettings.browserNotifications"
                >
                  <span 
                    class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full"
                    :class="notificationSettings.browserNotifications ? 'translate-x-6' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
              
              <div>
                <label v-voix="'reminder-time-label'" for="reminder-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Reminder Time
                </label>
                <select 
                  v-voix="'reminder-time-select'" 
                  hint="Select default time for event reminders"
                  id="reminder-time"
                  v-model="notificationSettings.defaultReminderTime"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="5">5 minutes before</option>
                  <option value="10">10 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                  <option value="120">2 hours before</option>
                  <option value="1440">1 day before</option>
                </select>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Agenda Email</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Receive a daily email with your schedule</p>
                </div>
                <button 
                  v-voix="'daily-agenda-toggle'" 
                  hint="Toggle daily agenda email"
                  type="button"
                  class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
                  :class="notificationSettings.dailyAgendaEmail ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'"
                  @click="notificationSettings.dailyAgendaEmail = !notificationSettings.dailyAgendaEmail"
                >
                  <span 
                    class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full"
                    :class="notificationSettings.dailyAgendaEmail ? 'translate-x-6' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
              
              <div class="flex justify-end">
                <button 
                  v-voix="'save-notifications-button'" 
                  hint="Save notification settings"
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Calendar Settings -->
        <div id="calendar" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Calendar Settings
          </h2>
          
          <form @submit.prevent="saveCalendarSettings">
            <div class="space-y-4">
              <div>
                <label v-voix="'default-view-label'" for="default-view" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Calendar View
                </label>
                <select 
                  v-voix="'default-view-select'" 
                  hint="Select your default calendar view"
                  id="default-view"
                  v-model="calendarSettings.defaultView"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
              
              <div>
                <label v-voix="'week-start-label'" for="week-start" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Week Starts On
                </label>
                <select 
                  v-voix="'week-start-select'" 
                  hint="Select which day the week starts on"
                  id="week-start"
                  v-model="calendarSettings.weekStartsOn"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option :value="0">Sunday</option>
                  <option :value="1">Monday</option>
                </select>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label v-voix="'working-hours-start-label'" for="working-hours-start" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Working Hours Start
                  </label>
                  <select 
                    v-voix="'working-hours-start-select'" 
                    hint="Select when your working day begins"
                    id="working-hours-start"
                    v-model="calendarSettings.workingHours.start"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option v-for="hour in Array.from({length: 24}, (_, i) => i)" :key="`start-${hour}`" :value="hour">
                      {{ hour.toString().padStart(2, '0') }}:00
                    </option>
                  </select>
                </div>
                
                <div>
                  <label v-voix="'working-hours-end-label'" for="working-hours-end" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Working Hours End
                  </label>
                  <select 
                    v-voix="'working-hours-end-select'" 
                    hint="Select when your working day ends"
                    id="working-hours-end"
                    v-model="calendarSettings.workingHours.end"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option v-for="hour in Array.from({length: 24}, (_, i) => i)" :key="`end-${hour}`" :value="hour">
                      {{ hour.toString().padStart(2, '0') }}:00
                    </option>
                  </select>
                </div>
              </div>
              
              <div>
                <label v-voix="'default-duration-label'" for="default-duration" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Event Duration
                </label>
                <select 
                  v-voix="'default-duration-select'" 
                  hint="Select default duration for new events"
                  id="default-duration"
                  v-model="calendarSettings.defaultDuration"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option :value="15">15 minutes</option>
                  <option :value="30">30 minutes</option>
                  <option :value="45">45 minutes</option>
                  <option :value="60">1 hour</option>
                  <option :value="90">1 hour 30 minutes</option>
                  <option :value="120">2 hours</option>
                </select>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Show Weekends</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Display weekend days in calendar views</p>
                </div>
                <button 
                  v-voix="'show-weekends-toggle'" 
                  hint="Toggle weekend visibility"
                  type="button"
                  class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none"
                  :class="calendarSettings.showWeekends ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'"
                  @click="calendarSettings.showWeekends = !calendarSettings.showWeekends"
                >
                  <span 
                    class="inline-block w-4 h-4 transform transition-transform bg-white rounded-full"
                    :class="calendarSettings.showWeekends ? 'translate-x-6' : 'translate-x-1'"
                  ></span>
                </button>
              </div>
              
              <div class="flex justify-end">
                <button 
                  v-voix="'save-calendar-settings-button'" 
                  hint="Save calendar settings"
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Calendar Sharing -->
        <div id="sharing" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 
            v-voix="'sharing-heading'" 
            class="text-lg font-medium text-gray-900 dark:text-white mb-4"
          >
            Calendar Sharing
          </h2>
          
          <!-- Create New Calendar Section -->
          <div class="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Create New Calendar</h3>
            
            <form @submit.prevent="createNewCalendar" class="space-y-4">
              <div>
                <label v-voix="'calendar-name-label'" for="calendar-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Calendar Name
                </label>
                <input 
                  v-voix="'calendar-name-input'" 
                  hint="Enter a name for your new calendar"
                  id="calendar-name"
                  type="text" 
                  v-model="newCalendarForm.name"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label v-voix="'calendar-description-label'" for="calendar-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea 
                  v-voix="'calendar-description-input'" 
                  hint="Enter a description for your calendar"
                  id="calendar-description"
                  v-model="newCalendarForm.description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <div class="flex justify-end">
                <button 
                  v-voix="'create-calendar-button'" 
                  hint="Create a new calendar"
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Create Calendar
                </button>
              </div>
            </form>
          </div>
          
          <!-- My Calendars Section -->
          <div class="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">My Calendars</h3>
            
            <div v-if="userCalendars.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
              You don't have any calendars yet. Create one above.
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="calendar in userCalendars" 
                :key="calendar.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ calendar.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ calendar.description }}</p>
                    
                    <!-- Shared with info -->
                    <div v-if="calendar.permissions.length > 0" class="mt-2">
                      <p class="text-sm text-gray-700 dark:text-gray-300">Shared with:</p>
                      <ul class="mt-1 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li v-for="permission in calendar.permissions" :key="permission.userId" class="flex justify-between">
                          <span>
                            {{ calendarStore.users.find(u => u.id === permission.userId)?.name }} 
                            ({{ permission.access }})
                          </span>
                          <button 
                            v-voix="`remove-sharing-${calendar.id}-${permission.userId}`" 
                            hint="Remove sharing with this user"
                            class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            @click="removeCalendarSharing(calendar.id, permission.userId)"
                          >
                            Remove
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <button 
                    v-voix="`share-calendar-${calendar.id}`" 
                    hint="Share this calendar with others"
                    class="px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md text-sm"
                    @click="openShareModal(calendar.id)"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Calendars Shared With Me Section -->
          <div>
            <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Shared With Me</h3>
            
            <div v-if="sharedWithMe.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
              No calendars have been shared with you yet.
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="calendar in sharedWithMe" 
                :key="calendar.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h4 class="font-medium text-gray-900 dark:text-white">{{ calendar.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ calendar.description }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Owner: {{ calendarStore.users.find(u => u.id === calendar.ownerId)?.name }}
                </p>
                <div class="mt-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    :class="calendar.permissions.find(p => p.userId === calendarStore.users.find(u => u.role === calendarStore.currentRole)?.id)?.access === 'edit' ? 
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'"
                  >
                    {{ calendar.permissions.find(p => p.userId === calendarStore.users.find(u => u.role === calendarStore.currentRole)?.id)?.access === 'edit' ? 'Can edit' : 'View only' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Share Calendar Modal -->
          <div 
            v-if="showShareModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
              <div class="flex justify-between items-start mb-4">
                <h3 
                  v-voix="'share-calendar-modal-heading'" 
                  class="text-lg font-medium text-gray-900 dark:text-white"
                >
                  Share Calendar
                </h3>
                <button 
                  v-voix="'close-sharing-modal'" 
                  hint="Close sharing modal"
                  class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  @click="showShareModal = false"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form @submit.prevent="shareCalendarWithUsers">
                <div class="mb-4">
                  <label v-voix="'select-users-label'" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Share with Users
                  </label>
                  
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div 
                      v-for="user in getAvailableUsers(selectedCalendarId)" 
                      :key="user.id"
                      class="flex items-center"
                    >
                      <input 
                        :id="`share-user-${user.id}`"
                        type="checkbox" 
                        :value="user.id"
                        v-model="selectedUserIds"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label :for="`share-user-${user.id}`" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        {{ user.name }} ({{ user.role }})
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="mb-6">
                  <label v-voix="'access-level-label'" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Access Level
                  </label>
                  
                  <div class="flex space-x-4">
                    <div class="flex items-center">
                      <input 
                        v-voix="'view-only-radio'" 
                        hint="Select view-only access"
                        id="access-view"
                        type="radio" 
                        value="view"
                        v-model="sharingAccessLevel"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label for="access-view" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        View only
                      </label>
                    </div>
                    
                    <div class="flex items-center">
                      <input 
                        v-voix="'edit-radio'" 
                        hint="Select edit access"
                        id="access-edit"
                        type="radio" 
                        value="edit"
                        v-model="sharingAccessLevel"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label for="access-edit" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Can edit
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-end">
                  <button 
                    v-voix="'share-button'" 
                    hint="Share calendar with selected users"
                    type="submit"
                    class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    :disabled="selectedUserIds.length === 0"
                  >
                    Share Calendar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Integrations -->
        <div id="integrations" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Integrations
          </h2>
          
          <!-- Calendar Integrations -->
          <div class="mb-8">
            <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Calendar Integrations</h3>
            
            <div class="space-y-6">
              <div
                v-for="account in integrationSettings.connectedAccounts.filter(a => ['google', 'outlook'].includes(a.id))"
                :key="account.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">{{ account.name }}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ account.connected ? `Last synced: ${new Date(account.lastSync).toLocaleString()}` : 'Not connected' }}
                    </p>
                  </div>
                  
                  <div>
                    <!-- Sync Button (for connected accounts) -->
                    <button 
                      v-if="account.connected"
                      v-voix="`sync-${account.id}`" 
                      :hint="`Sync with ${account.name}`"
                      @click="syncWithExternalCalendar(account.id)"
                      :disabled="account.isSyncing"
                      class="mr-2 px-3 py-1 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 rounded-md text-sm"
                    >
                      <span v-if="account.isSyncing">Syncing...</span>
                      <span v-else>Sync Now</span>
                    </button>
                    
                    <!-- Connect/Disconnect Button -->
                    <button 
                      v-if="account.connected"
                      v-voix="`disconnect-${account.id}`" 
                      :hint="`Disconnect from ${account.name}`"
                      @click="disconnectAccount(account.id)"
                      :disabled="account.isDisconnecting"
                      class="px-3 py-1 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-md text-sm"
                    >
                      <span v-if="account.isDisconnecting">Disconnecting...</span>
                      <span v-else>Disconnect</span>
                    </button>
                    <button 
                      v-else
                      v-voix="`connect-${account.id}`" 
                      :hint="`Connect to ${account.name}`"
                      @click="connectAccount(account.id)"
                      :disabled="account.isConnecting"
                      class="px-3 py-1 bg-indigo-600 text-white border border-indigo-700 rounded-md text-sm"
                    >
                      <span v-if="account.isConnecting">Connecting...</span>
                      <span v-else>Connect</span>
                    </button>
                  </div>
                </div>
                
                <!-- Description and Features (for connected accounts) -->
                <div v-if="account.connected" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ account.id === 'google' ? 
                      'Google Calendar is synced bi-directionally. Changes made in either system will update in both places.' : 
                      'Outlook Calendar events are imported into ChronoSync. You can schedule and manage events from here.' }}
                  </p>
                  
                  <div class="mt-3">
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Connected Features:</span>
                    <ul class="mt-1 text-xs text-gray-600 dark:text-gray-400 ml-4 list-disc">
                      <li>Event synchronization</li>
                      <li>Calendar availability checks</li>
                      <li>{{ account.id === 'google' ? 'Google Meet integration' : 'Microsoft Teams integration' }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Communication & Video Integrations -->
          <div>
            <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Communication & Video Integrations</h3>
            
            <div class="space-y-6">
              <div
                v-for="account in integrationSettings.connectedAccounts.filter(a => ['slack', 'zoom'].includes(a.id))"
                :key="account.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">{{ account.name }}</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ account.connected ? `Connected: ${new Date(account.lastSync).toLocaleString()}` : 'Not connected' }}
                    </p>
                  </div>
                  
                  <div>
                    <!-- Test Integration Button (for Zoom) -->
                    <button 
                      v-if="account.connected && account.id === 'zoom'"
                      v-voix="`test-${account.id}`" 
                      hint="Test Zoom integration"
                      @click="createMeetingWithIntegration('zoom')"
                      class="mr-2 px-3 py-1 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 rounded-md text-sm"
                    >
                      Create Meeting
                    </button>
                    
                    <!-- Connect/Disconnect Button -->
                    <button 
                      v-if="account.connected"
                      v-voix="`disconnect-${account.id}`" 
                      :hint="`Disconnect from ${account.name}`"
                      @click="disconnectAccount(account.id)"
                      :disabled="account.isDisconnecting"
                      class="px-3 py-1 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-md text-sm"
                    >
                      <span v-if="account.isDisconnecting">Disconnecting...</span>
                      <span v-else>Disconnect</span>
                    </button>
                    <button 
                      v-else
                      v-voix="`connect-${account.id}`" 
                      :hint="`Connect to ${account.name}`"
                      @click="connectAccount(account.id)"
                      :disabled="account.isConnecting"
                      class="px-3 py-1 bg-indigo-600 text-white border border-indigo-700 rounded-md text-sm"
                    >
                      <span v-if="account.isConnecting">Connecting...</span>
                      <span v-else>Connect</span>
                    </button>
                  </div>
                </div>
                
                <!-- Description and Features (for connected accounts) -->
                <div v-if="account.connected" class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ account.id === 'slack' ? 
                      'Integration with Slack enables notifications and allows you to schedule meetings from Slack channels.' : 
                      'Zoom integration automatically creates video meeting links when scheduling events.' }}
                  </p>
                  
                  <div class="mt-3">
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Connected Features:</span>
                    <ul class="mt-1 text-xs text-gray-600 dark:text-gray-400 ml-4 list-disc">
                      <li>{{ account.id === 'slack' ? 'Receive event notifications' : 'Auto-generate meeting links' }}</li>
                      <li>{{ account.id === 'slack' ? 'Schedule events via Slack' : 'Join meetings with one click' }}</li>
                      <li>{{ account.id === 'slack' ? 'Get reminders in Slack' : 'Meeting controls and recordings' }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Demo Notice about Integrations -->
          <div class="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p class="text-sm text-blue-700 dark:text-blue-200">
              <span class="font-medium">Demo Notice:</span> These integrations are simulated for demonstration purposes. 
              In a production environment, these would connect to actual external APIs with proper authentication flows.
            </p>
          </div>
        </div>
        
        <!-- Admin Settings (visible only to admins) -->
        <div v-if="isAdmin" id="admin" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Admin Settings
          </h2>
          
          <form @submit.prevent="saveAdminSettings">
            <div class="space-y-6">
              <div>
                <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">User Roles</h3>
                <div class="space-y-2">
                  <div
                    v-for="user in adminSettings.userRoles"
                    :key="user.id"
                    class="grid grid-cols-2 gap-4"
                  >
                    <div class="text-sm text-gray-700 dark:text-gray-300">{{ user.name }}</div>
                    <select 
                      v-voix="`user-role-${user.id}`" 
                      :hint="`Select role for ${user.name}`"
                      v-model="user.role"
                      class="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-3"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                      <option value="guest">Guest</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Organization Settings</h3>
                <div class="space-y-3">
                  <div>
                    <label v-voix="'org-name-label'" for="org-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Organization Name
                    </label>
                    <input 
                      v-voix="'org-name-input'" 
                      hint="Enter organization name"
                      id="org-name"
                      type="text" 
                      v-model="adminSettings.organizationSettings.name"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label v-voix="'org-domain-label'" for="org-domain" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Domain
                    </label>
                    <input 
                      v-voix="'org-domain-input'" 
                      hint="Enter organization domain"
                      id="org-domain"
                      type="text" 
                      v-model="adminSettings.organizationSettings.domain"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div class="flex justify-end">
                <button 
                  v-voix="'save-admin-settings-button'" 
                  hint="Save admin settings"
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Save Admin Settings
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <!-- Role Restriction Notice (for non-admins trying to access admin settings) -->
        <div v-if="!isAdmin" id="admin" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-yellow-800 dark:text-yellow-300">Admin Access Required</h3>
              <div class="mt-2 text-yellow-700 dark:text-yellow-200">
                <p>
                  This section is only accessible to users with Admin role. 
                  You currently have {{ calendarStore.currentRole }} permissions.
                </p>
                <p class="mt-2">
                  For demonstration purposes, you can use the role selector in the sidebar to switch to 
                  the Admin role and access these settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Demo Notice -->
    <div class="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-blue-800 dark:text-blue-300">Demo Settings</h3>
          <div class="mt-2 text-blue-700 dark:text-blue-200">
            <p>
              This Settings page is for demonstration purposes. In a real application, these settings would 
              be saved to a database and persist between sessions. You can experiment with changing settings 
              to see how they affect the UI, but changes won't be permanently saved.
            </p>
            <p class="mt-2">
              Try changing your role using the selector in the sidebar to see how permissions affect what 
              features are available throughout the application.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>