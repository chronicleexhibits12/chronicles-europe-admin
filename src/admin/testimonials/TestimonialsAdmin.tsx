import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTestimonialsPage } from '@/data/hooks/useTestimonialsContent'
import type { TestimonialsPage, TestimonialItem } from '@/data/testimonialsTypes'
import { TestimonialsPageService } from '@/data/testimonialsService'
import { Upload, Save, Loader2, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'

export function TestimonialsAdmin() {
  const { data: testimonialsPage, loading, error, updateTestimonialsPage, updateTestimonials, uploadImage } = useTestimonialsPage()
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({})
  
  // Form state
  const [formData, setFormData] = useState<Partial<TestimonialsPage>>({})
  
  // File input refs
  const heroImageRef = useRef<HTMLInputElement>(null)
  const testimonialLogoRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  // Update form data when testimonials page loads
  useEffect(() => {
    if (testimonialsPage) {
      setFormData(testimonialsPage)
    }
  }, [testimonialsPage])

  const handleInputChange = (section: keyof TestimonialsPage, field: string, value: string) => {
    setFormData(prev => {
      const currentSection = (prev[section] as any) || {}
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      }
    })
  }

  const handleImageUpload = async (file: File, section: string, field: string) => {
    const uploadKey = `${section}-${field}`
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }))

    const uploadPromise = uploadImage(file, section)
    
    toast.promise(uploadPromise, {
      loading: 'Uploading image...',
      success: (result) => {
        if (result.data) {
          handleInputChange(section as keyof TestimonialsPage, field, result.data)
          // Trigger revalidation after successful image upload
          TestimonialsPageService.triggerRevalidation()
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
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }))
    }
  }

  const handleTestimonialChange = (index: number, field: keyof TestimonialItem, value: string | number | boolean) => {
    setFormData(prev => {
      const testimonials = [...(prev.testimonials || [])]
      testimonials[index] = { ...testimonials[index], [field]: value }
      return { ...prev, testimonials }
    })
  }

  const handleTestimonialLogoUpload = async (file: File, index: number) => {
    const uploadKey = `testimonial-${index}-logo`
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }))

    const uploadPromise = uploadImage(file, 'testimonials')
    
    toast.promise(uploadPromise, {
      loading: 'Uploading logo...',
      success: (result) => {
        if (result.data) {
          handleTestimonialChange(index, 'companyLogoUrl', result.data)
          // Trigger revalidation after successful image upload
          TestimonialsPageService.triggerRevalidation()
          return 'Logo uploaded successfully!'
        } else {
          throw new Error(result.error || 'Upload failed')
        }
      },
      error: (error) => `Failed to upload logo: ${error.message || 'Unknown error'}`
    })

    try {
      await uploadPromise
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }))
    }
  }

  const addTestimonial = () => {
    setFormData(prev => {
      const testimonials = [...(prev.testimonials || [])]
      testimonials.push({
        id: `new-${Date.now()}`,
        clientName: '',
        companyName: '',
        companyLogoUrl: '',
        rating: 5,
        testimonialText: '',
        isFeatured: false,
        displayOrder: testimonials.length // Auto-set display order
      })
      return { ...prev, testimonials }
    })
  }

  const removeTestimonial = (index: number) => {
    setFormData(prev => {
      const testimonials = [...(prev.testimonials || [])]
      testimonials.splice(index, 1)
      
      // Reorder remaining testimonials
      const reordered = testimonials.map((testimonial, i) => ({
        ...testimonial,
        displayOrder: i
      }))
      
      return { ...prev, testimonials: reordered }
    })
  }

  const handleSave = async () => {
    if (!testimonialsPage?.id) return

    setSaving(true)
    
    try {
      // First update the page content
      const { error: pageError } = await updateTestimonialsPage(testimonialsPage.id, formData)
      
      if (pageError) {
        throw new Error(pageError)
      }
      
      // Then update testimonials if they exist
      if (formData.testimonials) {
        const { error: testimonialsError } = await updateTestimonials(testimonialsPage.id, formData.testimonials)
        
        if (testimonialsError) {
          throw new Error(testimonialsError)
        }
      }
      
      toast.success('Testimonials page updated successfully!')
      // Trigger revalidation after successful save
      await TestimonialsPageService.triggerRevalidation()
    } catch (error: any) {
      console.error('Error saving testimonials page:', error)
      toast.error(`Failed to save: ${error.message || 'Unknown error'}`)
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
        <p>Error loading testimonials page: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Testimonials Page Content</h1>
        <p className="text-muted-foreground">Edit your testimonials page content and images</p>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={(e) => {
        e.preventDefault(); // Prevent page reload
        handleSave();
      }}>
        {/* Section 1: Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 1 (Hero Section)</h2>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="hero-title">Hero Title</Label>
              <Input
                id="hero-title"
                value={formData.hero?.title || ''}
                onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            
            <div>
              <Label htmlFor="hero-bg">Background Image URL</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                <div>
                  <Input
                    id="hero-bg"
                    value={formData.hero?.backgroundImage || ''}
                    onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  ref={heroImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'hero', 'backgroundImage')
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => heroImageRef.current?.click()}
                  disabled={uploadingImages['hero-backgroundImage']}
                >
                  {uploadingImages['hero-backgroundImage'] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload Hero Image
                </Button>
              </div>
              {formData.hero?.backgroundImage && (
                <div className="relative inline-block mt-2">
                  <img
                    src={formData.hero.backgroundImage}
                    alt="Hero background"
                    className="h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Intro Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2 (Intro Section)</h2>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="intro-title">Intro Title</Label>
              <Input
                id="intro-title"
                value={formData.intro?.title || ''}
                onChange={(e) => handleInputChange('intro', 'title', e.target.value)}
                placeholder="Enter intro title"
              />
            </div>
            
            <div>
              <Label htmlFor="intro-subtitle">Intro Subtitle</Label>
              <Input
                id="intro-subtitle"
                value={formData.intro?.subtitle || ''}
                onChange={(e) => handleInputChange('intro', 'subtitle', e.target.value)}
                placeholder="Enter intro subtitle"
              />
            </div>
            
            <div>
              <Label htmlFor="intro-description">Intro Description</Label>
              <Textarea
                id="intro-description"
                value={formData.intro?.description || ''}
                onChange={(e) => handleInputChange('intro', 'description', e.target.value)}
                placeholder="Enter intro description"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Testimonials */}
        <div className="admin-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold border-b pb-2">Section 3 (Testimonials)</h2>
            <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </div>
          
          <div className="space-y-6">
            {formData.testimonials?.map((testimonial, index) => (
              <div key={testimonial.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Testimonial {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTestimonial(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Client Name</Label>
                    <Input
                      value={testimonial.clientName}
                      onChange={(e) => handleTestimonialChange(index, 'clientName', e.target.value)}
                      placeholder="Enter client name"
                    />
                  </div>
                  
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      value={testimonial.companyName}
                      onChange={(e) => handleTestimonialChange(index, 'companyName', e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Company Logo URL</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                    <div>
                      <Input
                        value={testimonial.companyLogoUrl}
                        onChange={(e) => handleTestimonialChange(index, 'companyLogoUrl', e.target.value)}
                        placeholder="Enter logo URL"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      ref={(el) => { testimonialLogoRefs.current[index] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleTestimonialLogoUpload(file, index)
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = testimonialLogoRefs.current[index];
                        if (input) {
                          input.click();
                        }
                      }}
                      disabled={uploadingImages[`testimonial-${index}-logo`]}
                    >
                      {uploadingImages[`testimonial-${index}-logo`] ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Upload Logo
                    </Button>
                  </div>
                  {testimonial.companyLogoUrl && (
                    <div className="relative inline-block mt-2">
                      <img
                        src={testimonial.companyLogoUrl}
                        alt="Company logo"
                        className="h-16 object-contain rounded border"
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Rating</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) => handleTestimonialChange(index, 'rating', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`featured-${index}`}
                        checked={testimonial.isFeatured}
                        onChange={(e) => handleTestimonialChange(index, 'isFeatured', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor={`featured-${index}`}>Featured</Label>
                    </div>
                    {/* Removed isActive checkbox as per requirements */}
                    {/* Hidden display order field - auto-managed */}
                    <input 
                      type="hidden" 
                      value={testimonial.displayOrder} 
                      onChange={(e) => handleTestimonialChange(index, 'displayOrder', parseInt(e.target.value) || 0)} 
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Testimonial Text</Label>
                  <Textarea
                    value={testimonial.testimonialText}
                    onChange={(e) => handleTestimonialChange(index, 'testimonialText', e.target.value)}
                    placeholder="Enter testimonial text"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            
            {(!formData.testimonials || formData.testimonials.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No testimonials added yet. Click "Add Testimonial" to add one.</p>
              </div>
            )}
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
                onChange={(e) => handleInputChange('meta', 'title', e.target.value)}
                placeholder="SEO title for the testimonials page"
              />
            </div>
            
            <div>
              <Label htmlFor="meta-description">SEO Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta?.description || ''}
                onChange={(e) => handleInputChange('meta', 'description', e.target.value)}
                placeholder="SEO description for the testimonials page"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="meta-keywords">SEO Keywords</Label>
              <Input
                id="meta-keywords"
                value={formData.meta?.keywords || ''}
                onChange={(e) => handleInputChange('meta', 'keywords', e.target.value)}
                placeholder="SEO keywords for the testimonials page"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            onClick={handleSave} 
            disabled={saving}
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