import React, { useState, useEffect } from 'react';
import { useSitemapContent } from '../../hooks/useSitemapContent';
import type { SitemapEntry, SitemapFormData } from '../../data/sitemapTypes';

const SitemapAdmin: React.FC = () => {
  const { sitemapEntries, loading, error, addSitemapEntry, updateSitemapEntryById, deleteSitemapEntryById } = useSitemapContent();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SitemapFormData>({
    url: '',
    priority: 0.5,
    changefreq: 'monthly',
    is_active: true
  });

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
      if (editingId) {
        await updateSitemapEntryById(editingId, formData);
        setEditingId(null);
      } else {
        await addSitemapEntry(formData);
        setIsAdding(false);
      }
      
      setFormData({
        url: '',
        priority: 0.5,
        changefreq: 'monthly',
        is_active: true
      });
    } catch (err) {
      console.error('Error saving sitemap entry:', err);
      alert('Failed to save sitemap entry');
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
  };

  if (loading) return <div className="p-6">Loading sitemap entries...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sitemap Management</h1>
        <button
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
          Add New Entry
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
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
                placeholder="/example-page"
              />
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
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingId ? 'Update Entry' : 'Add Entry'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change Frequency
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sitemapEntries.map((entry) => (
              <tr key={entry.id} className={entry.is_active ? '' : 'bg-gray-100'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {entry.url}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.priority}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.changefreq}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.is_active ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(entry.updated_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sitemapEntries.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No sitemap entries found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SitemapAdmin;