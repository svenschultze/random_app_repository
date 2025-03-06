<template>
  <div class="about-container">
    <h1 class="about-title" v-voix="'about instaweather'">About InstaWeather</h1>
    
    <div class="about-card" v-voix="'app description'">
      <h2 class="section-title">Our App</h2>
      <p>
        InstaWeather provides instant access to accurate weather information without requiring any account creation or login. 
        Get current conditions and forecasts with just one tap.
      </p>
    </div>
    
    <div class="about-card" v-voix="'key features'">
      <h2 class="section-title">Key Features</h2>
      <ul class="feature-list">
        <li>Auto-detect location for instant local weather</li>
        <li>Search for weather in any city worldwide</li>
        <li>Hourly and 7-day forecasts</li>
        <li>Detailed weather information including humidity, wind speed, UV index, and more</li>
        <li>Option to save recent searches</li>
        <li>Temperature units in Fahrenheit or Celsius</li>
        <li>Optional severe weather alerts</li>
      </ul>
    </div>
    
    <div class="about-card" v-voix="'privacy information'">
      <h2 class="section-title">Privacy</h2>
      <p>
        InstaWeather is designed with your privacy in mind. We only request your location to provide 
        accurate local weather information, and we don't store any personal data in the cloud.
      </p>
      <p>
        All preferences and recent searches are stored locally on your device, and you can 
        clear this data at any time in the Settings page.
      </p>
    </div>
    
    <div class="about-card" v-voix="'data sources'">
      <h2 class="section-title">Data Sources</h2>
      <p>
        Weather data is provided by trusted meteorological services to ensure accuracy and reliability.
        Forecasts are regularly updated to give you the most current information available.
      </p>
    </div>
    
    <div class="about-card" v-voix="'contact information'">
      <h2 class="section-title">Contact Us</h2>
      <p>
        Have questions, feedback, or suggestions? We'd love to hear from you!
      </p>
      <p>
        Email: <a href="mailto:support@instaweather.example.com" v-voix="'support email'">support@instaweather.example.com</a>
      </p>
    </div>
    
    <div class="version-info" v-voix="'version information'">
      Version 1.0.0 | &copy; 2025 InstaWeather
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.about-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.about-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--secondary-color);
}

p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

p:last-child {
  margin-bottom: 0;
}

.feature-list {
  padding-left: 1.5rem;
  margin-bottom: 0;
}

.feature-list li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.feature-list li:last-child {
  margin-bottom: 0;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.version-info {
  text-align: center;
  font-size: 0.9rem;
  color: var(--light-text);
  margin-top: 2rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .about-container {
    padding: 2rem;
  }
  
  .about-title {
    font-size: 1.8rem;
  }
}
</style>
