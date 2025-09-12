import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { TagInput } from '@/components/ui/tag-input'
import { Loader2, Save, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { TradeShowsService } from '@/data/tradeShowsService'
import { useGlobalLocations } from '@/hooks/useGlobalLocations'

export function CreateTradeShowAdmin() {
  const navigate = useNavigate()
  const { data: globalLocations } = useGlobalLocations()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic information
    slug: '',
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    location: '', // Keep location field for internal use
    country: '',
    city: '',
    
    // Images
    logo: '',
    logoAlt: '',
    
    // SEO Metadata
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    
    // Status
    isActive: true
  })

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-fill location when city or country is changed
    if (field === 'city' || field === 'country') {
      const newCity = field === 'city' ? value : formData.city
      const newCountry = field === 'country' ? value : formData.country
      
      // Only update location if both city and country have values
      if (newCity && newCountry) {
        setFormData(prev => ({
          ...prev,
          location: `${newCity}, ${newCountry}`
        }))
      } else if (newCity || newCountry) {
        // If only one has a value, use that
        setFormData(prev => ({
          ...prev,
          location: (newCity || newCountry) as string
        }))
      }
    }
  }

  const handleKeywordsChange = (keywords: string[]) => {
    handleInputChange('metaKeywords', keywords.join(', '))
  }

  const getKeywordsArray = () => {
    return formData.metaKeywords ? formData.metaKeywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const { error } = await TradeShowsService.createTradeShow({
        slug: formData.slug,
        title: formData.title,
        content: formData.content,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        country: formData.country,
        city: formData.city,
        logo: formData.logo,
        logoAlt: formData.logoAlt,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
        isActive: formData.isActive
      })

      if (error) throw new Error(error)
      
      toast.success('Trade show created successfully!')
      navigate('/admin/trade-shows')
    } catch (error: any) {
      console.error('Error creating trade show:', error)
      toast.error(`Failed to create trade show: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File, field: string) => {
    setUploading(field)
    
    try {
      const { data, error } = await TradeShowsService.uploadImage(file)
      
      if (error) throw new Error(error)
      if (!data) throw new Error('No URL returned from upload')
      
      // Update form data with the uploaded image URL
      setFormData(prev => ({
        ...prev,
        [field]: data
      }))
      
      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploading(null)
    }
  }

  const removeImage = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: ''
    }))
    toast.success('Image removed successfully')
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create New Trade Show</h1>
        <p className="text-muted-foreground">Add a new trade show or exhibition</p>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={(e) => {
        e.preventDefault(); // Prevent page reload
        handleSave();
      }}>
        {/* Section 1: Basic Information */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 1: Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., ESC Congress 2025"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="e.g., esc-congress-2025"
                required
              />
            </div>
            <div>
              <Label htmlFor="isActive">Published</Label>
              <div className="mt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., London, UK"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Content */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2: Content</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(value: string) => handleInputChange('content', value)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Location */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 3: Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a country</option>
                {globalLocations?.countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a city</option>
                {globalLocations?.cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Images */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 4: Images</h2>
          <div className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    id="logo"
                    value={formData.logo}
                    onChange={(e) => handleInputChange('logo', e.target.value)}
                    placeholder="https://example.com/logo.jpg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleImageUpload(file, 'logo');
                      };
                      input.click();
                    }}
                    disabled={uploading === 'logo'}
                  >
                    {uploading === 'logo' ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload
                  </Button>
                  {formData.logo && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeImage('logo')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Logo Preview */}
              {formData.logo && (
                <div className="mt-2">
                  <div className="border rounded-md overflow-hidden max-w-xs">
                    <img 
                      src={formData.logo} 
                      alt="Logo preview" 
                      className="w-full h-32 object-contain"
                    />
                  </div>
                </div>
              )}
              
              {/* Logo Alt Text */}
              <div className="mt-2">
                <Label htmlFor="logoAlt">Logo Alt Text</Label>
                <Input
                  id="logoAlt"
                  value={formData.logoAlt}
                  onChange={(e) => handleInputChange('logoAlt', e.target.value)}
                  placeholder="Describe the logo image"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: SEO Metadata */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 5: SEO Metadata</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                placeholder="SEO title for the trade show"
              />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder="SEO description for the trade show"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <TagInput
                tags={getKeywordsArray()}
                onChange={handleKeywordsChange}
                placeholder="Type keywords and press Enter"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Press Enter, comma, or semicolon after typing each keyword to add it
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/trade-shows')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Trade Show
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}