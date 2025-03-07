<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock data for matches with enhanced details
const mockMatches = ref([
  {
    id: 1,
    jobTitle: 'Frontend Developer',
    company: 'TechCorp',
    companyLogo: '/favicon.ico', // Use local favicon as fallback
    location: 'San Francisco, CA',
    salary: '$100,000 - $130,000',
    matchDate: '2025-02-15',
    lastMessage: 'Hi there! We were impressed with your profile and would like to schedule an interview.',
    lastMessageTime: '2025-02-15T14:30:00Z',
    unread: true,
    interviewStatus: 'pending',
    matchStrength: 95
  },
  {
    id: 2,
    jobTitle: 'UX/UI Designer',
    company: 'CreativeWorks',
    companyLogo: '/favicon.ico', // Use local favicon as fallback
    location: 'Austin, TX',
    salary: '$90,000 - $120,000',
    matchDate: '2025-02-10',
    lastMessage: 'Thanks for your response. How does next Tuesday at 2 PM sound for a video call?',
    lastMessageTime: '2025-02-11T09:45:00Z',
    unread: false,
    interviewStatus: 'scheduled',
    interviewDate: '2025-02-18T14:00:00Z',
    matchStrength: 87
  },
  {
    id: 3,
    jobTitle: 'Full Stack Developer',
    company: 'StartupInnovate',
    companyLogo: '/favicon.ico', // Use local favicon as fallback
    location: 'New York, NY',
    salary: '$120,000 - $150,000',
    matchDate: '2025-02-05',
    lastMessage: null,
    unread: false,
    interviewStatus: 'none',
    matchStrength: 82
  },
  {
    id: 4,
    jobTitle: 'Machine Learning Engineer',
    company: 'AI Innovations',
    companyLogo: '/favicon.ico', // Use local favicon as fallback
    location: 'Boston, MA',
    salary: '$140,000 - $180,000',
    matchDate: '2025-02-18',
    lastMessage: 'We would love to talk more about your experience with TensorFlow and PyTorch. Are you available for a technical discussion this week?',
    lastMessageTime: '2025-02-19T10:15:00Z',
    unread: true,
    interviewStatus: 'none',
    matchStrength: 91
  }
])

const activeTab = ref('all') // 'all', 'messages', 'interviews'
const searchQuery = ref('')

// Computed properties for filtering
const filteredMatches = computed(() => {
  let matches = [...mockMatches.value]
  
  // Filter by tab
  if (activeTab.value === 'messages') {
    matches = matches.filter(match => match.lastMessage)
  } else if (activeTab.value === 'interviews') {
    matches = matches.filter(match => match.interviewStatus === 'scheduled')
  }
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    matches = matches.filter(match => 
      match.jobTitle.toLowerCase().includes(query) || 
      match.company.toLowerCase().includes(query) || 
      match.location.toLowerCase().includes(query)
    )
  }
  
  // Sort by unread first, then by match date
  return matches.sort((a, b) => {
    if (a.unread && !b.unread) return -1
    if (!a.unread && b.unread) return 1
    return new Date(b.matchDate) - new Date(a.matchDate)
  })
})

// Total matches count with unread count
const matchesCounts = computed(() => {
  return {
    total: mockMatches.value.length,
    unread: mockMatches.value.filter(m => m.unread).length,
    messages: mockMatches.value.filter(m => m.lastMessage).length,
    interviews: mockMatches.value.filter(m => m.interviewStatus === 'scheduled').length
  }
})

const navigateToChat = (matchId) => {
  // Set the message as read before navigating
  const match = mockMatches.value.find(m => m.id === matchId)
  if (match) {
    match.unread = false
  }
  
  router.push(`/chat/${matchId}`)
}

const selectTab = (tab) => {
  activeTab.value = tab
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

const formatMessageDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    // Today - show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    // This week - show day name
    return date.toLocaleDateString([], { weekday: 'short' })
  } else {
    // Older - show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

const formatInterviewDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

const truncateMessage = (message, maxLength = 65) => {
  if (!message) return ''
  return message.length > maxLength ? message.substring(0, maxLength) + '...' : message
}
</script>

<template>
  <div class="matches-container">
    <div class="matches-header">
      <h2 v-voix="'matches-heading'">Your Matches</h2>
      
      <div class="search-bar">
        <div class="search-input-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search matches..." 
            v-voix="'search-matches'"
            hint="Search for job titles, companies, or locations"
          />
        </div>
      </div>
    </div>
    
    <div class="tab-navigation">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'all' }" 
        @click="selectTab('all')"
        v-voix="'all-matches-tab'"
        hint="View all matches"
      >
        All
        <span class="tab-badge">{{ matchesCounts.total }}</span>
      </button>
      
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'messages' }" 
        @click="selectTab('messages')"
        v-voix="'messages-tab'"
        hint="View matches with messages"
      >
        Messages
        <span class="tab-badge">{{ matchesCounts.messages }}</span>
      </button>
      
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'interviews' }" 
        @click="selectTab('interviews')"
        v-voix="'interviews-tab'"
        hint="View matches with scheduled interviews"
      >
        Interviews
        <span class="tab-badge">{{ matchesCounts.interviews }}</span>
      </button>
    </div>
    
    <div v-if="filteredMatches.length" class="matches-list">
      <div 
        v-for="match in filteredMatches" 
        :key="match.id" 
        class="match-card" 
        :class="{ unread: match.unread }"
        @click="navigateToChat(match.id)"
        v-voix="`match-${match.id}`"
        :hint="`Match with ${match.company} for ${match.jobTitle} position${match.unread ? ', unread message' : ''}`"
      >
        <div class="match-logo">
          <img :src="match.companyLogo" :alt="match.company + ' logo'" />
          
          <div class="match-strength" :style="{ '--strength': `${match.matchStrength}%` }">
            <div class="strength-indicator"></div>
            <span class="strength-text">{{ match.matchStrength }}%</span>
          </div>
        </div>
        
        <div class="match-content">
          <div class="match-header">
            <div class="job-info">
              <h3>{{ match.jobTitle }}</h3>
              <div class="company-info">
                <span class="company-name">{{ match.company }}</span>
                <span class="separator">•</span>
                <span class="location">{{ match.location }}</span>
              </div>
            </div>
            <div class="match-meta">
              <span class="match-date">{{ formatDate(match.matchDate) }}</span>
              <span v-if="match.unread" class="unread-badge">New</span>
            </div>
          </div>
          
          <div class="match-details">
            <div class="salary-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                <path d="M12 6v2"></path>
                <path d="M12 16v2"></path>
              </svg>
              <span>{{ match.salary }}</span>
            </div>
            
            <div v-if="match.interviewStatus === 'scheduled'" class="interview-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Interview: {{ formatInterviewDate(match.interviewDate) }}</span>
            </div>
          </div>
          
          <div class="message-preview" v-if="match.lastMessage">
            <p>{{ truncateMessage(match.lastMessage) }}</p>
            <span class="message-time">{{ formatMessageDate(match.lastMessageTime) }}</span>
          </div>
          
          <div class="no-message" v-else>
            <p>No messages yet. Start the conversation!</p>
            <button 
              class="start-chat-button"
              v-voix="`start-chat-${match.id}`"
              :hint="`Start conversation with ${match.company}`"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty states based on active tab -->
    <div v-else-if="activeTab === 'all'" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <h3>No matches yet</h3>
      <p>Keep swiping to find your perfect match!</p>
      <button 
        class="primary-button" 
        @click="router.push('/swipe')"
        v-voix="'find-matches-button'"
        hint="Go to swipe page to find more matches"
      >
        Find Matches
      </button>
    </div>
    
    <div v-else-if="activeTab === 'messages'" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <h3>No messages yet</h3>
      <p>Start a conversation with one of your matches!</p>
      <button 
        class="primary-button" 
        @click="selectTab('all')"
        v-voix="'view-all-matches-button'"
        hint="View all matches to start a conversation"
      >
        View All Matches
      </button>
    </div>
    
    <div v-else-if="activeTab === 'interviews'" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <h3>No interviews scheduled</h3>
      <p>Chat with your matches to schedule interviews</p>
      <button 
        class="primary-button" 
        @click="selectTab('messages')"
        v-voix="'view-messages-button'"
        hint="View messages to schedule interviews"
      >
        View Messages
      </button>
    </div>
    
    <!-- Empty search results -->
    <div v-else-if="searchQuery" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <h3>No matches found</h3>
      <p>Try a different search term or clear your search</p>
      <button 
        class="primary-button" 
        @click="searchQuery = ''"
        v-voix="'clear-search-button'"
        hint="Clear search query"
      >
        Clear Search
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Main container */
.matches-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* Header section */
.matches-header {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.matches-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
  text-align: center;
}

.search-bar {
  display: flex;
  justify-content: center;
}

.search-input-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-input-container svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-input-container input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #e0e4ed;
  border-radius: 30px;
  background-color: #f7f9fc;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.search-input-container input:focus {
  outline: none;
  border-color: #c0c4d0;
  background-color: white;
}

/* Tab navigation */
.tab-navigation {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e4ed;
}

.tab-button {
  background: none;
  border: none;
  padding: 0.8rem 1.2rem;
  border-bottom: 2px solid transparent;
  color: #777;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button:hover {
  color: #ff5757;
}

.tab-button.active {
  color: #ff5757;
  border-color: #ff5757;
}

.tab-badge {
  background-color: #f0f2f8;
  color: #666;
  font-size: 0.75rem;
  min-width: 20px;
  height: 20px;
  padding: 0 0.4rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-button.active .tab-badge {
  background-color: #ff5757;
  color: white;
}

/* Matches list */
.matches-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.match-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  border-left: 4px solid transparent;
}

.match-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.match-card.unread {
  border-left-color: #ff5757;
}

/* Match logo and strength indicator */
.match-logo {
  flex-shrink: 0;
  padding: 1.2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
}

.match-logo img {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  border: 1px solid #f0f2f8;
  background-color: white;
}

.match-strength {
  position: relative;
  width: 64px;
  height: 6px;
  background-color: #f0f2f8;
  border-radius: 3px;
  overflow: hidden;
}

.strength-indicator {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: var(--strength);
  background: linear-gradient(90deg, #ff5757, #ff8c8c);
  border-radius: 3px;
}

.strength-text {
  position: absolute;
  top: 6px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
}

/* Match content */
.match-content {
  flex: 1;
  padding: 1.2rem 1.2rem 1.2rem 0;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Enables text truncation */
}

.match-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.job-info {
  flex: 1;
  min-width: 0; /* Enables text truncation */
}

.job-info h3 {
  margin: 0 0 0.2rem 0;
  font-size: 1.2rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.company-info {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.company-name {
  font-weight: 600;
}

.separator {
  margin: 0 0.4rem;
}

.match-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
}

.match-date {
  font-size: 0.8rem;
  color: #999;
}

.unread-badge {
  background-color: #ff5757;
  color: white;
  padding: 0.1rem 0.5rem;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: bold;
}

/* Match details section */
.match-details {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 0.8rem;
}

.salary-info, .interview-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #666;
}

.interview-info {
  color: #4caf50;
}

.interview-info svg {
  color: #4caf50;
}

/* Message preview */
.message-preview {
  position: relative;
  border-top: 1px solid #f0f2f8;
  padding-top: 0.8rem;
  margin-right: 6rem;
}

.message-preview p {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-time {
  position: absolute;
  top: 0.8rem;
  right: -6rem;
  font-size: 0.75rem;
  color: #999;
}

/* No message state */
.no-message {
  border-top: 1px solid #f0f2f8;
  padding-top: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.no-message p {
  margin: 0;
  font-size: 0.9rem;
  color: #888;
  font-style: italic;
}

.start-chat-button {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #f0f2f8;
  color: #555;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.start-chat-button:hover {
  background-color: #e4e8f0;
  color: #ff5757;
}

.start-chat-button svg {
  transition: transform 0.2s;
}

.start-chat-button:hover svg {
  transform: translateX(2px);
}

/* Empty states */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
  color: #777;
}

.empty-state svg {
  color: #ddd;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  margin: 0 0 0.8rem 0;
  font-size: 1.3rem;
  color: #555;
}

.empty-state p {
  margin: 0 0 2rem 0;
  max-width: 300px;
}

.primary-button {
  background-color: #ff5757;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button:hover {
  background-color: #ff4343;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 87, 87, 0.2);
}

/* Responsive styles */
@media (max-width: 768px) {
  .matches-container {
    padding: 1rem 0.8rem;
  }
  
  .match-card {
    flex-direction: column;
    border-left: none;
    border-top: 4px solid transparent;
  }
  
  .match-card.unread {
    border-top-color: #ff5757;
    border-left-color: transparent;
  }
  
  .match-logo {
    padding: 1.2rem 1.2rem 0 1.2rem;
    flex-direction: row;
    gap: 1rem;
  }
  
  .match-content {
    padding: 0 1.2rem 1.2rem 1.2rem;
  }
  
  .message-preview {
    margin-right: 0;
  }
  
  .message-time {
    position: static;
    display: block;
    margin-top: 0.3rem;
  }
}
</style>