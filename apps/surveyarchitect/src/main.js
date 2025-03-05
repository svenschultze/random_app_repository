import './assets/main.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'

// i18n setup
const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      welcome: 'Welcome to Survey Architect',
      create_survey: 'Create New Survey',
      load_survey: 'Load Existing Survey',
      export_survey: 'Export Survey'
    }
  }
})

const app = createApp(App)

app.use(router)
app.use(i18n)

// do not remove voix.
import { useVoix } from "vue-voix"
const voix = useVoix()
app.use(voix)

app.mount('#app')
