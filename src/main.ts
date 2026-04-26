import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { i18n } from '@/plugins/i18n'
import { useLangStore } from '@/stores/langStore'

// @ts-ignore
import mdbLtrUrl from 'mdb-vue-ui-kit/css/mdb.min.css?url'
// @ts-ignore
import mdbRtlUrl from 'mdb-vue-ui-kit/css/mdb.rtl.min.css?url'

// ─── حقن CSS قبل mount لتجنب FOUC ───
const defaultLang = (localStorage.getItem('lang') || 'ar') as 'ar' | 'en'
const defaultIsRtl = defaultLang === 'ar'

    ;[
        { id: 'mdb-ltr-css', href: mdbLtrUrl, disabled: defaultIsRtl },
        { id: 'mdb-rtl-css', href: mdbRtlUrl, disabled: !defaultIsRtl },
    ].forEach(({ id, href, disabled }) => {
        const link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        link.href = href
        link.disabled = disabled
        document.head.appendChild(link)
    })

// ─── تهيئة التطبيق ───
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

const langStore = useLangStore()
langStore.initLanguage()

app.mount('#app')