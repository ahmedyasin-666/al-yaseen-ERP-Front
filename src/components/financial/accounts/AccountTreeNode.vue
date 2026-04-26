<template>
  <div class="tree-node">
    <div class="tree-row d-flex align-items-center gap-2 py-2 px-3 rounded-3"
      :style="`padding-inline-start:${node.depth * 24 + 12}px`"
      :class="{ 'tree-row-parent': node.is_parent, 'tree-row-leaf': node.is_leaf }">

      <!-- Expand toggle -->
      <button v-if="node.is_parent && node.children_recursive?.length" class="btn btn-link p-0 text-muted tree-toggle"
        @click="expanded = !expanded">
        <i class="fas" :class="expanded ? 'fa-chevron-down' : 'fa-chevron-right'" style="font-size:10px;" />
      </button>
      <span v-else class="tree-indent" />

      <!-- Icon -->
      <i class="fas" :class="node.is_parent ? 'fa-folder text-warning' : 'fa-file-invoice text-primary'"
        style="font-size:13px;width:16px;" />

      <!-- Code -->
      <span class="font-monospace fw-bold text-primary small">{{ node.code }}</span>

      <!-- Name -->
      <span class="fw-semibold small flex-grow-1">{{ node.name }}</span>
      <span v-if="node.name_en" class="text-muted small d-none d-md-inline" style="font-size:0.72rem;">
        {{ node.name_en }}
      </span>

      <!-- Type badge -->
      <span class="badge rounded-pill px-2 small d-none d-md-inline" :class="typeClass(node.type)">
        {{ node.type }}
      </span>

      <!-- Normal side -->
      <span class="badge rounded-pill px-2 d-none d-lg-inline" :class="node.normal_balance_side === 'debit'
        ? 'bg-primary bg-opacity-10 text-primary'
        : 'bg-success bg-opacity-10 text-success'">
        {{ node.normal_balance_side }}
      </span>

      <!-- Posting badge -->
      <span v-if="node.allow_posting"
        class="badge rounded-pill px-2 bg-info bg-opacity-10 text-info d-none d-lg-inline">
        <i class="fas fa-check me-1" style="font-size:8px;" />posting
      </span>

      <!-- Status -->
      <span class="badge rounded-pill px-2" :class="node.status === 'active'
        ? 'bg-success bg-opacity-10 text-success'
        : 'bg-danger bg-opacity-10 text-danger'">
        <i class="fas fa-circle me-1" style="font-size:6px;" />{{ node.status }}
      </span>

      <!-- Actions -->
      <div class="d-flex gap-2 action-icons ms-1">
        <i class="fas fa-eye icon-action text-info" @click="emit('show', node)" />
        <i v-if="!node.is_system" class="fas fa-edit icon-action text-dark" @click="emit('edit', node)" />
        <i class="fas fa-toggle-on icon-action" :class="node.status === 'active' ? 'text-success' : 'text-secondary'"
          @click="emit('toggle', node)" />
        <i v-if="!node.is_system" class="fas fa-trash icon-action text-danger" @click="emit('delete', node)" />
      </div>
    </div>

    <!-- Children -->
    <Transition name="tree-slide">
      <div v-if="expanded && node.children_recursive?.length">
        <AccountTreeNode v-for="child in node.children_recursive" :key="child.ulid" :node="child"
          @edit="emit('edit', $event)" @show="emit('show', $event)" @delete="emit('delete', $event)"
          @toggle="emit('toggle', $event)" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Account } from '@/types/financial'

const props = defineProps<{ node: Account }>()
const emit = defineEmits<{
  edit: [acc: Account]
  show: [acc: Account]
  delete: [acc: Account]
  toggle: [acc: Account]
}>()

// الـ depth=0 يكون مفتوح افتراضياً
const expanded = ref(props.node.depth === 0)

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

<style scoped>
.tree-row {
  transition: background .15s;
  border: 1px solid transparent;
  margin-bottom: 2px;
}

.tree-row:hover {
  background: #f0f4f8 !important;
  border-color: #e2e8f0 !important;
}

.tree-row-parent {
  background: #fafbfc;
}

.tree-row-leaf {
  background: #fff;
}

.tree-toggle {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tree-indent {
  width: 20px;
  flex-shrink: 0;
}

.action-icons .icon-action {
  cursor: pointer;
  opacity: 0.7;
  font-size: 0.85rem;
  transition: all .2s;
}

.action-icons .icon-action:hover {
  opacity: 1;
  transform: scale(1.2);
}

.tree-slide-enter-active,
.tree-slide-leave-active {
  transition: all .2s ease;
  overflow: hidden;
}

.tree-slide-enter-from,
.tree-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.tree-slide-enter-to,
.tree-slide-leave-from {
  max-height: 9999px;
  opacity: 1;
}
</style>