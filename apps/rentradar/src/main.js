import './assets/main.css'
import 'leaflet/dist/leaflet.css'
import 'primeicons/primeicons.css'
import '@primeuix/styles/base'
import 'primeflex/primeflex.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

// PrimeVue components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Menubar from 'primevue/menubar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Password from 'primevue/password'

// Firebase setup
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDummyKey-ThisIsNotReal",
  authDomain: "rentradar.firebaseapp.com",
  projectId: "rentradar",
  storageBucket: "rentradar.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
}

initializeApp(firebaseConfig)

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(PrimeVue, {
  ripple: true,
  inputStyle: 'filled'
})
app.use(ToastService)

// Register PrimeVue components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Dropdown', Dropdown)
app.component('MultiSelect', MultiSelect)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Card', Card)
app.component('Dialog', Dialog)
app.component('Toast', Toast)
app.component('Menubar', Menubar)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Checkbox', Checkbox)
app.component('RadioButton', RadioButton)
app.component('Password', Password)

// Setup voix for accessibility
import { useVoix } from "vue-voix"
app.use(useVoix())

app.mount('#app')
