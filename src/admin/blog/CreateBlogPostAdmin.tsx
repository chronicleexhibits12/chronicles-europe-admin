import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { BlogService } from '@/data/blogService'
import { TagInput } from '@/components/ui/tag-input'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Loader2, Save, Upload, X } from 'lucide-react'
import { useBlogPosts } from '@/hooks/useBlogContent'

export function CreateBlogPostAdmin() {
  const navigate = useNavigate()
  const { data: blogPosts } = useBlogPosts()
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    publishedDate: '',
    featuredImage: '',
    featuredImageAlt: '',
    category: '',
    author: '',
    readTime: '',
    tags: [] as string[],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [] as string[],
    sortOrder: 0,
    isActive: true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set sort order based on existing blog posts count
  useEffect(() => {
    if (blogPosts) {
      setFormData(prev => ({
        ...prev,
        sortOrder: blogPosts.length + 1
      }))
    }
  }, [blogPosts])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({
      ...prev,
      tags
    }))
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

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref && ref.current) {
      ref.current.click()
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await BlogService.createBlogPost({
        ...formData,
        metaKeywords: formData.metaKeywords.join(', '),
        tags: formData.tags
      })

      if (error) throw new Error(error)

      toast.success('Blog post created successfully')
      navigate('/admin/blog-posts')
    } catch (error: any) {
      console.error('Error creating blog post:', error)
      toast.error('Failed to create blog post')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/blog-posts')
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create New Blog Post</h1>
        <p className="text-muted-foreground">Add a new blog post</p>
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
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Enter a short excerpt"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Enter category"
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
              />
            </div>
            <div>
              <Label htmlFor="readTime">Read Time</Label>
              <Input
                id="readTime"
                name="readTime"
                value={formData.readTime}
                onChange={handleInputChange}
                placeholder="e.g., 5 min read"
              />
            </div>
            <div>
              <Label htmlFor="publishedDate">Published Date</Label>
              <Input
                id="publishedDate"
                name="publishedDate"
                type="date"
                value={formData.publishedDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-full">
              <Label>Tags</Label>
              <TagInput
                tags={formData.tags}
                onChange={handleTagsChange}
                placeholder="Add tags and press Enter"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Featured Image */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2: Featured Image</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="featuredImage">Image URL</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="featuredImage"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    placeholder="Image URL or upload below"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => triggerFileInput(fileInputRef)}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {formData.featuredImage && (
                  <div className="relative inline-block">
                    <img 
                      src={formData.featuredImage} 
                      alt="Featured preview" 
                      className="h-20 w-32 object-cover rounded border"
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
            <div>
              <Label htmlFor="featuredImageAlt">Image Alt Text</Label>
              <Input
                id="featuredImageAlt"
                name="featuredImageAlt"
                value={formData.featuredImageAlt}
                onChange={handleInputChange}
                placeholder="Enter image alt text"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Content */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 3: Content</h2>
          <div className="w-full">
            <RichTextEditor
              content={formData.content}
              onChange={handleContentChange}
              controlled={true}
            />
          </div>
        </div>

        {/* SEO Metadata - Moved to the end */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
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
                Create Blog Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}