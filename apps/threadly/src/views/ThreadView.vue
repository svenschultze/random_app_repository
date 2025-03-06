<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from '../components/AppLayout.vue';
import ThreadItem from '../components/ThreadItem.vue';
import ComposeInput from '../components/ComposeInput.vue';
import store from '../store';
import { getThreadWithReplies } from '../services/mockData';

const route = useRoute();
const router = useRouter();

const threadId = computed(() => route.params.id);
const showReplyBox = ref(route.query.reply === 'true');

const threadWithReplies = computed(() => {
  return getThreadWithReplies(store.state.mockData.threads, threadId.value);
});

const isLoading = computed(() => store.state.isRefreshing);

function goBack() {
  router.go(-1);
}

function handleReply() {
  showReplyBox.value = true;
}

function handleReplySubmit(reply) {
  showReplyBox.value = false;
  // Clear reply query param from URL
  if (route.query.reply) {
    router.replace({ query: {} });
  }
}

function handleReplyCancel() {
  showReplyBox.value = false;
  // Clear reply query param from URL
  if (route.query.reply) {
    router.replace({ query: {} });
  }
}
</script>

<template>
  <AppLayout>
    <div class="thread-view">
      <div class="thread-view__header">
        <button 
          class="thread-view__back-btn" 
          @click="goBack"
          v-voix="'Go back'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 v-voix="'Thread details'">Thread</h1>
      </div>
      
      <div v-if="isLoading" class="thread-view__loading">
        <div class="thread-view__loading-spinner"></div>
        <p>Loading thread...</p>
      </div>
      
      <div v-else-if="!threadWithReplies" class="thread-view__not-found">
        <p>Thread not found</p>
        <button 
          class="thread-view__back-to-home" 
          @click="router.push({ name: 'home' })"
          v-voix="'Back to home'"
        >
          Back to Home
        </button>
      </div>
      
      <div v-else class="thread-view__content">
        <div class="thread-view__main-thread">
          <ThreadItem :thread="threadWithReplies" />
          
          <div class="thread-view__actions">
            <button 
              v-if="!showReplyBox" 
              class="thread-view__reply-btn" 
              @click="handleReply"
              v-voix="'Reply to this thread'"
            >
              Reply to this thread
            </button>
          </div>
          
          <div v-if="showReplyBox" class="thread-view__reply-box">
            <ComposeInput 
              :parent-id="threadId" 
              placeholder="Write your reply..." 
              @submit="handleReplySubmit"
              @cancel="handleReplyCancel"
              auto-focus
            />
          </div>
        </div>
        
        <div v-if="threadWithReplies.replies && threadWithReplies.replies.length > 0" class="thread-view__replies-header">
          <h2 v-voix="'Replies'">Replies</h2>
        </div>
        
        <div class="thread-view__replies">
          <template v-for="reply in threadWithReplies.replies" :key="reply.id">
            <div class="thread-view__reply">
              <ThreadItem :thread="reply" :compact="true" />
              
              <div v-if="reply.replies && reply.replies.length > 0" class="thread-view__nested-replies">
                <template v-for="nestedReply in reply.replies" :key="nestedReply.id">
                  <div class="thread-view__reply">
                    <ThreadItem :thread="nestedReply" :compact="true" />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.thread-view {
  width: 100%;
}

.thread-view__header {
  position: sticky;
  top: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  z-index: 10;
  display: flex;
  align-items: center;
}

.thread-view__back-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--color-text);
  transition: background-color 0.2s;
}

.thread-view__back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.thread-view__header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.thread-view__loading,
.thread-view__not-found {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

.thread-view__loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(29, 161, 242, 0.2);
  border-radius: 50%;
  border-top-color: #1da1f2;
  margin: 0 auto 1rem;
  animation: spinner 1s linear infinite;
}

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.thread-view__back-to-home {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #1da1f2;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
}

.thread-view__main-thread {
  border-bottom: 1px solid var(--color-border);
}

.thread-view__actions {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.thread-view__reply-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #1da1f2;
  border: 1px solid #1da1f2;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.thread-view__reply-btn:hover {
  background-color: rgba(29, 161, 242, 0.1);
}

.thread-view__replies-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.thread-view__replies-header h2 {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0;
}

.thread-view__nested-replies {
  margin-left: 2rem;
  border-left: 2px solid var(--color-border);
}

/* For dark mode */
:root[data-theme="dark"] .thread-view__header {
  background-color: rgba(21, 32, 43, 0.9);
}

:root[data-theme="dark"] .thread-view__back-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>