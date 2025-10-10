import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { TagInput } from '@/components/ui/tag-input'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Loader2, Save, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { useTradeShow } from '@/hooks/useTradeShowsContent'
import { TradeShowsService } from '@/data/tradeShowsService'
import { useGlobalLocations } from '@/hooks/useGlobalLocations'
import { validateRedirectUrlFormat, validateRedirectUrlExists } from '@/utils/redirectValidation'

export function EditTradeShowAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: tradeShow, loading, error, refetch } = useTradeShow(id || '')
  const { data: globalLocations } = useGlobalLocations()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [redirectUrlError, setRedirectUrlError] = useState('') // Add state for redirect URL error
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic information
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    startDate: '',
    endDate: '',
    location: '', // Keep location field for internal use
    country: '',
    city: '',
    organizer: '', // This will be labeled as "Hero Button Title"
    
    // Images
    logo: '',
    logoAlt: '',
    
    // SEO Metadata
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    
    // Redirect URL
    redirectUrl: '',
    
    // Status
    isActive: true
  })

  // Initialize form with trade show data
  useEffect(() => {
    if (tradeShow) {
      setFormData({
        slug: tradeShow.slug || '',
        title: tradeShow.title || '',
        excerpt: tradeShow.excerpt || '',
        content: tradeShow.content || '',
        startDate: tradeShow.startDate || '',
        endDate: tradeShow.endDate || '',
        location: tradeShow.location || '',
        country: tradeShow.country || '',
        city: tradeShow.city || '',
        organizer: tradeShow.organizer || '', // Initialize organizer field
        logo: tradeShow.logo || '',
        logoAlt: tradeShow.logoAlt || '',
        metaTitle: tradeShow.metaTitle || '',
        metaDescription: tradeShow.metaDescription || '',
        metaKeywords: tradeShow.metaKeywords || '',
        redirectUrl: tradeShow.redirectUrl || '', // Initialize redirectUrl
        isActive: tradeShow.isActive
      })
    }
  }, [tradeShow])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear redirect URL error when user types
    if (field === 'redirectUrl') {
      setRedirectUrlError('')
    }

    // Auto-set end date to start date + 1 day when start date changes
    if (field === 'startDate') {
      const startDate = new Date(value as string);
      if (!isNaN(startDate.getTime())) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        const endDateString = endDate.toISOString().split('T')[0];
        setFormData(prev => ({
          ...prev,
          endDate: endDateString
        }));
      }
    }

    // Auto-fill location when city or country is changed
    if (field === 'city' || field === 'country') {
      const newCity = field === 'city' ? value : formData.city;
      const newCountry = field === 'country' ? value : formData.country;
      
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

  // Get image URL for preview
  const getImageUrl = (field: string): string => {
    const value = formData[field as keyof typeof formData]
    return typeof value === 'string' ? value : ''
  }

  const validateRedirectUrl = async () => {
    if (!formData.redirectUrl) {
      setRedirectUrlError('')
      return true
    }
    
    // Validate URL format
    if (!validateRedirectUrlFormat(formData.redirectUrl)) {
      setRedirectUrlError('Please enter a valid URL or relative path')
      return false
    }
    
    // Validate that the URL exists in the appropriate table
    const isValid = await validateRedirectUrlExists(formData.redirectUrl, 'trade_shows')
    if (!isValid) {
      setRedirectUrlError('The specified URL does not exist in the trade shows')
      return false
    }
    
    setRedirectUrlError('')
    return true
  }

  const handleSave = async () => {
    if (!id) return
    
    // Validate redirect URL before saving
    const isRedirectUrlValid = await validateRedirectUrl()
    if (!isRedirectUrlValid) {
      toast.error('Please fix the redirect URL error before saving')
      return
    }
    
    setSaving(true)
    
    try {
      const { error } = await TradeShowsService.updateTradeShow(id, {
        slug: formData.slug,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        country: formData.country,
        city: formData.city,
        organizer: formData.organizer, // Include organizer field
        logo: formData.logo,
        logoAlt: formData.logoAlt,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
        redirectUrl: formData.redirectUrl, // Include redirectUrl field
        isActive: formData.isActive
      })

      if (error) throw new Error(error)
      
      // Refresh the data after successful save
      await refetch()
      
      toast.success('Trade show updated successfully!')
      navigate('/admin/trade-shows')
    } catch (error: any) {
      console.error('Error updating trade show:', error)
      toast.error(`Failed to update trade show: ${error.message || 'Unknown error'}`)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading trade show: {error}
      </div>
    )
  }

  if (!tradeShow && !loading) {
    return (
      <div className="p-8 text-center text-red-600">
        Trade show not found
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Edit Trade Show</h1>
        <p className="text-muted-foreground">Update trade show information</p>
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
              <Label htmlFor="organizer">Hero Button Title</Label>
              <Input
                id="organizer"
                value={formData.organizer}
                onChange={(e) => handleInputChange('organizer', e.target.value)}
                placeholder="e.g., Register Now, Learn More"
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
            <div className="col-span-full">
              <Label htmlFor="redirectUrl">Redirect URL</Label>
              <Input
                id="redirectUrl"
                value={formData.redirectUrl}
                onChange={(e) => handleInputChange('redirectUrl', e.target.value)}
                placeholder="Enter redirect URL (optional)"
                className={redirectUrlError ? 'border-red-500' : ''}
              />
              {redirectUrlError && (
                <p className="text-sm text-red-500 mt-1">{redirectUrlError}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                If provided, visitors will be redirected to this URL instead of viewing the standard trade show page.
                Enter a full URL (e.g. https://example.com) or a relative path (e.g. /events).
              </p>
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
            {/* Logo fields added here, right after publish toggle */}
            <div>
              <Label htmlFor="logo">Logo Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={uploading === 'logo'}
                  >
                    {uploading === 'logo' ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Choose Logo
                  </Button>
                </div>
                {getImageUrl('logo') && (
                  <div className="relative inline-block">
                    <img 
                      src={getImageUrl('logo')} 
                      alt="Logo preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('logo')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    e.preventDefault();
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'logo')
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="logoAlt">Logo Alt Text</Label>
              <Input
                id="logoAlt"
                value={formData.logoAlt}
                onChange={(e) => handleInputChange('logoAlt', e.target.value)}
                placeholder="e.g., ESC Congress Logo"
              />
            </div>
            {/* Event Details fields added here */}
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
              <Label htmlFor="country">Country</Label>
              <SearchableSelect
                value={formData.country}
                onChange={(value) => handleInputChange('country', value)}
                options={globalLocations?.countries || []}
                placeholder="Select a country"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <SearchableSelect
                value={formData.city}
                onChange={(value) => handleInputChange('city', value)}
                options={globalLocations?.cities || []}
                placeholder="Select a city"
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Heading (Excerpt)</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                placeholder="Brief description or heading for the trade show"
                rows={3}
              />
            </div>
            <div className="col-span-full">
              <Label>Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(newContent) => handleInputChange('content', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="metaTitle">SEO Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                placeholder="SEO title for the trade show page"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="metaDescription">SEO Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder="SEO description for the trade show page"
                rows={3}
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="metaKeywords">SEO Keywords</Label>
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

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button 
            type="button" 
            onClick={handleSave} 
            disabled={saving}
            size="lg"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Trade Show
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}