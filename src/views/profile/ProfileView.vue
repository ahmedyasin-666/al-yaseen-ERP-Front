<template>
    <section class="container-fluid p-4 p-lg-5" :dir="langStore.dir">

        <!-- ════ Toast ════ -->
        <Transition name="toast-pop">
            <div v-if="toast.show" class="pf-toast" :class="toast.type">
                <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"
                    class="me-2"></i>
                {{ toast.message }}
            </div>
        </Transition>

        <!-- ════ Hero Card ════ -->
        <div class="pf-hero mb-4">
            <div class="hero-strip" />
            <div class="hero-body d-flex flex-column flex-md-row align-items-center gap-4">

                <!-- Avatar -->
                <div class="avatar-zone" @click="triggerAvatarUpload">
                    <img :src="avatarPreview ?? authStore.user?.avatar" alt="avatar" class="avatar-img" />
                    <div class="avatar-overlay"><i class="fas fa-camera" /></div>
                    <div v-if="avatarUploading" class="avatar-loading">
                        <i class="fas fa-spinner fa-spin" />
                    </div>
                    <input ref="avatarInputRef" type="file" accept="image/*" class="d-none" @change="onAvatarChange" />
                </div>

                <!-- Info -->
                <div class="flex-grow-1 hero-info">
                    <div class="d-flex align-items-center flex-wrap gap-2 mb-1">
                        <h4 class="fw-bold mb-0">{{ authStore.user?.full_name }}</h4>
                        <span class="role-badge">
                            <i class="fas fa-crown me-1" style="font-size:10px"></i>Owner
                        </span>
                    </div>
                    <p class="text-muted small mb-1">
                        <i class="fas fa-envelope me-2 text-primary"></i>{{ authStore.user?.email }}
                    </p>
                    <p class="text-muted small mb-2">
                        <i class="fas fa-building me-2 text-success"></i>{{ authStore.user?.company?.title ?? '—' }}
                    </p>
                    <span class="status-badge">
                        <i class="fas fa-circle me-1" style="font-size: 7px" />
                        {{ $t('profile.active') }}
                    </span>
                </div>

                <!-- Stats -->
                <div class="d-flex gap-3 hero-stats">
                    <div class="hero-stat">
                        <i class="fas fa-clock text-primary" />
                        <div class="hero-stat-label">{{ $t('profile.lastLogin') }}</div>
                        <div class="hero-stat-val">{{ formatDate(authStore.user?.last_login_at) }}</div>
                    </div>
                    <div class="hero-stat">
                        <i class="fas fa-shield-alt text-success" />
                        <div class="hero-stat-label">{{ $t('profile.accountType') }}</div>
                        <div class="hero-stat-val text-success">{{ $t('profile.owner') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ════ Tab Bar ════ -->
        <div class="pf-tab-bar mb-4">
            <button v-for="tab in tabs" :key="tab.key" class="pf-tab-btn" :class="{ active: activeTab === tab.key }"
                @click="activeTab = tab.key">
                <i :class="tab.icon" />
                <span>{{ tab.label }}</span>
            </button>
        </div>

        <!-- ════ Content ════ -->
        <Transition name="fade-slide" mode="out-in">
            <div :key="activeTab">
                <!-- ── Personal Info ── -->
                <div v-if="activeTab === 'personal'" key="personal" class="pf-card">
                    <div class="pf-card-head">
                        <div class="pf-card-title">
                            <div class="card-icon-badge">
                                <i class="fas fa-user" />
                            </div>
                            <div>
                                <h5 class="fw-bold mb-0">{{ $t('profile.personalInfo') }}</h5>
                                <small class="text-muted">{{ $t('profile.personalInfoSub') }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="pf-card-body">
                        <MDBRow class="g-4">
                            <MDBCol md="6">
                                <label class="form-label fw-semibold">
                                    {{ $t('profile.firstName') }}
                                    <span class="text-danger ms-1">*</span>
                                </label>
                                <div class="input-group input-group-lg">
                                    <span class="input-group-text"><i class="fas fa-user" /></span>
                                    <input v-model="personalForm.first_name" type="text" class="form-control"
                                        :class="{ 'is-invalid': personalErrors.first_name }"
                                        :placeholder="$t('profile.firstName')" />
                                    <div v-if="personalErrors.first_name" class="invalid-feedback">
                                        {{ personalErrors.first_name }}
                                    </div>
                                </div>
                            </MDBCol>

                            <MDBCol md="6">
                                <label class="form-label fw-semibold">
                                    {{ $t('profile.lastName') }}
                                    <span class="text-danger ms-1">*</span>
                                </label>
                                <div class="input-group input-group-lg">
                                    <span class="input-group-text"><i class="fas fa-user" /></span>
                                    <input v-model="personalForm.last_name" type="text" class="form-control"
                                        :class="{ 'is-invalid': personalErrors.last_name }"
                                        :placeholder="$t('profile.lastName')" />
                                    <div v-if="personalErrors.last_name" class="invalid-feedback">
                                        {{ personalErrors.last_name }}
                                    </div>
                                </div>
                            </MDBCol>

                            <MDBCol md="6">
                                <label class="form-label fw-semibold">{{ $t('profile.email') }}</label>
                                <div class="input-group input-group-lg">
                                    <span class="input-group-text"><i class="fas fa-envelope" /></span>
                                    <input :value="authStore.user?.email" type="email" class="form-control bg-light"
                                        disabled dir="ltr" />
                                </div>
                                <div class="form-text text-muted small">{{ $t('profile.emailReadOnly') }}</div>
                            </MDBCol>

                            <MDBCol md="6">
                                <label class="form-label fw-semibold">{{ $t('profile.phone') }}</label>
                                <div class="input-group input-group-lg">
                                    <span class="input-group-text"><i class="fas fa-phone" /></span>
                                    <input v-model="personalForm.phone" type="tel" class="form-control"
                                        :class="{ 'is-invalid': personalErrors.phone }"
                                        :placeholder="$t('profile.phonePlaceholder')" dir="ltr" />
                                    <div v-if="personalErrors.phone" class="invalid-feedback">
                                        {{ personalErrors.phone }}
                                    </div>
                                </div>
                            </MDBCol>
                        </MDBRow>

                        <div class="form-footer">
                            <MDBBtn color="primary" class="action-btn" :disabled="personalSaving" @click="savePersonal">
                                <span v-if="personalSaving">
                                    <i class="fas fa-spinner fa-spin me-2" />{{ $t('profile.saving') }}
                                </span>
                                <span v-else>
                                    <i class="fas fa-save me-2" />{{ $t('profile.saveChanges') }}
                                </span>
                            </MDBBtn>
                        </div>
                    </div>
                </div>

                <!-- ── Company Info ── -->
                <div v-if="activeTab === 'company'" key="company" class="pf-card">
                    <div class="pf-card-head">
                        <div class="pf-card-title">
                            <div class="card-icon-badge company">
                                <i class="fas fa-building" />
                            </div>
                            <div>
                                <h5 class="fw-bold mb-0">{{ $t('profile.companyInfo') }}</h5>
                                <small class="text-muted">{{ $t('profile.companyInfoSub') }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="pf-card-body">

                        <!-- Loading -->
                        <div v-if="setupLoading" class="text-center py-5">
                            <div class="spinner-border text-success" style="width:2rem;height:2rem" role="status" />
                            <p class="text-muted mt-3 small">{{ $t('setup.loading') }}</p>
                        </div>

                        <template v-else>
                            <MDBRow class="g-4">

                                <!-- Logo -->
                                <MDBCol md="12">
                                    <label class="form-label fw-semibold">{{ $t('setup.fields.logo') }}</label>
                                    <div class="logo-upload-zone" :class="{ 'has-logo': companyLogoPreview }"
                                        @click="!companyLogoPreview && triggerCompanyLogo()" @dragover.prevent
                                        @drop.prevent="onCompanyLogoDrop">
                                        <template v-if="!companyLogoPreview">
                                            <div class="upload-placeholder">
                                                <i class="fas fa-cloud-upload-alt upload-icon" />
                                                <p class="mb-1 fw-semibold">{{ $t('setup.fields.logoUpload') }}</p>
                                                <p class="text-muted small mb-0">PNG, JPG, SVG, WEBP — max 2MB</p>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <img :src="companyLogoPreview" alt="logo" class="logo-preview-img" />
                                            <div class="logo-overlay">
                                                <button type="button" class="logo-overlay-btn"
                                                    @click.stop="triggerCompanyLogo()">
                                                    <i class="fas fa-pencil-alt" />
                                                </button>
                                                <button type="button" class="logo-overlay-btn delete"
                                                    @click.stop="removeCompanyLogo()">
                                                    <i class="fas fa-trash-alt" />
                                                </button>
                                            </div>
                                        </template>
                                    </div>
                                    <input ref="companyLogoRef" type="file"
                                        accept="image/png,image/jpeg,image/webp,image/svg+xml" class="d-none"
                                        @change="onCompanyLogoChange" />
                                </MDBCol>

                                <!-- Company Name -->
                                <MDBCol md="6">
                                    <label class="form-label fw-semibold">
                                        {{ $t('setup.fields.companyName') }}
                                        <span class="text-danger ms-1">*</span>
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-building" /></span>
                                        <input v-model="companyForm.title" type="text" class="form-control"
                                            :class="{ 'is-invalid': companyErrors.title }" />
                                        <div v-if="companyErrors.title" class="invalid-feedback">
                                            {{ companyErrors.title }}
                                        </div>
                                    </div>
                                </MDBCol>

                                <!-- Commercial Reg -->
                                <MDBCol md="6">
                                    <label class="form-label fw-semibold">
                                        {{ $t('setup.fields.commercialReg') }}
                                        <span class="text-danger ms-1">*</span>
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-hashtag" /></span>
                                        <input v-model="companyForm.commercial_registeration_number" type="text"
                                            class="form-control"
                                            :class="{ 'is-invalid': companyErrors.commercial_registeration_number }"
                                            dir="ltr" />
                                        <div v-if="companyErrors.commercial_registeration_number"
                                            class="invalid-feedback">
                                            {{ companyErrors.commercial_registeration_number }}
                                        </div>
                                    </div>
                                </MDBCol>

                                <!-- Email -->
                                <MDBCol md="6">
                                    <label class="form-label fw-semibold">
                                        {{ $t('setup.fields.companyEmail') }}
                                        <span class="text-danger ms-1">*</span>
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-envelope" /></span>
                                        <input v-model="companyForm.email" type="email" class="form-control"
                                            :class="{ 'is-invalid': companyErrors.email }" dir="ltr" />
                                        <div v-if="companyErrors.email" class="invalid-feedback">
                                            {{ companyErrors.email }}
                                        </div>
                                    </div>
                                </MDBCol>

                                <!-- Mobile -->
                                <MDBCol md="6">
                                    <label class="form-label fw-semibold">{{ $t('setup.fields.mobile') }}</label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-phone" /></span>
                                        <input v-model="companyForm.mobile" type="tel" class="form-control" dir="ltr" />
                                    </div>
                                </MDBCol>

                                <!-- Country -->
                                <MDBCol md="6">
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-globe" /></span>
                                        <MDBSelect v-model="companyForm.country_id" :options="countries"
                                            :placeholder="$t('setup.fields.country')" :dir="langStore.dir" filter
                                            @change="onCountryChange" height="44px" />
                                    </div>
                                    <div v-if="companyErrors.country_id" class="invalid-feedback d-block mt-1">
                                        {{ companyErrors.country_id }}
                                    </div>
                                </MDBCol>

                                <!-- Region -->
                                <MDBCol md="6">
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-map-marked-alt" /></span>
                                        <MDBSelect v-model="companyForm.region_id" :options="filteredRegions"
                                            :placeholder="$t('setup.fields.region')" :dir="langStore.dir"
                                            :disabled="!companyForm.country_id" height="44px" filter
                                            @change="onRegionChange" />
                                    </div>
                                </MDBCol>

                                <!-- City -->
                                <MDBCol md="6">
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-city" /></span>
                                        <MDBSelect v-model="companyForm.city_id" :options="filteredCities"
                                            :placeholder="$t('setup.fields.city')" :dir="langStore.dir"
                                            :disabled="!companyForm.region_id" height="44px" filter />
                                    </div>
                                </MDBCol>

                                <!-- Address -->
                                <MDBCol md="6">
                                    <label class="form-label fw-semibold">{{ $t('setup.fields.address') }}</label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-map-pin" /></span>
                                        <input v-model="companyForm.address" type="text" class="form-control" />
                                    </div>
                                </MDBCol>

                                <!-- Industry -->
                                <MDBCol md="6">
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-industry" /></span>
                                        <MDBSelect v-model="companyForm.industry_id" :options="industries"
                                            :placeholder="$t('setup.fields.industry')" height="44px"
                                            :dir="langStore.dir" filter @change="onIndustryChange" />
                                    </div>
                                    <div v-if="companyErrors.industry_id" class="invalid-feedback d-block mt-1">
                                        {{ companyErrors.industry_id }}
                                    </div>
                                </MDBCol>

                                <!-- Business Type -->
                                <MDBCol md="6">
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-briefcase" /></span>
                                        <MDBSelect v-model="companyForm.business_type_id"
                                            :options="filteredBusinessTypes"
                                            :placeholder="$t('setup.fields.businessType')" :dir="langStore.dir"
                                            :disabled="!companyForm.industry_id" height="44px" filter />
                                    </div>
                                </MDBCol>

                                <!-- Currency -->
                                <MDBCol md="6">
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-coins" /></span>
                                        <MDBSelect v-model="companyForm.default_currency_id" :options="currencies"
                                            :placeholder="$t('setup.fields.currency')" :dir="langStore.dir"
                                            height="44px" filter />
                                    </div>
                                </MDBCol>

                                <!-- Timezone -->
                                <MDBCol md="6">
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-clock" /></span>
                                        <MDBSelect v-model="companyForm.timezone" :options="timezones"
                                            :placeholder="$t('setup.fields.timezone')" :dir="langStore.dir"
                                            height="44px" />
                                    </div>
                                </MDBCol>

                                <!-- VAT -->
                                <MDBCol md="6">
                                    <label class="form-label fw-semibold">{{ $t('setup.fields.vatRate') }}</label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-file-invoice-dollar" /></span>
                                        <input v-model.number="companyForm.vat_rate" type="number" class="form-control"
                                            min="0" max="100" step="0.01" dir="ltr" />
                                        <span class="input-group-text"><i class="fas fa-percent" /></span>
                                    </div>
                                </MDBCol>

                                <!-- Income Tax -->
                                <MDBCol md="6">
                                    <label class="form-label fw-semibold">{{ $t('setup.fields.incomeTax') }}</label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-file-invoice-dollar" /></span>
                                        <input v-model.number="companyForm.income_tax_rate" type="number"
                                            class="form-control" min="0" max="100" step="0.01" dir="ltr" />
                                        <span class="input-group-text"><i class="fas fa-percent" /></span>
                                    </div>
                                </MDBCol>

                            </MDBRow>

                            <div class="form-footer">
                                <MDBBtn color="primary" class="action-btn" :disabled="companySaving"
                                    @click="saveCompany">
                                    <span v-if="companySaving">
                                        <i class="fas fa-spinner fa-spin me-2" />{{ $t('profile.saving') }}
                                    </span>
                                    <span v-else>
                                        <i class="fas fa-save me-2" />{{ $t('profile.saveChanges') }}
                                    </span>
                                </MDBBtn>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- ── Security ── -->
                <div v-if="activeTab === 'security'" key="security" class="pf-card">
                    <div class="pf-card-head">
                        <div class="pf-card-title">
                            <div class="card-icon-badge security">
                                <i class="fas fa-shield-alt" />
                            </div>
                            <div>
                                <h5 class="fw-bold mb-0">{{ $t('profile.security') }}</h5>
                                <small class="text-muted">{{ $t('profile.securitySub') }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="pf-card-body">
                        <MDBRow class="g-4">
                            <MDBCol md="7" lg="6">

                                <!-- Current Password -->
                                <div class="mb-4">
                                    <label class="form-label fw-semibold">
                                        {{ $t('profile.currentPassword') }}
                                        <span class="text-danger ms-1">*</span>
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-lock" /></span>
                                        <input v-model="passwordForm.current_password"
                                            :type="showPwd.current ? 'text' : 'password'" class="form-control"
                                            :class="{ 'is-invalid': passwordErrors.current_password }" dir="ltr" />
                                        <button type="button" class="input-group-text pwd-toggle"
                                            @click="showPwd.current = !showPwd.current">
                                            <i :class="showPwd.current ? 'fas fa-eye-slash' : 'fas fa-eye'" />
                                        </button>
                                        <div v-if="passwordErrors.current_password" class="invalid-feedback">
                                            {{ passwordErrors.current_password }}
                                        </div>
                                    </div>
                                </div>

                                <!-- New Password -->
                                <div class="mb-2">
                                    <label class="form-label fw-semibold">
                                        {{ $t('profile.newPassword') }}
                                        <span class="text-danger ms-1">*</span>
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-lock" /></span>
                                        <input v-model="passwordForm.password" :type="showPwd.new ? 'text' : 'password'"
                                            class="form-control" :class="{ 'is-invalid': passwordErrors.password }"
                                            dir="ltr" />
                                        <button type="button" class="input-group-text pwd-toggle"
                                            @click="showPwd.new = !showPwd.new">
                                            <i :class="showPwd.new ? 'fas fa-eye-slash' : 'fas fa-eye'" />
                                        </button>
                                        <div v-if="passwordErrors.password" class="invalid-feedback">
                                            {{ passwordErrors.password }}
                                        </div>
                                    </div>
                                    <!-- Strength Bar -->
                                    <div v-if="passwordForm.password" class="mt-2">
                                        <div class="pwd-bar">
                                            <div class="pwd-fill" :class="pwdStrength.cls"
                                                :style="{ width: pwdStrength.pct + '%' }" />
                                        </div>
                                        <small :class="pwdStrength.textCls">{{ pwdStrength.label }}</small>
                                    </div>
                                </div>

                                <!-- Confirm -->
                                <div class="mb-4">
                                    <label class="form-label fw-semibold">
                                        {{ $t('profile.confirmPassword') }}
                                        <span class="text-danger ms-1">*</span>
                                    </label>
                                    <div class="input-group input-group-lg">
                                        <span class="input-group-text"><i class="fas fa-lock" /></span>
                                        <input v-model="passwordForm.password_confirmation"
                                            :type="showPwd.confirm ? 'text' : 'password'" class="form-control"
                                            :class="{ 'is-invalid': passwordErrors.password_confirmation }" dir="ltr" />
                                        <button type="button" class="input-group-text pwd-toggle"
                                            @click="showPwd.confirm = !showPwd.confirm">
                                            <i :class="showPwd.confirm ? 'fas fa-eye-slash' : 'fas fa-eye'" />
                                        </button>
                                        <div v-if="passwordErrors.password_confirmation" class="invalid-feedback">
                                            {{ passwordErrors.password_confirmation }}
                                        </div>
                                    </div>
                                </div>

                                <MDBBtn color="warning" class="action-btn text-dark" :disabled="passwordSaving"
                                    @click="savePassword">
                                    <span v-if="passwordSaving">
                                        <i class="fas fa-spinner fa-spin me-2" />{{ $t('profile.saving') }}
                                    </span>
                                    <span v-else>
                                        <i class="fas fa-key me-2" />{{ $t('profile.changePassword') }}
                                    </span>
                                </MDBBtn>
                            </MDBCol>

                            <!-- Tips -->
                            <MDBCol md="5" lg="6">
                                <div class="security-tips-box">
                                    <h6 class="fw-bold mb-3">
                                        <i class="fas fa-lightbulb text-warning me-2" />{{ $t('profile.securityTips') }}
                                    </h6>
                                    <ul class="tips-list">
                                        <li v-for="tip in securityTips" :key="tip">
                                            <i class="fas fa-check-circle text-success me-2" />{{ tip }}
                                        </li>
                                    </ul>
                                </div>
                            </MDBCol>
                        </MDBRow>
                    </div>
                </div>
            </div>
        </Transition>
    </section>
</template>

<!-- ================================================================
  ProfileView.vue — الجزء المُصحَّح فقط (script setup)
  التغييرات:
  1. استخدام companyService.update() بدل profileService.updateCompany()
  2. الـ ulid يأتي من authStore.user.company.ulid (لا id)
  3. تحديث authStore.user.company بعد الحفظ
================================================================ -->
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBBtn, MDBRow, MDBCol } from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { useAuthStore } from '@/stores/authStore'
import { useLangStore } from '@/stores/langStore'
import { profileService } from '@/services/profileService'
import { companyService } from '@/services/companyService'       // ✅ مُضاف
import { geographyService } from '@/services/geographyService'
import type { SelectOption, RegionOption, CityOption, BusinessTypeOption } from '@/types/company'

const { t } = useI18n()
const authStore = useAuthStore()
const langStore = useLangStore()

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
type Tab = 'personal' | 'company' | 'security'
const activeTab = ref<Tab>('personal')

const tabs = computed(() => [
    { key: 'personal' as Tab, label: t('profile.tabs.personal'), icon: 'fas fa-user' },
    { key: 'company' as Tab, label: t('profile.tabs.company'), icon: 'fas fa-building' },
    { key: 'security' as Tab, label: t('profile.tabs.security'), icon: 'fas fa-shield-alt' },
])

function formatDate(d?: string | null) {
    if (!d) return '—'
    return new Intl.DateTimeFormat(langStore.lang === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(d))
}

// ════ Tab 1: Personal ═════════════════════
const avatarInputRef = ref<HTMLInputElement>()
const avatarPreview = ref<string | null>(null)
const avatarUploading = ref(false)

function triggerAvatarUpload() { avatarInputRef.value?.click() }

async function onAvatarChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    avatarUploading.value = true
    avatarPreview.value = URL.createObjectURL(file)
    try {
        const url = await profileService.updateAvatar(file)
        if (authStore.user) authStore.user.avatar = url
        showToast(t('profile.avatarUpdated'))
    } catch {
        avatarPreview.value = null
        showToast(t('profile.avatarError'), 'error')
    } finally {
        avatarUploading.value = false
    }
}

// ✅ استبدل التهيئة الثابتة
const personalForm = reactive({
    first_name: '',
    last_name: '',
    phone: '',
})

watch(
    () => authStore.user,
    (user) => {
        if (!user) return
        personalForm.first_name = user.first_name ?? ''
        personalForm.last_name = user.last_name ?? ''
        personalForm.phone = user.phone ?? ''
    },
    { immediate: true }
)


const personalErrors = reactive<Record<string, string>>({})
const personalSaving = ref(false)

async function savePersonal() {
    Object.keys(personalErrors).forEach(k => delete personalErrors[k])
    if (!personalForm.first_name.trim()) personalErrors.first_name = t('profile.validation.firstNameRequired')
    if (!personalForm.last_name.trim()) personalErrors.last_name = t('profile.validation.lastNameRequired')
    if (Object.keys(personalErrors).length) return

    personalSaving.value = true
    try {
        const updated = await profileService.updateProfile(personalForm)
        if (authStore.user) Object.assign(authStore.user, {
            first_name: updated.first_name,
            last_name: updated.last_name,
            full_name: updated.full_name,
            phone: updated.phone,
        })
        showToast(t('profile.personalSaved'))
    } catch (err: any) {
        const errs = err?.response?.data?.errors ?? {}
        Object.entries(errs).forEach(([k, v]) => { personalErrors[k] = (v as string[])[0] ?? '' })
        showToast(err?.response?.data?.message ?? t('profile.saveError'), 'error')
    } finally {
        personalSaving.value = false
    }
}

// ════ Tab 2: Company ══════════════════════
const setupLoading = ref(false)
const countries = ref<SelectOption[]>([])
const currencies = ref<SelectOption[]>([])
const industries = ref<SelectOption[]>([])
const allRegions = ref<RegionOption[]>([])
const allCities = ref<CityOption[]>([])
const allBusinessTypes = ref<BusinessTypeOption[]>([])

const filteredRegions = computed(() => allRegions.value.filter(r => r.countryUlid === companyForm.country_id))
const filteredCities = computed(() => allCities.value.filter(c => c.regionUlid === companyForm.region_id))
const filteredBusinessTypes = computed(() => allBusinessTypes.value.filter(b => b.industryUlid === companyForm.industry_id))

const timezones = computed<SelectOption[]>(() => [
    { value: 'Asia/Jerusalem', text: t('setup.timezones.jerusalem') },
    { value: 'Asia/Gaza', text: t('setup.timezones.gaza') },
    { value: 'Asia/Amman', text: t('setup.timezones.amman') },
    { value: 'Asia/Riyadh', text: t('setup.timezones.riyadh') },
    { value: 'Asia/Dubai', text: t('setup.timezones.dubai') },
    { value: 'Africa/Cairo', text: t('setup.timezones.cairo') },
    { value: 'UTC', text: 'UTC' },
])

watch(activeTab, async (tab) => {
    if (tab !== 'company' || countries.value.length > 0) return
    setupLoading.value = true
    try {
        const d = await geographyService.getSetupData(langStore.lang)
        countries.value = d.countries
        allRegions.value = d.allRegions
        allCities.value = d.allCities
        currencies.value = d.currencies
        industries.value = d.industries
        allBusinessTypes.value = d.allBusinessTypes
    } catch {
        showToast(t('setup.errors.loadFailed'), 'error')
    } finally {
        setupLoading.value = false
    }
})

// ✅ الجديد
const co = computed(() => authStore.user?.company)

const companyForm = reactive({
    title: '',
    commercial_registeration_number: '',
    email: '',
    mobile: '',
    landline: '',
    address: '',
    country_id: null as string | null,
    region_id: null as string | null,
    city_id: null as string | null,
    industry_id: null as string | null,
    business_type_id: null as string | null,
    default_currency_id: null as string | null,
    vat_rate: 0,
    income_tax_rate: 0,
    timezone: 'Asia/Jerusalem',
    date_format: 'Y-m-d',
    logo: null as File | null,
})

const companyLogoPreview = ref<string | null>(null)

// ✅ مزامنة الـ form مع authStore عند أي تغيير
watch(
    co,
    (company) => {
        if (!company) return
        companyForm.title = company.title ?? ''
        companyForm.commercial_registeration_number = company.commercial_registeration_number ?? ''
        companyForm.email = company.email ?? ''
        companyForm.mobile = company.mobile ?? ''
        companyForm.landline = company.landline ?? ''
        companyForm.address = company.address ?? ''
        companyForm.country_id = company.country?.ulid ?? null
        companyForm.region_id = company.region?.ulid ?? null
        companyForm.city_id = company.city?.ulid ?? null
        companyForm.industry_id = company.industry?.ulid ?? null
        companyForm.business_type_id = company.business_type?.ulid ?? null
        companyForm.default_currency_id = company.currency?.ulid ?? null
        companyForm.vat_rate = parseFloat(company.vat_rate ?? '0')
        companyForm.income_tax_rate = parseFloat(company.income_tax_rate ?? '0')
        companyForm.timezone = company.timezone ?? 'Asia/Jerusalem'
        companyForm.date_format = company.date_format ?? 'Y-m-d'
        companyLogoPreview.value = company.logo ?? null
    },
    { immediate: true }
)

const companyErrors = reactive<Record<string, string>>({})
const companySaving = ref(false)
const companyLogoRef = ref<HTMLInputElement>()

function triggerCompanyLogo() { companyLogoRef.value?.click() }

function onCompanyLogoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    companyForm.logo = file
    companyLogoPreview.value = URL.createObjectURL(file)
}

function onCompanyLogoDrop(e: DragEvent) {
    const file = e.dataTransfer?.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    companyForm.logo = file
    companyLogoPreview.value = URL.createObjectURL(file)
}

function removeCompanyLogo() {
    companyForm.logo = null
    companyLogoPreview.value = null
    if (companyLogoRef.value) companyLogoRef.value.value = ''
}

function onCountryChange() { companyForm.region_id = null; companyForm.city_id = null }
function onRegionChange() { companyForm.city_id = null }
function onIndustryChange() { companyForm.business_type_id = null }

/**
 * ✅ حفظ بيانات الشركة
 * 
 * يستدعي PUT /core/companies/{ulid}/update
 */

async function saveCompany() {
    Object.keys(companyErrors).forEach(k => delete companyErrors[k])
    if (!companyForm.title.trim()) companyErrors.title = t('setup.validation.companyNameRequired')
    if (!companyForm.email.trim()) companyErrors.email = t('setup.validation.emailRequired')
    if (Object.keys(companyErrors).length) return

    const companyUlid = co.value?.ulid
    if (!companyUlid) {
        showToast(t('common.error'), 'error')
        return
    }

    companySaving.value = true
    try {
        // ✅ companyService.update() يتعامل مع FormData و JSON تلقائياً
        const res = await companyService.update(companyUlid, companyForm)

        // ✅ تحديث authStore بالبيانات الجديدة من الباك اند
        if (authStore.user && res.company) {
            Object.assign(authStore.user.company!, res.company)
        }

        showToast(t('profile.companySaved'))
    } catch (err: any) {
        const errs = err?.response?.data?.errors ?? {}
        Object.entries(errs).forEach(([k, v]) => {
            companyErrors[k] = (v as string[])[0] ?? ''
        })
        showToast(err?.response?.data?.message ?? t('profile.saveError'), 'error')
    } finally {
        companySaving.value = false
    }
}


// ════ Tab 3: Security ═════════════════════
const passwordForm = reactive({ current_password: '', password: '', password_confirmation: '' })
const passwordErrors = reactive<Record<string, string>>({})
const passwordSaving = ref(false)
const showPwd = reactive({ current: false, new: false, confirm: false })

const pwdStrength = computed(() => {
    const p = passwordForm.password
    if (!p) return { pct: 0, cls: '', textCls: '', label: '' }
    let s = 0
    if (p.length >= 8) s++
    if (p.length >= 12) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    if (s <= 2) return { pct: 30, cls: 'str-weak', textCls: 'text-danger', label: t('profile.passwordWeak') }
    if (s <= 3) return { pct: 65, cls: 'str-medium', textCls: 'text-warning', label: t('profile.passwordMedium') }
    return { pct: 100, cls: 'str-strong', textCls: 'text-success', label: t('profile.passwordStrong') }
})

const securityTips = computed(() => [
    t('profile.tips.length'),
    t('profile.tips.uppercase'),
    t('profile.tips.numbers'),
    t('profile.tips.special'),
    t('profile.tips.unique'),
])

async function savePassword() {
    Object.keys(passwordErrors).forEach(k => delete passwordErrors[k])
    if (!passwordForm.current_password) passwordErrors.current_password = t('profile.validation.currentPasswordRequired')
    if (!passwordForm.password) passwordErrors.password = t('profile.validation.newPasswordRequired')
    else if (passwordForm.password.length < 8) passwordErrors.password = t('profile.validation.passwordTooShort')
    if (passwordForm.password !== passwordForm.password_confirmation)
        passwordErrors.password_confirmation = t('profile.validation.passwordMismatch')
    if (Object.keys(passwordErrors).length) return

    passwordSaving.value = true
    try {
        await profileService.updatePassword(passwordForm)
        passwordForm.current_password = ''
        passwordForm.password = ''
        passwordForm.password_confirmation = ''
        showToast(t('profile.passwordChanged'))
    } catch (err: any) {
        const errs = err?.response?.data?.errors ?? {}
        Object.entries(errs).forEach(([k, v]) => { passwordErrors[k] = (v as string[])[0] ?? '' })
        showToast(err?.response?.data?.message ?? t('profile.saveError'), 'error')
    } finally {
        passwordSaving.value = false
    }
}
</script>



<style scoped>
/* ══ Toast ══ */
.pf-toast {
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
    max-width: 380px;
}

.pf-toast.success {
    background: #e8f5ee;
    color: #1d7342;
    border: 1px solid #c3e6d0;
}

.pf-toast.error {
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

/* ══ Hero ══ */
.pf-hero {
    background: var(--color-background-primary, #fff);
    border-radius: 1.25rem;
    border: 1px solid rgba(0, 0, 0, 0.07);
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.hero-strip {
    height: 100px;
    background: #1d334f;
    position: relative;
}

.hero-strip::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 60%, rgba(29, 115, 66, .55));
}

.hero-body {
    padding: 0 2rem 1.75rem;
    position: relative;
}

.avatar-zone {
    position: relative;
    width: 108px;
    height: 108px;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
    border: 4px solid var(--color-background-primary, #fff);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.15);
    background: #eef0f3;
    margin-top: -54px;
    /* ← نص الارتفاع بالضبط */
    z-index: 1;
}

.avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.avatar-overlay {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.48);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.3rem;
    opacity: 0;
    transition: opacity 0.22s;
}

.avatar-zone:hover .avatar-overlay {
    opacity: 1;
}

.avatar-loading {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 1.3rem;
}

.hero-info {
    margin-top: 0.75rem;
}

.role-badge {
    background: linear-gradient(135deg, #1d334f, #1d7342);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.2rem 0.65rem;
    border-radius: 20px;
    letter-spacing: 0.3px;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    background: #e8f5ee;
    color: #1d7342;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    border: 1px solid #c3e6d0;
}

.hero-stats {
    margin-top: 0.5rem;
}

.hero-stat {
    background: #f8fafb;
    border: 1px solid #eef0f3;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    text-align: center;
    min-width: 135px;
}

.hero-stat i {
    font-size: 1.3rem;
    display: block;
    margin-bottom: 0.35rem;
}

.hero-stat-label {
    color: #8d9aab;
    font-size: 0.73rem;
    font-weight: 500;
    margin-bottom: 0.15rem;
}

.hero-stat-val {
    font-size: 0.82rem;
    font-weight: 600;
    color: #1a2a3a;
}

/* ══ Tab Bar ══ */
.pf-tab-bar {
    display: flex;
    gap: 0.5rem;
    background: #fff;
    border-radius: 1rem;
    padding: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.07);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    flex-wrap: wrap;
}

.pf-tab-btn {
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

.pf-tab-btn:hover {
    background: #f0f2f5;
    color: #1d334f;
}

.pf-tab-btn.active {
    background: linear-gradient(135deg, #1d334f, #1d7342);
    color: #fff;
    box-shadow: 0 4px 14px rgba(29, 51, 79, 0.25);
}

/* ══ Content Card ══ */
.pf-card {
    background: #fff;
    border-radius: 1.25rem;
    border: 1px solid rgba(0, 0, 0, 0.07);
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
    overflow: hidden;
}

.pf-card-head {
    display: flex;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #eef0f3;
    background: linear-gradient(135deg, #f8fafb 0%, #fff 100%);
}

.pf-card-title {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.card-icon-badge {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: linear-gradient(135deg, #1d334f, #1d7342);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(29, 51, 79, 0.22);
    flex-shrink: 0;
}

.card-icon-badge.company {
    background: linear-gradient(135deg, #1d7342, #28a060);
}

.card-icon-badge.security {
    background: linear-gradient(135deg, #e67e22, #e74c3c);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.25);
}

.pf-card-body {
    padding: 2rem;
}

/* ══ Form Footer ══ */
.form-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.75rem;
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
    transition: transform 0.15s, box-shadow 0.15s;
}

.action-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

:deep(.btn-primary) {
    background: #1d334f !important;
    border-color: #1d334f !important;
}

:deep(.btn-primary:hover) {
    background: #162840 !important;
}

/* ══ Logo Upload ══ */
.logo-upload-zone {
    border: 2px dashed #c8d0db;
    border-radius: 12px;
    background: #f8fafb;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
}

.logo-upload-zone:hover {
    border-color: #1d7342;
    background: #f0faf5;
}

.logo-upload-zone.has-logo {
    cursor: default;
    border-style: solid;
    border-color: #c3e6d0;
}

.upload-placeholder {
    text-align: center;
    padding: 1.25rem;
    color: #6c757d;
}

.upload-icon {
    font-size: 2rem;
    color: #adb5bd;
    display: block;
    margin-bottom: 0.5rem;
}

.logo-preview-img {
    max-height: 100px;
    max-width: 100%;
    object-fit: contain;
    padding: 0.5rem;
}

.logo-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    opacity: 0;
    transition: opacity 0.2s;
}

.logo-upload-zone:hover .logo-overlay {
    opacity: 1;
}

.logo-overlay-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid #fff;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.logo-overlay-btn:hover {
    background: rgba(255, 255, 255, 0.35);
}

.logo-overlay-btn.delete:hover {
    background: rgba(220, 53, 69, 0.65);
}

/* ══ Password ══ */
.pwd-bar {
    height: 5px;
    background: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 4px;
}

.pwd-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.4s, background 0.4s;
}

.str-weak {
    background: #dc3545;
}

.str-medium {
    background: #fd7e14;
}

.str-strong {
    background: #1d7342;
}

.pwd-toggle {
    background: #f8f9fa;
    border-color: #dee2e6 !important;
    color: #6c757d;
    cursor: pointer;
    transition: background 0.2s;
}

.pwd-toggle:hover {
    background: #e9ecef;
    color: #1d334f;
}

/* ══ Security Tips ══ */
.security-tips-box {
    background: #f8fafb;
    border: 1px solid #eef0f3;
    border-radius: 12px;
    padding: 1.5rem;
    height: 100%;
}

.tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.tips-list li {
    padding: 0.4rem 0;
    font-size: 0.87rem;
    color: #4a5568;
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

[dir="rtl"] .input-group>.form-control {
    border-radius: 0;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
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
</style>