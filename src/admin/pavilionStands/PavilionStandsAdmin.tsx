import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { PavilionStandsAdminSkeleton } from '../../components/PavilionStandsAdminSkeleton'
import { usePavilionStandsContent } from '../../hooks/usePavilionStandsContent'
import { PavilionStandsPageService } from '../../data/pavilionStandsService'
import { Loader2, Save, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

export function PavilionStandsAdmin() {
  const { content, loading, error, updateContent } = usePavilionStandsContent()
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({})
  
  // Form state
  const [formData, setFormData] = useState<any>({})
  
  // File input refs
  const benefitsImageRef = useRef<HTMLInputElement>(null)
  const advantagesImageRef = useRef<HTMLInputElement>(null)
  const heroBackgroundImageRef = useRef<HTMLInputElement>(null)

  // Update form data when content loads
  useEffect(() => {
    if (content) {
      setFormData(content)
    }
  }, [content])

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev: any) => {
      const currentSection = (prev[section] as any) || {}
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      }
    })
  }

  const handleImageUpload = async (file: File, section: string, field: string) => {
    const uploadKey = `${section}-${field}`
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }))

    const uploadPromise = PavilionStandsPageService.uploadImage(file)
    
    toast.promise(uploadPromise, {
      loading: 'Uploading image...',
      success: (result) => {
        if (result.data) {
          handleInputChange(section, field, result.data)
          // Trigger revalidation after successful image upload
          PavilionStandsPageService.triggerRevalidation()
          return 'Image uploaded successfully!'
        } else {
          throw new Error(result.error || 'Upload failed')
        }
      },
      error: (error) => `Failed to upload image: ${error.message || 'Unknown error'}`
    })

    try {
      await uploadPromise
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    
    const savePromise = updateContent(formData)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: async (result) => {
        if (result.data) {
          // Update local form data with saved data
          setFormData(result.data)
          // Trigger revalidation after successful save
          await PavilionStandsPageService.triggerRevalidation()
          return 'Pavilion stands page updated successfully!'
        } else {
          throw new Error(result.error || 'Update failed')
        }
      },
      error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
    })

    try {
      await savePromise
    } finally {
      setSaving(false)
    }
  }

  // Get current image URL for a field (from form data)
  const getCurrentImageUrl = (section: string, field: string): string => {
    return formData[section]?.[field] || ''
  }

  // Get current alt text for a field
  const getCurrentImageAlt = (section: string, field: string): string => {
    // Special handling for backgroundImage which has a different alt field name
    if (section === 'hero' && field === 'backgroundImage') {
      return formData[section]?.[`${field}Alt`] || ''
    }
    // For other fields, use the standard pattern
    return formData[section]?.[`${field}Alt`] || ''
  }

  // Update alt text for an image
  const updateImageAlt = (section: string, field: string, altText: string) => {
    // Special handling for backgroundImage which has a different alt field name
    if (section === 'hero' && field === 'backgroundImage') {
      handleInputChange(section, `${field}Alt`, altText)
    } else {
      // For other fields, use the standard pattern
      handleInputChange(section, `${field}Alt`, altText)
    }
  }

  // Remove image
  const removeImage = (section: string, field: string) => {
    handleInputChange(section, field, '')
    // Also clear alt text when removing image
    // Special handling for backgroundImage which has a different alt field name
    if (section === 'hero' && field === 'backgroundImage') {
      handleInputChange(section, `${field}Alt`, '')
    } else {
      // For other fields, use the standard pattern
      handleInputChange(section, `${field}Alt`, '')
    }
  }

  if (loading) {
    return <PavilionStandsAdminSkeleton />
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading content: {error}
      </div>
    )
  }

  if (!content) {
    return (
      <div className="p-8 text-center text-gray-600">
        No content found
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Pavilion Stands Admin</h1>
        <p className="text-muted-foreground">Edit your pavilion stands page content and images</p>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Section 1: Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 1 (Hero Section)</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hero-title">Hero Title</Label>
                <Input
                  id="hero-title"
                  value={formData.hero?.title || ''}
                  onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                <Input
                  id="hero-subtitle"
                  value={formData.hero?.subtitle || ''}
                  onChange={(e) => handleInputChange('hero', 'subtitle', e.target.value)}
                />
              </div>
            </div>
            {/* Add Hero Button Title Field */}
            <div>
              <Label htmlFor="hero-button-title">Hero Button Title</Label>
              <Input
                id="hero-button-title"
                value={formData.hero?.buttonTitle || ''}
                onChange={(e) => handleInputChange('hero', 'buttonTitle', e.target.value)}
                placeholder="e.g., REQUEST FOR QUOTATION"
              />
            </div>
            {/* Hero Background Image */}
            <div className="w-full">
              <Label htmlFor="hero-background-image">Hero Background Image</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      value={getCurrentImageAlt('hero', 'backgroundImage')}
                      onChange={(e) => updateImageAlt('hero', 'backgroundImage', e.target.value)}
                      placeholder="Alt text"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    ref={heroBackgroundImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'hero', 'backgroundImage')
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => heroBackgroundImageRef.current?.click()}
                    disabled={uploadingImages['hero-backgroundImage']}
                    className="flex items-center gap-2"
                  >
                    {uploadingImages['hero-backgroundImage'] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Choose File
                  </Button>
                </div>
                {getCurrentImageUrl('hero', 'backgroundImage') && (
                  <div className="relative inline-block">
                    <img 
                      src={getCurrentImageUrl('hero', 'backgroundImage')} 
                      alt={getCurrentImageAlt('hero', 'backgroundImage') || "Hero background preview"} 
                      className="max-h-16 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('hero', 'backgroundImage')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Why Choose Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2 (Why Choose Section)</h2>
          <div className="space-y-4">
            <div className="w-full">
              <Label htmlFor="why-choose-title">Title</Label>
              <Input
                id="why-choose-title"
                value={formData.whyChoose?.title || ''}
                onChange={(e) => handleInputChange('whyChoose', 'title', e.target.value)}
              />
            </div>
            <div className="w-full">
              <Label>Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.whyChoose?.content || ''}
                onChange={(newContent) => handleInputChange('whyChoose', 'content', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Benefits Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 3 (Benefits Section)</h2>
          <div className="space-y-4">
            <div className="w-full">
              <Label htmlFor="benefits-title">Benefits Title</Label>
              <Input
                id="benefits-title"
                value={formData.benefits?.title || ''}
                onChange={(e) => handleInputChange('benefits', 'title', e.target.value)}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="benefits-image">Benefits Image</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      value={getCurrentImageAlt('benefits', 'image')}
                      onChange={(e) => updateImageAlt('benefits', 'image', e.target.value)}
                      placeholder="Alt text"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    ref={benefitsImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'benefits', 'image')
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => benefitsImageRef.current?.click()}
                    disabled={uploadingImages['benefits-image']}
                    className="flex items-center gap-2"
                  >
                    {uploadingImages['benefits-image'] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Choose File
                  </Button>
                </div>
                {getCurrentImageUrl('benefits', 'image') && (
                  <div className="relative inline-block">
                    <img 
                      src={getCurrentImageUrl('benefits', 'image')} 
                      alt={getCurrentImageAlt('benefits', 'image') || "Benefits preview"} 
                      className="max-h-16 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('benefits', 'image')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <Label>Benefits Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.benefits?.content || ''}
                onChange={(newContent) => handleInputChange('benefits', 'content', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Advantages Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 4 (Advantages Section)</h2>
          <div className="space-y-4">
            <div className="w-full">
              <Label htmlFor="advantages-title">Title</Label>
              <Input
                id="advantages-title"
                value={formData.advantages?.title || ''}
                onChange={(e) => handleInputChange('advantages', 'title', e.target.value)}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="advantages-image">Image</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      value={getCurrentImageAlt('advantages', 'image')}
                      onChange={(e) => updateImageAlt('advantages', 'image', e.target.value)}
                      placeholder="Alt text"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    ref={advantagesImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'advantages', 'image')
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => advantagesImageRef.current?.click()}
                    disabled={uploadingImages['advantages-image']}
                    className="flex items-center gap-2"
                  >
                    {uploadingImages['advantages-image'] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Choose File
                  </Button>
                </div>
                {getCurrentImageUrl('advantages', 'image') && (
                  <div className="relative inline-block">
                    <img 
                      src={getCurrentImageUrl('advantages', 'image')} 
                      alt={getCurrentImageAlt('advantages', 'image') || "Advantages preview"} 
                      className="max-h-16 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('advantages', 'image')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <Label>Advantages Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.advantages?.content || ''}
                onChange={(newContent) => handleInputChange('advantages', 'content', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Our Expertise Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 5 (Our Expertise Section)</h2>
          <div className="space-y-4">
            <div className="w-full">
              <Label htmlFor="our-expertise-title">Title</Label>
              <Input
                id="our-expertise-title"
                value={formData.ourExpertise?.title || ''}
                onChange={(e) => handleInputChange('ourExpertise', 'title', e.target.value)}
              />
            </div>
            <div className="w-full">
              <Label>Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.ourExpertise?.content || ''}
                onChange={(newContent) => handleInputChange('ourExpertise', 'content', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 6: Company Info Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 6 (Company Info Section)</h2>
          <div className="space-y-4">
            <div className="w-full">
              <Label htmlFor="company-info-title">Title</Label>
              <Input
                id="company-info-title"
                value={formData.companyInfo?.title || ''}
                onChange={(e) => handleInputChange('companyInfo', 'title', e.target.value)}
              />
            </div>
            <div className="w-full">
              <Label>Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.companyInfo?.content || ''}
                onChange={(newContent) => handleInputChange('companyInfo', 'content', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* SEO Meta Section - Moved to the end with proper spacing */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Meta Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                value={formData.meta?.title || ''}
                onChange={(e) => handleInputChange('meta', 'title', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta?.description || ''}
                onChange={(e) => handleInputChange('meta', 'description', e.target.value)}
              />
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
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}