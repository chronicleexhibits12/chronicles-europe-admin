import type { SitemapEntry, SitemapFormData } from './sitemapTypes';
import { supabase } from '../lib/supabase';

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