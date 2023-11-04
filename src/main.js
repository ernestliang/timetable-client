import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Toast from 'vue-toastification'
import { POSITION } from 'vue-toastification'
import router from './routing/router'

import { VueQrcodeReader } from "vue-qrcode-reader";

import './styles/bootstrap.scss'
import '@sweet/dist/sweetalert2.min.css';
import '@vueloader/dist/css/index.css'
import '@vuetoasty/dist/index.css'
import App from './App.vue'

createApp(App)
    .use(router)
    .use(VueQrcodeReader)
    .use(Toast, {position: POSITION.TOP_CENTER, timeout:2100})
    .use(createPinia())
    .mount('#app')

import 'bootstrap/dist/js/bootstrap';