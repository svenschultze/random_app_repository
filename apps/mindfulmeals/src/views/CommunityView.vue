<script setup>
import { useCommunityStore } from '@/stores/communityStore';
import { computed, ref } from 'vue';
import CommunityPost from '@/components/CommunityPost.vue';

const communityStore = useCommunityStore();
const posts = computed(() => communityStore.filteredPosts);
const activeFilter = ref('all');

function filterPosts(filter) {
  activeFilter.value = filter;
  communityStore.setFilter(filter);
}
</script>

<template>
  <div class="community-view">
    <header class="mb-4">
      <h1 class="page-title" v-voix="'Community'">Community</h1>
      <p class="lead" v-voix="'Expert tips and success stories from fellow mindful eaters'">
        Expert tips and success stories from fellow mindful eaters
      </p>
      
      <div class="filter-section mb-4" v-voix="'Filter posts section'">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div class="filter-label">
            <strong>Filter Posts:</strong>
          </div>
          <div class="btn-group">
            <button 
              class="btn" 
              :class="activeFilter === 'all' ? 'btn-primary' : 'btn-outline-secondary'"
              @click="filterPosts('all')"
              v-voix="'All posts filter button'"
              hint="Show all community posts"
            >
              All Posts
            </button>
            <button 
              class="btn" 
              :class="activeFilter === 'expert' ? 'btn-primary' : 'btn-outline-secondary'"
              @click="filterPosts('expert')"
              v-voix="'Expert tips filter button'"
              hint="Show only expert tips"
            >
              Expert Tips
            </button>
            <button 
              class="btn" 
              :class="activeFilter === 'success' ? 'btn-primary' : 'btn-outline-secondary'"
              @click="filterPosts('success')"
              v-voix="'Success stories filter button'"
              hint="Show only success stories"
            >
              Success Stories
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <section class="posts-section" v-voix="'Community posts section'">
      <div v-if="posts.length > 0">
        <CommunityPost 
          v-for="post in posts" 
          :key="post.id" 
          :post="post" 
        />
      </div>
      
      <div v-else class="no-posts text-center py-5" v-voix="'No posts match your filter'">
        <div class="alert alert-light">
          <i class="bi bi-exclamation-circle fs-4 d-block mb-3"></i>
          <h3 class="h5">No Posts Found</h3>
          <p class="text-muted">There are no posts that match your current filter. Try selecting a different filter option.</p>
          <button 
            class="btn btn-outline-primary"
            @click="filterPosts('all')"
            v-voix="'Show all posts button'"
            hint="Reset filter to show all posts"
          >
            Show All Posts
          </button>
        </div>
      </div>
    </section>
    
    <section class="engagement-section mt-5" v-voix="'Join the conversation section'">
      <div class="card">
        <div class="card-body text-center py-4">
          <h2 class="mb-3 h4">Join the Conversation</h2>
          <p class="mb-4">
            Share your own mindful eating journey, ask questions, and connect with others 
            who are on the same path to healthier eating habits.
          </p>
          <button 
            class="btn btn-success"
            v-voix="'Share your story button'"
            hint="Share your own mindful eating experience with the community"
          >
            <i class="bi bi-pencil-square me-2"></i> Share Your Story
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-title {
  color: #2c3e50;
  font-weight: 700;
}

.lead {
  color: #555;
}

.filter-section {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.filter-label {
  color: #495057;
}

.filter-section .btn-group {
  flex-wrap: wrap;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

.no-posts .alert {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.engagement-section .card {
  background-color: #f8f9fa;
  border-left: 4px solid #4a854a;
}

@media (max-width: 576px) {
  .filter-section .btn-group {
    margin-top: 0.5rem;
    width: 100%;
  }
  
  .filter-section .btn {
    flex: 1;
  }
}
</style>