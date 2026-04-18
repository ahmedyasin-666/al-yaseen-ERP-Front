import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as AuthUser | null,
        token: localStorage.getItem('token') ?? '',
        companyId: localStorage.getItem('company_id') ?? null as string | null,
        isLoading: false,
        error: null as string | null,
        roles: [] as string[],
        permissions: [] as string[],
    }),

    getters: {
        isAuthenticated: (state): boolean => !!state.token,
        hasCompany: (state): boolean => !!state.companyId,
        fullName: (state): string => state.user?.full_name ?? '',
        avatar: (state): string => state.user?.avatar ?? '',
        hasPermission: (state) => (perm: string): boolean =>
            state.permissions.includes(perm),
        hasRole: (state) => (role: string): boolean =>
            state.roles.includes(role),
        canSetupCompany: (state): boolean =>
            state.permissions.includes('api.core.companies.store'),
    },

    actions: {
        async login(payload: LoginPayload): Promise<void> {
            this._startLoading()
            try {
                const response = await authService.login(payload)
                this._setAuth(response.token, response.user, response.company_id)

                // ← التوجيه الذكي بناءً على وجود الشركة
                await router.push(response.company_id ? '/dashboard' : '/company-setup')
            } catch (err: unknown) {
                this.error = this._extractError(err)
                throw err
            } finally {
                this._stopLoading()
            }
        },

        async register(payload: RegisterPayload): Promise<void> {
            this._startLoading()
            try {
                const response = await authService.register(payload)
                this._setAuth(response.token, response.user, null)

                // ← مستخدم جديد → دائماً إلى setup
                await router.push('/company-setup')
            } catch (err: unknown) {
                this.error = this._extractError(err)
                throw err
            } finally {
                this._stopLoading()
            }
        },

        async logout(): Promise<void> {
            try {
                await authService.logout()
            } finally {
                this._clearAuth()
                await router.push('/login')
            }
        },

        async fetchMe(): Promise<void> {
            if (!this.token) return
            try {
                const data = await authService.me()
                this.user = data.user
                this.roles = data.roles
                this.permissions = data.permissions

                // مزامنة company_id من الباك اند
                const cid = data.company_id
                this.companyId = cid
                if (cid) {
                    localStorage.setItem('company_id', cid)
                } else {
                    localStorage.removeItem('company_id')
                }
            } catch {
                this._clearAuth()
            }
        },

        // ← يُستدعى من CompanySetup بعد نجاح الإنشاء
        setCompany(companyId: string): void {
            this.companyId = companyId
            localStorage.setItem('company_id', companyId)
            if (this.user) {
                this.user.company_id = companyId
            }
        },

        // ════ Private Helpers ════
        _setAuth(token: string, user: AuthUser, companyId: string | null): void {
            this.token = token
            this.user = user
            this.companyId = companyId
            localStorage.setItem('token', token)
            if (companyId) {
                localStorage.setItem('company_id', companyId)
            } else {
                localStorage.removeItem('company_id')
            }
        },

        _clearAuth(): void {
            this.token = ''
            this.user = null
            this.companyId = null
            localStorage.removeItem('token')
            localStorage.removeItem('company_id')
        },

        _startLoading(): void {
            this.isLoading = true
            this.error = null
        },

        _stopLoading(): void {
            this.isLoading = false
        },

        _extractError(err: unknown): string {
            if (typeof err !== 'object' || err === null) return 'حدث خطأ غير متوقع'
            const axiosErr = err as {
                response?: { data?: { message?: string; errors?: Record<string, string[]> } }
            }
            const data = axiosErr.response?.data
            if (data?.errors) {
                const fields = Object.keys(data.errors)
                if (fields.length > 0 && fields[0] !== undefined) {
                    return data.errors[fields[0]]?.[0] ?? 'حدث خطأ في البيانات المدخلة'
                }
            }
            if (data?.message) return data.message
            return 'حدث خطأ، حاول مرة أخرى'
        },
    },
})