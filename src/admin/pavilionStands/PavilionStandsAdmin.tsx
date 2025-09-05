import { useState, useEffect } from 'react'
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
  const [uploading, setUploading] = useState<string | null>(null)
  
  // Temporary state for uploaded images (not yet saved)
  const [tempImages, setTempImages] = useState<Record<string, string>>({})
  
  // Temporary state for selected files (not yet uploaded)
  const [tempFiles, setTempFiles] = useState<Record<string, File>>({})
  
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
            await PavilionStandsPageService.deleteImage(imageUrl)
          } catch (error) {
            console.warn('Failed to delete temporary image on unmount:', error)
          }
        }
      })
    }
  }, [tempImages])

  const handleSave = async () => {
    if (!content) return
    
    setSaving(true)
    
    try {
      // First, upload any pending files
      const uploadedImages: Record<string, string> = {}
      
      for (const [field, file] of Object.entries(tempFiles)) {
        try {
          // Upload the file
          const { data, error } = await PavilionStandsPageService.uploadImage(file)
          
          if (error) throw new Error(error)
          if (!data) throw new Error('No URL returned from upload')
          
          uploadedImages[field] = data
          
          // Delete the previous image if it exists
          const currentImageUrl = getCurrentImageUrl(field)
          if (currentImageUrl) {
            try {
              await PavilionStandsPageService.deleteImage(currentImageUrl)
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
      
      // Update content with newly uploaded images
      let updatedContent = { ...content }
      
      for (const [field, url] of Object.entries(uploadedImages)) {
        switch (field) {
          case 'hero-bg':
            updatedContent = {
              ...updatedContent,
              hero: { ...updatedContent.hero, backgroundImage: url }
            }
            break
          case 'benefits-img':
            updatedContent = {
              ...updatedContent,
              benefits: { ...updatedContent.benefits, image: url }
            }
            break
          case 'advantages-img':
            updatedContent = {
              ...updatedContent,
              advantages: { ...updatedContent.advantages, image: url }
            }
            break
        }
      }
      
      const savePromise = updateContent(updatedContent)
      
      toast.promise(savePromise, {
        loading: 'Saving changes...',
        success: async () => {
          // Trigger revalidation after successful save
          await PavilionStandsPageService.triggerRevalidation()
          return 'Pavilion stands page updated successfully!'
        },
        error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
      })
      
      // Clear temp states after successful save
      setTempFiles({})
      setTempImages({})
      
      // Trigger revalidation after successful save
      await PavilionStandsPageService.triggerRevalidation()
    } catch (error: any) {
      console.error('Error saving content:', error)
      toast.error(`Failed to save: ${error.message || 'Unknown error'}`)
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

  // Function to remove an image (with confirmation for existing images)
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
    }
  }

  // Get current image URL for a field (from temp images first, then from content)
  const getCurrentImageUrl = (field: string): string => {
    // Check if we have a temporary preview URL
    if (tempImages[field]) {
      return tempImages[field]
    }
    
    // Otherwise, use the URL from content based on field
    switch (field) {
      case 'hero-bg':
        return content?.hero?.backgroundImage || ''
      case 'benefits-img':
        return content?.benefits?.image || ''
      case 'advantages-img':
        return content?.advantages?.image || ''
      default:
        return ''
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
                  value={content.hero?.title || ''}
                  onChange={(e) => updateContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                <Input
                  id="hero-subtitle"
                  value={content.hero?.subtitle || ''}
                  onChange={(e) => updateContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="hero-background">Background Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="hero-background"
                    value={getCurrentImageUrl('hero-bg')}
                    onChange={(e) => {
                      // For direct URL input, we update the content directly
                      if (!tempImages['hero-bg'] && !tempFiles['hero-bg']) {
                        updateContent({
                          ...content,
                          hero: { ...content.hero, backgroundImage: e.target.value }
                        })
                      }
                    }}
                    placeholder="Image URL or upload below"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('hero-bg-upload')?.click()}
                    disabled={uploading === 'hero-bg'}
                  >
                    {uploading === 'hero-bg' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {getCurrentImageUrl('hero-bg') && (
                  <div className="relative inline-block">
                    <img 
                      src={getCurrentImageUrl('hero-bg')} 
                      alt="Hero background preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('hero-bg')}
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
                    if (file) handleImageUpload(file, 'hero-bg')
                  }}
                />
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
                value={content.whyChoose?.title || ''}
                onChange={(e) => updateContent({
                  ...content,
                  whyChoose: { ...content.whyChoose, title: e.target.value }
                })}
              />
            </div>
            <div className="w-full">
              <Label>Content (Rich Text)</Label>
              <RichTextEditor
                content={content.whyChoose?.content || ''}
                onChange={(newContent) => updateContent({
                  ...content,
                  whyChoose: { ...content.whyChoose, content: newContent }
                })}
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
                value={content.benefits?.title || ''}
                onChange={(e) => updateContent({
                  ...content,
                  benefits: { ...content.benefits, title: e.target.value }
                })}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="benefits-image">Benefits Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="benefits-image"
                    value={getCurrentImageUrl('benefits-img')}
                    onChange={(e) => {
                      // For direct URL input, we update the content directly
                      if (!tempImages['benefits-img'] && !tempFiles['benefits-img']) {
                        updateContent({
                          ...content,
                          benefits: { ...content.benefits, image: e.target.value }
                        })
                      }
                    }}
                    placeholder="Image URL or upload below"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('benefits-img-upload')?.click()}
                    disabled={uploading === 'benefits-img'}
                  >
                    {uploading === 'benefits-img' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {getCurrentImageUrl('benefits-img') && (
                  <div className="relative inline-block">
                    <img 
                      src={getCurrentImageUrl('benefits-img')} 
                      alt="Benefits preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('benefits-img')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <input
                  id="benefits-img-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    e.preventDefault();
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'benefits-img')
                  }}
                />
              </div>
            </div>
            <div className="w-full">
              <Label>Benefits Content (Rich Text)</Label>
              <RichTextEditor
                content={content.benefits?.content || ''}
                onChange={(newContent) => updateContent({
                  ...content,
                  benefits: { ...content.benefits, content: newContent }
                })}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Stand Project Text Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 4 (Stand Project Text Section)</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stand-project-title">Title</Label>
                <Input
                  id="stand-project-title"
                  value={content.standProjectText?.title || ''}
                  onChange={(e) => updateContent({
                    ...content,
                    standProjectText: { ...content.standProjectText, title: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="stand-project-highlight">Highlight Text</Label>
                <Input
                  id="stand-project-highlight"
                  value={content.standProjectText?.highlight || ''}
                  onChange={(e) => updateContent({
                    ...content,
                    standProjectText: { ...content.standProjectText, highlight: e.target.value }
                  })}
                />
              </div>
            </div>
            <div className="w-full">
              <Label>Description (Rich Text)</Label>
              <RichTextEditor
                content={content.standProjectText?.description || ''}
                onChange={(newContent) => updateContent({
                  ...content,
                  standProjectText: { ...content.standProjectText, description: newContent }
                })}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Advantages Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 5 (Advantages Section)</h2>
          <div className="space-y-4">
            <div className="w-full">
              <Label htmlFor="advantages-title">Title</Label>
              <Input
                id="advantages-title"
                value={content.advantages?.title || ''}
                onChange={(e) => updateContent({
                  ...content,
                  advantages: { ...content.advantages, title: e.target.value }
                })}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="advantages-image">Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="advantages-image"
                    value={getCurrentImageUrl('advantages-img')}
                    onChange={(e) => {
                      // For direct URL input, we update the content directly
                      if (!tempImages['advantages-img'] && !tempFiles['advantages-img']) {
                        updateContent({
                          ...content,
                          advantages: { ...content.advantages, image: e.target.value }
                        })
                      }
                    }}
                    placeholder="Image URL or upload below"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('advantages-img-upload')?.click()}
                    disabled={uploading === 'advantages-img'}
                  >
                    {uploading === 'advantages-img' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {getCurrentImageUrl('advantages-img') && (
                  <div className="relative inline-block">
                    <img 
                      src={getCurrentImageUrl('advantages-img')} 
                      alt="Advantages preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('advantages-img')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <input
                  id="advantages-img-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    e.preventDefault();
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'advantages-img')
                  }}
                />
              </div>
            </div>
            <div className="w-full">
              <Label>Advantages Content (Rich Text)</Label>
              <RichTextEditor
                content={content.advantages?.content || ''}
                onChange={(newContent) => updateContent({
                  ...content,
                  advantages: { ...content.advantages, content: newContent }
                })}
              />
            </div>
          </div>
        </div>

        {/* Section 6: Our Expertise Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 6 (Our Expertise Section)</h2>
          <div className="space-y-4">
            <div className="w-full">
              <Label htmlFor="our-expertise-title">Title</Label>
              <Input
                id="our-expertise-title"
                value={content.ourExpertise?.title || ''}
                onChange={(e) => updateContent({
                  ...content,
                  ourExpertise: { ...content.ourExpertise, title: e.target.value }
                })}
              />
            </div>
            <div className="w-full">
              <Label>Content (Rich Text)</Label>
              <RichTextEditor
                content={content.ourExpertise?.content || ''}
                onChange={(newContent) => updateContent({
                  ...content,
                  ourExpertise: { ...content.ourExpertise, content: newContent }
                })}
              />
            </div>
          </div>
        </div>

        {/* Section 7: Company Info Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 7 (Company Info Section)</h2>
          <div className="space-y-4">
            <div className="w-full">
              <Label htmlFor="company-info-title">Title</Label>
              <Input
                id="company-info-title"
                value={content.companyInfo?.title || ''}
                onChange={(e) => updateContent({
                  ...content,
                  companyInfo: { ...content.companyInfo, title: e.target.value }
                })}
              />
            </div>
            <div className="w-full">
              <Label>Content (Rich Text)</Label>
              <RichTextEditor
                content={content.companyInfo?.content || ''}
                onChange={(newContent) => updateContent({
                  ...content,
                  companyInfo: { ...content.companyInfo, content: newContent }
                })}
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
                value={content.meta?.title || ''}
                onChange={(e) => updateContent({
                  ...content,
                  meta: { ...content.meta, title: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={content.meta?.description || ''}
                onChange={(e) => updateContent({
                  ...content,
                  meta: { ...content.meta, description: e.target.value }
                })}
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