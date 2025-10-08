import React, { useState, useEffect, useRef } from 'react';
import { useSitemapContent } from '../../hooks/useSitemapContent';
import type { SitemapEntry, SitemapFormData } from '../../data/sitemapTypes';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button'; 
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

const SitemapAdmin: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SitemapFormData>({
    url: '',
    priority: 0.5,
    changefreq: 'monthly',
    is_active: true
  });
  const topRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm) {
        setCurrentPage(1); // Reset to first page when searching
      }
    }, 1500); // 1.5 second debounce

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const { sitemapEntries, totalCount, loading, error, addSitemapEntry, updateSitemapEntryById, deleteSitemapEntryById } = useSitemapContent(currentPage, pageSize, debouncedSearchTerm);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    if (editingId) {
      const entry = sitemapEntries.find(item => item.id === editingId);
      if (entry) {
        setFormData({
          url: entry.url,
          priority: entry.priority,
          changefreq: entry.changefreq,
          is_active: entry.is_active
        });
      }
    }
  }, [editingId, sitemapEntries]);

  // Scroll to top when form is opened or after submission
  useEffect(() => {
    if ((isAdding || editingId) && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (!isAdding && !editingId && topRef.current) {
      // Scroll to top after form submission/cancellation
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isAdding, editingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'priority' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Automatically add "/" prefix only for relative URLs that don't start with http:// or https://
      let url = formData.url.trim();
      if (url && !url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = '/' + url;
      }
      
      const formDataWithSlash = {
        ...formData,
        url
      };
      
      if (editingId) {
        await updateSitemapEntryById(editingId, formDataWithSlash);
        setEditingId(null);
      } else {
        await addSitemapEntry(formDataWithSlash);
        setIsAdding(false);
      }
      
      setFormData({
        url: '',
        priority: 0.5,
        changefreq: 'monthly',
        is_active: true
      });
      
      // Scroll to top after successful submission
      if (topRef.current) {
        setTimeout(() => {
          topRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      console.error('Error saving sitemap entry:', err);
      alert(err.message || 'Failed to save sitemap entry');
    }
  };

  const handleEdit = (entry: SitemapEntry) => {
    setEditingId(entry.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sitemap entry?')) {
      try {
        await deleteSitemapEntryById(id);
      } catch (err) {
        console.error('Error deleting sitemap entry:', err);
        alert('Failed to delete sitemap entry');
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      url: '',
      priority: 0.5,
      changefreq: 'monthly',
      is_active: true
    });
    
    // Scroll to top after cancellation
    if (topRef.current) {
      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Pagination functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => goToPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (totalPages <= 1) return items;
    
    // Show ellipsis if there are pages between first and current range
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => goToPage(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if there are pages between current range and last
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => goToPage(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  if (loading) return <div className="p-6">Loading sitemap entries...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div ref={topRef} className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sitemap Management</h1>
        <Button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({
              url: '',
              priority: 0.5,
              changefreq: 'monthly',
              is_active: true
            });
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Entry
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search URLs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          {searchTerm && (
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => {
                setSearchTerm('');
                setDebouncedSearchTerm('');
                setCurrentPage(1);
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {(isAdding || editingId) && (
        <form ref={formRef} onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Sitemap Entry' : 'Add New Sitemap Entry'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/example-page or https://example.com"
              />
              <p className="text-xs text-gray-500 mt-1">Note: A "/" will be automatically added at the beginning for relative URLs</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <input
                type="number"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                min="0"
                max="1"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Frequency</label>
              <select
                name="changefreq"
                value={formData.changefreq}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="always">Always</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="never">Never</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="block text-sm font-medium text-gray-700 mr-2">Active</label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingId ? 'Update Entry' : 'Add Entry'}
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Sitemap Entries</h2>
          <p className="text-sm text-gray-600 mt-1">
            {debouncedSearchTerm 
              ? `Found ${totalCount} result${totalCount !== 1 ? 's' : ''} for "${debouncedSearchTerm}"` 
              : `Showing ${Math.min(sitemapEntries.length, pageSize)} of ${totalCount} entries`}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-3">URL</TableHead>
                <TableHead className="px-4 py-3">Priority</TableHead>
                <TableHead className="px-4 py-3">Frequency</TableHead>
                <TableHead className="px-4 py-3">Active</TableHead>
                <TableHead className="px-4 py-3 hidden md:table-cell">Last Modified</TableHead>
                <TableHead className="px-4 py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sitemapEntries.map((entry) => (
                <TableRow key={entry.id} className={entry.is_active ? '' : 'bg-gray-100'}>
                  <TableCell className="px-4 py-3 text-sm font-medium text-gray-900 max-w-xs truncate">
                    {entry.url}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-500">
                    {entry.priority}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-500">
                    <span className="hidden md:inline">{entry.changefreq}</span>
                    <span className="md:hidden">{entry.changefreq.charAt(0)}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-500">
                    {entry.is_active ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    {new Date(entry.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-1">
                      <Button
                        onClick={() => handleEdit(entry)}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(entry.id)}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {sitemapEntries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {debouncedSearchTerm ? 'No sitemap entries found matching your search.' : 'No sitemap entries found.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!debouncedSearchTerm && totalPages > 1 && (
        <Pagination className="mt-6 ">
          <PaginationContent>
            <PaginationItem className="ml-4">
              <PaginationPrevious className="mr-6 "
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default SitemapAdmin;