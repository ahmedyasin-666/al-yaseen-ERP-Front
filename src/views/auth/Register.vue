<template>
    <LoginLayout>

        <!-- Logo + Title -->
        <div class="text-center mb-4">
            <img src="@/assets/images/logo-brand.png" alt="Logo" width="110" class="mb-3" />
            <h5 class="fw-bold text-dark mb-1">{{ $t('register.title') }}</h5>
            <p class="text-muted small mb-0">{{ $t('register.subtitle') }}</p>
        </div>

        <!-- Register Form -->
        <MDBRow tag="form" @submit.prevent="handleRegister" class="text-start g-3">

            <!-- First Name -->
            <MDBCol md="6" cols="12">
                <div>
                    <MDBInput v-model="form.firstName" :label="$t('register.firstName')" type="text" outline size="lg"
                        class="form-icon-trailing">
                        <MDBIcon icon="user" class="trailing text-muted" />
                    </MDBInput>
                </div>
            </MDBCol>

            <!-- Last Name -->
            <MDBCol md="6" cols="12">
                <div>
                    <MDBInput v-model="form.lastName" :label="$t('register.lastName')" type="text" outline size="lg"
                        class="form-icon-trailing">
                        <MDBIcon icon="user" class="trailing text-muted" />
                    </MDBInput>
                </div>
            </MDBCol>

            <!-- Email -->
            <MDBCol md="12">
                <div>
                    <MDBInput v-model="form.email" :label="$t('register.email')" type="email" outline size="lg"
                        class="form-icon-trailing">
                        <MDBIcon icon="envelope" class="trailing text-muted" />
                    </MDBInput>
                </div>
            </MDBCol>

            <!-- Phone — يبقى LTR لأن أرقام الهاتف دائماً LTR -->
            <MDBCol md="12">
                <div class="d-flex gap-2 align-items-start" dir="ltr">
                    <!-- Country code selector -->
                    <MDBSelect v-model="form.country" :options="countries" height="44.63px" width="200px" filter
                        class="flex-shrink-0" />
                    <!-- Phone number -->
                    <div class="flex-grow-1" dir="rtl">
                        <MDBInput v-model="form.phone" :label="$t('register.phone')" type="tel" outline size="lg"
                            class="form-icon-trailing">
                            <MDBIcon icon="phone" class="trailing text-muted" />
                        </MDBInput>
                    </div>
                </div>
            </MDBCol>

            <!-- Password -->
            <MDBCol md="12">
                <div>
                    <MDBInput v-model="form.password" :label="$t('register.password')"
                        :type="showPassword ? 'text' : 'password'" outline size="lg" class="form-icon-trailing">
                        <MDBIcon :icon="showPassword ? 'eye-slash' : 'eye'" class="trailing text-muted"
                            style="cursor:pointer" @click="showPassword = !showPassword" />
                    </MDBInput>
                </div>
            </MDBCol>

            <!-- Confirm Password -->
            <MDBCol md="12">
                <div>
                    <MDBInput v-model="form.password_confirmation" :label="$t('register.passwordConfirm')"
                        :type="showConfirm ? 'text' : 'password'" outline size="lg" class="form-icon-trailing">
                        <MDBIcon :icon="showConfirm ? 'eye-slash' : 'eye'" class="trailing text-muted"
                            style="cursor:pointer" @click="showConfirm = !showConfirm" />
                    </MDBInput>
                </div>
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
                <div class="d-grid col-12 col-sm-9 mx-auto">
                    <MDBBtn type="submit" color="success" size="lg" class="fw-bold rounded-3 brand-btn"
                        :disabled="authStore.isLoading">
                        <span v-if="authStore.isLoading" class="d-flex align-items-center justify-content-center gap-2">
                            <i class="fas fa-spinner fa-spin"></i>
                            {{ $t('register.signingUp') }}
                        </span>
                        <span v-else>{{ $t('register.signUp') }}</span>
                    </MDBBtn>
                </div>
            </MDBCol>

        </MDBRow>

        <!-- Divider -->
        <div class="d-flex align-items-center my-3">
            <hr class="flex-grow-1 border-secondary-subtle" />
            <span class="mx-3 text-muted small">{{ $t('register.or') }}</span>
            <hr class="flex-grow-1 border-secondary-subtle" />
        </div>

        <!-- Social -->
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

        <!-- Login Link -->
        <p class="small text-muted text-center mb-0">
            {{ $t('register.alreadyHaveAccount') }}
            <RouterLink to="/login" class="text-success fw-bold text-decoration-none ms-1">
                {{ $t('register.login') }}
            </RouterLink>
        </p>

    </LoginLayout>
</template>

<script setup lang="ts">
import { MDBRow, MDBCol, MDBInput, MDBBtn, MDBIcon } from 'mdb-vue-ui-kit'
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import LoginLayout from '@/layouts/LoginLayout.vue'
import MDBSelect from '@/components/MDBSelect.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

const form = reactive({
    firstName: '', lastName: '', email: '',
    country: '+970', phone: '',
    password: '', password_confirmation: '',
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
/* ── أيقونة Trailing (مطلوبة لأن MDB لا يوفرها افتراضياً) ── */
:deep(.form-icon-trailing .trailing) {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    transition: color 0.2s;
    font-size: 0.9rem;
}

/* ── لون Email/Password/Tel دائماً LTR ── */
:deep(.form-outline input[type='email']),
:deep(.form-outline input[type='password']),
:deep(.form-outline input[type='tel']) {
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