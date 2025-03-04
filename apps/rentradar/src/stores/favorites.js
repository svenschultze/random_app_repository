import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where,
  doc
} from 'firebase/firestore'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref([])
  const loading = ref(false)
  const error = ref(null)
  const db = getFirestore()
  const authStore = useAuthStore()
  
  // Get user ID from auth store
  const userId = computed(() => authStore.user?.uid)
  
  async function fetchFavorites() {
    if (!userId.value) return
    
    try {
      loading.value = true
      error.value = null
      
      // In a real implementation, this would fetch from Firestore
      // For now, we're using local storage for mock data
      
      const storedFavorites = localStorage.getItem(`favorites_${userId.value}`)
      if (storedFavorites) {
        favorites.value = JSON.parse(storedFavorites)
      }
      
      // This would be the real implementation:
      // const q = query(
      //   collection(db, 'favorites'), 
      //   where('userId', '==', userId.value)
      // )
      // const querySnapshot = await getDocs(q)
      // favorites.value = querySnapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data()
      // }))
      
    } catch (e) {
      error.value = e.message
      console.error('Error fetching favorites:', e)
    } finally {
      loading.value = false
    }
  }
  
  async function addFavorite(listingId) {
    if (!userId.value) return
    
    try {
      loading.value = true
      error.value = null
      
      // For mock data
      const newFavorite = {
        id: `fav_${Date.now()}`,
        userId: userId.value,
        listingId,
        createdAt: new Date().toISOString()
      }
      
      favorites.value.push(newFavorite)
      
      // Store in local storage for persistence
      localStorage.setItem(
        `favorites_${userId.value}`, 
        JSON.stringify(favorites.value)
      )
      
      // Real implementation would be:
      // const docRef = await addDoc(collection(db, 'favorites'), {
      //   userId: userId.value,
      //   listingId,
      //   createdAt: new Date().toISOString()
      // })
      // return docRef.id
      
      return newFavorite.id
    } catch (e) {
      error.value = e.message
      console.error('Error adding favorite:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function removeFavorite(listingId) {
    if (!userId.value) return
    
    try {
      loading.value = true
      error.value = null
      
      // For mock data
      const index = favorites.value.findIndex(f => f.listingId === listingId)
      if (index > -1) {
        favorites.value.splice(index, 1)
        
        // Update local storage
        localStorage.setItem(
          `favorites_${userId.value}`, 
          JSON.stringify(favorites.value)
        )
      }
      
      // Real implementation would be:
      // const q = query(
      //   collection(db, 'favorites'),
      //   where('userId', '==', userId.value),
      //   where('listingId', '==', listingId)
      // )
      // const querySnapshot = await getDocs(q)
      // if (!querySnapshot.empty) {
      //   const docRef = doc(db, 'favorites', querySnapshot.docs[0].id)
      //   await deleteDoc(docRef)
      // }
      
    } catch (e) {
      error.value = e.message
      console.error('Error removing favorite:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  function isFavorite(listingId) {
    return favorites.value.some(f => f.listingId === listingId)
  }
  
  // Clear favorites when user logs out
  function clearFavorites() {
    favorites.value = []
  }
  
  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites
  }
})