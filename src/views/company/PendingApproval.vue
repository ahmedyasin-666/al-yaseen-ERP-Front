<template>
    <div class="setup-layout d-flex min-vh-100" :dir="langStore.dir">
        <!-- ══ Sidebar (same style as CompanySetup) ══ -->
        <div class="setup-sidebar d-none d-lg-flex flex-column p-4">
            <div class="mb-5">
                <img src="@/assets/images/logo-brand.png" alt="Logo" width="200" />
            </div>

            <div class="flex-grow-1">
                <div class="text-white fw-semibold mb-2">{{ companyTitle || '—' }}</div>
                <div class="text-white-50 small">{{ $t('pendingApproval.title') }}</div>
            </div>

            <div class="sidebar-footer mt-auto">
                <button class="sidebar-ctrl-btn mb-2" @click="toggleLang">
                    <i :class="['fas fa-language', langStore.lang === 'en' ? 'me-2' : 'ms-2']"></i>
                    {{ langStore.lang === 'ar' ? 'English' : 'عربي' }}
                </button>
                <button class="sidebar-ctrl-btn logout-btn" @click="handleLogout" :disabled="isRefreshing">
                    <i :class="['fas fa-sign-out-alt', langStore.lang === 'en' ? 'me-2' : 'ms-2']"></i>
                    {{ $t('pendingApproval.logout') }}
                </button>
            </div>
        </div>

        <!-- ══ Main Content ══ -->
        <div class="setup-content flex-grow-1 d-flex flex-column mt-5">
            <div class="mobile-topbar d-flex d-lg-none align-items-center justify-content-between px-3 py-2">
                <img src="@/assets/images/logo-brand.png" alt="Logo" height="32" />
                <div class="d-flex gap-2">
                    <button class="mobile-ctrl-btn" @click="toggleLang">
                        <i class="fas fa-language"></i>
                    </button>
                    <button class="mobile-ctrl-btn" @click="handleLogout" :disabled="isRefreshing">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>

            <div class="setup-form-wrapper flex-grow-1 d-flex align-items-start justify-content-center p-4">
                <div class="setup-card bg-white rounded-4 w-100">
                    <div class="card-header-section">
                        <div class="d-flex align-items-center gap-3">
                            <div class="step-icon-badge">
                                <i class="fas fa-user-clock"></i>
                            </div>
                            <div>
                                <h4 class="fw-bold mb-0">{{ $t('pendingApproval.title') }}</h4>
                                <p class="text-muted mb-0 small mt-1">
                                    {{ $t('pendingApproval.message') }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="card-body-section">
                        <div class="info-card rounded-3 p-4">
                            <div class="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                                <div>
                                    <div class="text-muted small mb-1">{{ $t('pendingApproval.status') }}</div>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="status-badge" :class="statusClass">
                                            {{ statusLabel }}
                                        </span>
                                        <span class="text-muted small">{{ $t('pendingApproval.willNotify') }}</span>
                                    </div>
                                </div>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-success px-4" @click="refreshStatus" :disabled="isRefreshing">
                                        <span v-if="isRefreshing" class="d-flex align-items-center gap-2">
                                            <i class="fas fa-spinner fa-spin"></i>
                                            {{ $t('common.processing') }}
                                        </span>
                                        <span v-else class="d-flex align-items-center gap-2">
                                            <i class="fas fa-sync-alt"></i>
                                            {{ $t('pendingApproval.refreshStatus') }}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div v-if="isBlocked && rejectionReason" class="alert alert-danger mt-3 mb-0">
                                <div class="fw-semibold mb-1">{{ $t('pendingApproval.rejectionReason') }}</div>
                                <div>{{ rejectionReason }}</div>
                            </div>

                            <div class="text-muted small mt-3">
                                <i class="fas fa-life-ring me-2"></i>
                                {{ $t('pendingApproval.contactSupport') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authStore'
import { useLangStore } from '@/stores/langStore'
import router from '@/router'

const authStore = useAuthStore()
const langStore = useLangStore()
const { t, locale } = useI18n()

const isRefreshing = ref(false)

const companyTitle = computed(() => authStore.user?.company?.title ?? '')
const rejectionReason = computed(() => authStore.user?.company?.rejection_reason ?? null)

const status = computed(() => authStore.companyStatus ?? 'pending')
const isBlocked = computed(() => status.value === 'blocked')

const statusLabel = computed(() => {
    if (status.value === 'blocked') return t('pendingApproval.blocked')
    return t('pendingApproval.pending')
})

const statusClass = computed(() => {
    if (status.value === 'blocked') return 'status-danger'
    return 'status-warning'
})

function toggleLang() {
    const lang = langStore.lang === 'ar' ? 'en' : 'ar'
    langStore.switchLang(lang)
    locale.value = lang
}

async function refreshStatus() {
    if (isRefreshing.value) return
    isRefreshing.value = true
    try {
        await authStore.refreshApprovalStatus()
        if (authStore.isCompanyApproved) {
            await router.push('/dashboard')
        }
    } finally {
        isRefreshing.value = false
    }
}

async function handleLogout() {
    await authStore.logout()
}
</script>

<style scoped>
.setup-layout {
    background-color: #f0f2f5;
}

.setup-sidebar {
    width: 280px;
    background: linear-gradient(160deg, #1d334f 0%, #1d7342 100%);
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
}

.sidebar-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 1rem;
}

.sidebar-ctrl-btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
}

.sidebar-ctrl-btn:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.45);
    color: #fff;
}

.logout-btn {
    border-color: rgba(220, 53, 69, 0.4);
}

.logout-btn:hover {
    background: rgba(220, 53, 69, 0.2) !important;
    border-color: rgba(220, 53, 69, 0.7) !important;
}

.mobile-topbar {
    background: linear-gradient(90deg, #1d334f, #1d7342);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-ctrl-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.mobile-ctrl-btn:hover {
    background: rgba(255, 255, 255, 0.25);
}

.setup-form-wrapper {
    padding: 2rem 1.5rem;
    align-items: flex-start !important;
}

.setup-card {
    max-width: 800px;
    border: 1px solid rgba(0, 0, 0, .07);
    box-shadow: 0 2px 16px rgba(0, 0, 0, .06);
}

.card-header-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem 2rem;
    border-bottom: 1px solid #eef0f3;
    background: linear-gradient(135deg, #f8fafb 0%, #ffffff 100%);
    gap: 1rem;
    flex-wrap: wrap;
    border-radius: 1rem 1rem 0 0;
}

.step-icon-badge {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #1d334f, #1d7342);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(29, 51, 79, 0.25);
}

.card-body-section {
    padding: 2rem 2rem 2.5rem;
}

.info-card {
    background: #f8fafb;
    border: 1px solid #e3e8ed;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem 0.9rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.85rem;
}

.status-warning {
    background: rgba(255, 193, 7, 0.15);
    color: #cc9a00;
    border: 1px solid rgba(255, 193, 7, 0.25);
}

.status-danger {
    background: rgba(220, 53, 69, 0.12);
    color: #dc3545;
    border: 1px solid rgba(220, 53, 69, 0.22);
}
</style>
