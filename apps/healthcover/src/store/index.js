import { reactive, readonly } from 'vue';
import { generateRandomPolicy, createNewClaim } from './dataGenerator';

// Initial state structure
const initialState = {
  policy: null,
  isLoading: false,
  error: null
};

// Create a reactive state
const state = reactive({ ...initialState });

// Store actions
const actions = {
  // Generate new random policy data
  generatePolicy() {
    state.isLoading = true;
    state.error = null;
    
    try {
      // Simulate API call delay
      setTimeout(() => {
        state.policy = generateRandomPolicy();
        state.isLoading = false;
        
        // Save to localStorage
        localStorage.setItem('healthCoverPolicy', JSON.stringify(state.policy));
      }, 500);
    } catch (error) {
      state.error = 'Failed to generate policy data';
      state.isLoading = false;
    }
  },
  
  // Load policy from localStorage
  loadSavedPolicy() {
    state.isLoading = true;
    state.error = null;
    
    try {
      const savedPolicy = localStorage.getItem('healthCoverPolicy');
      
      if (savedPolicy) {
        state.policy = JSON.parse(savedPolicy);
      } else {
        // No saved policy, generate a new one
        this.generatePolicy();
      }
      
      state.isLoading = false;
    } catch (error) {
      state.error = 'Failed to load saved policy data';
      state.isLoading = false;
    }
  },
  
  // Reset policy data
  resetPolicy() {
    state.isLoading = true;
    state.error = null;
    
    try {
      // Clear localStorage
      localStorage.removeItem('healthCoverPolicy');
      
      // Generate new policy
      this.generatePolicy();
    } catch (error) {
      state.error = 'Failed to reset policy data';
      state.isLoading = false;
    }
  },
  
  // Submit a new claim
  submitClaim(claimData) {
    state.isLoading = true;
    state.error = null;
    
    try {
      // Simulate API call delay
      setTimeout(() => {
        if (!state.policy) {
          throw new Error('No active policy found');
        }
        
        // Create new claim
        const newClaim = createNewClaim(state.policy, claimData);
        
        // Add to claims array (at the beginning to show newest first)
        state.policy.claims.unshift(newClaim);
        
        // Save updated policy to localStorage
        localStorage.setItem('healthCoverPolicy', JSON.stringify(state.policy));
        
        state.isLoading = false;
      }, 1000);
      
      return true;
    } catch (error) {
      state.error = 'Failed to submit claim: ' + error.message;
      state.isLoading = false;
      return false;
    }
  }
};

// Create and export the store
export default {
  state: readonly(state),  // Expose state as readonly to prevent direct mutations
  ...actions  // Expose actions for components to use
};