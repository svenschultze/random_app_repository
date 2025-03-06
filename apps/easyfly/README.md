# EasyFly - Flight Booking App

EasyFly is a simple, user-friendly flight booking application built with Vue 3 and Vite. It allows users to search for flights, book tickets, manage their bookings, and set price alerts, all without requiring user authentication.

## Features

- **Flight Search**: Search for flights by departure and arrival airports, dates, and number of passengers.
- **Booking Management**: View and manage all your flight bookings in one place.
- **Price Alerts**: Set alerts for price drops on specific routes and dates.
- **Flight Status Notifications**: Get notified about flight status changes, gate changes, etc.
- **Local Storage**: Optional local storage of passenger and payment details for faster booking.
- **No Authentication Required**: Use the app without creating an account or logging in.
- **Accessibility**: Built with accessibility in mind, including screen reader support via vue-voix.

## Project Structure

- **Views**: Main app screens located in `src/views/`
  - HomeView: Landing page with flight search
  - SearchResultsView: Displays search results
  - FlightDetailsView: Detailed information about a selected flight
  - BookingView: Passenger information and payment page
  - ConfirmationView: Booking confirmation details
  - MyBookingsView: List of all booked flights
  - AlertsView: Manage price alerts and notifications
  - SettingsView: Configure app preferences and data storage options
  - SplashView: Initial loading screen

- **Components**: Reusable UI components in `src/components/`

## Technologies Used

- **Vue 3**: With Composition API and `<script setup>` syntax
- **Vue Router**: For navigation between views
- **Vite**: For fast development and building
- **Vue Voix**: For accessibility and screen reader support

## Accessibility Features

The app includes several accessibility enhancements:
- Semantic HTML structure
- ARIA attributes for improved screen reader support
- Keyboard navigation support
- Voice interface integration via vue-voix
- High contrast color scheme
- Responsive design for all device sizes

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

## Notes

- This is a demo application and does not connect to real flight APIs.
- No data is sent to any external servers - all data is stored locally in the browser.
- In a production app, you would integrate with real flight search APIs and payment processors.
