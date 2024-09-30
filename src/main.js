import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import store from './stores/store';
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(store)
app.mount('#app')
