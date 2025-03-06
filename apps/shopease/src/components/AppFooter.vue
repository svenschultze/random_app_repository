<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-section">
        <div class="footer-logo">
          <span class="logo-icon">🛍️</span>
          <span class="logo-text">ShopEase</span>
        </div>
        <p class="footer-tagline">
          Discover the joy of effortless shopping
        </p>
        <div class="social-links">
          <a href="#" class="social-link" v-voix="'social-facebook'" hint="Visit our Facebook page">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="#" class="social-link" v-voix="'social-twitter'" hint="Visit our Twitter profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </a>
          <a href="#" class="social-link" v-voix="'social-instagram'" hint="Visit our Instagram profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-title">Shop</h3>
        <nav class="footer-nav">
          <RouterLink to="/products" class="footer-link" v-voix="'footer-all-products'" hint="Browse all products">All Products</RouterLink>
          <RouterLink to="/categories" class="footer-link" v-voix="'footer-categories'" hint="Browse products by category">Categories</RouterLink>
          <RouterLink to="/deals" class="footer-link" v-voix="'footer-deals'" hint="View current deals and promotions">Deals & Promotions</RouterLink>
          <RouterLink to="/new-arrivals" class="footer-link" v-voix="'footer-new-arrivals'" hint="Browse new arrivals">New Arrivals</RouterLink>
        </nav>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-title">Support</h3>
        <nav class="footer-nav">
          <RouterLink to="/contact" class="footer-link" v-voix="'footer-contact'" hint="Contact us">Contact Us</RouterLink>
          <RouterLink to="/faq" class="footer-link" v-voix="'footer-faq'" hint="View frequently asked questions">FAQs</RouterLink>
          <RouterLink to="/shipping" class="footer-link" v-voix="'footer-shipping'" hint="View shipping information">Shipping Info</RouterLink>
          <RouterLink to="/returns" class="footer-link" v-voix="'footer-returns'" hint="View returns policy">Returns Policy</RouterLink>
        </nav>
      </div>
      
      <div class="footer-section">
        <h3 class="footer-title">About</h3>
        <nav class="footer-nav">
          <RouterLink to="/about" class="footer-link" v-voix="'footer-about'" hint="Learn about ShopEase">Our Story</RouterLink>
          <RouterLink to="/blog" class="footer-link" v-voix="'footer-blog'" hint="Read our blog">Blog</RouterLink>
          <RouterLink to="/careers" class="footer-link" v-voix="'footer-careers'" hint="View career opportunities">Careers</RouterLink>
          <RouterLink to="/privacy" class="footer-link" v-voix="'footer-privacy'" hint="Read our privacy policy">Privacy Policy</RouterLink>
        </nav>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="copyright">
        &copy; {{ new Date().getFullYear() }} ShopEase. All rights reserved.
      </div>
      <div class="payment-methods">
        <span class="payment-icon">💳</span>
        <span class="payment-icon">💵</span>
        <span class="payment-icon">🏦</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--color-background-soft, #f5f5f5);
  padding: 40px 24px 20px;
  margin-top: 60px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text, #2b2b2b);
}

.footer-tagline {
  color: var(--color-text-light, #646464);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.social-links {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-background, #ffffff);
  color: var(--color-text, #2b2b2b);
  transition: all 0.2s ease;
}

.social-link:hover {
  background-color: var(--color-primary, #4361ee);
  color: white;
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--color-text, #2b2b2b);
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link {
  color: var(--color-text-light, #646464);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--color-primary, #4361ee);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 1px solid var(--color-border, #e2e8f0);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.copyright {
  font-size: 0.875rem;
  color: var(--color-text-light, #646464);
}

.payment-methods {
  display: flex;
  gap: 8px;
}

.payment-icon {
  font-size: 1.5rem;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>