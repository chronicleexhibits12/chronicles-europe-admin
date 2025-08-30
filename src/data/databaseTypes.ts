// Database Types
export interface Database {
  public: {
    Tables: {
      home_page: {
        Row: {
          id: string
          hero_background_image: string | null
          main_title: string | null
          main_subtitle: string | null
          main_html_content: string | null
          exhibition_europe_title: string | null
          exhibition_europe_subtitle: string | null
          exhibition_europe_booth_image: string | null
          exhibition_europe_html_content: string | null
          exhibition_usa_title: string | null
          exhibition_usa_html_content: string | null
          solutions_title: string | null
          solutions_html_content: string | null
          solutions_items: any | null
          why_best_title: string | null
          why_best_subtitle: string | null
          why_best_html_content: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hero_background_image?: string | null
          main_title?: string | null
          main_subtitle?: string | null
          main_html_content?: string | null
          exhibition_europe_title?: string | null
          exhibition_europe_subtitle?: string | null
          exhibition_europe_booth_image?: string | null
          exhibition_europe_html_content?: string | null
          exhibition_usa_title?: string | null
          exhibition_usa_html_content?: string | null
          solutions_title?: string | null
          solutions_html_content?: string | null
          solutions_items?: any | null
          why_best_title?: string | null
          why_best_subtitle?: string | null
          why_best_html_content?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hero_background_image?: string | null
          main_title?: string | null
          main_subtitle?: string | null
          main_html_content?: string | null
          exhibition_europe_title?: string | null
          exhibition_europe_subtitle?: string | null
          exhibition_europe_booth_image?: string | null
          exhibition_europe_html_content?: string | null
          exhibition_usa_title?: string | null
          exhibition_usa_html_content?: string | null
          solutions_title?: string | null
          solutions_html_content?: string | null
          solutions_items?: any | null
          why_best_title?: string | null
          why_best_subtitle?: string | null
          why_best_html_content?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      about_page: {
        Row: {
          id: string
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          hero_title: string | null
          hero_background_image: string | null
          company_years_in_business: string | null
          company_years_label: string | null
          company_who_we_are_title: string | null
          company_description: string | null
          company_quotes: string[] | null
          facts_title: string | null
          facts_description: string | null
          company_stats: any | null
          team_title: string | null
          team_description: string | null
          team_image: string | null
          services: any | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          hero_title?: string | null
          hero_background_image?: string | null
          company_years_in_business?: string | null
          company_years_label?: string | null
          company_who_we_are_title?: string | null
          company_description?: string | null
          company_quotes?: string[] | null
          facts_title?: string | null
          facts_description?: string | null
          company_stats?: any | null
          team_title?: string | null
          team_description?: string | null
          team_image?: string | null
          services?: any | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          hero_title?: string | null
          hero_background_image?: string | null
          company_years_in_business?: string | null
          company_years_label?: string | null
          company_who_we_are_title?: string | null
          company_description?: string | null
          company_quotes?: string[] | null
          facts_title?: string | null
          facts_description?: string | null
          company_stats?: any | null
          team_title?: string | null
          team_description?: string | null
          team_image?: string | null
          services?: any | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}