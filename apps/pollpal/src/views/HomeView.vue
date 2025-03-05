<script setup>
import { onMounted, ref } from 'vue'
import { getFeaturedPoll, polls, startLiveUpdates } from '@/store/polls'
import PollCard from '@/components/PollCard.vue'

const featuredPoll = ref(null)
const recentPolls = ref([])

onMounted(() => {
  // Get the featured poll
  featuredPoll.value = getFeaturedPoll()
  
  // Get recent polls excluding the featured one
  recentPolls.value = polls.filter(poll => poll.id !== featuredPoll.value.id).slice(0, 3)
  
  // Start simulated live updates for the featured poll
  const stopLiveUpdates = startLiveUpdates(featuredPoll.value.id)
  
  // Clean up the interval when the component is unmounted
  return () => {
    stopLiveUpdates()
  }
})
</script>

<template>
  <main>
    <section class="hero-section" v-voix="'hero-section'">
      <div class="container">
        <div class="hero-content">
          <h1 class="app-title" v-voix="'app-title'">PollPal</h1>
          <p class="app-description" v-voix="'app-description'">
            A lightweight, interactive polling web app.
            Create, share, and participate in polls on any topic.
          </p>
        </div>
      </div>
    </section>
    
    <section class="featured-poll-section" v-voix="'featured-poll-section'">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title" v-voix="'featured-poll-title'">Poll of the Day</h2>
          <p class="section-subtitle" v-voix="'featured-poll-subtitle'">
            Cast your vote on today's featured question
          </p>
        </div>
        
        <div v-if="featuredPoll" class="featured-poll">
          <PollCard :poll="featuredPoll" />
        </div>
      </div>
    </section>
    
    <section class="recent-polls-section" v-voix="'recent-polls-section'">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title" v-voix="'recent-polls-title'">Recent Polls</h2>
          <p class="section-subtitle" v-voix="'recent-polls-subtitle'">
            Check out other active polls
          </p>
        </div>
        
        <div class="polls-grid">
          <div v-for="poll in recentPolls" :key="poll.id" class="poll-item">
            <PollCard :poll="poll" />
          </div>
        </div>
        
        <div class="cta-container">
          <router-link to="/create" class="create-poll-btn" v-voix="'create-poll-button'">
            Create Your Own Poll
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section {
  background: linear-gradient(135deg, #0084ff, #0066cc);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.app-title {
  font-size: 2.8rem;
  margin-bottom: 16px;
}

.app-description {
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.5;
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 8px;
}

.section-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.featured-poll-section {
  padding: 60px 0;
}

.featured-poll {
  max-width: 700px;
  margin: 0 auto;
}

.recent-polls-section {
  padding: 60px 0;
  background-color: #f0f2f5;
}

.polls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.cta-container {
  text-align: center;
  margin-top: 20px;
}

.create-poll-btn {
  display: inline-block;
  background-color: #0084ff;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.create-poll-btn:hover {
  background-color: #0066cc;
}

@media (max-width: 768px) {
  .polls-grid {
    grid-template-columns: 1fr;
  }
  
  .app-title {
    font-size: 2.2rem;
  }
  
  .hero-section {
    padding: 40px 0;
  }
}
</style>
