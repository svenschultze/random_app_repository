<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const locationId = route.params.location
const locationName = ref('Loading...')
const weatherData = ref(null)
const loading = ref(true)
const error = ref(null)
const activeTab = ref('hourly')

// Mock weather data for the demo
const mockWeatherData = {
  current: {
    temp: 75,
    feels_like: 78,
    humidity: 65,
    wind_speed: 8,
    pressure: 1012,
    visibility: 10,
    uv_index: 5,
    dew_point: 55,
    weather: {
      main: 'Partly Cloudy',
      description: 'Partly cloudy with a slight chance of showers',
      icon: 'cloud'
    }
  },
  forecast: {
    daily: [
      { day: 'Today', temp: { max: 80, min: 70 }, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 10, humidity: 65, wind_speed: 8, sunrise: '6:45 AM', sunset: '7:30 PM' },
      { day: 'Mon', temp: { max: 82, min: 69 }, weather: { main: 'Sunny', icon: 'sun' }, pop: 0, humidity: 60, wind_speed: 6, sunrise: '6:46 AM', sunset: '7:28 PM' },
      { day: 'Tue', temp: { max: 85, min: 72 }, weather: { main: 'Sunny', icon: 'sun' }, pop: 0, humidity: 58, wind_speed: 5, sunrise: '6:47 AM', sunset: '7:27 PM' },
      { day: 'Wed', temp: { max: 79, min: 68 }, weather: { main: 'Rainy', icon: 'rain' }, pop: 80, humidity: 75, wind_speed: 12, sunrise: '6:48 AM', sunset: '7:25 PM' },
      { day: 'Thu', temp: { max: 77, min: 65 }, weather: { main: 'Cloudy', icon: 'cloud' }, pop: 30, humidity: 70, wind_speed: 10, sunrise: '6:49 AM', sunset: '7:23 PM' },
      { day: 'Fri', temp: { max: 76, min: 64 }, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 20, humidity: 68, wind_speed: 7, sunrise: '6:50 AM', sunset: '7:22 PM' },
      { day: 'Sat', temp: { max: 78, min: 66 }, weather: { main: 'Sunny', icon: 'sun' }, pop: 0, humidity: 62, wind_speed: 6, sunrise: '6:51 AM', sunset: '7:20 PM' }
    ],
    hourly: [
      { time: 'Now', temp: 75, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 10, humidity: 65, wind_speed: 8 },
      { time: '1 PM', temp: 76, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 10, humidity: 64, wind_speed: 8 },
      { time: '2 PM', temp: 77, weather: { main: 'Cloudy', icon: 'cloud' }, pop: 15, humidity: 63, wind_speed: 9 },
      { time: '3 PM', temp: 79, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 20, humidity: 62, wind_speed: 9 },
      { time: '4 PM', temp: 78, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 15, humidity: 62, wind_speed: 8 },
      { time: '5 PM', temp: 77, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 10, humidity: 63, wind_speed: 7 },
      { time: '6 PM', temp: 76, weather: { main: 'Clear', icon: 'sun' }, pop: 5, humidity: 64, wind_speed: 6 },
      { time: '7 PM', temp: 74, weather: { main: 'Clear', icon: 'sun' }, pop: 0, humidity: 65, wind_speed: 5 },
      { time: '8 PM', temp: 72, weather: { main: 'Clear', icon: 'sun' }, pop: 0, humidity: 67, wind_speed: 4 },
      { time: '9 PM', temp: 70, weather: { main: 'Clear', icon: 'sun' }, pop: 0, humidity: 70, wind_speed: 3 },
      { time: '10 PM', temp: 69, weather: { main: 'Clear', icon: 'sun' }, pop: 0, humidity: 72, wind_speed: 3 },
      { time: '11 PM', temp: 68, weather: { main: 'Clear', icon: 'sun' }, pop: 0, humidity: 75, wind_speed: 2 },
      { time: '12 AM', temp: 67, weather: { main: 'Clear', icon: 'sun' }, pop: 0, humidity: 78, wind_speed: 2 },
      { time: '1 AM', temp: 66, weather: { main: 'Clear', icon: 'sun' }, pop: 0, humidity: 80, wind_speed: 2 },
      { time: '2 AM', temp: 65, weather: { main: 'Clear', icon: 'sun' }, pop: 0, humidity: 82, wind_speed: 2 },
      { time: '3 AM', temp: 65, weather: { main: 'Clear', icon: 'sun' }, pop: 0, humidity: 82, wind_speed: 1 },
      { time: '4 AM', temp: 64, weather: { main: 'Clear', icon: 'sun' }, pop: 0, humidity: 83, wind_speed: 1 },
      { time: '5 AM', temp: 64, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 0, humidity: 83, wind_speed: 2 },
      { time: '6 AM', temp: 65, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 0, humidity: 82, wind_speed: 3 },
      { time: '7 AM', temp: 67, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 0, humidity: 80, wind_speed: 4 },
      { time: '8 AM', temp: 69, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 5, humidity: 75, wind_speed: 5 },
      { time: '9 AM', temp: 72, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 5, humidity: 70, wind_speed: 6 },
      { time: '10 AM', temp: 74, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 5, humidity: 68, wind_speed: 7 },
      { time: '11 AM', temp: 76, weather: { main: 'Partly Cloudy', icon: 'cloud' }, pop: 10, humidity: 65, wind_speed: 8 }
    ]
  }
}

// Helper function to generate random weather data variations
const getRandomWeatherVariation = () => {
  // Create a deep copy of mock data to modify
  const weatherVariation = JSON.parse(JSON.stringify(mockWeatherData));
  
  // Randomize current temperature (65-85°F)
  const baseTemp = Math.floor(65 + Math.random() * 20);
  weatherVariation.current.temp = baseTemp;
  weatherVariation.current.feels_like = baseTemp + Math.floor(Math.random() * 6) - 2; // +/- 2 degrees
  
  // Randomize conditions
  const conditions = ['Clear', 'Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorms', 'Foggy'];
  const icons = ['sun', 'sun', 'cloud', 'cloud', 'rain', 'thunder', 'fog'];
  const conditionIndex = Math.floor(Math.random() * conditions.length);
  weatherVariation.current.weather.main = conditions[conditionIndex];
  weatherVariation.current.weather.description = conditions[conditionIndex] + ' conditions';
  weatherVariation.current.weather.icon = icons[conditionIndex];
  
  // Randomize other current values
  weatherVariation.current.humidity = Math.floor(40 + Math.random() * 50); // 40-90%
  weatherVariation.current.wind_speed = Math.floor(2 + Math.random() * 18); // 2-20 mph
  
  // Adjust forecast data based on current conditions
  weatherVariation.forecast.daily.forEach((day, index) => {
    const dayTemp = baseTemp + Math.floor(Math.random() * 10) - 5; // +/- 5 degrees from base
    day.temp.max = dayTemp + Math.floor(Math.random() * 8); // 0-8 degrees warmer
    day.temp.min = dayTemp - Math.floor(Math.random() * 8) - 2; // 2-10 degrees cooler
    
    // Randomize day conditions (weighted toward current)
    const dayCond = Math.random() < 0.4 
      ? conditionIndex 
      : Math.floor(Math.random() * conditions.length);
    day.weather.main = conditions[dayCond];
    day.weather.icon = icons[dayCond];
    
    // Randomize precipitation probability
    day.pop = Math.floor(Math.random() * 100);
  });
  
  // Adjust hourly forecast
  weatherVariation.forecast.hourly.forEach((hour, index) => {
    // Temperature follows a curve: rising until mid-day, falling after
    const tempOffset = index < 12 
      ? index * 0.5 
      : (24 - index) * 0.5;
    hour.temp = Math.floor(baseTemp + tempOffset + (Math.random() * 4) - 2);
    
    // Conditions are more consistent hour to hour
    const hourCond = Math.random() < 0.7 
      ? conditionIndex 
      : Math.floor(Math.random() * conditions.length);
    hour.weather.main = conditions[hourCond];
    hour.weather.icon = icons[hourCond];
    
    // Randomize precipitation probability
    hour.pop = Math.floor(Math.random() * 100);
  });
  
  return weatherVariation;
};

const fetchWeatherDetails = () => {
  loading.value = true
  error.value = null
  
  // In a real app, this would be an API call with the locationId
  // For this demo, we'll use mock data with a timeout to simulate loading
  
  setTimeout(() => {
    // Set location name based on ID param
    if (locationId === 'current') {
      locationName.value = 'San Francisco, CA'
    } else if (locationId === '1' || locationId === '101') {
      locationName.value = 'New York, NY'
    } else if (locationId === '2' || locationId === '301') {
      locationName.value = 'San Francisco, CA'
    } else if (locationId === '3') {
      locationName.value = 'Chicago, IL'
    } else if (locationId === '201') {
      locationName.value = 'London, UK'
    } else if (locationId === '401') {
      locationName.value = 'Paris, France'
    } else if (locationId === '402') {
      locationName.value = 'Paris, TX'
    } else if (locationId === '102') {
      locationName.value = 'New York Mills, NY'
    } else if (locationId === '202') {
      locationName.value = 'London, ON'
    } else if (locationId === '302') {
      locationName.value = 'San Diego, CA'
    } else if (locationId === '303') {
      locationName.value = 'San Jose, CA'
    } else {
      // For dynamically generated IDs, use the route parameter as-is
      // This will be something like "Springfield, OH" or "Rivertown, MI"
      // The search component would have set this value
      try {
        // Try to get the location name from route query if available
        const routeName = route.query.name;
        if (routeName) {
          locationName.value = routeName;
        } else {
          locationName.value = 'Custom Location';
        }
      } catch (e) {
        locationName.value = 'Custom Location';
      }
    }
    
    // Generate randomized weather data
    weatherData.value = getRandomWeatherVariation();
    loading.value = false;
  }, 1000)
}

const switchTab = (tab) => {
  activeTab.value = tab
}

// Weather icons mapping
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

onMounted(fetchWeatherDetails)
</script>

<template>
  <div class="details-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container" v-voix="'loading weather details'">
      <div class="loading-spinner"></div>
      <p>Loading detailed weather data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container" v-voix="'error loading details'">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
    </div>

    <!-- Weather Details Display -->
    <div v-else-if="weatherData" class="weather-details-content">
      <div class="location-header" v-voix="'location name'">
        <h1>{{ locationName }}</h1>
      </div>
      
      <!-- Current Weather Summary -->
      <div class="current-summary" v-voix="'current weather summary'">
        <div class="weather-icon-large">
          {{ getWeatherIcon(weatherData.current.weather.icon) }}
        </div>
        <div class="temp-condition">
          <div class="current-temp">{{ weatherData.current.temp }}°F</div>
          <div class="weather-condition">{{ weatherData.current.weather.description }}</div>
        </div>
      </div>
      
      <!-- Additional Current Details -->
      <div class="details-grid" v-voix="'current weather details'">
        <div class="detail-box">
          <div class="detail-label">Feels Like</div>
          <div class="detail-value">{{ weatherData.current.feels_like }}°F</div>
        </div>
        <div class="detail-box">
          <div class="detail-label">Humidity</div>
          <div class="detail-value">{{ weatherData.current.humidity }}%</div>
        </div>
        <div class="detail-box">
          <div class="detail-label">Wind</div>
          <div class="detail-value">{{ weatherData.current.wind_speed }} mph</div>
        </div>
        <div class="detail-box">
          <div class="detail-label">Pressure</div>
          <div class="detail-value">{{ weatherData.current.pressure }} hPa</div>
        </div>
        <div class="detail-box">
          <div class="detail-label">UV Index</div>
          <div class="detail-value">{{ weatherData.current.uv_index }}</div>
        </div>
        <div class="detail-box">
          <div class="detail-label">Visibility</div>
          <div class="detail-value">{{ weatherData.current.visibility }} mi</div>
        </div>
      </div>
      
      <!-- Forecast Tabs -->
      <div class="forecast-tabs" v-voix="'forecast tabs'">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'hourly' }" 
          @click="switchTab('hourly')"
          v-voix="'hourly forecast tab'"
        >
          Hourly
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'daily' }" 
          @click="switchTab('daily')"
          v-voix="'daily forecast tab'"
        >
          Daily
        </button>
      </div>
      
      <!-- Hourly Forecast -->
      <div v-if="activeTab === 'hourly'" class="forecast-container" v-voix="'hourly forecast details'">
        <div class="hourly-list">
          <div 
            v-for="(hour, index) in weatherData.forecast.hourly" 
            :key="index" 
            class="hourly-item"
            v-voix="hour.time + ' forecast'"
          >
            <div class="hourly-time">{{ hour.time }}</div>
            <div class="hourly-icon">{{ getWeatherIcon(hour.weather.icon) }}</div>
            <div class="hourly-temp">{{ hour.temp }}°</div>
            <div class="hourly-pop">{{ hour.pop }}%</div>
          </div>
        </div>
      </div>
      
      <!-- Daily Forecast -->
      <div v-else-if="activeTab === 'daily'" class="forecast-container" v-voix="'daily forecast details'">
        <div class="daily-list">
          <div 
            v-for="(day, index) in weatherData.forecast.daily" 
            :key="index" 
            class="daily-item"
            v-voix="day.day + ' forecast'"
          >
            <div class="daily-day">{{ day.day }}</div>
            <div class="daily-icon">{{ getWeatherIcon(day.weather.icon) }}</div>
            <div class="daily-temps">
              <span class="max-temp">{{ day.temp.max }}°</span>
              <span class="min-temp">{{ day.temp.min }}°</span>
            </div>
            <div class="daily-details">
              <div class="daily-detail">
                <span class="detail-icon">💧</span>
                <span>{{ day.pop }}%</span>
              </div>
              <div class="daily-detail">
                <span class="detail-icon">💨</span>
                <span>{{ day.wind_speed }} mph</span>
              </div>
            </div>
            <div class="daily-sun-times">
              <div class="sunrise">
                <span class="sun-icon">🌅</span>
                <span>{{ day.sunrise }}</span>
              </div>
              <div class="sunset">
                <span class="sun-icon">🌇</span>
                <span>{{ day.sunset }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-container {
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

.location-header {
  margin-bottom: 1.5rem;
}

.location-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
}

.current-summary {
  display: flex;
  align-items: center;
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.weather-icon-large {
  font-size: 4rem;
  margin-right: 1.5rem;
}

.current-temp {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.weather-condition {
  font-size: 1.2rem;
  color: var(--light-text);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-box {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: var(--shadow);
}

.detail-label {
  font-size: 0.9rem;
  color: var(--light-text);
  margin-bottom: 0.5rem;
}

.detail-value {
  font-size: 1.2rem;
  font-weight: 600;
}

.forecast-tabs {
  display: flex;
  margin-bottom: 1rem;
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.tab-button {
  flex: 1;
  background: none;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tab-button.active {
  background-color: var(--primary-color);
  color: white;
}

.forecast-container {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.hourly-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hourly-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.hourly-item:last-child {
  border-bottom: none;
}

.hourly-time {
  width: 80px;
  font-weight: 600;
}

.hourly-icon {
  width: 60px;
  font-size: 1.5rem;
  text-align: center;
}

.hourly-temp {
  width: 60px;
  font-weight: 600;
  text-align: center;
}

.hourly-pop {
  color: var(--accent-color);
  font-size: 0.9rem;
}

.daily-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.daily-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.02);
}

.daily-day {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.daily-icon {
  font-size: 2rem;
  margin: 0.5rem 0;
}

.daily-temps {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.max-temp {
  font-weight: 600;
}

.min-temp {
  color: var(--light-text);
}

.daily-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.daily-detail {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.detail-icon {
  font-size: 1rem;
}

.daily-sun-times {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--light-text);
}

.sunrise, .sunset {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.sun-icon {
  font-size: 1rem;
}

@media (min-width: 768px) {
  .details-container {
    padding: 2rem;
  }
  
  .details-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .daily-item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .daily-icon, .daily-day, .daily-temps, .daily-details, .daily-sun-times {
    margin: 0;
    width: 20%;
  }
}
</style>