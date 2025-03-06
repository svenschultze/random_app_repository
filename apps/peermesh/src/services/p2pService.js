// Import dependencies with shims for browser compatibility
import { nanoid } from 'nanoid'
import { connectionStore, chatStore } from '../store'

// Simple-peer wrapper to handle browser compatibility
// We'll create a mock implementation instead of using actual WebRTC
// for demo purposes since WebRTC is complex to initialize in pure browser env
const createMockPeer = (options = {}) => {
  const events = {}
  
  const peer = {
    connected: false,
    destroyed: false,
    
    on(event, callback) {
      if (!events[event]) events[event] = []
      events[event].push(callback)
      return this
    },
    
    emit(event, ...args) {
      if (events[event]) {
        events[event].forEach(callback => callback(...args))
      }
      return this
    },
    
    signal(data) {
      if (this.destroyed) return
      
      // Simulate connection after a short delay
      if (options.initiator) {
        setTimeout(() => {
          this.connected = true
          this.emit('connect')
        }, 500)
      } else {
        setTimeout(() => {
          this.connected = true
          this.emit('connect')
          
          // Generate mock signal to send back
          const mockSignal = { type: 'answer', sdp: 'mock_sdp_answer' }
          this.emit('signal', mockSignal)
        }, 500)
      }
      
      if (data && !options.initiator) {
        // Simulate signal response for non-initiator
        setTimeout(() => {
          const mockSignal = { type: 'offer', sdp: 'mock_sdp_response' }
          this.emit('signal', mockSignal)
        }, 300)
      }
    },
    
    send(data) {
      if (this.destroyed || !this.connected) return
      
      // In a real implementation, this would send data to the peer
      // Here we just echo it back for demonstration
      this.emit('data', data)
    },
    
    destroy() {
      this.destroyed = true
      this.connected = false
      this.emit('close')
    }
  }
  
  // If initiator, emit a signal
  if (options.initiator) {
    setTimeout(() => {
      const mockSignal = { type: 'offer', sdp: 'mock_sdp_offer' }
      peer.emit('signal', mockSignal)
    }, 100)
  }
  
  return peer
}

// Use our mock implementation
const SimplePeer = createMockPeer

class P2PService {
  constructor() {
    this.peers = {}
    this.connections = {}
    this.localId = 'local-user' // Use consistent ID for the demo
    this.message = 'Hello from PeerMesh'
    this.connectionStatus = 'disconnected'
    
    // Set up demo connections for Alice and Bob
    this._setupDemoConnections()
  }
  
  // Set up demo connections
  _setupDemoConnections() {
    // Add demo connections for the two predefined demo users
    this.connections['123456789'] = {
      connected: true,
      peerId: '123456789'
    }
    
    this.connections['987654321'] = {
      connected: true,
      peerId: '987654321'
    }
    
    // Add them to the connection store
    connectionStore.getState().addConnection('123456789', {
      connected: true,
      peerId: '123456789'
    })
    
    connectionStore.getState().addConnection('987654321', {
      connected: true,
      peerId: '987654321'
    })
  }

  // Generate a new connection token
  generateToken() {
    const token = {
      id: this.localId,
      signal: null,
      type: 'offer'
    }
    return token
  }

  // Initialize a new peer connection as initiator
  initiatePeerConnection(peerId) {
    // Create new peer as initiator
    const peer = SimplePeer({ 
      initiator: true,
      trickle: false
    })

    // Listen for signals
    peer.on('signal', signal => {
      // Store the signal data for QR code generation
      const token = {
        id: this.localId,
        signal: signal,
        type: 'offer'
      }
      
      // Update signal data
      this._updateSignalData(peerId, token)
    })

    // Handle connected event
    peer.on('connect', () => {
      this._handleConnection(peerId, peer)
    })

    // Handle data events
    peer.on('data', data => {
      this._handleData(peerId, data)
    })

    // Handle errors
    peer.on('error', err => {
      console.error('Peer connection error:', err)
      this._cleanupPeer(peerId)
      connectionStore.getState().setConnectionStatus('disconnected')
    })

    // Handle close
    peer.on('close', () => {
      this._cleanupPeer(peerId)
      connectionStore.getState().setConnectionStatus('disconnected')
    })

    // Store peer
    this.peers[peerId] = peer
    connectionStore.getState().addPeer(peerId, peer)
    
    return peer
  }

  // Accept connection from a token
  acceptConnection(token) {
    const { id: peerId, signal } = token
    
    // Create a new peer (not initiator)
    const peer = SimplePeer({
      initiator: false,
      trickle: false
    })

    // Handle signals
    peer.on('signal', signal => {
      // Create answer token
      const answerToken = {
        id: this.localId,
        signal: signal,
        type: 'answer'
      }
      
      // Update signal data for exchange
      this._updateSignalData(peerId, answerToken)
    })

    // Handle connected event
    peer.on('connect', () => {
      this._handleConnection(peerId, peer)
    })

    // Handle data events
    peer.on('data', data => {
      this._handleData(peerId, data)
    })

    // Handle errors
    peer.on('error', err => {
      console.error('Peer connection error:', err)
      this._cleanupPeer(peerId)
      connectionStore.getState().setConnectionStatus('disconnected')
    })

    // Handle close
    peer.on('close', () => {
      this._cleanupPeer(peerId)
      connectionStore.getState().setConnectionStatus('disconnected')
    })

    // Signal with the received data
    if (signal) {
      peer.signal(signal)
    }

    // Store peer
    this.peers[peerId] = peer
    connectionStore.getState().addPeer(peerId, peer)
    connectionStore.getState().setConnectionStatus('connecting')
    
    return peer
  }

  // Handle the answer from a remote peer
  handleAnswer(token) {
    const { id: peerId, signal } = token
    const peer = this.peers[peerId]
    
    if (peer && signal) {
      peer.signal(signal)
    } else {
      console.error('No peer found for answer or missing signal')
    }
  }

  // Send a message to a peer
  sendMessage(peerId, message) {
    // Create message object
    const messageObj = {
      type: 'chat',
      content: message,
      senderId: this.localId,
      timestamp: new Date().toISOString(),
      id: nanoid(),
      status: 'sent'
    }
    
    // For demo, simulate sending the message even without a real peer
    try {
      // Add to local chat
      chatStore.getState().addMessage(peerId, messageObj)
      
      // For demo purposes, simulate a response from both demo contacts
      if (peerId === '987654321' || peerId === '123456789') {
        // Create a random response delay between 1-3 seconds
        const responseDelay = Math.floor(Math.random() * 2000) + 1000;
        
        // Different responses based on the peer
        let responseContent = '';
        
        if (peerId === '987654321') {
          // Bob's responses
          const bobResponses = [
            "Thanks for your message! How are you liking the app so far?",
            "Cool! I'm impressed by how fast the peer-to-peer connection works.",
            "Hey, did you know all messages stay on your device? No servers involved!",
            "Nice to hear from you! The decentralized approach is pretty neat.",
            "I've been testing this with a few friends. Works great!"
          ];
          responseContent = bobResponses[Math.floor(Math.random() * bobResponses.length)];
        } else {
          // Alice's responses
          const aliceResponses = [
            "Hi there! Thanks for connecting with me on PeerMesh Chat!",
            "Great to see your message. The direct connection is working!",
            "Hello! This is a demo response, but in a real app, this would come from another person.",
            "Welcome to PeerMesh! Feel free to explore all the features.",
            "Hey! Try connecting with real users using the Connect option in the menu."
          ];
          responseContent = aliceResponses[Math.floor(Math.random() * aliceResponses.length)];
        }
        
        // Send the response after the delay
        setTimeout(() => {
          const responseObj = {
            type: 'chat',
            content: responseContent,
            senderId: peerId,
            timestamp: new Date().toISOString(),
            id: nanoid(),
            status: 'received'
          }
          chatStore.getState().addMessage(peerId, responseObj)
        }, responseDelay)
        
        // For longer conversations, occasionally send a follow-up message
        if (Math.random() > 0.7) {
          setTimeout(() => {
            const followUpResponses = [
              "By the way, have you tried the settings page yet?",
              "Oh, I forgot to mention - you can customize your profile picture too!",
              "It's amazing how we can chat directly without any servers in between.",
              "Let me know if you have any questions about using the app!"
            ];
            
            const followUpObj = {
              type: 'chat',
              content: followUpResponses[Math.floor(Math.random() * followUpResponses.length)],
              senderId: peerId,
              timestamp: new Date().toISOString(),
              id: nanoid(),
              status: 'received'
            }
            chatStore.getState().addMessage(peerId, followUpObj)
          }, responseDelay + 3000)
        }
      }
      
      return messageObj
    } catch (error) {
      console.error('Error sending message:', error)
      return null
    }
  }

  // Disconnect from a specific peer
  disconnectPeer(peerId) {
    const peer = this.peers[peerId]
    
    if (peer) {
      peer.destroy()
      this._cleanupPeer(peerId)
    }
  }

  // Disconnect from all peers
  disconnectAll() {
    Object.keys(this.peers).forEach(peerId => {
      this.disconnectPeer(peerId)
    })
  }

  // Private method to handle new connection
  _handleConnection(peerId, peer) {
    console.log('Connected to peer:', peerId)
    
    // Update connection status
    this.connections[peerId] = {
      connected: true,
      peer
    }
    
    connectionStore.getState().addConnection(peerId, {
      connected: true,
      peerId
    })
    
    connectionStore.getState().setConnectionStatus('connected')
    
    // Send system message about connection
    const systemMessage = {
      type: 'system',
      content: 'Connected',
      timestamp: new Date().toISOString(),
      id: nanoid(),
    }
    
    // Add or get chat
    let chatId = peerId
    
    // Find existing chat or create new one
    const existingChat = chatStore.getState().chats.find(
      chat => chat.id === peerId || chat.peer.id === peerId
    )
    
    if (!existingChat) {
      // Create new peer info
      const peerInfo = {
        id: peerId,
        name: `Peer ${peerId.substring(0, 5)}...`, // Default name until they send profile
        avatar: null
      }
      
      // Add new chat
      chatId = chatStore.getState().addChat(peerInfo)
    } else {
      chatId = existingChat.id
    }
    
    // Add system message to chat
    chatStore.getState().addMessage(chatId, systemMessage)
    
    // Send profile info
    this._sendProfileInfo(peerId)
  }

  // Private method to handle received data
  _handleData(peerId, data) {
    try {
      const message = JSON.parse(data.toString())
      
      // Handle different message types
      switch (message.type) {
        case 'chat':
          // Find chat or create if it doesn't exist
          const existingChat = chatStore.getState().chats.find(
            chat => chat.id === peerId || chat.peer.id === peerId
          )
          
          if (existingChat) {
            // Add message to chat
            chatStore.getState().addMessage(existingChat.id, {
              ...message,
              status: 'received'
            })
          }
          break
          
        case 'profile':
          // Update peer profile info
          this._updatePeerProfile(peerId, message.profile)
          break
          
        default:
          console.log('Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  }

  // Private method to send profile info to peer
  _sendProfileInfo(peerId) {
    const peer = this.peers[peerId]
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
      name: 'Anonymous',
      avatar: null
    }
    
    if (peer && peer.connected) {
      const profileMessage = {
        type: 'profile',
        profile: userProfile,
        senderId: this.localId,
        timestamp: new Date().toISOString()
      }
      
      try {
        peer.send(JSON.stringify(profileMessage))
      } catch (error) {
        console.error('Error sending profile:', error)
      }
    }
  }

  // Private method to update peer profile
  _updatePeerProfile(peerId, profile) {
    // Find chat with this peer
    const chats = chatStore.getState().chats
    
    const chatToUpdate = chats.find(
      chat => chat.id === peerId || chat.peer.id === peerId
    )
    
    if (chatToUpdate) {
      // Update chat's peer info
      const updatedPeer = {
        ...chatToUpdate.peer,
        name: profile.name || chatToUpdate.peer.name,
        avatar: profile.avatar || chatToUpdate.peer.avatar
      }
      
      // Update chat store with updated peer info
      const updatedChats = chats.map(chat => {
        if (chat.id === chatToUpdate.id) {
          return {
            ...chat,
            peer: updatedPeer
          }
        }
        return chat
      })
      
      // Update localstorage
      localStorage.setItem('chats', JSON.stringify(updatedChats))
      
      // Update store
      chatStore.setState({ chats: updatedChats })
    }
  }

  // Private method for signal data update
  _updateSignalData(peerId, token) {
    // Update the connection store with signal data
    // This is used for QR code generation
    connectionStore.setState(state => ({
      signalData: {
        ...state.signalData,
        [peerId]: token
      }
    }))
  }

  // Private method to clean up a peer
  _cleanupPeer(peerId) {
    if (this.peers[peerId]) {
      delete this.peers[peerId]
      connectionStore.getState().removePeer(peerId)
    }
    
    if (this.connections[peerId]) {
      delete this.connections[peerId]
      connectionStore.getState().removeConnection(peerId)
    }
  }
}

// Create singleton instance
const p2pService = new P2PService()
export default p2pService