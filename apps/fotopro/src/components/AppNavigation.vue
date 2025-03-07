<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Computed 
const currentRoute = computed(() => route.name)
</script>

<template>
  <nav class="app-navigation">
    <div class="app-title">
      <h1 v-voix="'app-title'">FotoPro Editor</h1>
    </div>
    
    <div class="nav-links">
      <RouterLink 
        to="/" 
        class="nav-link" 
        :class="{ active: currentRoute === 'library' }"
        v-voix="'library-link'"
        hint="Go to the photo library page">
        Library
      </RouterLink>
      
      <RouterLink 
        to="/albums" 
        class="nav-link" 
        :class="{ active: currentRoute === 'albums' }"
        v-voix="'albums-link'"
        hint="Go to the albums page">
        Albums
      </RouterLink>
      
      <RouterLink 
        to="/tags" 
        class="nav-link" 
        :class="{ active: currentRoute === 'tags' }"
        v-voix="'tags-link'"
        hint="Go to the tags page">
        Tags
      </RouterLink>
      
      <RouterLink 
        to="/about" 
        class="nav-link" 
        :class="{ active: currentRoute === 'about' }"
        v-voix="'about-link'"
        hint="Go to the about page">
        About
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.app-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
}

.app-title h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

@media (max-width: 600px) {
  .app-navigation {
    flex-direction: column;
    gap: 10px;
  }
  
  .nav-links {
    width: 100%;
    justify-content: space-between;
  }
}
</style>