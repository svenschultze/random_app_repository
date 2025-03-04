import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where,
  doc
} from 'firebase/firestore'

export const useAlertsStore = defineStore('alerts', () => {
  const alerts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const db = getFirestore()
  const authStore = useAuthStore()
  
  // Get user ID from auth store
  const userId = computed(() => authStore.user?.uid)
  
  async function fetchAlerts() {
    if (!userId.value) return
    
    try {
      loading.value = true
      error.value = null
      
      // In a real implementation, this would fetch from Firestore
      // For now, we're using local storage for mock data
      
      const storedAlerts = localStorage.getItem(`alerts_${userId.value}`)
      if (storedAlerts) {
        alerts.value = JSON.parse(storedAlerts)
      } else {
        // Initialize with a sample alert for new users
        const sampleAlert = {
          id: 'sample_alert',
          userId: userId.value,
          name: 'Sample Alert',
          filters: {
            priceMin: 1000,
            priceMax: 3000,
            bedrooms: 2,
            propertyType: 'apartment',
            location: 'Downtown'
          },
          frequency: 'daily',
          active: true,
          createdAt: new Date().toISOString()
        }
        alerts.value = [sampleAlert]
        localStorage.setItem(`alerts_${userId.value}`, JSON.stringify(alerts.value))
      }
      
      // This would be the real implementation:
      // const q = query(
      //   collection(db, 'alerts'), 
      //   where('userId', '==', userId.value)
      // )
      // const querySnapshot = await getDocs(q)
      // alerts.value = querySnapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data()
      // }))
      
    } catch (e) {
      error.value = e.message
      console.error('Error fetching alerts:', e)
    } finally {
      loading.value = false
    }
  }
  
  async function createAlert(alertData) {
    if (!userId.value) return
    
    try {
      loading.value = true
      error.value = null
      
      // For mock data
      const newAlert = {
        id: `alert_${Date.now()}`,
        userId: userId.value,
        ...alertData,
        createdAt: new Date().toISOString()
      }
      
      alerts.value.push(newAlert)
      
      // Store in local storage for persistence
      localStorage.setItem(
        `alerts_${userId.value}`, 
        JSON.stringify(alerts.value)
      )
      
      // Real implementation would be:
      // const docRef = await addDoc(collection(db, 'alerts'), {
      //   userId: userId.value,
      //   ...alertData,
      //   createdAt: new Date().toISOString()
      // })
      // return docRef.id
      
      return newAlert.id
    } catch (e) {
      error.value = e.message
      console.error('Error creating alert:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function updateAlert(id, alertData) {
    if (!userId.value) return
    
    try {
      loading.value = true
      error.value = null
      
      // For mock data
      const index = alerts.value.findIndex(a => a.id === id)
      if (index > -1) {
        alerts.value[index] = {
          ...alerts.value[index],
          ...alertData,
          updatedAt: new Date().toISOString()
        }
        
        // Update local storage
        localStorage.setItem(
          `alerts_${userId.value}`, 
          JSON.stringify(alerts.value)
        )
      } else {
        throw new Error('Alert not found')
      }
      
      // Real implementation would be:
      // const docRef = doc(db, 'alerts', id)
      // await updateDoc(docRef, {
      //   ...alertData,
      //   updatedAt: new Date().toISOString()
      // })
      
    } catch (e) {
      error.value = e.message
      console.error('Error updating alert:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function deleteAlert(id) {
    if (!userId.value) return
    
    try {
      loading.value = true
      error.value = null
      
      // For mock data
      const index = alerts.value.findIndex(a => a.id === id)
      if (index > -1) {
        alerts.value.splice(index, 1)
        
        // Update local storage
        localStorage.setItem(
          `alerts_${userId.value}`, 
          JSON.stringify(alerts.value)
        )
      } else {
        throw new Error('Alert not found')
      }
      
      // Real implementation would be:
      // const docRef = doc(db, 'alerts', id)
      // await deleteDoc(docRef)
      
    } catch (e) {
      error.value = e.message
      console.error('Error deleting alert:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function toggleAlertActive(id) {
    if (!userId.value) return
    
    try {
      const alert = alerts.value.find(a => a.id === id)
      if (alert) {
        await updateAlert(id, { active: !alert.active })
      }
    } catch (e) {
      error.value = e.message
      console.error('Error toggling alert:', e)
      throw e
    }
  }
  
  // Clear alerts when user logs out
  function clearAlerts() {
    alerts.value = []
  }
  
  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlertActive,
    clearAlerts
  }
})