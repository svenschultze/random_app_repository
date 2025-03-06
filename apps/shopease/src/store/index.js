import { reactive, readonly } from 'vue';
import { 
  generateProducts, 
  generateDeals, 
  generateCategoriesWithImages, 
  generateFeaturedCollections,
  generateUserPreferences
} from '@/utils/mockData';

// Create the initial state
const state = reactive({
  products: [],
  deals: [],
  categories: [],
  featuredCollections: [],
  cart: [],
  userPreferences: null,
  search: {
    query: '',
    results: []
  },
  ui: {
    showProductDetail: false,
    currentProductId: null,
    showCart: false,
    showCheckout: false,
    checkoutStep: 1,
    showSearch: false,
    showFilters: false,
    activeFilters: {
      category: null,
      priceRange: { min: 0, max: 2000 },
      rating: 0,
      sort: 'featured'
    }
  }
});

// Store actions
const actions = {
  // Initialize the store with mock data
  initializeStore() {
    state.products = generateProducts(50);
    state.deals = generateDeals(5);
    state.categories = generateCategoriesWithImages();
    state.featuredCollections = generateFeaturedCollections();
    state.userPreferences = generateUserPreferences();
    
    // Simulate personalized recommendations based on preferences
    this.generatePersonalizedRecommendations();
  },
  
  // Product actions
  viewProductDetail(productId) {
    state.ui.currentProductId = productId;
    state.ui.showProductDetail = true;
  },
  
  closeProductDetail() {
    state.ui.showProductDetail = false;
    setTimeout(() => {
      state.ui.currentProductId = null;
    }, 300); // Delay to allow for animations
  },
  
  // Cart actions
  addToCart(productId, quantity = 1) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = state.cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      state.cart.push({
        productId,
        quantity,
        product
      });
    }
    
    // Show cart briefly when adding items
    state.ui.showCart = true;
    setTimeout(() => {
      if (state.ui.showCart) {
        state.ui.showCart = false;
      }
    }, 3000);
  },
  
  updateCartItemQuantity(productId, quantity) {
    const cartItem = state.cart.find(item => item.productId === productId);
    if (cartItem) {
      if (quantity > 0) {
        cartItem.quantity = quantity;
      } else {
        this.removeFromCart(productId);
      }
    }
  },
  
  removeFromCart(productId) {
    const index = state.cart.findIndex(item => item.productId === productId);
    if (index !== -1) {
      state.cart.splice(index, 1);
    }
  },
  
  clearCart() {
    state.cart = [];
  },
  
  toggleCart() {
    state.ui.showCart = !state.ui.showCart;
  },
  
  // Checkout actions
  startCheckout() {
    if (state.cart.length === 0) return;
    
    state.ui.showCart = false;
    state.ui.showCheckout = true;
    state.ui.checkoutStep = 1;
  },
  
  nextCheckoutStep() {
    if (state.ui.checkoutStep < 3) {
      state.ui.checkoutStep++;
    }
  },
  
  previousCheckoutStep() {
    if (state.ui.checkoutStep > 1) {
      state.ui.checkoutStep--;
    }
  },
  
  completeCheckout() {
    // In a real app, this would process payment and create an order
    this.clearCart();
    state.ui.showCheckout = false;
    state.ui.checkoutStep = 1;
    
    // Could show a success message or redirect to a thank you page
  },
  
  cancelCheckout() {
    state.ui.showCheckout = false;
    state.ui.checkoutStep = 1;
  },
  
  // Search actions
  toggleSearch() {
    state.ui.showSearch = !state.ui.showSearch;
    if (!state.ui.showSearch) {
      state.search.query = '';
      state.search.results = [];
    }
  },
  
  performSearch(query) {
    state.search.query = query;
    
    if (!query.trim()) {
      state.search.results = [];
      return;
    }
    
    const searchTerms = query.toLowerCase().split(' ');
    
    state.search.results = state.products.filter(product => {
      const searchableText = `${product.name} ${product.description} ${product.brand} ${product.category}`.toLowerCase();
      return searchTerms.some(term => searchableText.includes(term));
    });
  },
  
  // Filter actions
  toggleFilters() {
    state.ui.showFilters = !state.ui.showFilters;
  },
  
  applyFilter(filterType, value) {
    state.ui.activeFilters[filterType] = value;
  },
  
  clearFilters() {
    state.ui.activeFilters = {
      category: null,
      priceRange: { min: 0, max: 2000 },
      rating: 0,
      sort: 'featured'
    };
  },
  
  // Recommendations
  generatePersonalizedRecommendations() {
    // In a real app, this would use machine learning models
    // For our demo, we'll use the mock preferences to filter products
    const { recentlyViewedCategories, preferredPriceRange } = state.userPreferences;
    
    // Mark some products as recommended based on preferences
    state.products.forEach(product => {
      const matchesCategory = recentlyViewedCategories.includes(product.category);
      const matchesPriceRange = product.price >= preferredPriceRange.min && 
                              product.price <= preferredPriceRange.max;
      
      // Simple algorithm for demo purposes
      product.isRecommended = matchesCategory && matchesPriceRange;
    });
  }
};

// Computed values
const getters = {
  // Get current product detail
  currentProduct() {
    return state.ui.currentProductId ? 
      state.products.find(p => p.id === state.ui.currentProductId) : null;
  },
  
  // Get cart total
  cartTotal() {
    return state.cart.reduce((total, item) => {
      const price = item.product.discountPercentage > 0 ? 
        item.product.discountedPrice : item.product.price;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  },
  
  // Get cart item count
  cartItemCount() {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  },
  
  // Get filtered products
  filteredProducts() {
    const { category, priceRange, rating, sort } = state.ui.activeFilters;
    
    let filtered = [...state.products];
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    
    // Apply price range filter
    filtered = filtered.filter(p => {
      const price = p.discountPercentage > 0 ? p.discountedPrice : p.price;
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Apply rating filter
    if (rating > 0) {
      filtered = filtered.filter(p => p.rating >= rating);
    }
    
    // Apply sorting
    switch (sort) {
      case 'priceLow':
        filtered.sort((a, b) => {
          const priceA = a.discountPercentage > 0 ? a.discountedPrice : a.price;
          const priceB = b.discountPercentage > 0 ? b.discountedPrice : b.price;
          return priceA - priceB;
        });
        break;
      case 'priceHigh':
        filtered.sort((a, b) => {
          const priceA = a.discountPercentage > 0 ? a.discountedPrice : a.price;
          const priceB = b.discountPercentage > 0 ? b.discountedPrice : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered = filtered.filter(p => p.isNewArrival).concat(
          filtered.filter(p => !p.isNewArrival)
        );
        break;
      case 'featured':
      default:
        filtered = filtered.filter(p => p.isFeatured).concat(
          filtered.filter(p => !p.isFeatured)
        );
        break;
    }
    
    return filtered;
  },
  
  // Get recommended products
  recommendedProducts() {
    return state.products.filter(p => p.isRecommended).slice(0, 6);
  },
  
  // Get bestsellers
  bestSellerProducts() {
    return state.products.filter(p => p.isBestSeller).slice(0, 8);
  },
  
  // Get new arrivals
  newArrivalProducts() {
    return state.products.filter(p => p.isNewArrival).slice(0, 8);
  },
  
  // Get products with discounts
  discountedProducts() {
    return state.products.filter(p => p.discountPercentage > 0).slice(0, 8);
  }
};

// Create the store interface
const store = {
  state: readonly(state),
  ...actions,
  ...getters
};

// Initialize store with data
setTimeout(() => {
  store.initializeStore();
}, 0);

export default store;