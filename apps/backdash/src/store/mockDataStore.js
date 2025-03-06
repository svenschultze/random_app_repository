import { reactive, readonly } from 'vue';
import { generateMockData } from '@/utils/mockDataGenerator';

// Create a reactive state
const state = reactive({
  data: null,
  loading: false,
  error: null,
  lastUpdated: null
});

// Actions to modify the state
const actions = {
  // Generate mock data
  generateData() {
    state.loading = true;
    state.error = null;
    
    try {
      // Generate mock data
      state.data = generateMockData();
      state.lastUpdated = new Date().toISOString();
    } catch (error) {
      state.error = 'Failed to generate mock data: ' + error.message;
      console.error('Error generating mock data:', error);
    } finally {
      state.loading = false;
    }
  },
  
  // Get a service by ID
  getServiceById(id) {
    if (!state.data || !state.data.services) {
      return null;
    }
    
    return state.data.services[id] || null;
  },
  
  // Filter logs by service, level, or search term
  filterLogs(options = {}) {
    if (!state.data || !state.data.logs) {
      return [];
    }
    
    let filteredLogs = [...state.data.logs];
    
    // Filter by service
    if (options.service) {
      filteredLogs = filteredLogs.filter(log => log.service === options.service);
    }
    
    // Filter by level
    if (options.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }
    
    // Filter by search term
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(searchLower) || 
        log.service.toLowerCase().includes(searchLower) ||
        log.traceId.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredLogs;
  }
};

// Export readonly state and actions
export default {
  state: readonly(state),
  ...actions
};