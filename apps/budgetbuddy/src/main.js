import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(router)

// Global filters
app.config.globalProperties.$filters = {
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency 
    }).format(amount)
  },
  
  formatDate(dateString) {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    }).format(date)
  }
}

app.mount('#app')