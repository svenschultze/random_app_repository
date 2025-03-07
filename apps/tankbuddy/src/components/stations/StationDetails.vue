<script setup>
import { ref, computed, onMounted } from 'vue';
import { getStationById, addStationReview } from '../../services/storageService';
import PriceHistoryChart from './PriceHistoryChart.vue';

const props = defineProps({
  stationId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

// Station data
const station = ref(null);
const selectedFuelType = ref('unleaded');
const showReviewForm = ref(false);

// Review form data
const reviewForm = ref({
  author: '',
  rating: 5,
  text: ''
});

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Load station data
const loadStation = () => {
  station.value = getStationById(props.stationId);
};

// Close the details panel
const closeDetails = () => {
  emit('close');
};

// Toggle review form
const toggleReviewForm = () => {
  showReviewForm.value = !showReviewForm.value;
};

// Submit a review
const submitReview = () => {
  if (!reviewForm.value.author || !reviewForm.value.text) {
    return;
  }
  
  addStationReview(props.stationId, {
    author: reviewForm.value.author,
    rating: reviewForm.value.rating,
    text: reviewForm.value.text
  });
  
  showReviewForm.value = false;
  
  // Reset form
  reviewForm.value = {
    author: '',
    rating: 5,
    text: ''
  };
  
  // Reload station data to show the new review
  loadStation();
};

// Open directions in a map
const openDirections = () => {
  if (!station.value) return;
  
  const { latitude, longitude } = station.value.location;
};

// Load station data when component mounts
onMounted(() => {
  loadStation();
});
</script>

<template>
  <div class="station-details" v-if="station">
    <div class="details-header">
      <button 
        class="close-btn" 
        @click="closeDetails"
        v-voix="'Close station details'"
      >
        ×
      </button>
      <h2 class="station-name">{{ station.name }}</h2>
      <div class="station-address">{{ station.address }}</div>
      <div class="station-rating">
        <span class="rating-stars">
          {{ '★'.repeat(Math.floor(station.rating)) }}{{ station.rating % 1 >= 0.5 ? '½' : '' }}{{ '☆'.repeat(5 - Math.ceil(station.rating)) }}
        </span>
        <span class="rating-value">{{ station.rating }}</span>
        <span class="reviews-count" v-if="station.reviews.length">({{ station.reviews.length }} reviews)</span>
      </div>
    </div>
    
    <div class="details-content">
      <div class="details-section">
        <h3 class="section-title">Current Prices</h3>
        <div class="prices-grid">
          <div class="price-item">
            <div class="price-label">Unleaded</div>
            <div class="price-value">{{ formatCurrency(station.prices.unleaded) }}</div>
          </div>
          <div class="price-item">
            <div class="price-label">Premium</div>
            <div class="price-value">{{ formatCurrency(station.prices.premium) }}</div>
          </div>
          <div class="price-item">
            <div class="price-label">Diesel</div>
            <div class="price-value">{{ formatCurrency(station.prices.diesel) }}</div>
          </div>
        </div>
      </div>
      
      <div class="details-section">
        <h3 class="section-title">Price History</h3>
        <div class="fuel-type-selector">
          <button 
            class="fuel-type-btn" 
            :class="{ active: selectedFuelType === 'unleaded' }"
            @click="selectedFuelType = 'unleaded'"
            v-voix="'Show unleaded price history'"
          >
            Unleaded
          </button>
          <button 
            class="fuel-type-btn" 
            :class="{ active: selectedFuelType === 'premium' }"
            @click="selectedFuelType = 'premium'"
            v-voix="'Show premium price history'"
          >
            Premium
          </button>
          <button 
            class="fuel-type-btn" 
            :class="{ active: selectedFuelType === 'diesel' }"
            @click="selectedFuelType = 'diesel'"
            v-voix="'Show diesel price history'"
          >
            Diesel
          </button>
        </div>
        
        <PriceHistoryChart 
          :price-history="station.priceHistory" 
          :fuel-type="selectedFuelType" 
        />
      </div>
      
      <div class="details-section">
        <h3 class="section-title">Amenities</h3>
        <div class="amenities-list">
          <div 
            v-for="(amenity, index) in station.amenities" 
            :key="index"
            class="amenity-item"
          >
            <span class="amenity-icon">✓</span>
            <span class="amenity-name">{{ amenity }}</span>
          </div>
        </div>
      </div>
      
      <div class="details-section">
        <div class="section-header">
          <h3 class="section-title">Reviews</h3>
          <button 
            class="add-review-btn" 
            @click="toggleReviewForm"
            v-voix="'Add review button'"
          >
            Add Review
          </button>
        </div>
        
        <div v-if="showReviewForm" class="review-form">
          <div class="form-group">
            <label for="author" class="form-label">Your Name</label>
            <input 
              type="text" 
              id="author" 
              v-model="reviewForm.author" 
              class="form-input"
              v-voix="'Your name input'"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">Rating</label>
            <div class="rating-input">
              <button 
                v-for="i in 5" 
                :key="i"
                @click="reviewForm.rating = i"
                class="rating-btn"
                :class="{ active: reviewForm.rating >= i }"
                v-voix="'Rate ' + i + ' stars'"
              >
                ★
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="review-text" class="form-label">Your Review</label>
            <textarea 
              id="review-text" 
              v-model="reviewForm.text" 
              class="form-input review-text"
              v-voix="'Review text input'"
              required
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button 
              class="cancel-btn" 
              @click="toggleReviewForm"
              v-voix="'Cancel review'"
            >
              Cancel
            </button>
            <button 
              class="submit-btn" 
              @click="submitReview"
              v-voix="'Submit review'"
            >
              Submit Review
            </button>
          </div>
        </div>
        
        <div v-if="station.reviews.length" class="reviews-list">
          <div 
            v-for="review in station.reviews" 
            :key="review.id"
            class="review-item"
          >
            <div class="review-header">
              <div class="review-author">{{ review.author }}</div>
              <div class="review-rating">
                {{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}
              </div>
              <div class="review-date">{{ formatDate(review.date) }}</div>
            </div>
            <div class="review-text">{{ review.text }}</div>
          </div>
        </div>
        
        <div v-else-if="!showReviewForm" class="no-reviews">
          No reviews yet. Be the first to write a review!
        </div>
      </div>
      
      <div class="details-section location-section">
        <h3 class="section-title">Location & Hours</h3>
        <div class="location-details">
          <div class="hours-info">
            <div class="hours-title">Hours</div>
            <div class="hours-value">{{ station.hours.open }} - {{ station.hours.close }}</div>
          </div>
          
          <button 
            class="directions-btn" 
            @click="openDirections"
            v-voix="'Get directions button'"
          >
            Get Directions
          </button>
        </div>
        
        <!-- Map placeholder (in a real app, this would be an actual map) -->
        <div class="map-placeholder">
          <div class="map-text">
            <p>Map View</p>
            <p class="map-coords">{{ station.location.latitude.toFixed(4) }}, {{ station.location.longitude.toFixed(4) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="loading-container">
    Loading station details...
  </div>
</template>

<style scoped>
.station-details {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  margin-bottom: 2rem;
}

.details-header {
  padding: 1.5rem;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.station-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  padding-right: 2rem;
}

.station-address {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.station-rating {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  color: #f59e0b;
  letter-spacing: 0.1em;
}

.rating-value {
  font-weight: 600;
  color: #1f2937;
}

.reviews-count {
  font-size: 0.75rem;
  color: #6b7280;
}

.details-content {
  padding: 1.5rem;
}

.details-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 0;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.prices-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.price-item {
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
}

.price-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.price-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.fuel-type-selector {
  display: flex;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.fuel-type-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #f9fafb;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.fuel-type-btn:not(:last-child) {
  border-right: 1px solid #e5e7eb;
}

.fuel-type-btn.active {
  background-color: #3b82f6;
  color: #ffffff;
}

.amenities-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.amenity-icon {
  color: #10b981;
  font-size: 1rem;
}

.add-review-btn {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.add-review-btn:hover {
  background-color: #2563eb;
}

.review-form {
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.review-text {
  min-height: 100px;
  resize: vertical;
}

.rating-input {
  display: flex;
}

.rating-btn {
  background: none;
  border: none;
  color: #d1d5db;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-right: 0.25rem;
}

.rating-btn.active {
  color: #f59e0b;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.submit-btn {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-item {
  background-color: #f9fafb;
  border-radius: 6px;
  padding: 1rem;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.review-author {
  font-weight: 600;
  color: #1f2937;
}

.review-rating {
  color: #f59e0b;
  letter-spacing: 0.1em;
}

.review-date {
  color: #6b7280;
  font-size: 0.75rem;
}

.review-text {
  color: #4b5563;
  line-height: 1.5;
}

.no-reviews {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
  background-color: #f9fafb;
  border-radius: 6px;
}

.location-section {
  margin-bottom: 0;
}

.location-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.hours-title {
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.hours-value {
  color: #1f2937;
}

.directions-btn {
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.directions-btn:hover {
  background-color: #059669;
}

.map-placeholder {
  background-color: #e5e7eb;
  border-radius: 6px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-style: italic;
}

.map-text {
  text-align: center;
}

.map-coords {
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.loading-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

@media (max-width: 640px) {
  .prices-grid,
  .amenities-list {
    grid-template-columns: 1fr;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>