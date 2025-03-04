import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vue3Lottie from 'vue3-lottie'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(Vue3Lottie)

import { useVoix } from "vue-voix"

const voix = useVoix()
app.use(voix)

console.log(process.env.DEV)

app.mount('#app')
