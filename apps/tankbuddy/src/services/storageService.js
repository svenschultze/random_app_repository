import { Station } from '../models/Station';
import { FillUp } from '../models/FillUp';
import { generateStations, generateFillUps } from './generateData';

const STORAGE_KEYS = {
  STATIONS: 'tankbuddy_stations',
  FILLUPS: 'tankbuddy_fillups'
};

/**
 * Saves data to local storage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
    return false;
  }
}

/**
 * Loads data from local storage
 * @param {string} key - Storage key
 * @returns {any|null} - Parsed data or null if not found
 */
function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading from localStorage: ${error}`);
    return null;
  }
}

/**
 * Gets all stations
 * @param {boolean} [forceGenerate=false] - Whether to force generate new stations
 * @returns {Station[]} - Array of station objects
 */
export function getStations(forceGenerate = false) {
  // Check if we should generate new data or not
  if (forceGenerate) {
    const stations = generateStations(10);
    saveToStorage(STORAGE_KEYS.STATIONS, stations);
    return stations;
  }
  
  // Load existing data or generate if none exists
  const stations = loadFromStorage(STORAGE_KEYS.STATIONS);
  if (stations && stations.length) {
    // Convert plain objects to Station instances
    return stations.map(station => new Station(station));
  } else {
    // Generate new data if none exists
    const newStations = generateStations(10);
    saveToStorage(STORAGE_KEYS.STATIONS, newStations);
    return newStations;
  }
}

/**
 * Gets all fill-ups
 * @param {boolean} [forceGenerate=false] - Whether to force generate new fill-ups
 * @returns {FillUp[]} - Array of fill-up objects
 */
export function getFillUps(forceGenerate = false) {
  // Get stations to reference in the fill-ups
  const stations = getStations();
  
  // Check if we should generate new data
  if (forceGenerate) {
    const fillUps = generateFillUps(5, stations);
    saveToStorage(STORAGE_KEYS.FILLUPS, fillUps);
    return fillUps;
  }
  
  // Load existing data or generate if none exists
  const fillUps = loadFromStorage(STORAGE_KEYS.FILLUPS);
  if (fillUps && fillUps.length) {
    // Convert plain objects to FillUp instances
    return fillUps.map(fillUp => new FillUp(fillUp));
  } else {
    // Generate new data if none exists
    const newFillUps = generateFillUps(5, stations);
    saveToStorage(STORAGE_KEYS.FILLUPS, newFillUps);
    return newFillUps;
  }
}

/**
 * Adds a new fill-up
 * @param {FillUp} fillUp - FillUp object to add
 * @returns {boolean} - Whether the operation was successful
 */
export function addFillUp(fillUp) {
  const fillUps = getFillUps();
  
  // Assign a new ID if not provided
  if (!fillUp.entryId) {
    fillUp.entryId = `fillup-${String(fillUps.length + 1).padStart(3, '0')}`;
  }
  
  // Add to the beginning of the array (newest first)
  fillUps.unshift(fillUp);
  
  return saveToStorage(STORAGE_KEYS.FILLUPS, fillUps);
}

/**
 * Gets a station by ID
 * @param {string} stationId - Station ID to find
 * @returns {Station|null} - Found station or null
 */
export function getStationById(stationId) {
  const stations = getStations();
  const station = stations.find(s => s.stationId === stationId);
  return station || null;
}

/**
 * Toggles a station's favorite status
 * @param {string} stationId - Station ID to toggle
 * @returns {boolean} - Whether the operation was successful
 */
export function toggleStationFavorite(stationId) {
  const stations = getStations();
  const index = stations.findIndex(s => s.stationId === stationId);
  
  if (index === -1) {
    return false;
  }
  
  stations[index].favorite = !stations[index].favorite;
  return saveToStorage(STORAGE_KEYS.STATIONS, stations);
}

/**
 * Gets all favorite stations
 * @returns {Station[]} - Array of favorite stations
 */
export function getFavoriteStations() {
  const stations = getStations();
  return stations.filter(station => station.favorite);
}

/**
 * Gets price history for a specific station
 * @param {string} stationId - Station ID
 * @returns {Array|null} - Price history array or null if not found
 */
export function getStationPriceHistory(stationId) {
  const station = getStationById(stationId);
  return station ? station.priceHistory : null;
}

/**
 * Compares fuel prices among stations
 * @param {string} fuelType - Type of fuel to compare (unleaded, premium, diesel)
 * @returns {Array} - Stations sorted by price (ascending)
 */
export function compareStationPrices(fuelType = 'unleaded') {
  const stations = getStations();
  
  return [...stations]
    .filter(station => station.prices && station.prices[fuelType] !== undefined)
    .sort((a, b) => a.prices[fuelType] - b.prices[fuelType]);
}

/**
 * Gets the cheapest stations for a specific fuel type
 * @param {string} fuelType - Type of fuel (unleaded, premium, diesel)
 * @param {number} [limit=3] - Maximum number of stations to return
 * @returns {Array} - Limited array of cheapest stations
 */
export function getCheapestStations(fuelType = 'unleaded', limit = 3) {
  return compareStationPrices(fuelType).slice(0, limit);
}

/**
 * Adds a review to a station
 * @param {string} stationId - Station ID
 * @param {Object} review - Review object
 * @returns {boolean} - Whether the operation was successful
 */
export function addStationReview(stationId, review) {
  const stations = getStations();
  const index = stations.findIndex(s => s.stationId === stationId);
  
  if (index === -1) {
    return false;
  }
  
  // Create a review with ID and current date
  const newReview = {
    id: `rev-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    ...review
  };
  
  // Add to beginning of array (newest first)
  stations[index].reviews.unshift(newReview);
  
  // Recalculate rating
  const reviews = stations[index].reviews;
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    stations[index].rating = parseFloat((totalRating / reviews.length).toFixed(1));
  }
  
  return saveToStorage(STORAGE_KEYS.STATIONS, stations);
}

/**
 * Updates an existing fill-up
 * @param {string} entryId - ID of the fill-up to update
 * @param {FillUp} updatedFillUp - Updated fill-up data
 * @returns {boolean} - Whether the operation was successful
 */
export function updateFillUp(entryId, updatedFillUp) {
  const fillUps = getFillUps();
  const index = fillUps.findIndex(f => f.entryId === entryId);
  
  if (index === -1) {
    return false;
  }
  
  fillUps[index] = updatedFillUp;
  return saveToStorage(STORAGE_KEYS.FILLUPS, fillUps);
}

/**
 * Deletes a fill-up
 * @param {string} entryId - ID of the fill-up to delete
 * @returns {boolean} - Whether the operation was successful
 */
export function deleteFillUp(entryId) {
  const fillUps = getFillUps();
  const filteredFillUps = fillUps.filter(f => f.entryId !== entryId);
  
  if (filteredFillUps.length === fillUps.length) {
    return false; // No item was removed
  }
  
  return saveToStorage(STORAGE_KEYS.FILLUPS, filteredFillUps);
}

/**
 * Calculates statistics from fill-up data
 * @returns {Object} - Object with calculated statistics
 */
export function calculateStats() {
  const fillUps = getFillUps();
  
  if (!fillUps.length) {
    return {
      totalSpent: 0,
      averagePricePerLiter: 0,
      averageConsumption: 0,
      totalVolume: 0,
      fillUpsCount: 0
    };
  }
  
  // Calculate total spent and total volume
  const totalSpent = fillUps.reduce((sum, fillUp) => sum + fillUp.totalCost, 0);
  const totalVolume = fillUps.reduce((sum, fillUp) => sum + fillUp.volume, 0);
  
  // Calculate average price per liter
  const averagePricePerLiter = totalSpent / totalVolume;
  
  // Calculate consumption (liters per 100km) for fill-ups with valid odometer readings
  let consumptionData = [];
  for (let i = 0; i < fillUps.length - 1; i++) {
    const current = fillUps[i];
    const previous = fillUps[i + 1];
    
    // Check if we have valid odometer readings for consecutive fill-ups
    if (current.odometer && previous.odometer && current.odometer > previous.odometer) {
      const distance = current.odometer - previous.odometer;
      const consumption = (current.volume / distance) * 100; // L/100km
      
      consumptionData.push(consumption);
    }
  }
  
  // Calculate average consumption if we have data
  const averageConsumption = consumptionData.length 
    ? consumptionData.reduce((sum, val) => sum + val, 0) / consumptionData.length
    : 0;
    
  return {
    totalSpent: parseFloat(totalSpent.toFixed(2)),
    averagePricePerLiter: parseFloat(averagePricePerLiter.toFixed(2)),
    averageConsumption: parseFloat(averageConsumption.toFixed(2)),
    totalVolume: parseFloat(totalVolume.toFixed(2)),
    fillUpsCount: fillUps.length
  };
}

/**
 * Gets monthly spending from fill-up data
 * @param {number} [months=6] - Number of months to include
 * @returns {Array} - Array of objects with month and total spent
 */
export function getMonthlySpending(months = 6) {
  const fillUps = getFillUps();
  const monthlyData = [];
  
  // Get the current date
  const now = new Date();
  
  // Create an array of the last X months
  for (let i = 0; i < months; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = monthDate.toLocaleString('default', { month: 'short' });
    const year = monthDate.getFullYear();
    const monthKey = `${year}-${monthDate.getMonth() + 1}`;
    
    monthlyData.push({
      month: monthName,
      year,
      monthKey,
      totalSpent: 0
    });
  }
  
  // Calculate total spent for each month
  fillUps.forEach(fillUp => {
    const fillUpDate = new Date(fillUp.date);
    const monthKey = `${fillUpDate.getFullYear()}-${fillUpDate.getMonth() + 1}`;
    
    const month = monthlyData.find(m => m.monthKey === monthKey);
    if (month) {
      month.totalSpent += fillUp.totalCost;
    }
  });
  
  // Round values and reverse the order (oldest to newest)
  return monthlyData
    .map(month => ({
      ...month,
      totalSpent: parseFloat(month.totalSpent.toFixed(2))
    }))
    .reverse();
}