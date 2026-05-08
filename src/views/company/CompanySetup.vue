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
                    <i :class="['fas fa-language', langStore.lang === 'en' ? 'me-2' : 'ms-2']"></i>
                    {{ langStore.lang === 'ar' ? 'English' : 'عربي' }}
                </button>
                <button class="sidebar-ctrl-btn logout-btn" @click="handleLogout">
                    <i :class="['fas fa-sign-out-alt', langStore.lang === 'en' ? 'me-2' : 'ms-2']"></i>
                    {{ $t('setup.logout') }}
                </button>
            </div>
        </div>

        <!-- ══ Main Content ══ -->
        <div class="setup-content flex-grow-1 d-flex flex-column mt-5">

            <div class="progress-bar-mobile d-lg-none">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
            </div>

            <div class="mobile-topbar d-flex d-lg-none align-items-center justify-content-between px-3 py-2">
                <img src="@/assets/images/logo-brand.png" alt="Logo" height="32" />
                <div class="d-flex gap-2">
                    <button class="mobile-ctrl-btn" @click="toggleLang"><i class="fas fa-language"></i></button>
                    <button class="mobile-ctrl-btn" @click="handleLogout"><i class="fas fa-sign-out-alt"></i></button>
                </div>
            </div>

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

                        <div v-if="initialLoading" class="loading-overlay">
                            <div class="d-flex flex-column align-items-center gap-3">
                                <div class="spinner-border text-success" style="width:2.5rem;height:2.5rem;"></div>
                                <span class="text-muted small">{{ $t('setup.loading') }}</span>
                            </div>
                        </div>

                        <!-- ════ الخطوة 1: المعلومات الأساسية ════ -->
                        <Transition name="fade-slide" mode="out-in">
                            <div v-if="currentStep === 1" key="step1">
                                <MDBRow class="g-4">

                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.companyName') }}<span class="text-danger ms-1">*</span>
                                        </label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-building"></i></span>
                                            <input v-model="form.title" type="text" class="form-control"
                                                :class="{ 'is-invalid': errors.title }"
                                                :placeholder="$t('setup.placeholders.companyName')" />
                                            <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.commercialReg') }}<span
                                                class="text-danger ms-1">*</span>
                                        </label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-hashtag"></i></span>
                                            <input v-model="form.commercial_registeration_number" type="text"
                                                class="form-control"
                                                :class="{ 'is-invalid': errors.commercial_registeration_number }"
                                                :placeholder="$t('setup.placeholders.commercialReg')" dir="ltr" />
                                            <div v-if="errors.commercial_registeration_number" class="invalid-feedback">
                                                {{ errors.commercial_registeration_number }}
                                            </div>
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.companyEmail') }}<span class="text-danger ms-1">*</span>
                                        </label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                                            <input v-model="form.email" type="email" class="form-control"
                                                :class="{ 'is-invalid': errors.email }"
                                                :placeholder="$t('setup.placeholders.companyEmail')" dir="ltr" />
                                            <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="6">
                                        <label class="form-label fw-semibold">{{ $t('setup.fields.mobile') }}</label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-phone"></i></span>
                                            <input v-model="form.mobile_number" type="tel" class="form-control"
                                                :class="{ 'is-invalid': errors.mobile_number }"
                                                :placeholder="mobilePlaceholder" dir="ltr" inputmode="numeric"
                                                @input="sanitizeMobile" maxlength="9" />
                                            <div class="input-group-text p-0">
                                                <PhoneCodeSelect v-model="form.phone_code" :options="countryCodes" />
                                            </div>
                                            <div v-if="errors.mobile_number" class="invalid-feedback">
                                                {{ errors.mobile_number }}
                                            </div>
                                        </div>
                                        <div v-if="form.mobile_number" class="mt-1 d-flex align-items-center gap-1">
                                            <i class="fas fa-check-circle text-success" style="font-size:12px"></i>
                                            <small class="text-success fw-semibold" dir="ltr">{{ fullMobileNumber
                                                }}</small>
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="6">
                                        <label class="form-label fw-semibold">{{ $t('setup.fields.landline') }}</label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-phone-alt"></i></span>
                                            <input v-model="form.landline" type="tel" class="form-control"
                                                :class="{ 'is-invalid': errors.landline }" placeholder="022xxxxxx"
                                                dir="ltr" inputmode="numeric" maxlength="12"
                                                @input="sanitizeLandline" />
                                            <div v-if="errors.landline" class="invalid-feedback">{{ errors.landline }}
                                            </div>
                                        </div>
                                    </MDBCol>

                                    <!-- الشعار -->
                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.logo') }}
                                            <span class="text-muted small ms-1">({{ $t('setup.fields.logoHint')
                                                }})</span>
                                        </label>
                                        <div class="logo-upload-zone" :class="{ 'has-logo': logoPreview }"
                                            @click="!logoPreview && ($refs.logoInput as HTMLInputElement).click()"
                                            @dragover.prevent @drop.prevent="onLogoDrop">
                                            <template v-if="!logoPreview">
                                                <div class="upload-placeholder">
                                                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                                                    <p class="mb-1 fw-semibold">{{ $t('setup.fields.logoUpload') }}</p>
                                                    <p class="text-muted small mb-0">PNG, JPG, SVG — {{
                                                        $t('setup.fields.logoMaxSize') }}</p>
                                                </div>
                                            </template>
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
                                        <input ref="logoInput" id="logo-input" type="file"
                                            accept="image/png,image/jpeg,image/svg+xml,image/webp" class="d-none"
                                            @change="onLogoChange" />
                                        <div v-if="errors.logo" class="invalid-feedback d-block mt-1">{{ errors.logo }}
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
                                            <span class="input-group-text"><i class="fas fa-globe"></i></span>
                                            <MDBSelect v-model="form.country_id" :options="countries"
                                                :dir="langStore.dir" :placeholder="$t('setup.fields.selectCountry')"
                                                :disabled="initialLoading" filter @change="onCountryChange"
                                                height="44.63px" />
                                        </div>
                                        <div v-if="errors.country_id" class="invalid-feedback d-block mt-1">
                                            {{ errors.country_id }}
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="6">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-map-marked-alt"></i></span>
                                            <MDBSelect v-model="form.region_id" :options="filteredRegions"
                                                :placeholder="$t('setup.fields.selectRegion')" :dir="langStore.dir"
                                                :disabled="!form.country_id || initialLoading" filter
                                                @change="onRegionChange" height="44.63px" />
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="6">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-city"></i></span>
                                            <MDBSelect v-model="form.city_id" :options="filteredCities"
                                                :placeholder="$t('setup.fields.selectCity')" :dir="langStore.dir"
                                                :disabled="!form.region_id || initialLoading" filter height="44.63px" />
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">{{ $t('setup.fields.address') }}</label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-map-pin"></i></span>
                                            <input v-model="form.address" type="text" class="form-control"
                                                :class="{ 'is-invalid': errors.address }"
                                                :placeholder="$t('setup.placeholders.address')" />
                                            <div v-if="errors.address" class="invalid-feedback">{{ errors.address }}
                                            </div>
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="12">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-clock"></i></span>
                                            <MDBSelect v-model="form.timezone" :options="timezones"
                                                :placeholder="$t('setup.fields.selectTimezone')" :dir="langStore.dir"
                                                :disabled="initialLoading" height="44.63px" />
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
                                            <span class="input-group-text"><i class="fas fa-industry"></i></span>
                                            <MDBSelect v-model="form.industry_id" :options="industries"
                                                :placeholder="$t('setup.fields.selectIndustry')" :dir="langStore.dir"
                                                :disabled="initialLoading" filter @change="onIndustryChange"
                                                height="44.63px" />
                                        </div>
                                        <div v-if="errors.industry_id" class="invalid-feedback d-block mt-1">
                                            {{ errors.industry_id }}
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="12">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-briefcase"></i></span>
                                            <MDBSelect v-model="form.business_type_id" :options="filteredBusinessTypes"
                                                :placeholder="$t('setup.fields.selectBusinessType')"
                                                :dir="langStore.dir" :disabled="!form.industry_id || initialLoading"
                                                height="44.63px" />
                                        </div>
                                        <div v-if="errors.business_type_id" class="invalid-feedback d-block mt-1">
                                            {{ errors.business_type_id }}
                                        </div>
                                    </MDBCol>

                                    <!-- ── اختيار العملة الأساسية ────────────────────────── -->
                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.selectCurrency') }}
                                            <span class="text-danger ms-1">*</span>
                                        </label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-coins"></i></span>
                                            <MDBSelect v-model="form.default_currency_id" :options="currencies"
                                                :placeholder="$t('setup.fields.selectCurrency')" :dir="langStore.dir"
                                                :disabled="initialLoading" filter height="44.63px"
                                                @change="onCurrencyChange" />
                                        </div>
                                        <div v-if="errors.default_currency_id" class="invalid-feedback d-block mt-1">
                                            {{ errors.default_currency_id }}
                                        </div>
                                        <!-- معلومات العملة المختارة -->
                                        <div v-if="selectedCurrencyInfo" class="currency-info-box mt-2">
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="currency-symbol-preview">
                                                    {{ selectedCurrencyInfo.symbol || selectedCurrencyInfo.code }}
                                                </div>
                                                <div>
                                                    <div class="fw-semibold small">{{ selectedCurrencyInfo.name }}</div>
                                                    <div class="text-muted" style="font-size:.78rem">
                                                        {{ $t('setup.fields.currencyHint') }}
                                                    </div>
                                                </div>
                                                <div class="ms-auto badge bg-success bg-opacity-10 text-success">
                                                    <i class="fas fa-star me-1" style="font-size:10px" />
                                                    {{ $t('currencies.base') }}
                                                </div>
                                            </div>
                                        </div>
                                    </MDBCol>

                                    <!-- ── مصدر سعر الصرف ────────────────────────────────── -->
                                    <MDBCol md="12">
                                        <label class="form-label fw-semibold">
                                            {{ $t('setup.fields.exchangeRateSource') }}
                                        </label>
                                        <div class="source-grid-setup">

                                            <button type="button" class="source-option-card"
                                                :class="{ selected: form.exchange_rate_source === 'system' }"
                                                @click="form.exchange_rate_source = 'system'">
                                                <div class="source-icon-wrap system">
                                                    <i class="fas fa-server" />
                                                </div>
                                                <div class="source-card-body">
                                                    <div class="fw-bold small">{{ $t('currencies.source.systemLabel') }}
                                                    </div>
                                                    <div class="text-muted" style="font-size:.72rem">
                                                        {{ $t('currencies.source.systemDesc') }}
                                                    </div>
                                                </div>
                                                <div class="source-check">
                                                    <i v-if="form.exchange_rate_source === 'system'"
                                                        class="fas fa-check-circle text-success" />
                                                    <div v-else class="source-check-empty" />
                                                </div>
                                            </button>

                                            <button type="button" class="source-option-card"
                                                :class="{ selected: form.exchange_rate_source === 'manual' }"
                                                @click="form.exchange_rate_source = 'manual'">
                                                <div class="source-icon-wrap manual">
                                                    <i class="fas fa-pencil-alt" />
                                                </div>
                                                <div class="source-card-body">
                                                    <div class="fw-bold small">{{ $t('currencies.source.manualLabel') }}
                                                    </div>
                                                    <div class="text-muted" style="font-size:.72rem">
                                                        {{ $t('currencies.source.manualDesc') }}
                                                    </div>
                                                </div>
                                                <div class="source-check">
                                                    <i v-if="form.exchange_rate_source === 'manual'"
                                                        class="fas fa-check-circle text-primary" />
                                                    <div v-else class="source-check-empty" />
                                                </div>
                                            </button>

                                            <button type="button" class="source-option-card"
                                                :class="{ selected: form.exchange_rate_source === 'market' }"
                                                @click="form.exchange_rate_source = 'market'">
                                                <div class="source-icon-wrap market">
                                                    <i class="fas fa-chart-line" />
                                                </div>
                                                <div class="source-card-body">
                                                    <div class="fw-bold small">{{ $t('currencies.source.marketLabel') }}
                                                    </div>
                                                    <div class="text-muted" style="font-size:.72rem">
                                                        {{ $t('currencies.source.marketDesc') }}
                                                    </div>
                                                </div>
                                                <div class="source-check">
                                                    <i v-if="form.exchange_rate_source === 'market'"
                                                        class="fas fa-check-circle text-purple" />
                                                    <div v-else class="source-check-empty" />
                                                </div>
                                            </button>

                                        </div>
                                        <!-- تلميح للمصدر المختار -->
                                        <div class="source-hint-box mt-2" v-if="form.exchange_rate_source">
                                            <i class="fas fa-info-circle me-2 text-muted" />
                                            <span class="text-muted small">
                                                {{ sourceHintText }}
                                            </span>
                                        </div>
                                    </MDBCol>

                                </MDBRow>
                            </div>
                        </Transition>

                        <!-- ════ الخطوة 4: الإعدادات المالية ════ -->
                        <Transition name="fade-slide" mode="out-in">
                            <div v-if="currentStep === 4" key="step4">
                                <MDBRow class="g-4">

                                    <MDBCol md="6">
                                        <label class="form-label fw-semibold">{{ $t('setup.fields.vatRate') }}</label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i
                                                    class="fas fa-file-invoice-dollar"></i></span>
                                            <input v-model.number="form.vat_rate" type="number" class="form-control"
                                                :class="{ 'is-invalid': errors.vat_rate }" placeholder="0.00" min="0"
                                                max="100" step="0.01" dir="ltr" />
                                            <span class="input-group-text"><i class="fas fa-percent"></i></span>
                                            <div v-if="errors.vat_rate" class="invalid-feedback">{{ errors.vat_rate }}
                                            </div>
                                        </div>
                                        <div class="form-text text-muted small mt-1">{{ $t('setup.hints.vatRate') }}
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="6">
                                        <label class="form-label fw-semibold">{{ $t('setup.fields.incomeTax') }}</label>
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i
                                                    class="fas fa-file-invoice-dollar"></i></span>
                                            <input v-model.number="form.income_tax_rate" type="number"
                                                class="form-control" :class="{ 'is-invalid': errors.income_tax_rate }"
                                                placeholder="0.00" min="0" max="100" step="0.01" dir="ltr" />
                                            <span class="input-group-text"><i class="fas fa-percent"></i></span>
                                            <div v-if="errors.income_tax_rate" class="invalid-feedback">
                                                {{ errors.income_tax_rate }}
                                            </div>
                                        </div>
                                        <div class="form-text text-muted small mt-1">{{ $t('setup.hints.incomeTax') }}
                                        </div>
                                    </MDBCol>

                                    <MDBCol md="12">
                                        <div class="input-group input-group-lg">
                                            <span class="input-group-text"><i class="fas fa-calendar-alt"></i></span>
                                            <MDBSelect v-model="form.date_format" :options="dateFormats"
                                                :placeholder="$t('setup.fields.selectDateFormat')" :dir="langStore.dir"
                                                :disabled="initialLoading" height="44.63px" />
                                        </div>
                                    </MDBCol>

                                    <!-- ── ملخص شامل ──────────────────────────────────────── -->
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
                                                        <span class="summary-label"><i class="fas fa-building me-1" />{{
                                                            $t('setup.summary.name') }}</span>
                                                        <strong>{{ form.title || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label"><i class="fas fa-envelope me-1" />{{
                                                            $t('setup.summary.email') }}</span>
                                                        <strong dir="ltr">{{ form.email || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label"><i class="fas fa-hashtag me-1" />{{
                                                            $t('setup.summary.reg')
                                                            }}</span>
                                                        <strong>{{ form.commercial_registeration_number || '—'
                                                            }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label"><i
                                                                class="fas fa-mobile-alt me-1" />{{
                                                            $t('setup.summary.mobile') }}</span>
                                                        <strong dir="ltr">{{ fullMobileNumber || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label"><i class="fas fa-globe me-1" />{{
                                                            $t('setup.summary.country') }}</span>
                                                        <strong>{{ selectedCountryName || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label"><i class="fas fa-clock me-1" />{{
                                                            $t('setup.summary.timezone') }}</span>
                                                        <strong>{{ form.timezone || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label"><i class="fas fa-industry me-1" />{{
                                                            $t('setup.summary.industry') }}</span>
                                                        <strong>{{ selectedIndustryName || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label"><i class="fas fa-coins me-1" />{{
                                                            $t('setup.summary.currency') }}</span>
                                                        <strong>{{ selectedCurrencyName || '—' }}</strong>
                                                    </div>
                                                </MDBCol>
                                                <!-- مصدر سعر الصرف في الملخص -->
                                                <MDBCol md="6">
                                                    <div class="summary-item">
                                                        <span class="summary-label"><i
                                                                class="fas fa-exchange-alt me-1" />{{
                                                            $t('setup.summary.exchangeSource') }}</span>
                                                        <strong>{{ selectedSourceLabel }}</strong>
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

                        <!-- Navigation Buttons -->
                        <div class="nav-buttons-row d-flex justify-content-between align-items-center mt-5 pt-3">
                            <MDBBtn v-if="currentStep > 1" outline="secondary" class="px-4 nav-btn" @click="prevStep">
                                <i :class="langStore.dir === 'rtl' ? 'fas fa-arrow-right' : 'fas fa-arrow-left'"
                                    class="me-2"></i>
                                {{ $t('setup.prev') }}
                            </MDBBtn>
                            <div v-else />

                            <!-- Next button (steps 1-3) -->
                            <MDBBtn v-if="currentStep < steps.length" color="primary" class="px-5 nav-btn"
                                :disabled="initialLoading" @click="nextStep">
                                {{ $t('setup.next') }}
                                <i :class="langStore.dir === 'rtl' ? 'fas fa-arrow-left' : 'fas fa-arrow-right'"
                                    class="ms-2"></i>
                            </MDBBtn>

                            <!-- Submit button (last step) — always show, never gate by permission -->
                            <MDBBtn v-else color="success" class="px-5 nav-btn"
                                :disabled="isSubmitting || initialLoading" @click="submitSetup">
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
    Currency,
} from '@/types/company'
import PhoneCodeSelect from '@/components/PhoneCodeSelect.vue'

const authStore = useAuthStore()
const { t, locale } = useI18n()
const langStore = useLangStore()

// ── اللغة والخروج ──────────────────────────
function toggleLang() {
    const lang = langStore.lang === 'ar' ? 'en' : 'ar'
    langStore.switchLang(lang)
    locale.value = lang
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
const currencyRawList = ref<Currency[]>([])   // ← للحصول على symbol/name كاملاً
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

// ── معلومات العملة المختارة ─────────────────
const selectedCurrencyInfo = computed<Currency | null>(() => {
    if (!form.default_currency_id) return null
    return currencyRawList.value.find(c => c.ulid === form.default_currency_id) ?? null
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
const selectedSourceLabel = computed(() => {
    const map: Record<string, string> = {
        system: t('currencies.source.systemLabel'),
        manual: t('currencies.source.manualLabel'),
        market: t('currencies.source.marketLabel'),
    }
    return map[form.exchange_rate_source] ?? '—'
})

// ── تلميح المصدر ────────────────────────────
const sourceHintText = computed(() => {
    const map: Record<string, string> = {
        system: t('currencies.source.systemDesc'),
        manual: t('currencies.source.manualDesc'),
        market: t('currencies.source.marketDesc'),
    }
    return map[form.exchange_rate_source] ?? ''
})

// ── رقم الجوال ──────────────────────────────
const fullMobileNumber = computed(() => {
    if (!form.mobile_number) return ''
    const local = form.mobile_number.replace(/^0+/, '')
    return `${form.phone_code}${local}`
})

const mobilePlaceholder = computed(() => {
    const map: Record<string, string> = {
        '+970': '599916672', '+972': '501234567', '+962': '791234567',
        '+966': '512345678', '+971': '501234567', '+20': '1012345678',
        '+1': '2025551234', '+44': '7911123456',
    }
    return map[form.phone_code] ?? '5xxxxxxxx'
})

function sanitizeMobile() {
    form.mobile_number = form.mobile_number.replace(/\D/g, '').slice(0, 9)
}

function sanitizeLandline() {
    form.landline = form.landline.replace(/\D/g, '').slice(0, 12)
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

// ── الفورم ──────────────────────────────────
const form = reactive<CompanySetupForm & {
    mobile_number: string
    exchange_rate_source: 'system' | 'manual' | 'market'
}>({
    title: '',
    logo: null,
    commercial_registeration_number: '',
    email: '',
    phone_code: '+970',
    mobile_number: '',
    mobile: '',
    landline: '',
    country_id: null,
    region_id: null,
    city_id: null,
    address: '',
    timezone: 'Asia/Jerusalem',
    industry_id: null,
    business_type_id: null,
    default_currency_id: null,
    exchange_rate_source: 'system',    // ← الجديد: الافتراضي = system
    vat_rate: 0,
    income_tax_rate: 0,
    date_format: 'Y-m-d',
})

const logoPreview = ref<string | null>(null)
const errors = reactive<Record<string, string>>({})

function onLogoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
}

function removeLogo() {
    form.logo = null
    logoPreview.value = null
    const input = document.getElementById('logo-input') as HTMLInputElement
    if (input) input.value = ''
}

function onLogoDrop(event: DragEvent) {
    const file = event.dataTransfer?.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
}

// ── Computed ────────────────────────────────
const currentStepData = computed(
    () => steps.value[currentStep.value - 1] ?? { title: '', subtitle: '', icon: '' }
)
const progressPercent = computed(() => (currentStep.value / steps.value.length) * 100)

// ── تحميل البيانات ──────────────────────────
onMounted(async () => {
    const lang = langStore.lang
    try {
        const data = await geographyService.getSetupData(lang)
        console.debug('[CompanySetup] setup-data before state assignment', {
            countries: data.countries?.length ?? 0,
            allRegions: data.allRegions?.length ?? 0,
            allCities: data.allCities?.length ?? 0,
            currencies: data.currencies?.length ?? 0,
            industries: data.industries?.length ?? 0,
            allBusinessTypes: data.allBusinessTypes?.length ?? 0,
        })
        countries.value = data.countries
        allRegions.value = data.allRegions
        allCities.value = data.allCities
        currencies.value = data.currencies
        currencyRawList.value = data.currenciesRaw ?? []
        industries.value = data.industries
        allBusinessTypes.value = data.allBusinessTypes
        console.debug('[CompanySetup] setup-data state assigned', {
            countries: countries.value.length,
            filteredRegions: filteredRegions.value.length,
            filteredCities: filteredCities.value.length,
            currencies: currencies.value.length,
            industries: industries.value.length,
            filteredBusinessTypes: filteredBusinessTypes.value.length,
        })
    } catch (err) {
        console.error('[CompanySetup] setup-data load failed', err)
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
function onCurrencyChange() {
    // يمكن إضافة منطق هنا لاحقاً مثل اقتراح مصدر السعر بحسب العملة
}

// ── التحقق ──────────────────────────────────
function validateStep(step: number): boolean {
    Object.keys(errors).forEach(k => delete errors[k])

    if (step === 1) {
        if (!form.title.trim())
            errors.title = t('setup.validation.companyNameRequired')
        if (form.title.length < 3)
            errors.title = t('validation.tooShort')
        if (!form.commercial_registeration_number.trim())
            errors.commercial_registeration_number = t('setup.validation.commercialRegRequired')
        if (!/^[A-Za-z0-9\-]{5,20}$/.test(form.commercial_registeration_number))
            errors.commercial_registeration_number = t('validation.invalidFormat')
        if (!form.email.trim())
            errors.email = t('setup.validation.emailRequired')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errors.email = t('setup.validation.emailInvalid')
        if (form.mobile_number && !/^\d{9}$/.test(form.mobile_number))
            errors.mobile_number = t('setup.validation.mobileInvalid')
        if (form.landline && form.landline.length < 7)
            errors.landline = t('setup.validation.landlineInvalid')
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

    if (step === 4) {
        if (form.vat_rate < 0 || form.vat_rate > 100)
            errors.vat_rate = t('validation.invalidVat')
        if (form.income_tax_rate < 0 || form.income_tax_rate > 100)
            errors.income_tax_rate = t('validation.invalidTax')
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

    form.mobile = fullMobileNumber.value

    try {
        const payload = { ...form, exchange_rate_source: form.exchange_rate_source }
        delete (payload as Record<string, unknown>).mobile_number
        const response = await companyService.setup(payload)

        const companyUlid = response.data.ulid
        if (!companyUlid) {
            generalError.value = t('setup.errors.submitFailed')
            return
        }
        authStore.setCompany(companyUlid)
        authStore.companyStatus = 'pending'
        authStore.isCompanyApproved = false
        localStorage.setItem('company_status', 'pending')
        await router.push('/pending-approval')
    } catch (err: unknown) {
        const axiosErr = err as {
            response?: { data?: { message?: string; errors?: Record<string, string[]> } }
        }
        const data = axiosErr.response?.data

        if (data?.errors) {
            const stepMap: Record<string, number> = {
                title: 1, commercial_registeration_number: 1, email: 1, mobile: 1, landline: 1,
                country_id: 2, region_id: 2, city_id: 2, address: 2, timezone: 2,
                industry_id: 3, business_type_id: 3, default_currency_id: 3, exchange_rate_source: 3,
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

/* ══ Currency Info Box ══ */
.currency-info-box {
    background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
    border: 1.5px solid #a7f3d0;
    border-radius: 10px;
    padding: 0.85rem 1rem;
}

.currency-symbol-preview {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #d1fae5;
    color: #059669;
    font-size: 1.1rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* ══ Source Grid (Setup version — compact) ══ */
.source-grid-setup {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: .75rem;
    margin-top: .35rem;
}

.source-option-card {
    display: flex;
    align-items: center;
    gap: .75rem;
    padding: .75rem .9rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    background: #f8fafb;
    cursor: pointer;
    text-align: start;
    transition: all .2s;
}

.source-option-card:hover {
    border-color: #94a3b8;
    background: #f1f5f9;
}

.source-option-card.selected {
    background: #fff;
    border-color: #a5b4fc;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, .1);
}

.source-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .85rem;
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

.source-hint-box {
    background: #f8fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: .5rem .85rem;
    display: flex;
    align-items: center;
}

.text-purple {
    color: #7c3aed !important;
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
    padding: .6rem .85rem;
}

.summary-label {
    color: #8d9aab;
    font-size: .78rem;
    font-weight: 500;
}

.summary-item strong {
    font-size: .9rem;
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
    font-size: .95rem;
    font-weight: 600;
    border-radius: 10px !important;
    transition: transform .15s, box-shadow .15s;
}

.nav-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, .15);
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
    transition: border-color .25s, background .25s;
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
    padding: 1.5rem;
    color: #6c757d;
}

.upload-icon {
    font-size: 2.2rem;
    color: #adb5bd;
    display: block;
    margin-bottom: .75rem;
}

.logo-preview-img {
    max-height: 120px;
    max-width: 100%;
    object-fit: contain;
    padding: .75rem;
    border-radius: 10px;
}

.logo-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, .45);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .75rem;
    opacity: 0;
    transition: opacity .2s;
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
    background: rgba(255, 255, 255, .2);
    color: #fff;
    font-size: .85rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .2s;
}

.logo-overlay-btn:hover {
    background: rgba(255, 255, 255, .35);
}

.logo-overlay-btn.delete:hover {
    background: rgba(220, 53, 69, .6);
}

/* ══ Transitions ══ */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: opacity .22s ease, transform .22s ease;
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

/* ══ Input RTL ══ */
.input-group>.input-group-text:first-child {
    border-top-left-radius: .5rem;
    border-bottom-left-radius: .5rem;
}

.input-group>.input-group-text:last-child {
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;
}

[dir="rtl"] .input-group>.input-group-text:first-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: .5rem;
    border-bottom-right-radius: .5rem;
}

[dir="rtl"] .input-group>.input-group-text:last-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: .5rem;
    border-bottom-left-radius: .5rem;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
}
</style>