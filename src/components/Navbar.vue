<template>
    <MDBNavbar expand="lg" container class="shadow-lg custom-navbar">
        <div class="container d-flex justify-content-between align-items-center w-100">

            <!-- Left: Sidebar Toggle + Logo -->
            <div class="d-flex align-items-center gap-3">
                <!-- Sidebar toggle -->
                <i class="fas" :class="toggleIcon" @click="$emit('toggleSidebar')"
                    style="cursor: pointer; font-size: 1.25rem; color: #fff;"></i>

                <MDBNavbarBrand href="#" class="text-light d-flex align-items-center gap-2">
                    <!-- <MDBIcon icon="mdb" iconStyle="fab" size="2x"></MDBIcon> -->
                    <img :src="authStore.user?.company?.logo || logo" alt="Logo" class="navbar-logo" />
                    <!-- <span class="fw-bold"> {{ $t('navbar.erpyassin') }}</span> -->
                    <span class="fw-bold"> {{ authStore.user?.company?.title }}</span>
                </MDBNavbarBrand>
            </div>

            <!-- Center: Icons -->
            <!-- <div class="d-flex align-items-center gap-3">
                <i class="fas fa-home icon-item"></i>
                <i class="fas fa-flag icon-item"></i>
                <i class="fas fa-video icon-item"></i>
                <i class="fas fa-shopping-bag icon-item"></i>
                <div class="position-relative">
                    <i class="fas fa-users icon-item"></i>
                    <span class="badge">2</span>
                </div>
            </div> -->

            <!-- Right: Language Selector + Avatar -->
            <div class="d-flex align-items-center gap-3">

                <!-- 🌐 Language Toggle Button -->
                <MDBBtn tag="a" color="link" class="nav-link d-flex align-items-center p-0 text-light hidden-arrow"
                    @click="toggleLang">
                    <i :class="[
                        'fas fs-5',
                        langStore.lang === 'ar' ? 'fa-language' : 'fa-font'
                    ]"></i>

                    <span :class="[
                        'fw-medium',
                        langStore.lang === 'en' ? 'ms-2' : 'me-2'
                    ]">
                        <!-- {{ langStore.lang === 'ar' ? 'English' : 'العربية' }} -->
                    </span>
                </MDBBtn>

                <!-- 👤 User Dropdown -->
                <MDBDropdown v-model="userDropdownOpen">

                    <MDBDropdownToggle tag="a" class="nav-link d-flex align-items-center p-0 hidden-arrow"
                        @click="userDropdownOpen = !userDropdownOpen">
                        <img :src="authStore.avatar || 'https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg'"
                            class="rounded-circle" height="28" alt="Avatar" />
                    </MDBDropdownToggle>

                    <MDBDropdownMenu class="dropdown-menu-dark">
                        <MDBDropdownItem tag="router-link" :to="{ name: 'Profile' }" :class="textAlignClass">
                            {{ $t("navbar.profile") }}
                        </MDBDropdownItem>

                        <MDBDropdownItem tag="router-link" :to="{ name: 'Settings' }" :class="textAlignClass">
                            {{ $t("navbar.settings") }}
                        </MDBDropdownItem>
                        <MDBDropdownItem href="#" @click="handleLogout" :class="textAlignClass">{{ $t("navbar.logout")
                            }}</MDBDropdownItem>
                    </MDBDropdownMenu>
                </MDBDropdown>
            </div>

        </div>
    </MDBNavbar>
</template>

<script setup lang="ts">
import {
    MDBNavbar,
    MDBNavbarBrand,
    // MDBIcon,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBBtn
} from "mdb-vue-ui-kit";
import { useAuthStore } from '@/stores/authStore';
import { ref, computed } from "vue";
import { useLangStore } from "@/stores/langStore";
import { useI18n } from "vue-i18n";
import logo from '@/assets/images/logo.png';

// Auth store
const authStore = useAuthStore()
const handleLogout = async () => {
    await authStore.logout()
}

const props = defineProps<{ isSidebarOpen: boolean }>();

// Dropdowns
const userDropdownOpen = ref(false);

// Lang store & i18n
const langStore = useLangStore();
const { locale } = useI18n();

const switchLanguage = (lang: "en" | "ar") => {
    langStore.switchLang(lang);
    locale.value = lang;
};

const toggleLang = () => {
    const newLang = langStore.lang === 'ar' ? 'en' : 'ar'
    switchLanguage(newLang)
}

const toggleIcon = computed(() => {
    if (langStore.dir === "rtl") {
        return props.isSidebarOpen ? "fa-angle-double-right" : "fa-angle-double-left";
    } else {
        return props.isSidebarOpen ? "fa-angle-double-left" : "fa-angle-double-right";
    }
});

const textAlignClass = computed(() => {
    return langStore.dir === "rtl" ? "text-end" : "text-start";
});

</script>

<style scoped>
.custom-navbar {
    background-color: #1D7342 !important;
    color: #fff;
}

/* Center icons */
.icon-item {
    color: #fff;
    font-size: 1.1rem;
    cursor: pointer;
    transition: color 0.2s;
}

.icon-item:hover {
    color: #A3E4B0;
}

/* Badge */
.badge {
    position: absolute;
    top: -5px;
    right: -8px;
    background-color: #ff3b3b;
    color: #fff;
    border-radius: 50%;
    font-size: 0.65rem;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Dropdown style */
.dropdown-menu-dark {
    background-color: #145A35 !important;
    color: #fff;
}

.dropdown-menu-dark .dropdown-item {
    color: #fff !important;
}

.dropdown-menu-dark .dropdown-item:hover {
    background-color: #0F4628 !important;
}

.dropdown-item.active {
    background-color: #0B3821 !important;
    color: #A3E4B0 !important;
}

.navbar-logo {
    height: 32px;
    width: auto;
    object-fit: contain;
    background-color: azure;
    border: 2px solid #fff;
    border-radius: 50%;
    padding: 2px;
}
</style>
