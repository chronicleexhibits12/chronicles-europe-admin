import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { ModularStandsAdminSkeleton } from '@/components/ModularStandsAdminSkeleton'
import { useModularStandsContent } from '@/hooks/useModularStandsContent'
import { ModularStandsPageService } from '@/data/modularStandsService'
import { Loader2, Save, Upload } from 'lucide-react'
import { toast } from 'sonner'

export function ModularStandsAdmin() {
  const { content, loading, error, updateContent } = useModularStandsContent()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  const handleSave = async () => {
    if (!content) return
    
    setSaving(true)
    
    const savePromise = updateContent(content)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: 'Modular stands page updated successfully!',
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
    
    const uploadPromise = ModularStandsPageService.uploadImage(file, field)
    
    toast.promise(uploadPromise, {
      loading: 'Uploading image...',
      success: (result) => {
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
            case 'exhibition-benefits-img':
              updatedContent = {
                ...content,
                exhibitionBenefits: { ...content.exhibitionBenefits, image: result.data }
              }
              break
          }
          
          updateContent(updatedContent)
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Modular Stands Admin</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* SEO Meta Section */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Meta Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Section 1: Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section 1 [Hero Section]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Section 2: Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section 2 [Benefits Section]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Section 3: Points Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section 3 [Points Table Section]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="points-table-title">Title</Label>
            <Input
              id="points-table-title"
              value={content.pointsTable?.title || ''}
              onChange={(e) => updateContent({
                ...content,
                pointsTable: { ...content.pointsTable, title: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Points Table Content (Rich Text)</Label>
            <RichTextEditor
              content={content.pointsTable?.content || ''}
              onChange={(newContent) => updateContent({
                ...content,
                pointsTable: { ...content.pointsTable, content: newContent }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Stand Project Text Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section 4 [Stand Project Text Section]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Section 5: Exhibition Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section 5 [Exhibition Benefits Section]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="exhibition-benefits-title">Title</Label>
            <Input
              id="exhibition-benefits-title"
              value={content.exhibitionBenefits?.title || ''}
              onChange={(e) => updateContent({
                ...content,
                exhibitionBenefits: { ...content.exhibitionBenefits, title: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="exhibition-benefits-subtitle">Subtitle</Label>
            <Input
              id="exhibition-benefits-subtitle"
              value={content.exhibitionBenefits?.subtitle || ''}
              onChange={(e) => updateContent({
                ...content,
                exhibitionBenefits: { ...content.exhibitionBenefits, subtitle: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="exhibition-benefits-image">Image</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  id="exhibition-benefits-image"
                  value={content.exhibitionBenefits?.image || ''}
                  onChange={(e) => updateContent({
                    ...content,
                    exhibitionBenefits: { ...content.exhibitionBenefits, image: e.target.value }
                  })}
                  placeholder="Image URL or upload below"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('exhibition-benefits-img-upload')?.click()}
                  disabled={uploading === 'exhibition-benefits-img'}
                >
                  {uploading === 'exhibition-benefits-img' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {content.exhibitionBenefits?.image && (
                <div className="relative inline-block">
                  <img 
                    src={content.exhibitionBenefits.image} 
                    alt="Exhibition benefits preview" 
                    className="h-20 w-32 object-cover rounded border"
                  />
                </div>
              )}
              <input
                id="exhibition-benefits-img-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'exhibition-benefits-img')
                }}
              />
            </div>
          </div>
          <div>
            <Label>Exhibition Benefits Content (Rich Text)</Label>
            <RichTextEditor
              content={content.exhibitionBenefits?.content || ''}
              onChange={(newContent) => updateContent({
                ...content,
                exhibitionBenefits: { ...content.exhibitionBenefits, content: newContent }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Modular Diversity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section 6 [Modular Diversity Section]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="modular-diversity-title">Title</Label>
            <Input
              id="modular-diversity-title"
              value={content.modularDiversity?.title || ''}
              onChange={(e) => updateContent({
                ...content,
                modularDiversity: { ...content.modularDiversity, title: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="modular-diversity-subtitle">Subtitle</Label>
            <Input
              id="modular-diversity-subtitle"
              value={content.modularDiversity?.subtitle || ''}
              onChange={(e) => updateContent({
                ...content,
                modularDiversity: { ...content.modularDiversity, subtitle: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Content (Rich Text)</Label>
            <RichTextEditor
              content={content.modularDiversity?.content || ''}
              onChange={(newContent) => updateContent({
                ...content,
                modularDiversity: { ...content.modularDiversity, content: newContent }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 7: Fastest Construction Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section 7 [Fastest Construction Section]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fastest-construction-title">Title</Label>
            <Input
              id="fastest-construction-title"
              value={content.fastestConstruction?.title || ''}
              onChange={(e) => updateContent({
                ...content,
                fastestConstruction: { ...content.fastestConstruction, title: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="fastest-construction-subtitle">Subtitle</Label>
            <Input
              id="fastest-construction-subtitle"
              value={content.fastestConstruction?.subtitle || ''}
              onChange={(e) => updateContent({
                ...content,
                fastestConstruction: { ...content.fastestConstruction, subtitle: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Description (Rich Text)</Label>
            <RichTextEditor
              content={content.fastestConstruction?.description || ''}
              onChange={(newContent) => updateContent({
                ...content,
                fastestConstruction: { ...content.fastestConstruction, description: newContent }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 8: Experts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Section 8 [Experts Section]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="experts-title">Title</Label>
            <Input
              id="experts-title"
              value={content.experts?.title || ''}
              onChange={(e) => updateContent({
                ...content,
                experts: { ...content.experts, title: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="experts-subtitle">Subtitle</Label>
            <Input
              id="experts-subtitle"
              value={content.experts?.subtitle || ''}
              onChange={(e) => updateContent({
                ...content,
                experts: { ...content.experts, subtitle: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Description (Rich Text)</Label>
            <RichTextEditor
              content={content.experts?.description || ''}
              onChange={(newContent) => updateContent({
                ...content,
                experts: { ...content.experts, description: newContent }
              })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}