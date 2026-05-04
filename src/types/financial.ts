// ═══════════════════════════════════════════════
//  src/types/financial.ts
// ═══════════════════════════════════════════════

export interface Account {
    ulid: string
    code: string
    name: string
    name_en: string | null
    type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
    sub_type: string | null
    normal_balance_side: 'debit' | 'credit'
    depth: number
    is_system: boolean
    allow_posting: boolean
    is_leaf: boolean
    is_parent: boolean
    is_cash_account: boolean
    is_bank_account: boolean
    opening_balance: number
    opening_balance_side: 'debit' | 'credit'
    opening_balance_date: string | null
    status: 'active' | 'inactive'
    notes: string | null
    parent: { ulid: string; code: string; name: string, name_en: string | null } | null
    children?: Account[]
    children_recursive?: Account[]
    children_count?: number
    is_deletable?: boolean
    created_at: string
    updated_at: string

    // ── رصيد الحساب من القيود المرحَّلة (null إذا لم تُحدد السنة المالية) ──
    balance_debit?: number | null   // إجمالي المدين
    balance_credit?: number | null  // إجمالي الدائن
    balance?: number | null         // الرصيد الصافي (abs)
    balance_side?: 'debit' | 'credit' | null  // جانب الرصيد الصافي
}

export interface AccountForm {
    code: string
    name: string
    name_en?: string
    type: string
    sub_type?: string
    parent_id?: string | null
    allow_posting?: boolean
    is_cash_account?: boolean
    is_bank_account?: boolean
    opening_balance?: number
    opening_balance_side?: 'debit' | 'credit'
    opening_balance_date?: string
    status?: 'active' | 'inactive'
    notes?: string
}

export interface AccountDropdown {
    ulid: string
    code: string
    name: string
    name_en: string | null
    type: string
    normal_balance_side: 'debit' | 'credit'
}

export interface FinancialJournal {
    ulid: string
    code: string
    name: string
    name_en: string | null
    type: 'general' | 'sales' | 'purchases' | 'bank' | 'cash' | 'payroll' | 'opening'
    prefix: string | null
    is_system: boolean
    status: 'active' | 'inactive'
    notes: string | null
    entries_count?: number
    is_deletable?: boolean
    created_at: string
    updated_at: string
}

export interface JournalForm {
    code: string
    name: string
    name_en?: string
    type: string
    prefix?: string
    status?: 'active' | 'inactive'
    notes?: string
}

export interface JournalEntryLine {
    id: number
    line_order: number
    side: 'debit' | 'credit'
    amount: string
    debit: string
    credit: string
    description: string | null
    reference: string | null
    account: { ulid: string; code: string; name: string; type: string; normal_balance_side: 'debit' | 'credit' } | null
    cost_center: { ulid: string; code: string; name: string; type: string } | null
}

export interface JournalEntry {
    ulid: string
    number: string
    entry_date: string
    due_date: string | null
    status: 'draft' | 'posted' | 'cancelled'
    is_editable: boolean
    is_deletable: boolean
    total_debit: string
    total_credit: string
    is_balanced: boolean
    is_opening: boolean
    is_auto: boolean
    description: string | null
    reference: string | null
    posted_at: string | null
    cancelled_at: string | null
    lines_count?: number
    financial_journal: { ulid: string; code: string; name: string; type: string; prefix: string | null } | null
    fiscal_year: { ulid: string; name: string } | null
    lines?: JournalEntryLine[]
    posted_by?: { id: string; ulid: string; name: string } | null
    created_at: string
    updated_at: string
}

export interface EntryLineForm {
    account_id: string
    cost_center_id?: string
    debit: number
    credit: number
    description?: string
    reference?: string
}

export interface EntryForm {
    financial_journal_id: string
    fiscal_year_id: string
    entry_date: string
    due_date?: string
    description?: string
    reference?: string
    lines: EntryLineForm[]
}

export interface CostCenter {
    ulid: string
    code: string
    name: string
    name_en: string | null
    type: 'cost' | 'revenue' | 'profit' | 'investment'
    type_label: string
    depth: number
    is_system: boolean
    allow_posting: boolean
    is_leaf: boolean
    is_parent: boolean
    status: 'active' | 'inactive'
    notes: string | null
    parent: { ulid: string; code: string; name: string } | null
    children?: CostCenter[]
    children_recursive?: CostCenter[]
    children_count?: number
    is_deletable?: boolean
    created_at: string
    updated_at: string
}

export interface CostCenterForm {
    code: string
    name: string
    name_en?: string
    type: string
    parent_id?: string | null
    allow_posting?: boolean
    status?: 'active' | 'inactive'
    notes?: string
}

export interface TrialBalanceLine {
    account_ulid: string
    account_code: string
    account_name: string
    account_type: string
    opening_debit: number
    opening_credit: number
    period_debit: number
    period_credit: number
    closing_debit: number
    closing_credit: number
}

export interface TrialBalance {
    fiscal_year: { ulid: string; name: string; start_date: string; end_date: string; status: string }
    filters: { date_from: string | null; date_to: string | null }
    lines: TrialBalanceLine[]
    totals: { opening_debit: number; opening_credit: number; period_debit: number; period_credit: number; closing_debit: number; closing_credit: number }
    is_balanced: boolean
}

export interface IncomeStatementEntry {
    account_ulid: string
    account_code: string
    account_name: string
    balance: number
    side: 'debit' | 'credit'
}

export interface IncomeStatement {
    fiscal_year: { ulid: string; name: string }
    revenues: IncomeStatementEntry[]
    expenses: IncomeStatementEntry[]
    total_revenue: number
    total_expense: number
    net_income: number
    net_income_side: 'debit' | 'credit'
    is_profit: boolean
}

export interface BalanceSheet {
    fiscal_year: { ulid: string; name: string }
    assets: Array<{ account_ulid: string; account_code: string; account_name: string; balance: number; side: string }>
    liabilities: Array<{ account_ulid: string; account_code: string; account_name: string; balance: number; side: string }>
    equity: Array<{ account_ulid: string; account_code: string; account_name: string; balance: number; side: string }>
    total_assets: number
    total_liabilities: number
    total_equity: number
    net_income_in_equity: number
    total_equity_with_income: number
    total_liabilities_and_equity: number
    is_balanced: boolean
}

export interface LedgerLine {
    number: string
    date: string
    journal: string
    description: string | null
    reference: string | null
    debit: number
    credit: number
    balance: number
    balance_side: 'debit' | 'credit'
}

export interface GeneralLedger {
    account: { ulid: string; code: string; name: string; type: string; normal_balance_side: 'debit' | 'credit'; opening_balance: number; opening_side: 'debit' | 'credit' }
    fiscal_year: { ulid: string; name: string }
    filters: { date_from: string | null; date_to: string | null }
    lines: LedgerLine[]
    totals: { total_debit: number; total_credit: number; closing_balance: number; closing_side: 'debit' | 'credit' }
}

export interface PaginationMeta {
    total: number
    current_page: number
    last_page: number
    per_page: number
}

export interface OpeningBalancePreview {
    fiscal_year: { ulid: string; name: string; start_date: string }
    accounts_count: number
    lines: Array<{ account_ulid: string; account_code: string; account_name: string; account_type: string; debit: number; credit: number }>
    total_debit: number
    total_credit: number
    difference: number
    is_balanced: boolean
    already_exists: boolean
}