import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useTermsPage } from '@/hooks/useTermsContent'
import type { TermsPage } from '@/data/termsTypes'
import { TermsPageService } from '@/data/termsService'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { TagInput } from '@/components/ui/tag-input' // Added TagInput import

export function TermsAdmin() {
  const { data: termsPage, loading, error, updateTermsPage } = useTermsPage()
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<Partial<TermsPage>>({})
  
  // Update form data when terms page loads
  useEffect(() => {
    if (termsPage) {
      setFormData(termsPage)
    }
  }, [termsPage])

  const handleInputChange = (field: keyof TermsPage, value: string) => {
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
    if (!termsPage?.id) return

    setSaving(true)
    
    const savePromise = updateTermsPage(termsPage.id, formData)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: (result) => {
        if (result.data) {
          // Update local form data with saved data
          setFormData(result.data)
          return 'Terms page updated successfully!'
        } else {
          throw new Error(result.error || 'Update failed')
        }
      },
      error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
    })

    try {
      await savePromise
      // Trigger revalidation after successful save
      await TermsPageService.triggerRevalidation()
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
        <p>Error loading terms page: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Terms and Conditions Page Content</h1>
        <p className="text-muted-foreground">Edit your terms and conditions page content</p>
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
                placeholder="Enter terms and conditions content..."
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
                placeholder="SEO title for the terms page"
              />
            </div>
            
            <div>
              <Label htmlFor="meta-description">SEO Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta?.description || ''}
                onChange={(e) => handleMetaChange('description', e.target.value)}
                placeholder="SEO description for the terms page"
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