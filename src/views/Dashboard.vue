<template>
    <section class="container-fluid p-5">

        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold mb-0">{{ $t('dashboard.title') }}</h3>
            <MDBBtn color="primary" size="sm" @click="refreshData">
                <i class="fas fa-sync-alt me-2"></i> {{ $t('common.refresh') }}
            </MDBBtn>
        </div>

        <!-- Statistics Cards -->
        <div class="row g-4">
            <div class="col-md-6 col-lg-3" v-for="card in statsCards" :key="card.title">
                <MDBCard class="shadow-2">
                    <MDBCardBody class="text-center py-4">
                        <i :class="`${card.icon} fa-2x mb-3 text-${card.color}`"></i>
                        <h5 class="fw-bold mb-2">{{ card.title }}</h5>
                        <h3 class="fw-bold">{{ card.value }}</h3>
                        <p class="text-muted mb-0">{{ card.subtitle }}</p>
                    </MDBCardBody>
                </MDBCard>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="mt-5">
            <MDBCard>
                <MDBCardBody>
                    <h5 class="fw-bold mb-3">
                        <i class="fas fa-history me-2 text-primary"></i> {{ $t('dashboard.recentActivity') }}
                    </h5>

                    <ul class="list-group list-group-flush">
                        <li v-for="(activity, index) in activities" :key="index"
                            class="list-group-item d-flex justify-content-between align-items-center">
                            <span>{{ activity.text }}</span>
                            <small class="text-muted">{{ activity.time }}</small>
                        </li>
                    </ul>
                </MDBCardBody>
            </MDBCard>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MDBCard, MDBCardBody, MDBBtn } from 'mdb-vue-ui-kit'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const statsCards = ref([
    { title: t('dashboard.cards.totalUsers'), value: 1245, icon: 'fas fa-users', color: 'primary', subtitle: t('dashboard.cards.totalUsersSub') },
    { title: t('dashboard.cards.totalCompanies'), value: 87, icon: 'far fa-building', color: 'success', subtitle: t('dashboard.cards.totalCompaniesSub') },
    { title: t('dashboard.cards.totalRevenue'), value: '$52K', icon: 'fas fa-dollar-sign', color: 'warning', subtitle: t('dashboard.cards.totalRevenueSub') },
    { title: t('dashboard.cards.totalErrors'), value: 3, icon: 'fas fa-exclamation-circle', color: 'danger', subtitle: t('dashboard.cards.totalErrorsSub') },
])

const activities = ref([
    { text: t('dashboard.activities.userRegistered'), time: t('dashboard.activities.times.twoMins') },
    { text: t('dashboard.activities.companyUpdated'), time: t('dashboard.activities.times.tenMins') },
    { text: t('dashboard.activities.backupCompleted'), time: t('dashboard.activities.times.oneHour') },
    { text: t('dashboard.activities.branchCreated'), time: t('dashboard.activities.times.threeHours') },
])

const refreshData = () => {
    console.log('Refreshing dashboard data...')
}
</script>

<style scoped>
h3,
h5 {
    font-family: 'Cairo', sans-serif;
}

.list-group-item {
    font-size: 15px;
}
</style>
