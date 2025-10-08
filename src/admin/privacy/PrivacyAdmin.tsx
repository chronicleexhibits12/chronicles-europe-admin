import { useState, useEffect } from 'react'
import { usePrivacyPage } from '@/hooks/usePrivacyContent'
import { PrivacyPageService } from '@/data/privacyService'
import type { PrivacyPage } from '@/data/privacyTypes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { TagInput } from '@/components/ui/tag-input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

export function PrivacyAdmin() {
  const { data: privacyPage, loading, error, updatePrivacyPage } = usePrivacyPage()
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<Partial<PrivacyPage>>({})
  
  // Update form data when privacy page loads - only when privacyPage.id changes
  useEffect(() => {
    if (privacyPage && privacyPage.id) {
      // Use a timeout to prevent immediate state updates that might cause loops
      const timer = setTimeout(() => {
        setFormData(prevFormData => {
          // Only update if the ID is different to prevent infinite loops
          if (prevFormData.id !== privacyPage.id) {
            return {
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
            }
          }
          return prevFormData
        })
      }, 0)
      
      return () => clearTimeout(timer)
    }
  }, [privacyPage?.id]) // Only depend on the ID to prevent infinite loops

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
    if (!privacyPage?.id) {
      toast.error('No privacy page ID found. Please refresh the page.')
      return
    }

    setSaving(true)
    
    const savePromise = updatePrivacyPage(privacyPage.id, formData)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: (result) => {
        if (result.data) {
          // Update local form data with saved data after a small delay
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              ...result.data
            }))
          }, 100)
          return 'Privacy page updated successfully!'
        } else {
          throw new Error(result.error || 'Update failed')
        }
      },
      error: (error) => `Failed to save: ${error.message || error || 'Unknown error'}`
    })

    try {
      await savePromise
      // Trigger revalidation after successful save
      await PrivacyPageService.triggerRevalidation()
    } catch (error) {
      console.error('Error during save process:', error)
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
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-destructive bg-destructive/10 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error Loading Privacy Page</h2>
          <p className="mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  // If we have no data but no error, it means there's no active privacy page
  if (!privacyPage) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-yellow-700 bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">No Active Privacy Page</h2>
          <p className="mb-4">There is no active privacy page in the database. Please contact an administrator to set one up.</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
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