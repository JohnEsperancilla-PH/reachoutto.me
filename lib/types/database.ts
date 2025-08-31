export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          bio: string | null
          avatar_url: string | null
          is_admin: boolean
          show_links: boolean
          show_portfolio: boolean
          verified: boolean
          created_at: string
          contact_email: string | null
          contact_phone: string | null
          show_contact: boolean
          custom_background: string | null
          use_custom_background: boolean
          custom_font: string | null
          use_custom_font: boolean
        }
        Insert: {
          id: string
          username: string
          bio?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          show_links?: boolean
          show_portfolio?: boolean
          verified?: boolean
          created_at?: string
          contact_email?: string | null
          contact_phone?: string | null
          show_contact?: boolean
          custom_background?: string | null
          use_custom_background?: boolean
          custom_font?: string | null
          use_custom_font?: boolean
        }
        Update: {
          id?: string
          username?: string
          bio?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          show_links?: boolean
          show_portfolio?: boolean
          verified?: boolean
          created_at?: string
          contact_email?: string | null
          contact_phone?: string | null
          show_contact?: boolean
          custom_background?: string | null
          use_custom_background?: boolean
          custom_font?: string | null
          use_custom_font?: boolean
        }
      }
      links: {
        Row: {
          id: string
          user_id: string
          title: string
          url: string
          position: number
          icon: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          url: string
          position: number
          icon?: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          url?: string
          position?: number
          icon?: string
          color?: string
          created_at?: string
        }
      }
      portfolio_items: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          image_url: string | null
          project_url: string | null
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          image_url?: string | null
          project_url?: string | null
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          project_url?: string | null
          position?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Link = Database['public']['Tables']['links']['Row']
export type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row']
