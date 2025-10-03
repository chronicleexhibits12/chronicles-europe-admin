// Database Types
export interface Database {
  public: {
    Tables: {
      home_page: {
        Row: {
          id: string
          hero_background_image: string | null
          hero_background_image_alt: string | null
          main_title: string | null
          main_subtitle: string | null
          main_html_content: string | null
          exhibition_europe_title: string | null
          exhibition_europe_subtitle: string | null
          exhibition_europe_booth_image: string | null
          exhibition_europe_booth_image_alt: string | null
          exhibition_europe_html_content: string | null
          exhibition_usa_title: string | null
          exhibition_usa_html_content: string | null
          solutions_title: string | null
          solutions_html_content: string | null
          solutions_items: any | null
          solutions_items_alt: any | null
          why_best_title: string | null
          why_best_subtitle: string | null
          why_best_html_content: string | null
          // Add new portfolio and testimonials fields
          portfolio_section_title: string | null
          portfolio_section_subtitle: string | null
          portfolio_section_cta_text: string | null
          portfolio_section_cta_link: string | null
          testimonials_section_title: string | null
          // Add exhibition USA CTA text field
          exhibition_usa_cta_text: string | null
          // Add SEO fields
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          hero_background_image?: string | null
          hero_background_image_alt?: string | null
          main_title?: string | null
          main_subtitle?: string | null
          main_html_content?: string | null
          exhibition_europe_title?: string | null
          exhibition_europe_subtitle?: string | null
          exhibition_europe_booth_image?: string | null
          exhibition_europe_booth_image_alt?: string | null
          exhibition_europe_html_content?: string | null
          exhibition_usa_title?: string | null
          exhibition_usa_html_content?: string | null
          solutions_title?: string | null
          solutions_html_content?: string | null
          solutions_items?: any | null
          solutions_items_alt?: any | null
          why_best_title?: string | null
          why_best_subtitle?: string | null
          why_best_html_content?: string | null
          // Add new portfolio and testimonials fields
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
          testimonials_section_title?: string | null
          // Add exhibition USA CTA text field
          exhibition_usa_cta_text?: string | null
          // Add SEO fields
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          hero_background_image?: string | null
          hero_background_image_alt?: string | null
          main_title?: string | null
          main_subtitle?: string | null
          main_html_content?: string | null
          exhibition_europe_title?: string | null
          exhibition_europe_subtitle?: string | null
          exhibition_europe_booth_image?: string | null
          exhibition_europe_booth_image_alt?: string | null
          exhibition_europe_html_content?: string | null
          exhibition_usa_title?: string | null
          exhibition_usa_html_content?: string | null
          solutions_title?: string | null
          solutions_html_content?: string | null
          solutions_items?: any | null
          solutions_items_alt?: any | null
          why_best_title?: string | null
          why_best_subtitle?: string | null
          why_best_html_content?: string | null
          // Add new portfolio and testimonials fields
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
          testimonials_section_title?: string | null
          // Add exhibition USA CTA text field
          exhibition_usa_cta_text?: string | null
          // Add SEO fields
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
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
          hero_background_image_alt: string | null
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
          team_image_alt: string | null
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
          hero_background_image_alt?: string | null
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
          team_image_alt?: string | null
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
          hero_background_image_alt?: string | null
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
          team_image_alt?: string | null
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
          hero_background_image_alt: string | null
          // Add hero button title field
          hero_button_title: string | null
          benefits_title: string | null
          benefits_image: string | null
          benefits_image_alt: string | null
          benefits_content: string | null
          stand_project_title: string | null
          stand_project_highlight: string | null
          stand_project_description: string | null
          exhibition_benefits_title: string | null
          exhibition_benefits_subtitle: string | null
          exhibition_benefits_content: string | null
          exhibition_benefits_image: string | null
          exhibition_benefits_image_alt: string | null
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
          // Add portfolio fields
          portfolio_section_title: string | null
          portfolio_section_subtitle: string | null
          portfolio_section_cta_text: string | null
          portfolio_section_cta_link: string | null
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
          hero_background_image_alt?: string | null
          // Add hero button title field
          hero_button_title?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          benefits_image_alt?: string | null
          benefits_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          exhibition_benefits_title?: string | null
          exhibition_benefits_subtitle?: string | null
          exhibition_benefits_content?: string | null
          exhibition_benefits_image?: string | null
          exhibition_benefits_image_alt?: string | null
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
          // Add portfolio fields
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
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
          hero_background_image_alt?: string | null
          // Add hero button title field
          hero_button_title?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          benefits_image_alt?: string | null
          benefits_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          exhibition_benefits_title?: string | null
          exhibition_benefits_subtitle?: string | null
          exhibition_benefits_content?: string | null
          exhibition_benefits_image?: string | null
          exhibition_benefits_image_alt?: string | null
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
          // Add portfolio fields
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
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
          // Add hero background image alt text field
          hero_background_image_alt: string | null
          // Add hero button title field
          hero_button_title: string | null
          why_choose_title: string | null
          why_choose_content: string | null
          benefits_title: string | null
          benefits_image: string | null
          // Add benefits image alt text field
          benefits_image_alt: string | null
          benefits_content: string | null
          stand_project_title: string | null
          stand_project_highlight: string | null
          stand_project_description: string | null
          advantages_title: string | null
          advantages_image: string | null
          // Add advantages image alt text field
          advantages_image_alt: string | null
          advantages_content: string | null
          our_expertise_title: string | null
          our_expertise_content: string | null
          company_info_title: string | null
          company_info_content: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          // Add portfolio fields
          portfolio_section_title: string | null
          portfolio_section_subtitle: string | null
          portfolio_section_cta_text: string | null
          portfolio_section_cta_link: string | null
        }
        Insert: {
          id?: string
          meta_title?: string | null
          meta_description?: string | null
          slug?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          // Add hero background image alt text field
          hero_background_image_alt?: string | null
          // Add hero button title field
          hero_button_title?: string | null
          why_choose_title?: string | null
          why_choose_content?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          // Add benefits image alt text field
          benefits_image_alt?: string | null
          benefits_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          advantages_title?: string | null
          advantages_image?: string | null
          // Add advantages image alt text field
          advantages_image_alt?: string | null
          advantages_content?: string | null
          our_expertise_title?: string | null
          our_expertise_content?: string | null
          company_info_title?: string | null
          company_info_content?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Add portfolio fields
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
        }
        Update: {
          id?: string
          meta_title?: string | null
          meta_description?: string | null
          slug?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          // Add hero background image alt text field
          hero_background_image_alt?: string | null
          // Add hero button title field
          hero_button_title?: string | null
          why_choose_title?: string | null
          why_choose_content?: string | null
          benefits_title?: string | null
          benefits_image?: string | null
          // Add benefits image alt text field
          benefits_image_alt?: string | null
          benefits_content?: string | null
          stand_project_title?: string | null
          stand_project_highlight?: string | null
          stand_project_description?: string | null
          advantages_title?: string | null
          advantages_image?: string | null
          // Add advantages image alt text field
          advantages_image_alt?: string | null
          advantages_content?: string | null
          our_expertise_title?: string | null
          our_expertise_content?: string | null
          company_info_title?: string | null
          company_info_content?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          // Add portfolio fields
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
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
          // Add hero button title field
          hero_button_title: string | null
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
          // Add portfolio fields
          portfolio_section_title: string | null
          portfolio_section_subtitle: string | null
          portfolio_section_cta_text: string | null
          portfolio_section_cta_link: string | null
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
          // Add hero button title field
          hero_button_title?: string | null
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
          // Add portfolio fields
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
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
          // Add hero button title field
          hero_button_title?: string | null
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
          // Add portfolio fields
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
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
          // Add hero button title field
          hero_button_title: string | null
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
          // Add portfolio fields
          portfolio_section_title: string | null
          portfolio_section_subtitle: string | null
          portfolio_section_cta_text: string | null
          portfolio_section_cta_link: string | null
        }
        Insert: {
          id?: string
          slug?: string | null
          meta_title?: string | null
          meta_description?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          // Add hero button title field
          hero_button_title?: string | null
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
          // Add portfolio fields
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
        }
        Update: {
          id?: string
          slug?: string | null
          meta_title?: string | null
          meta_description?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image?: string | null
          // Add hero button title field
          hero_button_title?: string | null
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
          // Add portfolio fields
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
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
          hero_background_image_alt: string | null
          
          // Why Choose Us Section
          why_choose_us_title: string | null
          why_choose_us_subtitle: string | null
          why_choose_us_main_image_url: string | null
          why_choose_us_main_image_alt: string | null
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
          hero_background_image_alt?: string | null
          
          // Why Choose Us Section
          why_choose_us_title?: string | null
          why_choose_us_subtitle?: string | null
          why_choose_us_main_image_url?: string | null
          why_choose_us_main_image_alt?: string | null
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
          hero_background_image_alt?: string | null
          
          // Why Choose Us Section
          why_choose_us_title?: string | null
          why_choose_us_subtitle?: string | null
          why_choose_us_main_image_url?: string | null
          why_choose_us_main_image_alt?: string | null
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
      trade_shows_page: {
        Row: {
          id: string
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          hero_title: string | null
          hero_subtitle: string | null
          hero_background_image: string | null
          hero_background_image_alt: string | null
          description: string | null
          cities: string[] | null  // Added cities array
          countries: string[] | null  // Added countries array
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
          hero_subtitle?: string | null
          hero_background_image?: string | null
          hero_background_image_alt?: string | null
          description?: string | null
          cities?: string[] | null  // Added cities array
          countries?: string[] | null  // Added countries array
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
          hero_subtitle?: string | null
          hero_background_image?: string | null
          hero_background_image_alt?: string | null
          description?: string | null
          cities?: string[] | null  // Added cities array
          countries?: string[] | null  // Added countries array
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      trade_shows: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string | null
          start_date: string | null
          end_date: string | null
          location: string | null
          country: string | null
          city: string | null
          category: string | null
          logo: string | null
          logo_alt: string | null
          organizer: string | null
          website: string | null
          venue: string | null
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string | null
          content?: string | null
          start_date?: string | null
          end_date?: string | null
          location?: string | null
          country?: string | null
          city?: string | null
          category?: string | null
          logo?: string | null
          logo_alt?: string | null
          organizer?: string | null
          website?: string | null
          venue?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string | null
          content?: string | null
          start_date?: string | null
          end_date?: string | null
          location?: string | null
          country?: string | null
          city?: string | null
          category?: string | null
          logo?: string | null
          logo_alt?: string | null
          organizer?: string | null
          website?: string | null
          venue?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      countries: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          
          // Basic country information
          slug: string
          name: string
          
          // Active status for RLS
          is_active: boolean
          
          // SEO Metadata
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
          
          // Hero Section
          hero_title: string | null
          hero_subtitle: string | null
          hero_background_image_url: string | null
          hero_background_image_alt: string | null
          
          // Why Choose Us Section
          why_choose_us_title: string | null
          why_choose_us_subtitle: string | null
          why_choose_us_main_image_url: string | null
          why_choose_us_main_image_alt: string | null
          why_choose_us_benefits_html: string | null
          
          // What We Do Section
          what_we_do_title: string | null
          what_we_do_subtitle: string | null
          what_we_do_description_html: string | null
          
          // Company Info Section
          company_info_title: string | null
          company_info_content_html: string | null
          
          // Best Company Section
          best_company_title: string | null
          best_company_subtitle: string | null
          best_company_content_html: string | null
          
          // Process Section
          process_section_title: string | null
          process_section_subtitle_html: string | null
          process_section_steps: any | null
          
          // Cities Section
          cities_section_title: string | null
          cities_section_subtitle: string | null
          
          // Portfolio Section
          portfolio_section_title: string | null
          portfolio_section_subtitle: string | null
          portfolio_section_cta_text: string | null
          portfolio_section_cta_link: string | null
          
          // Selected Cities (JSONB array of city slugs)
          selected_cities: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          
          // Basic country information
          slug: string
          name: string
          
          // Active status for RLS
          is_active?: boolean
          
          // SEO Metadata
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          
          // Hero Section
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image_url?: string | null
          hero_background_image_alt?: string | null
          
          // Why Choose Us Section
          why_choose_us_title?: string | null
          why_choose_us_subtitle?: string | null
          why_choose_us_main_image_url?: string | null
          why_choose_us_main_image_alt?: string | null
          why_choose_us_benefits_html?: string | null
          
          // What We Do Section
          what_we_do_title?: string | null
          what_we_do_subtitle?: string | null
          what_we_do_description_html?: string | null
          
          // Company Info Section
          company_info_title?: string | null
          company_info_content_html?: string | null
          
          // Best Company Section
          best_company_title?: string | null
          best_company_subtitle?: string | null
          best_company_content_html?: string | null
          
          // Process Section
          process_section_title?: string | null
          process_section_subtitle_html?: string | null
          process_section_steps?: any | null
          
          // Cities Section
          cities_section_title?: string | null
          cities_section_subtitle?: string | null
          
          // Portfolio Section
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
          
          // Selected Cities (JSONB array of city slugs)
          selected_cities?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          
          // Basic country information
          slug?: string
          name?: string
          
          // Active status for RLS
          is_active?: boolean
          
          // SEO Metadata
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          
          // Hero Section
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_background_image_url?: string | null
          hero_background_image_alt?: string | null
          
          // Why Choose Us Section
          why_choose_us_title?: string | null
          why_choose_us_subtitle?: string | null
          why_choose_us_main_image_url?: string | null
          why_choose_us_main_image_alt?: string | null
          why_choose_us_benefits_html?: string | null
          
          // What We Do Section
          what_we_do_title?: string | null
          what_we_do_subtitle?: string | null
          what_we_do_description_html?: string | null
          
          // Company Info Section
          company_info_title?: string | null
          company_info_content_html?: string | null
          
          // Best Company Section
          best_company_title?: string | null
          best_company_subtitle?: string | null
          best_company_content_html?: string | null
          
          // Process Section
          process_section_title?: string | null
          process_section_subtitle_html?: string | null
          process_section_steps?: any | null
          
          // Cities Section
          cities_section_title?: string | null
          cities_section_subtitle?: string | null
          
          // Portfolio Section
          portfolio_section_title?: string | null
          portfolio_section_subtitle?: string | null
          portfolio_section_cta_text?: string | null
          portfolio_section_cta_link?: string | null
          
          // Selected Cities (JSONB array of city slugs)
          selected_cities?: string[]
        }
      }
      // Add the blog_page table definition
      blog_page: {
        Row: {
          id: string
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          hero_title: string | null
          hero_subtitle: string | null
          hero_background_image: string | null
          hero_background_image_alt: string | null
          description: string | null
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
          hero_subtitle?: string | null
          hero_background_image?: string | null
          hero_background_image_alt?: string | null
          description?: string | null
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
          hero_subtitle?: string | null
          hero_background_image?: string | null
          hero_background_image_alt?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add the blog_posts table definition
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string | null
          published_date: string | null
          featured_image: string | null
          featured_image_alt: string | null
          category: string | null
          author: string | null
          read_time: string | null
          tags: string[] | null
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string | null
          content?: string | null
          published_date?: string | null
          featured_image?: string | null
          featured_image_alt?: string | null
          category?: string | null
          author?: string | null
          read_time?: string | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string | null
          content?: string | null
          published_date?: string | null
          featured_image?: string | null
          featured_image_alt?: string | null
          category?: string | null
          author?: string | null
          read_time?: string | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add the testimonials_page table definition
      testimonials_page: {
        Row: {
          id: string
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          hero_title: string | null
          hero_background_image: string | null
          intro_title: string | null
          intro_subtitle: string | null
          intro_description: string | null
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
          intro_title?: string | null
          intro_subtitle?: string | null
          intro_description?: string | null
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
          intro_title?: string | null
          intro_subtitle?: string | null
          intro_description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add the testimonials table definition
      testimonials: {
        Row: {
          id: string
          page_id: string
          client_name: string | null
          company_name: string | null
          company_logo_url: string | null
          rating: number | null
          testimonial_text: string | null
          is_featured: boolean
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          client_name?: string | null
          company_name?: string | null
          company_logo_url?: string | null
          rating?: number | null
          testimonial_text?: string | null
          is_featured?: boolean
          display_order?: number
          // Note: is_active is always true, but kept for database compatibility
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          client_name?: string | null
          company_name?: string | null
          company_logo_url?: string | null
          rating?: number | null
          testimonial_text?: string | null
          is_featured?: boolean
          display_order?: number
          // Note: is_active is always true, but kept for database compatibility
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add the services table definition
      services: {
        Row: {
          id: string
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          hero_title: string | null
          hero_subtitle: string | null
          hero_background_image: string | null
          hero_background_image_alt: string | null
          intro_title: string | null
          intro_description: string | null
          service_title: string | null
          service_description_html: string | null
          is_service: boolean
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
          hero_subtitle?: string | null
          hero_background_image?: string | null
          hero_background_image_alt?: string | null
          intro_title?: string | null
          intro_description?: string | null
          service_title?: string | null
          service_description_html?: string | null
          is_service?: boolean
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
          hero_subtitle?: string | null
          hero_background_image?: string | null
          hero_background_image_alt?: string | null
          intro_title?: string | null
          intro_description?: string | null
          service_title?: string | null
          service_description_html?: string | null
          is_service?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add the portfolio_page table definition
      portfolio_page: {
        Row: {
          id: string
          hero_title: string | null
          hero_background_image: string | null
          hero_background_image_alt: string | null // Add alt text for hero background image
          portfolio_title: string | null
          portfolio_subtitle: string | null
          portfolio_items: any | null
          portfolio_items_alt: any | null // Add alt texts for portfolio items
          is_active: boolean
          created_at: string
          updated_at: string
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
        }
        Insert: {
          id?: string
          hero_title?: string | null
          hero_background_image?: string | null
          hero_background_image_alt?: string | null // Add alt text for hero background image
          portfolio_title?: string | null
          portfolio_subtitle?: string | null
          portfolio_items?: any | null
          portfolio_items_alt?: any | null // Add alt texts for portfolio items
          is_active?: boolean
          created_at?: string
          updated_at?: string
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
        }
        Update: {
          id?: string
          hero_title?: string | null
          hero_background_image?: string | null
          hero_background_image_alt?: string | null // Add alt text for hero background image
          portfolio_title?: string | null
          portfolio_subtitle?: string | null
          portfolio_items?: any | null
          portfolio_items_alt?: any | null // Add alt texts for portfolio items
          is_active?: boolean
          created_at?: string
          updated_at?: string
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
        }
      }
      // Add the contact_page table definition
      contact_page: {
        Row: {
          id: string
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          hero_title: string | null
          hero_background_image: string | null
          hero_background_image_alt: string | null
          contact_info_title: string | null
          contact_info_address: string | null
          contact_info_full_address: string | null
          contact_info_phone_1: string | null
          contact_info_phone_2: string | null
          contact_info_email: string | null
          form_fields: any | null
          other_offices_title: string | null
          other_offices: any | null
          support_title: string | null
          support_description: string | null
          support_items: any | null
          map_embed_url: string | null
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
          hero_background_image_alt?: string | null
          contact_info_title?: string | null
          contact_info_address?: string | null
          contact_info_full_address?: string | null
          contact_info_phone_1?: string | null
          contact_info_phone_2?: string | null
          contact_info_email?: string | null
          form_fields?: any | null
          other_offices_title?: string | null
          other_offices?: any | null
          support_title?: string | null
          support_description?: string | null
          support_items?: any | null
          map_embed_url?: string | null
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
          hero_background_image_alt?: string | null
          contact_info_title?: string | null
          contact_info_address?: string | null
          contact_info_full_address?: string | null
          contact_info_phone_1?: string | null
          contact_info_phone_2?: string | null
          contact_info_email?: string | null
          form_fields?: any | null
          other_offices_title?: string | null
          other_offices?: any | null
          support_title?: string | null
          support_description?: string | null
          support_items?: any | null
          map_embed_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add the global_locations table definition
      global_locations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          cities: string[]
          countries: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          cities?: string[]
          countries?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          cities?: string[]
          countries?: string[]
        }
      }
      // Add the privacy_page table definition
      privacy_page: {
        Row: {
          id: string
          title: string
          meta_title: string
          meta_description: string
          meta_keywords: string
          content: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          meta_title: string
          meta_description: string
          meta_keywords: string
          content: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          meta_title?: string
          meta_description?: string
          meta_keywords?: string
          content?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add the terms_page table definition
      terms_page: {
        Row: {
          id: string
          title: string
          meta_title: string
          meta_description: string
          meta_keywords: string
          content: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          meta_title: string
          meta_description: string
          meta_keywords: string
          content: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          meta_title?: string
          meta_description?: string
          meta_keywords?: string
          content?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add the main_countries_page table definition
      main_countries_page: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          
          // SEO Metadata
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string | null
          
          // Hero Section
          hero_title: string | null
          hero_subtitle: string | null
          hero_description: string | null
          hero_background_image_url: string | null
          hero_background_image_alt: string | null
          
          // Exhibition Stand Types Section
          exhibition_stand_types: any | null
          
          // Portfolio Showcase Section
          portfolio_showcase_title: string | null
          portfolio_showcase_description: string | null
          portfolio_showcase_cta_text: string | null
          portfolio_showcase_cta_link: string | null
          
          // Build Section
          build_section_title: string | null
          build_section_highlight: string | null
          build_section_description: string | null
          
          // Meta Information
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          
          // SEO Metadata
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          
          // Hero Section
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_description?: string | null
          hero_background_image_url?: string | null
          hero_background_image_alt?: string | null
          
          // Exhibition Stand Types Section
          exhibition_stand_types?: any | null
          
          // Portfolio Showcase Section
          portfolio_showcase_title?: string | null
          portfolio_showcase_description?: string | null
          portfolio_showcase_cta_text?: string | null
          portfolio_showcase_cta_link?: string | null
          
          // Build Section
          build_section_title?: string | null
          build_section_highlight?: string | null
          build_section_description?: string | null
          
          // Meta Information
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          
          // SEO Metadata
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          
          // Hero Section
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_description?: string | null
          hero_background_image_url?: string | null
          hero_background_image_alt?: string | null
          
          // Exhibition Stand Types Section
          exhibition_stand_types?: any | null
          
          // Portfolio Showcase Section
          portfolio_showcase_title?: string | null
          portfolio_showcase_description?: string | null
          portfolio_showcase_cta_text?: string | null
          portfolio_showcase_cta_link?: string | null
          
          // Build Section
          build_section_title?: string | null
          build_section_highlight?: string | null
          build_section_description?: string | null
          
          // Meta Information
          is_active?: boolean
        }
      }
      // Add the sitemap table definition
      sitemap: {
        Row: {
          id: number
          url: string
          priority: number
          changefreq: string
          lastmod: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          url: string
          priority?: number
          changefreq?: string
          lastmod?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          url?: string
          priority?: number
          changefreq?: string
          lastmod?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}