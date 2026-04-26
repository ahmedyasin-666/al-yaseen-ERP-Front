<template>
  <Teleport to="body">
    <!-- top-0 end-0: Bootstrap يعكسه تلقائياً في RTL → يصبح يسار الشاشة -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index:9999;">
      <Transition enter-active-class="animate__animated animate__fadeInRight animate__faster"
        leave-active-class="animate__animated animate__fadeOutRight animate__faster">

        <div v-if="visible" class="custom-toast shadow-lg" :class="`toast-${toastType}`" role="alert"
          aria-live="assertive">

          <div class="d-flex align-items-center gap-3 p-3">

            <!-- Icon -->
            <div class="toast-icon-wrap flex-shrink-0">
              <i :class="`fas fa-${toastIcon} text-white`"></i>
            </div>

            <!-- Message -->
            <div class="toast-message flex-grow-1 fw-semibold small">{{ toastMessage }}</div>

            <!-- Close -->
            <button type="button" class="toast-close-btn flex-shrink-0" @click="visible = false">
              <i class="fas fa-times"></i>
            </button>

          </div>

          <!-- Progress bar — inset-inline-start بدلاً من left لدعم RTL -->
          <div class="toast-progress-bar" :style="{ animationDuration: duration + 'ms' }" />

        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const visible = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const duration = ref(4000)

const toastIcon = computed(() => ({
  success: 'check-circle',
  danger: 'exclamation-circle',
  warning: 'exclamation-triangle',
  info: 'info-circle',
}[toastType.value] ?? 'info-circle'))

let timer: ReturnType<typeof setTimeout>

function show(message: string, type = 'success', ms = 4000) {
  clearTimeout(timer)
  toastMessage.value = message
  toastType.value = type
  duration.value = ms
  visible.value = true
  timer = setTimeout(() => { visible.value = false }, ms)
}

defineExpose({ show })
</script>

<style scoped>
.custom-toast {
  min-width: 280px;
  max-width: 360px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid transparent;
  background: #fff;
}

/* ── Types ── */
.toast-success {
  border-color: #c3e6d0;
}

.toast-success .toast-icon-wrap {
  background: #198754;
}

.toast-success .toast-progress-bar {
  background: #198754;
}

.toast-danger {
  border-color: #f5c2c7;
}

.toast-danger .toast-icon-wrap {
  background: #dc3545;
}

.toast-danger .toast-progress-bar {
  background: #dc3545;
}

.toast-warning {
  border-color: #ffe69c;
}

.toast-warning .toast-icon-wrap {
  background: #cc9a00;
}

.toast-warning .toast-progress-bar {
  background: #ffc107;
}

.toast-info {
  border-color: #b6d4fe;
}

.toast-info .toast-icon-wrap {
  background: #0d6efd;
}

.toast-info .toast-progress-bar {
  background: #0d6efd;
}

/* ── Icon ── */
.toast-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

/* ── Close ── */
.toast-close-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 0.8rem;
}

.toast-close-btn:hover {
  background: #f0f0f0;
}

/* ── Progress Bar ── */
.toast-progress-bar {
  position: absolute;
  bottom: 0;
  /* inset-inline-start يدعم RTL/LTR تلقائياً */
  inset-inline-start: 0;
  height: 3px;
  width: 100%;
  transform-origin: left;
  /* LTR */
  animation: shrink-ltr linear forwards;
  border-radius: 0 0 12px 12px;
}

/* RTL: اعكس اتجاه الانكماش */
[dir="rtl"] .toast-progress-bar {
  transform-origin: right;
  animation-name: shrink-rtl;
}

@keyframes shrink-ltr {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}

@keyframes shrink-rtl {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}
</style>