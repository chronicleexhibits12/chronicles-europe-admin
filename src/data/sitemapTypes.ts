export interface SitemapEntry {
  id: number;
  url: string;
  priority: number;
  changefreq: string;
  lastmod: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SitemapFormData {
  url: string;
  priority: number;
  changefreq: string;
  is_active: boolean;
}

// Ensure this file is treated as a module
export {};