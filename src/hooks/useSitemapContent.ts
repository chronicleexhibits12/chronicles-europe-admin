import { useState, useEffect } from 'react';
import type { SitemapEntry, SitemapFormData } from '../data/sitemapTypes';
import {
  getSitemapEntries,
  getSitemapEntriesWithPagination,
  searchSitemapEntries,
  createSitemapEntry,
  updateSitemapEntry,
  deleteSitemapEntry,
  checkForDuplicateUrl
} from '../data/sitemapService';
import { triggerSitemapRevalidation } from '../data/sitemapService';

export const useSitemapContent = (page?: number, pageSize?: number, searchTerm?: string) => {
  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSitemapEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (searchTerm) {
        // If there's a search term, search across all entries
        const data = await searchSitemapEntries(searchTerm);
        setSitemapEntries(data);
        setTotalCount(data.length);
      } else if (page !== undefined && pageSize !== undefined) {
        // If pagination is enabled, fetch with pagination
        const { data, totalCount } = await getSitemapEntriesWithPagination(page, pageSize);
        setSitemapEntries(data);
        setTotalCount(totalCount);
      } else {
        // Otherwise, fetch all entries
        const data = await getSitemapEntries();
        setSitemapEntries(data);
        setTotalCount(data.length);
      }
    } catch (err) {
      console.error('Error fetching sitemap entries:', err);
      setError('Failed to fetch sitemap entries');
    } finally {
      setLoading(false);
    }
  };

  const addSitemapEntry = async (entry: SitemapFormData) => {
    try {
      // Check for duplicate URL
      const isDuplicate = await checkForDuplicateUrl(entry.url);
      if (isDuplicate) {
        throw new Error('A sitemap entry with this URL already exists');
      }
      
      const newEntry = await createSitemapEntry(entry);
      setSitemapEntries([...sitemapEntries, newEntry]);
      setTotalCount(totalCount + 1);
      
      // Trigger revalidation after successful addition
      await triggerSitemapRevalidation();
      
      return newEntry;
    } catch (err) {
      console.error('Error adding sitemap entry:', err);
      throw err;
    }
  };

  const updateSitemapEntryById = async (id: number, entry: Partial<SitemapFormData>) => {
    try {
      // Check for duplicate URL (excluding current entry)
      if (entry.url) {
        const isDuplicate = await checkForDuplicateUrl(entry.url, id);
        if (isDuplicate) {
          throw new Error('A sitemap entry with this URL already exists');
        }
      }
      
      const updatedEntry = await updateSitemapEntry(id, entry);
      setSitemapEntries(sitemapEntries.map(item => item.id === id ? updatedEntry : item));
      
      // Trigger revalidation after successful update
      await triggerSitemapRevalidation();
      
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
      setTotalCount(totalCount - 1);
      
      // Trigger revalidation after successful deletion
      await triggerSitemapRevalidation();
    } catch (err) {
      console.error('Error deleting sitemap entry:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSitemapEntries();
  }, [page, pageSize, searchTerm]);

  return {
    sitemapEntries,
    totalCount,
    loading,
    error,
    fetchSitemapEntries,
    addSitemapEntry,
    updateSitemapEntryById,
    deleteSitemapEntryById
  };
};