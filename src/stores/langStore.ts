import { defineStore } from 'pinia'
import { i18n } from '@/plugins/i18n'

export const useLangStore = defineStore('lang', {
    state: () => ({
        lang: (localStorage.getItem('lang') || 'ar') as 'ar' | 'en',
        dir: (localStorage.getItem('dir') || 'rtl') as 'rtl' | 'ltr',
    }),

    getters: {
        isRtl: (state) => state.dir === 'rtl',
        currentLocale: (state) => state.lang,
    },

    actions: {
        switchLang(newLang: 'ar' | 'en') {
            this.lang = newLang
            this.dir = newLang === 'ar' ? 'rtl' : 'ltr'

            localStorage.setItem('lang', this.lang)
            localStorage.setItem('dir', this.dir)

            // vue-i18n
            i18n.global.locale.value = newLang

            // سمات <html>
            document.documentElement.setAttribute('dir', this.dir)
            document.documentElement.setAttribute('lang', newLang)

            // تبديل CSS ملفات MDB
            const ltrLink = document.getElementById('mdb-ltr-css') as HTMLLinkElement | null
            const rtlLink = document.getElementById('mdb-rtl-css') as HTMLLinkElement | null

            if (ltrLink && rtlLink) {
                ltrLink.disabled = newLang === 'ar'
                rtlLink.disabled = newLang !== 'ar'
            }
        },

        initLanguage() {
            this.switchLang(this.lang)
        },
    },
})