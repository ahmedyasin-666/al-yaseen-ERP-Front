<template>
    <!--
        MDBSelect — يعمل مع Bootstrap input-group بالكامل
        الاستخدام:
          <div class="input-group input-group-lg">
              <span class="input-group-text"><i class="fas fa-globe"></i></span>
              <MDBSelect v-model="val" :options="opts" label="الدولة" />
          </div>
    -->
    <div ref="wrapperRef" class="mdb-select-wrapper" :class="[sizeClass, { 'mdb-select--disabled': disabled }]"
        :style="widthStyle">

        <!-- ══ الحقل ══ -->
        <div ref="fieldRef" class="mdb-select-field form-control" :class="{
            'focused': isOpen,
            'has-value': hasValue,
            'is-valid': validState === 'valid',
            'is-invalid': validState === 'invalid',
        }" :tabindex="disabled ? -1 : 0" role="combobox" :aria-expanded="isOpen" aria-haspopup="listbox"
            @click="!disabled && toggleDropdown()" @keydown.enter.space.prevent="!disabled && toggleDropdown()"
            @keydown.esc="closeDropdown" @keydown.tab="closeDropdown"
            @keydown.down.prevent="!disabled && openDropdown()">

            <!-- Tags (multiple) -->
            <template v-if="multiple && selectedItems.length">
                <div class="mdb-tags-wrap">
                    <span v-for="item in selectedItems" :key="item.value" class="mdb-tag">
                        <span v-if="item.flag" class="mdb-tag-flag">{{ item.flag }}</span>
                        {{ item.text }}
                        <button class="mdb-tag-remove" type="button" tabindex="-1"
                            @click.stop="removeTag(item.value)">×</button>
                    </span>
                </div>
            </template>

            <!-- نص الاختيار (single) -->
            <span v-else class="mdb-display-text">{{ hasValue ? displayText : '' }}</span>

            <!-- Floating Label -->
            <label v-if="label" class="mdb-float-label"
                :class="{ active: hasValue || isOpen || (multiple && selectedItems.length > 0) }">
                {{ label }}
            </label>

            <!-- أيقونة الحالة -->
            <span v-if="validState === 'valid'" class="mdb-state-icon state-valid">
                <i class="fas fa-check" />
            </span>
            <span v-else-if="validState === 'invalid'" class="mdb-state-icon state-invalid">
                <i class="fas fa-exclamation-circle" />
            </span>

            <!-- السهم -->
            <span class="mdb-arrow" :class="{ open: isOpen }" />
        </div>

        <!-- Feedback -->
        <div v-if="validState === 'invalid' && feedback" class="invalid-feedback d-block">{{ feedback }}</div>
        <div v-else-if="validState === 'valid' && feedback" class="valid-feedback d-block">{{ feedback }}</div>

        <!-- ══ Dropdown — Teleport to body ══ -->
        <Teleport to="body">
            <Transition name="mdb-drop">
                <div v-if="isOpen" :id="dropId" class="mdb-dropdown" :style="dropStyle" :dir="dir">

                    <!-- بحث -->
                    <div v-if="filter" class="mdb-search-box">
                        <div class="mdb-search-inner">
                            <svg class="mdb-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input ref="searchRef" v-model="searchQuery" type="text" class="mdb-search-input"
                                :placeholder="searchPlaceholder" autocomplete="off" @keydown.esc="closeDropdown"
                                @keydown.down.prevent="focusOpt(0)" />
                            <button v-if="searchQuery" class="mdb-search-clear" type="button"
                                @click="searchQuery = ''">×</button>
                        </div>
                    </div>

                    <!-- تحديد الكل -->
                    <div v-if="multiple && filtered.length > 1" class="mdb-option mdb-option--all" @click="toggleAll">
                        <span class="mdb-checkbox" :class="{ checked: allSelected, indeterminate: someSelected }">
                            <svg v-if="allSelected" viewBox="0 0 12 10" fill="none" stroke="currentColor"
                                stroke-width="2.5">
                                <polyline points="1,5 4,9 11,1" />
                            </svg>
                            <svg v-else-if="someSelected" viewBox="0 0 12 4" fill="none" stroke="currentColor"
                                stroke-width="2.5">
                                <line x1="1" y1="2" x2="11" y2="2" />
                            </svg>
                        </span>
                        <span class="mdb-opt-text">{{ allSelected ? clearAllText : selectAllText }}</span>
                    </div>

                    <!-- الخيارات -->
                    <ul ref="listRef" class="mdb-opts" role="listbox" :aria-multiselectable="multiple">

                        <template v-if="grouped">
                            <template v-for="grp in groupedOpts" :key="grp.label">
                                <li class="mdb-opt-group">{{ grp.label }}</li>
                                <li v-for="(opt, i) in grp.options" :key="opt.value"
                                    :ref="(el) => setRef(el, globalIdx(grp, i))" class="mdb-option"
                                    :class="{ selected: isSelected(opt.value), disabled: opt.disabled }" role="option"
                                    :aria-selected="isSelected(opt.value)" tabindex="-1"
                                    @click="!opt.disabled && pick(opt)"
                                    @keydown.enter.space.prevent="!opt.disabled && pick(opt)"
                                    @keydown.down.prevent="focusOpt(globalIdx(grp, i) + 1)"
                                    @keydown.up.prevent="focusOpt(globalIdx(grp, i) - 1)">
                                    <span v-if="multiple" class="mdb-checkbox"
                                        :class="{ checked: isSelected(opt.value) }">
                                        <svg v-if="isSelected(opt.value)" viewBox="0 0 12 10" fill="none"
                                            stroke="currentColor" stroke-width="2.5">
                                            <polyline points="1,5 4,9 11,1" />
                                        </svg>
                                    </span>
                                    <span v-if="opt.flag" class="mdb-opt-flag">{{ opt.flag }}</span>
                                    <span class="mdb-opt-text">{{ opt.text }}
                                        <span v-if="opt.secondary" class="mdb-opt-sec">{{ opt.secondary }}</span>
                                    </span>
                                    <span v-if="!multiple && isSelected(opt.value)" class="mdb-check-mark">
                                        <svg viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="2.5">
                                            <polyline points="1,5 4,9 11,1" />
                                        </svg>
                                    </span>
                                </li>
                            </template>
                        </template>

                        <template v-else>
                            <li v-for="(opt, i) in filtered" :key="opt.value" :ref="(el) => setRef(el, i)"
                                class="mdb-option" :class="{ selected: isSelected(opt.value), disabled: opt.disabled }"
                                role="option" :aria-selected="isSelected(opt.value)" tabindex="-1"
                                @click="!opt.disabled && pick(opt)"
                                @keydown.enter.space.prevent="!opt.disabled && pick(opt)"
                                @keydown.down.prevent="focusOpt(i + 1)" @keydown.up.prevent="focusOpt(i - 1)">
                                <span v-if="multiple" class="mdb-checkbox" :class="{ checked: isSelected(opt.value) }">
                                    <svg v-if="isSelected(opt.value)" viewBox="0 0 12 10" fill="none"
                                        stroke="currentColor" stroke-width="2.5">
                                        <polyline points="1,5 4,9 11,1" />
                                    </svg>
                                </span>
                                <span v-if="opt.flag" class="mdb-opt-flag">{{ opt.flag }}</span>
                                <span class="mdb-opt-text">{{ opt.text }}
                                    <span v-if="opt.secondary" class="mdb-opt-sec">{{ opt.secondary }}</span>
                                </span>
                                <span v-if="!multiple && isSelected(opt.value)" class="mdb-check-mark">
                                    <svg viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <polyline points="1,5 4,9 11,1" />
                                    </svg>
                                </span>
                            </li>
                        </template>

                        <li v-if="filtered.length === 0" class="mdb-option mdb-option--empty">
                            {{ noResultsText }}
                        </li>
                    </ul>

                    <!-- Footer (multiple) -->
                    <div v-if="multiple && filtered.length" class="mdb-drop-footer">
                        <button class="mdb-foot-btn clear" type="button" @click="clearAll">{{ clearText }}</button>
                        <button class="mdb-foot-btn apply" type="button" @click="closeDropdown">{{ applyText }}</button>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import {
    ref, computed, nextTick, onUnmounted,
    type PropType, type ComponentPublicInstance,
} from 'vue'

// ── Types ───────────────────────────────────────────────────────────────────
export interface SelectOption {
    value: string | number
    text: string
    flag?: string
    secondary?: string
    disabled?: boolean
    group?: string
}

// ── Props ───────────────────────────────────────────────────────────────────
const props = defineProps({
    modelValue: {
        type: [String, Number, Array, null] as PropType<string | number | (string | number)[] | null>,
        default: null,
    },
    options: { type: Array as PropType<SelectOption[]>, default: () => [] },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    filter: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    size: { type: String as PropType<'sm' | 'default' | 'lg'>, default: 'default' },
    width: { type: String, default: '' },
    dir: { type: String as PropType<'ltr' | 'rtl'>, default: 'ltr' },
    validState: { type: String as PropType<'valid' | 'invalid' | ''>, default: '' },
    feedback: { type: String, default: '' },
    maxDropHeight: { type: String, default: '280px' },
    searchPlaceholder: { type: String, default: 'Search...' },
    noResultsText: { type: String, default: 'No results found' },
    selectAllText: { type: String, default: 'Select all' },
    clearAllText: { type: String, default: 'Clear all' },
    clearText: { type: String, default: 'Clear' },
    applyText: { type: String, default: 'Apply' },
})

const emit = defineEmits<{
    'update:modelValue': [value: string | number | (string | number)[] | null]
    'change': [value: string | number | (string | number)[] | null]
    'open': []
    'close': []
}>()

// ── Refs ────────────────────────────────────────────────────────────────────
const isOpen = ref(false)
const searchQuery = ref('')
const wrapperRef = ref<HTMLElement | null>(null)
const fieldRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const optRefs = ref<(HTMLElement | null)[]>([])
const dropId = `mdb-sel-${Math.random().toString(36).slice(2, 8)}`
const dropPos = ref({ top: 0, left: 0, width: 0 })

// ── Dropdown style (fixed) ───────────────────────────────────────────────
const dropStyle = computed(() => ({
    position: 'fixed' as const,
    top: `${dropPos.value.top}px`,
    left: `${dropPos.value.left}px`,
    width: `${dropPos.value.width}px`,
    '--mdb-drop-max-h': props.maxDropHeight,
    zIndex: '9999',
}))

const widthStyle = computed(() => props.width ? { width: props.width } : {})

function calcPos() {
    const r = wrapperRef.value?.getBoundingClientRect()
    if (r) dropPos.value = { top: r.bottom + 4, left: r.left, width: r.width }
}

function reposition() { if (isOpen.value) calcPos() }

// ── Click-outside ────────────────────────────────────────────────────────
function onOutside(e: MouseEvent) {
    const t = e.target as Node
    const portal = document.getElementById(dropId)
    if (!wrapperRef.value?.contains(t) && !portal?.contains(t)) closeDropdown()
}

// ── Open / Close ─────────────────────────────────────────────────────────
function openDropdown() {
    if (isOpen.value || props.disabled) return
    calcPos(); isOpen.value = true; emit('open')
    nextTick(() => {
        if (props.filter) searchRef.value?.focus()
        document.addEventListener('mousedown', onOutside)
        window.addEventListener('scroll', reposition, { passive: true })
        window.addEventListener('resize', reposition, { passive: true })
    })
}

function closeDropdown() {
    if (!isOpen.value) return
    isOpen.value = false; searchQuery.value = ''; emit('close')
    document.removeEventListener('mousedown', onOutside)
    window.removeEventListener('scroll', reposition)
    window.removeEventListener('resize', reposition)
    fieldRef.value?.focus()
}

function toggleDropdown() { isOpen.value ? closeDropdown() : openDropdown() }

onUnmounted(() => {
    document.removeEventListener('mousedown', onOutside)
    window.removeEventListener('scroll', reposition)
    window.removeEventListener('resize', reposition)
})

// ── Computed ─────────────────────────────────────────────────────────────
const sizeClass = computed(() => ({
    'mdb-select--sm': props.size === 'sm',
    'mdb-select--lg': props.size === 'lg',
}))

const hasValue = computed(() =>
    props.multiple
        ? Array.isArray(props.modelValue) && (props.modelValue as (string | number)[]).length > 0
        : props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
)

const selectedItems = computed(() => {
    if (!props.multiple || !Array.isArray(props.modelValue)) return []
    return (props.modelValue as (string | number)[])
        .map(v => props.options.find(o => o.value === v)).filter(Boolean) as SelectOption[]
})

const displayText = computed(() => {
    const o = props.options.find(o => o.value === props.modelValue)
    if (!o) return ''
    return [o.flag, o.text, o.secondary ? `(${o.secondary})` : ''].filter(Boolean).join(' ')
})

const filtered = computed(() => {
    if (!props.filter || !searchQuery.value.trim()) return props.options
    const q = searchQuery.value.toLowerCase()
    return props.options.filter(o =>
        o.text?.toLowerCase().includes(q) || o.secondary?.toLowerCase().includes(q) || o.flag?.includes(q)
    )
})

const grouped = computed(() => props.options.some(o => o.group))
const groupedOpts = computed(() => {
    if (!grouped.value) return []
    const map = new Map<string, SelectOption[]>()
    filtered.value.forEach(o => { const g = o.group ?? ''; if (!map.has(g)) map.set(g, []); map.get(g)!.push(o) })
    return [...map.entries()].map(([label, options]) => ({ label, options }))
})

function globalIdx(grp: { label: string; options: SelectOption[] }, local: number) {
    let i = 0
    for (const g of groupedOpts.value) { if (g.label === grp.label) return i + local; i += g.options.length }
    return local
}

const isSelected = (v: string | number) =>
    props.multiple && Array.isArray(props.modelValue)
        ? (props.modelValue as (string | number)[]).includes(v) : props.modelValue === v

const allSelected = computed(() => filtered.value.length > 0 && filtered.value.every(o => isSelected(o.value)))
const someSelected = computed(() => filtered.value.some(o => isSelected(o.value)) && !allSelected.value)

// ── Selection ─────────────────────────────────────────────────────────────
function pick(opt: SelectOption) {
    if (props.multiple) {
        const cur = (Array.isArray(props.modelValue) ? [...props.modelValue] : []) as (string | number)[]
        const i = cur.indexOf(opt.value as string | number)
        if (i >= 0) cur.splice(i, 1); else cur.push(opt.value as string | number)
        emit('update:modelValue', cur); emit('change', cur)
    } else {
        emit('update:modelValue', opt.value); emit('change', opt.value); closeDropdown()
    }
}

function removeTag(v: string | number) {
    const cur = (Array.isArray(props.modelValue) ? [...props.modelValue] : []) as (string | number)[]
    const i = cur.indexOf(v)
    if (i >= 0) { cur.splice(i, 1); emit('update:modelValue', cur); emit('change', cur) }
}

function toggleAll() {
    if (allSelected.value) { emit('update:modelValue', []); emit('change', []) }
    else {
        const vals = filtered.value.filter(o => !o.disabled).map(o => o.value) as (string | number)[]
        emit('update:modelValue', vals); emit('change', vals)
    }
}
function clearAll() { emit('update:modelValue', []); emit('change', []) }

// ── Keyboard ──────────────────────────────────────────────────────────────
const setRef = (el: Element | ComponentPublicInstance | null, i: number) => {
    if (el instanceof HTMLElement) optRefs.value[i] = el
}
function focusOpt(i: number) {
    const len = filtered.value.length
    if (len) optRefs.value[Math.max(0, Math.min(i, len - 1))]?.focus()
}
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════
   Design Tokens
══════════════════════════════════════════════════════════ */
.mdb-select-wrapper {
    --cp: #1d7342;
    /* primary */
    --cp-bg: #e8f5ee;
    --cp-md: #c3e6d0;
    --ce: #dc3545;
    /* error */
    --cs: #198754;
    /* success */
    --ct: #212121;
    /* text */
    --cb: #bdbdbd;
    /* border */
    --ci: #6c757d;
    /* icon / placeholder */

    /*
     * flex: 1 1 auto يجعل المكوّن يتصرف كـ form-control
     * داخل Bootstrap input-group ويملأ المساحة المتبقية
     */
    position: relative;
    display: block;
    flex: 1 1 auto;
    min-width: 0;
}

/* ══════════════════════════════════════════════════════════
   الحقل — form-control + floating label
══════════════════════════════════════════════════════════ */
.mdb-select-field.form-control {
    /* نعيد تعريف form-control ليكون flex container */
    display: flex !important;
    align-items: center;
    cursor: pointer;
    user-select: none;
    outline: none;
    position: relative;
    background: #fff;
    color: var(--ct);
    height: calc(2.645rem + 2px);

    /* padding علوي أكبر لمجال label الطائر */
    padding-top: 1.35rem;
    padding-bottom: 0.3rem;
    padding-inline-start: 0.75rem;
    padding-inline-end: 2.2rem;
    /* مسافة السهم */

    /* border: 1px solid var(--cb); */
    border-radius: 0;
    transition: border-color 0.15s, box-shadow 0.15s;
    line-height: 1.5;
}

[dir="rtl"] .mdb-select-field.form-control {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

[dir="ltr"] .mdb-select-field.form-control {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}

/* ── التوافق مع input-group (حدود مشتركة) ── */
/*
 * Bootstrap يستهدف .form-control مباشرةً داخل .input-group
 * الـ wrapper div منع ذلك، لذا نكرر المنطق هنا
 */
:global(.input-group)>.mdb-select-wrapper:not(:first-child) .mdb-select-field {
    border-start-start-radius: 0 !important;
    border-end-start-radius: 0 !important;
    margin-inline-start: -1px;
}

:global(.input-group)>.mdb-select-wrapper:not(:last-child) .mdb-select-field {
    border-start-end-radius: 0 !important;
    border-end-end-radius: 0 !important;
}

/* ── الحالات ── */
.mdb-select-field.focused {
    border-color: var(--cp);
    box-shadow: 0 0 0 0.15rem rgba(29, 115, 66, 0.2);
    z-index: 3;
}

.mdb-select-field.is-valid {
    border-color: var(--cs);
}

.mdb-select-field.is-invalid {
    border-color: var(--ce);
}

.mdb-select-field.is-valid.focused {
    box-shadow: 0 0 0 0.15rem rgba(25, 135, 84, 0.2);
}

.mdb-select-field.is-invalid.focused {
    box-shadow: 0 0 0 0.15rem rgba(220, 53, 69, 0.2);
}

.mdb-select--disabled .mdb-select-field {
    background: #e9ecef;
    opacity: 0.65;
    cursor: not-allowed;
    pointer-events: none;
}

/* ── حجم SM ── */
.mdb-select--sm .mdb-select-field.form-control {
    font-size: 0.875rem;
    padding-top: 1.05rem;
    padding-bottom: 0.15rem;
}

/* ── حجم LG ── */
.mdb-select--lg .mdb-select-field.form-control {
    font-size: 1.05rem;
    padding-top: 1.65rem;
    padding-bottom: 0.4rem;
    min-height: 3rem;
}

/* ══════════════════════════════════════════════════════════
   Floating Label — مثل MDB v5 select
══════════════════════════════════════════════════════════ */
.mdb-float-label {
    position: absolute;
    inset-inline-start: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
    color: var(--ci);
    pointer-events: none;
    transition: top .15s ease, font-size .15s ease, color .15s ease, transform .15s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 2.5rem);
    line-height: 1.2;
    margin: 0;
}

/* حالة "طائرة" */
.mdb-float-label.active {
    top: 0.4rem;
    transform: none;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--cp);
}

.mdb-select--sm .mdb-float-label {
    font-size: 0.875rem;
}

.mdb-select--sm .mdb-float-label.active {
    font-size: 0.65rem;
    top: 0.25rem;
}

.mdb-select--lg .mdb-float-label {
    font-size: 1.05rem;
}

.mdb-select--lg .mdb-float-label.active {
    font-size: 0.75rem;
    top: 0.5rem;
}

.mdb-select-field.is-invalid .mdb-float-label.active {
    color: var(--ce);
}

.mdb-select-field.is-valid .mdb-float-label.active {
    color: var(--cs);
}

/* ══════════════════════════════════════════════════════════
   نص العرض
══════════════════════════════════════════════════════════ */
.mdb-display-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.4;
}

/* ══════════════════════════════════════════════════════════
   أيقونة الحالة
══════════════════════════════════════════════════════════ */
.mdb-state-icon {
    font-size: 0.85rem;
    flex-shrink: 0;
    margin-inline-end: 0.4rem;
}

.state-valid {
    color: var(--cs);
}

.state-invalid {
    color: var(--ce);
}

/* ══════════════════════════════════════════════════════════
   السهم
══════════════════════════════════════════════════════════ */
.mdb-arrow {
    position: absolute;
    inset-inline-end: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-inline-start: 5px solid transparent;
    border-inline-end: 5px solid transparent;
    border-top: 6px solid var(--ci);
    transition: transform .22s cubic-bezier(.4, 0, .2, 1), border-top-color .15s;
    pointer-events: none;
    flex-shrink: 0;
}

.mdb-arrow.open {
    transform: translateY(-50%) rotate(180deg);
    border-top-color: var(--cp);
}

.is-invalid .mdb-arrow {
    border-top-color: var(--ce);
}

.is-valid .mdb-arrow {
    border-top-color: var(--cs);
}

/* ══════════════════════════════════════════════════════════
   Tags
══════════════════════════════════════════════════════════ */
.mdb-tags-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
    padding: 2px 0;
    min-width: 0;
}

.mdb-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: var(--cp-bg);
    color: var(--cp);
    border: 1px solid var(--cp-md);
    border-radius: 20px;
    padding: 2px 4px 2px 10px;
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
}

[dir="rtl"] .mdb-tag {
    padding: 2px 10px 2px 4px;
}

.mdb-tag-flag {
    font-size: 1rem;
}

.mdb-tag-remove {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--cp);
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: 1;
    flex-shrink: 0;
    transition: background .2s;
}

.mdb-tag-remove:hover {
    background: #155e35;
}

/* ══════════════════════════════════════════════════════════
   Dropdown (teleport — position:fixed)
══════════════════════════════════════════════════════════ */
.mdb-dropdown {
    min-width: 200px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* بحث */
.mdb-search-box {
    padding: 8px 10px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
}

.mdb-search-inner {
    position: relative;
    display: flex;
    align-items: center;
}

.mdb-search-ico {
    position: absolute;
    inset-inline-start: 10px;
    width: 14px;
    height: 14px;
    color: #9e9e9e;
    pointer-events: none;
}

.mdb-search-input {
    width: 100%;
    height: 36px;
    padding-inline-start: 34px;
    padding-inline-end: 30px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 0.875rem;
    background: #fafafa;
    outline: none;
    transition: border-color .15s;
    text-align: start;
}

.mdb-search-input:focus {
    border-color: var(--cp);
    background: #fff;
}

.mdb-search-clear {
    position: absolute;
    inset-inline-end: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: #9e9e9e;
    font-size: 1rem;
    padding: 0;
    line-height: 1;
}

.mdb-search-clear:hover {
    color: #333;
}

/* قائمة */
.mdb-opts {
    list-style: none;
    padding: 4px 0;
    margin: 0;
    max-height: var(--mdb-drop-max-h, 280px);
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
}

.mdb-opts::-webkit-scrollbar {
    width: 5px;
}

.mdb-opts::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

.mdb-option {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 0 16px;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--ct);
    transition: background .1s;
    outline: none;
}

.mdb-option:hover {
    background: #f5f5f5;
}

.mdb-option:focus-visible {
    background: #eee;
}

.mdb-option.disabled {
    opacity: .45;
    cursor: not-allowed;
    pointer-events: none;
}

.mdb-option.selected {
    background: var(--cp-bg);
}

.mdb-option.selected:hover {
    background: #d4eedd;
}

.mdb-option--empty {
    color: #9e9e9e;
    cursor: default;
    justify-content: center;
}

.mdb-option--empty:hover {
    background: transparent;
}

.mdb-option--all {
    border-bottom: 1px solid #f0f0f0;
    font-weight: 500;
    font-size: .85rem;
    color: var(--cp);
}

.mdb-opt-group {
    padding: 8px 16px 2px;
    font-size: .7rem;
    font-weight: 700;
    color: #9e9e9e;
    letter-spacing: .07em;
    text-transform: uppercase;
    list-style: none;
    cursor: default;
}

.mdb-opt-text {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mdb-opt-sec {
    font-size: .8rem;
    color: #9e9e9e;
    margin-inline-start: 6px;
}

.mdb-opt-flag {
    font-size: 1.1rem;
    line-height: 1;
    flex-shrink: 0;
}

.mdb-check-mark {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--cp);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-inline-start: auto;
}

.mdb-check-mark svg {
    width: 10px;
    height: 10px;
    stroke: #fff;
}

.mdb-checkbox {
    width: 18px;
    height: 18px;
    border: 1.5px solid #bdbdbd;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background .12s, border-color .12s;
}

.mdb-checkbox.checked,
.mdb-checkbox.indeterminate {
    background: var(--cp);
    border-color: var(--cp);
}

.mdb-checkbox svg {
    width: 10px;
    height: 10px;
    stroke: #fff;
}

/* footer */
.mdb-drop-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 8px 12px;
    border-top: 1px solid #f0f0f0;
    flex-shrink: 0;
}

.mdb-foot-btn {
    height: 32px;
    padding: 0 14px;
    border-radius: 6px;
    font-size: .82rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: background .15s, border-color .15s;
}

.mdb-foot-btn.clear {
    background: transparent;
    border-color: #d0d0d0;
    color: #616161;
}

.mdb-foot-btn.clear:hover {
    background: #f5f5f5;
    border-color: #9e9e9e;
}

.mdb-foot-btn.apply {
    background: var(--cp);
    border-color: var(--cp);
    color: #fff;
}

.mdb-foot-btn.apply:hover {
    background: #155e35;
}

/* ══════════════════════════════════════════════════════════
   Transition
══════════════════════════════════════════════════════════ */
.mdb-drop-enter-active,
.mdb-drop-leave-active {
    transition: opacity .18s ease, transform .18s ease;
}

.mdb-drop-enter-from,
.mdb-drop-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>