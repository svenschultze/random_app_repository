# InstaWeather

InstaWeather is a no-signup, no-login weather application that provides instant access to accurate weather information. The app focuses on convenience and minimal friction, giving users immediate weather data without requiring account creation.

## Features

- **Instant Local Weather:** Auto-detects user location (with permission) and immediately displays current conditions
- **Location Search:** Search for weather by city name or postal code
- **Detailed Forecasts:** View hourly and 7-day forecasts with detailed weather information
- **Recent Searches:** Stores recent location searches locally on the device
- **Customizable Settings:** Choose temperature units (Fahrenheit/Celsius) and opt in/out of notifications
- **Privacy-Focused:** No accounts required, all data stored locally on device
- **Accessibility:** Fully accessible with vue-voix integration for screen readers and assistive technologies

## Screenshots

(Screenshots would be placed here in a real project)

## Technologies Used

- Vue.js 3 with Composition API
- Vue Router for navigation
- CSS3 with responsive design (mobile-first approach)
- Geolocation API for location detection
- vue-voix for accessibility

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Development Notes

- The app currently uses mock data for demonstration purposes
- In a production version, it would connect to a weather API like OpenWeatherMap, WeatherAPI, or similar services
- Local storage would be implemented for saving user preferences and recent searches

## Accessibility 

This application is built with accessibility in mind using the vue-voix integration. All interactive elements have proper labeling and descriptions for screen readers and assistive technologies.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

InstaWeather Team
