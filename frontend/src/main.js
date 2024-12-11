// Plugins
import { registerPlugins } from '@/plugins'
import axios from "axios";

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)


const api = 'https://buddyrail.com/api/'
//const api = 'http://localhost:5000/api/'


export const httpServer = axios.create({
  withCredentials: true,
  baseURL: api,
});

registerPlugins(app)

app.mount('#app')