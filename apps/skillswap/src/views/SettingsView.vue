<script setup>
import { ref, computed } from 'vue';

// Setting sections and their menu items
const sections = [
  {
    id: 'account',
    label: 'Account',
    icon: '👤',
    items: [
      { id: 'profile', label: 'Profile Information' },
      { id: 'email', label: 'Email & Password' },
      { id: 'verification', label: 'Account Verification' },
      { id: 'delete', label: 'Delete Account' }
    ]
  },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: '⚙️',
    items: [
      { id: 'language', label: 'Language' },
      { id: 'timezone', label: 'Timezone' },
      { id: 'theme', label: 'Theme' },
      { id: 'accessibility', label: 'Accessibility' }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: '🔔',
    items: [
      { id: 'email_notifications', label: 'Email Notifications' },
      { id: 'push_notifications', label: 'Push Notifications' },
      { id: 'in_app', label: 'In-App Notifications' },
      { id: 'reminders', label: 'Session Reminders' }
    ]
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: '🔒',
    items: [
      { id: 'visibility', label: 'Profile Visibility' },
      { id: 'data', label: 'Data Usage' },
      { id: 'blocking', label: 'Blocked Users' },
      { id: 'cookies', label: 'Cookies & Tracking' }
    ]
  },
  {
    id: 'security',
    label: 'Security',
    icon: '🛡️',
    items: [
      { id: 'sessions', label: 'Active Sessions' },
      { id: 'devices', label: 'Connected Devices' },
      { id: 'two_factor', label: 'Two-Factor Authentication' },
      { id: 'password', label: 'Password Security' }
    ]
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: '💳',
    items: [
      { id: 'methods', label: 'Payment Methods' },
      { id: 'subscriptions', label: 'Premium Subscriptions' },
      { id: 'transactions', label: 'Transaction History' },
      { id: 'billing', label: 'Billing Information' }
    ]
  }
];

// Initial state
const selectedSection = ref('account');
const selectedItem = ref('profile');

// Mock user data
const userData = ref({
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  verified: true,
  avatar: null, // In a real app, this would be a URL
  phone: '+1 (555) 123-4567',
  language: 'English',
  timezone: 'America/New_York',
  theme: 'light',
  accessibility: {
    screenReader: true,
    highContrast: false,
    reducedMotion: false,
    largeText: false
  },
  notifications: {
    email: {
      matches: true,
      messages: true,
      sessions: true,
      reminders: true,
      updates: false,
      marketing: false
    },
    push: {
      matches: true,
      messages: true,
      sessions: true,
      reminders: true,
      updates: true
    },
    inApp: {
      matches: true,
      messages: true,
      sessions: true,
      reminders: true,
      updates: true
    }
  },
  privacy: {
    profileVisibility: 'all', // 'all', 'matches', 'none'
    dataUsage: {
      improveService: true,
      personalizedContent: false,
      thirdPartySharing: false
    },
    blockedUsers: []
  },
  security: {
    twoFactorEnabled: false,
    activeSessions: [
      {
        device: 'MacBook Pro',
        location: 'New York, USA',
        ip: '192.168.1.1',
        lastActive: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      },
      {
        device: 'iPhone 15',
        location: 'New York, USA',
        ip: '192.168.1.2',
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      }
    ]
  }
});

// Languages array for the language selector
const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Russian',
  'Arabic',
  'Portuguese',
  'Hindi'
];

// Timezones array for the timezone selector
const timezones = [
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'America/Denver',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland'
];

// Helper function to get human-readable timezone name
const getTimezoneName = (timezone) => {
  const timezoneMap = {
    'America/New_York': 'Eastern Time (US & Canada)',
    'America/Los_Angeles': 'Pacific Time (US & Canada)',
    'America/Chicago': 'Central Time (US & Canada)',
    'America/Denver': 'Mountain Time (US & Canada)',
    'Europe/London': 'London',
    'Europe/Paris': 'Paris',
    'Europe/Berlin': 'Berlin',
    'Asia/Tokyo': 'Tokyo',
    'Asia/Shanghai': 'Shanghai',
    'Australia/Sydney': 'Sydney',
    'Pacific/Auckland': 'Auckland'
  };
  
  return timezoneMap[timezone] || timezone;
};

// Selection handlers
const selectSection = (sectionId) => {
  selectedSection.value = sectionId;
  selectedItem.value = sections.find(s => s.id === sectionId)?.items[0]?.id || '';
};

const selectItem = (itemId) => {
  selectedItem.value = itemId;
};

// Form submission handlers
const saveProfileInformation = () => {
  alert('Profile information saved!');
  // In a real app, this would send the updated user data to an API
};

const changePassword = () => {
  alert('Password updated successfully!');
  // In a real app, this would validate and update the password
};

const deleteAccount = () => {
  const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
  if (confirmed) {
    alert('Account deletion process initiated. You will receive an email with further instructions.');
    // In a real app, this would start the account deletion process
  }
};

const toggleNotificationSetting = (category, channel) => {
  userData.value.notifications[channel][category] = !userData.value.notifications[channel][category];
  alert(`${category} notifications ${userData.value.notifications[channel][category] ? 'enabled' : 'disabled'} for ${channel}`);
  // In a real app, this would save the notification preference to the API
};

const toggleTwoFactor = () => {
  if (!userData.value.security.twoFactorEnabled) {
    alert('Two-factor authentication setup initiated. You will now be guided through the setup process.');
    // In a real app, this would start the 2FA setup flow
  } else {
    const confirmed = confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.');
    if (confirmed) {
      userData.value.security.twoFactorEnabled = false;
      alert('Two-factor authentication disabled.');
    }
  }
};

const terminateSession = (index) => {
  const confirmed = confirm('Are you sure you want to terminate this session?');
  if (confirmed) {
    userData.value.security.activeSessions.splice(index, 1);
    alert('Session terminated successfully.');
    // In a real app, this would invalidate the session through the API
  }
};

const toggleAccessibilityOption = (option) => {
  userData.value.accessibility[option] = !userData.value.accessibility[option];
  alert(`${option} setting ${userData.value.accessibility[option] ? 'enabled' : 'disabled'}`);
  // In a real app, this would save the accessibility preference to the API
};

const changeTheme = (theme) => {
  userData.value.theme = theme;
  alert(`Theme changed to ${theme}`);
  // In a real app, this would save the theme preference and update the UI
};

const formatDate = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  
  if (diffMin < 1) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  }
};

// Computed values
const currentSectionLabel = computed(() => {
  return sections.find(s => s.id === selectedSection.value)?.label || '';
});

const currentItemLabel = computed(() => {
  const section = sections.find(s => s.id === selectedSection.value);
  if (!section) return '';
  
  return section.items.find(i => i.id === selectedItem.value)?.label || '';
});
</script>

<template>
  <div class="settings-container">
    <h1 v-voix="'settings-title'" class="settings-title">Settings</h1>
    
    <div class="settings-layout">
      <aside class="settings-sidebar">
        <ul class="settings-nav">
          <li 
            v-for="section in sections" 
            :key="section.id"
            @click="selectSection(section.id)"
            :class="{ active: selectedSection === section.id }"
          >
            <span class="section-icon">{{ section.icon }}</span>
            <span class="section-label">{{ section.label }}</span>
          </li>
        </ul>
      </aside>
      
      <div class="settings-content">
        <div class="settings-header">
          <h2>{{ currentSectionLabel }}</h2>
          <p v-if="selectedItem">{{ currentItemLabel }}</p>
        </div>
        
        <div class="settings-options">
          <div class="settings-subnav">
            <ul>
              <li 
                v-for="item in sections.find(s => s.id === selectedSection)?.items" 
                :key="item.id"
                @click="selectItem(item.id)"
                :class="{ active: selectedItem === item.id }"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>
          
          <div class="settings-panel">
            <!-- Account - Profile Information -->
            <div v-if="selectedSection === 'account' && selectedItem === 'profile'" class="settings-form">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" v-model="userData.name" />
              </div>
              
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" v-model="userData.phone" />
              </div>
              
              <div class="form-group profile-picture">
                <label>Profile Picture</label>
                <div class="avatar-container">
                  <div class="avatar-placeholder">
                    {{ userData.name.charAt(0) }}
                  </div>
                  <button class="secondary-button">Upload New Picture</button>
                </div>
              </div>
              
              <div class="form-actions">
                <button class="primary-button" @click="saveProfileInformation">Save Changes</button>
              </div>
            </div>
            
            <!-- Account - Email & Password -->
            <div v-if="selectedSection === 'account' && selectedItem === 'email'" class="settings-form">
              <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" v-model="userData.email" />
              </div>
              
              <div class="form-group">
                <label for="currentPassword">Current Password</label>
                <input type="password" id="currentPassword" placeholder="Enter your current password" />
              </div>
              
              <div class="form-group">
                <label for="newPassword">New Password</label>
                <input type="password" id="newPassword" placeholder="Enter new password" />
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm new password" />
              </div>
              
              <div class="form-actions">
                <button class="primary-button" @click="changePassword">Update Password</button>
              </div>
            </div>
            
            <!-- Account - Verification -->
            <div v-if="selectedSection === 'account' && selectedItem === 'verification'" class="settings-panel-content">
              <div class="verification-status">
                <div :class="['status-badge', userData.verified ? 'verified' : 'unverified']">
                  {{ userData.verified ? 'Verified' : 'Unverified' }}
                </div>
                
                <p v-if="userData.verified">
                  Your account is verified. This helps other users trust your identity and improves your chances of finding skill matches.
                </p>
                
                <p v-else>
                  Verifying your account helps other users trust your identity and improves your chances of finding skill matches.
                </p>
              </div>
              
              <div class="verification-methods">
                <h3>Verification Methods</h3>
                
                <div class="verification-method">
                  <div class="method-info">
                    <h4>Email Verification</h4>
                    <p>Verify your email address to confirm your identity</p>
                  </div>
                  <button class="secondary-button" :disabled="userData.verified">
                    {{ userData.verified ? 'Verified' : 'Verify Email' }}
                  </button>
                </div>
                
                <div class="verification-method">
                  <div class="method-info">
                    <h4>Phone Verification</h4>
                    <p>Verify your phone number for additional security</p>
                  </div>
                  <button class="secondary-button">Verify Phone</button>
                </div>
                
                <div class="verification-method">
                  <div class="method-info">
                    <h4>ID Verification</h4>
                    <p>Upload a government-issued ID for full verification</p>
                  </div>
                  <button class="secondary-button">Verify ID</button>
                </div>
              </div>
            </div>
            
            <!-- Account - Delete Account -->
            <div v-if="selectedSection === 'account' && selectedItem === 'delete'" class="settings-panel-content danger-zone">
              <h3>Delete Account</h3>
              <div class="warning-box">
                <p><strong>Warning:</strong> Deleting your account is permanent and cannot be undone. All your data, including profile information, skills, matches, and messages will be permanently removed.</p>
                
                <div class="confirmation-checkbox">
                  <input type="checkbox" id="confirmDelete" />
                  <label for="confirmDelete">I understand that deleting my account is permanent</label>
                </div>
                
                <button class="danger-button" @click="deleteAccount">Delete My Account</button>
              </div>
            </div>
            
            <!-- Preferences - Language -->
            <div v-if="selectedSection === 'preferences' && selectedItem === 'language'" class="settings-form">
              <div class="form-group">
                <label for="language">Interface Language</label>
                <select id="language" v-model="userData.language">
                  <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
                </select>
                <p class="help-text">This changes the language of the SkillSwap interface. It does not affect how your profile appears to others.</p>
              </div>
              
              <div class="form-actions">
                <button class="primary-button" @click="saveProfileInformation">Save Changes</button>
              </div>
            </div>
            
            <!-- Preferences - Timezone -->
            <div v-if="selectedSection === 'preferences' && selectedItem === 'timezone'" class="settings-form">
              <div class="form-group">
                <label for="timezone">Timezone</label>
                <select id="timezone" v-model="userData.timezone">
                  <option v-for="tz in timezones" :key="tz" :value="tz">{{ getTimezoneName(tz) }}</option>
                </select>
                <p class="help-text">Your timezone is used to display dates and times correctly across the platform and to suggest suitable session times.</p>
              </div>
              
              <div class="form-actions">
                <button class="primary-button" @click="saveProfileInformation">Save Changes</button>
              </div>
            </div>
            
            <!-- Preferences - Theme -->
            <div v-if="selectedSection === 'preferences' && selectedItem === 'theme'" class="settings-panel-content">
              <h3>Theme Settings</h3>
              
              <div class="theme-options">
                <div 
                  class="theme-option" 
                  :class="{ active: userData.theme === 'light' }"
                  @click="changeTheme('light')"
                >
                  <div class="theme-preview light-theme">
                    <div class="preview-header"></div>
                    <div class="preview-content"></div>
                  </div>
                  <span>Light</span>
                </div>
                
                <div 
                  class="theme-option" 
                  :class="{ active: userData.theme === 'dark' }"
                  @click="changeTheme('dark')"
                >
                  <div class="theme-preview dark-theme">
                    <div class="preview-header"></div>
                    <div class="preview-content"></div>
                  </div>
                  <span>Dark</span>
                </div>
                
                <div 
                  class="theme-option" 
                  :class="{ active: userData.theme === 'system' }"
                  @click="changeTheme('system')"
                >
                  <div class="theme-preview system-theme">
                    <div class="preview-header"></div>
                    <div class="preview-content"></div>
                  </div>
                  <span>System Default</span>
                </div>
              </div>
            </div>
            
            <!-- Preferences - Accessibility -->
            <div v-if="selectedSection === 'preferences' && selectedItem === 'accessibility'" class="settings-panel-content">
              <h3>Accessibility Settings</h3>
              
              <div class="toggle-options">
                <div class="toggle-option">
                  <div>
                    <h4>Screen Reader Support</h4>
                    <p>Enhance compatibility with screen readers and optimize navigation for assistive technologies</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="userData.accessibility.screenReader"
                      @change="toggleAccessibilityOption('screenReader')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <div class="toggle-option">
                  <div>
                    <h4>High Contrast Mode</h4>
                    <p>Increase contrast between text and background for better readability</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="userData.accessibility.highContrast"
                      @change="toggleAccessibilityOption('highContrast')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <div class="toggle-option">
                  <div>
                    <h4>Reduce Motion</h4>
                    <p>Minimize animations and transitions throughout the interface</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="userData.accessibility.reducedMotion"
                      @change="toggleAccessibilityOption('reducedMotion')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <div class="toggle-option">
                  <div>
                    <h4>Larger Text</h4>
                    <p>Increase the default font size for better readability</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="userData.accessibility.largeText"
                      @change="toggleAccessibilityOption('largeText')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Notifications - Email Notifications -->
            <div v-if="selectedSection === 'notifications' && selectedItem === 'email_notifications'" class="settings-panel-content">
              <h3>Email Notification Settings</h3>
              
              <div class="toggle-options">
                <div class="toggle-option">
                  <div>
                    <h4>New Matches</h4>
                    <p>Get notified when someone matches with your skills</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="userData.notifications.email.matches"
                      @change="toggleNotificationSetting('matches', 'email')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <div class="toggle-option">
                  <div>
                    <h4>New Messages</h4>
                    <p>Get notified when you receive a new message</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="userData.notifications.email.messages"
                      @change="toggleNotificationSetting('messages', 'email')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <div class="toggle-option">
                  <div>
                    <h4>Session Updates</h4>
                    <p>Get notified when sessions are confirmed, rescheduled, or cancelled</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="userData.notifications.email.sessions"
                      @change="toggleNotificationSetting('sessions', 'email')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <div class="toggle-option">
                  <div>
                    <h4>Session Reminders</h4>
                    <p>Get reminders before your scheduled sessions</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="userData.notifications.email.reminders"
                      @change="toggleNotificationSetting('reminders', 'email')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <div class="toggle-option">
                  <div>
                    <h4>Platform Updates</h4>
                    <p>Get notified about new features and improvements</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="userData.notifications.email.updates"
                      @change="toggleNotificationSetting('updates', 'email')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <div class="toggle-option">
                  <div>
                    <h4>Marketing Communications</h4>
                    <p>Receive occasional promotions and newsletters</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      :checked="userData.notifications.email.marketing"
                      @change="toggleNotificationSetting('marketing', 'email')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Security - Two-Factor Authentication -->
            <div v-if="selectedSection === 'security' && selectedItem === 'two_factor'" class="settings-panel-content">
              <h3>Two-Factor Authentication</h3>
              
              <div class="two-factor-status">
                <div :class="['status-badge', userData.security.twoFactorEnabled ? 'enabled' : 'disabled']">
                  {{ userData.security.twoFactorEnabled ? 'Enabled' : 'Disabled' }}
                </div>
                
                <p v-if="userData.security.twoFactorEnabled">
                  Two-factor authentication is currently enabled for your account. This adds an extra layer of security by requiring a verification code in addition to your password when you log in.
                </p>
                
                <p v-else>
                  Protect your account with an extra layer of security. Once configured, you'll be required to enter both your password and a verification code from your phone when you log in.
                </p>
                
                <button 
                  :class="userData.security.twoFactorEnabled ? 'secondary-button' : 'primary-button'"
                  @click="toggleTwoFactor"
                >
                  {{ userData.security.twoFactorEnabled ? 'Disable Two-Factor Authentication' : 'Enable Two-Factor Authentication' }}
                </button>
              </div>
            </div>
            
            <!-- Security - Active Sessions -->
            <div v-if="selectedSection === 'security' && selectedItem === 'sessions'" class="settings-panel-content">
              <h3>Active Sessions</h3>
              
              <div class="sessions-list">
                <div 
                  v-for="(session, index) in userData.security.activeSessions" 
                  :key="index"
                  class="session-item"
                >
                  <div class="session-info">
                    <div class="device-name">{{ session.device }}</div>
                    <div class="session-details">
                      <span>{{ session.location }}</span>
                      <span class="session-divider">•</span>
                      <span>IP: {{ session.ip }}</span>
                      <span class="session-divider">•</span>
                      <span>Active {{ formatDate(session.lastActive) }}</span>
                    </div>
                  </div>
                  <button class="danger-button-small" @click="terminateSession(index)">Terminate</button>
                </div>
              </div>
              
              <button class="danger-button mt-4">Terminate All Other Sessions</button>
            </div>
            
            <!-- Show a placeholder for other settings pages -->
            <div 
              v-if="
                (selectedSection === 'notifications' && selectedItem !== 'email_notifications') ||
                (selectedSection === 'privacy') ||
                (selectedSection === 'security' && !['two_factor', 'sessions'].includes(selectedItem)) ||
                (selectedSection === 'payment')
              " 
              class="placeholder-content"
            >
              <p>This settings page would contain options for <strong>{{ currentItemLabel }}</strong>.</p>
              <p>For this demo, only select sections have been implemented.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.settings-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.settings-layout {
  display: flex;
  gap: 2rem;
}

.settings-sidebar {
  flex: 0 0 220px;
}

.settings-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
}

.settings-nav li {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  cursor: pointer;
  transition: background-color 0.2s;
}

.settings-nav li:last-child {
  border-bottom: none;
}

.settings-nav li:hover {
  background-color: var(--background-color-light, #f5f5f5);
}

.settings-nav li.active {
  background-color: var(--primary-color, #4a90e2);
  color: white;
}

.section-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.settings-content {
  flex: 1;
}

.settings-header {
  margin-bottom: 1.5rem;
}

.settings-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--text-color);
}

.settings-header p {
  margin: 0;
  color: var(--text-color-muted, #666);
  font-size: 1rem;
}

.settings-options {
  display: flex;
  gap: 1.5rem;
}

.settings-subnav {
  flex: 0 0 200px;
}

.settings-subnav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
}

.settings-subnav li {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  cursor: pointer;
  transition: background-color 0.2s;
}

.settings-subnav li:last-child {
  border-bottom: none;
}

.settings-subnav li:hover {
  background-color: var(--background-color-light, #f5f5f5);
}

.settings-subnav li.active {
  background-color: var(--background-color-light, #f5f5f5);
  border-left: 3px solid var(--primary-color, #4a90e2);
  font-weight: 500;
}

.settings-panel {
  flex: 1;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: white;
}

/* Form styles */
.settings-form {
  max-width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color, #4a90e2);
}

.help-text {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-color-muted, #666);
}

.form-actions {
  margin-top: 2rem;
}

/* Button styles */
.primary-button {
  background-color: var(--primary-color, #4a90e2);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: var(--primary-color-dark, #0056b3);
}

.secondary-button {
  background-color: var(--background-color-light, #f5f5f5);
  color: var(--text-color);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-button:hover {
  background-color: var(--border-color, #e0e0e0);
}

.danger-button {
  background-color: var(--danger-color, #e74c3c);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.danger-button:hover {
  background-color: var(--danger-color-dark, #c0392b);
}

.danger-button-small {
  background-color: var(--danger-color, #e74c3c);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.danger-button-small:hover {
  background-color: var(--danger-color-dark, #c0392b);
}

/* Profile picture styles */
.profile-picture {
  margin-bottom: 2rem;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  background-color: var(--primary-color, #4a90e2);
  color: white;
  font-size: 2.5rem;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

/* Toggle switch styles */
.toggle-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.toggle-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.toggle-option:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.toggle-option h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
}

.toggle-option p {
  margin: 0;
  color: var(--text-color-muted, #666);
  font-size: 0.9rem;
  max-width: 400px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color, #e0e0e0);
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color, #4a90e2);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* Theme options styles */
.theme-options {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.theme-preview {
  width: 120px;
  height: 80px;
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.theme-option.active .theme-preview {
  border-color: var(--primary-color, #4a90e2);
}

.light-theme {
  background-color: #f8f9fa;
}

.light-theme .preview-header {
  height: 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.light-theme .preview-content {
  height: 60px;
  padding: 5px;
  background-color: #ffffff;
}

.dark-theme {
  background-color: #1a1a1a;
}

.dark-theme .preview-header {
  height: 20px;
  background-color: #2d2d2d;
  border-bottom: 1px solid #3a3a3a;
}

.dark-theme .preview-content {
  height: 60px;
  padding: 5px;
  background-color: #2d2d2d;
}

.system-theme {
  background: linear-gradient(to right, #f8f9fa 50%, #1a1a1a 50%);
}

.system-theme .preview-header {
  height: 20px;
  background: linear-gradient(to right, #ffffff 50%, #2d2d2d 50%);
  border-bottom: 1px solid #e0e0e0;
}

.system-theme .preview-content {
  height: 60px;
  padding: 5px;
  background: linear-gradient(to right, #ffffff 50%, #2d2d2d 50%);
}

/* Verification styles */
.verification-status {
  margin-bottom: 2rem;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.verified {
  background-color: var(--success-color-light, #e6fff0);
  color: var(--success-color-dark, #006633);
}

.unverified {
  background-color: var(--warning-color-light, #fff8e0);
  color: var(--warning-color-dark, #b3780c);
}

.enabled {
  background-color: var(--success-color-light, #e6fff0);
  color: var(--success-color-dark, #006633);
}

.disabled {
  background-color: var(--warning-color-light, #fff8e0);
  color: var(--warning-color-dark, #b3780c);
}

.verification-methods {
  margin-top: 2rem;
}

.verification-methods h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.verification-method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.verification-method:last-child {
  border-bottom: none;
}

.method-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
}

.method-info p {
  margin: 0;
  color: var(--text-color-muted, #666);
  font-size: 0.9rem;
}

/* Danger zone styles */
.danger-zone h3 {
  color: var(--danger-color, #e74c3c);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.warning-box {
  border: 1px solid var(--danger-color, #e74c3c);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: var(--danger-color-light, #feeeed);
}

.confirmation-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

/* Sessions list styles */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  background-color: var(--background-color-light, #f5f5f5);
}

.device-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.session-details {
  font-size: 0.9rem;
  color: var(--text-color-muted, #666);
}

.session-divider {
  margin: 0 0.5rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

/* Placeholder styles */
.placeholder-content {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-muted, #666);
}

.placeholder-content p {
  margin: 0.5rem 0;
}

.placeholder-content strong {
  color: var(--text-color);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .settings-layout {
    flex-direction: column;
  }
  
  .settings-sidebar {
    flex: auto;
  }
  
  .settings-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .settings-nav li {
    flex: 1 0 auto;
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    margin-bottom: 0;
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .settings-options {
    flex-direction: column;
  }
  
  .settings-subnav {
    flex: auto;
  }
  
  .settings-subnav ul {
    display: flex;
    flex-wrap: wrap;
  }
  
  .settings-subnav li {
    flex: 1 1 auto;
    text-align: center;
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    margin: 0 0.25rem 0.5rem 0;
  }
  
  .toggle-option {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .verification-method {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .session-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>