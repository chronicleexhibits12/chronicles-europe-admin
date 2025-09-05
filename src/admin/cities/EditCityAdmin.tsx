import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { TagInput } from '@/components/ui/tag-input'
import { 
  Loader2, 
  Save, 
  Upload, 
  X,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCity } from '@/hooks/useCitiesContent'
import { CitiesService } from '@/data/citiesService'
import { slugify } from '@/utils/slugify'

interface CityData {
  // Basic city information
  country_slug: string
  city_slug: string
  name: string
  is_active: boolean // Add is_active field
  
  // SEO Metadata
  seo_title: string
  seo_description: string
  seo_keywords: string
  
  // Hero Section
  hero_title: string
  hero_subtitle: string
  hero_background_image_url: string
  
  // Why Choose Us Section
  why_choose_us_title: string
  why_choose_us_subtitle: string
  why_choose_us_main_image_url: string
  why_choose_us_benefits_html: string
  
  // What We Do Section
  what_we_do_title: string
  what_we_do_subtitle: string
  what_we_do_description_html: string
  
  // Portfolio Section
  portfolio_title_template: string
  
  // Exhibiting Experience Section
  exhibiting_experience_title: string
  exhibiting_experience_subtitle: string
  exhibiting_experience_benefits_html: string
  exhibiting_experience_excellence_title: string
  exhibiting_experience_excellence_subtitle: string
  exhibiting_experience_excellence_points_html: string
}

export function EditCityAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: city, loading, error } = useCity(id || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<CityData>({
    // Basic city information
    country_slug: '',
    city_slug: '',
    name: '',
    is_active: true, // Add is_active field with default true
    
    // SEO Metadata
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    
    // Hero Section
    hero_title: '',
    hero_subtitle: '',
    hero_background_image_url: '',
    
    // Why Choose Us Section
    why_choose_us_title: '',
    why_choose_us_subtitle: '',
    why_choose_us_main_image_url: '',
    why_choose_us_benefits_html: '',
    
    // What We Do Section
    what_we_do_title: '',
    what_we_do_subtitle: '',
    what_we_do_description_html: '',
    
    // Portfolio Section
    portfolio_title_template: '',
    
    // Exhibiting Experience Section
    exhibiting_experience_title: '',
    exhibiting_experience_subtitle: '',
    exhibiting_experience_benefits_html: '',
    exhibiting_experience_excellence_title: '',
    exhibiting_experience_excellence_subtitle: '',
    exhibiting_experience_excellence_points_html: '',
  })

  // Temporary state for uploaded images (not yet saved)
  const [tempImages, setTempImages] = useState<Record<string, string>>({})

  // Temporary state for selected files (not yet uploaded)
  const [tempFiles, setTempFiles] = useState<Record<string, File>>({})

  useEffect(() => {
    if (city) {
      setFormData({
        country_slug: city.country_slug || '',
        city_slug: city.city_slug || '',
        name: city.name || '',
        is_active: city.is_active !== undefined ? city.is_active : true, // Handle is_active field
        seo_title: city.seo_title || '',
        seo_description: city.seo_description || '',
        seo_keywords: city.seo_keywords || '',
        hero_title: city.hero_title || '',
        hero_subtitle: city.hero_subtitle || '',
        hero_background_image_url: city.hero_background_image_url || '',
        why_choose_us_title: city.why_choose_us_title || '',
        why_choose_us_subtitle: city.why_choose_us_subtitle || '',
        why_choose_us_main_image_url: city.why_choose_us_main_image_url || '',
        why_choose_us_benefits_html: city.why_choose_us_benefits_html || '',
        what_we_do_title: city.what_we_do_title || '',
        what_we_do_subtitle: city.what_we_do_subtitle || '',
        what_we_do_description_html: city.what_we_do_description_html || '',
        portfolio_title_template: city.portfolio_title_template || '',
        exhibiting_experience_title: city.exhibiting_experience_title || '',
        exhibiting_experience_subtitle: city.exhibiting_experience_subtitle || '',
        exhibiting_experience_benefits_html: city.exhibiting_experience_benefits_html || '',
        exhibiting_experience_excellence_title: city.exhibiting_experience_excellence_title || '',
        exhibiting_experience_excellence_subtitle: city.exhibiting_experience_excellence_subtitle || '',
        exhibiting_experience_excellence_points_html: city.exhibiting_experience_excellence_points_html || '',
      })
    }
  }, [city])

  const handleSave = async () => {
    if (!id) return
    
    setSaving(true)
    
    try {
      // First, upload any pending files
      const uploadedImages: Record<string, string> = {}
      
      for (const [field, file] of Object.entries(tempFiles)) {
        try {
          // Upload the file
          const { data, error } = await CitiesService.uploadImage(file)
          
          if (error) throw new Error(error)
          if (!data) throw new Error('No URL returned from upload')
          
          uploadedImages[field] = data
          
          // Delete the previous image if it exists
          const currentImageUrl = formData[field as keyof CityData]
          if (currentImageUrl && typeof currentImageUrl === 'string') {
            try {
              await CitiesService.deleteImage(currentImageUrl)
            } catch (deleteError) {
              console.warn('Failed to delete previous image:', deleteError)
            }
          }
        } catch (uploadError) {
          console.error(`Failed to upload image for field ${field}:`, uploadError)
          toast.error(`Failed to upload image for field ${field}`)
          throw uploadError
        }
      }

      // Handle image deletions (marked with empty string)
      const fieldsToDelete: string[] = []
      Object.entries(tempImages).forEach(([field, url]) => {
        if (url === '' && formData[field as keyof CityData]) {
          fieldsToDelete.push(field)
        }
      })

      // Prepare the data to save
      const dataToSave: any = {
        ...formData,
        ...uploadedImages
      }

      // Set deleted image fields to null
      fieldsToDelete.forEach(field => {
        dataToSave[field] = null
        // Actually delete the image from storage
        try {
          const imageUrl = formData[field as keyof CityData];
          if (typeof imageUrl === 'string' && imageUrl) {
            CitiesService.deleteImage(imageUrl);
          }
        } catch (deleteError) {
          console.warn('Failed to delete image:', deleteError)
        }
      })

      const { error } = await CitiesService.updateCity(id, {
        name: dataToSave.name,
        city_slug: dataToSave.city_slug,
        country_slug: dataToSave.country_slug,
        is_active: dataToSave.is_active,
        seo_title: dataToSave.seo_title,
        seo_description: dataToSave.seo_description,
        seo_keywords: dataToSave.seo_keywords,
        hero_title: dataToSave.hero_title,
        hero_subtitle: dataToSave.hero_subtitle,
        hero_background_image_url: dataToSave.hero_background_image_url,
        why_choose_us_title: dataToSave.why_choose_us_title,
        why_choose_us_subtitle: dataToSave.why_choose_us_subtitle,
        why_choose_us_main_image_url: dataToSave.why_choose_us_main_image_url,
        why_choose_us_benefits_html: dataToSave.why_choose_us_benefits_html,
        what_we_do_title: dataToSave.what_we_do_title,
        what_we_do_subtitle: dataToSave.what_we_do_subtitle,
        what_we_do_description_html: dataToSave.what_we_do_description_html,
        portfolio_title_template: dataToSave.portfolio_title_template,
        exhibiting_experience_title: dataToSave.exhibiting_experience_title,
        exhibiting_experience_subtitle: dataToSave.exhibiting_experience_subtitle,
        exhibiting_experience_benefits_html: dataToSave.exhibiting_experience_benefits_html,
        exhibiting_experience_excellence_title: dataToSave.exhibiting_experience_excellence_title,
        exhibiting_experience_excellence_subtitle: dataToSave.exhibiting_experience_excellence_subtitle,
        exhibiting_experience_excellence_points_html: dataToSave.exhibiting_experience_excellence_points_html,
      })

      if (error) throw new Error(error)
      
      // Clear temp states after successful save
      setTempFiles({})
      setTempImages({})
      
      toast.success('City updated successfully!')
      navigate('/admin/cities')
    } catch (error: any) {
      console.error('Error updating city:', error)
      toast.error(`Failed to update city: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File, field: string) => {
    setUploading(field)
    
    try {
      // Store the selected file in temp state (not uploaded yet)
      setTempFiles(prev => ({
        ...prev,
        [field]: file
      }))

      // Also store a preview URL for immediate preview
      const previewUrl = URL.createObjectURL(file)
      setTempImages(prev => ({
        ...prev,
        [field]: previewUrl
      }))

      toast.success('Image selected successfully! It will be uploaded when you save changes.')
    } catch (error: any) {
      console.error('Error selecting image:', error)
      toast.error(`Failed to select image: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(null)
    }
  }

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<{field: string, url: string} | null>(null)

  // Function to confirm image deletion
  const confirmImageDeletion = (field: string) => {
    const imageUrl = getImageUrl(field)
    if (imageUrl) {
      setImageToDelete({ field, url: imageUrl })
      setDeleteDialogOpen(true)
    }
  }

  // Function to remove an image (with confirmation)
  const removeImage = async (field: string) => {
    // Check if this is a temporary image or an existing one
    const isTempImage = !!tempImages[field];
    const isTempFile = !!tempFiles[field];
    const isExistingImage = !!formData[field as keyof CityData];
    
    if (isTempImage || isTempFile) {
      // Remove temporary image/file
      setTempImages(prev => {
        const newTempImages = { ...prev };
        if (newTempImages[field]) {
          // Revoke the object URL to free memory
          if (newTempImages[field].startsWith('blob:')) {
            URL.revokeObjectURL(newTempImages[field]);
          }
          delete newTempImages[field];
        }
        return newTempImages;
      });
      
      setTempFiles(prev => {
        const newTempFiles = { ...prev };
        delete newTempFiles[field];
        return newTempFiles;
      });
      
      toast.success('Image removed successfully');
      return;
    }
    
    if (isExistingImage) {
      // For existing images, we need to handle this during save
      // We'll mark it for deletion during save
      setTempImages(prev => ({
        ...prev,
        [field]: '' // Mark as empty to be deleted during save
      }));
      
      toast.success('Image marked for removal. It will be deleted when you save changes.');
    }
  }

  // Handle confirmed image deletion
  const handleConfirmedImageDeletion = async () => {
    if (!imageToDelete) return;
    
    const { field, url: _url } = imageToDelete;
    
    try {
      // Delete from storage
      const { error } = await CitiesService.deleteImage(imageToDelete.url);
      
      if (error) {
        throw new Error(error);
      }
      
      // Update form data to remove the image URL
      setFormData(prev => ({
        ...prev,
        [field]: ''
      }));
      
      toast.success('Image deleted successfully');
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error(`Failed to delete image: ${error.message || 'Unknown error'}`);
    } finally {
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug when city name is changed
    if (field === 'name') {
      const generatedSlug = slugify(value)
      setFormData(prev => ({
        ...prev,
        city_slug: generatedSlug
      }))
    }
  }

  const handleKeywordsChange = (keywords: string[]) => {
    handleInputChange('seo_keywords', keywords.join(', '))
  }

  const getKeywordsArray = () => {
    return formData.seo_keywords ? formData.seo_keywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  // Get image URL for preview (from temp images first, then from form data)
  const getImageUrl = (field: string): string => {
    // Check if we have a temporary preview URL
    if (tempImages[field]) {
      return tempImages[field]
    }
    // Otherwise, use the URL from form data
    const value = formData[field as keyof CityData]
    return typeof value === 'string' ? value : ''
  }

  // Cleanup temporary files and preview URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke object URLs to free memory
      Object.values(tempImages).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [tempImages])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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
        Error loading city: {error}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirm Image Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmedImageDeletion}>
              Delete Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Edit City</h1>
        <p className="text-muted-foreground">Edit city information for exhibition stand services</p>
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
              <Label htmlFor="name">City Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Paris"
              />
            </div>
            <div>
              <Label htmlFor="country_slug">Country Slug *</Label>
              <Input
                id="country_slug"
                value={formData.country_slug}
                onChange={(e) => handleInputChange('country_slug', e.target.value)}
                placeholder="e.g., france"
              />
            </div>
            <div>
              <Label htmlFor="city_slug">City Slug *</Label>
              <Input
                id="city_slug"
                value={formData.city_slug}
                onChange={(e) => handleInputChange('city_slug', e.target.value)}
                placeholder="e.g., paris"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2: Hero Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                placeholder="Hero title"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Input
                id="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                placeholder="Hero subtitle"
              />
            </div>
            <div>
              <Label htmlFor="hero_background_image_url">Background Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="hero_background_image_url"
                    value={getImageUrl('hero_background_image_url')}
                    onChange={(e) => handleInputChange('hero_background_image_url', e.target.value)}
                    placeholder="Image URL or upload below"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('hero-bg-upload')?.click()}
                    disabled={uploading === 'hero_background_image_url'}
                  >
                    {uploading === 'hero_background_image_url' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {getImageUrl('hero_background_image_url') && (
                  <div className="relative inline-block">
                    <img 
                      src={getImageUrl('hero_background_image_url')} 
                      alt="Hero background preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => {
                        // Check if it's an existing image (from formData) or a temp image
                        const isExistingImage = formData.hero_background_image_url && 
                          getImageUrl('hero_background_image_url') === formData.hero_background_image_url;
                        
                        if (isExistingImage) {
                          confirmImageDeletion('hero_background_image_url');
                        } else {
                          removeImage('hero_background_image_url');
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <input
                  id="hero-bg-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    e.preventDefault();
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'hero_background_image_url')
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Why Choose Us Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 3: Why Choose Us Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="why_choose_us_title">Title</Label>
              <Input
                id="why_choose_us_title"
                value={formData.why_choose_us_title}
                onChange={(e) => handleInputChange('why_choose_us_title', e.target.value)}
                placeholder="Title"
              />
            </div>
            <div>
              <Label htmlFor="why_choose_us_subtitle">Subtitle</Label>
              <Input
                id="why_choose_us_subtitle"
                value={formData.why_choose_us_subtitle}
                onChange={(e) => handleInputChange('why_choose_us_subtitle', e.target.value)}
                placeholder="Subtitle"
              />
            </div>
            <div>
              <Label htmlFor="why_choose_us_main_image_url">Main Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="why_choose_us_main_image_url"
                    value={getImageUrl('why_choose_us_main_image_url')}
                    onChange={(e) => handleInputChange('why_choose_us_main_image_url', e.target.value)}
                    placeholder="Image URL or upload below"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('why-choose-us-img-upload')?.click()}
                    disabled={uploading === 'why_choose_us_main_image_url'}
                  >
                    {uploading === 'why_choose_us_main_image_url' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {getImageUrl('why_choose_us_main_image_url') && (
                  <div className="relative inline-block">
                    <img 
                      src={getImageUrl('why_choose_us_main_image_url')} 
                      alt="Why choose us preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => {
                        // Check if it's an existing image (from formData) or a temp image
                        const isExistingImage = formData.why_choose_us_main_image_url && 
                          getImageUrl('why_choose_us_main_image_url') === formData.why_choose_us_main_image_url;
                        
                        if (isExistingImage) {
                          confirmImageDeletion('why_choose_us_main_image_url');
                        } else {
                          removeImage('why_choose_us_main_image_url');
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <input
                  id="why-choose-us-img-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    e.preventDefault();
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'why_choose_us_main_image_url')
                  }}
                />
              </div>
            </div>
            <div>
              <Label>Benefits Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.why_choose_us_benefits_html}
                onChange={(newContent) => handleInputChange('why_choose_us_benefits_html', newContent)}
              />
            </div>
          </div>
        </div>

        {/* Section 4: What We Do Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 4: What We Do Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="what_we_do_title">Title</Label>
              <Input
                id="what_we_do_title"
                value={formData.what_we_do_title}
                onChange={(e) => handleInputChange('what_we_do_title', e.target.value)}
                placeholder="Title"
              />
            </div>
            <div>
              <Label htmlFor="what_we_do_subtitle">Subtitle</Label>
              <Input
                id="what_we_do_subtitle"
                value={formData.what_we_do_subtitle}
                onChange={(e) => handleInputChange('what_we_do_subtitle', e.target.value)}
                placeholder="Subtitle"
              />
            </div>
            <div>
              <Label>Description (Rich Text)</Label>
              <RichTextEditor
                content={formData.what_we_do_description_html}
                onChange={(newContent) => handleInputChange('what_we_do_description_html', newContent)}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Portfolio Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 5: Portfolio Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="portfolio_title_template">Portfolio Title Template</Label>
              <Input
                id="portfolio_title_template"
                value={formData.portfolio_title_template}
                onChange={(e) => handleInputChange('portfolio_title_template', e.target.value)}
                placeholder="e.g., Our Portfolio in {city_name}"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Exhibiting Experience Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 6: Exhibiting Experience Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exhibiting_experience_title">Title</Label>
              <Input
                id="exhibiting_experience_title"
                value={formData.exhibiting_experience_title}
                onChange={(e) => handleInputChange('exhibiting_experience_title', e.target.value)}
                placeholder="Title"
              />
            </div>
            <div>
              <Label htmlFor="exhibiting_experience_subtitle">Subtitle</Label>
              <Input
                id="exhibiting_experience_subtitle"
                value={formData.exhibiting_experience_subtitle}
                onChange={(e) => handleInputChange('exhibiting_experience_subtitle', e.target.value)}
                placeholder="Subtitle"
              />
            </div>
            <div>
              <Label>Benefits Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.exhibiting_experience_benefits_html}
                onChange={(newContent) => handleInputChange('exhibiting_experience_benefits_html', newContent)}
              />
            </div>
          </div>
        </div>

        {/* Section 7: Excellence Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 7: Excellence Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="exhibiting_experience_excellence_title">Excellence Title</Label>
              <Input
                id="exhibiting_experience_excellence_title"
                value={formData.exhibiting_experience_excellence_title}
                onChange={(e) => handleInputChange('exhibiting_experience_excellence_title', e.target.value)}
                placeholder="FROM CONCEPT TO SHOWCASE: WE DELIVER"
              />
            </div>
            <div>
              <Label htmlFor="exhibiting_experience_excellence_subtitle">Excellence Subtitle</Label>
              <Input
                id="exhibiting_experience_excellence_subtitle"
                value={formData.exhibiting_experience_excellence_subtitle}
                onChange={(e) => handleInputChange('exhibiting_experience_excellence_subtitle', e.target.value)}
                placeholder="EXCELLENCE!"
              />
            </div>
            <div>
              <Label>Excellence Points (Rich Text)</Label>
              <RichTextEditor
                content={formData.exhibiting_experience_excellence_points_html}
                onChange={(newContent) => handleInputChange('exhibiting_experience_excellence_points_html', newContent)}
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                placeholder="SEO title for the city page"
              />
            </div>
            <div>
              <Label htmlFor="seo_description">SEO Description</Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                placeholder="SEO description for the city page"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="seo_keywords">SEO Keywords</Label>
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
        <div className="flex justify-end pt-6 border-t space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/admin/cities')}
          >
            Cancel
          </Button>
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
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}