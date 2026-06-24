// ============================================================
// FS-2 — Supabase Database Types
// Auto-generate in production with: npx supabase gen types typescript
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: {
          id: number
          vendor_name: string
          company_name: string
          email_address: string
          contact_number: string
          business_address: string
          status: 'Active' | 'Inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          vendor_name: string
          company_name: string
          email_address: string
          contact_number: string
          business_address: string
          status?: 'Active' | 'Inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          vendor_name?: string
          company_name?: string
          email_address?: string
          contact_number?: string
          business_address?: string
          status?: 'Active' | 'Inactive'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      quotations: {
        Row: {
          id: number
          vendor_id: number
          quotation_title: string
          description: string
          vendor_reference: string
          quotation_amount: number
          submission_date: string
          status: 'Pending' | 'Approved' | 'Rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          vendor_id: number
          quotation_title: string
          description: string
          vendor_reference: string
          quotation_amount: number
          submission_date?: string
          status?: 'Pending' | 'Approved' | 'Rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          vendor_id?: number
          quotation_title?: string
          description?: string
          vendor_reference?: string
          quotation_amount?: number
          submission_date?: string
          status?: 'Pending' | 'Approved' | 'Rejected'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'quotations_vendor_id_fkey'
            columns: ['vendor_id']
            isOneToOne: false
            referencedRelation: 'vendors'
            referencedColumns: ['id']
          }
        ]
      }
      activity_log: {
        Row: {
          id: number
          event: string
          message: string
          entity_id: number | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: number
          event: string
          message: string
          entity_id?: number | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: number
          event?: string
          message?: string
          entity_id?: number | null
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      vendor_status: 'Active' | 'Inactive'
      quotation_status: 'Pending' | 'Approved' | 'Rejected'
    }
    CompositeTypes: Record<string, never>
  }
}

// ─── Convenience type aliases ───────────────────────────────
export type VendorRow = Database['public']['Tables']['vendors']['Row']
export type QuotationRow = Database['public']['Tables']['quotations']['Row']
export type ActivityLogRow = Database['public']['Tables']['activity_log']['Row']
