import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { TagInput } from '@/components/ui/tag-input'
import { Loader2, Save, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { useTradeShowsPage } from '@/hooks/useTradeShowsContent'
import { TradeShowsService } from '@/data/tradeShowsService'

export function TradeShowsPageAdmin() {
  const navigate = useNavigate()
  const { data: page, loading, error } = useTradeShowsPage()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    // Meta Information
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    
    // Hero Section
    heroTitle: '',
    heroSubtitle: '',
    heroBackgroundImage: '',
    heroBackgroundImageAlt: '',
    
    // Content Section
    description: '',
  })

  // Temporary state for selected files (not yet uploaded)
  const [tempFiles, setTempFiles] = useState<Record<string, File>>({})

  // Temporary state for uploaded images (not yet saved)
  const [tempImages, setTempImages] = useState<Record<string, string>>({})

  // Initialize form with page data
  useEffect(() => {
    if (page) {
      setFormData({
        metaTitle: page.meta.title || '',
        metaDescription: page.meta.description || '',
        metaKeywords: page.meta.keywords || '',
        heroTitle: page.hero.title || '',
        heroSubtitle: page.hero.subtitle || '',
        heroBackgroundImage: page.hero.backgroundImage || '',
        heroBackgroundImageAlt: page.hero.backgroundImageAlt || '',
        description: page.description || '',
      })
    }
  }, [page])

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

  // Cleanup temporary images when component unmounts
  useEffect(() => {
    return () => {
      // Delete all temporary images if they exist
      Object.values(tempImages).forEach(async (imageUrl) => {
        if (imageUrl) {
          try {
            await TradeShowsService.deleteImage(imageUrl)
          } catch (error) {
            console.warn('Failed to delete temporary image on unmount:', error)
          }
        }
      })
    }
  }, [tempImages])

  const handleSave = async () => {
    if (!page?.id) return
    
    setSaving(true)
    
    try {
      // First, upload any pending files
      const uploadedImages: Record<string, string> = {}
      
      for (const [field, file] of Object.entries(tempFiles)) {
        try {
          // Upload the file
          const { data, error } = await TradeShowsService.uploadImage(file)
          
          if (error) throw new Error(error)
          if (!data) throw new Error('No URL returned from upload')
          
          uploadedImages[field] = data
        } catch (uploadError) {
          console.error(`Failed to upload image for field ${field}:`, uploadError)
          toast.error(`Failed to upload image for field ${field}`)
          throw uploadError
        }
      }

      // Merge form data with newly uploaded images
      const dataToSave = {
        ...formData,
        ...uploadedImages
      }

      const { error } = await TradeShowsService.updateTradeShowsPage(page.id, {
        meta: {
          title: dataToSave.metaTitle,
          description: dataToSave.metaDescription,
          keywords: dataToSave.metaKeywords,
        },
        hero: {
          id: page.hero.id,
          title: dataToSave.heroTitle,
          subtitle: dataToSave.heroSubtitle,
          backgroundImage: dataToSave.heroBackgroundImage,
          backgroundImageAlt: dataToSave.heroBackgroundImageAlt,
        },
        description: dataToSave.description,
        isActive: true,
      })

      if (error) throw new Error(error)
      
      // Clear temp states after successful save
      setTempFiles({})
      setTempImages({})
      
      toast.success('Trade shows page updated successfully!')
    } catch (error: any) {
      console.error('Error updating trade shows page:', error)
      toast.error(`Failed to update trade shows page: ${error.message || 'Unknown error'}`)
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

  // Function to remove an image (with confirmation)
  const removeImage = async (field: string) => {
    // Check if this is a temporary image or an existing one
    const isTempImage = !!tempImages[field];
    const isTempFile = !!tempFiles[field];
    
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
    } else {
      // Remove existing image
      setFormData(prev => ({
        ...prev,
        [field]: ''
      }));
      toast.success('Image removed successfully');
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleKeywordsChange = (keywords: string[]) => {
    handleInputChange('metaKeywords', keywords.join(', '))
  }

  const getKeywordsArray = () => {
    return formData.metaKeywords ? formData.metaKeywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  // Get image URL for preview (from temp images first, then from form data)
  const getImageUrl = (field: string): string => {
    // Check if we have a temporary preview URL
    if (tempImages[field]) {
      return tempImages[field]
    }
    // Otherwise, use the URL from form data
    const value = formData[field as keyof typeof formData]
    return typeof value === 'string' ? value : ''
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
        Error loading trade shows page: {error}
      </div>
    )
  }

  if (!page && !loading) {
    return (
      <div className="p-8 text-center text-red-600">
        Trade shows page not found
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Trade Shows Page</h1>
        <p className="text-muted-foreground">Manage the trade shows landing page content</p>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={(e) => {
        e.preventDefault(); // Prevent page reload
        handleSave();
      }}>
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
                placeholder="SEO title for the trade shows page"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="metaDescription">SEO Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder="SEO description for the trade shows page"
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

        {/* Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={formData.heroTitle}
                onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                placeholder="Hero title"
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                placeholder="Hero subtitle"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="heroBackgroundImage">Background Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="heroBackgroundImage"
                    value={getImageUrl('heroBackgroundImage')}
                    onChange={(e) => handleInputChange('heroBackgroundImage', e.target.value)}
                    placeholder="Image URL or upload below"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('hero-bg-upload')?.click()}
                    disabled={uploading === 'heroBackgroundImage'}
                  >
                    {uploading === 'heroBackgroundImage' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {getImageUrl('heroBackgroundImage') && (
                  <div className="relative inline-block">
                    <img 
                      src={getImageUrl('heroBackgroundImage')} 
                      alt="Hero background preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('heroBackgroundImage')}
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
                    if (file) handleImageUpload(file, 'heroBackgroundImage')
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="heroBackgroundImageAlt">Background Image Alt Text</Label>
              <Input
                id="heroBackgroundImageAlt"
                value={formData.heroBackgroundImageAlt}
                onChange={(e) => handleInputChange('heroBackgroundImageAlt', e.target.value)}
                placeholder="e.g., Trade shows and exhibitions in Europe"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Content Section</h2>
          <div className="w-full">
            <Label>Description (Rich Text)</Label>
            <RichTextEditor
              content={formData.description}
              onChange={(newContent) => handleInputChange('description', newContent)}
            />
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
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}