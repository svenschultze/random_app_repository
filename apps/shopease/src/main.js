import './assets/main.css'
import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

// Initialize Vue Voix for accessibility
import { useVoix } from "vue-voix"
const voix = useVoix()
app.use(voix)

app.mount('#app')
