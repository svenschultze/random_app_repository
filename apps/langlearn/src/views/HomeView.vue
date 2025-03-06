<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useLessonsStore } from '../stores/lessons'
import { computed } from 'vue'

const router = useRouter()
const userStore = useUserStore()
const lessonsStore = useLessonsStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const languages = computed(() => lessonsStore.languages)

const startLearning = () => {
  if (isLoggedIn.value) {
    router.push('/dashboard')
  } else {
    router.push('/onboarding')
  }
}
</script>

<template>
  <main>
    <div class="landing-page">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            Learn a new language,<br>
            <span class="hero-highlight">the fun way</span>
          </h1>
          <p class="hero-subtitle">
            Master a new language through bite-sized lessons, gamified challenges, and motivational feedback.
          </p>
          <button 
            class="cta-button"
            @click="startLearning"
            v-voix="'start-learning-button'"
            hint="Begin your language learning journey"
          >
            Start Learning for Free
          </button>
          <div class="language-badges">
            <span v-for="lang in languages.slice(0, 5)" :key="lang.id" class="language-badge">
              {{ lang.name }}
            </span>
            <span class="language-badge more">+{{ languages.length - 5 }} more</span>
          </div>
        </div>
        <div class="hero-image">
          <img src="@/assets/logo.svg" alt="Language learning illustration" />
        </div>
      </section>

      <section class="features-section">
        <h2 class="section-title">Why Choose LangLearn?</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎮</div>
            <h3 class="feature-title">Learn by Playing</h3>
            <p class="feature-description">
              Enjoy fun exercises and earn points, badges, and track your progress with streaks.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⏱️</div>
            <h3 class="feature-title">Quick Lessons</h3>
            <p class="feature-description">
              Bite-sized lessons fit into your busy schedule, taking just 5-10 minutes each.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">Personalized Learning</h3>
            <p class="feature-description">
              Adaptive exercises adjust to your skill level, making learning efficient.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3 class="feature-title">Regular Practice</h3>
            <p class="feature-description">
              Build habits with daily goals and streak tracking to maintain progress.
            </p>
          </div>
        </div>
      </section>
      
      <section class="how-it-works-section">
        <h2 class="section-title">How It Works</h2>
        
        <div class="steps-container">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3 class="step-title">Choose Your Language</h3>
            <p class="step-description">
              Select from popular languages like Spanish, French, German, and more.
            </p>
          </div>
          
          <div class="step-divider"></div>
          
          <div class="step-card">
            <div class="step-number">2</div>
            <h3 class="step-title">Set Your Goals</h3>
            <p class="step-description">
              Tell us why you're learning, whether for travel, work, or fun.
            </p>
          </div>
          
          <div class="step-divider"></div>
          
          <div class="step-card">
            <div class="step-number">3</div>
            <h3 class="step-title">Learn Daily</h3>
            <p class="step-description">
              Complete quick, fun lessons and maintain your learning streak.
            </p>
          </div>
          
          <div class="step-divider"></div>
          
          <div class="step-card">
            <div class="step-number">4</div>
            <h3 class="step-title">Track Progress</h3>
            <p class="step-description">
              Watch your skills improve and earn rewards for your achievements.
            </p>
          </div>
        </div>
      </section>
      
      <section class="testimonials-section">
        <h2 class="section-title">What Our Users Say</h2>
        
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p class="testimonial-text">
                "I've tried many language apps, but LangLearn's gamified approach keeps me coming back every day. I'm already conversational in Spanish after just 3 months!"
              </p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">JD</div>
              <div class="author-info">
                <div class="author-name">John D.</div>
                <div class="author-detail">Learning Spanish</div>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p class="testimonial-text">
                "The bite-sized lessons fit perfectly into my busy schedule. I practice during my commute and lunch breaks. The streak feature keeps me motivated!"
              </p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">SM</div>
              <div class="author-info">
                <div class="author-name">Sarah M.</div>
                <div class="author-detail">Learning French</div>
              </div>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p class="testimonial-text">
                "I love competing with friends on the leaderboard. It's made learning Japanese a fun social activity rather than a solo chore."
              </p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">RK</div>
              <div class="author-info">
                <div class="author-name">Ryan K.</div>
                <div class="author-detail">Learning Japanese</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Start Your Language Journey?</h2>
          <p class="cta-description">
            Join thousands of learners mastering new languages with LangLearn's fun, effective approach.
          </p>
          <button 
            class="cta-button"
            @click="startLearning"
            v-voix="'get-started-button'"
            hint="Begin your language learning journey now"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.landing-page {
  padding-bottom: 4rem;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  padding: 2rem 0 4rem;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--primary-dark);
}

.hero-highlight {
  color: var(--primary-color);
  position: relative;
  display: inline-block;
}

.hero-highlight::after {
  content: '';
  position: absolute;
  bottom: 0.2rem;
  left: 0;
  width: 100%;
  height: 0.5rem;
  background-color: var(--accent-color);
  opacity: 0.3;
  z-index: -1;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-light);
  margin-bottom: 2rem;
  max-width: 600px;
}

.cta-button {
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cta-button:hover {
  background-color: var(--primary-dark);
}

.language-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.language-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--bg-color);
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.language-badge.more {
  background-color: var(--primary-light);
  color: white;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  max-height: 400px;
}

/* Features Section */
.features-section {
  padding: 4rem 0;
  background-color: var(--bg-color);
  border-radius: 1rem;
  margin: 0 1rem;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: var(--primary-dark);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.feature-card {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--primary-dark);
}

.feature-description {
  color: var(--text-light);
  line-height: 1.6;
}

/* How It Works Section */
.how-it-works-section {
  padding: 4rem 0;
}

.steps-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.step-card {
  text-align: center;
  width: 220px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: var(--primary-color);
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.step-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--primary-dark);
}

.step-description {
  color: var(--text-light);
  font-size: 0.875rem;
  line-height: 1.6;
}

.step-divider {
  flex-grow: 1;
  height: 2px;
  background-color: var(--border-color);
  margin-top: 1.5rem;
  max-width: 60px;
}

/* Testimonials Section */
.testimonials-section {
  padding: 4rem 0;
  background-color: var(--bg-color);
  border-radius: 1rem;
  margin: 0 1rem;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.testimonial-card {
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.testimonial-content {
  margin-bottom: 1.5rem;
}

.testimonial-text {
  color: var(--text-color);
  font-style: italic;
  line-height: 1.6;
  position: relative;
}

.testimonial-text::before {
  content: '"';
  font-size: 3rem;
  color: var(--primary-light);
  opacity: 0.2;
  position: absolute;
  top: -1.5rem;
  left: -1rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 3rem;
  height: 3rem;
  background-color: var(--primary-light);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.author-name {
  font-weight: 600;
  color: var(--primary-dark);
}

.author-detail {
  font-size: 0.875rem;
  color: var(--text-light);
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--primary-dark);
}

.cta-description {
  color: var(--text-light);
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }
  
  .language-badges {
    justify-content: center;
  }
  
  .steps-container {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  
  .step-divider {
    width: 2px;
    height: 40px;
    margin-top: 0;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .cta-title {
    font-size: 1.5rem;
  }
  
  .features-grid, .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
