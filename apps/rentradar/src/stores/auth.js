import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)
  
  const isAuthenticated = computed(() => !!user.value)
  const isLandlord = computed(() => user.value?.role === 'landlord')
  
  // Initialize auth state
  const auth = getAuth()
  onAuthStateChanged(auth, (userData) => {
    if (userData) {
      // Add custom user data from Firestore if needed
      user.value = {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: 'tenant' // Default role, would be fetched from Firestore in real app
      }
    } else {
      user.value = null
    }
    loading.value = false
  })

  async function signIn(email, password) {
    try {
      error.value = null
      loading.value = true
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // Additional user data would be fetched from Firestore here
      return userCredential
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function signUp(email, password, displayName, role = 'tenant') {
    try {
      error.value = null
      loading.value = true
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Here we would create a user document in Firestore with additional details
      // For now, we'll just set the local user data
      user.value = {
        uid: userCredential.user.uid,
        email,
        displayName,
        role
      }
      
      return userCredential
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      error.value = null
      const auth = getAuth()
      await firebaseSignOut(auth)
      user.value = null
    } catch (e) {
      error.value = e.message
      throw e
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isLandlord,
    signIn,
    signUp,
    signOut
  }
})