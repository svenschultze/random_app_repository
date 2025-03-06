<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock bookings data (in a real app, this would be retrieved from localStorage)
const bookings = ref([
  {
    id: '1',
    reference: 'ABC123',
    status: 'Upcoming',
    flight: {
      airline: 'Delta Airlines',
      flightNumber: 'DL1234',
      departure: {
        airport: 'SFO',
        time: '08:30',
        date: '2025-04-15'
      },
      arrival: {
        airport: 'NYC',
        time: '16:45',
        date: '2025-04-15'
      }
    }
  },
  {
    id: '2',
    reference: 'XYZ789',
    status: 'Upcoming',
    flight: {
      airline: 'American Airlines',
      flightNumber: 'AA456',
      departure: {
        airport: 'LAX',
        time: '10:15',
        date: '2025-05-20'
      },
      arrival: {
        airport: 'MIA',
        time: '18:30',
        date: '2025-05-20'
      }
    }
  },
  {
    id: '3',
    reference: 'DEF456',
    status: 'Past',
    flight: {
      airline: 'United Airlines',
      flightNumber: 'UA789',
      departure: {
        airport: 'SEA',
        time: '07:45',
        date: '2025-02-10'
      },
      arrival: {
        airport: 'ORD',
        time: '13:20',
        date: '2025-02-10'
      }
    }
  }
])

// Filter state
const filterType = ref('all') // all, upcoming, past

// Filter bookings based on selected filter
const filteredBookings = computed(() => {
  if (filterType.value === 'all') {
    return bookings.value
  } else if (filterType.value === 'upcoming') {
    return bookings.value.filter(booking => booking.status === 'Upcoming')
  } else if (filterType.value === 'past') {
    return bookings.value.filter(booking => booking.status === 'Past')
  }
  return bookings.value
})

// View booking details
const viewBookingDetails = (bookingId) => {
  router.push(`/confirmation/${bookingId}`)
}

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}
</script>

<template>
  <div class="bookings-view">
    <h1 v-voix="'My Bookings Heading'">My Bookings</h1>
    
    <div class="filter-tabs" v-voix="'Booking Filter Tabs'">
      <button 
        :class="{ active: filterType === 'all' }" 
        @click="filterType = 'all'"
        v-voix="'All Bookings Tab'"
        hint="Show all bookings"
      >
        All
      </button>
      <button 
        :class="{ active: filterType === 'upcoming' }" 
        @click="filterType = 'upcoming'"
        v-voix="'Upcoming Bookings Tab'"
        hint="Show only upcoming bookings"
      >
        Upcoming
      </button>
      <button 
        :class="{ active: filterType === 'past' }" 
        @click="filterType = 'past'"
        v-voix="'Past Bookings Tab'"
        hint="Show only past bookings"
      >
        Past
      </button>
    </div>
    
    <div class="bookings-list">
      <div 
        v-for="booking in filteredBookings" 
        :key="booking.id" 
        class="booking-card"
        @click="viewBookingDetails(booking.id)"
        v-voix="'Booking Card'"
        :hint="`Flight from ${booking.flight.departure.airport} to ${booking.flight.arrival.airport} on ${formatDate(booking.flight.departure.date)}`"
      >
        <div class="booking-status" :class="booking.status.toLowerCase()">
          {{ booking.status }}
        </div>
        
        <div class="booking-info">
          <div class="booking-reference">
            Ref: {{ booking.reference }}
          </div>
          
          <div class="flight-info">
            <div class="route">
              {{ booking.flight.departure.airport }} → {{ booking.flight.arrival.airport }}
            </div>
            
            <div class="date-airline">
              {{ formatDate(booking.flight.departure.date) }} • {{ booking.flight.airline }}
            </div>
            
            <div class="times">
              {{ booking.flight.departure.time }} - {{ booking.flight.arrival.time }}
            </div>
          </div>
        </div>
        
        <div class="booking-actions">
          <button 
            class="view-button"
            v-voix="'View Booking Details Button'"
            hint="View complete booking details"
          >
            View Details
          </button>
          
          <button 
            v-if="booking.status === 'Upcoming'"
            class="status-button"
            v-voix="'Check Flight Status Button'"
            hint="Check current status of your flight"
          >
            Check Status
          </button>
        </div>
      </div>
      
      <div v-if="filteredBookings.length === 0" class="no-bookings" v-voix="'No Bookings Message'">
        <p>No bookings found. Start by searching and booking a flight!</p>
        <button 
          class="search-flights-button" 
          @click="router.push('/')"
          v-voix="'Search Flights Button'"
          hint="Go to home page to search for flights"
        >
          Search Flights
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
</script>

<style scoped>
.bookings-view {
  padding-bottom: 5rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.filter-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.filter-tabs button {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  color: #666;
  position: relative;
}

.filter-tabs button.active {
  color: #4a90e2;
  font-weight: 500;
}

.filter-tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4a90e2;
}

.booking-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.booking-status {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}

.booking-status.upcoming {
  background-color: #e3f2fd;
  color: #1976d2;
}

.booking-status.past {
  background-color: #f5f5f5;
  color: #757575;
}

.booking-reference {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.route {
  font-weight: 500;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.date-airline, .times {
  color: #666;
  margin-bottom: 0.25rem;
}

.booking-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.view-button, .status-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}

.view-button {
  background-color: #4a90e2;
  color: white;
  border: none;
}

.status-button {
  background-color: white;
  color: #4a90e2;
  border: 1px solid #4a90e2;
}

.no-bookings {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
}

.search-flights-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .booking-card {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .booking-status {
    width: fit-content;
  }
  
  .booking-actions {
    flex-direction: row;
    justify-content: flex-start;
  }
}
</style>