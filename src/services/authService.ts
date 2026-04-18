import api from './api'
import type {
    LoginPayload,
    RegisterPayload,
    AuthResponse,
    AuthUser,
} from '@/types/auth'

export const authService = {
    // ─── تسجيل الدخول ────────────────────────────
    async login(payload: LoginPayload): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('auth/login', {
            ...payload,
            device_name: payload.device_name ?? 'vue-app',
        })
        return data
    },

    // ─── إنشاء حساب جديد ─────────────────────────
    async register(payload: RegisterPayload): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('auth/register', payload)
        return data
    },

    // ─── تسجيل الخروج (الجهاز الحالي) ────────────
    async logout(): Promise<void> {
        await api.post('auth/logout')
    },

    // ─── تسجيل الخروج من كل الأجهزة ──────────────
    async logoutAll(): Promise<void> {
        await api.post('auth/logout-all')
    },

    // ─── جلب بيانات المستخدم الحالي ───────────────
    async me(): Promise<{ user: AuthUser; roles: string[]; permissions: string[]; company_id: string | null }> {
        const { data } = await api.get('auth/me')
        return data // ← ليس data.user فقط
    },
}