<template>
  <div class="about-view" v-voix="'about-view'" hint="About page with information about MyRecipeBook">
    <h1 v-voix="'about-heading'">About MyRecipeBook</h1>
    
    <div class="about-section mission-section">
      <h2 v-voix="'mission-heading'">Our Mission</h2>
      <div class="about-content">
        <div class="about-text">
          <p v-voix="'mission-paragraph-1'">
            MyRecipeBook started with a simple belief: cooking should be accessible, enjoyable, and
            a way to bring people together. Our mission is to create a community where food enthusiasts
            of all skill levels can discover new recipes, share their culinary creations, and connect
            through their shared love of food.
          </p>
          <p v-voix="'mission-paragraph-2'">
            We believe that recipes are more than just instructions—they're stories, traditions, and
            expressions of culture and creativity. By providing a platform for recipe sharing, we hope
            to preserve these culinary traditions while encouraging innovation and experimentation in
            the kitchen.
          </p>
        </div>
      </div>
    </div>
    
    <div class="about-section story-section">
      <h2 v-voix="'story-heading'">Our Story</h2>
      <div class="about-content">
        <div class="about-text">
          <p v-voix="'story-paragraph-1'">
            The idea for MyRecipeBook came about during a family gathering in 2020, when we realized
            how many cherished family recipes were at risk of being lost over time. What started as a
            simple digital collection of family recipes soon grew into a vision for a platform where
            anyone could preserve and share their favorite dishes.
          </p>
          <p v-voix="'story-paragraph-2'">
            Our team of food enthusiasts and web developers joined forces to create a user-friendly
            recipe sharing platform with features designed to make cooking more enjoyable and accessible.
            Today, MyRecipeBook continues to grow as more cooks around the world join our community.
          </p>
        </div>
      </div>
    </div>
    
    <div class="about-section features-section">
      <h2 v-voix="'features-heading'">Key Features</h2>
      <div class="features-grid">
        <div class="feature-card" v-voix="'feature-discovery'">
          <h3>Recipe Discovery</h3>
          <p>
            Browse our diverse collection of recipes from around the world, filtered by cuisine,
            difficulty, or ingredients.
          </p>
        </div>
        
        <div class="feature-card" v-voix="'feature-sharing'">
          <h3>Recipe Sharing</h3>
          <p>
            Share your own culinary creations with our community using our simple recipe submission form.
          </p>
        </div>
        
        <div class="feature-card" v-voix="'feature-markdown'">
          <h3>Markdown Support</h3>
          <p>
            Format your recipes beautifully with markdown, making them easy to read and follow.
          </p>
        </div>
        
        <div class="feature-card" v-voix="'feature-favorites'">
          <h3>Favorites</h3>
          <p>
            Save recipes you love to your favorites list for quick access when you're ready to cook.
          </p>
        </div>
      </div>
    </div>
    
    <div class="about-section testimonials-section">
      <h2 v-voix="'testimonials-heading'">What Our Users Say</h2>
      <div class="testimonials-grid">
        <div class="testimonial" v-voix="'testimonial-1'">
          <div class="testimonial-content">
            <p>
              "MyRecipeBook has transformed how I cook. The clear instructions and beautiful presentation
              make trying new recipes a joy."
            </p>
          </div>
          <div class="testimonial-author">
            <strong>Maria L.</strong>
            <span>Home Cook</span>
          </div>
        </div>
        
        <div class="testimonial" v-voix="'testimonial-2'">
          <div class="testimonial-content">
            <p>
              "I've discovered so many amazing recipes from different cultures that I would never have
              tried otherwise. It's expanded my culinary horizons!"
            </p>
          </div>
          <div class="testimonial-author">
            <strong>James T.</strong>
            <span>Cooking Enthusiast</span>
          </div>
        </div>
        
        <div class="testimonial" v-voix="'testimonial-3'">
          <div class="testimonial-content">
            <p>
              "The markdown editor for recipe instructions is brilliant. It makes my recipes look professional
              and easy to follow."
            </p>
          </div>
          <div class="testimonial-author">
            <strong>Sarah K.</strong>
            <span>Food Blogger</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="cta-section" v-voix="'cta-section'">
      <h2 v-voix="'cta-heading'">Join Our Community</h2>
      <p v-voix="'cta-text'">
        Ready to start sharing and discovering amazing recipes? Join our growing community of food lovers today!
      </p>
      <div class="cta-buttons">
        <RouterLink to="/recipes" class="cta-button secondary" v-voix="'browse-button'">
          Browse Recipes
        </RouterLink>
        <RouterLink to="/add" class="cta-button primary" v-voix="'add-recipe-button'">
          Add Your Recipe
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.about-view {
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.about-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.about-content {
  display: flex;
  justify-content: center;
}

.about-text {
  max-width: 800px;
  line-height: 1.6;
}

.about-text p {
  margin-bottom: 1.5rem;
}

/* Features section */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #ff6b6b;
}

/* Testimonials section */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.testimonial {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.testimonial-content {
  flex: 1;
  margin-bottom: 1rem;
}

.testimonial-content p {
  margin: 0;
  font-style: italic;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
}

.testimonial-author span {
  color: #666;
  font-size: 0.9rem;
}

/* CTA section */
.cta-section {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  color: white;
  border-radius: 8px;
}

.cta-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: white;
}

.cta-section p {
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background-color: white;
  color: #ff6b6b;
  border: none;
}

.cta-button.primary:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

.cta-button.secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.cta-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .features-grid, .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
