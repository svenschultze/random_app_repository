// src/stores/emailStore.js
import { reactive, computed, watch } from 'vue'
import { generateEmailList, generateRandomEmail, formatEmailDate } from '@/utils/emailGenerator'
import {
  STORAGE_KEYS,
  saveToStorage,
  loadFromStorage,
  isAppInitialized,
  markAppAsInitialized
} from '@/utils/storageUtils'

// Create a singleton instance pattern
let storeInstance = null;

export function useEmailStore() {
  // Return existing instance if already created (singleton pattern)
  if (storeInstance) {
    return storeInstance;
  }

  // Load stored email data or use empty defaults
  const storedEmailGroups = loadFromStorage(STORAGE_KEYS.INBOX_EMAILS, {
    today: [],
    yesterday: [],
    earlier: []
  });
  
  const storedSentEmails = loadFromStorage(STORAGE_KEYS.SENT_EMAILS, []);
  
  const storedAppState = loadFromStorage(STORAGE_KEYS.APP_STATE, {
    selectedEmailId: null,
    currentView: 'inbox',
    filters: {
      showUnread: false,
      showStarred: false,
      searchQuery: ''
    }
  });

  // Reactive state
  const state = reactive({
    emailGroups: storedEmailGroups,
    sentEmails: storedSentEmails,
    selectedEmailId: storedAppState.selectedEmailId,
    currentView: storedAppState.currentView,
    filters: storedAppState.filters
  });

  // Setup watchers for persisting data changes
  watch(() => state.emailGroups, (newVal) => {
    saveToStorage(STORAGE_KEYS.INBOX_EMAILS, newVal);
  }, { deep: true });

  watch(() => state.sentEmails, (newVal) => {
    saveToStorage(STORAGE_KEYS.SENT_EMAILS, newVal);
  }, { deep: true });

  watch(() => ({
    selectedEmailId: state.selectedEmailId,
    currentView: state.currentView,
    filters: state.filters
  }), (newVal) => {
    saveToStorage(STORAGE_KEYS.APP_STATE, newVal);
  }, { deep: true });

  // Initialize email data if this is the first time
  if (!isAppInitialized()) {
    // Generate initial random emails
    state.emailGroups = generateEmailList(30);
    
    // Generate some sent emails for demo purposes
    state.sentEmails = [];
    for (let i = 0; i < 10; i++) {
      const email = generateRandomEmail();
      // Modify to make it a sent email
      email.sender = { name: 'Me', email: 'me@example.com' };
      email.sent = true;
      email.read = true; // Sent emails are always read
      state.sentEmails.push(email);
    }
    
    // Sort sent emails by timestamp (newest first)
    state.sentEmails.sort((a, b) => b.timestamp - a.timestamp);
    
    // Mark the app as initialized so we don't regenerate on next load
    markAppAsInitialized();
  }

  // Computed properties
  const allEmails = computed(() => {
    return [
      ...state.emailGroups.today,
      ...state.emailGroups.yesterday,
      ...state.emailGroups.earlier
    ]
  })

  const filteredEmails = computed(() => {
    return allEmails.value.filter(email => {
      // Filter by unread status if showUnread is true
      if (state.filters.showUnread && email.read) {
        return false
      }

      // Filter by starred status if showStarred is true
      if (state.filters.showStarred && !email.starred) {
        return false
      }

      // Filter by search query
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase()
        return (
          email.subject.toLowerCase().includes(query) ||
          email.sender.name.toLowerCase().includes(query) ||
          email.body.toLowerCase().includes(query)
        )
      }

      return true
    })
  })

  // Actions
  function fetchEmails(preserveSentEmails = true) {
    // Generate random emails
    state.emailGroups = generateEmailList(30);
    
    // Handle sent emails:
    // If preserveSentEmails is true, don't replace user-created sent emails
    if (!preserveSentEmails) {
      // Generate new random sent emails
      state.sentEmails = [];
      
      // Add some random sent emails for demo purposes
      for (let i = 0; i < 10; i++) {
        const email = generateRandomEmail();
        // Modify to make it a sent email
        email.sender = { name: 'Me', email: 'me@example.com' };
        email.sent = true;
        email.read = true; // Sent emails are always read
        state.sentEmails.push(email);
      }
      
      // Sort sent emails by timestamp (newest first)
      state.sentEmails.sort((a, b) => b.timestamp - a.timestamp);
    }
  }
  
  function resetData() {
    // Reset data to initial state
    state.emailGroups = generateEmailList(30);
    
    state.sentEmails = [];
    for (let i = 0; i < 10; i++) {
      const email = generateRandomEmail();
      email.sender = { name: 'Me', email: 'me@example.com' };
      email.sent = true;
      email.read = true;
      state.sentEmails.push(email);
    }
    
    state.sentEmails.sort((a, b) => b.timestamp - a.timestamp);
    
    state.selectedEmailId = null;
    state.filters = {
      showUnread: false,
      showStarred: false,
      searchQuery: ''
    };
  }
  
  function setCurrentView(view) {
    if (['inbox', 'sent'].includes(view)) {
      state.currentView = view;
    }
  }

  function markAsRead(emailId) {
    const email = findEmailById(emailId)
    if (email) {
      email.read = true
    }
  }

  function markAsUnread(emailId) {
    const email = findEmailById(emailId)
    if (email) {
      email.read = false
    }
  }

  function toggleStarred(emailId) {
    const email = findEmailById(emailId)
    if (email) {
      email.starred = !email.starred
    }
  }

  function deleteEmail(emailId) {
    // Check each inbox group to find and remove the email
    for (const timeGroup in state.emailGroups) {
      const index = state.emailGroups[timeGroup].findIndex(e => e.id === emailId)
      if (index !== -1) {
        state.emailGroups[timeGroup].splice(index, 1)
        if (state.selectedEmailId === emailId) {
          state.selectedEmailId = null
        }
        return
      }
    }
    
    // Check sent emails
    const sentIndex = state.sentEmails.findIndex(e => e.id === emailId);
    if (sentIndex !== -1) {
      state.sentEmails.splice(sentIndex, 1);
      if (state.selectedEmailId === emailId) {
        state.selectedEmailId = null;
      }
    }
  }

  function addLabel(emailId, label) {
    const email = findEmailById(emailId)
    if (email && !email.labels.includes(label)) {
      email.labels.push(label)
    }
  }

  function removeLabel(emailId, label) {
    const email = findEmailById(emailId)
    if (email) {
      const index = email.labels.indexOf(label)
      if (index !== -1) {
        email.labels.splice(index, 1)
      }
    }
  }

  function selectEmail(emailId) {
    state.selectedEmailId = emailId
    if (emailId) {
      markAsRead(emailId)
    }
  }

  function setFilter(filterType, value) {
    state.filters[filterType] = value
  }

  function composeNewEmail() {
    // Method to handle the creation of a new email
    console.log('Composing new email')
    // In a real app, this would open the compose form and store a draft
  }

  function formatDate(date) {
    return formatEmailDate(date)
  }

  // Find an email in all collections
  function findEmailById(emailId) {
    if (!emailId) return null;
    
    // First check inbox emails
    for (const timeGroup in state.emailGroups) {
      const email = state.emailGroups[timeGroup].find(e => e.id === emailId);
      if (email) {
        return email;
      }
    }
    
    // Then check sent emails
    const sentEmail = state.sentEmails.find(e => e.id === emailId);
    if (sentEmail) {
      return sentEmail;
    }
    
    return null;
  }

  // Add an email to sent
  function addToSent(emailData) {
    const now = new Date();
    
    // Determine recipient name from email address if not provided
    let recipientName = '';
    if (emailData.to) {
      recipientName = emailData.to.includes('@') ? 
        emailData.to.split('@')[0] : emailData.to;
      // Capitalize first letter
      recipientName = recipientName.charAt(0).toUpperCase() + recipientName.slice(1);
    }
    
    // Create a proper email object
    const newEmail = {
      id: 'email_' + Math.random().toString(36).substring(2, 11),
      timestamp: now,
      sender: { name: 'Me', email: 'me@example.com' },
      recipient: { 
        name: recipientName, 
        email: emailData.to 
      },
      subject: emailData.subject || '(No subject)',
      body: emailData.body || '',
      read: true,
      sent: true,
      hasAttachment: emailData.attachments && emailData.attachments.length > 0,
      
      // For threading conversations
      isReply: emailData.isReply || false,
      isForward: emailData.isForward || false,
      
      // If this is a reply or forward, keep reference to original
      originalEmailId: emailData.originalEmail?.id || null,
      
      // Additional recipients if provided
      cc: emailData.cc,
      bcc: emailData.bcc
    };
    
    // Add to the beginning of the sent emails array
    state.sentEmails.unshift(newEmail);
    return newEmail;
  }

  // Create the store instance
  storeInstance = {
    // State
    emailGroups: computed(() => state.emailGroups),
    sentEmails: computed(() => state.sentEmails),
    allEmails,
    filteredEmails,
    selectedEmailId: computed(() => state.selectedEmailId),
    filters: computed(() => state.filters),
    selectedEmail: computed(() => findEmailById(state.selectedEmailId)),
    currentView: computed(() => state.currentView),
    
    // Actions
    fetchEmails,
    markAsRead,
    markAsUnread,
    toggleStarred,
    deleteEmail,
    addLabel,
    removeLabel,
    selectEmail,
    setFilter,
    composeNewEmail,
    formatDate,
    setCurrentView,
    addToSent,
    findEmailById,
    resetData
  };

  return storeInstance;
}