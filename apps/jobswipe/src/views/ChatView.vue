<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const matchId = computed(() => Number(route.params.id))
const messageText = ref('')
const isLoading = ref(true)
const chatMessagesRef = ref(null)
const isTyping = ref(false)
const showEmojiPicker = ref(false)
const selectedFile = ref(null)
const filePreview = ref(null)
const showScheduler = ref(false)
const scheduledDate = ref('')
const scheduledTime = ref('')

// Mock data for the match details
const matchDetails = ref({
  id: 0,
  jobTitle: '',
  company: '',
  companyLogo: '/favicon.ico',
  location: '',
  matchDate: new Date().toISOString().split('T')[0],
  salary: '',
  status: 'offline'
})

// Mock data for messages
const messages = ref([])

// Emoji array
const emojis = ['😊', '👍', '🎉', '💼', '📊', '⭐', '🔥', '👏', '🤝', '💡', '💫', '✅']

// Quick replies
const quickReplies = [
  'Thanks for your message!',
  'When would be a good time to talk?',
  'Could you provide more details about the role?',
  'I\'m interested in this opportunity.',
  'Is remote work an option?'
]

// Sample interview time slots
const timeSlots = [
  { date: '2025-03-15', times: ['10:00 AM', '1:00 PM', '3:00 PM'] },
  { date: '2025-03-16', times: ['9:30 AM', '11:00 AM', '2:30 PM'] },
  { date: '2025-03-17', times: ['10:30 AM', '12:00 PM', '4:00 PM'] }
]

// Mock function to load match details and messages
const loadData = () => {
  isLoading.value = true
  
  // Simulate API call to get match details
  setTimeout(() => {
    try {
      // Mock match based on ID
      if (matchId.value === 1) {
        matchDetails.value = {
          id: 1,
          jobTitle: 'Frontend Developer',
          company: 'TechCorp',
          companyLogo: '/favicon.ico', // Use local favicon as fallback
          location: 'San Francisco, CA',
          matchDate: '2025-02-15',
          salary: '$100,000 - $130,000',
          status: 'online'
        }
        
        messages.value = [
          {
            id: 1,
            sender: 'company',
            text: 'Hi there! We were impressed with your profile and would like to schedule an interview for the Frontend Developer position.',
            timestamp: '2025-02-15T14:30:00Z',
            read: true
          }
        ]
      } else if (matchId.value === 2) {
        matchDetails.value = {
          id: 2,
          jobTitle: 'UX/UI Designer',
          company: 'CreativeWorks',
          companyLogo: '/favicon.ico', // Use local favicon as fallback
          location: 'Austin, TX',
          matchDate: '2025-02-10',
          salary: '$90,000 - $120,000',
          status: 'offline'
        }
        
        messages.value = [
          {
            id: 1,
            sender: 'company',
            text: 'Hello! We loved your portfolio and are interested in discussing the UX/UI Designer position with you.',
            timestamp: '2025-02-10T10:15:00Z',
            read: true
          },
          {
            id: 2,
            sender: 'user',
            text: 'Hi, thanks for reaching out! I\'d be happy to discuss the role. When would be a good time?',
            timestamp: '2025-02-10T11:30:00Z',
            read: true
          },
          {
            id: 3,
            sender: 'company',
            text: 'Thanks for your response. How does next Tuesday at 2 PM sound for a video call?',
            timestamp: '2025-02-11T09:45:00Z',
            read: true
          }
        ]
      } else if (matchId.value === 3) {
        matchDetails.value = {
          id: 3,
          jobTitle: 'Full Stack Developer',
          company: 'StartupInnovate',
          companyLogo: '/favicon.ico', // Use local favicon as fallback
          location: 'New York, NY',
          matchDate: '2025-02-05',
          salary: '$120,000 - $150,000',
          status: 'online'
        }
        
        messages.value = []
      } else if (matchId.value === 4) {
        matchDetails.value = {
          id: 4,
          jobTitle: 'Machine Learning Engineer',
          company: 'AI Innovations',
          companyLogo: '/favicon.ico', // Use local favicon as fallback
          location: 'Boston, MA',
          matchDate: '2025-02-18',
          salary: '$140,000 - $180,000',
          status: 'online'
        }
        
        messages.value = [
          {
            id: 1,
            sender: 'company',
            text: 'We would love to talk more about your experience with TensorFlow and PyTorch. Are you available for a technical discussion this week?',
            timestamp: '2025-02-19T10:15:00Z',
            read: false
          }
        ]
      } else {
        // If no match is found, redirect to matches page
        router.push('/matches')
        return
      }
      
      isLoading.value = false
      
      // Scroll to bottom of chat after loading
      nextTick(() => {
        scrollToBottom()
      })
    } catch (error) {
      console.error('Error loading chat data:', error)
      isLoading.value = false
      // Redirect on error
      router.push('/matches')
    }
  }, 1000)
}

const sendMessage = () => {
  if (!messageText.value.trim() && !filePreview.value) return
  
  // Add the new message to the list
  const newMessage = {
    id: messages.value.length + 1,
    sender: 'user',
    text: messageText.value.trim(),
    timestamp: new Date().toISOString(),
    read: false
  }
  
  // Add file attachment if present
  if (filePreview.value) {
    newMessage.attachment = {
      type: 'image',
      url: filePreview.value,
      name: selectedFile.value.name
    }
  }
  
  messages.value.push(newMessage)
  
  // Clear the input and file preview
  messageText.value = ''
  clearFileAttachment()
  
  // Auto-scroll to bottom after sending message
  nextTick(() => {
    scrollToBottom()
  })
  
  // Simulate company response and typing indicator
  if (messages.value.length > 0) {
    // Show typing indicator
    setTimeout(() => {
      isTyping.value = true
      scrollToBottom()
    }, 1000)
    
    // Send company response after delay
    const responseDelay = matchId.value === 3 ? 3000 : 4000 // Quicker first response
    setTimeout(() => {
      isTyping.value = false
      
      let responseText = ''
      
      // Different responses based on match
      if (matchId.value === 1) {
        responseText = 'Great! Would you prefer a video call or a phone interview? We have availability next week on Monday and Wednesday afternoon.'
      } else if (matchId.value === 2) {
        responseText = 'Sounds good. We\'re looking forward to discussing your design process and past projects. Do you have any questions about the role before our call?'
      } else if (matchId.value === 3) {
        responseText = 'Thank you for reaching out! We\'re excited to connect with you about the Full Stack Developer role. We really liked your experience with Node.js and React. Are you available for a technical interview next week?'
      }
      
      // Only add response if we have text
      if (responseText) {
        messages.value.push({
          id: messages.value.length + 1,
          sender: 'company',
          text: responseText,
          timestamp: new Date().toISOString(),
          read: false
        })
        
        // Scroll to new message
        nextTick(() => {
          scrollToBottom()
        })
      }
    }, responseDelay)
  }
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + 
         date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const goBackToMatches = () => {
  router.push('/matches')
}

const addEmoji = (emoji) => {
  messageText.value += emoji
  showEmojiPicker.value = false
  // Focus back on input after adding emoji
  document.getElementById('message-input').focus()
}

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const useQuickReply = (reply) => {
  messageText.value = reply
  // Focus on input after selecting quick reply
  document.getElementById('message-input').focus()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  selectedFile.value = file
  
  // Create preview for images
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      filePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    // For non-image files, just store the name
    filePreview.value = 'file' // Placeholder for non-image files
  }
}

const clearFileAttachment = () => {
  selectedFile.value = null
  filePreview.value = null
  // Reset file input
  const fileInput = document.getElementById('file-upload')
  if (fileInput) fileInput.value = ''
}

const scheduleInterview = () => {
  if (!scheduledDate.value || !scheduledTime.value) return
  
  // Format date and time for message
  const formattedDate = new Date(scheduledDate.value).toLocaleDateString([], {
    weekday: 'long',
    month: 'long', 
    day: 'numeric'
  })
  
  const confirmationMessage = `I'd like to schedule an interview on ${formattedDate} at ${scheduledTime.value}.`
  
  // Set as message text and close scheduler
  messageText.value = confirmationMessage
  toggleScheduler()
  
  // Send the message
  sendMessage()
}

const toggleScheduler = () => {
  showScheduler.value = !showScheduler.value
}

const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// Watch messages and scroll to bottom when they change
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="chat-container">
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>Loading conversation...</p>
    </div>
    
    <template v-else>
      <div class="chat-header">
        <button 
          class="back-button" 
          @click="goBackToMatches"
          v-voix="'back-to-matches'"
          hint="Go back to matches list"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <div class="match-avatar">
          <img :src="matchDetails?.companyLogo || '/favicon.ico'" :alt="(matchDetails?.company || 'Company') + ' logo'">
          <span class="status-indicator" :class="matchDetails?.status || 'offline'"></span>
        </div>
        
        <div class="match-info">
          <h2>{{ matchDetails?.jobTitle || 'Job Position' }}</h2>
          <div class="match-details">
            <span>{{ matchDetails?.company || 'Company' }}</span>
            <span class="separator">•</span>
            <span>{{ matchDetails?.location || 'Location' }}</span>
          </div>
        </div>
        
        <div class="header-actions">
          <button class="action-button" title="View job details" v-voix="'view-job-details'" hint="View full job details">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="chat-body">
        <div class="job-summary">
          <div class="job-salary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
              <path d="M12 6v2"></path>
              <path d="M12 16v2"></path>
            </svg>
            <span>{{ matchDetails?.salary || 'Salary not specified' }}</span>
          </div>
          
          <div class="job-match-date">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="16" x2="16" y1="2" y2="6"></line>
              <line x1="8" x2="8" y1="2" y2="6"></line>
              <line x1="3" x2="21" y1="10" y2="10"></line>
            </svg>
            <span>Matched on {{ matchDetails?.matchDate ? new Date(matchDetails.matchDate).toLocaleDateString() : 'recent date' }}</span>
          </div>
        </div>
        
        <div ref="chatMessagesRef" class="chat-messages">
          <div v-if="messages.length === 0" class="no-messages">
            <div class="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>No messages yet</h3>
              <p>Start the conversation to connect with {{ matchDetails?.company || 'this company' }}</p>
            </div>
          </div>
          
          <div v-else class="message-list">
            <div class="chat-date-separator" v-if="messages.length > 0">
              <span>{{ new Date(messages[0].timestamp).toLocaleDateString([], { month: 'long', day: 'numeric' }) }}</span>
            </div>
            
            <div 
              v-for="(message, index) in messages" 
              :key="message.id" 
              class="message-container"
            >
              <!-- Date separator between messages from different days -->
              <div 
                v-if="index > 0 && new Date(message.timestamp).toDateString() !== new Date(messages[index-1].timestamp).toDateString()"
                class="chat-date-separator"
              >
                <span>{{ new Date(message.timestamp).toLocaleDateString([], { month: 'long', day: 'numeric' }) }}</span>
              </div>
              
              <div 
                class="message" 
                :class="{ 
                  'user-message': message.sender === 'user', 
                  'company-message': message.sender === 'company' 
                }"
                v-voix="`message-${message.id}`"
                :hint="`Message from ${message.sender === 'user' ? 'you' : (matchDetails?.company || 'Company')} sent at ${formatDate(message.timestamp)}`"
              >
                <!-- Company avatar for company messages -->
                <div v-if="message.sender === 'company'" class="message-avatar">
                  <img :src="matchDetails?.companyLogo || '/favicon.ico'" :alt="(matchDetails?.company || 'Company') + ' logo'">
                </div>
                
                <div class="message-content">
                  <!-- Message text -->
                  <p v-if="message.text">{{ message.text }}</p>
                  
                  <!-- Attachment (if any) -->
                  <div v-if="message.attachment" class="message-attachment">
                    <img v-if="message.attachment.type === 'image'" :src="message.attachment.url" :alt="message.attachment.name" class="attachment-preview">
                    <div v-else class="file-attachment">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span>{{ message.attachment.name }}</span>
                    </div>
                  </div>
                  
                  <div class="message-footer">
                    <span class="message-time">{{ formatDate(message.timestamp) }}</span>
                    
                    <!-- Read status for user messages -->
                    <span v-if="message.sender === 'user'" class="message-status">
                      <svg v-if="message.read" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 7 17l-5-5"></path>
                        <path d="m22 10-7.5 7.5L13 16"></path>
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Typing indicator -->
            <div v-if="isTyping" class="typing-indicator">
              <div class="typing-avatar">
                <img :src="matchDetails?.companyLogo || '/favicon.ico'" :alt="(matchDetails?.company || 'Company') + ' logo'">
              </div>
              <div class="typing-bubble">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick replies section -->
      <div v-if="messages.length > 0" class="quick-replies">
        <div 
          v-for="(reply, index) in quickReplies" 
          :key="index" 
          class="quick-reply" 
          @click="useQuickReply(reply)"
          v-voix="`quick-reply-${index+1}`"
          :hint="`Use quick reply: ${reply}`"
        >
          {{ reply }}
        </div>
      </div>
      
      <!-- Interview scheduler -->
      <div v-if="showScheduler" class="interview-scheduler">
        <div class="scheduler-header">
          <h3>Schedule Interview</h3>
          <button @click="toggleScheduler" class="close-button" v-voix="'close-scheduler'" hint="Close interview scheduler">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="scheduler-body">
          <div class="scheduler-field">
            <label for="interview-date" v-voix="'interview-date-label'">Select Date</label>
            <select 
              id="interview-date" 
              v-model="scheduledDate"
              v-voix="'interview-date-select'"
              hint="Select an interview date"
            >
              <option value="">Choose a date</option>
              <option v-for="slot in timeSlots" :key="slot.date" :value="slot.date">
                {{ new Date(slot.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) }}
              </option>
            </select>
          </div>
          
          <div class="scheduler-field">
            <label for="interview-time" v-voix="'interview-time-label'">Select Time</label>
            <select 
              id="interview-time" 
              v-model="scheduledTime"
              :disabled="!scheduledDate"
              v-voix="'interview-time-select'"
              hint="Select an interview time"
            >
              <option value="">Choose a time</option>
              <option 
                v-for="time in scheduledDate ? timeSlots.find(slot => slot.date === scheduledDate).times : []" 
                :key="time" 
                :value="time"
              >
                {{ time }}
              </option>
            </select>
          </div>
          
          <button 
            class="schedule-button" 
            @click="scheduleInterview" 
            :disabled="!scheduledDate || !scheduledTime"
            v-voix="'confirm-schedule-button'"
            hint="Confirm interview schedule"
          >
            Confirm Schedule
          </button>
        </div>
      </div>
      
      <!-- Message input area -->
      <div class="chat-input">
        <!-- File attachment preview -->
        <div v-if="filePreview" class="file-preview">
          <img v-if="selectedFile.type.startsWith('image/')" :src="filePreview" alt="Attachment preview" class="image-preview">
          <div v-else class="file-name">{{ selectedFile.name }}</div>
          <button @click="clearFileAttachment" class="remove-file" v-voix="'remove-attachment'" hint="Remove file attachment">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Message input form -->
        <form @submit.prevent="sendMessage" class="message-form">
          <div class="input-actions">
            <!-- File upload button -->
            <label class="file-button" v-voix="'file-upload-button'" hint="Upload a file">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
              <input 
                type="file" 
                id="file-upload" 
                class="hidden-file-input" 
                @change="handleFileUpload" 
                accept="image/*,.pdf,.doc,.docx"
                v-voix="'file-input'"
                hint="Upload image or document"
              >
            </label>
            
            <!-- Emoji picker button -->
            <button 
              type="button" 
              class="emoji-button" 
              @click="toggleEmojiPicker"
              v-voix="'emoji-button'"
              hint="Open emoji picker"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" x2="9.01" y1="9" y2="9"></line>
                <line x1="15" x2="15.01" y1="9" y2="9"></line>
              </svg>
            </button>
            
            <!-- Calendar/scheduling button -->
            <button 
              type="button" 
              class="schedule-interview-button" 
              @click="toggleScheduler"
              v-voix="'schedule-interview-button'"
              hint="Schedule an interview"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
            </button>
          </div>
          
          <div class="message-input-wrapper">
            <input 
              id="message-input"
              type="text" 
              v-model="messageText" 
              placeholder="Type your message..." 
              v-voix="'message-input'"
              hint="Type your message here and press enter to send"
            />
            
            <button 
              type="submit" 
              class="send-button" 
              :disabled="!messageText.trim() && !filePreview"
              v-voix="'send-button'"
              hint="Send your message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z"></path>
                <path d="M22 2 11 13"></path>
              </svg>
            </button>
          </div>
        </form>
        
        <!-- Emoji picker -->
        <div v-if="showEmojiPicker" class="emoji-picker">
          <div 
            v-for="emoji in emojis" 
            :key="emoji" 
            class="emoji" 
            @click="addEmoji(emoji)"
            v-voix="`emoji-${emoji}`"
            :hint="`Add emoji ${emoji}`"
          >
            {{ emoji }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px);
  min-height: 500px;
  background-color: #f7f9fc;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Loading state */
.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 1rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 87, 87, 0.3);
  border-radius: 50%;
  border-top-color: #ff5757;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Chat header */
.chat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #eaecf2;
  z-index: 10;
}

.back-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background-color: #f1f3f9;
  color: #ff5757;
}

.match-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.match-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online {
  background-color: #4caf50;
}

.status-indicator.offline {
  background-color: #9e9e9e;
}

.match-info {
  flex: 1;
}

.match-info h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.match-details {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.separator {
  margin: 0 0.5rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  background-color: #f1f3f9;
  color: #ff5757;
}

/* Job summary */
.chat-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.job-summary {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1.5rem;
  background-color: #f0f2f8;
  border-bottom: 1px solid #eaecf2;
  font-size: 0.9rem;
  color: #666;
}

.job-salary, .job-match-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Chat messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.no-messages {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #888;
  max-width: 300px;
}

.empty-state svg {
  color: #ddd;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-date-separator {
  text-align: center;
  margin: 1rem 0;
  position: relative;
}

.chat-date-separator:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background-color: #eaecf2;
  z-index: 1;
}

.chat-date-separator span {
  background-color: #f7f9fc;
  padding: 0 1rem;
  font-size: 0.8rem;
  color: #999;
  position: relative;
  z-index: 2;
}

.message-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  max-width: 75%;
  position: relative;
  gap: 0.5rem;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  align-self: flex-start;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  background-color: white;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
}

.message-content p {
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
  white-space: pre-wrap;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #999;
}

.message-time {
  margin-right: 0.5rem;
}

.message-status {
  display: flex;
  align-items: center;
}

.message-status svg {
  color: #4caf50;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.user-message .message-content {
  background-color: #ff5757;
  color: white;
}

.user-message .message-footer {
  color: rgba(255, 255, 255, 0.7);
}

.user-message .message-status svg {
  color: white;
}

.company-message {
  align-self: flex-start;
}

/* Message attachments */
.message-attachment {
  margin-bottom: 0.8rem;
  max-width: 200px;
}

.attachment-preview {
  max-width: 100%;
  border-radius: 8px;
  cursor: pointer;
}

.file-attachment {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f1f3f9;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.user-message .file-attachment {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.typing-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
}

.typing-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.typing-bubble {
  background-color: #f0f2f8;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-bubble span {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #aaa;
  animation: typing 1.4s infinite;
}

.typing-bubble span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-bubble span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* Quick replies */
.quick-replies {
  display: flex;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  overflow-x: auto;
  background-color: #f7f9fc;
  border-top: 1px solid #eaecf2;
}

.quick-reply {
  background-color: white;
  border: 1px solid #e0e4ed;
  border-radius: 30px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-reply:hover {
  background-color: #f0f2f8;
  border-color: #c0c4d0;
}

/* Interview scheduler */
.interview-scheduler {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
}

.scheduler-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f0f2f8;
  border-bottom: 1px solid #eaecf2;
}

.scheduler-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scheduler-body {
  padding: 1rem;
}

.scheduler-field {
  margin-bottom: 1rem;
}

.scheduler-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.scheduler-field select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em;
}

.scheduler-field select:focus {
  outline: none;
  border-color: #ff5757;
}

.schedule-button {
  width: 100%;
  background-color: #ff5757;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.schedule-button:hover:not(:disabled) {
  background-color: #ff4343;
}

.schedule-button:disabled {
  background-color: #ffadad;
  cursor: not-allowed;
}

/* Chat input */
.chat-input {
  position: relative;
  padding: 1rem 1.5rem;
  background-color: white;
  border-top: 1px solid #eaecf2;
}

.file-preview {
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

.image-preview {
  max-width: 150px;
  max-height: 100px;
  border-radius: 8px;
  border: 1px solid #eaecf2;
}

.file-name {
  background-color: #f0f2f8;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.remove-file {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background-color: #ff5757;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-actions {
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
}

.file-button, .emoji-button, .schedule-interview-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.file-button:hover, .emoji-button:hover, .schedule-interview-button:hover {
  background-color: #f1f3f9;
  color: #ff5757;
}

.hidden-file-input {
  display: none;
}

.message-input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chat-input input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 1px solid #e0e4ed;
  border-radius: 30px;
  font-size: 1rem;
  background-color: #f7f9fc;
  transition: all 0.2s;
}

.chat-input input:focus {
  outline: none;
  border-color: #c0c4d0;
  background-color: white;
}

.send-button {
  background-color: #ff5757;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover:not(:disabled) {
  background-color: #ff4343;
}

.send-button:disabled {
  background-color: #ffadad;
  cursor: not-allowed;
}

/* Emoji picker */
.emoji-picker {
  position: absolute;
  bottom: 90px;
  left: 45px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  padding: 0.8rem;
  z-index: 10;
}

.emoji {
  font-size: 1.5rem;
  cursor: pointer;
  text-align: center;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.emoji:hover {
  background-color: #f0f2f8;
}

/* Responsive styles */
@media (max-width: 768px) {
  .chat-container {
    height: calc(100vh - 120px);
    border-radius: 0;
    max-width: none;
  }
  
  .message {
    max-width: 85%;
  }
  
  .emoji-picker {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>