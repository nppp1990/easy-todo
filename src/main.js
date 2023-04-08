import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus, { ClickOutside } from 'element-plus'

import 'element-plus/dist/index.css'
import './assets/main.css'
import '@/assets/base/main.scss'
import { createPinia } from "pinia";

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.directive('click-outside', ClickOutside)
app.use(createPinia())

app.mount('#app')
