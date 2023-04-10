import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus, { ClickOutside } from 'element-plus'

import 'element-plus/dist/index.css'
import './assets/main.css'
import '@/assets/base/main.scss'
import { createPinia } from "pinia";

const app = createApp(App)

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"
import isTomorrow from "dayjs/plugin/isTomorrow"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(isTomorrow)
dayjs.extend(customParseFormat)

app.use(router)
app.use(ElementPlus)
app.directive('click-outside', ClickOutside)
app.use(createPinia())

app.mount('#app')
