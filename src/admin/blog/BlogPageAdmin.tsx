import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useBlogPage } from '@/hooks/useBlogContent'
import { BlogService } from '@/data/blogService'
import { TagInput } from '@/components/ui/tag-input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Save, Upload, Loader2 } from 'lucide-react'

export function BlogPageAdmin() {
  const { data: blogPage, loading, error, refetch } = useBlogPage()
  const [formData, setFormData] = useState({
    meta: {
      title: '',
      description: '',
      keywords: [] as string[]
    },
    hero: {
      title: '',
      subtitle: '',
      backgroundImage: '',
      backgroundImageAlt: ''
    },
    description: '',
    isActive: true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState({
    backgroundImage: false
  })
  
  const backgroundImageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (blogPage) {
      setFormData({
        meta: {
          title: blogPage.meta.title || '',
          description: blogPage.meta.description || '',
          keywords: blogPage.meta.keywords ? blogPage.meta.keywords.split(',').map(k => k.trim()).filter(k => k) : []
        },
        hero: {
          title: blogPage.hero.title || '',
          subtitle: blogPage.hero.subtitle || '',
          backgroundImage: blogPage.hero.backgroundImage || '',
          backgroundImageAlt: blogPage.hero.backgroundImageAlt || ''
        },
        description: blogPage.description || '',
        isActive: blogPage.isActive
      })
    }
  }, [blogPage])

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [name]: value
      }
    }))
  }

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [name]: value
      }
    }))
  }

  const handleKeywordsChange = (keywords: string[]) => {
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        keywords
      }
    }))
  }

  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      description: content
    }))
  }

  const handleImageUpload = async (file: File, fieldName: 'backgroundImage') => {
    setUploading(prev => ({ ...prev, [fieldName]: true }))
    try {
      const { data, error } = await BlogService.uploadImage(file)
      
      if (error) throw new Error(error)
      if (!data) throw new Error('No URL returned from upload')
      
      setFormData(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          [fieldName]: data
        }
      }))
      
      toast.success(`Image uploaded successfully`)
    } catch (error: any) {
      console.error(`Error uploading image:`, error)
      toast.error(`Failed to upload image: ${error.message}`)
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }))
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'backgroundImage') => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file')
      return
    }
    
    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size exceeds 50MB limit')
      return
    }
    
    await handleImageUpload(file, fieldName)
    // Reset input to allow uploading the same file again
    e.target.value = ''
  }

  const handleSave = async () => {
    if (!blogPage) return

    setIsSaving(true)
    try {
      const { error } = await BlogService.updateBlogPage(blogPage.id, {
        meta: {
          title: formData.meta.title,
          description: formData.meta.description,
          keywords: formData.meta.keywords.join(', ')
        },
        hero: {
          title: formData.hero.title,
          subtitle: formData.hero.subtitle,
          backgroundImage: formData.hero.backgroundImage,
          backgroundImageAlt: formData.hero.backgroundImageAlt
        },
        description: formData.description,
        isActive: formData.isActive
      })

      if (error) throw new Error(error)

      toast.success('Blog page updated successfully')
      refetch()
    } catch (error: any) {
      console.error('Error updating blog page:', error)
      toast.error('Failed to update blog page')
    } finally {
      setIsSaving(false)
    }
  }

  // Remove image
  const removeImage = (fieldName: 'backgroundImage') => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [fieldName]: '',
        [`${fieldName}Alt`]: ''
      }
    }))
    toast.success('Image removed successfully')
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
        Error loading blog page: {error}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Blog Page</h1>
        <p className="text-muted-foreground">Manage the main blog page content</p>
      </div>

      <form className="space-y-8">
        {/* Hero Section */}
        <div className="admin-section">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">Hero Section</h2>
            <div className="flex items-center space-x-2">
              <Label htmlFor="isActive">Active</Label>
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="hero-title">Hero Title</Label>
              <Input
                id="hero-title"
                name="title"
                value={formData.hero.title}
                onChange={handleHeroChange}
                placeholder="Enter hero title"
                className="mt-1"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
              <Input
                id="hero-subtitle"
                name="subtitle"
                value={formData.hero.subtitle}
                onChange={handleHeroChange}
                placeholder="Enter hero subtitle"
                className="mt-1"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="hero-background-image">Background Image Alt text</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="backgroundImageAlt"
                      value={formData.hero.backgroundImageAlt}
                      onChange={handleHeroChange}
                      placeholder="Enter background image alt text"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={backgroundImageInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'backgroundImage')}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => backgroundImageInputRef.current?.click()}
                    disabled={uploading.backgroundImage}
                    className="flex items-center gap-2"
                  >
                    {uploading.backgroundImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Choose File(s)
                  </Button>
                </div>
                {formData.hero.backgroundImage && (
                  <div className="relative inline-block">
                    <img 
                      src={formData.hero.backgroundImage} 
                      alt={formData.hero.backgroundImageAlt || "Background preview"} 
                      className="max-h-16 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('backgroundImage')}
                    >
                      <span className="sr-only">Remove image</span>
                      ×
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Description</h2>
          <div className="w-full">
            <RichTextEditor
              content={formData.description}
              onChange={handleDescriptionChange}
              controlled={true}
            />
          </div>
        </div>

        {/* SEO Metadata Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                name="title"
                value={formData.meta.title}
                onChange={handleMetaChange}
                placeholder="Enter meta title"
                className="mt-1"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                name="description"
                value={formData.meta.description}
                onChange={handleMetaChange}
                placeholder="Enter meta description"
                rows={3}
                className="mt-1"
              />
            </div>
            <div className="w-full">
              <Label>Meta Keywords</Label>
              <TagInput
                tags={formData.meta.keywords}
                onChange={handleKeywordsChange}
                placeholder="Add keywords and press Enter"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button 
            type="button" 
            onClick={handleSave} 
            disabled={isSaving}
            size="lg"
          >
            {isSaving ? (
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