import api from './api'
import type {
    LoginPayload,
    RegisterPayload,
    AuthResponse,
    MeResponse,
} from '@/types/auth'

export const authService = {

    // ─── تسجيل الدخول ────────────────────────────────────────
    async login(payload: LoginPayload): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('auth/login', {
            ...payload,
            device_name: payload.device_name ?? 'vue-app',
        })
        return data
    },

    // ─── إنشاء حساب جديد ─────────────────────────────────────
    async register(payload: RegisterPayload): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('auth/register', payload)
        return data
    },

    // ─── تسجيل الخروج (الجهاز الحالي) ────────────────────────
    async logout(): Promise<void> {
        await api.post('auth/logout')
    },

    // ─── تسجيل الخروج من كل الأجهزة ──────────────────────────
    async logoutAll(): Promise<void> {
        await api.post('auth/logout-all')
    },

    // ─── جلب بيانات المستخدم الحالي ───────────────────────────
    // يُستدعى عند كل تحميل للتطبيق (App.vue أو router guard)
    async me(): Promise<MeResponse> {
        const { data } = await api.get<MeResponse>('auth/me')
        return data
    },
}