// ═══════════════════════════════════════════════
//  Payment Terms
// ═══════════════════════════════════════════════
export interface PaymentTerm {
  ulid: string
  code: string
  name: string
  name_en: string | null
  display_name: string
  due_days: number
  discount_percentage: number
  discount_days: number
  is_default: boolean
  is_active: boolean
  description: string | null
  created_at: string | null
  updated_at: string | null
}

export interface PaymentTermForm {
  code: string
  name: string
  name_en?: string
  due_days: number
  discount_percentage: number
  discount_days: number
  is_default: boolean
  is_active: boolean
  description?: string
}

// ═══════════════════════════════════════════════
//  Customers
// ═══════════════════════════════════════════════
export interface Customer {
  ulid: string
  code: string | null
  name: string
  name_en: string | null
  display_name: string
  email: string | null
  phone: string | null
  mobile: string | null
  website: string | null
  contact_person: string | null
  address: string | null
  tax_number: string | null
  vat_number: string | null
  commercial_number: string | null
  credit_limit: number
  credit_days: number
  opening_balance: number
  opening_balance_side: 'debit' | 'credit'
  opening_balance_date: string | null
  is_active: boolean
  notes: string | null
  branch?: { ulid: string; name: string } | null
  country?: { ulid: string; name: string } | null
  region?: { ulid: string; name: string } | null
  city?: { ulid: string; name: string } | null
  default_currency?: { ulid: string; code: string; name: string } | null
  ar_account?: { ulid: string; code: string; name: string } | null
  payment_term?: { ulid: string; code: string; name: string; due_days: number } | null
  created_at: string | null
  updated_at: string | null
}

export interface CustomerForm {
  code?: string
  name: string
  name_en?: string
  branch_id?: string
  country_id?: string
  region_id?: string
  city_id?: string
  address?: string
  email?: string
  phone?: string
  mobile?: string
  website?: string
  contact_person?: string
  tax_number?: string
  vat_number?: string
  commercial_number?: string
  default_currency_id?: string
  ar_account_id?: string
  payment_term_id?: string
  credit_limit?: number
  credit_days?: number
  opening_balance?: number
  opening_balance_side?: 'debit' | 'credit'
  opening_balance_date?: string
  is_active?: boolean
  notes?: string
}

// ═══════════════════════════════════════════════
//  Suppliers
// ═══════════════════════════════════════════════
export interface Supplier {
  ulid: string
  code: string | null
  name: string
  name_en: string | null
  display_name: string
  email: string | null
  phone: string | null
  mobile: string | null
  website: string | null
  contact_person: string | null
  address: string | null
  tax_number: string | null
  vat_number: string | null
  commercial_number: string | null
  credit_limit: number
  credit_days: number
  opening_balance: number
  opening_balance_side: 'debit' | 'credit'
  opening_balance_date: string | null
  bank_name: string | null
  bank_account_number: string | null
  bank_iban: string | null
  bank_iban_masked: string | null
  bank_swift: string | null
  is_active: boolean
  notes: string | null
  branch?: { ulid: string; name: string } | null
  country?: { ulid: string; name: string } | null
  region?: { ulid: string; name: string } | null
  city?: { ulid: string; name: string } | null
  default_currency?: { ulid: string; code: string; name: string } | null
  ap_account?: { ulid: string; code: string; name: string } | null
  payment_term?: { ulid: string; code: string; name: string; due_days: number } | null
  created_at: string | null
  updated_at: string | null
}

export interface SupplierForm {
  code?: string
  name: string
  name_en?: string
  branch_id?: string
  country_id?: string
  region_id?: string
  city_id?: string
  address?: string
  email?: string
  phone?: string
  mobile?: string
  website?: string
  contact_person?: string
  tax_number?: string
  vat_number?: string
  commercial_number?: string
  default_currency_id?: string
  ap_account_id?: string
  payment_term_id?: string
  credit_limit?: number
  credit_days?: number
  opening_balance?: number
  opening_balance_side?: 'debit' | 'credit'
  opening_balance_date?: string
  bank_name?: string
  bank_account_number?: string
  bank_iban?: string
  bank_swift?: string
  is_active?: boolean
  notes?: string
}

// ═══════════════════════════════════════════════
//  Partner Ledger
// ═══════════════════════════════════════════════
export interface PartnerBalance {
  partner_type: string
  partner_id: number
  fiscal_year: { ulid: string; name: string }
  opening_debit: number
  opening_credit: number
  period_debit: number
  period_credit: number
  closing_balance: number
  balance_side: 'debit' | 'credit'
}

export interface PartnerLedgerTransaction {
  entry_ulid: string
  entry_number: string
  entry_date: string
  description: string | null
  account_ulid: string
  account_code: string
  account_name: string
  debit: number
  credit: number
  running_balance: number
  running_side: 'debit' | 'credit'
}

export interface PartnerLedger {
  partner_type: string
  partner_id: number
  fiscal_year: { ulid: string; name: string }
  opening_balance: number
  opening_side: 'debit' | 'credit'
  transactions: PartnerLedgerTransaction[]
}
