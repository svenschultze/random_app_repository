import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { communityPosts } from '@/data/community';

export const useCommunityStore = defineStore('community', () => {
  const posts = ref(communityPosts);
  const activeFilter = ref('all');
  
  const filteredPosts = computed(() => {
    if (activeFilter.value === 'all') {
      return posts.value;
    }
    return posts.value.filter(post => post.type === activeFilter.value);
  });
  
  const expertPosts = computed(() => 
    posts.value.filter(post => post.type === 'expert')
  );
  
  const successPosts = computed(() => 
    posts.value.filter(post => post.type === 'success')
  );
  
  function setFilter(filter) {
    activeFilter.value = filter;
  }
  
  function likePost(postId) {
    const post = posts.value.find(p => p.id === postId);
    if (post) {
      post.likes++;
    }
  }
  
  return {
    posts,
    activeFilter,
    filteredPosts,
    expertPosts,
    successPosts,
    setFilter,
    likePost
  };
});