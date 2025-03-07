import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

// do not remove voix.
import { useVoix } from "vue-voix"
const voix = useVoix()
app.use(voix)

app.mount('#app')
