<script setup>
import { ref } from 'vue'
import { addComment } from '@/store/polls'

const props = defineProps({
  pollId: {
    type: Number,
    required: true
  },
  comments: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['comment-added'])
const newComment = ref('')
const username = ref('Anonymous')

const submitComment = () => {
  if (newComment.value.trim()) {
    const comment = addComment(props.pollId, {
      author: username.value.trim() || 'Anonymous',
      text: newComment.value.trim()
    })
    
    if (comment) {
      emit('comment-added', comment)
      newComment.value = ''
    }
  }
}
</script>

<template>
  <div class="comments-section">
    <h3 class="section-title" v-voix="'comments-title'">Comments</h3>
    
    <div class="comments-list">
      <div v-if="comments.length === 0" class="no-comments" v-voix="'no-comments'">
        No comments yet. Be the first to comment!
      </div>
      
      <div 
        v-for="comment in comments" 
        :key="comment.id" 
        class="comment"
        v-voix="'comment-' + comment.id"
      >
        <div class="comment-header">
          <span class="comment-author">{{ comment.author }}</span>
          <span class="comment-time">{{ comment.timestamp }}</span>
        </div>
        <p class="comment-text">{{ comment.text }}</p>
      </div>
    </div>
    
    <div class="comment-form">
      <div class="form-group">
        <input
          type="text"
          v-model="username"
          placeholder="Your name (optional)"
          class="form-input name-input"
          v-voix="'username-input'"
          hint="Enter your name, or leave as Anonymous"
        />
      </div>
      
      <div class="form-group">
        <textarea
          v-model="newComment"
          placeholder="Share your thoughts..."
          class="form-input comment-input"
          v-voix="'new-comment-input'"
          hint="Type your comment here"
        ></textarea>
      </div>
      
      <button 
        class="submit-btn" 
        @click="submitComment"
        :disabled="!newComment.trim()"
        v-voix="'submit-comment-button'"
      >
        Post Comment
      </button>
    </div>
  </div>
</template>

<style scoped>
.comments-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #333;
}

.comments-list {
  margin-bottom: 20px;
}

.no-comments {
  color: #888;
  font-style: italic;
  margin-bottom: 15px;
}

.comment {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 12px 15px;
  margin-bottom: 12px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.comment-author {
  font-weight: 600;
  color: #333;
}

.comment-time {
  font-size: 0.8rem;
  color: #888;
}

.comment-text {
  margin: 0;
  color: #444;
  line-height: 1.4;
}

.comment-form {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
}

.form-group {
  margin-bottom: 12px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.95rem;
}

.name-input {
  margin-bottom: 10px;
}

.comment-input {
  min-height: 80px;
  resize: vertical;
}

.submit-btn {
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #0066cc;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>