import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { usePrivacyPage } from '@/hooks/usePrivacyContent'
import type { PrivacyPage } from '@/data/privacyTypes'
import { PrivacyPageService } from '@/data/privacyService'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { TagInput } from '@/components/ui/tag-input' // Added TagInput import

export function PrivacyAdmin() {
  const { data: privacyPage, loading, error, updatePrivacyPage } = usePrivacyPage()
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<Partial<PrivacyPage>>({})
  
  // Update form data when privacy page loads
  useEffect(() => {
    if (privacyPage) {
      setFormData({
        id: privacyPage.id,
        title: privacyPage.title,
        content: privacyPage.content,
        meta: {
          title: privacyPage.meta.title,
          description: privacyPage.meta.description,
          keywords: privacyPage.meta.keywords
        },
        isActive: privacyPage.isActive,
        createdAt: privacyPage.createdAt,
        updatedAt: privacyPage.updatedAt
      })
    }
  }, [privacyPage])

  const handleInputChange = (field: keyof PrivacyPage, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMetaChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      meta: {
        ...(prev.meta || { title: '', description: '', keywords: '' }),
        [field]: value
      }
    }))
  }

  // Handle keywords change using TagInput
  const handleKeywordsChange = (keywords: string[]) => {
    handleMetaChange('keywords', keywords.join(', '))
  }

  // Get keywords array for TagInput
  const getKeywordsArray = () => {
    return formData.meta?.keywords ? formData.meta.keywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  const handleSave = async () => {
    if (!privacyPage?.id) return

    setSaving(true)
    
    const savePromise = updatePrivacyPage(privacyPage.id, formData)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: (result) => {
        if (result.data) {
          // Update local form data with saved data
          setFormData({
            id: result.data.id,
            title: result.data.title,
            content: result.data.content,
            meta: {
              title: result.data.meta.title,
              description: result.data.meta.description,
              keywords: result.data.meta.keywords
            },
            isActive: result.data.isActive,
            createdAt: result.data.createdAt,
            updatedAt: result.data.updatedAt
          })
          return 'Privacy page updated successfully!'
        } else {
          throw new Error(result.error || 'Update failed')
        }
      },
      error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
    })

    try {
      await savePromise
      // Trigger revalidation after successful save
      await PrivacyPageService.triggerRevalidation()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading privacy page: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Privacy Page Content</h1>
        <p className="text-muted-foreground">Edit your privacy page content</p>
      </div>

      {/* Form */}
      <form className="space-y-8">
        {/* Main Content Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Main Content</h2>
          
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter page title"
                className="mt-1"
              />
            </div>
            
            <div className="w-full">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={formData.content || ''}
                onChange={(content) => handleInputChange('content', content)}
                placeholder="Enter privacy policy content..."
                className="mt-1"
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="meta-title">SEO Title</Label>
              <Input
                id="meta-title"
                value={formData.meta?.title || ''}
                onChange={(e) => handleMetaChange('title', e.target.value)}
                placeholder="SEO title for the privacy page"
              />
            </div>
            
            <div>
              <Label htmlFor="meta-description">SEO Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta?.description || ''}
                onChange={(e) => handleMetaChange('description', e.target.value)}
                placeholder="SEO description for the privacy page"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="meta-keywords">SEO Keywords</Label>
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
        <div className="flex justify-end space-x-4">
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