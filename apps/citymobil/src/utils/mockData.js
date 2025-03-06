// Mock data generator for StadtMobil app

// German cities for route generation
const germanCities = [
  'Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 
  'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen', 'Bremen', 'Dresden'
];

// Public transport types
const transportTypes = [
  { name: 'U-Bahn', icon: '🚇', color: '#0078D7' },
  { name: 'S-Bahn', icon: '🚆', color: '#107C10' },
  { name: 'Bus', icon: '🚌', color: '#D83B01' },
  { name: 'Straßenbahn', icon: '🚊', color: '#FFB900' }
];

// Generate random time between 5-60 minutes
const getRandomTime = () => Math.floor(Math.random() * 56) + 5;

// Generate random delay 0-15 minutes
const getRandomDelay = () => Math.floor(Math.random() * 16);

// Generate random price between 2-15 euros
const getRandomPrice = () => (Math.floor(Math.random() * 1300) + 200) / 100;

// Generate random discount percentage
const getRandomDiscount = () => Math.floor(Math.random() * 5) * 5;

// Generate random route segments
const generateRouteSegments = (count = 3) => {
  const segments = [];
  const usedCities = new Set();
  
  for (let i = 0; i < count + 1; i++) {
    let city;
    do {
      city = germanCities[Math.floor(Math.random() * germanCities.length)];
    } while (usedCities.has(city));
    
    usedCities.add(city);
    
    if (i > 0) {
      const transport = transportTypes[Math.floor(Math.random() * transportTypes.length)];
      const travelTime = getRandomTime();
      const delay = getRandomDelay();
      
      segments.push({
        from: Array.from(usedCities)[i-1],
        to: city,
        transportType: transport.name,
        transportIcon: transport.icon,
        transportColor: transport.color,
        travelTime,
        delay,
        departureTime: generateRandomTime(),
        lineNumber: generateLineNumber(transport.name)
      });
    }
  }
  
  return segments;
};

// Generate random time in HH:MM format
const generateRandomTime = () => {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Generate realistic line numbers based on transport type
const generateLineNumber = (transportType) => {
  switch (transportType) {
    case 'U-Bahn':
      return `U${Math.floor(Math.random() * 9) + 1}`;
    case 'S-Bahn':
      return `S${Math.floor(Math.random() * 20) + 1}`;
    case 'Bus':
      return Math.floor(Math.random() * 300) + 100;
    case 'Straßenbahn':
      return Math.floor(Math.random() * 20) + 1;
    default:
      return Math.floor(Math.random() * 100);
  }
};

// Generate random ticket types
const generateTickets = () => {
  const basePrice = getRandomPrice();
  
  return {
    shortTerm: [
      {
        id: 'single',
        name: 'Einzelfahrschein',
        description: 'Gültig für eine Fahrt',
        price: basePrice,
        duration: '90 Minuten'
      },
      {
        id: 'day',
        name: 'Tageskarte',
        description: 'Unbegrenzte Fahrten für einen Tag',
        price: basePrice * 2.2,
        duration: '24 Stunden'
      },
      {
        id: 'group',
        name: 'Gruppenkarte',
        description: 'Für bis zu 5 Personen',
        price: basePrice * 3.5,
        duration: '24 Stunden'
      }
    ],
    longTerm: [
      {
        id: 'week',
        name: 'Wochenkarte',
        description: 'Unbegrenzte Fahrten für eine Woche',
        basePrice: basePrice * 7,
        discountOptions: {
          standard: 0,
          student: getRandomDiscount(),
          senior: getRandomDiscount(),
          children: getRandomDiscount() + 10
        },
        duration: '7 Tage'
      },
      {
        id: 'month',
        name: 'Monatskarte',
        description: 'Unbegrenzte Fahrten für einen Monat',
        basePrice: basePrice * 25,
        discountOptions: {
          standard: 0,
          student: getRandomDiscount() + 5,
          senior: getRandomDiscount() + 5,
          children: getRandomDiscount() + 15
        },
        duration: '30 Tage'
      },
      {
        id: 'year',
        name: 'Jahreskarte',
        description: 'Unbegrenzte Fahrten für ein Jahr',
        basePrice: basePrice * 240,
        discountOptions: {
          standard: 0,
          student: getRandomDiscount() + 10,
          senior: getRandomDiscount() + 10,
          children: getRandomDiscount() + 20
        },
        duration: '365 Tage'
      }
    ]
  };
};

// Generate a custom route between two cities
export const generateCustomRoute = (fromCity, toCity) => {
  // Check if cities are provided
  if (!fromCity || !toCity) {
    return [];
  }

  // Normalize city names for comparison (first letter uppercase, rest lowercase)
  const normalizeCity = (city) => {
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  };

  const normalizedFromCity = normalizeCity(fromCity);
  const normalizedToCity = normalizeCity(toCity);

  // Generate 1-3 route options with different transport combinations
  const routeOptions = [];
  const numOptions = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < numOptions; i++) {
    // Generate 1-3 segments for each route option
    const segmentCount = Math.floor(Math.random() * 3) + 1;
    const segments = [];
    
    // First segment always starts from the origin city
    let currentCity = normalizedFromCity;
    
    for (let j = 0; j < segmentCount; j++) {
      // For the last segment, the destination is the final city
      const nextCity = j === segmentCount - 1 ? normalizedToCity : 
                       germanCities.filter(city => city !== currentCity)[
                         Math.floor(Math.random() * (germanCities.length - 1))
                       ];
      
      const transport = transportTypes[Math.floor(Math.random() * transportTypes.length)];
      const travelTime = getRandomTime();
      const delay = getRandomDelay();
      
      segments.push({
        from: currentCity,
        to: nextCity,
        transportType: transport.name,
        transportIcon: transport.icon,
        transportColor: transport.color,
        travelTime,
        delay,
        departureTime: generateRandomTime(),
        lineNumber: generateLineNumber(transport.name)
      });
      
      currentCity = nextCity;
    }
    
    // Calculate total time and price for this route option
    const totalTime = segments.reduce((sum, segment) => sum + segment.travelTime + segment.delay, 0);
    const basePrice = (Math.floor(totalTime * 10) + 200) / 100; // Simple pricing based on time
    
    routeOptions.push({
      id: i + 1,
      segments,
      totalTime,
      totalPrice: basePrice.toFixed(2),
      co2Savings: Math.floor(Math.random() * 95) + 5 // Random CO2 savings percentage
    });
  }
  
  return routeOptions;
};

// Main function to generate all random mock data
export const generateMockData = () => {
  return {
    routes: generateRouteSegments(Math.floor(Math.random() * 3) + 2),
    tickets: generateTickets()
  };
};