<template>
    <MDBModal v-model="isOpen" tabindex="-1" centered size="lg">
        <MDBModalHeader class="border-0 pb-0" style="padding:1.5rem 1.5rem 1rem;">
            <div class="d-flex align-items-center gap-3">
                <div
                    style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#1d334f,#1d7342);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">
                    <i class="fas fa-file-invoice"></i>
                </div>
                <div>
                    <MDBModalTitle class="fw-bold mb-0">{{ $t('accounts.details') }}</MDBModalTitle>
                    <p class="text-muted small mb-0 mt-1" v-if="account">
                        {{ account.code }} — {{ account.name }}
                    </p>
                </div>
            </div>
        </MDBModalHeader>

        <MDBModalBody class="px-4 pt-3 pb-2" v-if="account">
            <!-- Status Banner -->
            <div class="rounded-3 p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2"
                :class="account.status === 'active' ? 'bg-success bg-opacity-10 border border-1' : 'bg-danger bg-opacity-10 border border-1'"
                :style="account.status === 'active' ? 'border-color:#c3e6d0!important' : 'border-color:#f5c2c7!important'">
                <div>
                    <span class="badge rounded-pill px-3 py-2 me-2" :class="typeClass(account.type)">{{ account.type
                        }}</span>
                    <span class="badge rounded-pill px-3 py-2"
                        :class="account.allow_posting ? 'bg-primary bg-opacity-10 text-primary' : 'bg-warning bg-opacity-10 text-warning'">
                        {{ account.allow_posting ? $t('accounts.postable') : $t('accounts.grouping') }}
                    </span>
                </div>
                <span class="fw-bold">{{ account.normal_balance_side === 'debit' ? $t('accounts.debit') :
                    $t('accounts.credit') }}</span>
            </div>

            <!-- Info Grid -->
            <MDBRow class="g-3">
                <MDBCol md="4" v-for="info in infoItems" :key="info.label">
                    <div class="p-3 rounded-3 border bg-light">
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <i :class="`fas fa-${info.icon} text-primary`" style="font-size:.75rem;"></i>
                            <small class="text-muted">{{ info.label }}</small>
                        </div>
                        <div class="fw-semibold small" :class="info.mono ? 'font-monospace' : ''">
                            {{ info.value || '—' }}
                        </div>
                    </div>
                </MDBCol>
            </MDBRow>

            <div v-if="account.notes" class="mt-3 p-3 rounded-3 d-flex gap-2"
                style="background:#fffef0;border:1px solid #fde8a1;">
                <i class="fas fa-sticky-note text-warning mt-1 flex-shrink-0"></i>
                <small>{{ account.notes }}</small>
            </div>
        </MDBModalBody>

        <MDBModalFooter class="border-0 px-4 pt-0 pb-4">
            <button class="btn btn-outline-secondary btn-sm px-4" @click="isOpen = false">
                {{ $t('common.close') }}
            </button>
        </MDBModalFooter>
    </MDBModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBRow, MDBCol } from 'mdb-vue-ui-kit'
import type { Account } from '@/types/financial'

const props = defineProps<{ show: boolean; account: Account | null }>()
const emit = defineEmits<{ 'update:show': [v: boolean] }>()
const { t } = useI18n()
const isOpen = computed({ get: () => props.show, set: v => emit('update:show', v) })

const infoItems = computed(() => {
    if (!props.account) return []
    const a = props.account
    return [
        { icon: 'hashtag', label: t('accounts.code'), value: a.code, mono: true },
        { icon: 'tag', label: t('accounts.type'), value: t(`accounts.types.${a.type}`), mono: false },
        { icon: 'layer-group', label: t('accounts.depth'), value: String(a.depth), mono: true },
        { icon: 'coins', label: t('accounts.openingBalance'), value: `${a.opening_balance} (${a.opening_balance_side})`, mono: true },
        { icon: 'calendar', label: t('accounts.openingBalanceDate'), value: a.opening_balance_date ?? '—', mono: true },
        { icon: 'level-up-alt', label: t('accounts.parentAccount'), value: a.parent ? `${a.parent.code} — ${a.parent.name}` : '—', mono: false },
    ]
})

function typeClass(type: string) {
    const m: Record<string, string> = {
        asset: 'bg-success bg-opacity-10 text-success',
        liability: 'bg-danger bg-opacity-10 text-danger',
        equity: 'bg-warning bg-opacity-10 text-warning',
        revenue: 'bg-info bg-opacity-10 text-info',
        expense: 'bg-secondary bg-opacity-10 text-secondary',
    }
    return m[type] ?? 'bg-light text-dark'
}
</script>