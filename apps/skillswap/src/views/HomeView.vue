<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToRegister = () => {
  router.push('/register')
}

const features = [
  {
    icon: '🔄',
    title: 'Skill Matching',
    description: 'Find users with complementary skills - you teach what you know, learn what you want.'
  },
  {
    icon: '📅',
    title: 'Easy Scheduling',
    description: 'Coordinate sessions with our integrated calendar system that works across time zones.'
  },
  {
    icon: '🎯',
    title: 'Personalized Recommendations',
    description: 'Our algorithm suggests the best skill-swap partners based on your preferences.'
  },
  {
    icon: '💬',
    title: 'Built-in Video Chat',
    description: 'Connect and share skills easily with our integrated video platform.'
  }
]

const testimonials = ref([
  {
    quote: "SkillSwap helped me learn Spanish while teaching coding. It's the most rewarding exchange I've ever experienced!",
    author: "Sarah M., Software Developer",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    quote: "I've been trying to learn guitar for years. Trading my photography skills for lessons was genius!",
    author: "Michael K., Photographer",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    quote: "As a retired teacher, SkillSwap lets me continue sharing my knowledge while learning new technologies from younger generations.",
    author: "Elena R., Retired Educator",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
])
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 v-voix="'hero-title'">Exchange Skills, Grow Together</h1>
        <p class="hero-subtitle" v-voix="'hero-subtitle'">
          SkillSwap connects people who want to learn with those who want to teach.
          Trade your expertise for knowledge you desire — no money involved.
        </p>
        <div class="hero-buttons">
          <button 
            class="primary-button" 
            v-voix="'sign-up-button'" 
            hint="Click to create a new account"
            @click="navigateToRegister"
          >
            Sign Up
          </button>
          <button 
            class="secondary-button" 
            v-voix="'learn-more-button'" 
            hint="Click to learn more about how SkillSwap works"
          >
            Learn More
          </button>
        </div>
      </div>
      <div class="hero-image">
        <div class="placeholder-image">
          <!-- Image placeholder -->
          <div class="image-placeholder">
            <span>🔄</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title" v-voix="'features-title'">How SkillSwap Works</h2>
      <div class="features-grid">
        <div 
          v-for="(feature, index) in features" 
          :key="index" 
          class="feature-card"
          v-voix="'feature-card-' + index"
        >
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <h2 class="section-title" v-voix="'testimonials-title'">Success Stories</h2>
      <div class="testimonials-carousel">
        <div 
          v-for="(testimonial, index) in testimonials" 
          :key="index" 
          class="testimonial-card"
          v-voix="'testimonial-card-' + index"
        >
          <div class="testimonial-content">
            <p class="testimonial-quote">"{{ testimonial.quote }}"</p>
            <div class="testimonial-author">
              <img 
                :src="testimonial.avatar" 
                :alt="testimonial.author" 
                class="author-avatar"
              >
              <p class="author-name">{{ testimonial.author }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title" v-voix="'cta-title'">Ready to start exchanging skills?</h2>
        <p class="cta-description" v-voix="'cta-description'">
          Join thousands of people discovering the power of skill exchange. 
          Create your profile today and find your perfect skill swap match.
        </p>
        <button 
          class="cta-button" 
          v-voix="'cta-button'" 
          hint="Click to create a new account"
          @click="navigateToRegister"
        >
          Get Started
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="home-footer">
      <div class="footer-content">
        <div class="footer-logo">
          <span class="footer-logo-text">SkillSwap</span>
        </div>
        <div class="footer-links">
          <a href="#" v-voix="'footer-about'">About</a>
          <a href="#" v-voix="'footer-help'">Help</a>
          <a href="#" v-voix="'footer-terms'">Terms</a>
          <a href="#" v-voix="'footer-privacy'">Privacy</a>
        </div>
        <div class="footer-copyright">
          &copy; 2025 SkillSwap. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
}

/* Hero Section */
.hero-section {
  display: flex;
  min-height: calc(100vh - var(--header-height));
  padding: 2rem;
  max-width: var(--content-width);
  margin: 0 auto;
  align-items: center;
  gap: 2rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--text-color);
  font-weight: 800;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--light-text);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: var(--transition);
}

.primary-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 140, 255, 0.2);
}

.secondary-button {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: var(--transition);
}

.secondary-button:hover {
  background-color: rgba(74, 140, 255, 0.1);
  transform: translateY(-2px);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder-image {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 4/3;
  border-radius: 12px;
  overflow: hidden;
  background-color: rgba(74, 140, 255, 0.1);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
}

/* Features Section */
.features-section {
  padding: 5rem 2rem;
  background-color: white;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  font-weight: 700;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: var(--content-width);
  margin: 0 auto;
}

.feature-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  box-shadow: var(--box-shadow);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.feature-description {
  color: var(--light-text);
  line-height: 1.6;
}

/* Testimonials Section */
.testimonials-section {
  padding: 5rem 2rem;
  background-color: var(--background-color);
}

.testimonials-carousel {
  display: flex;
  gap: 2rem;
  max-width: var(--content-width);
  margin: 0 auto;
  overflow-x: auto;
  padding: 1rem 0;
  scroll-snap-type: x mandatory;
}

.testimonial-card {
  flex: 0 0 350px;
  scroll-snap-align: start;
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.testimonial-quote {
  font-style: italic;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: var(--text-color);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--light-text);
}

/* CTA Section */
.cta-section {
  padding: 5rem 2rem;
  background-color: var(--primary-color);
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.cta-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  background-color: white;
  color: var(--primary-color);
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: var(--transition);
}

.cta-button:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Footer */
.home-footer {
  padding: 3rem 2rem;
  background-color: #111;
  color: #ddd;
}

.footer-content {
  max-width: var(--content-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.footer-logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: #ddd;
  transition: var(--transition);
}

.footer-links a:hover {
  color: white;
}

.footer-copyright {
  font-size: 0.9rem;
  color: #999;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    padding-top: 3rem;
    text-align: center;
  }
  
  .hero-content {
    max-width: 100%;
  }
  
  .hero-buttons {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}
</style>
