import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n, { getInitialLanguage, setLanguage } from './i18n'

// Set initial language and direction
const initialLang = getInitialLanguage()
setLanguage(initialLang)

const app = createApp(App)

app.use(router)
app.use(i18n)

// do not remove voix.
import { useVoix } from "vue-voix"
const voix = useVoix()
app.use(voix)

app.mount('#app')
