// Mock data generator for the backend dashboard

// Define microservice names
const serviceNames = [
  'user-service',
  'auth-service', 
  'payment-service',
  'product-service',
  'notification-service',
  'analytics-service',
  'search-service',
  'inventory-service'
];

// Define possible routes for each service
const routeTemplates = {
  'user-service': ['/users', '/users/:id', '/users/search', '/users/profile', '/users/settings'],
  'auth-service': ['/login', '/logout', '/refresh-token', '/verify-email', '/reset-password'],
  'payment-service': ['/payments', '/payments/:id', '/payments/process', '/payments/refund', '/subscriptions'],
  'product-service': ['/products', '/products/:id', '/products/search', '/products/categories', '/products/featured'],
  'notification-service': ['/notifications', '/notifications/:id', '/notifications/send', '/notifications/preferences'],
  'analytics-service': ['/metrics', '/reports', '/dashboard-data', '/events', '/user-activity'],
  'search-service': ['/search', '/search/autocomplete', '/search/filters', '/search/trending'],
  'inventory-service': ['/inventory', '/inventory/:id', '/inventory/check', '/inventory/restock']
};

// Log message templates
const logTemplates = {
  INFO: [
    'Successfully processed request',
    'User logged in',
    'Payment processed',
    'Cache updated',
    'Service health check passed',
    'Request completed in {time}ms',
    'Retrieved {count} records',
    'Background job completed',
    'Scheduled task started',
    'Configuration reloaded'
  ],
  WARN: [
    'Response time exceeds threshold: {time}ms',
    'Retrying request after failure',
    'Cache miss rate high: {rate}%',
    'Memory usage above threshold: {mem}%',
    'Database connection pool near capacity',
    'Rate limiting applied to client {ip}',
    'Deprecated API endpoint accessed',
    'Slow query detected: {query}',
    'Authentication attempt with expired token',
    'Resource utilization spike detected'
  ],
  ERROR: [
    'Failed to connect to database',
    'Request timeout after {time}ms',
    'Invalid payload format',
    'Service dependency unavailable',
    'Uncaught exception in request handler',
    'Authentication failed for user {user}',
    'Failed to process payment: {reason}',
    'Internal server error',
    'Resource not found: {resource}',
    'Permission denied for operation'
  ]
};

// Generate random number within range
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Generate random integer within range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random timestamp within the last 24 hours
function getRandomTimestamp() {
  const now = new Date();
  const pastHours = getRandomInt(0, 24);
  const pastMinutes = getRandomInt(0, 59);
  const pastSeconds = getRandomInt(0, 59);
  
  now.setHours(now.getHours() - pastHours);
  now.setMinutes(now.getMinutes() - pastMinutes);
  now.setSeconds(now.getSeconds() - pastSeconds);
  
  return now;
}

// Format date for logs
function formatDate(date) {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

// Generate time series data (for charts)
function generateTimeSeriesData(points = 24, min = 0, max = 100, trend = null) {
  const data = [];
  let value = getRandomNumber(min, max);
  
  for (let i = 0; i < points; i++) {
    // If trend is provided, apply it to the random generation
    if (trend === 'up') {
      value = Math.min(value + getRandomNumber(-5, 15), max);
    } else if (trend === 'down') {
      value = Math.max(value + getRandomNumber(-15, 5), min);
    } else if (trend === 'spike') {
      if (i === Math.floor(points / 2)) {
        value = getRandomNumber(max * 0.7, max);
      } else {
        value = getRandomNumber(min, max * 0.5);
      }
    } else {
      // Random fluctuation
      value = Math.max(min, Math.min(max, value + getRandomNumber(-15, 15)));
    }
    
    const time = new Date();
    time.setHours(time.getHours() - (points - i));
    
    data.push({
      time: time.toISOString(),
      value: parseFloat(value.toFixed(2))
    });
  }
  
  return data;
}

// Generate metrics for a service
function generateServiceMetrics(serviceName) {
  // Generate baseline metrics
  const cpuUsage = getRandomNumber(5, 95);
  const memoryUsage = getRandomNumber(10, 90);
  const requestRate = getRandomInt(10, 5000);
  const errorRate = getRandomNumber(0, 10);
  const responseTime = getRandomNumber(10, 500);
  
  // Generate time series data for charts
  const cpuHistory = generateTimeSeriesData(24, 5, 95);
  const memoryHistory = generateTimeSeriesData(24, 10, 90);
  const requestHistory = generateTimeSeriesData(24, 10, 5000);
  const errorHistory = generateTimeSeriesData(24, 0, 15);
  const responseTimeHistory = generateTimeSeriesData(24, 10, 500);
  
  // Generate random status (healthy, warning, critical)
  let status;
  if (cpuUsage > 80 || memoryUsage > 85 || errorRate > 5) {
    status = 'critical';
  } else if (cpuUsage > 60 || memoryUsage > 70 || errorRate > 2) {
    status = 'warning';
  } else {
    status = 'healthy';
  }
  
  return {
    id: serviceName,
    name: serviceName,
    status,
    metrics: {
      cpu: {
        current: parseFloat(cpuUsage.toFixed(2)),
        history: cpuHistory
      },
      memory: {
        current: parseFloat(memoryUsage.toFixed(2)),
        history: memoryHistory
      },
      requests: {
        current: requestRate,
        history: requestHistory
      },
      errors: {
        current: parseFloat(errorRate.toFixed(2)),
        history: errorHistory
      },
      responseTime: {
        current: parseFloat(responseTime.toFixed(2)),
        history: responseTimeHistory
      }
    },
    routes: generateServiceRoutes(serviceName),
    uptime: getRandomInt(1, 30) + 'd ' + getRandomInt(0, 23) + 'h ' + getRandomInt(0, 59) + 'm',
    version: '1.' + getRandomInt(0, 9) + '.' + getRandomInt(0, 9),
    lastDeployed: formatDate(getRandomTimestamp())
  };
}

// Generate routes for a service
function generateServiceRoutes(serviceName) {
  const routes = [];
  const serviceRoutes = routeTemplates[serviceName] || ['/api', '/healthcheck'];
  
  serviceRoutes.forEach(route => {
    // Basic metrics for each route
    routes.push({
      path: route,
      requestCount: getRandomInt(100, 10000),
      errorCount: getRandomInt(0, 100),
      avgResponseTime: parseFloat(getRandomNumber(10, 300).toFixed(2)),
      p95ResponseTime: parseFloat(getRandomNumber(50, 500).toFixed(2)),
      p99ResponseTime: parseFloat(getRandomNumber(100, 800).toFixed(2)),
      errorRate: parseFloat(getRandomNumber(0, 10).toFixed(2))
    });
  });
  
  return routes;
}

// Generate log entry
function generateLogEntry() {
  // Select random log level with weighted probability
  const levelProbability = Math.random();
  let level;
  
  if (levelProbability < 0.7) {
    level = 'INFO';
  } else if (levelProbability < 0.9) {
    level = 'WARN';
  } else {
    level = 'ERROR';
  }
  
  // Get random message template for the selected level
  const templates = logTemplates[level];
  let message = templates[getRandomInt(0, templates.length - 1)];
  
  // Replace placeholders with random values
  message = message.replace('{time}', getRandomInt(10, 5000));
  message = message.replace('{count}', getRandomInt(1, 1000));
  message = message.replace('{rate}', getRandomInt(1, 100));
  message = message.replace('{mem}', getRandomInt(50, 95));
  message = message.replace('{ip}', `192.168.${getRandomInt(1, 255)}.${getRandomInt(1, 255)}`);
  message = message.replace('{query}', 'SELECT * FROM users WHERE email LIKE "%example%"');
  message = message.replace('{user}', `user${getRandomInt(1000, 9999)}`);
  message = message.replace('{reason}', 'insufficient_funds');
  message = message.replace('{resource}', `/api/products/${getRandomInt(1000, 9999)}`);
  
  // Generate timestamp with slight randomization to simulate real-time logs
  const timestamp = new Date();
  timestamp.setSeconds(timestamp.getSeconds() - getRandomInt(0, 30));
  
  const service = serviceNames[getRandomInt(0, serviceNames.length - 1)];
  
  return {
    timestamp: formatDate(timestamp),
    level,
    service,
    message,
    traceId: `trace-${Math.random().toString(36).substring(2, 10)}`
  };
}

// Generate system overview metrics
function generateSystemOverview() {
  return {
    totalServices: serviceNames.length,
    healthyServices: getRandomInt(Math.floor(serviceNames.length * 0.6), serviceNames.length),
    totalRequests: getRandomInt(10000, 1000000),
    averageResponseTime: parseFloat(getRandomNumber(50, 200).toFixed(2)),
    errorRate: parseFloat(getRandomNumber(0.1, 5).toFixed(2)),
    cpuUsage: parseFloat(getRandomNumber(20, 80).toFixed(2)),
    memoryUsage: parseFloat(getRandomNumber(30, 85).toFixed(2)),
    diskUsage: parseFloat(getRandomNumber(40, 90).toFixed(2)),
    uptime: getRandomInt(1, 60) + 'd ' + getRandomInt(0, 23) + 'h',
    alertsTriggered: getRandomInt(0, 10),
    timeSeriesData: {
      totalRequests: generateTimeSeriesData(24, 5000, 100000),
      errorRate: generateTimeSeriesData(24, 0.1, 8),
      responseTime: generateTimeSeriesData(24, 50, 300)
    }
  };
}

// Generate insights for the dashboard
function generateInsights() {
  const insights = [];
  const insightTypes = [
    'performance',
    'error',
    'traffic',
    'resource',
    'security'
  ];
  
  const insightTemplates = {
    performance: [
      'Response time spike detected in {service}',
      'Database query performance degraded for {service}',
      'Cache hit rate dropping for {service}'
    ],
    error: [
      'Increased error rate in {service}',
      '5xx errors detected in {service}',
      'Connection timeouts in {service}'
    ],
    traffic: [
      'Unusual traffic pattern detected for {service}',
      'Request volume spike for {route} in {service}',
      'Traffic drop detected for {service}'
    ],
    resource: [
      'Memory usage trending up for {service}',
      'CPU utilization spike in {service}',
      'Disk space running low for {service}'
    ],
    security: [
      'Unusual access pattern detected for {service}',
      'Multiple authentication failures for {service}',
      'Rate limiting triggered for {service}'
    ]
  };
  
  // Generate 3-7 random insights
  const insightCount = getRandomInt(3, 7);
  
  for (let i = 0; i < insightCount; i++) {
    const type = insightTypes[getRandomInt(0, insightTypes.length - 1)];
    const templates = insightTemplates[type];
    let message = templates[getRandomInt(0, templates.length - 1)];
    
    const service = serviceNames[getRandomInt(0, serviceNames.length - 1)];
    message = message.replace('{service}', service);
    
    if (message.includes('{route}')) {
      const serviceRoutes = routeTemplates[service] || ['/api'];
      const route = serviceRoutes[getRandomInt(0, serviceRoutes.length - 1)];
      message = message.replace('{route}', route);
    }
    
    // Generate random severity
    let severity;
    const severityRandom = Math.random();
    if (severityRandom < 0.5) {
      severity = 'low';
    } else if (severityRandom < 0.8) {
      severity = 'medium';
    } else {
      severity = 'high';
    }
    
    insights.push({
      id: `insight-${i + 1}`,
      type,
      message,
      severity,
      timestamp: formatDate(getRandomTimestamp()),
      service,
      value: parseFloat(getRandomNumber(0, 100).toFixed(2)),
      change: parseFloat(getRandomNumber(-50, 50).toFixed(2)),
      recommendation: `Consider ${type === 'performance' ? 'optimizing queries' : 
                          type === 'error' ? 'checking error logs' : 
                          type === 'traffic' ? 'scaling the service' : 
                          type === 'resource' ? 'increasing resources' : 
                          'reviewing security settings'}`
    });
  }
  
  return insights;
}

// Main function to generate all mock data
export function generateMockData() {
  // Generate service metrics
  const services = {};
  serviceNames.forEach(name => {
    services[name] = generateServiceMetrics(name);
  });
  
  // Generate logs (100 entries)
  const logs = [];
  for (let i = 0; i < 100; i++) {
    logs.push(generateLogEntry());
  }
  
  // Order logs by timestamp (newest first)
  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Generate system overview
  const overview = generateSystemOverview();
  
  // Generate insights
  const insights = generateInsights();
  
  return {
    services,
    logs,
    overview,
    insights,
    generatedAt: new Date().toISOString()
  };
}

// Function to get a single service by ID
export function getServiceById(id, mockData) {
  return mockData.services[id] || null;
}

// Export functions
export default {
  generateMockData,
  getServiceById
};