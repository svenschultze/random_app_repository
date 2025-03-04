<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const currentSlide = ref(0)
const slides = [
  {
    title: 'Welcome to SpeedDate',
    description: 'Connect with meaningful matches through quick 5-minute video calls.',
    icon: '👋'
  },
  {
    title: 'How It Works',
    description: 'Join a queue, get matched, and have a timed 5-minute video chat with potential matches.',
    icon: '⏱️'
  },
  {
    title: 'Express Interest',
    description: "After each date, indicate whether you're interested. If there's mutual interest, it's a match!",
    icon: '❤️'
  },
  {
    title: 'Chat & Connect',
    description: 'Continue the conversation with your matches through our chat feature.',
    icon: '💬'
  }
]

function nextSlide() {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++
  }
}

function prevSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}
</script>

<template>
  <div class="onboarding">
    <div class="slide-container">
      <div class="slide">
        <div class="slide-icon">{{ slides[currentSlide].icon }}</div>
        <h2 v-voix="'Onboarding slide title'">{{ slides[currentSlide].title }}</h2>
        <p v-voix="'Onboarding slide description'">{{ slides[currentSlide].description }}</p>
      </div>
      
      <div class="slide-indicators">
        <div 
          v-for="(slide, index) in slides" 
          :key="index" 
          :class="['indicator', { active: index === currentSlide }]"
          @click="currentSlide = index"
          v-voix="'Go to slide ' + (index + 1)"
          :hint="'Navigate to slide ' + (index + 1) + ' of ' + slides.length"
        ></div>
      </div>
      
      <div class="slide-controls">
        <button 
          class="slide-btn" 
          @click="prevSlide" 
          :disabled="currentSlide === 0"
          v-voix="'Previous slide'"
          hint="Go to the previous slide">
          Back
        </button>
        
        <button 
          v-if="currentSlide < slides.length - 1" 
          class="slide-btn" 
          @click="nextSlide"
          v-voix="'Next slide'"
          hint="Go to the next slide">
          Next
        </button>
        
        <RouterLink 
          v-else 
          to="/register" 
          class="slide-btn primary"
          v-voix="'Get Started'"
          hint="Proceed to registration">
          Get Started
        </RouterLink>
      </div>
    </div>
    
    <div class="skip-container">
      <RouterLink 
        to="/register" 
        class="skip-link"
        v-voix="'Skip Onboarding'"
        hint="Skip the tutorial and go directly to registration">
        Skip
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.onboarding {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fff;
  padding: 1rem;
}

.slide-container {
  max-width: 500px;
  width: 100%;
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.slide {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.slide-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.slide-indicators {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ddd;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.indicator.active {
  background-color: #ff4b7d;
}

.slide-controls {
  display: flex;
  justify-content: space-between;
}

.slide-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  background-color: #f0f0f0;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.slide-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slide-btn.primary {
  background-color: #ff4b7d;
  color: white;
}

.slide-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.slide-btn.primary:hover {
  background-color: #ff3367;
}

.skip-container {
  margin-top: 1.5rem;
}

.skip-link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.skip-link:hover {
  text-decoration: underline;
}
</style>