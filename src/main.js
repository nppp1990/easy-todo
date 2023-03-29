import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus, { ClickOutside } from 'element-plus'
import store from '@/store';

import 'element-plus/dist/index.css'
import './assets/main.css'
import '@/assets/base/main.scss'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.directive('click-outside', ClickOutside)
app.use(store)

app.mount('#app')
