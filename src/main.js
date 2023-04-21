import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus, { ClickOutside } from 'element-plus'
import '@/utils/polyfill'
import 'element-plus/dist/index.css'
import './assets/main.css'
import '@/assets/base/main.scss'
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

app.use(router)
app.use(ElementPlus)
app.directive('click-outside', ClickOutside)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);
app.use(pinia)

app.mount('#app')
