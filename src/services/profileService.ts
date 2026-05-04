import api from './api'
import type { AuthUser } from '@/types/auth'

export interface UpdateProfilePayload {
    first_name: string
    last_name: string
    phone?: string
}

export interface UpdatePasswordPayload {
    current_password: string
    password: string
    password_confirmation: string
}

export const profileService = {

    /** تحديث البيانات الشخصية */
    async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
        const { data } = await api.put<{ user: AuthUser; message: string }>('auth/profile', payload)
        return data.user
    },

    /** رفع صورة البروفايل */
    async updateAvatar(file: File): Promise<string> {
        const form = new FormData()
        form.append('avatar', file)
        const { data } = await api.post<{ avatar: string; message: string }>(
            'auth/profile/avatar',
            form,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        return data.avatar
    },

    /** تغيير كلمة المرور */
    async updatePassword(payload: UpdatePasswordPayload): Promise<void> {
        await api.put('auth/password', payload)
    },

    /** تحديث بيانات الشركة — يدعم رفع الـ logo */
    async updateCompany(ulid: string, payload: Record<string, unknown>): Promise<any> {
        if (payload.logo instanceof File) {
            const form = new FormData()
            form.append('_method', 'PUT')
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    form.append(key, value as string | Blob)
                }
            })
            const { data } = await api.post(`core/companies/${ulid}/update`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return data
        }
        const { data } = await api.put(`core/companies/${ulid}/update`, payload)
        return data
    },
    
}