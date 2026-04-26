
export interface FiscalYear {
  ulid: string
  name: string
  start_date: string
  end_date: string
  status: 'open' | 'closed' | 'locked'
  status_label: string
  status_color: 'success' | 'warning' | 'danger' | 'secondary'
  status_icon: string
  is_default: boolean
  is_current: boolean
  duration_months: number
  progress_percentage: number
  days_remaining: number
  is_open: boolean
  is_closed: boolean
  is_locked: boolean
  is_editable: boolean
  closed_at: string | null
  closed_by: { id: string; name: string } | null
  notes: string | null
  created_at: string
  created_by?: { id: string; name: string } | null
}
 
export interface FiscalYearStats {
  journal_entries: number
  invoices: number
  has_data: boolean
}
 
export interface FiscalYearMeta {
  total: number
  current_page: number
  last_page: number
  per_page: number
}
 
export interface FiscalYearForm {
  name: string
  start_date: string
  end_date: string
  is_default: boolean
  notes: string
}
 
export interface FiscalYearFilters {
  search: string
  status: string
  per_page: number
}