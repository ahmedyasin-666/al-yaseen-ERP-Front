import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'mdb-vue-ui-kit/css/mdb.min.css'
import { i18n } from "@/plugins/i18n";
import { useLangStore } from "@/stores/langStore";
import '@/assets/css/typography.css';

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
const langStore = useLangStore();
document.documentElement.setAttribute("dir", langStore.dir);
app.mount('#app')