import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import {Tabs, Tab} from 'vue3-tabs-component'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('tabs', Tabs)
app.component('tab', Tab)

app.use(createPinia())
app.use(router)

app.mount('#app')
