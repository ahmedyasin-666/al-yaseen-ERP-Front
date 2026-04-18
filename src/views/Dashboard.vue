<template>
    <section class="container-fluid p-5">

        <!-- Page Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold mb-0">📊 Dashboard Overview</h3>
            <MDBBtn color="primary" size="sm" @click="refreshData">
                <i class="fas fa-sync-alt me-2"></i> Refresh
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
                        <i class="fas fa-history me-2 text-primary"></i> Recent Activity
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

const statsCards = ref([
    { title: 'Users', value: 1245, icon: 'fas fa-users', color: 'primary', subtitle: 'Total Active' },
    { title: 'Companies', value: 87, icon: 'far fa-building', color: 'success', subtitle: 'Registered' },
    { title: 'Revenue', value: '$52K', icon: 'fas fa-dollar-sign', color: 'warning', subtitle: 'This Month' },
    { title: 'Errors', value: 3, icon: 'fas fa-exclamation-circle', color: 'danger', subtitle: 'System Alerts' },
])

const activities = ref([
    { text: 'New user registered', time: '2 mins ago' },
    { text: 'Company profile updated', time: '10 mins ago' },
    { text: 'System backup completed', time: '1 hr ago' },
    { text: 'New branch created', time: '3 hrs ago' },
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
