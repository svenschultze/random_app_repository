<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPollById, startLiveUpdates } from '@/store/polls'
import PollCard from '@/components/PollCard.vue'
import CommentsSection from '@/components/CommentsSection.vue'

const route = useRoute()
const router = useRouter()
const poll = ref(null)
const stopLiveUpdatesRef = ref(null)

onMounted(() => {
  const pollId = parseInt(route.params.id)
  poll.value = getPollById(pollId)
  
  if (!poll.value) {
    // Poll not found, redirect to home
    router.push('/')
    return
  }
  
  // Start simulated live updates
  stopLiveUpdatesRef.value = startLiveUpdates(pollId, (updatedPoll) => {
    // This callback will be called when the poll data is updated
    poll.value = { ...updatedPoll }
  })
})

onBeforeUnmount(() => {
  // Clean up the interval when the component is unmounted
  if (stopLiveUpdatesRef.value) {
    stopLiveUpdatesRef.value()
  }
})

// Generate a sharable link for the poll
const sharableLink = ref(window.location.href)

// Copy sharable link to clipboard
const copyLink = () => {
  navigator.clipboard.writeText(sharableLink.value)
    .then(() => {
      alert('Link copied to clipboard!')
    })
    .catch((err) => {
      console.error('Could not copy link: ', err)
    })
}
</script>

<template>
  <main class="poll-detail-page" v-if="poll" v-voix="'poll-detail-page'">
    <div class="container">
      <div class="back-link">
        <router-link to="/" v-voix="'back-to-home'">
          &larr; Back to Home
        </router-link>
      </div>
      
      <section class="poll-section" v-voix="'poll-section'">
        <PollCard 
          :poll="poll" 
          :showResult="true" 
        />
        
        <div class="share-container">
          <div class="share-label" v-voix="'share-label'">Share this poll:</div>
          <div class="share-link-container">
            <input 
              type="text" 
              readonly 
              :value="sharableLink" 
              class="share-link-input"
              v-voix="'sharable-link-input'"
              hint="Link to share this poll with others"
            />
            <button 
              class="copy-btn" 
              @click="copyLink"
              v-voix="'copy-link-button'"
            >
              Copy
            </button>
          </div>
        </div>
      </section>
      
      <section class="comments-container" v-voix="'comments-container'">
        <CommentsSection 
          :pollId="poll.id" 
          :comments="poll.comments" 
        />
      </section>
    </div>
  </main>
  <main v-else class="not-found" v-voix="'poll-not-found'">
    <div class="container">
      <div class="not-found-content">
        <h2>Poll Not Found</h2>
        <p>The poll you're looking for doesn't exist or has been removed.</p>
        <router-link to="/" class="back-btn" v-voix="'back-to-home-from-not-found'">
          Back to Home
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>
.poll-detail-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.back-link {
  margin-bottom: 20px;
}

.back-link a {
  color: #555;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link a:hover {
  color: #0084ff;
}

.poll-section {
  margin-bottom: 30px;
}

.share-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.share-label {
  font-weight: 600;
  margin-bottom: 10px;
}

.share-link-container {
  display: flex;
  gap: 10px;
}

.share-link-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  background-color: #f9f9f9;
  cursor: text;
}

.copy-btn {
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.copy-btn:hover {
  background-color: #0066cc;
}

.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.not-found-content {
  text-align: center;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.not-found-content h2 {
  font-size: 1.8rem;
  margin-bottom: 12px;
  color: #333;
}

.not-found-content p {
  color: #666;
  margin-bottom: 20px;
}

.back-btn {
  display: inline-block;
  background-color: #0084ff;
  color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #0066cc;
}
</style>