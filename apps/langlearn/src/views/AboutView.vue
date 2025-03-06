<template>
  <div class="about-container">
    <div class="about-header">
      <h1 class="about-title">About LangLearn</h1>
      <p class="about-subtitle">Our mission is to make language learning accessible, enjoyable, and effective for everyone.</p>
    </div>
    
    <div class="about-content">
      <section class="about-section">
        <h2 class="section-title">Our Story</h2>
        <p>
          LangLearn was founded by a team of language enthusiasts and education technology experts who believed that learning a new language should be fun, engaging, and tailored to each learner's needs.
        </p>
        <p>
          We recognized that traditional language learning methods often fail because they're too rigid, boring, or disconnected from real-world usage. That's why we built LangLearn with a focus on gamification, personalization, and bite-sized lessons that fit into busy lives.
        </p>
      </section>
      
      <section class="about-section">
        <h2 class="section-title">Our Approach</h2>
        <div class="approach-grid">
          <div class="approach-card">
            <div class="approach-icon">🎮</div>
            <h3 class="approach-title">Gamification</h3>
            <p class="approach-description">
              We incorporate game elements like points, badges, streaks, and leaderboards to keep you motivated and engaged.
            </p>
          </div>
          
          <div class="approach-card">
            <div class="approach-icon">📊</div>
            <h3 class="approach-title">Data-Driven</h3>
            <p class="approach-description">
              Our adaptive learning system uses your performance data to personalize content and focus on areas that need improvement.
            </p>
          </div>
          
          <div class="approach-card">
            <div class="approach-icon">🧠</div>
            <h3 class="approach-title">Science-Backed</h3>
            <p class="approach-description">
              We apply research-proven techniques like spaced repetition, active recall, and comprehensible input.
            </p>
          </div>
          
          <div class="approach-card">
            <div class="approach-icon">🤝</div>
            <h3 class="approach-title">Community-Focused</h3>
            <p class="approach-description">
              Learning is more fun with friends. We foster a supportive community of language learners around the world.
            </p>
          </div>
        </div>
      </section>
      
      <section class="about-section">
        <h2 class="section-title">The Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">
              <span class="member-initials">JD</span>
            </div>
            <h3 class="member-name">Jane Doe</h3>
            <p class="member-role">Founder & CEO</p>
            <p class="member-bio">
              Language enthusiast who speaks 5 languages. Former language teacher with a passion for education technology.
            </p>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">
              <span class="member-initials">JS</span>
            </div>
            <h3 class="member-name">John Smith</h3>
            <p class="member-role">CTO</p>
            <p class="member-bio">
              AI specialist with expertise in natural language processing and adaptive learning systems.
            </p>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">
              <span class="member-initials">ML</span>
            </div>
            <h3 class="member-name">Maria Lopez</h3>
            <p class="member-role">Chief Linguist</p>
            <p class="member-bio">
              PhD in Applied Linguistics with extensive experience in curriculum development for language learning.
            </p>
          </div>
          
          <div class="team-member">
            <div class="member-avatar">
              <span class="member-initials">AK</span>
            </div>
            <h3 class="member-name">Alex Kim</h3>
            <p class="member-role">Lead Product Designer</p>
            <p class="member-bio">
              UX specialist focused on creating engaging educational experiences that delight users.
            </p>
          </div>
        </div>
      </section>
      
      <section class="about-section">
        <h2 class="section-title">Contact Us</h2>
        <p>Have questions, feedback, or suggestions? We'd love to hear from you!</p>
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-icon">✉️</span>
            <span class="contact-text" v-voix="'email-contact'" hint="LangLearn email contact">info@langlearn.example.com</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">🐦</span>
            <span class="contact-text" v-voix="'twitter-contact'" hint="LangLearn Twitter account">@LangLearnApp</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <span class="contact-text" v-voix="'location-contact'" hint="LangLearn company location">San Francisco, CA</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 1rem;
}

.about-subtitle {
  font-size: 1.25rem;
  color: var(--text-light);
  max-width: 700px;
  margin: 0 auto;
}

.about-section {
  margin-bottom: 4rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.75rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
}

.about-section p {
  line-height: 1.7;
  margin-bottom: 1rem;
  color: var(--text-color);
}

/* Approach cards */
.approach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.approach-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.approach-card:hover {
  transform: translateY(-5px);
}

.approach-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.approach-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
}

.approach-description {
  font-size: 0.875rem;
  color: var(--text-light);
  line-height: 1.6;
}

/* Team members */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.team-member {
  text-align: center;
}

.member-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.member-initials {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.member-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--primary-dark);
}

.member-role {
  color: var(--primary-color);
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.member-bio {
  font-size: 0.875rem;
  color: var(--text-light);
  line-height: 1.6;
}

/* Contact information */
.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-icon {
  font-size: 1.5rem;
}

.contact-text {
  font-weight: 500;
}

@media (max-width: 768px) {
  .approach-grid, .team-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
