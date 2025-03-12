import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/theme.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import registerGlobalComponents from './plugins/global-components'

const app = createApp(App)

registerGlobalComponents(app)

app.use(router)
app.mount('#app')