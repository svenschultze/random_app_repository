<script setup>
import { useCommunityStore } from '@/stores/communityStore';

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const communityStore = useCommunityStore();

function likePost() {
  communityStore.likePost(props.post.id);
}
</script>

<template>
  <div class="post-card card mb-4" v-voix="'Community post by ' + post.author">
    <div class="post-card-body card-body">
      <div class="row">
        <div class="col-md-4 mb-3 mb-md-0">
          <img :src="post.image" :alt="post.title" class="post-image rounded" v-voix="'Post image'" />
          
          <div class="post-meta mt-2">
            <div class="post-author" v-voix="'Posted by ' + post.author">
              <i class="bi bi-person-circle me-1"></i> {{ post.author }}
            </div>
            <div class="post-date text-muted" v-voix="'Posted ' + post.date">
              <i class="bi bi-calendar3 me-1"></i> {{ post.date }}
            </div>
          </div>
          
          <div class="post-badge mt-2">
            <span 
              class="badge" 
              :class="post.type === 'expert' ? 'bg-primary' : 'bg-success'"
              v-voix="post.type + ' post'"
            >
              {{ post.type === 'expert' ? 'Expert Tip' : 'Success Story' }}
            </span>
          </div>
        </div>
        
        <div class="col-md-8">
          <h5 class="post-title card-title" v-voix="post.title">{{ post.title }}</h5>
          <p class="post-content card-text" v-voix="post.content">{{ post.content }}</p>
          
          <div class="post-actions d-flex align-items-center mt-3">
            <button 
              class="btn btn-sm btn-outline-primary me-3" 
              @click="likePost"
              v-voix="'Like post, current likes: ' + post.likes"
              hint="Show appreciation for this post"
            >
              <i class="bi bi-heart me-1"></i> Like ({{ post.likes }})
            </button>
            
            <div class="d-flex align-items-center me-3" v-voix="post.comments + ' comments'">
              <i class="bi bi-chat-dots me-1"></i>
              <span>{{ post.comments }} comments</span>
            </div>
            
            <button 
              class="btn btn-sm btn-link p-0" 
              v-voix="'Share post'"
              hint="Share this post with others"
            >
              <i class="bi bi-share me-1"></i> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: none;
  overflow: hidden;
}

.post-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.post-card-body {
  padding: 1.5rem;
}

.post-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 5px;
}

.post-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.post-content {
  color: #555;
  line-height: 1.6;
}

.post-meta {
  font-size: 0.85rem;
}

.post-author {
  font-weight: 500;
}

.post-date {
  font-size: 0.8rem;
}

.post-actions {
  border-top: 1px solid #eee;
  padding-top: 0.75rem;
  font-size: 0.85rem;
}

.btn-link {
  color: #6c757d;
  text-decoration: none;
}

.btn-link:hover {
  color: #4a854a;
}
</style>