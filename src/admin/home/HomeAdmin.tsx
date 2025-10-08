import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { HomeAdminSkeleton } from '@/components/HomeAdminSkeleton'
import { useHomePage } from '@/hooks/useHomeContent'
import type { HomePage, SolutionItem } from '@/data/homeTypes'
import { Upload, Save, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { HomePageService } from '@/data/homeService'
import { TagInput } from '@/components/ui/tag-input'

export function HomeAdmin() {
  const { data: homePage, loading, error, updateHomePage, uploadImage } = useHomePage()
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({})
  
  // Form state
  const [formData, setFormData] = useState<Partial<HomePage>>({})
  
  // File input refs
  const heroImageRef = useRef<HTMLInputElement>(null)
  const boothImageRef = useRef<HTMLInputElement>(null)
  const solutionImageRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  // Update form data when home page loads
  useEffect(() => {
    if (homePage) {
      setFormData(homePage)
    }
  }, [homePage])

  const handleInputChange = (section: keyof HomePage, field: string, value: string) => {
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
          handleInputChange(section as keyof HomePage, field, result.data)
          // Trigger revalidation after successful image upload
          HomePageService.triggerRevalidation().catch(console.warn)
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

  const handleSolutionItemChange = (index: number, field: keyof SolutionItem, value: string) => {
    setFormData(prev => {
      const solutions = { ...prev.solutions }
      const items = [...(solutions.items || [])]
      items[index] = { ...items[index], [field]: value }
      solutions.items = items
      return { ...prev, solutions }
    })
  }

  const handleSolutionItemImageUpload = async (file: File, index: number) => {
    const uploadKey = `solution-item-${index}`
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }))

    const uploadPromise = uploadImage(file, 'solutions')
    
    toast.promise(uploadPromise, {
      loading: 'Uploading solution item image...',
      success: (result) => {
        if (result.data) {
          handleSolutionItemChange(index, 'image', result.data)
          // Trigger revalidation after successful image upload
          HomePageService.triggerRevalidation().catch(console.warn)
          return 'Solution item image uploaded successfully!'
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

  const handleKeywordsChange = (keywords: string[]) => {
    handleInputChange('meta', 'keywords', keywords.join(', '))
  }

  const getKeywordsArray = () => {
    return formData.meta?.keywords ? formData.meta.keywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  const handleSave = async () => {
    if (!homePage?.id) return

    setSaving(true)
    
    const savePromise = updateHomePage(homePage.id, formData)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: (result) => {
        if (result.data) {
          // Update local form data with saved data
          setFormData(result.data)
          return 'Home page updated successfully!'
        } else {
          throw new Error(result.error || 'Update failed')
        }
      },
      error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
    })

    try {
      await savePromise
      // Trigger revalidation after successful save
      const revalidationResult = await HomePageService.triggerRevalidation()
      if (revalidationResult.error) {
        console.warn('[HomeAdmin] Revalidation warning:', revalidationResult.error)
      }
    } catch (error) {
      console.error('[HomeAdmin] Revalidation error:', error)
    } finally {
      setSaving(false)
    }
  }

  // Remove image
  const removeImage = (section: string, field: string) => {
    handleInputChange(section as keyof HomePage, field, '')
    // Also clear alt text when removing image
    handleInputChange(section as keyof HomePage, `${field}Alt`, '')
  }

  if (loading) {
    return <HomeAdminSkeleton />
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading home page: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Home Page Content</h1>
        <p className="text-muted-foreground">Edit your home page content and images</p>
      </div>

      {/* Form */}
      <form className="space-y-8">
        {/* Section 1: Hero */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 1 (Hero)</h2>
          
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="hero-bg">Background Image</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                <div>
                  <Input
                    value={formData.hero?.backgroundImageAlt || ''}
                    onChange={(e) => handleInputChange('hero', 'backgroundImageAlt', e.target.value)}
                    placeholder="Enter alt text"
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
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
                {formData.hero?.backgroundImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage('hero', 'backgroundImage')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {formData.hero?.backgroundImage && (
                <div className="mt-2">
                  <img
                    src={formData.hero.backgroundImage}
                    alt={formData.hero.backgroundImageAlt || "Hero background"}
                    className="h-20 w-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Exhibition Europe */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2 (Exhibition Europe)</h2>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="europe-title">Title</Label>
                <Input
                  id="europe-title"
                  value={formData.exhibitionEurope?.title || ''}
                  onChange={(e) => handleInputChange('exhibitionEurope', 'title', e.target.value)}
                  placeholder="Enter Europe exhibition title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="europe-subtitle">Subtitle</Label>
                <Input
                  id="europe-subtitle"
                  value={formData.exhibitionEurope?.subtitle || ''}
                  onChange={(e) => handleInputChange('exhibitionEurope', 'subtitle', e.target.value)}
                  placeholder="Enter subtitle"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="w-full">
              <Label>Content</Label>
              <RichTextEditor
                content={formData.exhibitionEurope?.htmlContent || ''}
                onChange={(content) => handleInputChange('exhibitionEurope', 'htmlContent', content)}
                placeholder="Enter exhibition content..."
                className="mt-1"
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Exhibition USA */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 3 (Exhibition USA)</h2>
          
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="usa-title">Title</Label>
              <Input
                id="usa-title"
                value={formData.exhibitionUSA?.title || ''}
                onChange={(e) => handleInputChange('exhibitionUSA', 'title', e.target.value)}
                placeholder="Enter USA exhibition title"
                className="mt-1"
              />
            </div>
            
            <div className="w-full">
              <Label>Content</Label>
              <RichTextEditor
                content={formData.exhibitionUSA?.htmlContent || ''}
                onChange={(content) => handleInputChange('exhibitionUSA', 'htmlContent', content)}
                placeholder="Enter exhibition content..."
                className="mt-1"
                controlled={true}
              />
            </div>
            
            {/* Booth Image moved from Section 2 */}
            <div className="w-full">
              <Label htmlFor="europe-booth">Booth Image</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                <div>
                  <Input
                    value={formData.exhibitionEurope?.boothImageAlt || ''}
                    onChange={(e) => handleInputChange('exhibitionEurope', 'boothImageAlt', e.target.value)}
                    placeholder="Enter alt text"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  ref={boothImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'exhibitionEurope', 'boothImage')
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => boothImageRef.current?.click()}
                  disabled={uploadingImages['exhibition-boothImage']}
                >
                  {uploadingImages['exhibition-boothImage'] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </>
                  )}
                </Button>
                {formData.exhibitionEurope?.boothImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage('exhibitionEurope', 'boothImage')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {formData.exhibitionEurope?.boothImage && (
                <div className="mt-2">
                  <img
                    src={formData.exhibitionEurope.boothImage}
                    alt={formData.exhibitionEurope.boothImageAlt || "Booth"}
                    className="h-20 w-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            
            {/* Exhibition USA CTA */}
            <div className="w-full">
              <Label htmlFor="usa-cta-text">CTA Text</Label>
              <Input
                id="usa-cta-text"
                value={formData.exhibitionUSA?.ctaText || ''}
                onChange={(e) => handleInputChange('exhibitionUSA', 'ctaText', e.target.value)}
                placeholder="Enter CTA text"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Solutions */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 4 (Solutions)</h2>
          
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="solutions-title">Title</Label>
              <Input
                id="solutions-title"
                value={formData.solutions?.title || ''}
                onChange={(e) => handleInputChange('solutions', 'title', e.target.value)}
                placeholder="Enter solutions title"
                className="mt-1"
              />
            </div>
            
            <div className="w-full">
              <Label>Content</Label>
              <RichTextEditor
                content={formData.solutions?.htmlContent || ''}
                onChange={(content) => handleInputChange('solutions', 'htmlContent', content)}
                placeholder="Enter solutions content..."
                className="mt-1"
                controlled={true}
              />
            </div>
            
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                <Label>Solution Items</Label>
              </div>
              
              <div className="space-y-4">
                {formData.solutions?.items?.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => handleSolutionItemChange(index, 'title', e.target.value)}
                          placeholder="Enter item title"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleSolutionItemChange(index, 'description', e.target.value)}
                          placeholder="Enter item description"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <Label>Image</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                        <div>
                          <Input
                            value={item.imageAlt || ''}
                            onChange={(e) => handleSolutionItemChange(index, 'imageAlt', e.target.value)}
                            placeholder="Enter alt text"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <input
                          ref={(el) => {
                            if (el) solutionImageRefs.current[index] = el
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleSolutionItemImageUpload(file, index)
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => solutionImageRefs.current[index]?.click()}
                          disabled={uploadingImages[`solution-item-${index}`]}
                        >
                          {uploadingImages[`solution-item-${index}`] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </>
                          )}
                        </Button>
                        {item.image && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              handleSolutionItemChange(index, 'image', '')
                              handleSolutionItemChange(index, 'imageAlt', '')
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      {item.image && (
                        <div className="mt-2">
                          <img
                            src={item.image}
                            alt={item.imageAlt || `Solution ${index + 1}`}
                            className="h-20 w-32 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Portfolio */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 5 (Portfolio)</h2>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="portfolio-title">Title</Label>
                <Input
                  id="portfolio-title"
                  value={formData.portfolioSection?.title || ''}
                  onChange={(e) => handleInputChange('portfolioSection', 'title', e.target.value)}
                  placeholder="Enter portfolio title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="portfolio-subtitle">Subtitle</Label>
                <Input
                  id="portfolio-subtitle"
                  value={formData.portfolioSection?.subtitle || ''}
                  onChange={(e) => handleInputChange('portfolioSection', 'subtitle', e.target.value)}
                  placeholder="Enter portfolio subtitle"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="portfolio-cta-text">CTA Text</Label>
                <Input
                  id="portfolio-cta-text"
                  value={formData.portfolioSection?.ctaText || ''}
                  onChange={(e) => handleInputChange('portfolioSection', 'ctaText', e.target.value)}
                  placeholder="Enter CTA text"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="portfolio-cta-link">CTA Link (Fixed)</Label>
                <Input
                  id="portfolio-cta-link"
                  value="/portfolio"
                  readOnly
                  className="mt-1 bg-gray-100 cursor-not-allowed"
                  title="This field is fixed to '/portfolio' as per project specifications"
                />
                <input
                  type="hidden"
                  value="/portfolio"
                  onChange={(e) => handleInputChange('portfolioSection', 'ctaLink', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Main Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 6 (Main Section)</h2>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="main-title">Title</Label>
                <Input
                  id="main-title"
                  value={formData.mainSection?.title || ''}
                  onChange={(e) => handleInputChange('mainSection', 'title', e.target.value)}
                  placeholder="Enter main title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="main-subtitle">Subtitle</Label>
                <Input
                  id="main-subtitle"
                  value={formData.mainSection?.subtitle || ''}
                  onChange={(e) => handleInputChange('mainSection', 'subtitle', e.target.value)}
                  placeholder="Enter subtitle"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="w-full">
              <Label>Content</Label>
              <RichTextEditor
                content={formData.mainSection?.htmlContent || ''}
                onChange={(content) => handleInputChange('mainSection', 'htmlContent', content)}
                placeholder="Enter main content..."
                className="mt-1"
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 7: Why We're the Best */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 7 (Why We're the Best)</h2>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="why-title">Title</Label>
                <Input
                  id="why-title"
                  value={formData.whyBest?.title || ''}
                  onChange={(e) => handleInputChange('whyBest', 'title', e.target.value)}
                  placeholder="Enter title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="why-subtitle">Subtitle</Label>
                <Input
                  id="why-subtitle"
                  value={formData.whyBest?.subtitle || ''}
                  onChange={(e) => handleInputChange('whyBest', 'subtitle', e.target.value)}
                  placeholder="Enter subtitle"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="w-full">
              <Label>Content</Label>
              <RichTextEditor
                content={formData.whyBest?.htmlContent || ''}
                onChange={(content) => handleInputChange('whyBest', 'htmlContent', content)}
                placeholder="Enter content..."
                className="mt-1"
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* Section 8: Testimonials */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 8 (Testimonials)</h2>
          
          <div className="grid gap-4">
            <div className="w-full">
              <Label htmlFor="testimonials-title">Title</Label>
              <Input
                id="testimonials-title"
                value={formData.testimonialsSection?.title || ''}
                onChange={(e) => handleInputChange('testimonialsSection', 'title', e.target.value)}
                placeholder="Enter testimonials title"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata Section - Moved to the end */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="meta-title">SEO Title</Label>
              <Input
                id="meta-title"
                value={formData.meta?.title || ''}
                onChange={(e) => handleInputChange('meta', 'title', e.target.value)}
                placeholder="SEO title for the home page"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="meta-description">SEO Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta?.description || ''}
                onChange={(e) => handleInputChange('meta', 'description', e.target.value)}
                placeholder="SEO description for the home page"
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="meta-keywords">SEO Keywords</Label>
              <TagInput
                tags={getKeywordsArray()}
                onChange={handleKeywordsChange}
                placeholder="Type keywords and press Enter"
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Press Enter, comma, or semicolon after typing each keyword to add it
              </p>
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