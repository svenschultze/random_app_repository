import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc,
  updateDoc,
  deleteDoc 
} from 'firebase/firestore'

export const useListingsStore = defineStore('listings', () => {
  const listings = ref([])
  const currentListing = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const db = getFirestore()
  
  // Filter states
  const filters = ref({
    priceMin: 0,
    priceMax: 10000,
    bedrooms: null,
    bathrooms: null,
    propertyType: null,
    amenities: [],
    location: null
  })
  
  const filteredListings = computed(() => {
    return listings.value.filter(listing => {
      // Price filter
      if (listing.price < filters.value.priceMin || listing.price > filters.value.priceMax) {
        return false
      }
      
      // Bedrooms filter
      if (filters.value.bedrooms && listing.bedrooms !== filters.value.bedrooms) {
        return false
      }
      
      // Bathrooms filter
      if (filters.value.bathrooms && listing.bathrooms !== filters.value.bathrooms) {
        return false
      }
      
      // Property type filter
      if (filters.value.propertyType && listing.propertyType !== filters.value.propertyType) {
        return false
      }
      
      // Amenities filter (any match)
      if (filters.value.amenities.length > 0) {
        const hasAmenity = filters.value.amenities.some(amenity => 
          listing.amenities.includes(amenity)
        )
        if (!hasAmenity) return false
      }
      
      // Location filter
      if (filters.value.location && !listing.location.includes(filters.value.location)) {
        return false
      }
      
      return true
    })
  })
  
  // Mock data for initial development (will be replaced by Firestore)
  const mockListings = [
    {
      id: '1',
      title: 'Modern Downtown Apartment',
      description: 'Beautiful apartment in the heart of the city with city views',
      price: 2000,
      bedrooms: 2,
      bathrooms: 1,
      propertyType: 'apartment',
      amenities: ['parking', 'gym', 'pool'],
      location: '123 Main St, Cityville',
      latitude: 37.7749,
      longitude: -122.4194,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
      ],
      landlordId: 'landlord1',
      available: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Cozy Suburban House',
      description: 'Lovely home with garden in a quiet neighborhood',
      price: 3000,
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'house',
      amenities: ['parking', 'garden', 'pets_allowed'],
      location: '456 Oak Rd, Suburbville',
      latitude: 37.7735,
      longitude: -122.4216,
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
        'https://images.unsplash.com/photo-1576941089067-2de3c901e126'
      ],
      landlordId: 'landlord2',
      available: true,
      createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
    },
    {
      id: '3',
      title: 'Luxury Studio Loft',
      description: 'High-end designer studio with premium finishes',
      price: 1800,
      bedrooms: 1,
      bathrooms: 1,
      propertyType: 'studio',
      amenities: ['gym', 'doorman', 'rooftop'],
      location: '789 High St, Luxuryville',
      latitude: 37.7795,
      longitude: -122.4165,
      images: [
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511'
      ],
      landlordId: 'landlord1',
      available: true,
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    }
  ]
  
  // Initialize with mock data for now
  listings.value = mockListings
  
  async function fetchListings() {
    try {
      loading.value = true
      error.value = null
      
      // In a real implementation, this would fetch from Firestore
      // For now, we're using mock data that's already loaded
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // This would be the real implementation:
      // const querySnapshot = await getDocs(collection(db, 'listings'))
      // listings.value = querySnapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data()
      // }))
      
    } catch (e) {
      error.value = e.message
      console.error('Error fetching listings:', e)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchListingById(id) {
    try {
      loading.value = true
      error.value = null
      
      // For mock data
      const listing = listings.value.find(l => l.id === id)
      if (listing) {
        currentListing.value = listing
      } else {
        throw new Error('Listing not found')
      }
      
      // Real implementation would be:
      // const docRef = doc(db, 'listings', id)
      // const docSnap = await getDoc(docRef)
      // if (docSnap.exists()) {
      //   currentListing.value = {
      //     id: docSnap.id,
      //     ...docSnap.data()
      //   }
      // } else {
      //   throw new Error('Listing not found')
      // }
      
    } catch (e) {
      error.value = e.message
      console.error('Error fetching listing:', e)
    } finally {
      loading.value = false
    }
  }
  
  async function createListing(listingData) {
    try {
      loading.value = true
      error.value = null
      
      // For mock data
      const newId = (listings.value.length + 1).toString()
      const newListing = {
        id: newId,
        ...listingData,
        createdAt: new Date().toISOString()
      }
      
      listings.value.push(newListing)
      
      // Real implementation would be:
      // const docRef = await addDoc(collection(db, 'listings'), {
      //   ...listingData,
      //   createdAt: new Date().toISOString()
      // })
      // return docRef.id
      
      return newId
    } catch (e) {
      error.value = e.message
      console.error('Error creating listing:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function updateListing(id, listingData) {
    try {
      loading.value = true
      error.value = null
      
      // For mock data
      const index = listings.value.findIndex(l => l.id === id)
      if (index > -1) {
        listings.value[index] = {
          ...listings.value[index],
          ...listingData,
          updatedAt: new Date().toISOString()
        }
      } else {
        throw new Error('Listing not found')
      }
      
      // Real implementation would be:
      // const docRef = doc(db, 'listings', id)
      // await updateDoc(docRef, {
      //   ...listingData,
      //   updatedAt: new Date().toISOString()
      // })
      
    } catch (e) {
      error.value = e.message
      console.error('Error updating listing:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  async function deleteListing(id) {
    try {
      loading.value = true
      error.value = null
      
      // For mock data
      const index = listings.value.findIndex(l => l.id === id)
      if (index > -1) {
        listings.value.splice(index, 1)
      } else {
        throw new Error('Listing not found')
      }
      
      // Real implementation would be:
      // const docRef = doc(db, 'listings', id)
      // await deleteDoc(docRef)
      
    } catch (e) {
      error.value = e.message
      console.error('Error deleting listing:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  function setFilters(newFilters) {
    filters.value = {
      ...filters.value,
      ...newFilters
    }
  }
  
  function resetFilters() {
    filters.value = {
      priceMin: 0,
      priceMax: 10000,
      bedrooms: null,
      bathrooms: null,
      propertyType: null,
      amenities: [],
      location: null
    }
  }
  
  return {
    listings,
    currentListing,
    loading,
    error,
    filters,
    filteredListings,
    fetchListings,
    fetchListingById,
    createListing,
    updateListing,
    deleteListing,
    setFilters,
    resetFilters
  }
})