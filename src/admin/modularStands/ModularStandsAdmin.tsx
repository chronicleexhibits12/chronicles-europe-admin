import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ModularStandsAdminSkeleton } from '@/components/ModularStandsAdminSkeleton'
import { useModularStandsContent } from '@/hooks/useModularStandsContent'
import { ModularStandsPageService } from '@/data/modularStandsService'
import { Loader2, Save, Upload, X } from 'lucide-react'
import { toast } from 'sonner'

export function ModularStandsAdmin() {
  const { content, loading, error, updateContent } = useModularStandsContent()
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({})
  
  // Form state
  const [formData, setFormData] = useState<any>({})
  
  // File input refs
  const benefitsImageRef = useRef<HTMLInputElement>(null)
  const exhibitionBenefitsImageRef = useRef<HTMLInputElement>(null)

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

    const uploadPromise = ModularStandsPageService.uploadImage(file)
    
    toast.promise(uploadPromise, {
      loading: 'Uploading image...',
      success: (result) => {
        if (result.data) {
          handleInputChange(section, field, result.data)
          // Trigger revalidation after successful image upload
          ModularStandsPageService.triggerRevalidation()
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
      success: (result) => {
        if (result.data) {
          // Update local form data with saved data
          setFormData(result.data)
          return 'Modular stands page updated successfully!'
        } else {
          throw new Error(result.error || 'Update failed')
        }
      },
      error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
    })

    try {
      await savePromise
      // Trigger revalidation after successful save
      await ModularStandsPageService.triggerRevalidation()
    } finally {
      setSaving(false)
    }
  }

  // Get current image URL for a field (from form data)
  const getCurrentImageUrl = (section: string, field: string): string => {
    return formData[section]?.[field] || ''
  }

  if (loading) {
    return <ModularStandsAdminSkeleton />
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
        <h1 className="text-2xl font-bold mb-2">Modular Stands Admin</h1>
        <p className="text-muted-foreground">Edit your modular stands page content and images</p>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* Section 1: Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 1 [Hero Section]</h2>
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
          </div>
        </div>

        {/* Section 2: Benefits Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2 [Benefits Section]</h2>
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
                <div className="flex gap-2">
                  <div className="hidden">
                    <Input
                      id="benefits-image"
                      value={getCurrentImageUrl('benefits', 'image')}
                      onChange={(e) => handleInputChange('benefits', 'image', e.target.value)}
                      placeholder="Image URL or upload below"
                    />
                  </div>
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
                  >
                    {uploadingImages['benefits-image'] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </>
                    )}
                  </Button>
                </div>
                {getCurrentImageUrl('benefits', 'image') && (
                  <div className="relative inline-block">
                    <img 
                      src={getCurrentImageUrl('benefits', 'image')} 
                      alt="Benefits preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => handleInputChange('benefits', 'image', '')}
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

        {/* Section 3: Points Table Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 3 [Points Table Section]</h2>
          <div className="space-y-4">
            <div className="w-full">
              <Label htmlFor="points-table-title">Title</Label>
              <Input
                id="points-table-title"
                value={formData.pointsTable?.title || ''}
                onChange={(e) => handleInputChange('pointsTable', 'title', e.target.value)}
              />
            </div>
            <div className="w-full">
              <Label>Points Table Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.pointsTable?.content || ''}
                onChange={(newContent) => handleInputChange('pointsTable', 'content', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Stand Project Text Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 4 [Stand Project Text Section]</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stand-project-title">Title</Label>
                <Input
                  id="stand-project-title"
                  value={formData.standProjectText?.title || ''}
                  onChange={(e) => handleInputChange('standProjectText', 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="stand-project-highlight">Highlight Text</Label>
                <Input
                  id="stand-project-highlight"
                  value={formData.standProjectText?.highlight || ''}
                  onChange={(e) => handleInputChange('standProjectText', 'highlight', e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <Label>Description (Rich Text)</Label>
              <RichTextEditor
                content={formData.standProjectText?.description || ''}
                onChange={(newContent) => handleInputChange('standProjectText', 'description', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Exhibition Benefits Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 5 [Exhibition Benefits Section]</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exhibition-benefits-title">Title</Label>
                <Input
                  id="exhibition-benefits-title"
                  value={formData.exhibitionBenefits?.title || ''}
                  onChange={(e) => handleInputChange('exhibitionBenefits', 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="exhibition-benefits-subtitle">Subtitle</Label>
                <Input
                  id="exhibition-benefits-subtitle"
                  value={formData.exhibitionBenefits?.subtitle || ''}
                  onChange={(e) => handleInputChange('exhibitionBenefits', 'subtitle', e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="exhibition-benefits-image">Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="hidden">
                    <Input
                      id="exhibition-benefits-image"
                      value={getCurrentImageUrl('exhibitionBenefits', 'image')}
                      onChange={(e) => handleInputChange('exhibitionBenefits', 'image', e.target.value)}
                      placeholder="Image URL or upload below"
                    />
                  </div>
                  <input
                    ref={exhibitionBenefitsImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, 'exhibitionBenefits', 'image')
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => exhibitionBenefitsImageRef.current?.click()}
                    disabled={uploadingImages['exhibitionBenefits-image']}
                  >
                    {uploadingImages['exhibitionBenefits-image'] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </>
                    )}
                  </Button>
                </div>
                {getCurrentImageUrl('exhibitionBenefits', 'image') && (
                  <div className="relative inline-block">
                    <img 
                      src={getCurrentImageUrl('exhibitionBenefits', 'image')} 
                      alt="Exhibition benefits preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => handleInputChange('exhibitionBenefits', 'image', '')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <Label>Exhibition Benefits Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.exhibitionBenefits?.content || ''}
                onChange={(newContent) => handleInputChange('exhibitionBenefits', 'content', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 6: Modular Diversity Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 6 [Modular Diversity Section]</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="modular-diversity-title">Title</Label>
                <Input
                  id="modular-diversity-title"
                  value={formData.modularDiversity?.title || ''}
                  onChange={(e) => handleInputChange('modularDiversity', 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="modular-diversity-subtitle">Subtitle</Label>
                <Input
                  id="modular-diversity-subtitle"
                  value={formData.modularDiversity?.subtitle || ''}
                  onChange={(e) => handleInputChange('modularDiversity', 'subtitle', e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <Label>Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.modularDiversity?.content || ''}
                onChange={(newContent) => handleInputChange('modularDiversity', 'content', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 7: Fastest Construction Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 7 [Fastest Construction Section]</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fastest-construction-title">Title</Label>
                <Input
                  id="fastest-construction-title"
                  value={formData.fastestConstruction?.title || ''}
                  onChange={(e) => handleInputChange('fastestConstruction', 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fastest-construction-subtitle">Subtitle</Label>
                <Input
                  id="fastest-construction-subtitle"
                  value={formData.fastestConstruction?.subtitle || ''}
                  onChange={(e) => handleInputChange('fastestConstruction', 'subtitle', e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <Label>Description (Rich Text)</Label>
              <RichTextEditor
                content={formData.fastestConstruction?.description || ''}
                onChange={(newContent) => handleInputChange('fastestConstruction', 'description', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 8: Experts Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 8 [Experts Section]</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experts-title">Title</Label>
                <Input
                  id="experts-title"
                  value={formData.experts?.title || ''}
                  onChange={(e) => handleInputChange('experts', 'title', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="experts-subtitle">Subtitle</Label>
                <Input
                  id="experts-subtitle"
                  value={formData.experts?.subtitle || ''}
                  onChange={(e) => handleInputChange('experts', 'subtitle', e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <Label>Description (Rich Text)</Label>
              <RichTextEditor
                content={formData.experts?.description || ''}
                onChange={(newContent) => handleInputChange('experts', 'description', newContent)}
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