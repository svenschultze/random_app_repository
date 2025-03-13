<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { provide, ref, onMounted, reactive, watch } from 'vue'
import { faker } from '@faker-js/faker'
import VoixInput from '@/components/VoixInput.vue';

// Set up the store for our app
const user = ref(null)
const groceryItems = ref([])
const categories = ref([
  'Produce', 'Dairy', 'Bakery', 'Meat', 'Frozen', 'Pantry', 'Beverages', 'Snacks'
])

// Settings store
const appSettings = reactive({
  theme: {
    primary: '#4caf50',
    isDarkMode: false,
    fontSize: 'medium' // small, medium, large
  },
  display: {
    showImages: true,
    compactView: false,
    sortDefaultField: 'name'
  },
  notifications: {
    enabled: true,
    reminders: true,
    shoppingDay: 'Saturday'
  },
  dashboard: {
    widgets: {
      userProfile: true,
      summaryStats: true,
      progressBar: true,
      recentItems: true,
      categoryBreakdown: false
    },
    layout: 'standard' // standard, compact, expanded
  }
})

// Function to generate random user data
const generateUserData = () => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    email: faker.internet.email(),
    bio: faker.person.bio()
  }
}

// Function to generate random grocery items
const generateGroceryItems = () => {
  const items = []
  // Create random number of grocery items (between 8-15)
  const itemCount = faker.number.int({ min: 8, max: 15 })
  
  for (let i = 0; i < itemCount; i++) {
    const category = categories.value[faker.number.int({ min: 0, max: categories.value.length - 1 })]
    items.push({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      unit: ['pack', 'kg', 'lb', 'pcs', 'bottle', 'can'][faker.number.int({ min: 0, max: 5 })],
      category: category,
      isPurchased: faker.datatype.boolean({ probability: 0.3 }),
      price: parseFloat(faker.commerce.price({ min: 1, max: 30 })),
      image: faker.image.urlLoremFlickr({ category: 'food' }),
      notes: faker.lorem.sentence(),
      dateAdded: faker.date.recent()
    })
  }
  return items
}

// Load random data when component is mounted
onMounted(() => {
  user.value = generateUserData()
  groceryItems.value = generateGroceryItems()
})

// Apply theme changes
const applyTheme = () => {
  document.documentElement.style.setProperty('--color-primary', appSettings.theme.primary);
  document.documentElement.classList.toggle('dark-mode', appSettings.theme.isDarkMode);
  document.documentElement.setAttribute('data-font-size', appSettings.theme.fontSize);
}

// Watch for theme changes
watch(() => appSettings.theme, applyTheme, { deep: true, immediate: true });

// Provide data to all child components
provide('user', user)
provide('groceryItems', groceryItems)
provide('categories', categories)
provide('appSettings', appSettings)
</script>

<template>
  <header>
    <div class="logo-container">
      <h1 v-voix="'app-title'">FreshList</h1>
    </div>

    <nav>
      <RouterLink to="/" v-voix="'nav-home'">Dashboard</RouterLink>
      <RouterLink to="/list" v-voix="'nav-list'">Grocery List</RouterLink>
      <RouterLink to="/settings" v-voix="'nav-settings'">Settings</RouterLink>
      <RouterLink to="/about" v-voix="'nav-about'">About</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <VoixInput />

  <footer>
    <p>FreshList Demo App - Reload for new random data</p>
  </footer>
</template>

<style>
@import '@/assets/main.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: var(--color-primary);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--box-shadow);
  transition: background-color 0.3s;
}

.logo-container h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    gap: 1rem;
  }
  
  nav {
    width: 100%;
    justify-content: center;
  }
}
</style>