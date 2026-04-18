import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import CompanySetup from '@/views/company/CompanySetup.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import SettingsView from '@/views/settings/SettingsView.vue'

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
        return next(hasCompany ? { name: 'Dashboard' } : { name: 'CompanySetup' })
    }

    // 3️⃣ صفحة تحتاج شركة والمستخدم ليس لديه شركة
    if (to.meta.requiresCompany && isAuthenticated && !hasCompany) {
        return next({ name: 'CompanySetup' })
    }

    // 4️⃣ صفحة setup والمستخدم لديه شركة بالفعل
    if (to.meta.requiresNoCompany && isAuthenticated && hasCompany) {
        return next({ name: 'Dashboard' })
    }

    next()
})

export default router