<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import store from '@/store';
import IconButton from '@/components/ui/IconButton.vue';
import SearchBar from '@/components/ui/SearchBar.vue';

const cartItemCount = computed(() => store.cartItemCount());
const isScrolled = ref(false);
const isSearchOpen = ref(false);

const toggleCart = () => {
  store.toggleCart();
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (!isSearchOpen.value) {
    store.performSearch('');
  }
};

const handleSearch = (query) => {
  store.performSearch(query);
};

const clearSearch = () => {
  store.performSearch('');
};

// Handle scroll events for header styling
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header class="app-header" :class="{ 'scrolled': isScrolled }">
    <div class="header-left">
      <RouterLink to="/" class="logo-link">
        <div class="logo">
          <span class="logo-icon">🛍️</span>
          <span class="logo-text">ShopEase</span>
        </div>
      </RouterLink>
    </div>
    
    <div class="header-center" :class="{ 'search-open': isSearchOpen }">
      <div v-if="isSearchOpen" class="search-container">
        <SearchBar 
          @search="handleSearch" 
          @clear="clearSearch"
          id="main-search-input"
          hint="Search for products by name, category, or description"
        />
      </div>
      <nav v-else class="main-nav">
        <RouterLink to="/" class="nav-link" v-voix="'nav-home'" hint="Go to home page">Home</RouterLink>
        <RouterLink to="/products" class="nav-link" v-voix="'nav-products'" hint="Browse all products">Products</RouterLink>
        <RouterLink to="/categories" class="nav-link" v-voix="'nav-categories'" hint="Browse products by category">Categories</RouterLink>
        <RouterLink to="/deals" class="nav-link" v-voix="'nav-deals'" hint="View current deals and promotions">Deals</RouterLink>
      </nav>
    </div>
    
    <div class="header-right">
      <IconButton 
        icon='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' 
        label="Search"
        color="dark"
        @click="toggleSearch"
        id="toggle-search"
        hint="Search for products"
      />
      
      <div class="cart-button-wrapper">
        <IconButton 
          icon='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>'
          label="Cart"
          color="primary"
          @click="toggleCart"
          id="toggle-cart"
          hint="View your shopping cart"
        />
        <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
      </div>
      
      <IconButton 
        icon='<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
        label="Account"
        color="dark"
        id="user-account"
        hint="View your account"
      />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.app-header.scrolled {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 12px 24px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text, #2b2b2b);
}

.main-nav {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: var(--color-text, #2b2b2b);
  font-weight: 500;
  position: relative;
  transition: color 0.2s ease;
  padding: 4px 0;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary, #4361ee);
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: var(--color-primary, #4361ee);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.cart-button-wrapper {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--color-accent, #f72585);
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.search-container {
  width: 100%;
  max-width: 600px;
  animation: fadeIn 0.3s ease;
}

.search-open {
  flex: 1;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .logo-text {
    display: none;
  }
  
  .main-nav {
    gap: 16px;
  }
  
  .nav-link {
    font-size: 0.9rem;
  }
}

@media (max-width: 640px) {
  .app-header {
    padding: 12px 16px;
  }
  
  .header-center:not(.search-open) {
    display: none;
  }
  
  .header-right {
    gap: 8px;
  }
}
</style>