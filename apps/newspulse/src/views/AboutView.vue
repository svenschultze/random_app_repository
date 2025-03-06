<script setup>
import { ref } from 'vue';

const features = ref([
  {
    title: 'Immersive Storytelling',
    description: 'Experience news through dynamic, interactive narratives that evolve as you scroll and interact.',
    icon: '📖'
  },
  {
    title: 'Context-Aware Content',
    description: 'Discover locally relevant stories and trending topics tailored to your interests and location.',
    icon: '🌍'
  },
  {
    title: 'Interactive Media',
    description: 'Engage with rich multimedia elements including videos, infographics, timelines, and social media feeds.',
    icon: '🎬'
  },
  {
    title: 'Voice Commands',
    description: 'Navigate and interact with content using simple voice prompts for a hands-free experience.',
    icon: '🎤'
  },
  {
    title: 'Scroll-Driven Narrative',
    description: 'Stories unfold naturally as you scroll, with smooth transitions and visual effects guiding your journey.',
    icon: '📱'
  },
  {
    title: 'Real-Time Updates',
    description: 'Stay informed with breaking news and trending topics that update in real-time.',
    icon: '⚡'
  }
]);

const team = ref([
  {
    name: 'Jane Smith',
    role: 'Founder & Editor-in-Chief',
    bio: 'Former journalist with 15 years of experience in digital media. Passionate about innovative storytelling and accessible journalism.',
    avatar: 'https://picsum.photos/200?random=1'
  },
  {
    name: 'Alex Johnson',
    role: 'Lead Designer',
    bio: 'Award-winning UX designer specializing in immersive digital experiences and interactive interfaces.',
    avatar: 'https://picsum.photos/200?random=2'
  },
  {
    name: 'Sam Rodriguez',
    role: 'Technology Director',
    bio: 'Software engineer with expertise in real-time data systems and interactive multimedia applications.',
    avatar: 'https://picsum.photos/200?random=3'
  }
]);
</script>

<template>
  <div class="about-container">
    <section class="about-hero">
      <div class="overlay"></div>
      <div class="hero-content">
        <h1 class="about-title">About NewsPulse</h1>
        <p class="about-subtitle">Reimagining how we experience news in the digital age</p>
      </div>
    </section>
    
    <section class="about-mission">
      <div class="content-wrapper">
        <h2 class="section-title">Our Mission</h2>
        <p class="mission-text">
          NewsPulse reimagines how we experience news in the digital era. Moving beyond conventional formats, 
          we've created an immersive platform that combines interactive storytelling, real-time data, and 
          personalized content to provide a deeper connection to the events shaping our world.
        </p>
        <p class="mission-text">
          We believe that journalism should be engaging, accessible, and contextual. Our dynamic approach 
          allows readers to explore stories at their own pace, with interactive elements that provide deeper 
          understanding and multiple perspectives on complex issues.
        </p>
      </div>
    </section>
    
    <section class="about-features">
      <div class="content-wrapper">
        <h2 class="section-title">Key Features</h2>
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card" v-voix="'feature-' + feature.title.toLowerCase().replace(' ', '-')">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="about-team">
      <div class="content-wrapper">
        <h2 class="section-title">Our Team</h2>
        <div class="team-grid">
          <div v-for="member in team" :key="member.name" class="team-card" v-voix="'team-member-' + member.name.toLowerCase().replace(' ', '-')">
            <div class="member-avatar">
              <img :src="member.avatar" :alt="member.name">
            </div>
            <h3 class="member-name">{{ member.name }}</h3>
            <div class="member-role">{{ member.role }}</div>
            <p class="member-bio">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="about-contact">
      <div class="content-wrapper">
        <h2 class="section-title">Contact Us</h2>
        <div class="contact-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-voix="'contact-name-input'" hint="Enter your name">
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-voix="'contact-email-input'" hint="Enter your email address">
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" rows="5" v-voix="'contact-message-input'" hint="Enter your message"></textarea>
          </div>
          <button class="submit-button" v-voix="'submit-contact-form'" hint="Click to send your message">Send Message</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-container {
  width: 100%;
}

/* Hero section */
.about-hero {
  position: relative;
  height: 50vh;
  min-height: 400px;
  background-image: url('https://picsum.photos/1920/1080?random=10');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
}

.about-title {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.about-subtitle {
  font-size: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

/* Content sections */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 2rem;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
}

/* Mission section */
.about-mission {
  background-color: white;
}

.mission-text {
  font-size: 1.2rem;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 1.5rem;
  text-align: center;
}

/* Features section */
.about-features {
  background-color: var(--background-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow);
  transition: transform var(--transition-speed);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.feature-description {
  color: var(--text-color-light);
}

/* Team section */
.about-team {
  background-color: white;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 3rem;
}

.team-card {
  text-align: center;
}

.member-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1.5rem;
  box-shadow: var(--shadow);
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-name {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.member-role {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1rem;
}

.member-bio {
  color: var(--text-color-light);
}

/* Contact section */
.about-contact {
  background-color: var(--background-color);
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  padding: 3rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  transition: border-color var(--transition-speed);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-speed);
}

.submit-button:hover {
  background-color: #2980b9;
}

/* Media queries */
@media (max-width: 768px) {
  .about-title {
    font-size: 2.5rem;
  }
  
  .about-subtitle {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .mission-text {
    font-size: 1rem;
  }
  
  .contact-form {
    padding: 2rem;
  }
}
</style>
