import { useState, useEffect } from 'react';
import type { SitemapEntry, SitemapFormData } from '../data/sitemapTypes';
import {
  getSitemapEntries,
  createSitemapEntry,
  updateSitemapEntry,
  deleteSitemapEntry
} from '../data/sitemapService';

export const useSitemapContent = () => {
  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSitemapEntries = async () => {
    try {
      setLoading(true);
      const data = await getSitemapEntries();
      setSitemapEntries(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sitemap entries:', err);
      setError('Failed to fetch sitemap entries');
    } finally {
      setLoading(false);
    }
  };

  const addSitemapEntry = async (entry: SitemapFormData) => {
    try {
      const newEntry = await createSitemapEntry(entry);
      setSitemapEntries([...sitemapEntries, newEntry]);
      return newEntry;
    } catch (err) {
      console.error('Error adding sitemap entry:', err);
      throw err;
    }
  };

  const updateSitemapEntryById = async (id: number, entry: Partial<SitemapFormData>) => {
    try {
      const updatedEntry = await updateSitemapEntry(id, entry);
      setSitemapEntries(sitemapEntries.map(item => item.id === id ? updatedEntry : item));
      return updatedEntry;
    } catch (err) {
      console.error('Error updating sitemap entry:', err);
      throw err;
    }
  };

  const deleteSitemapEntryById = async (id: number) => {
    try {
      await deleteSitemapEntry(id);
      setSitemapEntries(sitemapEntries.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting sitemap entry:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSitemapEntries();
  }, []);

  return {
    sitemapEntries,
    loading,
    error,
    fetchSitemapEntries,
    addSitemapEntry,
    updateSitemapEntryById,
    deleteSitemapEntryById
  };
};