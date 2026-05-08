import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types/auth'
import router from '@/router'

// ── Storage Keys ──────────────────────────────────────────────
const TOKEN_KEY = 'token'
const COMPANY_KEY = 'company_id'
const FISCAL_YEAR_KEY = 'fiscal_year_id'
const COMPANY_STATUS_KEY = 'company_status'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as AuthUser | null,
        token: localStorage.getItem(TOKEN_KEY) ?? '',
        companyId: localStorage.getItem(COMPANY_KEY) ?? null as string | null,
        companyStatus: (localStorage.getItem(COMPANY_STATUS_KEY) ?? null) as string | null,
        isCompanyApproved: localStorage.getItem(COMPANY_STATUS_KEY) === 'active',
        isLoading: false,
        meLoaded: false,
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
        isPendingApproval: (state): boolean =>
            !!state.companyId && !state.isCompanyApproved,
    },

    actions: {

        // ══ Login ══════════════════════════════════════════════════════
        async login(payload: LoginPayload): Promise<void> {
            this._startLoading()
            try {
                const response = await authService.login(payload)

                this._setAuth(
                    response.token,
                    response.user,
                    response.company_id,
                    response.roles,
                    response.permissions,
                    response.company_status ?? null,
                    response.is_company_approved ?? false,
                )

                // ── السنة المالية الافتراضية من الباك اند ────────────
                // نحفظها فقط إن لم يكن المستخدم قد اختار سنة سابقاً
                this._initFiscalYear(response.fiscal_year_id ?? null)

                if (!response.company_id) {
                    await router.push('/company-setup')
                } else if (!response.is_company_approved) {
                    await router.push('/pending-approval')
                } else {
                    await router.push('/dashboard')
                }
            } catch (err: unknown) {
                this.error = this._extractError(err)
                throw err
            } finally {
                this._stopLoading()
            }
        },

        // ══ Register ═══════════════════════════════════════════════════
        async register(payload: RegisterPayload): Promise<void> {
            this._startLoading()
            try {
                const response = await authService.register(payload)

                this._setAuth(
                    response.token,
                    response.user,
                    null,
                    response.roles,
                    response.permissions,
                    response.company_status ?? null,
                    response.is_company_approved ?? false,
                )

                // مستخدم جديد → لا شركة → امسح أي سنة قديمة
                this._clearFiscalYear()

                await router.push('/company-setup')
            } catch (err: unknown) {
                this.error = this._extractError(err)
                throw err
            } finally {
                this._stopLoading()
            }
        },

        // ══ Logout ═════════════════════════════════════════════════════
        async logout(): Promise<void> {
            try {
                await authService.logout()
            } finally {
                this._clearAuth()
                await router.push('/login')
            }
        },

        // ══ Fetch Me (تحميل التطبيق) ════════════════════════════════
        async fetchMe(): Promise<void> {
            if (!this.token) return
            this.isLoading = true
            try {
                const data = await authService.me()
                this.user = data.user
                this.roles = data.roles
                this.permissions = data.permissions

                // مزامنة company_id من الباك اند
                const cid = data.company_id
                this.companyId = cid
                if (cid) {
                    localStorage.setItem(COMPANY_KEY, cid)
                } else {
                    localStorage.removeItem(COMPANY_KEY)
                }

                // ── حالة اعتماد الشركة ─────────────────────────────────
                this.companyStatus = data.company_status ?? null
                this.isCompanyApproved = data.is_company_approved ?? false
                const cs = data.company_status
                if (cs) {
                    localStorage.setItem(COMPANY_STATUS_KEY, cs)
                } else {
                    localStorage.removeItem(COMPANY_STATUS_KEY)
                }

                // ── السنة المالية ─────────────────────────────────────
                // نمرر السنة الافتراضية من الباك اند
                // _initFiscalYear ستحترم اختيار المستخدم السابق إن وُجد
                this._initFiscalYear(data.fiscal_year_id ?? null)

                this.meLoaded = true
            } catch {
                this._clearAuth()
                this.meLoaded = true
            } finally {
                this.isLoading = false
            }
        },

        async refreshApprovalStatus(): Promise<void> {
            await this.fetchMe()
        },

        // ── يُستدعى من CompanySetup بعد نجاح الإنشاء ─────────────────
        setCompany(companyId: string): void {
            this.companyId = companyId
            localStorage.setItem(COMPANY_KEY, companyId)
            if (this.user) {
                this.user.company_id = companyId
            }
        },


        // ════ Private Helpers ═════════════════════════════════════════

        /**
         * _initFiscalYear
         * المنطق:
         * 1. إن كان المستخدم قد اختار سنة مسبقاً في localStorage → نبقيها (لا نتغير)
         * 2. إن لم تكن موجودة → نحفظ السنة الافتراضية من الباك اند
         * 3. إن لم يكن هناك سنة افتراضية → نمسح الـ key تماماً (header يُرسل فارغ)
         */
        _initFiscalYear(defaultFromServer: string | null): void {
            const existing = localStorage.getItem(FISCAL_YEAR_KEY)

            if (existing) {
                // ✅ المستخدم اختار سنة سابقاً → نحترم اختياره
                return
            }

            if (defaultFromServer) {
                // 💾 لا يوجد اختيار سابق → احفظ السنة الافتراضية من الباك اند
                localStorage.setItem(FISCAL_YEAR_KEY, defaultFromServer)
            } else {
                // ⚠️ لا يوجد سنة افتراضية → امسح المفتاح (header لن يُرسل)
                localStorage.removeItem(FISCAL_YEAR_KEY)
            }
        },

        _clearFiscalYear(): void {
            localStorage.removeItem(FISCAL_YEAR_KEY)
        },

        _setAuth(
            token: string,
            user: AuthUser,
            companyId: string | null,
            roles: string[] = [],
            permissions: string[] = [],
            companyStatus: string | null = null,
            isCompanyApproved: boolean = false,
        ): void {
            this.token = token
            this.user = user
            this.companyId = companyId
            this.roles = roles
            this.permissions = permissions
            this.companyStatus = companyStatus
            this.isCompanyApproved = isCompanyApproved

            localStorage.setItem(TOKEN_KEY, token)

            if (companyId) {
                localStorage.setItem(COMPANY_KEY, companyId)
            } else {
                localStorage.removeItem(COMPANY_KEY)
            }

            if (companyStatus) {
                localStorage.setItem(COMPANY_STATUS_KEY, companyStatus)
            } else {
                localStorage.removeItem(COMPANY_STATUS_KEY)
            }
        },

        _clearAuth(): void {
            this.token = ''
            this.user = null
            this.companyId = null
            this.roles = []
            this.permissions = []
            this.companyStatus = null
            this.isCompanyApproved = false
            this.meLoaded = false

            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(COMPANY_KEY)
            localStorage.removeItem(FISCAL_YEAR_KEY) // ← امسح السنة عند تسجيل الخروج
            localStorage.removeItem(COMPANY_STATUS_KEY)
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