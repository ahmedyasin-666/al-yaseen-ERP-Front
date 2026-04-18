import { defineStore } from "pinia";
import { i18n } from "@/plugins/i18n";

export const useLangStore = defineStore("lang", {
    state: () => ({
        lang: (localStorage.getItem("lang") || "ar") as "ar" | "en",   // default عربي لأن المشروع ERP ياسين
        dir: (localStorage.getItem("dir") || "rtl") as "rtl" | "ltr",
    }),

    getters: {
        isRtl: (state) => state.dir === "rtl",
        currentLocale: (state) => state.lang,
    },

    actions: {
        /**
         * تبديل اللغة مع دعم كامل لـ RTL / LTR + MDB CSS
         */
        switchLang(newLang: "ar" | "en") {
            // تحديث الـ state
            this.lang = newLang;
            this.dir = newLang === "ar" ? "rtl" : "ltr";

            // حفظ في localStorage
            localStorage.setItem("lang", this.lang);
            localStorage.setItem("dir", this.dir);

            // تحديث vue-i18n
            i18n.global.locale.value = newLang;

            // تحديث سمات الـ <html> tag
            document.documentElement.setAttribute("dir", this.dir);
            document.documentElement.setAttribute("lang", newLang);

            // === تبديل CSS ملفات MDB (الجزء الأهم) ===
            const mdbLtr = document.getElementById("mdb-ltr-css") as HTMLLinkElement | null;
            const mdbRtl = document.getElementById("mdb-rtl-css") as HTMLLinkElement | null;

            if (mdbLtr && mdbRtl) {
                if (newLang === "ar") {
                    mdbLtr.disabled = true;
                    mdbRtl.disabled = false;
                } else {
                    mdbLtr.disabled = false;
                    mdbRtl.disabled = true;
                }
            }

            // اختياري: إعادة تهيئة بعض كومبوننتس MDB بعد تغيير الاتجاه (مفيد للـ Sidebar, Dropdown, etc.)
            setTimeout(() => {
                // يمكنك إضافة هنا أي init إضافي تحتاجه لـ MDB JS
                // مثال: MDB.Modal.getInstance(...) أو إعادة تهيئة tooltips
            }, 150);
        },

        /**
         * تحميل اللغة المحفوظة عند بداية التطبيق (يُفضل استدعاؤها في main.ts)
         */
        initLanguage() {
            const savedLang = localStorage.getItem("lang") as "ar" | "en" | null;
            if (savedLang) {
                this.switchLang(savedLang);
            } else {
                // تطبيق الـ default (عربي)
                this.switchLang("ar");
            }
        },
    },
});