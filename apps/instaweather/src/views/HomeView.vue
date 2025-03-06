<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const weatherData = ref(null)
const loading = ref(true)
const error = ref(null)
const locationGranted = ref(false)
const currentLocation = ref('Loading location...')

// Mock weather data for the demo
const mockWeatherData = {
  current: {
    temp: 75,
    feels_like: 78,
    humidity: 65,
    wind_speed: 8,
    weather: {
      main: 'Partly Cloudy',
      description: 'Partly cloudy with a slight chance of showers',
      icon: 'cloud'
    }
  },
  forecast: {
    daily: [
      { day: 'Today', temp: { max: 80, min: 70 }, weather: { main: 'Partly Cloudy', icon: 'cloud' } },
      { day: 'Mon', temp: { max: 82, min: 69 }, weather: { main: 'Sunny', icon: 'sun' } },
      { day: 'Tue', temp: { max: 85, min: 72 }, weather: { main: 'Sunny', icon: 'sun' } },
      { day: 'Wed', temp: { max: 79, min: 68 }, weather: { main: 'Rainy', icon: 'rain' } },
      { day: 'Thu', temp: { max: 77, min: 65 }, weather: { main: 'Cloudy', icon: 'cloud' } },
      { day: 'Fri', temp: { max: 76, min: 64 }, weather: { main: 'Partly Cloudy', icon: 'cloud' } },
      { day: 'Sat', temp: { max: 78, min: 66 }, weather: { main: 'Sunny', icon: 'sun' } }
    ],
    hourly: [
      { time: 'Now', temp: 75, weather: { main: 'Partly Cloudy', icon: 'cloud' } },
      { time: '1 PM', temp: 76, weather: { main: 'Partly Cloudy', icon: 'cloud' } },
      { time: '2 PM', temp: 77, weather: { main: 'Cloudy', icon: 'cloud' } },
      { time: '3 PM', temp: 79, weather: { main: 'Partly Cloudy', icon: 'cloud' } },
      { time: '4 PM', temp: 78, weather: { main: 'Partly Cloudy', icon: 'cloud' } },
      { time: '5 PM', temp: 77, weather: { main: 'Partly Cloudy', icon: 'cloud' } },
      { time: '6 PM', temp: 76, weather: { main: 'Clear', icon: 'sun' } },
      { time: '7 PM', temp: 74, weather: { main: 'Clear', icon: 'sun' } }
    ]
  }
}

const requestLocationPermission = () => {
  loading.value = true
  error.value = null
  
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success - we got the location
        locationGranted.value = true
        currentLocation.value = 'San Francisco, CA' // In a real app, we'd reverse geocode
        fetchWeatherData(position.coords.latitude, position.coords.longitude)
      },
      (err) => {
        // Error or permission denied
        locationGranted.value = false
        error.value = 'Location access denied. Please search for a location.'
        loading.value = false
      },
      { timeout: 5000 }
    )
  } else {
    // Browser doesn't support geolocation
    error.value = 'Your browser does not support geolocation.'
    loading.value = false
  }
}

const fetchWeatherData = (lat, lon) => {
  // In a real app, we would fetch from a weather API like:
  // fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`)
  
  // For this demo, we'll use mock data after a short delay
  setTimeout(() => {
    weatherData.value = mockWeatherData
    loading.value = false
  }, 1000)
}

const goToDetails = () => {
  router.push({
    path: '/details/current',
    query: { name: currentLocation.value }
  })
}

// Weather icons mapping (in a real app, we'd use actual icon images)
const getWeatherIcon = (iconCode) => {
  const icons = {
    'sun': '☀️',
    'cloud': '⛅',
    'rain': '🌧️',
    'snow': '❄️',
    'thunder': '⚡',
    'fog': '🌫️'
  }
  return icons[iconCode] || '☀️'
}

onMounted(() => {
  requestLocationPermission()
})
</script>

<template>
  <div class="home-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container" v-voix="'loading weather data'">
      <div class="loading-spinner"></div>
      <p>Fetching weather data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container" v-voix="'location error'">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button 
        class="primary-button" 
        @click="$router.push('/search')" 
        v-voix="'search for location'"
      >
        Search for a location
      </button>
    </div>

    <!-- Weather Data Display -->
    <div v-else-if="weatherData" class="weather-content">
      <div class="location-bar" v-voix="'current location'">
        <h2>{{ currentLocation }}</h2>
      </div>

      <!-- Current Weather Card -->
      <div class="current-weather-card" v-voix="'current weather'">
        <div class="weather-icon-large">
          {{ getWeatherIcon(weatherData.current.weather.icon) }}
        </div>
        <div class="temperature-display">
          <span class="current-temp" v-voix="'current temperature'">{{ weatherData.current.temp }}°F</span>
          <span class="weather-description">{{ weatherData.current.weather.main }}</span>
        </div>
        <div class="weather-details">
          <div class="detail-item" v-voix="'feels like temperature'">
            <span class="detail-label">Feels like</span>
            <span class="detail-value">{{ weatherData.current.feels_like }}°F</span>
          </div>
          <div class="detail-item" v-voix="'humidity percentage'">
            <span class="detail-label">Humidity</span>
            <span class="detail-value">{{ weatherData.current.humidity }}%</span>
          </div>
          <div class="detail-item" v-voix="'wind speed'">
            <span class="detail-label">Wind</span>
            <span class="detail-value">{{ weatherData.current.wind_speed }} mph</span>
          </div>
        </div>
        <div class="high-low" v-voix="'high and low temperatures'">
          <span>H: {{ weatherData.forecast.daily[0].temp.max }}°</span>
          <span>L: {{ weatherData.forecast.daily[0].temp.min }}°</span>
        </div>
      </div>

      <!-- Hourly Forecast Preview -->
      <div class="forecast-section" v-voix="'hourly forecast'">
        <div class="section-header">
          <h3>Hourly</h3>
          <button 
            class="view-more-button" 
            @click="goToDetails" 
            v-voix="'view detailed hourly forecast'"
            hint="View more detailed hourly forecast information"
          >
            View more
          </button>
        </div>
        <div class="hourly-forecast">
          <div 
            v-for="(hour, index) in weatherData.forecast.hourly.slice(0, 5)" 
            :key="index" 
            class="forecast-item"
            v-voix="hour.time + ' forecast'"
          >
            <div class="forecast-time">{{ hour.time }}</div>
            <div class="forecast-icon">{{ getWeatherIcon(hour.weather.icon) }}</div>
            <div class="forecast-temp">{{ hour.temp }}°</div>
          </div>
        </div>
      </div>

      <!-- Daily Forecast Preview -->
      <div class="forecast-section" v-voix="'daily forecast'">
        <div class="section-header">
          <h3>7-Day Forecast</h3>
          <button 
            class="view-more-button" 
            @click="goToDetails" 
            v-voix="'view detailed daily forecast'"
            hint="View more detailed 7-day forecast information"
          >
            View more
          </button>
        </div>
        <div class="daily-forecast">
          <div 
            v-for="(day, index) in weatherData.forecast.daily.slice(0, 5)" 
            :key="index" 
            class="forecast-item"
            v-voix="day.day + ' forecast'"
          >
            <div class="forecast-day">{{ day.day }}</div>
            <div class="forecast-icon">{{ getWeatherIcon(day.weather.icon) }}</div>
            <div class="forecast-temp-range">
              <span class="high-temp">{{ day.temp.max }}°</span>
              <span class="low-temp">{{ day.temp.min }}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #3a7ecc;
}

.location-bar {
  margin-bottom: 1rem;
}

.location-bar h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.current-weather-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
  text-align: center;
}

.weather-icon-large {
  font-size: 4rem;
  margin-bottom: 0.5rem;
}

.temperature-display {
  margin-bottom: 1rem;
}

.current-temp {
  font-size: 3rem;
  font-weight: 700;
}

.weather-description {
  display: block;
  font-size: 1.2rem;
  color: var(--light-text);
}

.weather-details {
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-label {
  font-size: 0.9rem;
  color: var(--light-text);
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.high-low {
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.forecast-section {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.view-more-button {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
}

.hourly-forecast, .daily-forecast {
  display: flex;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  gap: 1rem;
}

.forecast-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.forecast-time, .forecast-day {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.forecast-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.forecast-temp {
  font-weight: 600;
}

.forecast-temp-range {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.high-temp, .low-temp {
  font-size: 0.9rem;
}

.high-temp {
  font-weight: 600;
}

.low-temp {
  color: var(--light-text);
}

@media (min-width: 768px) {
  .home-container {
    padding: 2rem;
  }
  
  .forecast-item {
    min-width: 80px;
  }
}
</style>
