<template>
    <section class="container-fluid p-4 p-lg-5" :dir="langStore.dir">

        <!-- ════ Toast ════ -->
        <Transition name="toast-pop">
            <div v-if="toast.show" class="st-toast" :class="toast.type">
                <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"
                    class="me-2" />
                {{ toast.message }}
            </div>
        </Transition>

        <!-- ════ Page Header ════ -->
        <div class="st-page-header mb-4">
            <div class="d-flex align-items-center gap-3">
                <div class="st-header-icon">
                    <i class="fas fa-sliders-h" />
                </div>
                <div>
                    <h4 class="fw-bold mb-0">{{ $t('settings.title') }}</h4>
                    <p class="text-muted mb-0 small">{{ $t('settings.subtitle') }}</p>
                </div>
            </div>
        </div>

        <!-- ════ Tab Bar ════ -->
        <div class="st-tab-bar mb-4">
            <button v-for="tab in tabs" :key="tab.key" class="st-tab-btn"
                :class="{ active: activeTab === tab.key, danger: tab.key === 'danger' && activeTab === tab.key }"
                @click="activeTab = tab.key">
                <i :class="tab.icon" />
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <!-- ════ Content ════ -->
        <Transition name="fade-slide" mode="out-in">
            <div :key="activeTab">
                <!-- ── General ── -->
                <div v-if="activeTab === 'general'" key="general" class="d-flex flex-column gap-4">

                    <!-- Language Card -->
                    <div class="st-card">
                        <div class="st-card-head">
                            <div class="st-section-icon lang">
                                <i class="fas fa-language" />
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0">{{ $t('settings.language.title') }}</h6>
                                <small class="text-muted">{{ $t('settings.language.sub') }}</small>
                            </div>
                        </div>
                        <div class="st-card-body">
                            <div class="lang-grid">
                                <button class="lang-card" :class="{ selected: langStore.lang === 'ar' }"
                                    @click="switchLang('ar')">
                                    <span class="lang-flag">🇵🇸</span>
                                    <div class="lang-card-info">
                                        <div class="fw-bold">العربية</div>
                                        <small class="text-muted">Arabic · RTL</small>
                                    </div>
                                    <div class="lang-check">
                                        <i v-if="langStore.lang === 'ar'" class="fas fa-check-circle text-success" />
                                        <div v-else class="lang-check-empty" />
                                    </div>
                                </button>
                                <button class="lang-card" :class="{ selected: langStore.lang === 'en' }"
                                    @click="switchLang('en')">
                                    <span class="lang-flag">🇺🇸</span>
                                    <div class="lang-card-info">
                                        <div class="fw-bold">English</div>
                                        <small class="text-muted">English · LTR</small>
                                    </div>
                                    <div class="lang-check">
                                        <i v-if="langStore.lang === 'en'" class="fas fa-check-circle text-success" />
                                        <div v-else class="lang-check-empty" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Date & Time Card -->
                    <div class="st-card">
                        <div class="st-card-head">
                            <div class="st-section-icon datetime">
                                <i class="fas fa-calendar-alt" />
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0">{{ $t('settings.datetime.title') }}</h6>
                                <small class="text-muted">{{ $t('settings.datetime.sub') }}</small>
                            </div>
                        </div>
                        <div class="st-card-body">
                            <MDBRow class="g-4">
                                <MDBCol md="6">
                                    <label class="form-label fw-semibold small">
                                        {{ $t('settings.datetime.timezone') }}
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-globe" /></span>
                                        <select class="form-select" v-model="generalForm.timezone">
                                            <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                                                {{ tz.label }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-text text-muted small">{{ $t('settings.datetime.timezoneNote') }}
                                    </div>
                                </MDBCol>
                                <MDBCol md="6">
                                    <label class="form-label fw-semibold small">
                                        {{ $t('settings.datetime.dateFormat') }}
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-calendar-alt" /></span>
                                        <select class="form-select" v-model="generalForm.date_format">
                                            <option v-for="df in dateFormats" :key="df.value" :value="df.value">
                                                {{ df.label }}
                                            </option>
                                        </select>
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <!-- Live Preview -->
                            <div class="datetime-preview mt-4">
                                <i class="fas fa-eye me-2 text-primary" />
                                <span class="text-muted small me-2">{{ $t('settings.datetime.preview') }}:</span>
                                <strong class="text-primary">{{ datePreview }}</strong>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- ── Notifications ── -->
                <div v-if="activeTab === 'notifications'" key="notifications">
                    <div class="st-card">
                        <div class="st-card-head">
                            <div class="st-section-icon notif">
                                <i class="fas fa-bell" />
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0">{{ $t('settings.notifications.title') }}</h6>
                                <small class="text-muted">{{ $t('settings.notifications.sub') }}</small>
                            </div>
                            <!-- Master Toggle -->
                            <div class="ms-auto d-flex align-items-center gap-2">
                                <small class="text-muted">{{ $t('settings.notifications.enableAll') }}</small>
                                <div class="form-check form-switch mb-0">
                                    <input class="form-check-input" type="checkbox" id="all-notif" :checked="allEnabled"
                                        @change="toggleAll" />
                                </div>
                            </div>
                        </div>
                        <div class="st-card-body p-0">
                            <div v-for="(notif, idx) in notifications" :key="notif.key" class="notif-row"
                                :class="{ 'border-bottom': idx < notifications.length - 1 }">
                                <div class="notif-left">
                                    <div class="notif-icon-wrap"
                                        :style="{ background: notif.color + '20', color: notif.color }">
                                        <i :class="notif.icon" />
                                    </div>
                                    <div>
                                        <div class="fw-semibold small">{{ notif.label }}</div>
                                        <div class="text-muted" style="font-size:0.8rem">{{ notif.desc }}</div>
                                    </div>
                                </div>
                                <div class="form-check form-switch mb-0">
                                    <input class="form-check-input" type="checkbox" :id="'n-' + notif.key"
                                        v-model="notif.enabled" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── Danger Zone ── -->
                <div v-if="activeTab === 'danger'" key="danger" class="d-flex flex-column gap-4">

                    <!-- Logout All Devices -->
                    <div class="st-card">
                        <div class="st-card-head">
                            <div class="st-section-icon warning">
                                <i class="fas fa-sign-out-alt" />
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0">{{ $t('settings.danger.sessions') }}</h6>
                                <small class="text-muted">{{ $t('settings.danger.sessionsSub') }}</small>
                            </div>
                        </div>
                        <div class="st-card-body">
                            <div class="danger-row">
                                <div>
                                    <p class="text-muted small mb-0">{{ $t('settings.danger.sessionsDesc') }}</p>
                                </div>
                                <MDBBtn outline="warning" class="danger-btn text-dark" :disabled="sessionLoading"
                                    @click="logoutAllDevices">
                                    <span v-if="sessionLoading">
                                        <i class="fas fa-spinner fa-spin me-2" />
                                    </span>
                                    <span v-else><i class="fas fa-sign-out-alt me-2" /></span>
                                    {{ $t('settings.danger.logoutAll') }}
                                </MDBBtn>
                            </div>
                        </div>
                    </div>

                    <!-- Deactivate Account -->
                    <div class="st-card danger-card">
                        <div class="st-card-head danger-head">
                            <div class="st-section-icon danger">
                                <i class="fas fa-user-slash" />
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0">{{ $t('settings.danger.deactivate') }}</h6>
                                <small class="text-muted">{{ $t('settings.danger.deactivateSub') }}</small>
                            </div>
                        </div>
                        <div class="st-card-body">
                            <div class="danger-row">
                                <p class="text-muted small mb-0">{{ $t('settings.danger.deactivateDesc') }}</p>
                                <MDBBtn outline="danger" class="danger-btn" @click="confirmAction = 'deactivate'">
                                    <i class="fas fa-user-slash me-2" />{{ $t('settings.danger.deactivate') }}
                                </MDBBtn>
                            </div>
                        </div>
                    </div>

                    <!-- Delete Account -->
                    <div class="st-card danger-card">
                        <div class="st-card-head danger-head">
                            <div class="st-section-icon delete">
                                <i class="fas fa-trash-alt" />
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0">{{ $t('settings.danger.deleteAccount') }}</h6>
                                <small class="text-muted">{{ $t('settings.danger.deleteAccountSub') }}</small>
                            </div>
                        </div>
                        <div class="st-card-body">
                            <div class="danger-row">
                                <p class="text-muted small mb-0">{{ $t('settings.danger.deleteAccountDesc') }}</p>
                                <MDBBtn color="danger" class="danger-btn" @click="confirmAction = 'delete'">
                                    <i class="fas fa-trash-alt me-2" />{{ $t('settings.danger.deleteAccount') }}
                                </MDBBtn>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Transition>

        <!-- ════ Confirm Dialog ════ -->
        <Transition name="modal-pop">
            <div v-if="confirmAction" class="confirm-backdrop" @click.self="confirmAction = null">
                <div class="confirm-box">
                    <div class="confirm-icon-wrap" :class="confirmAction">
                        <i :class="confirmAction === 'delete' ? 'fas fa-trash-alt' : 'fas fa-user-slash'" />
                    </div>
                    <h5 class="fw-bold mt-4 mb-2">
                        {{ confirmAction === 'delete' ? $t('settings.danger.confirmDeleteTitle') :
                            $t('settings.danger.confirmDeactivateTitle') }}
                    </h5>
                    <p class="text-muted small mb-4">
                        {{ confirmAction === 'delete' ? $t('settings.danger.confirmDeleteText') :
                            $t('settings.danger.confirmDeactivateText') }}
                    </p>

                    <!-- Confirm input for delete -->
                    <div v-if="confirmAction === 'delete'" class="mb-4">
                        <label class="form-label small fw-semibold text-danger">
                            {{ $t('settings.danger.typeToConfirm') }}:
                            <strong>DELETE</strong>
                        </label>
                        <input v-model="confirmInput" type="text" class="form-control text-center" placeholder="DELETE"
                            dir="ltr" />
                    </div>

                    <div class="d-flex gap-3 justify-content-center">
                        <MDBBtn outline="secondary" @click="confirmAction = null; confirmInput = ''">
                            {{ $t('settings.danger.cancel') }}
                        </MDBBtn>
                        <MDBBtn :color="confirmAction === 'delete' ? 'danger' : 'warning'" class="text-white"
                            :disabled="confirmAction === 'delete' && confirmInput !== 'DELETE'" @click="executeAction">
                            {{ confirmAction === 'delete'
                                ? $t('settings.danger.confirmDelete')
                                : $t('settings.danger.confirmDeactivate') }}
                        </MDBBtn>
                    </div>
                </div>
            </div>
        </Transition>

    </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBBtn, MDBRow, MDBCol } from 'mdb-vue-ui-kit'
import { useLangStore } from '@/stores/langStore'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'

const { t, locale } = useI18n()
const langStore = useLangStore()
const authStore = useAuthStore()

// ════ Toast ═══════════════════════════════
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
let toastTimer: ReturnType<typeof setTimeout>

function showToast(msg: string, type: 'success' | 'error' = 'success') {
    clearTimeout(toastTimer)
    toast.show = false
    setTimeout(() => {
        toast.message = msg; toast.type = type; toast.show = true
        toastTimer = setTimeout(() => { toast.show = false }, 4000)
    }, 60)
}

// ════ Tabs ════════════════════════════════
type Tab = 'general' | 'notifications' | 'danger'
const activeTab = ref<Tab>('general')

const tabs = computed(() => [
    { key: 'general' as Tab, label: t('settings.tabs.general'), icon: 'fas fa-sliders-h' },
    { key: 'notifications' as Tab, label: t('settings.tabs.notifications'), icon: 'fas fa-bell' },
    { key: 'danger' as Tab, label: t('settings.tabs.danger'), icon: 'fas fa-exclamation-triangle' },
])

// ════ Language ════════════════════════════
function switchLang(lang: 'ar' | 'en') {
    langStore.switchLang(lang)
    locale.value = lang
    showToast(t('settings.language.changed'))
}

// ════ General: Date & Time ════════════════
const generalForm = reactive({
    timezone: authStore.user?.company?.timezone ?? 'Asia/Jerusalem',
    date_format: authStore.user?.company?.date_format ?? 'Y-m-d',
})

const timezones = [
    { value: 'Asia/Jerusalem', label: 'Asia/Jerusalem  (UTC+2/+3)' },
    { value: 'Asia/Gaza', label: 'Asia/Gaza  (UTC+2/+3)' },
    { value: 'Asia/Amman', label: 'Asia/Amman  (UTC+3)' },
    { value: 'Asia/Riyadh', label: 'Asia/Riyadh  (UTC+3)' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai  (UTC+4)' },
    { value: 'Africa/Cairo', label: 'Africa/Cairo  (UTC+2/+3)' },
    { value: 'UTC', label: 'UTC  (UTC+0)' },
]

const dateFormats = [
    { value: 'Y-m-d', label: '2025-12-31  (ISO)' },
    { value: 'd/m/Y', label: '31/12/2025  (DD/MM/YYYY)' },
    { value: 'm/d/Y', label: '12/31/2025  (MM/DD/YYYY)' },
    { value: 'd-m-Y', label: '31-12-2025  (DD-MM-YYYY)' },
]

const datePreview = computed(() => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const y = now.getFullYear()
    const m = pad(now.getMonth() + 1)
    const d = pad(now.getDate())
    return generalForm.date_format
        .replace('Y', String(y))
        .replace('m', m)
        .replace('d', d)
})

// ════ Notifications ═══════════════════════
const notifications = reactive([
    {
        key: 'email',
        label: t('settings.notifications.email'),
        desc: t('settings.notifications.emailDesc'),
        icon: 'fas fa-envelope',
        color: '#1d334f',
        enabled: true,
    },
    {
        key: 'system',
        label: t('settings.notifications.system'),
        desc: t('settings.notifications.systemDesc'),
        icon: 'fas fa-bell',
        color: '#1d7342',
        enabled: true,
    },
    {
        key: 'security',
        label: t('settings.notifications.security'),
        desc: t('settings.notifications.securityDesc'),
        icon: 'fas fa-shield-alt',
        color: '#e67e22',
        enabled: true,
    },
    {
        key: 'reports',
        label: t('settings.notifications.reports'),
        desc: t('settings.notifications.reportsDesc'),
        icon: 'fas fa-chart-bar',
        color: '#8e44ad',
        enabled: false,
    },
    {
        key: 'updates',
        label: t('settings.notifications.updates'),
        desc: t('settings.notifications.updatesDesc'),
        icon: 'fas fa-sync-alt',
        color: '#2980b9',
        enabled: false,
    },
])

const allEnabled = computed(() => notifications.every(n => n.enabled))

function toggleAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked
    notifications.forEach(n => { n.enabled = checked })
}

// ════ Danger Zone ═════════════════════════
const sessionLoading = ref(false)
const confirmAction = ref<'deactivate' | 'delete' | null>(null)
const confirmInput = ref('')

async function logoutAllDevices() {
    sessionLoading.value = true
    try {
        await authService.logoutAll()
        await authStore.logout()
    } catch {
        showToast(t('settings.danger.logoutAllError'), 'error')
    } finally {
        sessionLoading.value = false
    }
}

function executeAction() {
    if (confirmAction.value === 'delete' && confirmInput.value !== 'DELETE') return
    // TODO: استدعاء الـ API لحذف أو تعطيل الحساب
    showToast(
        confirmAction.value === 'delete'
            ? t('settings.danger.deleteRequested')
            : t('settings.danger.deactivateRequested'),
        'success'
    )
    confirmAction.value = null
    confirmInput.value = ''
}
</script>

<style scoped>
/* ══ Toast ══ */
.st-toast {
    position: fixed;
    top: 1.5rem;
    inset-inline-end: 1.5rem;
    z-index: 9999;
    padding: 0.9rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    min-width: 280px;
}

.st-toast.success {
    background: #e8f5ee;
    color: #1d7342;
    border: 1px solid #c3e6d0;
}

.st-toast.error {
    background: #fdf0f0;
    color: #dc3545;
    border: 1px solid #f5c6cb;
}

.toast-pop-enter-active,
.toast-pop-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.toast-pop-enter-from,
.toast-pop-leave-to {
    opacity: 0;
    transform: translateY(-12px);
}

/* ══ Page Header ══ */
.st-page-header {
    background: #fff;
    border-radius: 1.25rem;
    padding: 1.5rem 2rem;
    border: 1px solid rgba(0, 0, 0, 0.07);
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.st-header-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #1d334f, #1d7342);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    box-shadow: 0 4px 12px rgba(29, 51, 79, 0.25);
}

/* ══ Tab Bar ══ */
.st-tab-bar {
    display: flex;
    gap: 0.5rem;
    background: #fff;
    border-radius: 1rem;
    padding: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.07);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    flex-wrap: wrap;
}

.st-tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.65rem 1.25rem;
    border-radius: 0.75rem;
    border: none;
    background: transparent;
    color: #6c757d;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.25s;
}

.st-tab-btn:hover {
    background: #f0f2f5;
    color: #1d334f;
}

.st-tab-btn.active {
    background: linear-gradient(135deg, #1d334f, #1d7342);
    color: #fff;
    box-shadow: 0 4px 14px rgba(29, 51, 79, 0.25);
}

.st-tab-btn.danger {
    background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
    box-shadow: 0 4px 14px rgba(220, 53, 69, 0.3);
}

/* ══ Cards ══ */
.st-card {
    background: #fff;
    border-radius: 1.25rem;
    border: 1px solid rgba(0, 0, 0, 0.07);
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.danger-card {
    border-color: #f5c6cb;
}

.st-card-head {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.75rem;
    border-bottom: 1px solid #eef0f3;
    background: linear-gradient(135deg, #f8fafb 0%, #fff 100%);
}

.danger-head {
    background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
}

.st-card-body {
    padding: 1.75rem;
}

/* Section Icons */
.st-section-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}

.st-section-icon.lang {
    background: linear-gradient(135deg, #1d334f, #1d7342);
}

.st-section-icon.datetime {
    background: linear-gradient(135deg, #2980b9, #1d334f);
}

.st-section-icon.notif {
    background: linear-gradient(135deg, #1d7342, #28a060);
}

.st-section-icon.warning {
    background: linear-gradient(135deg, #e67e22, #f39c12);
}

.st-section-icon.danger {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.st-section-icon.delete {
    background: linear-gradient(135deg, #c0392b, #96281b);
}

/* ══ Language Cards ══ */
.lang-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.lang-card {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 1rem 1.25rem;
    border: 2px solid #eef0f3;
    border-radius: 12px;
    background: #f8fafb;
    cursor: pointer;
    transition: all 0.22s;
    text-align: start;
}

.lang-card:hover {
    border-color: #1d334f;
    background: #f0f4f8;
}

.lang-card.selected {
    border-color: #1d7342;
    background: #e8f5ee;
    box-shadow: 0 0 0 3px rgba(29, 115, 66, 0.1);
}

.lang-flag {
    font-size: 2rem;
    line-height: 1;
}

.lang-card-info {
    flex-grow: 1;
}

.lang-check {
    font-size: 1.1rem;
}

.lang-check-empty {
    width: 18px;
    height: 18px;
    border: 2px solid #dee2e6;
    border-radius: 50%;
}

/* ══ DateTime Preview ══ */
.datetime-preview {
    display: inline-flex;
    align-items: center;
    background: #f0f7ff;
    border: 1px solid #bee3f8;
    border-radius: 8px;
    padding: 0.6rem 1rem;
    color: #1d334f;
}

/* ══ Notifications ══ */
.notif-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.75rem;
    gap: 1rem;
    border-color: #f0f2f5 !important;
    transition: background 0.15s;
}

.notif-row:hover {
    background: #fafbfc;
}

.notif-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex-grow: 1;
}

.notif-icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    flex-shrink: 0;
}

/* Bigger toggle switches */
.form-check-input[type="checkbox"] {
    width: 2.5em;
    height: 1.35em;
    cursor: pointer;
}

.form-check-input:checked {
    background-color: #1d7342 !important;
    border-color: #1d7342 !important;
}

/* ══ Danger Zone ══ */
.danger-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.danger-btn {
    min-width: 160px;
    height: 42px;
    font-weight: 600;
    border-radius: 9px !important;
    flex-shrink: 0;
}

/* ══ Confirm Dialog ══ */
.confirm-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.52);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
}

.confirm-box {
    background: #fff;
    border-radius: 1.25rem;
    padding: 2.5rem 2rem;
    max-width: 440px;
    width: 92%;
    text-align: center;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22);
}

.confirm-icon-wrap {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    margin: 0 auto;
}

.confirm-icon-wrap.deactivate {
    background: #fff3cd;
    color: #856404;
}

.confirm-icon-wrap.delete {
    background: #fdf0f0;
    color: #dc3545;
}

/* ══ Input Group RTL ══ */
.form-label.fw-semibold {
    font-size: 0.875rem;
    color: #344054;
    margin-bottom: 0.4rem;
}

[dir="rtl"] .input-group>.input-group-text:first-child {
    border-radius: 0 0.5rem 0.5rem 0;
}

[dir="rtl"] .input-group>.input-group-text:last-child {
    border-radius: 0.5rem 0 0 0.5rem;
}

[dir="rtl"] .input-group>.form-select,
[dir="rtl"] .input-group>.form-control {
    border-radius: 0;
}

/* ══ Transitions ══ */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.22s ease, transform 0.22s ease;
}

[dir="ltr"] .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(16px);
}

[dir="ltr"] .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-16px);
}

[dir="rtl"] .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-16px);
}

[dir="rtl"] .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(16px);
}

.modal-pop-enter-active,
.modal-pop-leave-active {
    transition: opacity 0.3s;
}

.modal-pop-enter-from,
.modal-pop-leave-to {
    opacity: 0;
}
</style>