import { createRouter, createWebHistory } from 'vue-router'
const MainLayout = () => import('@/layouts/MainLayout.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')
const CompanySetup = () => import('@/views/company/CompanySetup.vue')
const ProfileView = () => import('@/views/profile/ProfileView.vue')
const SettingsView = () => import('@/views/settings/SettingsView.vue')
const FiscalYearsView = () => import('@/views/fiscal-years/FiscalYearsView.vue')
const Accounts = () => import('@/views/financial/accounts/Accounts.vue')
const Journals = () => import('@/views/financial/Journals/Journals.vue')
const Entries = () => import('@/views/financial/entries/Entries.vue')
const CostCenters = () => import('@/views/financial/CostCenters/CostCenters.vue')
const Reports = () => import('@/views/financial/reports/Reports.vue')
const OpeningBalance = () => import('@/views/financial/OpeningBalance.vue')
const YearEndClosing = () => import('@/views/financial/YearEndClosing.vue')

const routes = [
    // ─── صفحات الزوار فقط ──────────────────────────────
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guest: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { guest: true },
    },

    // ─── إعداد الشركة (مسجل دخول + بدون شركة) ──────────
    {
        path: '/company-setup',
        name: 'CompanySetup',
        component: CompanySetup,
        meta: {
            requiresAuth: true,
            requiresNoCompany: true,   // ← يمنع من لديه شركة من الدخول
        },
    },

    {
        path: '/pending-approval',
        name: 'PendingApproval',
        component: () => import('@/views/company/PendingApproval.vue'),
        meta: { requiresAuth: true },
    },

    // ─── صفحات محمية (تتطلب تسجيل دخول + شركة) ────────
    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true, requiresCompany: true },
        children: [
            { path: '', redirect: '/dashboard' },
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: Dashboard,
            },
            {
                path: 'profile',
                name: 'Profile',
                component: ProfileView,
            },

            {
                path: 'settings',
                name: 'Settings',
                component: SettingsView,
            },
            {
                path: 'settings/fiscal-years',
                name: 'FiscalYears',
                component: FiscalYearsView,
                meta: { requiresAuth: true, requiresCompany: true },
            },
            // Accounting Periods (nested under fiscal years settings)
            {
                path: '/settings/fiscal-years/:fiscalYearUlid/periods',
                name: 'AccountingPeriods',
                component: () => import('@/views/fiscal-years/AccountingPeriodsView.vue'),
                meta: { requiresAuth: true, requiresCompany: true },
            },

            // ─── Financial Module ─────────────────────────────────────
            {
                path: 'financial/accounts',
                name: 'Accounts',
                component: Accounts,
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: 'financial/journals',
                name: 'Journals',
                component: Journals,
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: 'financial/entries',
                name: 'Entries',
                component: Entries,
                meta: { requiresAuth: true, requiresCompany: true },
            },
            // Tax Management
            {
                path: '/financial/tax-rates',
                name: 'TaxRates',
                component: () => import('@/views/financial/tax/TaxRates.vue'),
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: '/financial/tax-groups',
                name: 'TaxGroups',
                component: () => import('@/views/financial/tax/TaxGroups.vue'),
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: 'financial/cost-centers',
                name: 'CostCenters',
                component: CostCenters,
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: 'financial/reports',
                name: 'FinancialReports',
                component: Reports,
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: 'financial/opening-balance',
                name: 'OpeningBalance',
                component: OpeningBalance,
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: 'financial/year-end-closing',
                name: 'YearEndClosing',
                component: YearEndClosing,
                meta: { requiresAuth: true, requiresCompany: true },
            },
            // ── Business Partners ──
            {
                path: '/partners/customers',
                name: 'Customers',
                component: () => import('@/views/partners/customers/Customers.vue'),
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: '/partners/customers/:ulid',
                name: 'CustomerDetail',
                component: () => import('@/views/partners/customers/CustomerDetail.vue'),
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: '/partners/suppliers',
                name: 'Suppliers',
                component: () => import('@/views/partners/suppliers/Suppliers.vue'),
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: '/partners/suppliers/:ulid',
                name: 'SupplierDetail',
                component: () => import('@/views/partners/suppliers/SupplierDetail.vue'),
                meta: { requiresAuth: true, requiresCompany: true },
            },
            {
                path: '/partners/payment-terms',
                name: 'PaymentTerms',
                component: () => import('@/views/partners/PaymentTerms.vue'),
                meta: { requiresAuth: true, requiresCompany: true },
            },

        ],
    },

    { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// ═══════════════════════════════════════════════
//  Navigation Guard — منطق الحماية الكامل
// ═══════════════════════════════════════════════
router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('token')
    const companyId = localStorage.getItem('company_id')

    const isAuthenticated = !!token
    const hasCompany = !!companyId

    // 1️⃣ صفحة تحتاج تسجيل دخول والمستخدم غير مسجل
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'Login' })
    }

    // 2️⃣ صفحة الزوار والمستخدم مسجل بالفعل
    if (to.meta.guest && isAuthenticated) {
        if (!hasCompany) return next({ name: 'CompanySetup' })
        const companyStatus = localStorage.getItem('company_status')
        if (companyStatus !== 'active') return next({ name: 'PendingApproval' })
        return next({ name: 'Dashboard' })
    }

    // 3️⃣ صفحة تحتاج شركة والمستخدم ليس لديه شركة
    if (to.meta.requiresCompany && isAuthenticated && !hasCompany) {
        return next({ name: 'CompanySetup' })
    }

    // 4️⃣ لديه شركة لكن غير معتمدة → pending-approval
    const companyStatus = localStorage.getItem('company_status')
    const isApproved = companyStatus === 'active'

    if (to.meta.requiresCompany && isAuthenticated && hasCompany && !isApproved) {
        if (to.name !== 'PendingApproval') {
            return next({ name: 'PendingApproval' })
        }
    }

    // 5️⃣ الشركة معتمدة ويحاول الوصول لصفحة pending → dashboard
    if (to.name === 'PendingApproval' && isAuthenticated && hasCompany && isApproved) {
        return next({ name: 'Dashboard' })
    }

    // 6️⃣ صفحة setup والمستخدم لديه شركة بالفعل
    if (to.meta.requiresNoCompany && isAuthenticated && hasCompany) {
        return next({ name: 'Dashboard' })
    }

    next()
})

export default router