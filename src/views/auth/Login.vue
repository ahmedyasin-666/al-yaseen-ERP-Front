<template>
    <LoginLayout>

        <!-- Logo + Text -->
        <div class="text-center mb-4">
            <img src="@/assets/images/logo-brand.png" alt="Logo" width="110" class="mb-3" />
            <h5 class="fw-bold text-dark mb-1">{{ $t('login.title') }}</h5>
            <p class="text-muted small mb-0">{{ $t('login.subtitle') }}</p>
        </div>

        <!-- Login Form -->
        <MDBRow tag="form" @submit.prevent="handleLogin" class="text-start g-3">

            <!-- Email -->
            <MDBCol md="12">
                <div>
                    <MDBInput v-model="form.email" :label="$t('login.email')" type="email" outline required size="lg"
                        class="form-icon-trailing">
                        <MDBIcon icon="envelope" class="trailing text-muted" />
                    </MDBInput>
                </div>
            </MDBCol>

            <!-- Password -->
            <MDBCol md="12">
                <div>
                    <MDBInput v-model="form.password" :label="$t('login.password')"
                        :type="showPassword ? 'text' : 'password'" outline required size="lg"
                        class="form-icon-trailing">
                        <MDBIcon :icon="showPassword ? 'eye-slash' : 'eye'" class="trailing text-muted"
                            style="cursor:pointer" @click="showPassword = !showPassword" />
                    </MDBInput>
                </div>
            </MDBCol>

            <!-- Remember Me + Forgot Password -->
            <MDBCol md="12" class="d-flex justify-content-between align-items-center">
                <MDBCheckbox v-model="form.remember" :label="$t('login.rememberMe')" />
                <a href="#" class="text-success small fw-semibold text-decoration-none">
                    {{ $t('login.forgotPassword') }}
                </a>
            </MDBCol>

            <!-- Error -->
            <MDBCol md="12" v-if="errorMessage">
                <div class="alert alert-danger py-2 small mb-0 d-flex align-items-center gap-2 rounded-3" role="alert">
                    <i class="fas fa-exclamation-circle flex-shrink-0"></i>
                    <span>{{ errorMessage }}</span>
                </div>
            </MDBCol>

            <!-- Submit -->
            <MDBCol md="12">
                <MDBBtn type="submit" color="success" size="lg" class="w-100 fw-bold rounded-3 brand-btn"
                    :disabled="authStore.isLoading">
                    <span v-if="authStore.isLoading" class="d-flex align-items-center justify-content-center gap-2">
                        <i class="fas fa-spinner fa-spin"></i>
                        {{ $t('login.signingIn') }}
                    </span>
                    <span v-else>{{ $t('login.signIn') }}</span>
                </MDBBtn>
            </MDBCol>

        </MDBRow>

        <!-- Divider -->
        <div class="d-flex align-items-center my-3">
            <hr class="flex-grow-1 border-secondary-subtle" />
            <span class="mx-3 text-muted small">{{ $t('login.or') }}</span>
            <hr class="flex-grow-1 border-secondary-subtle" />
        </div>

        <!-- Social Login -->
        <div class="d-flex justify-content-center gap-3 mb-4">
            <MDBBtn outline="primary" floating style="width:46px;height:46px" type="button">
                <MDBIcon icon="facebook" iconStyle="fab" size="lg" />
            </MDBBtn>
            <MDBBtn outline="danger" floating style="width:46px;height:46px" type="button">
                <MDBIcon icon="google" iconStyle="fab" size="lg" />
            </MDBBtn>
            <MDBBtn outline="dark" floating style="width:46px;height:46px" type="button">
                <MDBIcon icon="apple" iconStyle="fab" size="lg" />
            </MDBBtn>
        </div>

        <!-- Register Link -->
        <p class="small text-muted text-center mb-0">
            {{ $t('login.noAccount') }}
            <RouterLink to="/register" class="text-success fw-bold text-decoration-none ms-1">
                {{ $t('login.register') }}
            </RouterLink>
        </p>

    </LoginLayout>
</template>

<script setup lang="ts">
import { MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon, MDBCheckbox } from 'mdb-vue-ui-kit'
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import LoginLayout from '@/layouts/LoginLayout.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const form = reactive({ email: '', password: '', remember: false })
const showPassword = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    errorMessage.value = ''
    try {
        await authStore.login({ email: form.email, password: form.password, device_name: 'vue-app' })
    } catch {
        errorMessage.value = authStore.error ?? 'حدث خطأ، حاول مرة أخرى'
    }
}
</script>

<style scoped>
/* ── أيقونة Trailing (مطلوبة لأن MDB لا يوفرها افتراضياً) ── */
:deep(.form-icon-trailing .trailing) {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    transition: color 0.2s;
    font-size: 0.9rem;
}

/* ── لون Email/Password دائماً LTR (حتى في RTL) ── */
:deep(.form-outline input[type='email']),
:deep(.form-outline input[type='password']) {
    direction: ltr;
    text-align: left;
}

/* ── لون زر التسجيل (brand override) ── */
:deep(.brand-btn) {
    background-color: #1d7342 !important;
    border-color: #1d7342 !important;
    transition: background-color 0.2s, transform 0.15s, box-shadow 0.15s;
}

:deep(.brand-btn:hover:not(:disabled)) {
    background-color: #155e35 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(29, 115, 66, 0.35) !important;
}
</style>