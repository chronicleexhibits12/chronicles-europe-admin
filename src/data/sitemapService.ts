import type { SitemapEntry, SitemapFormData } from './sitemapTypes';
import { supabase } from '../lib/supabase';
import { basicRevalidate } from './simpleRevalidation';

export const getSitemapEntries = async (): Promise<SitemapEntry[]> => {
  const { data, error } = await (supabase as any)
    .from('sitemap')
    .select('*')
    .order('url');

  if (error) {
    console.error('Error fetching sitemap entries:', error);
    throw error;
  }

  return data || [];
};

// Add pagination support
export const getSitemapEntriesWithPagination = async (page: number = 1, pageSize: number = 10): Promise<{ data: SitemapEntry[]; totalCount: number }> => {
  try {
    // Calculate the range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get the total count first
    const { count: totalCount, error: countError } = await supabase
      .from('sitemap')
      .select('*', { count: 'exact', head: true });

    if (countError) throw new Error(countError.message);

    // Get the paginated data, sorted by URL
    const { data, error } = await supabase
      .from('sitemap')
      .select('*')
      .order('url')
      .range(from, to);

    if (error) throw new Error(error.message);
    
    return { data: data || [], totalCount: totalCount || 0 };
  } catch (error: any) {
    console.error('Error fetching sitemap entries with pagination:', error);
    return { data: [], totalCount: 0 };
  }
};

// Add search functionality
export const searchSitemapEntries = async (searchTerm: string): Promise<SitemapEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('sitemap')
      .select('*')
      .ilike('url', `%${searchTerm}%`)
      .order('url');

    if (error) throw new Error(error.message);
    
    return data || [];
  } catch (error: any) {
    console.error('Error searching sitemap entries:', error);
    return [];
  }
};

// Check for duplicate URLs
export const checkForDuplicateUrl = async (url: string, excludeId?: number): Promise<boolean> => {
  try {
    let query = supabase
      .from('sitemap')
      .select('id')
      .eq('url', url);
      
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
      
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    
    return data.length > 0;
  } catch (error: any) {
    console.error('Error checking for duplicate URL:', error);
    return false;
  }
};

export const getSitemapEntryById = async (id: number): Promise<SitemapEntry | null> => {
  const { data, error } = await (supabase as any)
    .from('sitemap')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching sitemap entry:', error);
    throw error;
  }

  return data;
};

export const createSitemapEntry = async (entry: SitemapFormData): Promise<SitemapEntry> => {
  const { data, error } = await (supabase as any)
    .from('sitemap')
    .insert([entry])
    .select('*')
    .single();

  if (error) {
    console.error('Error creating sitemap entry:', error);
    throw error;
  }

  return data;
};

export const updateSitemapEntry = async (id: number, entry: Partial<SitemapFormData>): Promise<SitemapEntry> => {
  // Remove any undefined values from the entry object
  const cleanEntry: Record<string, any> = {};
  Object.entries(entry).forEach(([key, value]) => {
    if (value !== undefined) {
      cleanEntry[key] = value;
    }
  });
  
  const { data, error } = await (supabase as any)
    .from('sitemap')
    .update(cleanEntry)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating sitemap entry:', error);
    throw error;
  }

  return data;
};

export const deleteSitemapEntry = async (id: number): Promise<void> => {
  const { error } = await (supabase as any)
    .from('sitemap')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting sitemap entry:', error);
    throw error;
  }
};

// Add revalidation function for sitemap
export const triggerSitemapRevalidation = async (): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Revalidate the sitemap page
    const result = await basicRevalidate('/sitemap.xml');
    console.log('[Sitemap Revalidation] Sitemap revalidation triggered');
    return result;
  } catch (error) {
    console.error('[Sitemap Revalidation] Error triggering sitemap revalidation:', error);
    return { success: true, error: null }; // Still return success to avoid breaking the UI
  }
};
