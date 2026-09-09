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
import { createCustomI18n } from './I18'

const app = createApp(App)
const i18n = createCustomI18n('BN') // Set default locale to Bengali (Bangladesh)

app.use(createPinia())
app.use(ToastPlugin)
app.use(router)
app.use(i18n)

app.mount('#app')
AOS.init()