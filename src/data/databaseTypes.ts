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
      custom_stands_page: {
        Row: {
          id: string
          meta_title: string | null
          meta_description: string | null
          slug: string | null
          hero_title: string | null
          hero_subtitle: string | null
          hero_background_image: string | null
          benefits_title: string | null
          benefits_image: string | null
          benefits_content: string | null
          stand_project_title: string | null
          stand_project_highlight: string | null
          stand_project_description: string | null
          exhibition_benefits_title: string | null
          exhibition_benefits_subtitle: string | null
          exhibition_benefits_content: string | null
          exhibition_benefits_image: string | null
          bespoke_title: string | null
          bespoke_subtitle: string | null
          bespoke_description: string | null
          fresh_design_title: string | null
          fresh_design_subtitle: string | null
          fresh_design_description: string | null
          cost_section_title: string | null
          cost_section_subtitle: string | null
          cost_section_description: string | null
          points_table_title: string | null
          points_table_content: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meta_title?: string | null
          meta_description?: string | null
          slug?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          benefits_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          exhibition_benefits_title?: string | null
          exhibition_benefits_subtitle?: string | null
          exhibition_benefits_content?: string | null
          exhibition_benefits_image?: string | null
          bespoke_title?: string | null
          bespoke_subtitle?: string | null
          bespoke_description?: string | null
          fresh_design_title?: string | null
          fresh_design_subtitle?: string | null
          fresh_design_description?: string | null
          cost_section_title?: string | null
          cost_section_subtitle?: string | null
          cost_section_description?: string | null
          points_table_title?: string | null
          points_table_content?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meta_title?: string | null
          meta_description?: string | null
          slug?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          benefits_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          exhibition_benefits_title?: string | null
          exhibition_benefits_subtitle?: string | null
          exhibition_benefits_content?: string | null
          exhibition_benefits_image?: string | null
          bespoke_title?: string | null
          bespoke_subtitle?: string | null
          bespoke_description?: string | null
          fresh_design_title?: string | null
          fresh_design_subtitle?: string | null
          fresh_design_description?: string | null
          cost_section_title?: string | null
          cost_section_subtitle?: string | null
          cost_section_description?: string | null
          points_table_title?: string | null
          points_table_content?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pavilion_design_page: {
        Row: {
          id: string
          meta_title: string | null
          meta_description: string | null
          slug: string | null
          hero_title: string | null
          hero_subtitle: string | null
          hero_background_image: string | null
          why_choose_title: string | null
          why_choose_content: string | null
          benefits_title: string | null
          benefits_image: string | null
          benefits_content: string | null
          stand_project_title: string | null
          stand_project_highlight: string | null
          stand_project_description: string | null
          advantages_title: string | null
          advantages_image: string | null
          advantages_content: string | null
          our_expertise_title: string | null
          our_expertise_content: string | null
          company_info_title: string | null
          company_info_content: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meta_title?: string | null
          meta_description?: string | null
          slug?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          why_choose_title?: string | null
          why_choose_content?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          benefits_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          advantages_title?: string | null
          advantages_image?: string | null
          advantages_content?: string | null
          our_expertise_title?: string | null
          our_expertise_content?: string | null
          company_info_title?: string | null
          company_info_content?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meta_title?: string | null
          meta_description?: string | null
          slug?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          why_choose_title?: string | null
          why_choose_content?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          benefits_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          advantages_title?: string | null
          advantages_image?: string | null
          advantages_content?: string | null
          our_expertise_title?: string | null
          our_expertise_content?: string | null
          company_info_title?: string | null
          company_info_content?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      modular_stands_page: {
        Row: {
          id: string
          slug: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          meta_title: string | null
          meta_description: string | null
          hero_title: string | null
          hero_subtitle: string | null
          hero_background_image: string | null
          benefits_title: string | null
          benefits_image: string | null
          benefits_content: string | null
          points_table_title: string | null
          points_table_content: string | null
          stand_project_title: string | null
          stand_project_highlight: string | null
          stand_project_description: string | null
          exhibition_benefits_title: string | null
          exhibition_benefits_subtitle: string | null
          exhibition_benefits_content: string | null
          exhibition_benefits_image: string | null
          modular_diversity_title: string | null
          modular_diversity_subtitle: string | null
          modular_diversity_content: string | null
          fastest_construction_title: string | null
          fastest_construction_subtitle: string | null
          fastest_construction_description: string | null
          experts_title: string | null
          experts_subtitle: string | null
          experts_description: string | null
        }
        Insert: {
          id?: string
          slug?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          meta_title?: string | null
          meta_description?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          benefits_content?: string | null
          points_table_title?: string | null
          points_table_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          exhibition_benefits_title?: string | null
          exhibition_benefits_subtitle?: string | null
          exhibition_benefits_content?: string | null
          exhibition_benefits_image?: string | null
          modular_diversity_title?: string | null
          modular_diversity_subtitle?: string | null
          modular_diversity_content?: string | null
          fastest_construction_title?: string | null
          fastest_construction_subtitle?: string | null
          fastest_construction_description?: string | null
          experts_title?: string | null
          experts_subtitle?: string | null
          experts_description?: string | null
        }
        Update: {
          id?: string
          slug?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          meta_title?: string | null
          meta_description?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          benefits_content?: string | null
          points_table_title?: string | null
          points_table_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          exhibition_benefits_title?: string | null
          exhibition_benefits_subtitle?: string | null
          exhibition_benefits_content?: string | null
          exhibition_benefits_image?: string | null
          modular_diversity_title?: string | null
          modular_diversity_subtitle?: string | null
          modular_diversity_content?: string | null
          fastest_construction_title?: string | null
          fastest_construction_subtitle?: string | null
          fastest_construction_description?: string | null
          experts_title?: string | null
          experts_subtitle?: string | null
          experts_description?: string | null
        }
      }
      double_decker_stands_page: {
        Row: {
          id: string
          slug: string | null
          meta_title: string | null
          meta_description: string | null
          hero_title: string | null
          hero_subtitle: string | null
          hero_background_image: string | null
          benefits_title: string | null
          benefits_image: string | null
          benefits_content: string | null
          points_table_title: string | null
          points_table_content: string | null
          stand_project_title: string | null
          stand_project_highlight: string | null
          stand_project_description: string | null
          exhibition_benefits_title: string | null
          exhibition_benefits_subtitle: string | null
          exhibition_benefits_content: string | null
          exhibition_benefits_image: string | null
          booth_partner_title: string | null
          booth_partner_subtitle: string | null
          booth_partner_description: string | null
          bold_statement_title: string | null
          bold_statement_subtitle: string | null
          bold_statement_description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug?: string | null
          meta_title?: string | null
          meta_description?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          benefits_content?: string | null
          points_table_title?: string | null
          points_table_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          exhibition_benefits_title?: string | null
          exhibition_benefits_subtitle?: string | null
          exhibition_benefits_content?: string | null
          exhibition_benefits_image?: string | null
          booth_partner_title?: string | null
          booth_partner_subtitle?: string | null
          booth_partner_description?: string | null
          bold_statement_title?: string | null
          bold_statement_subtitle?: string | null
          bold_statement_description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string | null
          meta_title?: string | null
          meta_description?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          benefits_content?: string | null
          points_table_title?: string | null
          points_table_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          exhibition_benefits_title?: string | null
          exhibition_benefits_subtitle?: string | null
          exhibition_benefits_content?: string | null
          exhibition_benefits_image?: string | null
          booth_partner_title?: string | null
          booth_partner_subtitle?: string | null
          booth_partner_description?: string | null
          bold_statement_title?: string | null
          bold_statement_subtitle?: string | null
          bold_statement_description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          
          // Basic city information
          country_slug: string
          city_slug: string
          name: string
          
          // SEO Metadata
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
          
          // Hero Section
          hero_title: string | null
          hero_subtitle: string | null
          hero_background_image_url: string | null
          
          // Why Choose Us Section
          why_choose_us_title: string | null
          why_choose_us_subtitle: string | null
          why_choose_us_main_image_url: string | null
          why_choose_us_benefits_html: string | null
          
          // What We Do Section
          what_we_do_title: string | null
          what_we_do_subtitle: string | null
          what_we_do_description_html: string | null
          
          // Portfolio Section
          portfolio_title_template: string | null
          
          // Exhibiting Experience Section
          exhibiting_experience_title: string | null
          exhibiting_experience_subtitle: string | null
          exhibiting_experience_benefits_html: string | null
          exhibiting_experience_excellence_title: string | null
          exhibiting_experience_excellence_subtitle: string | null
          exhibiting_experience_excellence_points_html: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          
          // Basic city information
          country_slug: string
          city_slug: string
          name: string
          
          // SEO Metadata
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          
          // Hero Section
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image_url?: string | null
          
          // Why Choose Us Section
          why_choose_us_title?: string | null
          why_choose_us_subtitle?: string | null
          why_choose_us_main_image_url?: string | null
          why_choose_us_benefits_html?: string | null
          
          // What We Do Section
          what_we_do_title?: string | null
          what_we_do_subtitle?: string | null
          what_we_do_description_html?: string | null
          
          // Portfolio Section
          portfolio_title_template?: string | null
          
          // Exhibiting Experience Section
          exhibiting_experience_title?: string | null
          exhibiting_experience_subtitle?: string | null
          exhibiting_experience_benefits_html?: string | null
          exhibiting_experience_excellence_title?: string | null
          exhibiting_experience_excellence_subtitle?: string | null
          exhibiting_experience_excellence_points_html?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          
          // Basic city information
          country_slug?: string
          city_slug?: string
          name?: string
          
          // SEO Metadata
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          
          // Hero Section
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image_url?: string | null
          
          // Why Choose Us Section
          why_choose_us_title?: string | null
          why_choose_us_subtitle?: string | null
          why_choose_us_main_image_url?: string | null
          why_choose_us_benefits_html?: string | null
          
          // What We Do Section
          what_we_do_title?: string | null
          what_we_do_subtitle?: string | null
          what_we_do_description_html?: string | null
          
          // Portfolio Section
          portfolio_title_template?: string | null
          
          // Exhibiting Experience Section
          exhibiting_experience_title?: string | null
          exhibiting_experience_subtitle?: string | null
          exhibiting_experience_benefits_html?: string | null
          exhibiting_experience_excellence_title?: string | null
          exhibiting_experience_excellence_subtitle?: string | null
          exhibiting_experience_excellence_points_html?: string | null
        }
      }
    }
  }
}