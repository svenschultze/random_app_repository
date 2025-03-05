import { createStore } from 'zustand/vanilla'
import { nanoid } from 'nanoid'

// Default demo profile
const demoProfile = {
  name: 'Demo User', 
  avatar: null,
  createdAt: new Date().toISOString()
};

// Get initial profile or use demo profile
const getInitialProfile = () => {
  const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
  if (savedProfile) {
    return savedProfile;
  } else {
    // For demo purposes, auto-create a profile
    localStorage.setItem('userProfile', JSON.stringify(demoProfile));
    return demoProfile;
  }
};

// Create store for user profile
const createUserProfileStore = () => {
  return createStore((set) => ({
    profile: getInitialProfile(),
    
    // Set user profile
    setProfile: (profile) => {
      localStorage.setItem('userProfile', JSON.stringify(profile))
      set({ profile })
    },
    
    // Update user profile
    updateProfile: (updates) => set((state) => {
      const updatedProfile = { ...state.profile, ...updates }
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
      return { profile: updatedProfile }
    }),
    
    // Clear user profile for logout
    clearProfile: () => {
      localStorage.removeItem('userProfile')
      set({ profile: null })
    }
  }))
}

// Demo chats for the initial experience
const demoChats = [
  {
    id: '123456789',
    peer: {
      id: '123456789',
      name: 'Alice Rodriguez',
      avatar: null
    },
    messages: [
      {
        id: 'm1',
        type: 'chat',
        content: 'Hey there! Welcome to PeerMesh Chat!',
        senderId: '123456789',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'received'
      },
      {
        id: 'm2',
        type: 'chat',
        content: 'This is a demo message to show how the chat works.',
        senderId: '123456789',
        timestamp: new Date(Date.now() - 3600000 * 24 + 60000).toISOString(),
        status: 'received'
      },
      {
        id: 'm3',
        type: 'chat',
        content: 'You can connect with real users by using the Connect feature!',
        senderId: '123456789',
        timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
        status: 'received'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    lastMessage: {
      id: 'm3',
      type: 'chat',
      content: 'You can connect with real users by using the Connect feature!',
      senderId: '123456789',
      timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
      status: 'received'
    },
    unreadCount: 1
  },
  {
    id: '987654321',
    peer: {
      id: '987654321',
      name: 'Bob Chen',
      avatar: null
    },
    messages: [
      {
        id: 'm4',
        type: 'chat',
        content: 'Hey! Have you tried the peer-to-peer connection?',
        senderId: '987654321',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        status: 'received'
      },
      {
        id: 'm5',
        type: 'chat',
        content: 'It\'s completely serverless. All messages stay on your device.',
        senderId: '987654321',
        timestamp: new Date(Date.now() - 3600000 * 12 + 60000).toISOString(),
        status: 'received'
      },
      {
        id: 'm6',
        type: 'chat',
        content: 'Yes, it\'s pretty cool!',
        senderId: 'local-user',
        timestamp: new Date(Date.now() - 3600000 * 12 + 120000).toISOString(),
        status: 'sent'
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    lastMessage: {
      id: 'm6',
      type: 'chat',
      content: 'Yes, it\'s pretty cool!',
      senderId: 'local-user',
      timestamp: new Date(Date.now() - 3600000 * 12 + 120000).toISOString(),
      status: 'sent'
    },
    unreadCount: 0
  }
];

// Check if we should use demo chats
const getInitialChats = () => {
  const savedChats = JSON.parse(localStorage.getItem('chats'));
  if (savedChats && savedChats.length > 0) {
    return savedChats; // Use existing chats if available
  } else {
    // First time, use demo chats
    localStorage.setItem('chats', JSON.stringify(demoChats));
    return demoChats;
  }
};

// Create store for chats
const createChatStore = () => {
  return createStore((set, get) => ({
    chats: getInitialChats(),
    activeChat: null,
    
    // Add new chat
    addChat: (peer) => {
      const newChat = {
        id: nanoid(),
        peer,
        messages: [],
        createdAt: new Date().toISOString(),
        lastMessage: null,
        unreadCount: 0
      }
      
      set((state) => {
        const updatedChats = [...state.chats, newChat]
        localStorage.setItem('chats', JSON.stringify(updatedChats))
        return { chats: updatedChats }
      })
      
      return newChat.id
    },
    
    // Get chat by ID
    getChat: (chatId) => {
      return get().chats.find(chat => chat.id === chatId) || null
    },
    
    // Set active chat and reset unread count
    setActiveChat: (chatId) => {
      const chats = get().chats
      const updatedChats = chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, unreadCount: 0 } 
          : chat
      )
      
      localStorage.setItem('chats', JSON.stringify(updatedChats))
      set({ 
        activeChat: chatId,
        chats: updatedChats
      })
    },
    
    // Add message to chat
    addMessage: (chatId, message) => set((state) => {
      const chats = state.chats
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          const isActiveChat = state.activeChat === chatId
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, message],
            lastMessage: message,
            unreadCount: isActiveChat ? 0 : chat.unreadCount + 1
          }
          return updatedChat
        }
        return chat
      })
      
      localStorage.setItem('chats', JSON.stringify(updatedChats))
      return { chats: updatedChats }
    }),
    
    // Delete chat
    deleteChat: (chatId) => set((state) => {
      const updatedChats = state.chats.filter(chat => chat.id !== chatId)
      localStorage.setItem('chats', JSON.stringify(updatedChats))
      return { 
        chats: updatedChats,
        activeChat: state.activeChat === chatId ? null : state.activeChat
      }
    })
  }))
}

// Create connection store
const createConnectionStore = () => {
  return createStore((set) => ({
    peers: {},
    connections: {},
    connectionStatus: 'disconnected', // disconnected, connecting, connected

    // Add peer
    addPeer: (peerId, peer) => set((state) => ({
      peers: { ...state.peers, [peerId]: peer }
    })),
    
    // Remove peer
    removePeer: (peerId) => set((state) => {
      const newPeers = { ...state.peers }
      delete newPeers[peerId]
      return { peers: newPeers }
    }),
    
    // Update connection status
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    
    // Add data connection
    addConnection: (peerId, connection) => set((state) => ({
      connections: { ...state.connections, [peerId]: connection }
    })),
    
    // Remove connection
    removeConnection: (peerId) => set((state) => {
      const newConnections = { ...state.connections }
      delete newConnections[peerId]
      return { connections: newConnections }
    })
  }))
}

// Create stores
export const userProfileStore = createUserProfileStore()
export const chatStore = createChatStore()
export const connectionStore = createConnectionStore()

// Hooks for Vue components
export function useUserProfile() {
  return userProfileStore.getState()
}

export function useChats() {
  return chatStore.getState()
}

export function useConnection() {
  return connectionStore.getState()
}