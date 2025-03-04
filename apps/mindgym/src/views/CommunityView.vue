<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

// Mock community data
const discussionCategories = [
  { id: 'general', name: 'General Discussion', icon: '💬' },
  { id: 'tips', name: 'Tips & Strategies', icon: '💡' },
  { id: 'achievements', name: 'Achievements', icon: '🏆' },
  { id: 'support', name: 'Help & Support', icon: '❓' }
]

const discussionTopics = [
  { 
    id: 1, 
    category: 'general',
    title: 'Introduction: Let\'s get to know each other!', 
    author: 'Alex', 
    created: '2 days ago',
    replies: 24,
    lastReply: '3 hours ago' 
  },
  { 
    id: 2, 
    category: 'tips',
    title: 'Memory techniques that helped me reach level 10', 
    author: 'Taylor', 
    created: '1 week ago',
    replies: 18,
    lastReply: '1 day ago' 
  },
  { 
    id: 3, 
    category: 'achievements',
    title: 'Just hit a 30-day streak! Here\'s what I learned', 
    author: 'Jordan', 
    created: '3 days ago',
    replies: 15,
    lastReply: '5 hours ago' 
  },
  { 
    id: 4, 
    category: 'tips',
    title: 'How to improve your spatial reasoning skills', 
    author: 'Morgan', 
    created: '5 days ago',
    replies: 12,
    lastReply: '1 day ago' 
  },
  { 
    id: 5, 
    category: 'general',
    title: 'What\'s your favorite challenge type?', 
    author: 'Casey', 
    created: '1 day ago',
    replies: 31,
    lastReply: '30 minutes ago' 
  },
  { 
    id: 6, 
    category: 'support',
    title: 'How do I customize my daily challenges?', 
    author: 'Riley', 
    created: '4 days ago',
    replies: 7,
    lastReply: '2 days ago' 
  },
  { 
    id: 7, 
    category: 'achievements',
    title: 'Just solved the advanced Visual Puzzles challenge!', 
    author: 'Quinn', 
    created: '6 hours ago',
    replies: 9,
    lastReply: '1 hour ago' 
  },
  { 
    id: 8, 
    category: 'tips',
    title: 'Mental math shortcuts that improved my scores', 
    author: 'Jamie', 
    created: '1 week ago',
    replies: 22,
    lastReply: '2 days ago' 
  }
]

// Featured community members
const featuredMembers = [
  { 
    id: 1, 
    name: 'Morgan', 
    level: 25, 
    streak: 45, 
    badges: 15, 
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Morgan' 
  },
  { 
    id: 2, 
    name: 'Taylor', 
    level: 22, 
    streak: 38, 
    badges: 12, 
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Taylor' 
  },
  { 
    id: 3, 
    name: 'Alex', 
    level: 19, 
    streak: 30, 
    badges: 10, 
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Alex' 
  }
]

// Upcoming events
const upcomingEvents = [
  {
    id: 1,
    title: 'Weekly Memory Challenge',
    description: 'Compete with others in a special memory challenge.',
    date: 'Every Monday, 8:00 PM',
    participants: 45
  },
  {
    id: 2,
    title: 'Mental Math Sprint',
    description: 'Test your mental math speed in this time-based event.',
    date: 'Every Wednesday, 7:00 PM',
    participants: 32
  },
  {
    id: 3,
    title: 'Weekend Brain Boost',
    description: 'A weekend-long event with special challenges and rewards.',
    date: 'Saturday-Sunday, All Day',
    participants: 78
  }
]

// Filter state
const selectedCategory = ref('all')

// Filtered discussions
const filteredDiscussions = computed(() => {
  if (selectedCategory.value === 'all') {
    return discussionTopics
  } else {
    return discussionTopics.filter(topic => topic.category === selectedCategory.value)
  }
})

// Create new discussion
const showNewDiscussionForm = ref(false)
const newDiscussion = ref({
  title: '',
  category: 'general',
  content: ''
})

function submitNewDiscussion() {
  // Here you would typically send the new discussion to an API
  // For demo purposes, we'll just show a success message
  alert('Your discussion has been created!')
  showNewDiscussionForm.value = false
  newDiscussion.value = {
    title: '',
    category: 'general',
    content: ''
  }
}
</script>

<template>
  <div class="community-container">
    <div class="community-header">
      <h1>Community</h1>
      <p>Connect with fellow mind athletes, share tips, and celebrate achievements.</p>
    </div>
    
    <div class="community-content">
      <div class="forum-section">
        <div class="section-header">
          <h2>Discussion Forum</h2>
          <button 
            class="new-discussion-btn" 
            @click="showNewDiscussionForm = !showNewDiscussionForm"
            v-voix="showNewDiscussionForm ? 'Cancel New Discussion' : 'Create New Discussion'"
            hint="Toggle the discussion creation form"
          >
            {{ showNewDiscussionForm ? 'Cancel' : 'New Discussion' }}
          </button>
        </div>
        
        <!-- New Discussion Form -->
        <div v-if="showNewDiscussionForm" class="new-discussion-form">
          <h3>Create New Discussion</h3>
          
          <div class="form-group">
            <label for="discussion-title">Title</label>
            <input 
              id="discussion-title" 
              type="text" 
              v-model="newDiscussion.title" 
              placeholder="Enter discussion title"
              v-voix="'Discussion Title Input'"
              hint="Enter a title for your new discussion"
            />
          </div>
          
          <div class="form-group">
            <label for="discussion-category">Category</label>
            <select 
              id="discussion-category" 
              v-model="newDiscussion.category"
              v-voix="'Select Discussion Category'"
              hint="Choose a category for your discussion"
            >
              <option 
                v-for="category in discussionCategories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="discussion-content">Content</label>
            <textarea 
              id="discussion-content" 
              v-model="newDiscussion.content" 
              placeholder="Enter your discussion content"
              rows="5"
              v-voix="'Discussion Content Input'"
              hint="Enter the main content of your discussion"
            ></textarea>
          </div>
          
          <button 
            class="submit-btn" 
            @click="submitNewDiscussion"
            v-voix="'Submit Discussion'"
            hint="Create and post your new discussion"
          >Create Discussion</button>
        </div>
        
        <!-- Discussion Categories -->
        <div class="forum-categories">
          <button 
            :class="{ selected: selectedCategory === 'all' }" 
            @click="selectedCategory = 'all'"
            v-voix="'View All Categories'"
            hint="Show discussions from all categories"
          >
            All
          </button>
          <button 
            v-for="category in discussionCategories" 
            :key="category.id"
            :class="{ selected: selectedCategory === category.id }" 
            @click="selectedCategory = category.id"
            v-voix="'Filter by ' + category.name"
            hint="Show only discussions in the {{category.name}} category"
          >
            <span class="category-icon">{{ category.icon }}</span>
            {{ category.name }}
          </button>
        </div>
        
        <!-- Discussion List -->
        <div class="discussion-list">
          <div 
            v-for="topic in filteredDiscussions" 
            :key="topic.id" 
            class="discussion-item"
            v-voix="'Discussion: ' + topic.title"
            hint="Open this discussion thread"
          >
            <div class="discussion-main">
              <div 
                class="category-badge"
                :class="{ 
                  'general': topic.category === 'general',
                  'tips': topic.category === 'tips',
                  'achievements': topic.category === 'achievements',
                  'support': topic.category === 'support'
                }"
              >
                {{ discussionCategories.find(c => c.id === topic.category).icon }}
              </div>
              <div class="discussion-content">
                <h3 class="discussion-title">{{ topic.title }}</h3>
                <div class="discussion-meta">
                  <span class="discussion-author">by {{ topic.author }}</span>
                  <span class="discussion-date">{{ topic.created }}</span>
                </div>
              </div>
            </div>
            <div class="discussion-stats">
              <div class="replies-count">
                <span class="count">{{ topic.replies }}</span>
                <span class="label">replies</span>
              </div>
              <div class="last-reply">
                <span class="label">Last reply</span>
                <span class="time">{{ topic.lastReply }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="side-content">
        <!-- Featured Members -->
        <div class="featured-members">
          <h3>Featured Members</h3>
          <div class="members-list">
            <div 
              v-for="member in featuredMembers" 
              :key="member.id" 
              class="member-card"
              v-voix="'Member Profile: ' + member.name"
              hint="View details for this featured member"
            >
              <div class="member-avatar">
                <img :src="member.avatar" :alt="member.name" />
              </div>
              <div class="member-info">
                <div class="member-name">{{ member.name }}</div>
                <div class="member-stats">
                  <span class="stat">Lvl {{ member.level }}</span>
                  <span class="stat">{{ member.streak }} 🔥</span>
                  <span class="stat">{{ member.badges }} 🏆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Upcoming Events -->
        <div class="upcoming-events">
          <h3>Upcoming Events</h3>
          <div class="events-list">
            <div 
              v-for="event in upcomingEvents" 
              :key="event.id" 
              class="event-card"
              v-voix="'Event: ' + event.title"
              hint="View details about this upcoming event"
            >
              <div class="event-header">
                <h4>{{ event.title }}</h4>
                <div class="event-date">{{ event.date }}</div>
              </div>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-participants">
                <span class="icon">👥</span> {{ event.participants }} participants
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.community-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.community-header {
  margin-bottom: 2rem;
}

.community-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #333;
}

.community-header p {
  margin: 0;
  color: #666;
}

.community-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

/* Forum Section */
.forum-section {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #333;
}

.new-discussion-btn {
  background-color: #3a86ff;
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-discussion-btn:hover {
  background-color: #2a75e8;
}

/* New Discussion Form */
.new-discussion-form {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.new-discussion-form h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}

.form-group textarea {
  resize: vertical;
}

.submit-btn {
  background-color: #3a86ff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #2a75e8;
}

/* Forum Categories */
.forum-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.forum-categories button {
  background-color: #f0f0f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.forum-categories button:hover {
  background-color: #e0e0e0;
}

.forum-categories button.selected {
  background-color: #3a86ff;
  color: white;
}

.category-icon {
  margin-right: 0.5rem;
}

/* Discussion List */
.discussion-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.discussion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  transition: background-color 0.2s;
}

.discussion-item:hover {
  background-color: #f0f7ff;
}

.discussion-main {
  display: flex;
  align-items: center;
  flex: 1;
}

.category-badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.1rem;
}

.category-badge.general {
  background-color: #e6efff;
  color: #3a86ff;
}

.category-badge.tips {
  background-color: #e6fff0;
  color: #4caf50;
}

.category-badge.achievements {
  background-color: #fff6e6;
  color: #ff9800;
}

.category-badge.support {
  background-color: #f0e6ff;
  color: #9c27b0;
}

.discussion-content {
  flex: 1;
}

.discussion-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: #333;
}

.discussion-meta {
  font-size: 0.8rem;
  color: #777;
}

.discussion-author {
  margin-right: 0.75rem;
}

.discussion-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 100px;
}

.replies-count {
  margin-bottom: 0.25rem;
  text-align: center;
}

.replies-count .count {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.replies-count .label, .last-reply .label {
  font-size: 0.8rem;
  color: #777;
  margin-left: 0.25rem;
}

.last-reply {
  font-size: 0.8rem;
  color: #777;
  text-align: right;
}

.last-reply .time {
  font-weight: 600;
  margin-left: 0.25rem;
}

/* Side Content */
.side-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.featured-members, .upcoming-events {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.featured-members h3, .upcoming-events h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.2rem;
  color: #333;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-card {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.member-avatar {
  margin-right: 1rem;
}

.member-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.member-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.member-stats {
  display: flex;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #666;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-card {
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.event-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.event-date {
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
}

.event-description {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #666;
}

.event-participants {
  font-size: 0.85rem;
  color: #777;
}

.event-participants .icon {
  margin-right: 0.25rem;
}

@media (max-width: 991px) {
  .community-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 767px) {
  .discussion-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .discussion-stats {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
    min-width: auto;
  }
  
  .replies-count {
    margin-bottom: 0;
  }
  
  .event-header {
    flex-direction: column;
  }
  
  .event-date {
    margin-top: 0.25rem;
  }
}
</style>