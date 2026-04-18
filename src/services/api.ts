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
    timeout: 15000, // 15 ثانية حد أقصى للانتظار
})

// ═══════════════════════════════════════════════
//  Request Interceptor
//  يُضيف Bearer token تلقائياً مع كل request
// ═══════════════════════════════════════════════
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        const lang = localStorage.getItem('lang') ?? 'ar'
        config.params = { ...config.params, lang }

        return config
    },
    (error) => Promise.reject(error)
)

// ═══════════════════════════════════════════════
//  Response Interceptor
//  يعالج الأخطاء العامة مركزياً
// ═══════════════════════════════════════════════
api.interceptors.response.use(
    (response) => response, // نجاح → مرره كما هو

    (error) => {
        const status = error.response?.status

        // 401: انتهت الجلسة أو التوكن غير صالح
        if (status === 401) {
            localStorage.removeItem('token')
            // تجنب redirect loop إذا كنا أصلاً في /login
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