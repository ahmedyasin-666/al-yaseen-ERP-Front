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
                            <div class="st-section-icon lang"><i class="fas fa-language" /></div>
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
                            <div class="st-section-icon datetime"><i class="fas fa-calendar-alt" /></div>
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
                                        <select class="form-select" v-model="settingsForm.timezone">
                                            <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                                                {{ tz.label }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-text text-muted small">
                                        {{ $t('settings.datetime.timezoneNote') }}
                                    </div>
                                </MDBCol>
                                <MDBCol md="6">
                                    <label class="form-label fw-semibold small">
                                        {{ $t('settings.datetime.dateFormat') }}
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-calendar-alt" /></span>
                                        <select class="form-select" v-model="settingsForm.date_format">
                                            <option v-for="df in dateFormats" :key="df.value" :value="df.value">
                                                {{ df.label }}
                                            </option>
                                        </select>
                                    </div>
                                </MDBCol>
                            </MDBRow>

                            <!-- Preview -->
                            <div class="datetime-preview mt-4">
                                <i class="fas fa-eye me-2 text-primary" />
                                <span class="text-muted small me-2">{{ $t('settings.datetime.preview') }}:</span>
                                <strong class="text-primary">{{ datePreview }}</strong>
                            </div>

                            <!-- زر الحفظ -->
                            <div class="form-footer">
                                <MDBBtn color="primary" class="action-btn" :disabled="settingsSaving"
                                    @click="saveSettings">
                                    <span v-if="settingsSaving">
                                        <i class="fas fa-spinner fa-spin me-2" />{{ $t('common.saving') }}
                                    </span>
                                    <span v-else>
                                        <i class="fas fa-save me-2" />{{ $t('settings.datetime.save') }}
                                    </span>
                                </MDBBtn>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- ══════════════════════════════════════════════════════════ -->
                <!-- ── Currencies ── -->
                <!-- ══════════════════════════════════════════════════════════ -->
                <div v-if="activeTab === 'currencies'" key="currencies">

                    <!-- ════ بطاقة مصدر سعر الصرف ════ -->
                    <div class="st-card mb-4">
                        <div class="st-card-head">
                            <div class="st-section-icon source-icon">
                                <i class="fas fa-sliders-h" />
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="fw-bold mb-0">{{ $t('currencies.sourceTitle') }}</h6>
                                <small class="text-muted">{{ $t('currencies.sourceSub') }}</small>
                            </div>
                        </div>
                        <div class="st-card-body">

                            <!-- Skeleton loading -->
                            <div v-if="sourceLoading" class="source-grid">
                                <div v-for="n in 3" :key="n" class="source-card-skeleton" />
                            </div>

                            <!-- بطاقات المصادر الثلاثة -->
                            <div v-else class="source-grid">

                                <!-- manual -->
                                <button class="source-option-card"
                                    :class="{ selected: currentSource?.source === 'manual' }"
                                    @click="changeSource('manual')" :disabled="sourceSaving">
                                    <div class="source-icon-wrap manual">
                                        <i class="fas fa-pencil-alt" />
                                    </div>
                                    <div class="source-card-body">
                                        <div class="fw-bold small">{{ $t('currencies.source.manualLabel') }}</div>
                                        <div class="text-muted" style="font-size:.75rem">
                                            {{ $t('currencies.source.manualDesc') }}
                                        </div>
                                    </div>
                                    <div class="source-check">
                                        <i v-if="currentSource?.source === 'manual'"
                                            class="fas fa-check-circle text-primary" />
                                        <div v-else class="source-check-empty" />
                                    </div>
                                </button>

                                <!-- system -->
                                <button class="source-option-card"
                                    :class="{ selected: currentSource?.source === 'system' }"
                                    @click="changeSource('system')" :disabled="sourceSaving">
                                    <div class="source-icon-wrap system">
                                        <i class="fas fa-server" />
                                    </div>
                                    <div class="source-card-body">
                                        <div class="fw-bold small">{{ $t('currencies.source.systemLabel') }}</div>
                                        <div class="text-muted" style="font-size:.75rem">
                                            {{ $t('currencies.source.systemDesc') }}
                                        </div>
                                    </div>
                                    <div class="source-check">
                                        <i v-if="currentSource?.source === 'system'"
                                            class="fas fa-check-circle text-success" />
                                        <div v-else class="source-check-empty" />
                                    </div>
                                </button>

                                <!-- market -->
                                <button class="source-option-card"
                                    :class="{ selected: currentSource?.source === 'market' }"
                                    @click="changeSource('market')" :disabled="sourceSaving">
                                    <div class="source-icon-wrap market">
                                        <i class="fas fa-chart-line" />
                                    </div>
                                    <div class="source-card-body">
                                        <div class="fw-bold small">{{ $t('currencies.source.marketLabel') }}</div>
                                        <div class="text-muted" style="font-size:.75rem">
                                            {{ $t('currencies.source.marketDesc') }}
                                        </div>
                                    </div>
                                    <div class="source-check">
                                        <i v-if="currentSource?.source === 'market'"
                                            class="fas fa-check-circle text-purple" />
                                        <div v-else class="source-check-empty" />
                                    </div>
                                </button>

                            </div>

                            <!-- شريط الوصف + زر مزامنة -->
                            <div v-if="currentSource && !sourceLoading" class="source-info-bar mt-3">
                                <div class="d-flex align-items-center gap-2 flex-grow-1">
                                    <i class="fas fa-info-circle text-muted small" />
                                    <span class="text-muted small">{{ currentSource.description }}</span>
                                </div>
                                <button v-if="currentSource.can_sync"
                                    class="btn btn-sm btn-outline-purple rounded-pill px-3" :disabled="syncLoading"
                                    @click="syncMarketRates">
                                    <i v-if="syncLoading" class="fas fa-spinner fa-spin me-1" />
                                    <i v-else class="fas fa-sync me-1" />
                                    {{ syncLoading ? $t('currencies.syncing') : $t('currencies.syncNow') }}
                                </button>
                            </div>

                            <!-- نتيجة آخر مزامنة -->
                            <div v-if="lastSync" class="sync-result-bar mt-2">
                                <i class="fas fa-check-circle text-success me-2" />
                                <span class="small text-muted">
                                    {{ $t('currencies.lastSync', {
                                        count: lastSync.updated_count,
                                        base: lastSync.base_currency
                                    }) }}
                                    — {{ formatSyncDate(lastSync.synced_at) }}
                                </span>
                            </div>

                        </div>
                    </div>

                    <!-- ════ بطاقة العملة الأساسية ════ -->
                    <div v-if="baseCurrency" class="base-currency-banner mb-4">
                        <div class="d-flex align-items-center gap-3">
                            <div class="base-symbol">{{ baseCurrency.symbol || baseCurrency.code }}</div>
                            <div class="flex-grow-1">
                                <div class="text-muted small fw-semibold">{{ $t('currencies.baseCurrency') }}</div>
                                <div class="fw-bold fs-5">{{ baseCurrency.code }} — {{ baseCurrency.name }}</div>
                                <div class="text-muted small">{{ $t('currencies.baseHint') }}</div>
                            </div>
                            <div class="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                <i class="fas fa-star me-1" />{{ $t('currencies.base') }}
                            </div>
                        </div>
                    </div>

                    <!-- ════ Loading ════ -->
                    <div v-if="currenciesLoading" class="text-center py-5">
                        <div class="spinner-border text-primary" />
                        <div class="text-muted small mt-2">{{ $t('common.loading') }}</div>
                    </div>

                    <!-- ════ قائمة العملات ════ -->
                    <div v-else class="row g-3">
                        <div v-for="currency in currencies" :key="currency.ulid" class="col-md-6 col-lg-4">
                            <div class="currency-card" :class="{ 'currency-card-base': currency.is_base_currency }">

                                <!-- Header -->
                                <div class="d-flex align-items-start justify-content-between mb-3">
                                    <div class="currency-symbol-box">{{ currency.symbol || currency.code }}</div>
                                    <div class="d-flex gap-1 flex-wrap justify-content-end">
                                        <span v-if="currency.is_base_currency" class="badge-chip chip-base">
                                            <i class="fas fa-star me-1" style="font-size:9px" />
                                            {{ $t('currencies.base') }}
                                        </span>
                                        <!-- badge مصدر السعر -->
                                        <span v-if="!currency.is_base_currency" class="badge-chip"
                                            :class="sourceChipClass(currency.rate_source)">
                                            <i :class="sourceIcon(currency.rate_source)" style="font-size:9px"
                                                class="me-1" />
                                            {{ $t(`currencies.source.${currency.rate_source}Short`) }}
                                        </span>
                                        <!-- badge سعر مخصص (manual/market override) -->
                                        <span v-if="currency.has_override && currency.rate_source !== 'system'"
                                            class="badge-chip chip-override">
                                            <i class="fas fa-edit me-1" style="font-size:9px" />
                                            {{ $t('currencies.customRate') }}
                                        </span>
                                    </div>
                                </div>

                                <div class="currency-code-text">{{ currency.code }}</div>
                                <div class="text-muted small mb-3">{{ currency.name }}</div>

                                <!-- ── Rate Section ── -->
                                <div class="rate-section" v-if="!currency.is_base_currency">

                                    <!-- system: قراءة فقط -->
                                    <div v-if="currentSource?.source === 'system'"
                                        class="d-flex align-items-center justify-content-between">
                                        <div>
                                            <div class="rate-label">{{ $t('currencies.systemRate') }}</div>
                                            <div class="rate-value font-monospace">
                                                1 {{ baseCurrency?.code || '—' }} =
                                                <strong>{{ fmtRate(currency.exchange_rate) }}</strong>
                                                {{ currency.code }}
                                            </div>
                                        </div>
                                        <span class="badge bg-success bg-opacity-10 text-success small">
                                            <i class="fas fa-lock me-1" style="font-size:10px" />
                                            {{ $t('currencies.adminManaged') }}
                                        </span>
                                    </div>

                                    <!-- market: عرض فقط (auto-sync) -->
                                    <div v-else-if="currentSource?.source === 'market'"
                                        class="d-flex align-items-center justify-content-between">
                                        <div>
                                            <div class="rate-label">{{ $t('currencies.marketRate') }}</div>
                                            <div class="rate-value font-monospace">
                                                1 {{ baseCurrency?.code || '—' }} =
                                                <strong>{{
                                                    fmtRate(currency.effective_rate ?? currency.exchange_rate)
                                                    }}</strong>
                                                {{ currency.code }}
                                            </div>
                                            <div v-if="!currency.has_override" class="text-muted"
                                                style="font-size:.7rem">
                                                {{ $t('currencies.noMarketRateYet') }}
                                            </div>
                                        </div>
                                        <span class="badge-chip chip-market">
                                            <i class="fas fa-chart-line me-1" style="font-size:9px" />
                                            {{ $t('currencies.autoSync') }}
                                        </span>
                                    </div>

                                    <!-- manual: تعديل كامل -->
                                    <template v-else>
                                        <!-- عرض السعر -->
                                        <div v-if="editingCurrencyUlid !== currency.ulid"
                                            class="d-flex align-items-center justify-content-between">
                                            <div>
                                                <div class="rate-label">{{ $t('currencies.effectiveRate') }}</div>
                                                <div class="rate-value font-monospace">
                                                    1 {{ baseCurrency?.code || '—' }} =
                                                    <strong>{{
                                                        fmtRate(currency.effective_rate ?? currency.exchange_rate)
                                                        }}</strong>
                                                    {{ currency.code }}
                                                </div>
                                                <div v-if="currency.has_override" class="text-muted"
                                                    style="font-size:.7rem">
                                                    {{ $t('currencies.globalRate') }}: {{
                                                        fmtRate(currency.exchange_rate) }}
                                                </div>
                                            </div>
                                            <div class="d-flex flex-column gap-1">
                                                <button class="rate-action-btn btn-edit"
                                                    @click="startEditRate(currency)">
                                                    <i class="fas fa-edit" />
                                                </button>
                                                <button v-if="currency.has_override" class="rate-action-btn btn-reset"
                                                    @click="resetRate(currency)" :title="$t('currencies.resetRate')">
                                                    <i class="fas fa-undo" />
                                                </button>
                                            </div>
                                        </div>

                                        <!-- تعديل السعر -->
                                        <div v-else>
                                            <div class="rate-label mb-1">{{ $t('currencies.newRate') }}</div>
                                            <div class="d-flex gap-2">
                                                <input v-model.number="editRateValue" type="number"
                                                    class="form-control form-control-sm font-monospace" step="0.0001"
                                                    min="0.000001" dir="ltr" @keydown.enter="saveRate(currency)"
                                                    @keydown.escape="cancelEditRate" ref="rateInputRef" />
                                                <button class="btn btn-sm btn-success rounded-2 px-3"
                                                    @click="saveRate(currency)" :disabled="rateSaving">
                                                    <i v-if="rateSaving" class="fas fa-spinner fa-spin" />
                                                    <i v-else class="fas fa-check" />
                                                </button>
                                                <button class="btn btn-sm btn-light rounded-2 px-3"
                                                    @click="cancelEditRate">
                                                    <i class="fas fa-times" />
                                                </button>
                                            </div>
                                            <div class="text-muted mt-1" style="font-size:.7rem">
                                                {{ $t('currencies.rateHint', { base: baseCurrency?.code }) }}
                                            </div>
                                        </div>
                                    </template>

                                </div>

                                <!-- العملة الأساسية -->
                                <div v-else class="rate-section">
                                    <div class="rate-label">{{ $t('currencies.rate') }}</div>
                                    <span class="badge bg-success bg-opacity-10 text-success">1.000000</span>
                                </div>

                            </div>
                        </div>

                        <!-- Empty -->
                        <div v-if="!currencies.length && !currenciesLoading" class="col-12 text-center py-5 text-muted">
                            <i class="fas fa-coins fa-2x mb-3 d-block" />
                            {{ $t('currencies.empty') }}
                        </div>
                    </div>

                </div>

                <!-- ── Notifications ── -->
                <div v-if="activeTab === 'notifications'" key="notifications">
                    <div class="st-card">
                        <div class="st-card-head">
                            <div class="st-section-icon notif"><i class="fas fa-bell" /></div>
                            <div>
                                <h6 class="fw-bold mb-0">{{ $t('settings.notifications.title') }}</h6>
                                <small class="text-muted">{{ $t('settings.notifications.sub') }}</small>
                            </div>
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

                    <div class="st-card">
                        <div class="st-card-head">
                            <div class="st-section-icon warning"><i class="fas fa-sign-out-alt" /></div>
                            <div>
                                <h6 class="fw-bold mb-0">{{ $t('settings.danger.sessions') }}</h6>
                                <small class="text-muted">{{ $t('settings.danger.sessionsSub') }}</small>
                            </div>
                        </div>
                        <div class="st-card-body">
                            <div class="danger-row">
                                <p class="text-muted small mb-0">{{ $t('settings.danger.sessionsDesc') }}</p>
                                <MDBBtn outline="warning" class="danger-btn text-dark" :disabled="sessionLoading"
                                    @click="logoutAllDevices">
                                    <span v-if="sessionLoading"><i class="fas fa-spinner fa-spin me-2" /></span>
                                    <span v-else><i class="fas fa-sign-out-alt me-2" /></span>
                                    {{ $t('settings.danger.logoutAll') }}
                                </MDBBtn>
                            </div>
                        </div>
                    </div>

                    <div class="st-card danger-card">
                        <div class="st-card-head danger-head">
                            <div class="st-section-icon danger"><i class="fas fa-user-slash" /></div>
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

                    <div class="st-card danger-card">
                        <div class="st-card-head danger-head">
                            <div class="st-section-icon delete"><i class="fas fa-trash-alt" /></div>
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
                        {{ confirmAction === 'delete'
                            ? $t('settings.danger.confirmDeleteTitle')
                            : $t('settings.danger.confirmDeactivateTitle') }}
                    </h5>
                    <p class="text-muted small mb-4">
                        {{ confirmAction === 'delete'
                            ? $t('settings.danger.confirmDeleteText')
                            : $t('settings.danger.confirmDeactivateText') }}
                    </p>
                    <div v-if="confirmAction === 'delete'" class="mb-4">
                        <label class="form-label small fw-semibold text-danger">
                            {{ $t('settings.danger.typeToConfirm') }}: <strong>DELETE</strong>
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
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBBtn, MDBRow, MDBCol } from 'mdb-vue-ui-kit'
import { useLangStore } from '@/stores/langStore'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/authService'
import { companyService } from '@/services/companyService'
import { currencyService } from '@/services/currencyService'
import type { Currency, RateSource, RateSourceInfo, SyncResult } from '@/services/currencyService'

const { t, locale } = useI18n()
const langStore = useLangStore()
const authStore = useAuthStore()

// ════ Toast ══════════════════════════════════════════════════════
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
let toastTimer: ReturnType<typeof setTimeout>

function showToast(msg: string, type: 'success' | 'error' = 'success') {
    clearTimeout(toastTimer)
    toast.show = false
    setTimeout(() => {
        toast.message = msg
        toast.type = type
        toast.show = true
        toastTimer = setTimeout(() => { toast.show = false }, 4000)
    }, 60)
}

// ════ Tabs ════════════════════════════════════════════════════════
type Tab = 'general' | 'currencies' | 'notifications' | 'danger'
const activeTab = ref<Tab>('general')

const tabs = computed(() => [
    { key: 'general' as Tab, label: t('settings.tabs.general'), icon: 'fas fa-sliders-h' },
    { key: 'currencies' as Tab, label: t('settings.tabs.currencies'), icon: 'fas fa-coins' },
    { key: 'notifications' as Tab, label: t('settings.tabs.notifications'), icon: 'fas fa-bell' },
    { key: 'danger' as Tab, label: t('settings.tabs.danger'), icon: 'fas fa-exclamation-triangle' },
])

// ════ Language ════════════════════════════════════════════════════
function switchLang(lang: 'ar' | 'en') {
    langStore.switchLang(lang)
    locale.value = lang
    showToast(t('settings.language.changed'))
}

// ════ General Settings ════════════════════════════════════════════
const settingsForm = reactive({
    timezone: authStore.user?.company?.timezone ?? 'Asia/Jerusalem',
    date_format: authStore.user?.company?.date_format ?? 'Y-m-d',
})
const settingsSaving = ref(false)

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
    return settingsForm.date_format
        .replace('Y', String(now.getFullYear()))
        .replace('m', pad(now.getMonth() + 1))
        .replace('d', pad(now.getDate()))
})

async function saveSettings() {
    const ulid = authStore.user?.company?.ulid
    if (!ulid) { showToast(t('settings.errors.noCompany'), 'error'); return }

    settingsSaving.value = true
    try {
        const res = await companyService.update(ulid, {
            timezone: settingsForm.timezone,
            date_format: settingsForm.date_format,
        })
        if (authStore.user?.company) {
            authStore.user.company.timezone = res.data.timezone as string
            authStore.user.company.date_format = res.data.date_format as string
        }
        showToast(t('settings.datetime.saved'))
    } catch (err: any) {
        showToast(err?.response?.data?.message ?? t('common.error'), 'error')
    } finally {
        settingsSaving.value = false
    }
}

// ════ Currencies Tab ══════════════════════════════════════════════

// ── Data ──────────────────────────────────────────────────────────
const currencies = ref<Currency[]>([])
const baseCurrency = ref<Currency | null>(null)
const currenciesLoading = ref(false)

// ── Source Management ─────────────────────────────────────────────
const currentSource = ref<RateSourceInfo | null>(null)
const sourceLoading = ref(false)
const sourceSaving = ref(false)
const syncLoading = ref(false)
const lastSync = ref<SyncResult | null>(null)

// ── Edit Rate ─────────────────────────────────────────────────────
const editingCurrencyUlid = ref<string | null>(null)
const editRateValue = ref(0)
const rateSaving = ref(false)
const rateInputRef = ref<HTMLInputElement | null>(null)

// ── تحميل عند فتح التبويب (مرة واحدة فقط) ───────────────────────
watch(activeTab, async (tab) => {
    if (tab === 'currencies' && !currencies.value.length) {
        await Promise.all([fetchSource(), fetchCurrencies()])
    }
})

// ── Fetchers ──────────────────────────────────────────────────────

async function fetchSource() {
    sourceLoading.value = true
    try {
        const res = await currencyService.getSource()
        currentSource.value = res.data
    } catch (e: any) {
        showToast(e?.response?.data?.message ?? t('common.error'), 'error')
    } finally {
        sourceLoading.value = false
    }
}

async function fetchCurrencies() {
    currenciesLoading.value = true
    try {
        const [listRes, baseRes] = await Promise.all([
            currencyService.list({ per_page: 50 }),
            currencyService.base(),
        ])
        currencies.value = listRes.data
        baseCurrency.value = baseRes.data
    } catch (e: any) {
        showToast(e?.response?.data?.message ?? t('common.error'), 'error')
    } finally {
        currenciesLoading.value = false
    }
}

// ── Source Actions ────────────────────────────────────────────────

async function changeSource(source: RateSource) {
    if (currentSource.value?.source === source) return
    sourceSaving.value = true
    try {
        const res = await currencyService.setSource(source)
        currentSource.value = res.data
        showToast(t('currencies.sourceChanged'))
        // إعادة تحميل العملات لتعكس المصدر الجديد
        await fetchCurrencies()
    } catch (e: any) {
        showToast(e?.response?.data?.message ?? t('common.error'), 'error')
    } finally {
        sourceSaving.value = false
    }
}

async function syncMarketRates() {
    syncLoading.value = true
    try {
        const res = await currencyService.syncMarket()
        lastSync.value = res.data
        showToast(t('currencies.syncSuccess', { count: res.data.updated_count }))
        await fetchCurrencies()
    } catch (e: any) {
        showToast(e?.response?.data?.message ?? t('common.error'), 'error')
    } finally {
        syncLoading.value = false
    }
}

// ── Rate Actions ──────────────────────────────────────────────────

function fmtRate(val: number | null | undefined): string {
    if (val === null || val === undefined) return '—'
    return (val || 0).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })
}

function startEditRate(currency: Currency) {
    editingCurrencyUlid.value = currency.ulid
    editRateValue.value = currency.effective_rate ?? currency.exchange_rate
    nextTick(() => rateInputRef.value?.focus())
}

function cancelEditRate() {
    editingCurrencyUlid.value = null
    editRateValue.value = 0
}

async function saveRate(currency: Currency) {
    if (!editRateValue.value || editRateValue.value <= 0) return
    rateSaving.value = true
    try {
        const res = await currencyService.setRate(currency.ulid, editRateValue.value)
        const item = currencies.value.find(c => c.ulid === currency.ulid)
        if (item) {
            item.company_rate = res.data.company_rate
            item.has_override = res.data.has_override
            item.effective_rate = res.data.effective_rate
        }
        showToast(t('currencies.rateSaved'))
        cancelEditRate()
    } catch (e: any) {
        showToast(e?.response?.data?.message ?? t('common.error'), 'error')
    } finally {
        rateSaving.value = false
    }
}

async function resetRate(currency: Currency) {
    try {
        const res = await currencyService.resetRate(currency.ulid)
        const item = currencies.value.find(c => c.ulid === currency.ulid)
        if (item) {
            item.company_rate = null
            item.has_override = false
            item.effective_rate = res.data.effective_rate
        }
        showToast(t('currencies.rateReset'))
    } catch (e: any) {
        showToast(e?.response?.data?.message ?? t('common.error'), 'error')
    }
}

// ── Source UI Helpers ─────────────────────────────────────────────

function sourceChipClass(source?: RateSource) {
    return {
        'chip-manual': source === 'manual',
        'chip-system': source === 'system',
        'chip-market': source === 'market',
    }
}

function sourceIcon(source?: RateSource): string {
    const icons: Record<string, string> = {
        manual: 'fas fa-pencil-alt',
        system: 'fas fa-server',
        market: 'fas fa-chart-line',
    }
    return icons[source ?? ''] ?? 'fas fa-circle'
}

function formatSyncDate(isoStr: string): string {
    return new Date(isoStr).toLocaleString(
        langStore.lang === 'ar' ? 'ar-PS' : 'en-US',
        { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    )
}

// ════ Notifications ═══════════════════════════════════════════════
const notifications = reactive([
    { key: 'email', label: t('settings.notifications.email'), desc: t('settings.notifications.emailDesc'), icon: 'fas fa-envelope', color: '#1d334f', enabled: true },
    { key: 'system', label: t('settings.notifications.system'), desc: t('settings.notifications.systemDesc'), icon: 'fas fa-bell', color: '#1d7342', enabled: true },
    { key: 'security', label: t('settings.notifications.security'), desc: t('settings.notifications.securityDesc'), icon: 'fas fa-shield-alt', color: '#e67e22', enabled: true },
    { key: 'reports', label: t('settings.notifications.reports'), desc: t('settings.notifications.reportsDesc'), icon: 'fas fa-chart-bar', color: '#8e44ad', enabled: false },
    { key: 'updates', label: t('settings.notifications.updates'), desc: t('settings.notifications.updatesDesc'), icon: 'fas fa-sync-alt', color: '#2980b9', enabled: false },
])

const allEnabled = computed(() => notifications.every(n => n.enabled))
function toggleAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked
    notifications.forEach(n => { n.enabled = checked })
}

// ════ Danger Zone ═════════════════════════════════════════════════
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
    box-shadow: 0 6px 24px rgba(0, 0, 0, .12);
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
    transition: opacity .3s, transform .3s;
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
    border: 1px solid rgba(0, 0, 0, .07);
    box-shadow: 0 2px 16px rgba(0, 0, 0, .06);
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
}

/* ══ Tab Bar ══ */
.st-tab-bar {
    display: flex;
    gap: .5rem;
    background: #fff;
    border-radius: 1rem;
    padding: .5rem;
    border: 1px solid rgba(0, 0, 0, .07);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .04);
    flex-wrap: wrap;
}

.st-tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    padding: .65rem 1.25rem;
    border-radius: .75rem;
    border: none;
    background: transparent;
    color: #6c757d;
    font-weight: 600;
    font-size: .9rem;
    cursor: pointer;
    transition: all .25s;
}

.st-tab-btn:hover {
    background: #f0f2f5;
    color: #1d334f;
}

.st-tab-btn.active {
    background: linear-gradient(135deg, #1d334f, #1d7342);
    color: #fff;
    box-shadow: 0 4px 14px rgba(29, 51, 79, .25);
}

.st-tab-btn.danger {
    background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
}

/* ══ Card ══ */
.st-card {
    background: #fff;
    border-radius: 1.25rem;
    border: 1px solid rgba(0, 0, 0, .07);
    box-shadow: 0 2px 16px rgba(0, 0, 0, .06);
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

/* ══ Section Icons ══ */
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

.st-section-icon.source-icon {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
}

/* ══ Language ══ */
.lang-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.lang-card {
    display: flex;
    align-items: center;
    gap: .85rem;
    padding: 1rem 1.25rem;
    border: 2px solid #eef0f3;
    border-radius: 12px;
    background: #f8fafb;
    cursor: pointer;
    transition: all .22s;
    text-align: start;
}

.lang-card:hover {
    border-color: #1d334f;
    background: #f0f4f8;
}

.lang-card.selected {
    border-color: #1d7342;
    background: #e8f5ee;
    box-shadow: 0 0 0 3px rgba(29, 115, 66, .1);
}

.lang-flag {
    font-size: 2rem;
    line-height: 1;
}

.lang-card-info {
    flex-grow: 1;
}

.lang-check-empty {
    width: 18px;
    height: 18px;
    border: 2px solid #dee2e6;
    border-radius: 50%;
}

/* ══ Datetime ══ */
.datetime-preview {
    display: inline-flex;
    align-items: center;
    background: #f0f7ff;
    border: 1px solid #bee3f8;
    border-radius: 8px;
    padding: .6rem 1rem;
    color: #1d334f;
}

.form-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid #eef0f3;
}

[dir="rtl"] .form-footer {
    justify-content: flex-start;
}

.action-btn {
    min-width: 160px;
    height: 46px;
    font-weight: 600;
    border-radius: 10px !important;
}

:deep(.btn-primary) {
    background: #1d334f !important;
    border-color: #1d334f !important;
}

/* ══ Source Selection (جديد) ══ */
.source-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.source-option-card {
    display: flex;
    align-items: center;
    gap: .85rem;
    padding: .85rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: #f8fafb;
    cursor: pointer;
    text-align: start;
    transition: all .2s;
}

.source-option-card:hover:not(:disabled) {
    border-color: #94a3b8;
    background: #f1f5f9;
}

.source-option-card.selected {
    background: #fff;
    border-color: #a5b4fc;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, .1);
}

.source-option-card:disabled {
    opacity: .65;
    cursor: not-allowed;
}

.source-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .95rem;
    color: #fff;
    flex-shrink: 0;
}

.source-icon-wrap.manual {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.source-icon-wrap.system {
    background: linear-gradient(135deg, #059669, #047857);
}

.source-icon-wrap.market {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
}

.source-card-body {
    flex: 1;
}

.source-check {
    flex-shrink: 0;
}

.source-check-empty {
    width: 18px;
    height: 18px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
}

.source-info-bar {
    display: flex;
    align-items: center;
    gap: .75rem;
    padding: .6rem .85rem;
    background: #f8fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    flex-wrap: wrap;
}

.sync-result-bar {
    display: flex;
    align-items: center;
    padding: .4rem .85rem;
    background: #f0fdf4;
    border-radius: 8px;
    border: 1px solid #bbf7d0;
}

.source-card-skeleton {
    height: 72px;
    border-radius: 12px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

.text-purple {
    color: #7c3aed !important;
}

.btn-outline-purple {
    color: #7c3aed;
    border: 1px solid #7c3aed;
    background: transparent;
    transition: all .2s;
    cursor: pointer;
    font-size: .85rem;
    font-weight: 600;
}

.btn-outline-purple:hover:not(:disabled) {
    background: #7c3aed;
    color: #fff;
}

.btn-outline-purple:disabled {
    opacity: .65;
    cursor: not-allowed;
}

/* ══ Currencies ══ */
.base-currency-banner {
    background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
    border: 1.5px solid #a7f3d0;
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
}

.base-symbol {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: #d1fae5;
    color: #059669;
    font-size: 1.3rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.currency-card {
    background: #fff;
    border-radius: 14px;
    padding: 1.25rem;
    border: 1.5px solid #e5e7eb;
    transition: all .2s;
    height: 100%;
}

.currency-card:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 16px rgba(0, 0, 0, .07);
}

.currency-card-base {
    border-color: #a7f3d0;
    background: #fafffe;
}

.currency-symbol-box {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    color: #374151;
    flex-shrink: 0;
}

.currency-code-text {
    font-size: .95rem;
    font-weight: 700;
    color: #1f2937;
}

.badge-chip {
    font-size: .67rem;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
}

.chip-base {
    background: #fef3c7;
    color: #92400e;
}

.chip-override {
    background: #dbeafe;
    color: #1e40af;
}

.chip-manual {
    background: #dbeafe;
    color: #1e40af;
}

.chip-system {
    background: #d1fae5;
    color: #065f46;
}

.chip-market {
    background: #ede9fe;
    color: #5b21b6;
}

.rate-section {
    border-top: 1px solid #f0f2f5;
    padding-top: .85rem;
    margin-top: .5rem;
}

.rate-label {
    font-size: .7rem;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    margin-bottom: 3px;
}

.rate-value {
    font-size: .85rem;
    color: #374151;
}

.rate-action-btn {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    border: 1px solid #e5e7eb;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: .75rem;
    transition: all .15s;
    color: #6b7280;
}

.btn-edit:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #2563eb;
}

.btn-reset:hover {
    background: #fff7ed;
    border-color: #fed7aa;
    color: #ea580c;
}

/* ══ Notifications ══ */
.notif-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.75rem;
    gap: 1rem;
    transition: background .15s;
}

.notif-row:hover {
    background: #fafbfc;
}

.notif-left {
    display: flex;
    align-items: center;
    gap: .85rem;
    flex-grow: 1;
}

.notif-icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .95rem;
    flex-shrink: 0;
}

.form-check-input[type="checkbox"] {
    width: 2.5em;
    height: 1.35em;
    cursor: pointer;
}

.form-check-input:checked {
    background-color: #1d7342 !important;
    border-color: #1d7342 !important;
}

/* ══ Danger ══ */
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

/* ══ Confirm Modal ══ */
.confirm-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .52);
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
    box-shadow: 0 24px 64px rgba(0, 0, 0, .22);
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

/* ══ RTL fixes ══ */
[dir="rtl"] .input-group>.input-group-text:first-child {
    border-radius: 0 .5rem .5rem 0;
}

[dir="rtl"] .input-group>.form-select {
    border-radius: 0;
}

/* ══ Transitions ══ */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity .22s ease, transform .22s ease;
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
    transition: opacity .3s;
}

.modal-pop-enter-from,
.modal-pop-leave-to {
    opacity: 0;
}
</style>