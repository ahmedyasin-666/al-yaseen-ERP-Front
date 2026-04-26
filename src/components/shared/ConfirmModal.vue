<!-- ================================================================
     ConfirmModal.vue  ·  src/components/shared/ConfirmModal.vue
================================================================ -->
<template>
  <MDBModal v-model="isOpen" tabindex="-1" centered>

    <MDBModalHeader class="confirm-header border-0 pb-0">
      <div class="d-flex align-items-center gap-3">
        <div class="confirm-icon-badge" :class="`badge-${type}`">
          <i :class="`fas fa-${icon}`"></i>
        </div>
        <MDBModalTitle class="fw-bold mb-0">{{ title }}</MDBModalTitle>
      </div>
    </MDBModalHeader>

    <MDBModalBody class="px-4 pt-3 pb-2">
      <!-- Alert strip — مطابق للباك اند -->
      <div v-if="type === 'danger'" class="alert alert-danger py-2 mb-3 d-flex align-items-center gap-2">
        <i class="fas fa-exclamation-triangle flex-shrink-0"></i>
        <strong>{{ t('common.actionCannotBeUndone') }}</strong>
      </div>
      <p class="mb-0 text-muted">{{ message }}</p>
    </MDBModalBody>

    <MDBModalFooter class="border-0 px-4 pt-2 pb-4 gap-2">
      <button class="btn btn-secondary btn-sm px-4" @click="isOpen = false" :disabled="loading">
        {{ t('common.cancel') }}
      </button>
      <button class="btn btn-sm px-4 fw-semibold" :class="`btn-${type}`" @click="emit('confirm')" :disabled="loading">
        <span v-if="loading" class="d-flex align-items-center gap-2">
          <span class="spinner-border spinner-border-sm"></span>
          {{ t('common.processing') }}
        </span>
        <span v-else class="d-flex align-items-center gap-1">
          <i :class="`fas fa-${icon}`"></i>
          {{ confirmLabel }}
        </span>
      </button>
    </MDBModalFooter>

  </MDBModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter } from 'mdb-vue-ui-kit'

const props = defineProps<{
  show: boolean
  type: string
  icon: string
  title: string
  message: string
  confirmLabel: string
  loading: boolean
}>()

const emit = defineEmits<{ 'update:show': [v: boolean]; confirm: [] }>()
const { t } = useI18n()
const isOpen = computed({ get: () => props.show, set: v => emit('update:show', v) })
</script>

<style scoped>
.confirm-header {
  padding: 1.5rem 1.5rem 1rem;
}

.confirm-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.badge-danger {
  background: rgba(220, 53, 69, 0.12);
  color: #dc3545;
}

.badge-warning {
  background: rgba(255, 193, 7, 0.15);
  color: #cc9a00;
}

.badge-success {
  background: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.badge-primary {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.badge-info {
  background: rgba(13, 202, 240, 0.1);
  color: #0dcaf0;
}
</style>