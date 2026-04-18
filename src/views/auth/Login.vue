<template>
    <LoginLayout>
        <div :dir="langStore.dir" class="auth-typography">
            <!-- Logo + Text -->
            <div class="text-center mb-4">
                <img src="@/assets/images/logo-brand.png" alt="Logo" width="120" class="mb-2" />

                <h5 class="fw-bold text-dark mb-2 auth-title">
                    {{ $t("login.title") }}
                </h5>

                <p class="text-muted small auth-subtitle">
                    {{ $t("login.subtitle") }}
                </p>
            </div>

            <!-- Login Form -->
            <div class="login-form mx-auto">
                <MDBRow tag="form" @submit.prevent="handleLogin" class="text-start form-fields">

                    <MDBCol md="12" class="mb-1">
                        <div class="field-wrapper auth-input" dir="ltr">
                            <MDBInput v-model="form.email" :label="$t('login.email')"
                                :placeholder="$t('login.emailPlaceholder')" type="email" outline required size="lg"
                                class="form-icon-trailing" :class="{ 'rtl-label': langStore.dir === 'rtl' }">
                                <MDBIcon icon="envelope" class="trailing" />
                            </MDBInput>
                        </div>
                    </MDBCol>

                    <MDBCol md="12" class="mb-1">
                        <div class="field-wrapper auth-input" dir="ltr">
                            <MDBInput v-model="form.password" :label="$t('login.password')"
                                :placeholder="$t('login.passwordPlaceholder')"
                                :type="showPassword ? 'text' : 'password'" outline required size="lg"
                                class="form-icon-trailing" :class="{ 'rtl-label': langStore.dir === 'rtl' }">
                                <MDBIcon :icon="showPassword ? 'eye-slash' : 'eye'" class="trailing"
                                    @click="togglePassword" />
                            </MDBInput>
                        </div>
                    </MDBCol>

                    <MDBCol md="12" class="d-flex justify-content-between align-items-center mb-3">
                        <MDBCheckbox v-model="form.remember" :label="$t('login.rememberMe')" class="auth-footer-text" />

                        <a href="#" class="text-success small auth-footer-text">
                            {{ $t("login.forgotPassword") }}
                        </a>
                    </MDBCol>

                    <!-- Error Message -->
                    <MDBCol md="12" v-if="errorMessage" class="mb-2">
                        <div class="alert alert-danger py-2 small mb-0 auth-error" role="alert">
                            <i class="fas fa-exclamation-circle me-2"></i>
                            {{ errorMessage }}
                        </div>
                    </MDBCol>

                    <MDBCol md="12" class="mb-3">
                        <MDBBtn type="submit" color="success" class="w-100 py-2 fw-bold btn-lg-custom auth-btn"
                            :disabled="authStore.isLoading">
                            <span v-if="authStore.isLoading">
                                <i class="fas fa-spinner fa-spin me-2"></i>
                                جارٍ الدخول...
                            </span>
                            <span v-else>
                                {{ $t("login.signIn") }}
                            </span>
                        </MDBBtn>
                    </MDBCol>

                </MDBRow>
            </div>

            <!-- Divider -->
            <div class="d-flex align-items-center my-2">
                <hr class="flex-grow-1" />
                <span class="mx-2 text-muted small auth-footer-text">
                    {{ $t("login.or") }}
                </span>
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

            <!-- Register -->
            <p class="small text-muted text-center auth-footer-text">
                {{ $t("login.noAccount") }}
                <RouterLink to="/register" class="text-success fw-bold">
                    {{ $t("login.register") }}
                </RouterLink>
            </p>
        </div>
    </LoginLayout>
</template>

<script setup lang="ts">
import {
    MDBRow, MDBCol, MDBInput,
    MDBBtn, MDBIcon, MDBCheckbox,
} from 'mdb-vue-ui-kit'
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import LoginLayout from '@/layouts/LoginLayout.vue'
import { useAuthStore } from '@/stores/authStore'
import { useLangStore } from '@/stores/langStore'

const authStore = useAuthStore()
const langStore = useLangStore()

const form = reactive({
    email: '',
    password: '',
    remember: false,
})

const showPassword = ref(false)
const errorMessage = ref('')

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const handleLogin = async () => {
    errorMessage.value = ''
    try {
        await authStore.login({
            email: form.email,
            password: form.password,
            device_name: 'vue-app',
        })
    } catch {
        errorMessage.value = authStore.error ?? 'حدث خطأ، حاول مرة أخرى'
    }
}
</script>

<style scoped>
.login-form {
    width: 676px;
    max-width: 100%;
    padding: 0 12px;
}

.form-fields {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-fields .mb-3 {
    margin-bottom: 0 !important;
}

/* ── حاوية الحقل: تثبت dir="ltr" للحقل نفسه ── */
.field-wrapper {
    width: 100%;
}

/* ── عندما اللغة RTL: نعكس موضع الـ label فقط ── */
.field-wrapper :deep(.rtl-label label) {
    right: 12px !important;
    left: auto !important;
    transform-origin: right top !important;
}

/* ── الـ label يتحرك للأعلى عند الكتابة ── */
.field-wrapper :deep(.rtl-label .form-outline .form-label) {
    right: 12px;
    left: auto;
}

/* ── حجم الحقول وسط/كبير ── */
.field-wrapper :deep(.form-control-lg),
.field-wrapper :deep(.form-outline input) {
    height: 52px !important;
    font-size: 1rem !important;
    padding-top: 0.6rem !important;
    padding-bottom: 0.6rem !important;
}

/* ── أيقونة trailing ── */
.form-icon-trailing :deep(.trailing) {
    cursor: pointer;
    color: rgba(0, 0, 0, 0.45);
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
}

/* ── زر الدخول ── */
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