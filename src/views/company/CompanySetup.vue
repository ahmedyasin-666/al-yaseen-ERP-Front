<template>
    <div class="setup-layout d-flex min-vh-100" :dir="langStore.dir">

        <!-- ══ Sidebar ══ -->
        <div class="setup-sidebar d-none d-lg-flex flex-column p-4">
            <div class="mb-5">
                <img src="@/assets/images/logo-brand.png" alt="Logo" width="200" />
            </div>
            <div class="steps-nav flex-grow-1">
                <div v-for="(step, index) in steps" :key="index" class="step-item d-flex align-items-center gap-3 mb-4"
                    :class="{ 'step-active': currentStep === index + 1, 'step-done': currentStep > index + 1 }">
                    <div class="step-circle">
                        <i v-if="currentStep > index + 1" class="fas fa-check" />
                        <span v-else>{{ index + 1 }}</span>
                    </div>
                    <div>
                        <div class="step-title">{{ step.title }}</div>
                        <div class="step-subtitle">{{ step.subtitle }}</div>
                    </div>
                </div>
            </div>
            <div class="sidebar-footer mt-auto">
                <p class="text-white-50 small mb-3">
                    {{ $t('setup.greeting', { name: authStore.user?.first_name }) }} 👋
                </p>
                <button class="sidebar-ctrl-btn mb-2" @click="toggleLang">
                    <i :class="[
                        'fas fa-language',
                        langStore.lang === 'en' ? 'me-2' : 'ms-2'
                    ]"></i>
                    {{ langStore.lang === 'ar' ? 'English' : 'عربي' }}
                </button>

                <button class="sidebar-ctrl-btn logout-btn" @click="handleLogout">
                    <i :class="[
                        'fas fa-sign-out-alt',
                        langStore.lang === 'en' ? 'me-2' : 'ms-2'
                    ]"></i>
                    {{ $t('setup.logout') }}
                </button>
            </div>
        </div>

        <!-- ══ Main Content ══ -->
        <div class="setup-content flex-grow-1 d-flex flex-column mt-5">

            <!-- شريط التقدم للموبايل -->
            <div class="progress-bar-mobile d-lg-none">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
            </div>

            <!-- شريط علوي للموبايل -->
            <div class="mobile-topbar d-flex d-lg-none align-items-center justify-content-between px-3 py-2">
                <img src="@/assets/images/logo-brand.png" alt="Logo" height="32" />
                <div class="d-flex gap-2">
                    <button class="mobile-ctrl-btn" @click="toggleLang">
                        <i class="fas fa-language"></i>
                    </button>
                    <button class="mobile-ctrl-btn" @click="handleLogout">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>

            <!-- ══ بطاقة الفورم ══ -->
            <div class="setup-form-wrapper flex-grow-1 d-flex align-items-start justify-content-center p-4">
                <div class="setup-card bg-white rounded-4 w-100">

                    <!-- رأس البطاقة -->
                    <div class="card-header-section">
                        <div class="d-flex align-items-center gap-3">
                            <div class="step-icon-badge">
                                <i :class="currentStepData.icon"></i>
                            </div>
                            <div>
                                <span class="step-counter-badge">
                                    {{ $t('setup.stepOf', { current: currentStep, total: steps.length }) }}
                                </span>
                                <h4 class="fw-bold mb-0 mt-1">{{ currentStepData.title }}</h4>
                                <p class="text-muted mb-0 small mt-1">{{ currentStepData.subtitle }}</p>
                            </div>
                        </div>
                        <div class="step-dots d-none d-md-flex gap-2 align-items-center">
                            <div v-for="n in steps.length" :key="n" class="step-dot"
                                :class="{ 'dot-active': currentStep === n, 'dot-done': currentStep > n }" />
                        </div>
                    </div>

                    <!-- جسم البطاقة -->
                    <div class="card-body-section">

                        <!-- Loading Overlay -->
                        <div v-if="initialLoading" class="loading-overlay">
                            <div class="d-flex flex-column align-items-center gap-3">
                                <div class="spinner-border text-success" role="status"
                                    style="width: 2.5rem; height: 2.5rem;">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                <span class="text-muted small">{{ $t('setup.loading') }}</span>
                            </div>
                        </div>

                        <!-- ════ الخطوة 1: المعلومات الأساسية ════ -->
                        <Transition name="fade-slide" mode="out-in">
                            <div v-if="currentStep === 1" key="step1">
                                <MDBRow class="g-4">

                                    <!-- اسم الشركة -->
                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.companyName') }}
                                            <span class="text-danger ms-1">*</span>
                                        </label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-building"></i>
                                            </span>
                                            <input v-model="form.title" type="text" class="form-control"
                                                :class="{ 'is-invalid': errors.title }"
                                                :placeholder="$t('setup.placeholders.companyName')" />
                                            <div v-if="errors.title" class="invalid-feedback">
                                                {{ errors.title }}
                                            </div>
                                        </div>
                                    </MDBCol>

                                    <!-- رقم السجل التجاري -->
                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.commercialReg') }}
                                            <span class="text-danger ms-1">*</span>
                                        </label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-hashtag"></i>
                                            </span>
                                            <input v-model="form.commercial_registeration_number" type="text"
                                                class="form-control"
                                                :class="{ 'is-invalid': errors.commercial_registeration_number }"
                                                :placeholder="$t('setup.placeholders.commercialReg')" dir="ltr" />
                                            <div v-if="errors.commercial_registeration_number" class="invalid-feedback">
                                                {{ errors.commercial_registeration_number }}
                                            </div>
                                        </div>
                                    </MDBCol>

                                    <!-- البريد الإلكتروني -->
                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.companyEmail') }}
                                            <span class="text-danger ms-1">*</span>
                                        </label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-envelope"></i>
                                            </span>
                                            <input v-model="form.email" type="email" class="form-control"
                                                :class="{ 'is-invalid': errors.email }"
                                                :placeholder="$t('setup.placeholders.companyEmail')" dir="ltr" />
                                            <div v-if="errors.email" class="invalid-feedback">
                                                {{ errors.email }}
                                            </div>
                                        </div>
                                    </MDBCol>

                                    <!-- رقم الجوال — مربوط مع phone_code -->
                                    <MDBCol md="6">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.mobile') }}
                                        </label>
                                        <div class="input-group input-group-lg">


                                            <span class="input-group-text input-group-lg">
                                                <i class="fas fa-phone"></i>
                                            </span>
                                            <!-- حقل رقم الجوال (بدون الكود) -->
                                            <input v-model="form.mobile_number" type="tel" class="form-control"
                                                :class="{ 'is-invalid': errors.mobile_number }"
                                                :placeholder="mobilePlaceholder" dir="ltr" inputmode="numeric"
                                                @input="sanitizeMobile" />
                                            <div class="input-group-text p-0">
                                                <PhoneCodeSelect v-model="form.phone_code" :options="countryCodes" />
                                            </div>
                                            <div v-if="errors.mobile_number" class="invalid-feedback">
                                                {{ errors.mobile_number }}
                                            </div>
                                        </div>
                                        <!-- عرض الرقم الكامل للتأكيد -->
                                        <div v-if="form.mobile_number" class="mt-1 d-flex align-items-center gap-1">
                                            <i class="fas fa-check-circle text-success" style="font-size:12px"></i>
                                            <small class="text-success fw-semibold" dir="ltr">
                                                {{ fullMobileNumber }}
                                            </small>
                                        </div>
                                    </MDBCol>

                                    <!-- الهاتف الأرضي -->
                                    <MDBCol md="6">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.landline') }}
                                        </label>
                                        <div class="input-group input-group-lg">

                                            <span v-if="langStore.lang === 'ar'" class="input-group-text">
                                                <i class="fas fa-phone-alt"></i>
                                            </span>

                                            <span v-if="langStore.lang === 'en'" class="input-group-text"
                                                dir="ltr">+20</span>

                                            <input v-model="form.landline" type="tel" class="form-control rounded-0"
                                                :class="{ 'is-invalid': errors.landline }" placeholder="022xxxxxx"
                                                dir="ltr" inputmode="numeric" />
                                            <span v-if="langStore.lang === 'ar'" class="input-group-text"
                                                dir="ltr">+970</span>
                                            <span v-if="langStore.lang === 'en'" class="input-group-text">
                                                <i class="fas fa-phone-alt"></i>
                                            </span>
                                            <div v-if="errors.landline" class="invalid-feedback">
                                                {{ errors.landline }}
                                            </div>
                                        </div>
                                    </MDBCol>

                                    <!-- ════ حقل الشعار ════ -->
                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.logo') }}
                                            <span class="text-muted small ms-1">({{ $t('setup.fields.logoHint')
                                                }})</span>
                                        </label>

                                        <!-- منطقة الرفع -->
                                        <div class="logo-upload-zone" :class="{ 'has-logo': logoPreview }"
                                            @click="!logoPreview && ($refs.logoInput as HTMLInputElement).click()"
                                            @dragover.prevent @drop.prevent="onLogoDrop">
                                            <!-- حالة: لا يوجد صورة -->
                                            <template v-if="!logoPreview">
                                                <div class="upload-placeholder">
                                                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                                    <p class="mb-1 fw-semibold">{{ $t('setup.fields.logoUpload') }}</p>
                                                    <p class="text-muted small mb-0">PNG, JPG, SVG — {{
                                                        $t('setup.fields.logoMaxSize') }}</p>
                                                </div>
                                            </template>

                                            <!-- حالة: يوجد صورة -->
                                            <template v-else>
                                                <img :src="logoPreview" alt="Logo Preview" class="logo-preview-img" />
                                                <div class="logo-overlay">
                                                    <button type="button" class="logo-overlay-btn"
                                                        @click.stop="($refs.logoInput as HTMLInputElement).click()">
                                                        <i class="fas fa-pencil-alt"></i>
                                                    </button>
                                                    <button type="button" class="logo-overlay-btn delete"
                                                        @click.stop="removeLogo">
                                                        <i class="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </template>
                                        </div>

                                        <!-- Input مخفي -->
                                        <input ref="logoInput" id="logo-input" type="file"
                                            accept="image/png,image/jpeg,image/svg+xml,image/webp" class="d-none"
                                            @change="onLogoChange" />

                                        <div v-if="errors.logo" class="invalid-feedback d-block mt-1">
                                            {{ errors.logo }}
                                        </div>
                                    </MDBCol>

                                </MDBRow>
                            </div>
                        </Transition>

                        <!-- ════ الخطوة 2: الموقع الجغرافي ════ -->
                        <Transition name="fade-slide" mode="out-in">
                            <div v-if="currentStep === 2" key="step2">
                                <MDBRow class="g-4">

                                    <MDBCol md="12">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-globe"></i>
                                            </span>
                                            <MDBSelect v-model="form.country_id" :options="countries"
                                                :label="$t('setup.fields.country')" :dir="langStore.dir"
                                                :placeholder="$t('setup.fields.selectCountry')"
                                                :disabled="initialLoading" filter :feedback="errors.country_id"
                                                @change="onCountryChange" />
                                        </div>
                                        <div v-if="errors.country_id" class="invalid-feedback d-block mt-1">
                                            {{ errors.country_id }}
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="6">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-map-marked-alt"></i>
                                            </span>
                                            <MDBSelect v-model="form.region_id" :options="filteredRegions"
                                                :label="$t('setup.fields.region')"
                                                :placeholder="$t('setup.fields.selectRegion')" :dir="langStore.dir"
                                                :disabled="!form.country_id || initialLoading" filter
                                                @change="onRegionChange" />
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="6">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-city"></i>
                                            </span>
                                            <MDBSelect v-model="form.city_id" :options="filteredCities"
                                                :label="$t('setup.fields.city')"
                                                :placeholder="$t('setup.fields.selectCity')" :dir="langStore.dir"
                                                :disabled="!form.region_id || initialLoading" filter />
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.address') }}
                                        </label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-map-pin"></i>
                                            </span>
                                            <input v-model="form.address" type="text" class="form-control"
                                                :class="{ 'is-invalid': errors.address }"
                                                :placeholder="$t('setup.placeholders.address')" />
                                            <div v-if="errors.address" class="invalid-feedback">
                                                {{ errors.address }}
                                            </div>
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="12">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-clock"></i>
                                            </span>
                                            <MDBSelect v-model="form.timezone" :options="timezones"
                                                :label="$t('setup.fields.timezone')"
                                                :placeholder="$t('setup.fields.selectTimezone')" :dir="langStore.dir"
                                                :disabled="initialLoading" />
                                        </div>
                                    </MDBCol>

                                </MDBRow>
                            </div>
                        </Transition>

                        <!-- ════ الخطوة 3: القطاع والعملة ════ -->
                        <Transition name="fade-slide" mode="out-in">
                            <div v-if="currentStep === 3" key="step3">
                                <MDBRow class="g-4">

                                    <MDBCol md="12">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-industry"></i>
                                            </span>
                                            <MDBSelect v-model="form.industry_id" :options="industries"
                                                :label="$t('setup.fields.industry')"
                                                :placeholder="$t('setup.fields.selectIndustry')" :dir="langStore.dir"
                                                :disabled="initialLoading" filter
                                                :valid-state="errors.industry_id ? 'invalid' : ''"
                                                :feedback="errors.industry_id" @change="onIndustryChange" />
                                        </div>
                                        <div v-if="errors.industry_id" class="invalid-feedback d-block mt-1">
                                            {{ errors.industry_id }}
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="12">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-briefcase"></i>
                                            </span>
                                            <MDBSelect v-model="form.business_type_id" :options="filteredBusinessTypes"
                                                :label="$t('setup.fields.businessType')"
                                                :placeholder="$t('setup.fields.selectBusinessType')"
                                                :dir="langStore.dir" :disabled="!form.industry_id || initialLoading"
                                                :valid-state="errors.business_type_id ? 'invalid' : ''"
                                                :feedback="errors.business_type_id" />
                                        </div>
                                        <div v-if="errors.business_type_id" class="invalid-feedback d-block mt-1">
                                            {{ errors.business_type_id }}
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="12">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-coins"></i>
                                            </span>
                                            <MDBSelect v-model="form.default_currency_id" :options="currencies"
                                                :label="$t('setup.fields.currency')"
                                                :placeholder="$t('setup.fields.selectCurrency')" :dir="langStore.dir"
                                                :disabled="initialLoading" filter
                                                :valid-state="errors.default_currency_id ? 'invalid' : ''"
                                                :feedback="errors.default_currency_id" />
                                        </div>
                                        <div v-if="errors.default_currency_id" class="invalid-feedback d-block mt-1">
                                            {{ errors.default_currency_id }}
                                        </div>
                                    </MDBCol>

                                </MDBRow>
                            </div>
                        </Transition>

                        <!-- ════ الخطوة 4: الإعدادات المالية ════ -->
                        <Transition name="fade-slide" mode="out-in">
                            <div v-if="currentStep === 4" key="step4">
                                <MDBRow class="g-4">

                                    <!-- ضريبة القيمة المضافة -->
                                    <MDBCol md="6">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.vatRate') }}
                                        </label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-file-invoice-dollar"></i>
                                            </span>
                                            <input v-model.number="form.vat_rate" type="number" class="form-control"
                                                :class="{ 'is-invalid': errors.vat_rate }" placeholder="0.00" min="0"
                                                max="100" step="0.01" dir="ltr" />
                                            <span class="input-group-text">
                                                <i class="fas fa-percent"></i>
                                            </span>
                                            <div v-if="errors.vat_rate" class="invalid-feedback">
                                                {{ errors.vat_rate }}
                                            </div>
                                        </div>
                                        <div class="form-text text-muted small mt-1">
                                            {{ $t('setup.hints.vatRate') }}
                                        </div>
                                    </MDBCol>

                                    <!-- ضريبة الدخل -->
                                    <MDBCol md="6">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.incomeTax') }}
                                        </label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-file-invoice-dollar"></i>
                                            </span>
                                            <input v-model.number="form.income_tax_rate" type="number"
                                                class="form-control" :class="{ 'is-invalid': errors.income_tax_rate }"
                                                placeholder="0.00" min="0" max="100" step="0.01" dir="ltr" />
                                            <span class="input-group-text">
                                                <i class="fas fa-percent"></i>
                                            </span>
                                            <div v-if="errors.income_tax_rate" class="invalid-feedback">
                                                {{ errors.income_tax_rate }}
                                            </div>
                                        </div>
                                        <div class="form-text text-muted small mt-1">
                                            {{ $t('setup.hints.incomeTax') }}
                                        </div>
                                    </MDBCol>

                                    <!-- صيغة التاريخ -->
                                    <MDBCol md="12">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text">
                                                <i class="fas fa-calendar-alt"></i>
                                            </span>
                                            <MDBSelect v-model="form.date_format" :options="dateFormats"
                                                :label="$t('setup.fields.dateFormat')"
                                                :placeholder="$t('setup.fields.selectDateFormat')" :dir="langStore.dir"
                                                :disabled="initialLoading"
                                                :valid-state="errors.date_format ? 'invalid' : ''"
                                                :feedback="errors.date_format" />
                                        </div>
                                    </MDBCol>

                                    <!-- ملخص -->
                                    <MDBCol md="12">
                                        <div class="summary-card rounded-3 p-4">
                                            <h6 class="fw-bold mb-3 d-flex align-items-center gap-2">
                                                <span class="summary-icon-wrap">
                                                    <i class="fas fa-clipboard-check text-success"></i>
                                                </span>
                                                {{ $t('setup.summary.title') }}
                                            </h6>
                                            <MDBRow class="g-3">
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label">
                                                            <i class="fas fa-building me-1"></i>
                                                            {{ $t('setup.summary.name') }}
                                                        </span>
                                                        <strong>{{ form.title || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label">
                                                            <i class="fas fa-envelope me-1"></i>
                                                            {{ $t('setup.summary.email') }}
                                                        </span>
                                                        <strong dir="ltr">{{ form.email || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label">
                                                            <i class="fas fa-hashtag me-1"></i>
                                                            {{ $t('setup.summary.reg') }}
                                                        </span>
                                                        <strong>{{ form.commercial_registeration_number || '—'
                                                        }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label">
                                                            <i class="fas fa-mobile-alt me-1"></i>
                                                            {{ $t('setup.summary.mobile') }}
                                                        </span>
                                                        <strong dir="ltr">{{ fullMobileNumber || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label">
                                                            <i class="fas fa-clock me-1"></i>
                                                            {{ $t('setup.summary.timezone') }}
                                                        </span>
                                                        <strong>{{ form.timezone || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label">
                                                            <i class="fas fa-globe me-1"></i>
                                                            {{ $t('setup.summary.country') }}
                                                        </span>
                                                        <strong>{{ selectedCountryName || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label">
                                                            <i class="fas fa-industry me-1"></i>
                                                            {{ $t('setup.summary.industry') }}
                                                        </span>
                                                        <strong>{{ selectedIndustryName || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label">
                                                            <i class="fas fa-coins me-1"></i>
                                                            {{ $t('setup.summary.currency') }}
                                                        </span>
                                                        <strong>{{ selectedCurrencyName || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                            </MDBRow>
                                        </div>
                                    </MDBCol>

                                </MDBRow>
                            </div>
                        </Transition>

                        <!-- خطأ عام -->
                        <div v-if="generalError" class="alert alert-danger mt-4 small d-flex align-items-center gap-2"
                            role="alert">
                            <i class="fas fa-exclamation-circle fs-5"></i>
                            <span>{{ generalError }}</span>
                        </div>

                        <!-- أزرار التنقل -->
                        <div class="nav-buttons-row d-flex justify-content-between align-items-center mt-5 pt-3">
                            <MDBBtn v-if="currentStep > 1" outline="secondary" class="px-4 nav-btn" @click="prevStep">
                                <i :class="langStore.dir === 'rtl' ? 'fas fa-arrow-right' : 'fas fa-arrow-left'"
                                    class="me-2"></i>
                                {{ $t('setup.prev') }}
                            </MDBBtn>
                            <div v-else />

                            <MDBBtn v-if="currentStep < steps.length" color="primary" class="px-5 nav-btn"
                                :disabled="initialLoading" @click="nextStep">
                                {{ $t('setup.next') }}
                                <i :class="langStore.dir === 'rtl' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'"
                                    class="ms-2"></i>
                            </MDBBtn>

                            <MDBBtn v-else color="success" class="px-5 nav-btn"
                                :disabled="isSubmitting || initialLoading" @click="submitSetup"
                                v-if="authStore.hasPermission('api.core.companies.store')">
                                <span v-if="isSubmitting">
                                    <i class="fas fa-spinner fa-spin me-2"></i>{{ $t('setup.creating') }}
                                </span>
                                <span v-else>
                                    <i class="fas fa-rocket me-2"></i>{{ $t('setup.submit') }}
                                </span>
                            </MDBBtn>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBBtn, MDBRow, MDBCol } from 'mdb-vue-ui-kit'
import MDBSelect from '@/components/MDBSelect.vue'
import { useAuthStore } from '@/stores/authStore'
import { useLangStore } from '@/stores/langStore'
import { geographyService } from '@/services/geographyService'
import { companyService } from '@/services/companyService'
import router from '@/router'
import type {
    SelectOption,
    RegionOption,
    CityOption,
    BusinessTypeOption,
    CompanySetupForm,
} from '@/types/company'
import PhoneCodeSelect from '@/components/PhoneCodeSelect.vue'

const { t, locale } = useI18n()
const authStore = useAuthStore()
const langStore = useLangStore()

// ── اللغة والخروج ──────────────────────────
function toggleLang() {
    const lang = langStore.lang === 'ar' ? 'en' : 'ar'
    langStore.switchLang(lang)
    locale.value = lang
    console.log(authStore.permissions);

}

async function handleLogout() {
    await authStore.logout()
}

// ── الخطوات ────────────────────────────────
const steps = computed(() => [
    { title: t('setup.step1.title'), subtitle: t('setup.step1.subtitle'), icon: 'fas fa-building' },
    { title: t('setup.step2.title'), subtitle: t('setup.step2.subtitle'), icon: 'fas fa-globe' },
    { title: t('setup.step3.title'), subtitle: t('setup.step3.subtitle'), icon: 'fas fa-industry' },
    { title: t('setup.step4.title'), subtitle: t('setup.step4.subtitle'), icon: 'fas fa-cog' },
])

const currentStep = ref(1)
const isSubmitting = ref(false)
const initialLoading = ref(true)
const generalError = ref('')

// ── بيانات ثابتة ───────────────────────────
const countries = ref<SelectOption[]>([])
const currencies = ref<SelectOption[]>([])
const industries = ref<SelectOption[]>([])

const allRegions = ref<RegionOption[]>([])
const allCities = ref<CityOption[]>([])
const allBusinessTypes = ref<BusinessTypeOption[]>([])

// ── Computed: فلترة ─────────────────────────
const filteredRegions = computed<SelectOption[]>(() => {
    if (!form.country_id) return []
    return allRegions.value.filter(r => r.countryUlid === form.country_id)
})

const filteredCities = computed<SelectOption[]>(() => {
    if (!form.region_id) return []
    return allCities.value.filter(c => c.regionUlid === form.region_id)
})

const filteredBusinessTypes = computed<SelectOption[]>(() => {
    if (!form.industry_id) return []
    return allBusinessTypes.value.filter(b => b.industryUlid === form.industry_id)
})

// ── Computed: أسماء للملخص ──────────────────
const selectedCountryName = computed(() =>
    countries.value.find(c => c.value === form.country_id)?.text ?? ''
)
const selectedIndustryName = computed(() =>
    industries.value.find(i => i.value === form.industry_id)?.text ?? ''
)
const selectedCurrencyName = computed(() =>
    currencies.value.find(c => c.value === form.default_currency_id)?.text ?? ''
)

// ── رقم الجوال الكامل مع الكود ─────────────
// يُنتج: +970599916672
const fullMobileNumber = computed(() => {
    if (!form.mobile_number) return ''
    // إزالة الصفر البادئ من رقم الجوال إن وُجد
    const local = form.mobile_number.replace(/^0+/, '')
    return `${form.phone_code}${local}`
})

// placeholder ديناميكي حسب الكود المختار
const mobilePlaceholder = computed(() => {
    const map: Record<string, string> = {
        '+970': '599916672',
        '+972': '501234567',
        '+962': '791234567',
        '+966': '512345678',
        '+971': '501234567',
        '+20': '1012345678',
        '+1': '2025551234',
        '+44': '7911123456',
    }
    return map[form.phone_code] ?? '5xxxxxxxx'
})

// تنظيف: أرقام فقط
function sanitizeMobile() {
    form.mobile_number = form.mobile_number.replace(/\D/g, '')
}

// ── القوائم الثابتة ─────────────────────────
const timezones = computed<SelectOption[]>(() => [
    { value: 'Asia/Jerusalem', text: t('setup.timezones.jerusalem') },
    { value: 'Asia/Gaza', text: t('setup.timezones.gaza') },
    { value: 'Asia/Amman', text: t('setup.timezones.amman') },
    { value: 'Asia/Riyadh', text: t('setup.timezones.riyadh') },
    { value: 'Asia/Dubai', text: t('setup.timezones.dubai') },
    { value: 'Africa/Cairo', text: t('setup.timezones.cairo') },
    { value: 'UTC', text: 'UTC' },
])

const dateFormats = computed<SelectOption[]>(() => [
    { value: 'Y-m-d', text: `2025-12-31  ${t('setup.dateFormatHints.iso')}` },
    { value: 'd/m/Y', text: `31/12/2025  ${t('setup.dateFormatHints.dmy')}` },
    { value: 'm/d/Y', text: `12/31/2025  ${t('setup.dateFormatHints.mdy')}` },
    { value: 'd-m-Y', text: `31-12-2025  ${t('setup.dateFormatHints.dmy2')}` },
])

// ── الفورم ──────────────────────────────────
const form = reactive<CompanySetupForm & { mobile_number: string }>({
    title: '',
    logo: null,
    commercial_registeration_number: '',
    email: '',
    phone_code: '+970',
    mobile_number: '',     // رقم الجوال بدون الكود
    mobile: '',            // يُحسب عند الإرسال: phone_code + mobile_number
    landline: '',
    country_id: null,
    region_id: null,
    city_id: null,
    address: '',
    timezone: 'Asia/Jerusalem',
    industry_id: null,
    business_type_id: null,
    default_currency_id: null,
    vat_rate: 0,
    income_tax_rate: 0,
    date_format: 'Y-m-d',
})

// ✅ للـ preview
const logoPreview = ref<string | null>(null)

function onLogoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
}

function removeLogo() {
    form.logo = null
    logoPreview.value = null
    // إعادة تعيين الـ input
    const input = document.getElementById('logo-input') as HTMLInputElement
    if (input) input.value = ''
}

function onLogoDrop(event: DragEvent) {
    const file = event.dataTransfer?.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
}

const countryCodes = [
    { value: '+970', text: '🇵🇸 +970' },
    { value: '+972', text: '🇮🇱 +972' },
    { value: '+962', text: '🇯🇴 +962' },
    { value: '+966', text: '🇸🇦 +966' },
    { value: '+971', text: '🇦🇪 +971' },
    { value: '+20', text: '🇪🇬 +20' },
    { value: '+1', text: '🇺🇸 +1' },
    { value: '+44', text: '🇬🇧 +44' },
]

const errors = reactive<Record<string, string>>({})

// ── Computed ────────────────────────────────
const currentStepData = computed(
    () => steps.value[currentStep.value - 1] ?? { title: '', subtitle: '', icon: '' }
)
const progressPercent = computed(() => (currentStep.value / steps.value.length) * 100)

// ── تحميل كل البيانات دفعة واحدة ───────────
onMounted(async () => {
    const lang = langStore.lang
    try {
        const data = await geographyService.getSetupData(lang)
        countries.value = data.countries
        allRegions.value = data.allRegions
        allCities.value = data.allCities
        currencies.value = data.currencies
        industries.value = data.industries
        allBusinessTypes.value = data.allBusinessTypes
    } catch {
        generalError.value = t('setup.errors.loadFailed')
    } finally {
        initialLoading.value = false
    }
})

// ── معالجات التغيير ─────────────────────────
function onCountryChange() {
    form.region_id = null
    form.city_id = null
}
function onRegionChange() {
    form.city_id = null
}
function onIndustryChange() {
    form.business_type_id = null
}

// ── التحقق ──────────────────────────────────
function validateStep(step: number): boolean {
    Object.keys(errors).forEach(k => delete errors[k])

    if (step === 1) {
        if (!form.title.trim())
            errors.title = t('setup.validation.companyNameRequired')
        if (!form.commercial_registeration_number.trim())
            errors.commercial_registeration_number = t('setup.validation.commercialRegRequired')
        if (!form.email.trim())
            errors.email = t('setup.validation.emailRequired')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errors.email = t('setup.validation.emailInvalid')
        if (form.mobile_number && !/^\d{7,15}$/.test(form.mobile_number))
            errors.mobile_number = t('setup.validation.mobileInvalid')
    }

    if (step === 2) {
        if (!form.country_id)
            errors.country_id = t('setup.validation.countryRequired')
    }

    if (step === 3) {
        if (!form.industry_id)
            errors.industry_id = t('setup.validation.industryRequired')
        if (!form.business_type_id)
            errors.business_type_id = t('setup.validation.businessTypeRequired')
        if (!form.default_currency_id)
            errors.default_currency_id = t('setup.validation.currencyRequired')
    }

    return Object.keys(errors).length === 0
}

function nextStep() {
    if (!validateStep(currentStep.value)) return
    if (currentStep.value < steps.value.length) currentStep.value++
}
function prevStep() {
    if (currentStep.value > 1) currentStep.value--
}

// ── Submit ───────────────────────────────────
async function submitSetup() {
    if (!validateStep(currentStep.value)) return
    isSubmitting.value = true
    generalError.value = ''

    // دمج phone_code مع mobile_number قبل الإرسال
    form.mobile = fullMobileNumber.value

    try {
        const payload = { ...form }
        delete (payload as Record<string, unknown>).mobile_number // لا نرسل الحقل المنفصل
        const response = await companyService.setup(payload)
        authStore.setCompany(String(response.company.id))
        await router.push('/dashboard')
    } catch (err: unknown) {
        const axiosErr = err as {
            response?: { data?: { message?: string; errors?: Record<string, string[]> } }
        }
        const data = axiosErr.response?.data

        if (data?.errors) {
            const stepMap: Record<string, number> = {
                title: 1, commercial_registeration_number: 1, email: 1, mobile: 1, landline: 1,
                country_id: 2, region_id: 2, city_id: 2, address: 2, timezone: 2,
                industry_id: 3, business_type_id: 3, default_currency_id: 3,
            }
            const fields = Object.keys(data.errors)
            fields.forEach(field => { errors[field] = data.errors?.[field]?.[0] ?? '' })
            const firstField = fields[0]
            if (firstField) currentStep.value = stepMap[firstField] ?? 4
        }

        generalError.value = data?.message ?? t('setup.errors.submitFailed')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
/* ══ Layout ══ */
.setup-layout {
    background-color: #f0f2f5;
}

/* ══ Sidebar ══ */
.setup-sidebar {
    width: 280px;
    background: linear-gradient(160deg, #1d334f 0%, #1d7342 100%);
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
}

.step-item {
    opacity: 0.5;
    transition: opacity 0.3s, transform 0.2s;
}

.step-item.step-done {
    opacity: 0.75;
}

.step-item.step-active {
    opacity: 1;
}

[dir="ltr"] .step-item.step-active {
    transform: translateX(4px);
}

[dir="rtl"] .step-item.step-active {
    transform: translateX(-4px);
}

.step-circle {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.4);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    transition: all 0.3s;
    flex-shrink: 0;
}

.step-item.step-active .step-circle {
    background: #fff;
    color: #1d334f;
    border-color: #fff;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.15);
}

.step-item.step-done .step-circle {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
}

.step-title {
    color: #fff;
    font-weight: 600;
    font-size: 14px;
}

.step-subtitle {
    color: rgba(255, 255, 255, 0.55);
    font-size: 12px;
    margin-top: 2px;
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

/* ══ Mobile ══ */
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

.progress-bar-mobile {
    height: 4px;
    background: #dde1e7;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #1d334f, #1d7342);
    transition: width 0.4s ease;
}

/* ══ Card ══ */
.setup-form-wrapper {
    padding: 2rem 1.5rem;
    align-items: flex-start !important;
}

.setup-card {
    max-width: 800px;
    border: 1px solid rgba(0, 0, 0, 0.07);
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
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

.step-counter-badge {
    display: inline-block;
    background: #e8f5ee;
    color: #1d7342;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.2rem 0.75rem;
    border-radius: 20px;
    border: 1px solid #c3e6d0;
}

.step-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #dde1e7;
    transition: all 0.3s;
}

.step-dot.dot-active {
    background: #1d334f;
    width: 28px;
    border-radius: 5px;
}

.step-dot.dot-done {
    background: #1d7342;
}

.card-body-section {
    padding: 2rem 2rem 2.5rem;
    position: relative;
}

/* ══ Loading Overlay ══ */
.loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 0 1rem 1rem;
    z-index: 10;
    backdrop-filter: blur(2px);
}

/* ══ Form Labels ══ */
.form-label.fw-semibold {
    font-size: 0.875rem;
    color: #344054;
    margin-bottom: 0.4rem;
}

/* ══ Input Group RTL fixes ══ */
.input-group>.input-group-text:first-child {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

.input-group>.input-group-text:last-child {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

[dir="rtl"] .input-group>.input-group-text:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

[dir="rtl"] .input-group>.input-group-text:last-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

/* ══ Summary ══ */
.summary-card {
    background: #f8fafb;
    border: 1px solid #e3e8ed !important;
}

.summary-icon-wrap {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #e8f5ee;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.summary-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: #fff;
    border: 1px solid #eef0f3;
    border-radius: 8px;
    padding: 0.6rem 0.85rem;
}

.summary-label {
    color: #8d9aab;
    font-size: 0.78rem;
    font-weight: 500;
}

.summary-item strong {
    font-size: 0.9rem;
    color: #1a2a3a;
    word-break: break-all;
}

/* ══ Nav Buttons ══ */
.nav-buttons-row {
    border-top: 1px solid #eef0f3;
}

.nav-btn {
    height: 48px;
    min-width: 130px;
    font-size: 0.95rem;
    font-weight: 600;
    border-radius: 10px !important;
    transition: transform 0.15s, box-shadow 0.15s;
}

.nav-btn:hover:not(:disabled) {
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

:deep(.btn-success) {
    background: #1d7342 !important;
    border-color: #1d7342 !important;
}

:deep(.btn-success:hover) {
    background: #155e35 !important;
}

/* ══ Transitions ══ */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity 0.22s ease, transform 0.22s ease;
}

[dir="ltr"] .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(18px);
}

[dir="ltr"] .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(-18px);
}

[dir="rtl"] .fade-slide-enter-from {
    opacity: 0;
    transform: translateX(-18px);
}

[dir="rtl"] .fade-slide-leave-to {
    opacity: 0;
    transform: translateX(18px);
}

[dir="rtl"] .input-group>.input-group-text:first-child {
    border-radius: 0 0.375rem 0.375rem 0;
}

[dir="rtl"] .input-group>.form-control:last-child {
    border-radius: 0.375rem 0 0 0.375rem;
}

[dir="rtl"] .input-group> :not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback) {
    margin-left: calc(var(--mdb-border-width) * -1);
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
}

/* إخفاء السهم في حقول الأرقام */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
}

[dir="rtl"] .input-group> :not(:first-child):not(.dropdown-menu):not(.valid-tooltip):not(.valid-feedback):not(.invalid-tooltip):not(.invalid-feedback) {
    margin-left: calc(var(--mdb-border-width) * -1);
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
}

[dir="rtl"] .input-group:not(.has-validation)> :not(:last-child):not(.dropdown-toggle):not(.dropdown-menu):not(.form-floating),
.input-group:not(.has-validation)>.dropdown-toggle:nth-last-child(n+3),
.input-group:not(.has-validation)>.form-floating:not(:last-child)>.form-control,
.input-group:not(.has-validation)>.form-floating:not(:last-child)>.form-select {
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
}

/* الوضع الافتراضي (LTR) */
.input-group>.input-group-text:first-child {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

.input-group>.input-group-text:last-child {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

/* عند RTL نعكس */
[dir="rtl"] .input-group>.input-group-text:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

[dir="rtl"] .input-group>.input-group-text:last-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

/* ══ Logo Upload ══ */
.logo-upload-zone {
    border: 2px dashed #c8d0db;
    border-radius: 12px;
    background: #f8fafb;
    min-height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.25s, background 0.25s;
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
    min-height: 140px;
}

.upload-placeholder {
    text-align: center;
    padding: 1.5rem;
    color: #6c757d;
}

.upload-icon {
    font-size: 2.2rem;
    color: #adb5bd;
    display: block;
    margin-bottom: 0.75rem;
}

.logo-preview-img {
    max-height: 120px;
    max-width: 100%;
    object-fit: contain;
    padding: 0.75rem;
    border-radius: 10px;
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
    border-radius: 10px;
}

.logo-upload-zone:hover .logo-overlay {
    opacity: 1;
}

.logo-overlay-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #fff;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    font-size: 0.85rem;
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
    background: rgba(220, 53, 69, 0.6);
}
</style>