import './assets/app.css'
import './assets/index.css'
import './assets/base.css'
import 'vue-toast-notification/dist/theme-default.css';

import AOS from 'aos'
import 'aos/dist/aos.css'

import ToastPlugin from 'vue-toast-notification';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { initEcho } from './plugins/Reverb';

// get token from localStorage (or Pinia if you manage auth state there)
const token = localStorage.getItem('dicToken')

// initialize echo once
initEcho(token)

const app = createApp(App)

app.use(createPinia())
app.use(ToastPlugin)
app.use(router)


app.mount('#app')
AOS.init()