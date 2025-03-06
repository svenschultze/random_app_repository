<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import Button from '@/components/ui/Button.vue';

const slides = [
  {
    title: 'Summer Collection',
    subtitle: 'Discover fresh styles for the season',
    cta: 'Shop Now',
    link: '/categories/clothing',
    image: 'https://source.unsplash.com/1600x900/?summer,fashion'
  },
  {
    title: 'Tech Essentials',
    subtitle: 'Upgrade your digital lifestyle',
    cta: 'Explore',
    link: '/categories/electronics',
    image: 'https://source.unsplash.com/1600x900/?technology,gadgets'
  },
  {
    title: 'Home Makeover',
    subtitle: 'Transform your space with our home collection',
    cta: 'Browse Collection',
    link: '/categories/home-kitchen',
    image: 'https://source.unsplash.com/1600x900/?home,interior'
  }
];

const currentSlide = ref(0);
const autoplayInterval = ref(null);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const setSlide = (index) => {
  currentSlide.value = index;
  resetAutoplay();
};

const resetAutoplay = () => {
  clearInterval(autoplayInterval.value);
  startAutoplay();
};

const startAutoplay = () => {
  autoplayInterval.value = setInterval(() => {
    nextSlide();
  }, 5000);
};

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  clearInterval(autoplayInterval.value);
});
</script>

<template>
  <section class="hero-section">
    <div class="hero-slider">
      <div 
        v-for="(slide, index) in slides" 
        :key="index" 
        class="hero-slide" 
        :class="{ active: index === currentSlide }"
        v-voix="`hero-slide-${index+1}`"
        :hint="`Hero slide ${index+1} of ${slides.length}: ${slide.title} - ${slide.subtitle}`"
      >
        <div class="slide-image">
          <img :src="slide.image" :alt="slide.title" loading="lazy" />
        </div>
        <div class="slide-content">
          <h2 class="slide-title">{{ slide.title }}</h2>
          <p class="slide-subtitle">{{ slide.subtitle }}</p>
          <RouterLink :to="slide.link">
            <Button 
              :label="slide.cta" 
              variant="primary" 
              size="lg"
              :id="`hero-cta-${index+1}`"
              :hint="`${slide.cta} button for ${slide.title}`"
            />
          </RouterLink>
        </div>
      </div>
    </div>
    
    <div class="slider-controls">
      <button 
        class="slider-arrow prev" 
        @click="prevSlide"
        v-voix="'prev-slide'"
        hint="Go to previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <div class="slider-dots">
        <button 
          v-for="(slide, index) in slides" 
          :key="index" 
          class="slider-dot" 
          :class="{ active: index === currentSlide }" 
          @click="setSlide(index)"
          v-voix="`slide-dot-${index+1}`"
          :hint="`Go to slide ${index+1}: ${slide.title}`"
        ></button>
      </div>
      
      <button 
        class="slider-arrow next" 
        @click="nextSlide"
        v-voix="'next-slide'"
        hint="Go to next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  height: 80vh;
  max-height: 700px;
  min-height: 500px;
  overflow: hidden;
  margin-bottom: 40px;
}

.hero-slider {
  width: 100%;
  height: 100%;
  position: relative;
}

.hero-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1s ease;
  z-index: 1;
}

.hero-slide.active {
  opacity: 1;
  z-index: 2;
}

.slide-image {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 8s ease;
}

.hero-slide.active .slide-image img {
  transform: scale(1.05);
}

.slide-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.1) 100%);
}

.slide-content {
  position: absolute;
  top: 50%;
  left: 8%;
  transform: translateY(-50%);
  color: white;
  max-width: 600px;
  z-index: 2;
  opacity: 0;
  transition: all 0.5s ease 0.5s;
  transform: translateY(-40%);
}

.hero-slide.active .slide-content {
  opacity: 1;
  transform: translateY(-50%);
}

.slide-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease 0.7s;
}

.slide-subtitle {
  font-size: 1.25rem;
  margin: 0 0 32px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease 0.9s;
}

.hero-slide.active .slide-title,
.hero-slide.active .slide-subtitle {
  opacity: 1;
  transform: translateY(0);
}

.slider-controls {
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  z-index: 3;
}

.slider-arrow {
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.slider-arrow:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.slider-dots {
  display: flex;
  gap: 8px;
}

.slider-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider-dot.active {
  background-color: white;
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .hero-section {
    height: 60vh;
  }
  
  .slide-content {
    left: 5%;
    max-width: 90%;
  }
  
  .slide-title {
    font-size: 2rem;
  }
  
  .slide-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 50vh;
    min-height: 400px;
  }
  
  .slide-title {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
  
  .slide-subtitle {
    font-size: 0.9rem;
    margin-bottom: 16px;
  }
  
  .slider-controls {
    bottom: 16px;
  }
  
  .slider-arrow {
    width: 32px;
    height: 32px;
  }
}
</style>