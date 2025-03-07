import { Station } from '../models/Station';
import { FillUp } from '../models/FillUp';

// Gas station brand names
const STATION_BRANDS = [
  'FuelMax',
  'EcoGas',
  'PetroPlus',
  'GreenFuel',
  'RapidGas',
  'ValuePetro',
  'PrimeFuel',
  'QuickStop',
  'MetroGas',
  'NaturalFuel'
];

// Street names
const STREET_NAMES = [
  'Main Street',
  'Oak Avenue',
  'Maple Road',
  'Park Lane',
  'Cedar Drive',
  'Pine Street',
  'Elm Road',
  'Washington Avenue',
  'Central Boulevard',
  'Riverside Drive',
  'Lake Road',
  'Forest Avenue',
  'Highland Drive',
  'Sunset Boulevard',
  'Mountain View Road'
];

// City names
const CITIES = [
  'Springfield',
  'Riverdale',
  'Oakwood',
  'Maplewood',
  'Fairview',
  'Lakeside',
  'Hillcrest',
  'Georgetown',
  'Kingston',
  'Burlington'
];

// Amenities that stations might have
const AMENITIES = [
  'Car Wash',
  'ATM',
  'Convenience Store',
  'Coffee Shop',
  'Restaurant',
  'Restrooms',
  'Air Pump',
  'Vacuum',
  'EV Charging',
  'Truck Parking'
];

/**
 * Generates a random number between min and max, rounded to the specified number of decimal places
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} [decimalPlaces=2] - Number of decimal places to round to
 * @returns {number} - Random number
 */
function randomNumber(min, max, decimalPlaces = 2) {
  const random = Math.random() * (max - min) + min;
  return Number(random.toFixed(decimalPlaces));
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random array of items from a source array
 * @param {Array} sourceArray - Array to select from
 * @param {number} [minItems=0] - Minimum number of items to select
 * @param {number} [maxItems] - Maximum number of items to select
 * @returns {Array} - Array of randomly selected items
 */
function randomArrayItems(sourceArray, minItems = 0, maxItems) {
  const max = maxItems || sourceArray.length;
  const count = randomInt(minItems, max);
  const shuffled = [...sourceArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Generates a random street address
 * @returns {string} - Random street address
 */
function generateAddress() {
  const number = randomInt(1, 9999);
  const street = STREET_NAMES[randomInt(0, STREET_NAMES.length - 1)];
  const city = CITIES[randomInt(0, CITIES.length - 1)];
  return `${number} ${street}, ${city}`;
}

/**
 * Generates random price history for a station
 * @param {number} basePrice - Base price to generate history around
 * @param {number} [monthsBack=6] - Number of months of history to generate
 * @returns {Array} - Array of price history objects
 */
function generatePriceHistory(basePrice, monthsBack = 6) {
  const priceHistory = [];
  const now = new Date();
  
  // Generate price points approximately every two weeks
  for (let i = 0; i < monthsBack * 2; i++) {
    const date = new Date();
    date.setDate(now.getDate() - (i * 15)); // Every ~15 days
    
    // Price fluctuates around the base price
    const variance = (Math.random() - 0.5) * 0.4; // +/- $0.20
    const price = basePrice + variance;
    
    priceHistory.push({
      date: date.toISOString().split('T')[0],
      unleaded: parseFloat(price.toFixed(2)),
      premium: parseFloat((price + randomNumber(0.2, 0.4)).toFixed(2)),
      diesel: parseFloat((price + randomNumber(-0.1, 0.2)).toFixed(2))
    });
  }
  
  // Return sorted with oldest first
  return priceHistory.reverse();
}

/**
 * Generates random reviews for a station
 * @param {number} [count=3] - Number of reviews to generate
 * @returns {Array} - Array of review objects
 */
function generateReviews(count = 3) {
  const reviews = [];
  const reviewTexts = [
    "Great prices and friendly staff!",
    "Clean facilities and good service.",
    "Convenient location with competitive prices.",
    "Fast service but a bit expensive.",
    "Good quality fuel, my car runs better.",
    "Nice amenities and clean restrooms.",
    "Not the cheapest, but worth it for the quality.",
    "Friendly staff but often crowded.",
    "Good location, but prices fluctuate a lot.",
    "Reliable station with fair prices."
  ];
  
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(now.getDate() - randomInt(1, 90)); // Random date in last 90 days
    
    reviews.push({
      id: `rev-${i}-${Date.now()}`,
      author: `User${randomInt(100, 999)}`,
      date: date.toISOString().split('T')[0],
      rating: randomInt(3, 5),
      text: reviewTexts[randomInt(0, reviewTexts.length - 1)]
    });
  }
  
  // Sort with newest first
  return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Generates random gas stations
 * @param {number} [count=10] - Number of stations to generate
 * @returns {Station[]} - Array of station objects
 */
export function generateStations(count = 10) {
  const stations = [];
  
  for (let i = 0; i < count; i++) {
    const baseUnleadedPrice = randomNumber(1.2, 1.6);
    
    // Generate random coordinates (for demo purposes)
    const latitude = 40.7128 + (Math.random() - 0.5) * 0.1; // Around NYC
    const longitude = -74.0060 + (Math.random() - 0.5) * 0.1;
    
    stations.push(new Station({
      stationId: `st-${String(i + 1).padStart(3, '0')}`,
      name: STATION_BRANDS[randomInt(0, STATION_BRANDS.length - 1)],
      address: generateAddress(),
      prices: {
        unleaded: baseUnleadedPrice,
        premium: baseUnleadedPrice + randomNumber(0.2, 0.4),
        diesel: baseUnleadedPrice + randomNumber(-0.1, 0.2)
      },
      amenities: randomArrayItems(AMENITIES, 1, 5),
      priceHistory: generatePriceHistory(baseUnleadedPrice),
      location: {
        latitude,
        longitude
      },
      favorite: Math.random() > 0.8, // ~20% chance of being a favorite
      reviews: generateReviews(randomInt(0, 5))
    }));
  }
  
  return stations;
}

/**
 * Generates sample fill-up entries
 * @param {number} [count=5] - Number of fill-ups to generate
 * @param {Station[]} stations - Array of stations to reference
 * @returns {FillUp[]} - Array of fill-up objects
 */
export function generateFillUps(count = 5, stations = []) {
  const fillUps = [];
  let currentOdometer = randomInt(10000, 20000);
  
  // Generate entries from oldest to newest for consistent odometer readings
  for (let i = 0; i < count; i++) {
    // Calculate a date going back from today, with the oldest first
    const daysAgo = (count - i - 1) * 14; // Every ~2 weeks
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    // Each fill-up adds some mileage
    currentOdometer += randomInt(300, 800);
    
    // Randomly select a station if available
    const stationId = stations.length > 0 
      ? stations[randomInt(0, stations.length - 1)].stationId
      : '';
    
    // Create the fill-up entry
    fillUps.push(new FillUp({
      entryId: `fillup-${String(i + 1).padStart(3, '0')}`,
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      odometer: currentOdometer,
      volume: randomNumber(30, 60),
      pricePerLiter: randomNumber(1.2, 1.8),
      stationId
    }));
  }
  
  // Return the array sorted by date with newest first for display
  return fillUps.reverse();
}