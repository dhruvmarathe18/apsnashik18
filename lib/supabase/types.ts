// Database types matching Supabase schema

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          type: string
          date: string
          amount: number
          payment_mode: string
          notes: string | null
          created_at: string
          updated_at: string
          // Fee Collection fields
          student_id: string | null
          admission_no: string | null
          class: string | null
          student_name: string | null
          fee_type: string | null
          status: string | null
          // Bus fields
          bus_number: string | null
          bus_route: string | null
          expense_type: string | null
          vendor: string | null
          // Salary fields
          employee_type: string | null
          employee_name: string | null
          salary_month: string | null
          // Other fields
          category: string | null
          income_source: string | null
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      students: {
        Row: {
          id: string
          admission_no: string
          roll_no: string | null
          full_name: string
          gender: string | null
          date_of_birth: string | null
          aadhar_number: string | null
          class_name: string
          section: string | null
          academic_year: string
          father_name: string | null
          mother_name: string | null
          guardian_name: string | null
          previous_school_name: string | null
          blood_group: string | null
          caste_category: string | null
          caste_other: string | null
          birth_place: string | null
          phone_primary: string
          phone_secondary: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          state: string | null
          pincode: string | null
          bus_opted: boolean
          bus_route_id: string | null
          bus_fee_monthly: number | null
          bus_route_address: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['students']['Insert']>
      }
      fee_plans: {
        Row: {
          id: string
          student_id: string
          annual_fee: number
          exam_fee: number
          book_fee: number
          uniform_fee: number
          discount: number
          misc_fee: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['fee_plans']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['fee_plans']['Insert']>
      }
      settings: {
        Row: {
          id: string
          school_name: string
          academic_year: string
          academic_year_start_month: number
          tuition_months_count: number
          classes: string[]
          buses: any // JSONB
          expense_categories: string[]
          income_sources: string[]
          payment_modes: string[]
          currency: string
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['settings']['Insert']>
      }
    }
  }
}
