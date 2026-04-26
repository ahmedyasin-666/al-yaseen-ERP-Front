<template>
    <MDBNavbar expand="lg" container class="shadow-lg custom-navbar">
        <div class="container d-flex justify-content-between align-items-center w-100 gap-2">

            <!-- ── Left: Toggle + Logo ── -->
            <div class="d-flex align-items-center gap-3 flex-shrink-0">
                <i class="fas" :class="toggleIcon" @click="$emit('toggleSidebar')"
                    style="cursor:pointer;font-size:1.2rem;color:#fff;" />

                <MDBNavbarBrand href="#" class="text-light d-flex align-items-center gap-2 mb-0">
                    <img :src="authStore.user?.company?.logo || logo" alt="Logo" class="navbar-logo" />
                    <span class="fw-bold d-none d-md-inline">
                        {{ authStore.user?.company?.title }}
                    </span>
                </MDBNavbarBrand>
            </div>

            <!-- ── Right: Lang + User ── -->
            <div class="d-flex align-items-center gap-3 flex-shrink-0">

                <!-- Lang -->
                <button class="nav-icon-btn" @click="toggleLang"
                    :title="langStore.lang === 'ar' ? 'English' : 'العربية'">
                    <i class="fas fa-language" />
                </button>

                <!-- User Dropdown -->
                <MDBDropdown v-model="userDropdownOpen">
                    <MDBDropdownToggle tag="a"
                        class="nav-link d-flex align-items-center gap-2 p-0 hidden-arrow text-white"
                        @click="userDropdownOpen = !userDropdownOpen">
                        <img :src="authStore.avatar || 'https://ui-avatars.com/api/?background=1d334f&color=fff&name=U'"
                            class="rounded-circle user-avatar" alt="Avatar" />
                        <div class="d-none d-md-flex flex-column text-start" style="line-height:1.2;">
                            <span style="font-size:0.8rem;font-weight:600;">{{ authStore.fullName }}</span>
                            <span style="font-size:0.68rem;opacity:0.75;">{{ authStore.user?.company?.title }}</span>
                        </div>
                    </MDBDropdownToggle>

                    <MDBDropdownMenu class="dropdown-menu-dark mt-2">
                        <MDBDropdownItem tag="router-link" :to="{ name: 'Profile' }" :class="textAlignClass">
                            <i class="fas fa-user me-2" />{{ $t('navbar.profile') }}
                        </MDBDropdownItem>
                        <MDBDropdownItem tag="router-link" :to="{ name: 'Settings' }" :class="textAlignClass">
                            <i class="fas fa-cog me-2" />{{ $t('navbar.settings') }}
                        </MDBDropdownItem>
                        <li>
                            <hr class="dropdown-divider border-secondary" />
                        </li>
                        <MDBDropdownItem href="#" @click="handleLogout" :class="textAlignClass"
                            class="text-danger-emphasis">
                            <i class="fas fa-sign-out-alt me-2" />{{ $t('navbar.logout') }}
                        </MDBDropdownItem>
                    </MDBDropdownMenu>
                </MDBDropdown>

            </div>
        </div>
    </MDBNavbar>
</template>

<script setup lang="ts">
import {
    MDBNavbar, MDBNavbarBrand,
    MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
} from 'mdb-vue-ui-kit'
import { useAuthStore } from '@/stores/authStore'
import { useLangStore } from '@/stores/langStore'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import logo from '@/assets/images/logo.png'

const props = defineProps<{ isSidebarOpen: boolean }>()
defineEmits<{ toggleSidebar: [] }>()

const authStore = useAuthStore()
const langStore = useLangStore()
const { locale } = useI18n()

const userDropdownOpen = ref(false)

function handleLogout() {
    authStore.logout()
}

function toggleLang() {
    const newLang = langStore.lang === 'ar' ? 'en' : 'ar'
    langStore.switchLang(newLang)
    locale.value = newLang
}

const toggleIcon = computed(() => {
    if (langStore.dir === 'rtl') {
        return props.isSidebarOpen ? 'fa-angle-double-right' : 'fa-angle-double-left'
    }
    return props.isSidebarOpen ? 'fa-angle-double-left' : 'fa-angle-double-right'
})

const textAlignClass = computed(() =>
    langStore.dir === 'rtl' ? 'text-end' : 'text-start'
)
</script>

<style scoped>
/* ── Navbar base ── */
.custom-navbar {
    background-color: #1d7342 !important;
    min-height: 56px;
    position: relative;
}

/* ── Logo ── */
.navbar-logo {
    height: 30px;
    width: auto;
    object-fit: contain;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    padding: 2px;
    background: rgba(255, 255, 255, 0.1);
}

/* ── User avatar ── */
.user-avatar {
    width: 32px;
    height: 32px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    object-fit: cover;
}

/* ── Lang button ── */
.nav-icon-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: #fff;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
    font-size: 0.95rem;
}

.nav-icon-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* ── User dropdown ── */
.dropdown-menu-dark {
    background-color: #145a35 !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-width: 180px;
}

.dropdown-menu-dark .dropdown-item {
    color: rgba(255, 255, 255, 0.85) !important;
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
    transition: background 0.15s;
}

.dropdown-menu-dark .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.08) !important;
}

.dropdown-menu-dark .dropdown-item.text-danger-emphasis {
    color: #fca5a5 !important;
}
</style>