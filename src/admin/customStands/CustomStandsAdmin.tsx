import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useCustomStandsContent } from '@/hooks/useCustomStandsContent'
import { CustomStandsPageService } from '@/data/customStandsService'
import { Loader2, Save, Upload } from 'lucide-react'

export function CustomStandsAdmin() {
  const { content, loading, error, updateContent } = useCustomStandsContent()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  const handleSave = async () => {
    if (!content) return
    
    setSaving(true)
    try {
      await updateContent(content)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File, field: string) => {
    if (!content) return
    
    setUploading(field)
    try {
      const { data: imageUrl, error } = await CustomStandsPageService.uploadImage(file, field)
      
      if (error) {
        console.error('Error uploading image:', error)
        return
      }

      if (imageUrl) {
        // Update the appropriate field based on the field parameter
        let updatedContent = { ...content }
        
        switch (field) {
          case 'hero-bg':
            updatedContent = {
              ...content,
              hero: { ...content.hero, backgroundImage: imageUrl }
            }
            break
          case 'benefits-img':
            updatedContent = {
              ...content,
              benefits: { ...content.benefits, image: imageUrl }
            }
            break
          case 'exhibition-benefits-img':
            updatedContent = {
              ...content,
              exhibitionBenefits: { ...content.exhibitionBenefits, image: imageUrl }
            }
            break
        }
        
        updateContent(updatedContent)
      }
    } finally {
      setUploading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
        <h1 className="text-3xl font-bold">Custom Stands Admin</h1>
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

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
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

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits Section</CardTitle>
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
      </Card>      {/* 
Stand Project Text Section */}
      <Card>
        <CardHeader>
          <CardTitle>Stand Project Text Section</CardTitle>
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
            <Label htmlFor="stand-project-description">Description</Label>
            <Textarea
              id="stand-project-description"
              value={content.standProjectText?.description || ''}
              onChange={(e) => updateContent({
                ...content,
                standProjectText: { ...content.standProjectText, description: e.target.value }
              })}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Exhibition Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Exhibition Benefits Section</CardTitle>
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

      {/* Bespoke Section */}
      <Card>
        <CardHeader>
          <CardTitle>Bespoke Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bespoke-title">Title</Label>
            <Input
              id="bespoke-title"
              value={content.bespoke?.title || ''}
              onChange={(e) => updateContent({
                ...content,
                bespoke: { ...content.bespoke, title: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="bespoke-subtitle">Subtitle</Label>
            <Input
              id="bespoke-subtitle"
              value={content.bespoke?.subtitle || ''}
              onChange={(e) => updateContent({
                ...content,
                bespoke: { ...content.bespoke, subtitle: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="bespoke-description">Description</Label>
            <Textarea
              id="bespoke-description"
              value={content.bespoke?.description || ''}
              onChange={(e) => updateContent({
                ...content,
                bespoke: { ...content.bespoke, description: e.target.value }
              })}
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Fresh Design Section */}
      <Card>
        <CardHeader>
          <CardTitle>Fresh Design Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fresh-design-title">Title</Label>
            <Input
              id="fresh-design-title"
              value={content.freshDesign?.title || ''}
              onChange={(e) => updateContent({
                ...content,
                freshDesign: { ...content.freshDesign, title: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="fresh-design-subtitle">Subtitle</Label>
            <Input
              id="fresh-design-subtitle"
              value={content.freshDesign?.subtitle || ''}
              onChange={(e) => updateContent({
                ...content,
                freshDesign: { ...content.freshDesign, subtitle: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="fresh-design-description">Description</Label>
            <Textarea
              id="fresh-design-description"
              value={content.freshDesign?.description || ''}
              onChange={(e) => updateContent({
                ...content,
                freshDesign: { ...content.freshDesign, description: e.target.value }
              })}
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Cost Section */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cost-section-title">Title</Label>
            <Input
              id="cost-section-title"
              value={content.costSection?.title || ''}
              onChange={(e) => updateContent({
                ...content,
                costSection: { ...content.costSection, title: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="cost-section-subtitle">Subtitle</Label>
            <Input
              id="cost-section-subtitle"
              value={content.costSection?.subtitle || ''}
              onChange={(e) => updateContent({
                ...content,
                costSection: { ...content.costSection, subtitle: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="cost-section-description">Description</Label>
            <Textarea
              id="cost-section-description"
              value={content.costSection?.description || ''}
              onChange={(e) => updateContent({
                ...content,
                costSection: { ...content.costSection, description: e.target.value }
              })}
              rows={6}
            />
          </div>
        </CardContent>
      </Card>

      {/* Points Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Points Table Section</CardTitle>
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
    </div>
  )
}