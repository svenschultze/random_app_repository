<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userProfile = ref({
  name: 'Alex Johnson',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  skills: {
    teaching: [
      { id: 1, name: 'JavaScript Programming', level: 'Advanced' },
      { id: 2, name: 'Digital Photography', level: 'Expert' }
    ],
    learning: [
      { id: 1, name: 'Spanish Language', level: 'Beginner' },
      { id: 2, name: 'Guitar', level: 'Intermediate' }
    ]
  }
})

const upcomingSessions = ref([
  {
    id: 101,
    type: 'teaching',
    skill: 'JavaScript Programming',
    partnerName: 'Sarah Miller',
    partnerAvatar: 'https://randomuser.me/api/portraits/women/41.jpg',
    date: '2025-03-07T15:00:00',
    duration: 60,
    isOnline: true
  },
  {
    id: 102,
    type: 'learning',
    skill: 'Spanish Language',
    partnerName: 'Eduardo Garcia',
    partnerAvatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    date: '2025-03-08T10:00:00',
    duration: 45,
    isOnline: true
  }
])

const suggestedMatches = ref([
  {
    id: 201,
    name: 'Maria Chen',
    avatar: 'https://randomuser.me/api/portraits/women/49.jpg',
    compatibility: 95,
    canTeachYou: ['Spanish Language', 'Cooking'],
    youCanTeach: ['JavaScript Programming'],
    commonInterests: ['Photography', 'Travel']
  },
  {
    id: 202,
    name: 'David Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    compatibility: 87,
    canTeachYou: ['Guitar', 'Music Theory'],
    youCanTeach: ['Digital Photography'],
    commonInterests: ['Music', 'Art']
  },
  {
    id: 203,
    name: 'Emma Torres',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    compatibility: 82,
    canTeachYou: ['Spanish Language', 'Yoga'],
    youCanTeach: ['JavaScript Programming', 'Digital Photography'],
    commonInterests: ['Technology', 'Health']
  }
])

const recentMessages = ref([
  {
    id: 301,
    name: 'Sarah Miller',
    avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
    lastMessage: 'Looking forward to our JavaScript session tomorrow!',
    timestamp: '2025-03-06T18:45:00',
    unread: true
  },
  {
    id: 302,
    name: 'Eduardo Garcia',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    lastMessage: 'Can we go over verb conjugations during our session?',
    timestamp: '2025-03-06T14:20:00',
    unread: false
  },
  {
    id: 303,
    name: 'Maria Chen',
    avatar: 'https://randomuser.me/api/portraits/women/49.jpg',
    lastMessage: 'Hi Alex! I saw we are a match. Would you be interested in swapping Spanish for JavaScript lessons?',
    timestamp: '2025-03-05T09:15:00',
    unread: false
  }
])

const activitiesFeed = ref([
  {
    id: 401,
    type: 'match',
    content: 'You matched with Maria Chen for Spanish/JavaScript exchange',
    timestamp: '2025-03-05T09:00:00'
  },
  {
    id: 402,
    type: 'session-completed',
    content: 'You completed a Digital Photography session with James Lee',
    timestamp: '2025-03-04T16:30:00'
  },
  {
    id: 403,
    type: 'review',
    content: 'James Lee gave you a 5-star review for your Photography session',
    timestamp: '2025-03-04T17:15:00'
  },
  {
    id: 404,
    type: 'match',
    content: 'You matched with David Wilson for Guitar/Photography exchange',
    timestamp: '2025-03-03T13:45:00'
  }
])

// Format a date string as a relative time (e.g., "2 days ago", "Just now")
const getRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHr = Math.round(diffMin / 60)
  const diffDays = Math.round(diffHr / 24)

  if (diffSec < 60) {
    return 'Just now'
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`
  } else if (diffHr < 24) {
    return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
}

// Format session date and time
const formatSessionDateTime = (dateString) => {
  const date = new Date(dateString)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const dateFormatted = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
  const timeFormatted = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
  
  return `${dayName}, ${dateFormatted} at ${timeFormatted}`
}

const viewSession = (sessionId) => {
  router.push(`/session/${sessionId}`)
}

const viewConversation = (userId) => {
  router.push('/messages')
}

const viewProfile = (userId) => {
  router.push('/profile')
}

const exploreMatches = () => {
  router.push('/matches')
}

const goToSchedule = () => {
  router.push('/schedule')
}

const goToMessages = () => {
  router.push('/messages')
}

onMounted(() => {
  // Simulating login state for demonstration
  localStorage.setItem('isLoggedIn', 'true')
})
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 v-voix="'dashboard-title'">Dashboard</h1>
      <p class="welcome-text" v-voix="'welcome-text'">Welcome back, {{ userProfile.name }}!</p>
    </div>

    <div class="dashboard-grid">
      <!-- Upcoming Sessions Card -->
      <div class="dashboard-card upcoming-sessions-card">
        <div class="card-header">
          <h2 v-voix="'upcoming-sessions-title'">Upcoming Sessions</h2>
          <button 
            class="view-all-button" 
            @click="goToSchedule"
            v-voix="'view-schedule-button'"
            hint="View your complete schedule"
          >
            View Schedule
          </button>
        </div>
        
        <div v-if="upcomingSessions.length > 0" class="sessions-list">
          <div 
            v-for="session in upcomingSessions" 
            :key="session.id" 
            class="session-item"
            v-voix="`session-item-${session.id}`"
          >
            <div class="session-badge" :class="session.type">
              {{ session.type === 'teaching' ? 'Teaching' : 'Learning' }}
            </div>
            <div class="session-content">
              <div class="session-partner">
                <img :src="session.partnerAvatar" :alt="session.partnerName" class="partner-avatar">
                <div class="session-details">
                  <h3 class="session-skill">{{ session.skill }}</h3>
                  <p class="session-with">with {{ session.partnerName }}</p>
                </div>
              </div>
              <div class="session-time">
                <div class="time-details">
                  <span class="session-date">{{ formatSessionDateTime(session.date) }}</span>
                  <span class="session-duration">{{ session.duration }} minutes</span>
                </div>
                <span class="session-mode">{{ session.isOnline ? 'Online' : 'In Person' }}</span>
              </div>
              <button 
                class="join-session-button" 
                @click="viewSession(session.id)"
                v-voix="`join-session-${session.id}`"
                hint="Open this session"
              >
                {{ new Date(session.date) <= new Date() ? 'Join Now' : 'View Details' }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">📅</div>
          <p class="empty-text">No upcoming sessions scheduled</p>
          <button 
            class="schedule-button" 
            @click="goToSchedule"
            v-voix="'schedule-session-button'"
            hint="Go to your schedule to create a new session"
          >
            Schedule a Session
          </button>
        </div>
      </div>

      <!-- Suggested Matches Card -->
      <div class="dashboard-card suggested-matches-card">
        <div class="card-header">
          <h2 v-voix="'suggested-matches-title'">Suggested Matches</h2>
          <button 
            class="view-all-button" 
            @click="exploreMatches"
            v-voix="'view-all-matches-button'"
            hint="Explore all potential matches"
          >
            Explore All
          </button>
        </div>
        
        <div class="matches-grid">
          <div 
            v-for="match in suggestedMatches" 
            :key="match.id" 
            class="match-card"
            v-voix="`match-card-${match.id}`"
          >
            <div class="match-header">
              <img :src="match.avatar" :alt="match.name" class="match-avatar">
              <div class="match-score">
                <span class="score-value">{{ match.compatibility }}%</span>
                <span class="score-label">Match</span>
              </div>
            </div>
            <h3 class="match-name">{{ match.name }}</h3>
            
            <div class="skills-exchange">
              <div class="skill-list">
                <h4 v-voix="`match-${match.id}-can-teach`">Can teach you:</h4>
                <ul>
                  <li v-for="(skill, index) in match.canTeachYou" :key="index">{{ skill }}</li>
                </ul>
              </div>
              <div class="skill-list">
                <h4 v-voix="`match-${match.id}-you-teach`">You can teach:</h4>
                <ul>
                  <li v-for="(skill, index) in match.youCanTeach" :key="index">{{ skill }}</li>
                </ul>
              </div>
            </div>
            
            <div class="match-actions">
              <button 
                class="view-profile-button" 
                @click="viewProfile(match.id)"
                v-voix="`view-profile-${match.id}`"
                hint="View this person's profile"
              >
                View Profile
              </button>
              <button 
                class="send-message-button" 
                @click="viewConversation(match.id)"
                v-voix="`message-match-${match.id}`"
                hint="Send a message to this person"
              >
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Messages Card -->
      <div class="dashboard-card recent-messages-card">
        <div class="card-header">
          <h2 v-voix="'recent-messages-title'">Recent Messages</h2>
          <button 
            class="view-all-button" 
            @click="goToMessages"
            v-voix="'view-all-messages-button'"
            hint="View all your conversations"
          >
            View All
          </button>
        </div>
        
        <div class="messages-list">
          <div 
            v-for="message in recentMessages" 
            :key="message.id" 
            class="message-item"
            :class="{ unread: message.unread }"
            v-voix="`message-item-${message.id}`"
            @click="viewConversation(message.id)"
          >
            <div class="message-avatar">
              <img :src="message.avatar" :alt="message.name">
              <div v-if="message.unread" class="unread-indicator"></div>
            </div>
            <div class="message-content">
              <div class="message-header">
                <h3 class="message-sender">{{ message.name }}</h3>
                <span class="message-time">{{ getRelativeTime(message.timestamp) }}</span>
              </div>
              <p class="message-preview">{{ message.lastMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Feed Card -->
      <div class="dashboard-card activity-feed-card">
        <div class="card-header">
          <h2 v-voix="'activity-feed-title'">Recent Activity</h2>
        </div>
        
        <div class="activity-list">
          <div 
            v-for="activity in activitiesFeed" 
            :key="activity.id" 
            class="activity-item"
            v-voix="`activity-${activity.id}`"
          >
            <div class="activity-icon" :class="activity.type">
              <span v-if="activity.type === 'match'">🔄</span>
              <span v-else-if="activity.type === 'session-completed'">✅</span>
              <span v-else-if="activity.type === 'review'">⭐</span>
              <span v-else>📣</span>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.content }}</p>
              <span class="activity-time">{{ getRelativeTime(activity.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.welcome-text {
  color: var(--light-text);
  font-size: 1.1rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.dashboard-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  overflow: hidden;
}

.upcoming-sessions-card {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
}

.suggested-matches-card {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
}

.recent-messages-card {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}

.activity-feed-card {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.view-all-button {
  color: var(--primary-color);
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.view-all-button:hover {
  text-decoration: underline;
  color: var(--secondary-color);
}

/* Empty state styling */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--light-text);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-text {
  margin-bottom: 1.5rem;
}

.schedule-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.schedule-button:hover {
  background-color: var(--secondary-color);
}

/* Upcoming Sessions styling */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.session-badge {
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.session-badge.teaching {
  background-color: rgba(92, 107, 192, 0.15);
  color: #3949ab;
}

.session-badge.learning {
  background-color: rgba(102, 187, 106, 0.15);
  color: #43a047;
}

.session-content {
  padding: 1rem;
}

.session-partner {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.partner-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.session-details {
  flex: 1;
}

.session-skill {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.session-with {
  color: var(--light-text);
  font-size: 0.9rem;
}

.session-time {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.session-date {
  font-weight: 500;
  font-size: 0.9rem;
}

.session-duration, .session-mode {
  color: var(--light-text);
  font-size: 0.85rem;
}

.join-session-button {
  width: 100%;
  background-color: var(--primary-color);
  color: white;
  padding: 0.625rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.join-session-button:hover {
  background-color: var(--secondary-color);
}

/* Suggested Matches styling */
.matches-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

.match-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  transition: var(--transition);
}

.match-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.match-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.match-score {
  background-color: rgba(74, 140, 255, 0.1);
  color: var(--primary-color);
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.score-value {
  font-weight: 700;
  font-size: 1.1rem;
}

.score-label {
  font-size: 0.75rem;
  font-weight: 500;
}

.match-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.skills-exchange {
  margin-bottom: 1.25rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.skill-list h4 {
  font-size: 0.85rem;
  color: var(--light-text);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.skill-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-list li {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.match-actions {
  display: flex;
  gap: 0.75rem;
}

.view-profile-button, .send-message-button {
  flex: 1;
  padding: 0.625rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
}

.view-profile-button {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  background-color: transparent;
}

.view-profile-button:hover {
  background-color: rgba(74, 140, 255, 0.1);
}

.send-message-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.send-message-button:hover {
  background-color: var(--secondary-color);
}

/* Recent Messages styling */
.messages-list {
  display: flex;
  flex-direction: column;
}

.message-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: var(--transition);
}

.message-item:last-child {
  border-bottom: none;
}

.message-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.message-item.unread {
  background-color: rgba(74, 140, 255, 0.05);
}

.message-avatar {
  position: relative;
}

.message-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.unread-indicator {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: var(--primary-color);
  border-radius: 50%;
  border: 2px solid white;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.message-sender {
  font-weight: 600;
  font-size: 1rem;
}

.message-time {
  color: var(--light-text);
  font-size: 0.8rem;
}

.message-preview {
  color: var(--light-text);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-item.unread .message-sender,
.message-item.unread .message-preview {
  color: var(--text-color);
  font-weight: 500;
}

/* Activity Feed styling */
.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.25rem;
}

.activity-icon.match {
  background-color: rgba(74, 140, 255, 0.1);
  color: var(--primary-color);
}

.activity-icon.session-completed {
  background-color: rgba(102, 187, 106, 0.1);
  color: #43a047;
}

.activity-icon.review {
  background-color: rgba(255, 167, 38, 0.1);
  color: #fb8c00;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.activity-time {
  color: var(--light-text);
  font-size: 0.8rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .upcoming-sessions-card,
  .suggested-matches-card,
  .recent-messages-card,
  .activity-feed-card {
    grid-column: 1;
  }
  
  .upcoming-sessions-card {
    grid-row: 1;
  }
  
  .suggested-matches-card {
    grid-row: 2;
  }
  
  .recent-messages-card {
    grid-row: 3;
  }
  
  .activity-feed-card {
    grid-row: 4;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }
  
  .skills-exchange {
    grid-template-columns: 1fr;
  }
  
  .session-time {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>