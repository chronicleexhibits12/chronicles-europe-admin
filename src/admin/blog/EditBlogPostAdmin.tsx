import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useBlogPost } from '@/hooks/useBlogContent'
import { BlogService } from '@/data/blogService'
import { TagInput } from '@/components/ui/tag-input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Loader2, Save, Upload, X } from 'lucide-react'
import { validateRedirectUrlFormat, validateRedirectUrlExists } from '@/utils/redirectValidation'

export function EditBlogPostAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: blogPost, loading, error, refetch } = useBlogPost(id || '')
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    featuredImage: '',
    featuredImageAlt: '',
    author: '',
    readTime: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [] as string[],
    sortOrder: 0,
    isActive: true,
    redirectUrl: '' // Add redirectUrl field
  })
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [redirectUrlError, setRedirectUrlError] = useState('') // Add state for redirect URL error
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (blogPost) {
      setFormData({
        slug: blogPost.slug,
        title: blogPost.title,
        content: blogPost.content || '',
        featuredImage: blogPost.featuredImage || '',
        featuredImageAlt: blogPost.featuredImageAlt || '',
        author: blogPost.author || '',
        readTime: blogPost.readTime || '',
        metaTitle: blogPost.metaTitle || '',
        metaDescription: blogPost.metaDescription || '',
        metaKeywords: blogPost.metaKeywords ? blogPost.metaKeywords.split(',').map(k => k.trim()).filter(k => k) : [],
        sortOrder: blogPost.sortOrder,
        isActive: blogPost.isActive,
        redirectUrl: blogPost.redirectUrl || '' // Initialize redirectUrl
      })
    }
  }, [blogPost])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear redirect URL error when user types
    if (name === 'redirectUrl') {
      setRedirectUrlError('')
    }
  }

  const handleMetaKeywordsChange = (keywords: string[]) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: keywords
    }))
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }))
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const { data, error } = await BlogService.uploadImage(file)
      
      if (error) throw new Error(error)
      if (!data) throw new Error('No URL returned from upload')
      
      setFormData(prev => ({
        ...prev,
        featuredImage: data
      }))
      
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(`Failed to upload image: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      featuredImage: ''
    }))
    toast.success('Image removed successfully')
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    await handleImageUpload(file)
    // Reset input to allow uploading the same file again
    if (e.target) e.target.value = ''
  }

  const validateRedirectUrl = async () => {
    if (!formData.redirectUrl) {
      setRedirectUrlError('')
      return true
    }
    
    // Validate URL format
    if (!validateRedirectUrlFormat(formData.redirectUrl)) {
      setRedirectUrlError('Please enter a valid URL or relative path')
      return false
    }
    
    // Validate that the URL exists in the appropriate table
    const isValid = await validateRedirectUrlExists(formData.redirectUrl, 'blog_posts')
    if (!isValid) {
      setRedirectUrlError('The specified URL does not exist in the blog posts')
      return false
    }
    
    setRedirectUrlError('')
    return true
  }

  const handleSave = async () => {
    if (!id) return

    // Validate redirect URL before saving
    const isRedirectUrlValid = await validateRedirectUrl()
    if (!isRedirectUrlValid) {
      toast.error('Please fix the redirect URL error before saving')
      return
    }

    setIsSaving(true)
    try {
      const { error } = await BlogService.updateBlogPost(id, {
        ...formData,
        metaKeywords: formData.metaKeywords.join(', ')
      })

      if (error) throw new Error(error)

      toast.success('Blog post updated successfully')
      refetch()
    } catch (error: any) {
      console.error('Error updating blog post:', error)
      toast.error('Failed to update blog post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/blog-posts')
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
        Error loading blog post: {error}
      </div>
    )
  }

  if (!blogPost && !loading) {
    return (
      <div className="p-8 text-center text-red-600">
        Blog post not found
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Edit Blog Post</h1>
        <p className="text-muted-foreground">Update blog post details</p>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={(e) => {
        e.preventDefault()
        handleSave()
      }}>
        {/* Section 1: Basic Information */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 1: Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog post title"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Enter URL slug"
                required
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="redirectUrl">Redirect URL</Label>
              <Input
                id="redirectUrl"
                name="redirectUrl"
                value={formData.redirectUrl}
                onChange={handleInputChange}
                placeholder="Enter redirect URL (optional)"
                className={redirectUrlError ? 'border-red-500' : ''}
              />
              {redirectUrlError && (
                <p className="text-sm text-red-500 mt-1">{redirectUrlError}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                If provided, visitors will be redirected to this URL instead of viewing the standard blog post page.
                Enter a full URL (e.g. https://example.com) or a relative path (e.g. /events).
              </p>
            </div>
            <div>
              <Label htmlFor="isActive">Published</Label>
              <div className="mt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            {/* Blog Banner Image Section merged into Section 1 */}
            <div className="col-span-full">
              <Label htmlFor="featuredImage">Blog Banner Image</Label>
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-none">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={triggerFileInput}
                      disabled={uploading}
                      className="flex items-center gap-2"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Choose File(s)
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Input
                      id="featuredImageAlt"
                      name="featuredImageAlt"
                      value={formData.featuredImageAlt}
                      onChange={handleInputChange}
                      placeholder="Enter image alt text"
                    />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {formData.featuredImage && (
                  <div className="relative inline-block mt-2">
                    <img 
                      src={formData.featuredImage} 
                      alt={formData.featuredImageAlt || "Blog banner preview"} 
                      className="max-h-16 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Content */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2: Content</h2>
          <div className="w-full">
            <RichTextEditor
              content={formData.content}
              onChange={handleContentChange}
              controlled={true}
            />
          </div>
        </div>

        {/* Section 3: SEO Metadata */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 3: SEO Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                placeholder="Enter meta title"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                placeholder="Enter meta description"
                rows={3}
              />
            </div>
            <div className="col-span-full">
              <Label>Meta Keywords</Label>
              <TagInput
                tags={formData.metaKeywords}
                onChange={handleMetaKeywordsChange}
                placeholder="Add keywords and press Enter"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t">
          <Button 
            type="button" 
            variant="outline"
            onClick={handleCancel}
            className="mr-4"
          >
            Cancel
          </Button>
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
                Update Blog Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}