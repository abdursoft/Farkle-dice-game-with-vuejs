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

const app = createApp(App)

app.use(createPinia())
app.use(ToastPlugin)
app.use(router)


app.mount('#app')
AOS.init()