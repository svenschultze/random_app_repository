<script setup>
import { ref } from 'vue';

// User profile data
const user = ref({
  name: 'John Student',
  email: 'john.student@university.edu',
  major: 'Computer Science',
  year: 'Junior',
  avatar: '👨‍🎓'
});

// App settings
const settings = ref({
  theme: 'light',
  notificationsEnabled: true,
  reminderTimes: [15, 30, 60], // minutes before class
  calendarSync: false,
  showWeekends: false
});

// Toggle theme
const toggleTheme = () => {
  settings.value.theme = settings.value.theme === 'light' ? 'dark' : 'light';
  // In a real app, this would apply the theme to the whole app
};

// Toggle notifications
const toggleNotifications = () => {
  settings.value.notificationsEnabled = !settings.value.notificationsEnabled;
};

// Toggle weekend display
const toggleWeekends = () => {
  settings.value.showWeekends = !settings.value.showWeekends;
};

// Toggle calendar sync
const toggleCalendarSync = () => {
  settings.value.calendarSync = !settings.value.calendarSync;
};

// Update reminder times
const updateReminderTimes = (time, checked) => {
  if (checked) {
    if (!settings.value.reminderTimes.includes(time)) {
      settings.value.reminderTimes.push(time);
    }
  } else {
    settings.value.reminderTimes = settings.value.reminderTimes.filter(t => t !== time);
  }
};

// Export calendar (demo only)
const exportCalendar = () => {
  alert('Calendar exported to file (demo functionality)');
};

// Save settings (demo only)
const saveSettings = () => {
  // In a real app, this would save to API/localStorage
  alert('Settings saved successfully');
};
</script>

<template>
  <div class="profile-view">
    <div class="view-header">
      <h2 v-voix="'profile-settings-heading'">Profile & Settings</h2>
    </div>
    
    <div class="content">
      <section class="profile-section">
        <h3 v-voix="'profile-section-heading'">User Profile</h3>
        
        <div class="profile-card">
          <div class="avatar">{{ user.avatar }}</div>
          <div class="user-info">
            <h4 v-voix="'user-name'">{{ user.name }}</h4>
            <p v-voix="'user-email'">{{ user.email }}</p>
            <p v-voix="'user-major'">{{ user.major }}, {{ user.year }}</p>
          </div>
        </div>
      </section>
      
      <section class="settings-section">
        <h3 v-voix="'app-settings-heading'">App Settings</h3>
        
        <div class="settings-group">
          <div class="setting-item">
            <div class="setting-label">
              <span v-voix="'theme-setting-label'">Theme</span>
              <span class="setting-description">Choose between light and dark mode</span>
            </div>
            <button 
              class="toggle-btn" 
              @click="toggleTheme"
              v-voix="'toggle-theme-button'"
              hint="Switch between light and dark theme"
            >
              {{ settings.theme === 'light' ? '☀️ Light' : '🌙 Dark' }}
            </button>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <span v-voix="'notification-setting-label'">Notifications</span>
              <span class="setting-description">Enable or disable notifications</span>
            </div>
            <label class="switch" v-voix="'notifications-toggle'" hint="Toggle notifications on or off">
              <input type="checkbox" v-model="settings.notificationsEnabled">
              <span class="slider round"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <span v-voix="'reminder-setting-label'">Reminder Times</span>
              <span class="setting-description">When to receive reminders before classes</span>
            </div>
            <div class="checkbox-group">
              <label class="checkbox-item" v-voix="'fifteen-min-reminder'" hint="Get reminded 15 minutes before class">
                <input 
                  type="checkbox" 
                  :checked="settings.reminderTimes.includes(15)"
                  @change="updateReminderTimes(15, $event.target.checked)"
                >
                15 min
              </label>
              <label class="checkbox-item" v-voix="'thirty-min-reminder'" hint="Get reminded 30 minutes before class">
                <input 
                  type="checkbox" 
                  :checked="settings.reminderTimes.includes(30)"
                  @change="updateReminderTimes(30, $event.target.checked)"
                >
                30 min
              </label>
              <label class="checkbox-item" v-voix="'one-hour-reminder'" hint="Get reminded 1 hour before class">
                <input 
                  type="checkbox" 
                  :checked="settings.reminderTimes.includes(60)"
                  @change="updateReminderTimes(60, $event.target.checked)"
                >
                1 hour
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <span v-voix="'weekend-setting-label'">Show Weekends</span>
              <span class="setting-description">Display weekend days in your schedule</span>
            </div>
            <label class="switch" v-voix="'weekends-toggle'" hint="Toggle display of weekend days">
              <input type="checkbox" v-model="settings.showWeekends">
              <span class="slider round"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <span v-voix="'sync-setting-label'">Sync with Calendar</span>
              <span class="setting-description">Sync with external calendar apps</span>
            </div>
            <label class="switch" v-voix="'calendar-sync-toggle'" hint="Toggle calendar synchronization">
              <input type="checkbox" v-model="settings.calendarSync">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </section>
      
      <section class="data-section">
        <h3 v-voix="'data-section-heading'">Data Management</h3>
        
        <div class="data-actions">
          <button 
            class="action-btn export-btn" 
            @click="exportCalendar"
            v-voix="'export-calendar-button'"
            hint="Export your schedule to a file"
          >
            Export Calendar
          </button>
        </div>
      </section>
      
      <div class="save-section">
        <button 
          class="save-btn" 
          @click="saveSettings"
          v-voix="'save-settings-button'"
          hint="Save all your settings"
        >
          Save Settings
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  max-width: 800px;
  margin: 0 auto;
}

.view-header {
  margin-bottom: 20px;
}

.view-header h2 {
  color: #4a6fa5;
  margin: 0;
}

.content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

section {
  margin-bottom: 30px;
}

section h3 {
  color: #212529;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
}

/* Profile styles */
.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 70px;
  height: 70px;
  background-color: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.user-info h4 {
  margin: 0 0 5px 0;
  color: #212529;
}

.user-info p {
  margin: 0 0 5px 0;
  color: #6c757d;
}

/* Settings styles */
.settings-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f8f9fa;
}

.setting-label {
  display: flex;
  flex-direction: column;
}

.setting-description {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 4px;
}

.toggle-btn {
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: #3a5a84;
}

/* Toggle switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #4a6fa5;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Checkbox group */
.checkbox-group {
  display: flex;
  gap: 15px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

/* Data management */
.data-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-btn {
  background-color: #6c757d;
  color: white;
}

.export-btn:hover {
  background-color: #5a6268;
}

/* Save section */
.save-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.save-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: #218838;
}

@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .checkbox-group {
    flex-direction: column;
    gap: 10px;
  }
}
</style>