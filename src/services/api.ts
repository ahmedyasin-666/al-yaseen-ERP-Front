import axios, { type AxiosInstance } from 'axios'
import router from '@/router'

// ═══════════════════════════════════════════════
//  إنشاء instance موحد لكل الـ requests
// ═══════════════════════════════════════════════
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 15000,
})

// ═══════════════════════════════════════════════
//  Request Interceptor
// ═══════════════════════════════════════════════
api.interceptors.request.use(
    (config) => {

        // ── Bearer Token ──────────────────────────────────────────
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // ── Language ──────────────────────────────────────────────
        const lang = localStorage.getItem('lang') ?? 'ar'
        config.params = { ...config.params, lang }

        // ── Company ID ────────────────────────────────────────────
        const companyId = localStorage.getItem('company_id')
        if (companyId) {
            config.headers['X-Company-Id'] = companyId
        }

        // ── Fiscal Year ID ────────────────────────────────────────
        // يُرسل مع كل request تلقائياً ليعرف الباك اند السنة المالية النشطة
        // الباك اند يقرأه من: X-Fiscal-Year-Id header
        const fiscalYearId = localStorage.getItem('fiscal_year_id')
        if (fiscalYearId) {
            config.headers['X-Fiscal-Year-Id'] = fiscalYearId
        }

        return config
    },
    (error) => Promise.reject(error)
)

// ═══════════════════════════════════════════════
//  Response Interceptor
// ═══════════════════════════════════════════════
api.interceptors.response.use(
    (response) => response,

    (error) => {
        const status = error.response?.status

        // 401: انتهت الجلسة أو التوكن غير صالح
        if (status === 401) {
            localStorage.removeItem('token')
            if (router.currentRoute.value.path !== '/login') {
                router.push('/login')
            }
        }

        // 403: ممنوع الوصول
        if (status === 403) {
            console.warn('Access Denied:', error.response?.data?.message)
        }

        // 500: خطأ في السيرفر
        if (status >= 500) {
            console.error('Server Error:', status)
        }

        return Promise.reject(error)
    }
)

export default api