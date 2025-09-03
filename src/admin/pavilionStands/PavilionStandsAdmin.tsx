import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { PavilionStandsAdminSkeleton } from '../../components/PavilionStandsAdminSkeleton'
import { usePavilionStandsContent } from '../../hooks/usePavilionStandsContent'
import { PavilionStandsPageService } from '../../data/pavilionStandsService'
import { Loader2, Save, Upload } from 'lucide-react'
import { toast } from 'sonner'

export function PavilionStandsAdmin() {
  const { content, loading, error, updateContent } = usePavilionStandsContent()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  const handleSave = async () => {
    if (!content) return
    
    setSaving(true)
    
    const savePromise = updateContent(content)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: async () => {
        // Trigger revalidation after successful save
        await PavilionStandsPageService.triggerRevalidation()
        return 'Pavilion stands page updated successfully!'
      },
      error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
    })

    try {
      await savePromise
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File, field: string) => {
    if (!content) return
    
    setUploading(field)
    
    const uploadPromise = PavilionStandsPageService.uploadImage(file, field)
    
    toast.promise(uploadPromise, {
      loading: 'Uploading image...',
      success: async (result) => {
        if (result.data) {
          // Update the appropriate field based on the field parameter
          let updatedContent = { ...content }
          
          switch (field) {
            case 'hero-bg':
              updatedContent = {
                ...content,
                hero: { ...content.hero, backgroundImage: result.data }
              }
              break
            case 'benefits-img':
              updatedContent = {
                ...content,
                benefits: { ...content.benefits, image: result.data }
              }
              break
            case 'advantages-img':
              updatedContent = {
                ...content,
                advantages: { ...content.advantages, image: result.data }
              }
              break
          }
          
          await updateContent(updatedContent)
          // Trigger revalidation after successful image upload
          await PavilionStandsPageService.triggerRevalidation()
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
      setUploading(null)
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Pavilion Stands Admin</h1>
        <p className="text-muted-foreground">Edit your pavilion stands page content and images</p>
      </div>

      {/* Form */}
      <form className="space-y-8">
        {/* Section 1: Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 1 (Hero Section)</h2>
          <div className="space-y-4">
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
            <div>
              <Label htmlFor="hero-background">Background Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="hero-background"
                    value={content.hero?.backgroundImage || ''}
                    onChange={(e) => updateContent({
                      ...content,
                      hero: { ...content.hero, backgroundImage: e.target.value }
                    })}
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
                {content.hero?.backgroundImage && (
                  <div className="relative inline-block">
                    <img 
                      src={content.hero.backgroundImage} 
                      alt="Hero background preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                  </div>
                )}
                <input
                  id="hero-bg-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
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
            <div>
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
            <div>
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
            <div>
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
            <div>
              <Label htmlFor="benefits-image">Benefits Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="benefits-image"
                    value={content.benefits?.image || ''}
                    onChange={(e) => updateContent({
                      ...content,
                      benefits: { ...content.benefits, image: e.target.value }
                    })}
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
                {content.benefits?.image && (
                  <div className="relative inline-block">
                    <img 
                      src={content.benefits.image} 
                      alt="Benefits preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                  </div>
                )}
                <input
                  id="benefits-img-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'benefits-img')
                  }}
                />
              </div>
            </div>
            <div>
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
            <div>
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
            <div>
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
            <div>
              <Label htmlFor="advantages-image">Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="advantages-image"
                    value={content.advantages?.image || ''}
                    onChange={(e) => updateContent({
                      ...content,
                      advantages: { ...content.advantages, image: e.target.value }
                    })}
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
                {content.advantages?.image && (
                  <div className="relative inline-block">
                    <img 
                      src={content.advantages.image} 
                      alt="Advantages preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                  </div>
                )}
                <input
                  id="advantages-img-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'advantages-img')
                  }}
                />
              </div>
            </div>
            <div>
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
            <div>
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
            <div>
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
            <div>
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
            <div>
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