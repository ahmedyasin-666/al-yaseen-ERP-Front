<template>
    <div :class="[
        'sidebar',
        { 'sidebar-closed': !isOpen },
        dir === 'rtl' ? 'sidebar-rtl' : 'sidebar-ltr',
    ]">
        <!-- Top: User info -->
        <div class="sidebar-user d-flex align-items-center px-3 py-4">
            <img :src="authStore.user?.company?.logo || logo" class="avatar"
                alt="Avatar" style="background-color: azure; border: 2px solid #fff;"  />
            <div :class="['user-info', dir === 'rtl' ? 'me-2' : 'ms-2']">
                <strong>{{ authStore.fullName || 'مستخدم' }}</strong>
                <div class="company-name">{{ authStore.user?.company?.title ?? 'بدون شركة' }}</div>
            </div>
        </div>

        <!-- Sidebar Menu -->
        <ul class="sidebar-menu">

            <li class="sidebar-item d-flex align-items-center gap-2">
                <i class="fas fa-tachometer-alt"></i>
                <span>{{ $t('sidebar.overview') }}</span>
            </li>

            <li class="sidebar-item" @click="toggleDropdown('users')">
                <div class="d-flex align-items-center justify-content-between">
                    <div><i class="fas fa-users"></i> {{ $t('sidebar.users') }}</div>
                    <i :class="dropdowns.users ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                </div>
                <ul v-show="dropdowns.users" class="sidebar-submenu">
                    <li class="sidebar-subitem"><i class="fas fa-user-plus"></i> {{ $t('sidebar.addUser') }}</li>
                    <li class="sidebar-subitem"><i class="fas fa-user-tag"></i> {{ $t('sidebar.roles') }}</li>
                </ul>
            </li>

            <li class="sidebar-item" @click="toggleDropdown('companies')">
                <div class="d-flex align-items-center justify-content-between">
                    <div><i class="fas fa-building"></i> {{ $t('sidebar.companies') }}</div>
                    <i :class="dropdowns.companies ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                </div>
                <ul v-show="dropdowns.companies" class="sidebar-submenu">
                    <li class="sidebar-subitem"><i class="fas fa-plus"></i> {{ $t('sidebar.addCompany') }}</li>
                    <li class="sidebar-subitem"><i class="fas fa-code-branch"></i> {{ $t('sidebar.branches') }}</li>
                </ul>
            </li>
        </ul>

        <!-- Footer -->
        <div class="sidebar-footer text-center py-3">
            <button class="btn btn-light btn-sm" @click="$emit('closeSidebar')">
                <i :class="dir === 'rtl' ? 'fas fa-angle-double-right' : 'fas fa-angle-double-left'"></i>
                {{ $t('sidebar.close') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { reactive } from "vue";
import logo from '@/assets/images/logo.png';

// Auth store
const authStore = useAuthStore()

// Sidebar props
const props = defineProps<{ isOpen: boolean; dir: "ltr" | "rtl" }>();

// Dropdowns
const dropdowns = reactive({
    users: false,
    companies: false,
    financial: false,
});

const toggleDropdown = (key: "users" | "companies" | "financial") => {
    dropdowns[key] = !dropdowns[key];
};
</script>

<style scoped>
.sidebar {
    width: 240px;
    background-color: #1d334f;
    color: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease;
    position: fixed;
    left: 0;
    top: 0;
    overflow-x: hidden;
    z-index: 1000;
}

.sidebar-ltr {
    left: 0;
    transform: translateX(0);
}

.sidebar-rtl {
    right: 0;
    transform: translateX(0);
}

.sidebar-closed {
    transform: translateX(-100%);
}

.sidebar-closed.sidebar-ltr {
    transform: translateX(-100%);
}

.sidebar-closed.sidebar-rtl {
    transform: translateX(100%);
}

.sidebar-user {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
    display: flex;
    flex-direction: column;
}

.company-name {
    font-size: 0.8rem;
    color: #c8d0e0;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.sidebar-menu {
    list-style: none;
    padding: 1rem 0;
    flex-grow: 1;
}

.sidebar-item {
    padding: 12px 20px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.sidebar-item:hover {
    background-color: #162236;
}

.sidebar-submenu {
    list-style: none;
    padding-left: 20px;
    margin-top: 0.5rem;
}

.sidebar-subitem {
    padding: 8px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    transition: background 0.2s;
}

.sidebar-subitem:hover {
    background-color: #0F1A2A;
    padding-left: 12px;
}

/* Footer Close Button */
.sidebar-footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-footer .btn {
    width: 80%;
}
</style>
