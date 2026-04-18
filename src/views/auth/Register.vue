<template>
    <LoginLayout>
        <div class="register-form-container text-center" :dir="langStore.dir">
            <!-- Logo + Title -->
            <div class="mb-4">
                <img src="@/assets/images/logo-brand.png" alt="Logo" width="120" class="mb-2" />
                <h5 class="fw-bold text-dark mb-2">{{ $t("register.title") }}</h5>
                <p class="text-muted small">{{ $t("register.subtitle") }}</p>
            </div>

            <!-- Register Form -->
            <MDBRow tag="form" @submit.prevent="handleRegister" class="text-start">

                <!-- First & Last Name -->
                <MDBCol md="6" class="mb-3">
                    <div class="field-wrapper" dir="ltr">
                        <MDBInput v-model="form.firstName" :label="$t('register.firstName')" type="text" outline
                            size="lg" :class="{ 'rtl-label': langStore.dir === 'rtl' }">
                            <MDBIcon icon="user" class="trailing" />
                        </MDBInput>
                    </div>
                </MDBCol>

                <MDBCol md="6" class="mb-3">
                    <div class="field-wrapper" dir="ltr">
                        <MDBInput v-model="form.lastName" :label="$t('register.lastName')" type="text" outline size="lg"
                            :class="{ 'rtl-label': langStore.dir === 'rtl' }">
                            <MDBIcon icon="user" class="trailing" />
                        </MDBInput>
                    </div>
                </MDBCol>

                <!-- Email -->
                <MDBCol md="12" class="mb-3">
                    <div class="field-wrapper" dir="ltr">
                        <MDBInput v-model="form.email" :label="$t('register.email')" type="email" outline size="lg"
                            :class="{ 'rtl-label': langStore.dir === 'rtl' }">
                            <MDBIcon icon="envelope" class="trailing" />
                        </MDBInput>
                    </div>
                </MDBCol>

                <!-- Phone with Country -->
                <MDBCol md="12" class="mb-3">
                    <div class="d-flex gap-2 align-items-start" dir="ltr">
                        <MDBSelect v-model="form.country" :options="countries" :label="$t('register.country')"
                            :placeholder="$t('register.selectCountry')" filter style="width: 220px; flex-shrink: 0;" />
                        <div class="field-wrapper flex-grow-1">
                            <MDBInput v-model="form.phone" :label="$t('register.phone')" type="tel" outline size="lg">
                                <MDBIcon icon="phone" class="trailing" />
                            </MDBInput>
                        </div>
                    </div>
                </MDBCol>

                <!-- Password -->
                <MDBCol md="12" class="mb-3">
                    <div class="field-wrapper" dir="ltr">
                        <MDBInput v-model="form.password" :label="$t('register.password')" type="password" outline
                            size="lg" :class="{ 'rtl-label': langStore.dir === 'rtl' }">
                            <MDBIcon icon="lock" class="trailing" />
                        </MDBInput>
                    </div>
                </MDBCol>

                <MDBCol md="12" class="mb-3">
                    <div class="field-wrapper" dir="ltr">
                        <MDBInput v-model="form.password_confirmation" :label="$t('register.passwordConfirm')"
                            type="password" outline size="lg" :class="{ 'rtl-label': langStore.dir === 'rtl' }">
                            <MDBIcon icon="lock" class="trailing" />
                        </MDBInput>
                    </div>
                </MDBCol>

                <!-- Error Message -->
                <MDBCol md="12" v-if="errorMessage" class="mb-2">
                    <div class="alert alert-danger py-2 small mb-0" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>{{ errorMessage }}
                    </div>
                </MDBCol>

                <!-- Submit Button -->
                <MDBCol md="12" class="mb-3">
                    <MDBBtn type="submit" color="success" class="w-100 fw-bold btn-lg-custom"
                        :disabled="authStore.isLoading">
                        <span v-if="authStore.isLoading">
                            <i class="fas fa-spinner fa-spin me-2"></i> جارٍ التسجيل...
                        </span>
                        <span v-else>{{ $t("register.signUp") }}</span>
                    </MDBBtn>
                </MDBCol>

            </MDBRow>

            <!-- Divider -->
            <div class="d-flex align-items-center my-2">
                <hr class="flex-grow-1" />
                <span class="mx-2 text-muted small">{{ $t("register.or") }}</span>
                <hr class="flex-grow-1" />
            </div>

            <!-- Social Login -->
            <div class="d-flex justify-content-center gap-3 mb-4">
                <MDBBtn outline="primary" floating class="social-btn">
                    <MDBIcon icon="facebook" iconStyle="fab" size="2x" />
                </MDBBtn>
                <MDBBtn outline="danger" floating class="social-btn">
                    <MDBIcon icon="google" iconStyle="fab" size="2x" />
                </MDBBtn>
                <MDBBtn outline="dark" floating class="social-btn">
                    <MDBIcon icon="apple" iconStyle="fab" size="2x" />
                </MDBBtn>
            </div>

            <!-- Login Link -->
            <p class="small text-muted">
                {{ $t("register.alreadyHaveAccount") }}
                <RouterLink to="/login" class="text-success fw-bold">{{ $t("register.login") }}</RouterLink>
            </p>
        </div>
    </LoginLayout>
</template>

<script setup lang="ts">
import {
    MDBRow, MDBCol, MDBInput,
    MDBBtn, MDBIcon,
} from 'mdb-vue-ui-kit'
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import LoginLayout from '@/layouts/LoginLayout.vue'
import MDBSelect from '@/components/MDBSelect.vue'
import { useAuthStore } from '@/stores/authStore'
import { useLangStore } from '@/stores/langStore'

const authStore = useAuthStore()
const langStore = useLangStore()
const errorMessage = ref('')

const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    country: '+970',
    phone: '',
    password: '',
    password_confirmation: '',
})

const countries = [
    { value: '+1', text: '🇺🇸 United States (+1)' },
    { value: '+970', text: '🇵🇸 Palestine (+970)' },
    { value: '+962', text: '🇯🇴 Jordan (+962)' },
    { value: '+971', text: '🇦🇪 UAE (+971)' },
    { value: '+20', text: '🇪🇬 Egypt (+20)' },
    { value: '+966', text: '🇸🇦 Saudi Arabia (+966)' },
    { value: '+44', text: '🇬🇧 United Kingdom (+44)' },
]

const handleRegister = async () => {
    errorMessage.value = ''
    const fullPhone = `${form.country}${form.phone.replace(/^0+/, '')}`
    try {
        await authStore.register({
            first_name: form.firstName,
            last_name: form.lastName,
            email: form.email,
            phone: fullPhone,
            password: form.password,
            password_confirmation: form.password_confirmation,
        })
    } catch {
        errorMessage.value = authStore.error ?? 'حدث خطأ، حاول مرة أخرى'
    }
}
</script>

<style scoped>
.register-form-container {
    margin: 0 auto;
}

/* ── حاوية الحقل ── */
.field-wrapper {
    width: 100%;
}

/* ── label يمين عند RTL ── */
.field-wrapper :deep(.rtl-label label),
.field-wrapper :deep(.rtl-label .form-label) {
    right: 12px !important;
    left: auto !important;
    transform-origin: right top !important;
}

/* ── حجم الحقول ── */
.field-wrapper :deep(.form-outline input) {
    height: 52px !important;
    font-size: 1rem !important;
    padding-top: 0.6rem !important;
    padding-bottom: 0.6rem !important;
}

/* ── أيقونة trailing ── */
.field-wrapper :deep(.trailing) {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.45);
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
}

/* ── زر التسجيل ── */
.btn-lg-custom {
    height: 52px;
    font-size: 1rem;
}

.btn-success {
    background-color: #1d7342 !important;
    border: none !important;
}

.btn-success:hover {
    background-color: #155e35 !important;
}

.social-btn {
    width: 48px;
    height: 48px;
    transition: transform 0.2s;
}

.social-btn:hover {
    transform: scale(1.1);
}
</style>