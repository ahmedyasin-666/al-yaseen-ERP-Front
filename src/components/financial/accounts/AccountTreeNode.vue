<template>
  <!--
    ╔════════════════════════════════════════════════════════════╗
    ║  AccountTreeNode.vue — شجرة الحسابات المحاسبية            ║
    ║  تصميم احترافي مع عرض الأرصدة والتفرع الواضح             ║
    ╚════════════════════════════════════════════════════════════╝
  -->
  <div class="tree-node" :class="`depth-${node.depth}`">

    <!-- ══ صف الحساب ══ -->
    <div class="tree-row d-flex align-items-center gap-2" :class="[
      rowClass,
      { 'tree-row-active': node.status === 'active', 'tree-row-inactive': node.status === 'inactive' },
    ]" :style="rowStyle">
      <!-- ── خط الشجرة الرأسي + زر التوسيع ── -->
      <div class="tree-expand-area flex-shrink-0" :style="`width:${(node.depth * 22) + 4}px`">
        <!-- خطوط التوسيع -->
        <div v-if="node.depth > 0" class="tree-line-connector"></div>
      </div>

      <!-- زر Expand/Collapse -->
      <button v-if="node.is_parent && node.children_recursive?.length" class="tree-toggle-btn flex-shrink-0"
        :class="expanded ? 'expanded' : ''" @click.stop="expanded = !expanded">
        <i class="fas fa-chevron-right tree-chevron"></i>
      </button>
      <div v-else class="tree-leaf-dot flex-shrink-0">
        <span class="dot" :class="`dot-${node.type}`"></span>
      </div>

      <!-- أيقونة الحساب -->
      <div class="account-icon flex-shrink-0" :class="`icon-${node.type}`">
        <i class="fas" :class="node.is_parent ? 'fa-folder' : 'fa-file-invoice'"></i>
      </div>

      <!-- ── محتوى الصف ── -->
      <div class="tree-content flex-grow-1 d-flex align-items-center gap-2 overflow-hidden">

        <!-- الكود -->
        <span class="account-code font-monospace flex-shrink-0" :class="`code-${node.type}`">
          {{ node.code }}
        </span>

        <!-- الاسم -->
        <div class="account-name-wrap overflow-hidden flex-grow-1">
          <div class="account-name fw-semibold text-truncate" :class="node.is_parent ? 'fs-parent' : 'fs-leaf'">
            {{ getAccountName(node) }}
          </div>
          <div v-if="node.name_en && node.depth < 2" class="text-muted text-truncate"
            style="font-size:0.68rem;line-height:1.2;margin-top:1px;">
            {{ node.name_en }}
          </div>
        </div>

        <!-- Badges (مخفية على الموبايل الصغير) -->
        <div class="tree-badges d-none d-md-flex align-items-center gap-1 flex-shrink-0">

          <!-- نوع الحساب -->
          <span class="type-badge" :class="`type-${node.type}`">
            {{ shortTypeLabel(node.type) }}
          </span>

          <!-- نوع الترحيل -->
          <span v-if="node.allow_posting" class="posting-badge posting-yes">
            <i class="fas fa-check" style="font-size:7px;"></i>
          </span>
          <span v-else class="posting-badge posting-no">
            <i class="fas fa-layer-group" style="font-size:7px;"></i>
          </span>

          <!-- حساب نقدي/بنكي -->
          <span v-if="node.is_cash_account" class="tag-badge tag-cash">
            <i class="fas fa-money-bill-wave" style="font-size:8px;"></i>
          </span>
          <span v-if="node.is_bank_account" class="tag-badge tag-bank">
            <i class="fas fa-university" style="font-size:8px;"></i>
          </span>
        </div>
      </div>

      <!-- ── الرصيد (يظهر عند توفر السنة المالية) ── -->
      <div v-if="showBalance" class="balance-cell flex-shrink-0 text-end">
        <template v-if="node.balance !== null && node.balance !== undefined && node.balance > 0">
          <div class="balance-amount font-monospace"
            :class="node.balance_side === 'debit' ? 'balance-debit' : 'balance-credit'">
            {{ formatAmount(node.balance) }}
          </div>
          <div class="balance-side-label" :class="node.balance_side === 'debit' ? 'label-debit' : 'label-credit'">
            {{ langStore.lang === 'ar' ? (node.balance_side === 'debit' ? 'مدين' : 'دائن') : (node.balance_side ===
              'debit' ? 'Debit' : 'Credit') }}
          </div>
        </template>
        <span v-else class="balance-zero">—</span>
      </div>

      <!-- ── الحالة ── -->
      <div class="status-indicator flex-shrink-0">
        <span class="status-dot" :class="node.status === 'active' ? 'status-active' : 'status-inactive'"></span>
      </div>

      <!-- ── أزرار الإجراءات ── -->
      <div class="tree-actions flex-shrink-0 d-flex gap-1">
        <button class="action-btn btn-show" :title="$t('common.view')" @click.stop="emit('show', node)">
          <i class="fas fa-eye"></i>
        </button>
        <button v-if="!node.is_system" class="action-btn btn-edit" :title="$t('common.edit')"
          @click.stop="emit('edit', node)">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn" :class="node.status === 'active' ? 'btn-toggle-on' : 'btn-toggle-off'"
          :title="$t('accounts.toggleStatus')" @click.stop="emit('toggle', node)">
          <i class="fas fa-toggle-on"></i>
        </button>
        <button v-if="!node.is_system" class="action-btn btn-delete" :title="$t('common.delete')"
          @click.stop="emit('delete', node)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <!-- ══ الأبناء (recursive) ══ -->
    <Transition name="tree-expand">
      <div v-if="expanded && node.children_recursive?.length" class="tree-children">
        <AccountTreeNode v-for="child in node.children_recursive" :key="child.ulid" :node="child"
          :show-balance="showBalance" @edit="emit('edit', $event)" @show="emit('show', $event)"
          @delete="emit('delete', $event)" @toggle="emit('toggle', $event)" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Account } from '@/types/financial'
import { useLangStore } from '@/stores/langStore'
const langStore = useLangStore()

const props = defineProps<{
  node: Account
  showBalance: boolean
}>()

const emit = defineEmits<{
  edit: [acc: Account]
  show: [acc: Account]
  delete: [acc: Account]
  toggle: [acc: Account]
}>()

// الـ depth=0 يكون مفتوح افتراضياً، depth=1 كذلك، depth=2+ مغلق
const expanded = ref(props.node.depth <= 1)

// ── Row class حسب نوع الحساب والمستوى ──────────────────────────
const rowClass = computed(() => {
  const base = props.node.is_parent ? 'tree-row-parent' : 'tree-row-leaf'
  const depth = props.node.depth === 0 ? 'tree-row-root' : ''
  return [base, depth]
})

const rowStyle = computed(() => ({
  paddingInlineStart: `${props.node.depth * 4 + 8}px`,
  paddingInlineEnd: '8px',
}))

// ── Helpers ──────────────────────────────────────────────────────
function shortTypeLabel(type: string): string {
  // const m: Record<string, string> = {
  //   asset: 'أصل',
  //   liability: 'خصم',
  //   equity: 'ملكية',
  //   revenue: 'إيراد',
  //   expense: 'مصروف',
  // }

  const labels: Record<string, { ar: string; en: string }> = {
    asset: { ar: 'أصل', en: 'Asset' },
    liability: { ar: 'خصم', en: 'Liability' },
    equity: { ar: 'ملكية', en: 'Equity' },
    revenue: { ar: 'إيراد', en: 'Revenue' },
    expense: { ar: 'مصروف', en: 'Expense' },
  }

  const label = labels[type] || { ar: type, en: type }
  return langStore.lang === 'ar' ? label.ar : label.en
}

function getAccountName(acc: any) {
  return langStore.lang === 'ar'
    ? acc.name
    : (acc.name_en || acc.name)
}


function formatAmount(val: number | null | undefined): string {
  if (val === null || val === undefined) return '—'
  return (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped>
/* ════════════════════════════════════════════════════════════════
   المتغيرات اللونية للأنواع
════════════════════════════════════════════════════════════════ */
.tree-node {
  position: relative;
}

/* ══ صف الحساب ══ */
.tree-row {
  position: relative;
  min-height: 44px;
  padding-top: 6px;
  padding-bottom: 6px;
  border-radius: 8px;
  margin-bottom: 2px;
  cursor: default;
  transition: background .15s, box-shadow .15s;
  border: 1px solid transparent;
}

.tree-row:hover {
  background: #f0f4f8 !important;
  border-color: #dce5f0;
}

/* ── صف الجذر ── */
.tree-row-root {
  background: #f8fafb;
  border-color: #e3e8ef !important;
  margin-bottom: 4px;
}

.tree-row-root:hover {
  background: #edf2f9 !important;
}

/* ── حساب تجميعي ── */
.tree-row-parent {
  background: #fafbfc;
}

/* ── حساب ورقي ── */
.tree-row-leaf {
  background: #ffffff;
}

/* ── غير نشط ── */
.tree-row-inactive {
  opacity: 0.6;
}

/* ══ خط توصيل الشجرة ══ */
.tree-expand-area {
  position: relative;
}

.tree-line-connector {
  position: absolute;
  top: 50%;
  right: 0;
  width: 14px;
  height: 1px;
  background: #cbd5e0;
}

[dir="rtl"] .tree-line-connector {
  right: auto;
  left: 0;
}

/* ══ زر التوسيع ══ */
.tree-toggle-btn {
  width: 20px;
  height: 20px;
  border: 1px solid #cbd5e0;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .2s;
  padding: 0;
  flex-shrink: 0;
}

.tree-toggle-btn:hover {
  background: #1d334f;
  border-color: #1d334f;
  color: #fff;
}

.tree-toggle-btn .tree-chevron {
  font-size: 8px;
  color: #64748b;
  transition: transform .25s cubic-bezier(.4, 0, .2, 1);
}

.tree-toggle-btn:hover .tree-chevron {
  color: #fff;
}

.tree-toggle-btn.expanded .tree-chevron {
  transform: rotate(90deg);
}

/* ══ نقطة الحساب الورقي ══ */
.tree-leaf-dot {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1.5px solid;
}

.dot-asset {
  background: #d1fae5;
  border-color: #10b981;
}

.dot-liability {
  background: #fee2e2;
  border-color: #ef4444;
}

.dot-equity {
  background: #fef3c7;
  border-color: #f59e0b;
}

.dot-revenue {
  background: #dbeafe;
  border-color: #3b82f6;
}

.dot-expense {
  background: #f3f4f6;
  border-color: #6b7280;
}

/* ══ أيقونة الحساب ══ */
.account-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.icon-asset {
  background: #d1fae5;
  color: #059669;
}

.icon-liability {
  background: #fee2e2;
  color: #dc2626;
}

.icon-equity {
  background: #fef3c7;
  color: #d97706;
}

.icon-revenue {
  background: #dbeafe;
  color: #2563eb;
}

.icon-expense {
  background: #f3f4f6;
  color: #6b7280;
}

/* الجذر يكون أيقونة أكبر */
.tree-row-root .account-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 14px;
}

/* ══ الكود ══ */
.account-code {
  font-size: 0.78rem;
  font-weight: 700;
  min-width: 60px;
  padding: 2px 7px;
  border-radius: 5px;
  letter-spacing: 0.02em;
}

.code-asset {
  background: #ecfdf5;
  color: #047857;
}

.code-liability {
  background: #fff1f2;
  color: #be123c;
}

.code-equity {
  background: #fffbeb;
  color: #92400e;
}

.code-revenue {
  background: #eff6ff;
  color: #1d4ed8;
}

.code-expense {
  background: #f8fafc;
  color: #475569;
}

/* ══ الاسم ══ */
.account-name {
  line-height: 1.2;
}

.fs-parent {
  font-size: 0.88rem;
  color: #1a2a3a;
}

.fs-leaf {
  font-size: 0.84rem;
  color: #334155;
}

.tree-row-root .fs-parent {
  font-size: 0.93rem;
  font-weight: 700 !important;
}

/* ══ Badges ══ */
.type-badge {
  font-size: 0.67rem;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 20px;
  white-space: nowrap;
}

.type-asset {
  background: #d1fae5;
  color: #065f46;
}

.type-liability {
  background: #fee2e2;
  color: #991b1b;
}

.type-equity {
  background: #fef3c7;
  color: #78350f;
}

.type-revenue {
  background: #dbeafe;
  color: #1e40af;
}

.type-expense {
  background: #f3f4f6;
  color: #374151;
}

.posting-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
}

.posting-yes {
  background: #d1fae5;
  color: #059669;
}

.posting-no {
  background: #fef3c7;
  color: #d97706;
}

.tag-badge {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-cash {
  background: #ecfdf5;
  color: #059669;
}

.tag-bank {
  background: #eff6ff;
  color: #2563eb;
}

/* ══ الرصيد ══ */
.balance-cell {
  min-width: 110px;
  padding: 0 4px;
}

.balance-amount {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.balance-debit {
  color: #2563eb;
}

.balance-credit {
  color: #059669;
}

.balance-side-label {
  font-size: 0.62rem;
  font-weight: 600;
  margin-top: 1px;
}

.label-debit {
  color: #93c5fd;
}

.label-credit {
  color: #6ee7b7;
}

.balance-zero {
  color: #d1d5db;
  font-size: 0.8rem;
}

/* الرصيد في الجذر يكون أكبر */
.tree-row-root .balance-amount {
  font-size: 0.92rem;
}

/* ══ مؤشر الحالة ══ */
.status-indicator {
  width: 14px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
}

.status-active {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, .2);
}

.status-inactive {
  background: #d1d5db;
}

/* ══ أزرار الإجراءات ══ */
.tree-actions {
  gap: 3px;
  opacity: 0;
  transition: opacity .2s;
}

.tree-row:hover .tree-actions {
  opacity: 1;
}

.action-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 11px;
  transition: all .15s;
  color: #94a3b8;
}

.btn-show:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

.btn-edit:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #1e293b;
}

.btn-toggle-on:hover {
  background: #ecfdf5;
  border-color: #bbf7d0;
  color: #059669;
}

.btn-toggle-off {
  color: #94a3b8;
}

.btn-toggle-off:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #475569;
}

.btn-delete:hover {
  background: #fff1f2;
  border-color: #fecdd3;
  color: #be123c;
}

/* ══ الأبناء ══ */
.tree-children {
  margin-inline-start: 0;
  border-inline-start: 1.5px dashed #e2e8f0;
  margin-inline-start: 18px;
  padding-inline-start: 4px;
}

/* ══ الانتقال ══ */
.tree-expand-enter-active {
  transition: all .22s cubic-bezier(.4, 0, .2, 1);
}

.tree-expand-leave-active {
  transition: all .18s cubic-bezier(.4, 0, .2, 1);
}

.tree-expand-enter-from,
.tree-expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  max-height: 0;
  overflow: hidden;
}

.tree-expand-enter-to,
.tree-expand-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 9999px;
}

/* ══ Responsive ══ */
@media (max-width: 640px) {
  .balance-cell {
    min-width: 80px;
  }

  .account-code {
    min-width: 48px;
    font-size: 0.72rem;
  }

  .tree-actions {
    opacity: 1;
  }
}
</style>