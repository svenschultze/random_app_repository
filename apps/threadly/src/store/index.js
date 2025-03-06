import { reactive, readonly } from 'vue';
import { generateMockData } from '../services/mockData';

// Initial state with mock data
const state = reactive({
  mockData: generateMockData(),
  theme: 'light',
  isRefreshing: false,
  composeText: '',
});

// Get a new set of mock data
const refreshMockData = () => {
  state.isRefreshing = true;
  
  // Simulate a small delay to make it feel like data is loading
  setTimeout(() => {
    state.mockData = generateMockData();
    state.isRefreshing = false;
  }, 300);
};

// Add a new thread to the mock data
const addThread = (content) => {
  if (!content.trim()) return false;
  
  const newThread = {
    id: crypto.randomUUID(),
    userId: state.mockData.currentUser.id,
    parentId: null,
    content,
    hasMedia: false,
    mediaUrl: null,
    timestamp: new Date().toISOString(),
    likes: 0,
    replyCount: 0,
    isLiked: false
  };
  
  // Add to the beginning of the threads array
  state.mockData.threads.unshift(newThread);
  
  return newThread;
};

// Add a reply to a thread
const addReply = (threadId, content) => {
  if (!content.trim()) return false;
  
  const newReply = {
    id: crypto.randomUUID(),
    userId: state.mockData.currentUser.id,
    parentId: threadId,
    content,
    hasMedia: false,
    mediaUrl: null,
    timestamp: new Date().toISOString(),
    likes: 0,
    replyCount: 0,
    isLiked: false
  };
  
  // Add to the threads array
  state.mockData.threads.unshift(newReply);
  
  // Update the reply count of the parent thread
  const parentThread = state.mockData.threads.find(t => t.id === threadId);
  if (parentThread) {
    parentThread.replyCount += 1;
  }
  
  return newReply;
};

// Toggle like on a thread
const toggleLike = (threadId) => {
  const thread = state.mockData.threads.find(t => t.id === threadId);
  if (!thread) return;
  
  thread.isLiked = !thread.isLiked;
  thread.likes += thread.isLiked ? 1 : -1;
};

// Toggle theme between light and dark
const toggleTheme = () => {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
};

// Toggle follow status for a user
const toggleFollow = (userId) => {
  const user = state.mockData.users.find(u => u.id === userId);
  if (!user) return;
  
  // Check if we're already following
  const isFollowing = user.isFollowedByCurrentUser;
  
  user.isFollowedByCurrentUser = !isFollowing;
  user.followers += isFollowing ? -1 : 1;
};

// Clear compose text
const clearComposeText = () => {
  state.composeText = '';
};

// Set compose text
const setComposeText = (text) => {
  state.composeText = text;
};

// Mark all notifications as read
const markAllNotificationsAsRead = () => {
  state.mockData.notifications.forEach(n => {
    n.isRead = true;
  });
};

// Create the store object with state and actions
const store = {
  state: readonly(state),
  refreshMockData,
  addThread,
  addReply,
  toggleLike,
  toggleTheme,
  toggleFollow,
  clearComposeText,
  setComposeText,
  markAllNotificationsAsRead
};

export default store;