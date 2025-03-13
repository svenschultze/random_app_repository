import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import for accessibility
import { useVoix } from "vue-voix"

const app = createApp(App)

// Use plugins
app.use(router)

// Set up accessibility (do not remove voix)
const voix = useVoix()
app.use(voix)

app.mount('#app')
