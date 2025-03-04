<script setup>
import { ref, computed } from 'vue'

// Connection status (would be fetched from API)
const networkSettings = ref({
  networkEnabled: true,
  privacyLevel: 'balanced',
  showProfile: true,
  showProgress: true,
  showAchievements: true,
  allowMessages: true,
  notificationFrequency: 'weekly'
})

// Sample connections data
const connections = ref([
  {
    id: 1,
    name: 'Alex Chen',
    title: 'Senior Product Designer',
    company: 'DesignHub Inc.',
    industry: 'Technology',
    mutualInterests: ['Design', 'UX Research'],
    status: 'connected',
    avatar: '👩‍💼'
  },
  {
    id: 2,
    name: 'Sam Wilson',
    title: 'UX Researcher',
    company: 'UserFirst',
    industry: 'Research',
    mutualInterests: ['UX Research', 'User Testing'],
    status: 'connected',
    avatar: '👨‍💼'
  },
  {
    id: 3,
    name: 'Jordan Lee',
    title: 'Creative Director',
    company: 'Creative Solutions',
    industry: 'Design',
    mutualInterests: ['Design', 'Leadership'],
    status: 'pending',
    avatar: '👩‍🎨'
  },
  {
    id: 4,
    name: 'Taylor Reed',
    title: 'UI Designer',
    company: 'TechStart',
    industry: 'Technology',
    mutualInterests: ['Design', 'Development'],
    status: 'recommended',
    avatar: '👨‍💻'
  },
  {
    id: 5,
    name: 'Jamie Garcia',
    title: 'Product Manager',
    company: 'InnovateCorp',
    industry: 'Product Management',
    mutualInterests: ['Leadership', 'Product Development'],
    status: 'recommended',
    avatar: '👩‍💻'
  }
])

// Connection requests
const connectionRequests = ref([
  {
    id: 101,
    name: 'Morgan Smith',
    title: 'Design Lead',
    company: 'CreativeFirst',
    industry: 'Design',
    mutualInterests: ['Design', 'Leadership'],
    message: 'Hi! I noticed we share interests in design leadership. Would love to connect!',
    avatar: '👨‍🎨'
  }
])

// Upcoming events
const events = ref([
  {
    id: 1,
    title: 'UX Design Workshop',
    date: '2025-03-20T14:00:00',
    location: 'Online / Zoom',
    attendees: 42,
    registered: true
  },
  {
    id: 2,
    title: 'Design Leadership Roundtable',
    date: '2025-04-05T10:00:00',
    location: 'Creative Hub, Downtown',
    attendees: 15,
    registered: false
  },
  {
    id: 3,
    title: 'Portfolio Review Session',
    date: '2025-03-28T16:00:00',
    location: 'Online / Teams',
    attendees: 20,
    registered: false
  }
])

// Search and filter
const search = ref('')
const filter = ref('all')

// Privacy level options
const privacyLevelOptions = [
  { value: 'private', label: 'Private - Only share minimal information' },
  { value: 'balanced', label: 'Balanced - Share selected information' },
  { value: 'open', label: 'Open - Share most information' }
]

// Notification frequency options
const notificationOptions = [
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly summary' },
  { value: 'none', label: 'No notifications' }
]

// Filtered connections based on search and filter
const filteredConnections = computed(() => {
  let result = [...connections.value]
  
  // Apply status filter
  if (filter.value !== 'all') {
    result = result.filter(connection => connection.status === filter.value)
  }
  
  // Apply search term
  if (search.value.trim()) {
    const searchTerm = search.value.toLowerCase()
    result = result.filter(
      connection => 
        connection.name.toLowerCase().includes(searchTerm) ||
        connection.title.toLowerCase().includes(searchTerm) ||
        connection.company.toLowerCase().includes(searchTerm) ||
        connection.industry.toLowerCase().includes(searchTerm) ||
        connection.mutualInterests.some(interest => interest.toLowerCase().includes(searchTerm))
    )
  }
  
  return result
})

// Computed properties for statistics
const statsConnected = computed(() => 
  connections.value.filter(c => c.status === 'connected').length
)

const statsPending = computed(() => 
  connections.value.filter(c => c.status === 'pending').length +
  connectionRequests.value.length
)

const statsRecommended = computed(() => 
  connections.value.filter(c => c.status === 'recommended').length
)

// Update connection status
const updateConnectionStatus = (connectionId, newStatus) => {
  const connection = connections.value.find(c => c.id === connectionId)
  if (connection) {
    connection.status = newStatus
  }
}

// Accept connection request
const acceptConnectionRequest = (requestId) => {
  const request = connectionRequests.value.find(r => r.id === requestId)
  if (request) {
    // Add to connections
    connections.value.push({
      id: request.id,
      name: request.name,
      title: request.title,
      company: request.company,
      industry: request.industry,
      mutualInterests: request.mutualInterests,
      status: 'connected',
      avatar: request.avatar
    })
    
    // Remove from requests
    const index = connectionRequests.value.findIndex(r => r.id === requestId)
    if (index !== -1) {
      connectionRequests.value.splice(index, 1)
    }
  }
}

// Decline connection request
const declineConnectionRequest = (requestId) => {
  const index = connectionRequests.value.findIndex(r => r.id === requestId)
  if (index !== -1) {
    connectionRequests.value.splice(index, 1)
  }
}

// Register for event
const toggleEventRegistration = (eventId) => {
  const event = events.value.find(e => e.id === eventId)
  if (event) {
    event.registered = !event.registered
    
    // Update attendees count
    if (event.registered) {
      event.attendees++
    } else {
      event.attendees--
    }
  }
}

// Format date for display
const formatEventDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Toggle network features
const toggleNetworkFeatures = () => {
  networkSettings.value.networkEnabled = !networkSettings.value.networkEnabled
}
</script>

<template>
  <div class="network-container">
    <div class="network-header">
      <h1 v-voix="'Network View Title'">Professional Network</h1>
      <p class="subheading">Connect with like-minded professionals and grow your career</p>
    </div>

    <!-- Network Enable Toggle -->
    <div class="network-toggle">
      <div class="toggle-container">
        <span class="toggle-label">Network Features</span>
        <label class="toggle-switch">
          <input 
            type="checkbox" 
            v-model="networkSettings.networkEnabled"
            @change="toggleNetworkFeatures"
            v-voix="'Toggle Network Features'"
            hint="Enable or disable all networking features"
          />
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-status">{{ networkSettings.networkEnabled ? 'Enabled' : 'Disabled' }}</span>
      </div>
    </div>

    <div v-if="networkSettings.networkEnabled" class="network-content">
      <!-- Network Stats -->
      <div class="network-stats">
        <div class="stat-card" v-voix="'Connected Connections Statistic'">
          <div class="stat-value">{{ statsConnected }}</div>
          <div class="stat-label">Connected</div>
        </div>
        
        <div class="stat-card" v-voix="'Pending Connections Statistic'">
          <div class="stat-value">{{ statsPending }}</div>
          <div class="stat-label">Pending</div>
        </div>
        
        <div class="stat-card" v-voix="'Recommended Connections Statistic'">
          <div class="stat-value">{{ statsRecommended }}</div>
          <div class="stat-label">Recommended</div>
        </div>
      </div>

      <!-- Connection Requests -->
      <div class="requests-section" v-if="connectionRequests.length > 0">
        <h2 v-voix="'Connection Requests Section'">Connection Requests</h2>
        
        <div class="requests-list">
          <div 
            v-for="request in connectionRequests" 
            :key="request.id"
            class="request-card"
            v-voix="`Connection Request From ${request.name}`"
          >
            <div class="request-avatar">{{ request.avatar }}</div>
            <div class="request-details">
              <div class="request-name">{{ request.name }}</div>
              <div class="request-title">{{ request.title }} at {{ request.company }}</div>
              <div class="request-interests">
                <span v-for="(interest, index) in request.mutualInterests" :key="index" class="interest-tag">
                  {{ interest }}
                </span>
              </div>
              <div class="request-message">
                "{{ request.message }}"
              </div>
            </div>
            <div class="request-actions">
              <button 
                class="btn-primary accept-btn"
                @click="acceptConnectionRequest(request.id)"
                v-voix="`Accept Request From ${request.name}`"
                hint="Accept this connection request"
              >
                Accept
              </button>
              <button 
                class="btn-secondary decline-btn"
                @click="declineConnectionRequest(request.id)"
                v-voix="`Decline Request From ${request.name}`"
                hint="Decline this connection request"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Connections -->
      <div class="connections-section">
        <div class="section-header">
          <h2 v-voix="'Connections Section'">My Connections</h2>
          
          <div class="connection-actions">
            <div class="search-container">
              <input 
                type="text" 
                v-model="search" 
                placeholder="Search connections..."
                v-voix="'Search Connections Input Field'"
                hint="Search your connections by name, title, company, or interests"
              />
            </div>
            
            <div class="filter-container">
              <select 
                v-model="filter"
                v-voix="'Filter Connections Dropdown'"
                hint="Filter connections by their status"
              >
                <option value="all">All</option>
                <option value="connected">Connected</option>
                <option value="pending">Pending</option>
                <option value="recommended">Recommended</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="connections-list">
          <div 
            v-for="connection in filteredConnections" 
            :key="connection.id"
            class="connection-card"
            :class="connection.status"
            v-voix="`Connection ${connection.name} Card`"
          >
            <div class="connection-avatar">{{ connection.avatar }}</div>
            <div class="connection-details">
              <div class="connection-name">{{ connection.name }}</div>
              <div class="connection-title">{{ connection.title }}</div>
              <div class="connection-company">{{ connection.company }}</div>
              <div class="connection-industry">{{ connection.industry }}</div>
              <div class="connection-interests">
                <span v-for="(interest, index) in connection.mutualInterests" :key="index" class="interest-tag">
                  {{ interest }}
                </span>
              </div>
            </div>
            <div class="connection-status">
              <span v-if="connection.status === 'connected'" class="status-badge connected">
                Connected
              </span>
              <span v-if="connection.status === 'pending'" class="status-badge pending">
                Pending
              </span>
              <div v-if="connection.status === 'recommended'" class="connection-actions">
                <button 
                  class="btn-primary connect-btn"
                  @click="updateConnectionStatus(connection.id, 'pending')"
                  v-voix="`Connect With ${connection.name}`"
                  hint="Send a connection request to this recommended professional"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="filteredConnections.length === 0" class="no-connections">
            No connections found. Try a different search or filter.
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="events-section">
        <h2 v-voix="'Events Section'">Upcoming Networking Events</h2>
        
        <div class="events-list">
          <div 
            v-for="event in events" 
            :key="event.id"
            class="event-card"
            v-voix="`Event ${event.title}`"
          >
            <div class="event-details">
              <div class="event-title">{{ event.title }}</div>
              <div class="event-date">{{ formatEventDate(event.date) }}</div>
              <div class="event-location">{{ event.location }}</div>
              <div class="event-attendees">{{ event.attendees }} attendees</div>
            </div>
            <div class="event-actions">
              <button 
                class="btn-primary" 
                v-if="!event.registered"
                @click="toggleEventRegistration(event.id)"
                v-voix="`Register For ${event.title}`"
                hint="Register to attend this event"
              >
                Register
              </button>
              <button 
                class="btn-secondary" 
                v-else
                @click="toggleEventRegistration(event.id)"
                v-voix="`Cancel Registration For ${event.title}`"
                hint="Cancel your registration for this event"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Network Settings -->
      <div class="settings-section">
        <h2 v-voix="'Network Settings Section'">Network Privacy Settings</h2>
        
        <div class="settings-form">
          <div class="form-group">
            <label for="privacyLevel" v-voix="'Privacy Level Label'">Privacy Level</label>
            <select 
              id="privacyLevel" 
              v-model="networkSettings.privacyLevel"
              v-voix="'Privacy Level Dropdown'"
              hint="Choose how much information to share in the network"
            >
              <option v-for="option in privacyLevelOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="notificationFrequency" v-voix="'Notification Frequency Label'">Notification Frequency</label>
            <select 
              id="notificationFrequency" 
              v-model="networkSettings.notificationFrequency"
              v-voix="'Notification Frequency Dropdown'"
              hint="Choose how often to receive network notifications"
            >
              <option v-for="option in notificationOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <div class="toggle-options">
            <div class="toggle-option">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  v-model="networkSettings.showProfile"
                  v-voix="'Toggle Show Profile'"
                  hint="Enable or disable sharing your profile information"
                />
                <span class="toggle-checkbox"></span>
                <span class="toggle-text">Show my profile</span>
              </label>
            </div>
            
            <div class="toggle-option">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  v-model="networkSettings.showProgress"
                  v-voix="'Toggle Show Progress'"
                  hint="Enable or disable sharing your progress information"
                />
                <span class="toggle-checkbox"></span>
                <span class="toggle-text">Show my progress</span>
              </label>
            </div>
            
            <div class="toggle-option">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  v-model="networkSettings.showAchievements"
                  v-voix="'Toggle Show Achievements'"
                  hint="Enable or disable sharing your achievements"
                />
                <span class="toggle-checkbox"></span>
                <span class="toggle-text">Show my achievements</span>
              </label>
            </div>
            
            <div class="toggle-option">
              <label class="toggle-label">
                <input 
                  type="checkbox" 
                  v-model="networkSettings.allowMessages"
                  v-voix="'Toggle Allow Messages'"
                  hint="Enable or disable receiving messages from connections"
                />
                <span class="toggle-checkbox"></span>
                <span class="toggle-text">Allow messages from connections</span>
              </label>
            </div>
          </div>
          
          <div class="settings-actions">
            <button 
              class="btn-primary save-btn"
              v-voix="'Save Settings Button'"
              hint="Save your network privacy settings"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Network Disabled Message -->
    <div v-else class="network-disabled">
      <div class="disabled-message" v-voix="'Network Disabled Message'">
        <h2>Network Features Disabled</h2>
        <p>You have chosen to disable network features. Toggle the switch above to access networking capabilities.</p>
        <p>When enabled, you'll be able to connect with other professionals, discover networking events, and grow your professional network.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.network-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.network-header {
  margin-bottom: 2rem;
  text-align: center;
}

.network-header h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.subheading {
  color: #666;
  margin: 0;
}

.network-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-label {
  font-weight: 600;
  color: #2c3e50;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
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
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #42b983;
}

input:focus + .toggle-slider {
  box-shadow: 0 0 1px #42b983;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.toggle-status {
  font-weight: 600;
  color: #42b983;
}

input:not(:checked) + .toggle-slider + .toggle-status {
  color: #888;
}

.network-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #42b983;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.requests-section,
.connections-section,
.events-section,
.settings-section {
  margin-bottom: 2.5rem;
}

.requests-section h2,
.connections-section h2,
.events-section h2,
.settings-section h2 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  margin-bottom: 0;
}

.connection-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-container input {
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 0.9rem;
  min-width: 250px;
}

.filter-container select {
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.requests-list,
.connections-list,
.events-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.request-card,
.connection-card,
.event-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.request-card {
  background-color: #f9f9f9;
  border-left: 4px solid #3498db;
}

.connection-card.connected {
  border-left: 4px solid #42b983;
}

.connection-card.pending {
  border-left: 4px solid #f39c12;
}

.connection-card.recommended {
  border-left: 4px solid #9b59b6;
}

.request-avatar,
.connection-avatar {
  font-size: 2.5rem;
  min-width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 50%;
}

.request-details,
.connection-details,
.event-details {
  flex: 1;
}

.request-name,
.connection-name,
.event-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.request-title,
.connection-title,
.event-date {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.connection-company,
.connection-industry,
.event-location,
.event-attendees {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.request-interests,
.connection-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.interest-tag {
  background-color: #e8f4f0;
  color: #42b983;
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.request-message {
  font-style: italic;
  background-color: #f5f5f5;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.75rem;
}

.request-actions,
.connection-status,
.event-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-end;
  justify-content: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.connected {
  background-color: #e8f4f0;
  color: #42b983;
}

.status-badge.pending {
  background-color: #fff8e1;
  color: #f39c12;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1.25rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.btn-primary:hover {
  background-color: #3aa876;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1.25rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.accept-btn,
.connect-btn {
  width: 100%;
}

.decline-btn {
  width: 100%;
}

.no-connections {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #666;
}

.settings-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.toggle-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.toggle-option {
  margin-bottom: 0.75rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-checkbox {
  width: 18px;
  height: 18px;
  background-color: #eee;
  border-radius: 4px;
  margin-right: 10px;
  display: inline-block;
  position: relative;
}

.toggle-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.toggle-label input:checked ~ .toggle-checkbox {
  background-color: #42b983;
}

.toggle-checkbox:after {
  content: "";
  position: absolute;
  display: none;
}

.toggle-label input:checked ~ .toggle-checkbox:after {
  display: block;
}

.toggle-label .toggle-checkbox:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.toggle-text {
  font-size: 0.95rem;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  min-width: 150px;
}

.network-disabled {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.disabled-message {
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
}

.disabled-message h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.disabled-message p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .connection-actions {
    width: 100%;
  }
  
  .search-container,
  .search-container input,
  .filter-container,
  .filter-container select {
    width: 100%;
  }
  
  .request-card,
  .connection-card,
  .event-card {
    flex-direction: column;
  }
  
  .request-actions,
  .connection-status,
  .event-actions {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  .accept-btn,
  .decline-btn,
  .connect-btn,
  .event-actions button {
    width: auto;
    flex: 1;
  }
}
</style>