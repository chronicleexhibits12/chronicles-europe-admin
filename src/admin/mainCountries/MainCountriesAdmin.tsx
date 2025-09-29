import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { TagInput } from '@/components/ui/tag-input'
import { useMainCountriesContent } from '@/hooks/useMainCountriesContent'
import type { MainCountriesPage, ExhibitionStandType } from '@/data/mainCountriesTypes'
import { Upload, Save, Loader2, X, Plus, Edit3 } from 'lucide-react'
import { toast } from 'sonner'

export function MainCountriesAdmin() {
  const { data: mainCountriesPage, loading, error, updateMainCountriesPage, uploadImage } = useMainCountriesContent()
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({})
  
  // Form state
  const [formData, setFormData] = useState<Partial<MainCountriesPage>>({})
  
  // File input refs
  const heroImageRef = useRef<HTMLInputElement>(null)
  const exhibitionTypeImageRefs = useRef<{ [key: string]: (instance: HTMLInputElement | null) => void | (() => void) }>({})

  // Update form data when main countries page loads
  useEffect(() => {
    if (mainCountriesPage) {
      setFormData(mainCountriesPage)
    }
  }, [mainCountriesPage])

  const handleInputChange = (section: keyof MainCountriesPage, field: string, value: string) => {
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

  const handleHeroInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }))
  }

  const handlePortfolioShowcaseChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolioShowcase: {
        ...prev.portfolioShowcase,
        [field]: value
      }
    }))
  }

  const handleBuildSectionChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      buildSection: {
        ...prev.buildSection,
        [field]: value
      }
    }))
  }

  const handleImageUpload = async (file: File, section: string, field: string) => {
    const uploadKey = `${section}-${field}`
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }))

    const uploadPromise = uploadImage(file)
    
    toast.promise(uploadPromise, {
      loading: 'Uploading image...',
      success: (result) => {
        if (result.data) {
          if (section === 'hero') {
            handleHeroInputChange(field, result.data)
          } else {
            handleInputChange(section as keyof MainCountriesPage, field, result.data)
          }
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

  const handleExhibitionTypeChange = (index: number, field: keyof ExhibitionStandType, value: string | string[]) => {
    setFormData(prev => {
      const exhibitionStandTypes = [...(prev.exhibitionStandTypes || [])]
      exhibitionStandTypes[index] = { ...exhibitionStandTypes[index], [field]: value }
      return { ...prev, exhibitionStandTypes }
    })
  }

  const addExhibitionType = () => {
    setFormData(prev => ({
      ...prev,
      exhibitionStandTypes: [
        ...(prev.exhibitionStandTypes || []),
        {
          title: '',
          description: '',
          images: ['', '', ''],
          ctaText: '',
          ctaLink: '/major-countries' // Fixed CTA link
        }
      ]
    }))
  }

  const removeExhibitionType = (index: number) => {
    setFormData(prev => {
      const exhibitionStandTypes = [...(prev.exhibitionStandTypes || [])]
      exhibitionStandTypes.splice(index, 1)
      return { ...prev, exhibitionStandTypes }
    })
  }

  const addExhibitionTypeImage = (typeIndex: number, imageIndex: number) => {
    const key = `exhibition-type-${typeIndex}-image-${imageIndex}`
    // Create a ref function if it doesn't exist
    if (!exhibitionTypeImageRefs.current[key]) {
      exhibitionTypeImageRefs.current[key] = (el: HTMLInputElement | null) => {
        // We don't need to store the element, just create the ref function
      }
    }
    // Get the input element by ID and click it
    const element = document.getElementById(`exhibition-type-${typeIndex}-image-${imageIndex}`) as HTMLInputElement | null
    if (element) {
      element.click()
    }
  }

  const handleExhibitionTypeImageUpload = async (file: File, typeIndex: number, imageIndex: number) => {
    const uploadKey = `exhibition-type-${typeIndex}-image-${imageIndex}`
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }))

    const uploadPromise = uploadImage(file)
    
    toast.promise(uploadPromise, {
      loading: 'Uploading image...',
      success: (result) => {
        if (result.data) {
          setFormData(prev => {
            const exhibitionStandTypes = [...(prev.exhibitionStandTypes || [])]
            const images = [...(exhibitionStandTypes[typeIndex]?.images || [])]
            images[imageIndex] = result.data || ''
            exhibitionStandTypes[typeIndex] = { ...exhibitionStandTypes[typeIndex], images }
            return { ...prev, exhibitionStandTypes }
          })
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

  const handleSave = async () => {
    if (!mainCountriesPage?.id) return

    setSaving(true)
    
    const savePromise = updateMainCountriesPage(mainCountriesPage.id, formData)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: (result) => {
        if (result.data) {
          // Update local form data with saved data
          setFormData(result.data)
          return 'Main countries page updated successfully!'
        } else {
          throw new Error(result.error || 'Update failed')
        }
      },
      error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
    })

    try {
      await savePromise
    } finally {
      setSaving(false)
    }
  }

  const handleKeywordsChange = (keywords: string[]) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: keywords.join(', ')
    }))
  }

  const getKeywordsArray = () => {
    return formData.seoKeywords ? formData.seoKeywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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
        Error loading main countries page: {error}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Main Countries Page Content</h1>
        <p className="text-muted-foreground">Edit your main countries page content and images</p>
      </div>

      {/* Form */}
      <form className="space-y-8">
        {/* Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={formData.hero?.title || ''}
                onChange={(e) => handleHeroInputChange('title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={formData.hero?.subtitle || ''}
                onChange={(e) => handleHeroInputChange('subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="hero-description">Description</Label>
              <Textarea
                id="hero-description"
                value={formData.hero?.description || ''}
                onChange={(e) => handleHeroInputChange('description', e.target.value)}
                placeholder="Enter hero description"
                rows={4}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="hero-background-image-alt">Background Image Alt Text</Label>
              <Input
                id="hero-background-image-alt"
                value={formData.hero?.backgroundImageAlt || ''}
                onChange={(e) => handleHeroInputChange('backgroundImageAlt', e.target.value)}
                placeholder="Enter alt text for background image"
              />
            </div>
          </div>
        </div>

        {/* Exhibition Stand Types Section */}
        <div className="admin-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold border-b pb-2">Exhibition Stand Types</h2>
            <Button type="button" variant="outline" onClick={addExhibitionType}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stand Type
            </Button>
          </div>
          
          <div className="space-y-6">
            {formData.exhibitionStandTypes?.map((type, index) => (
              <div key={index} className="border rounded-lg p-4 relative">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={() => removeExhibitionType(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`stand-type-title-${index}`}>Title</Label>
                    <Input
                      id={`stand-type-title-${index}`}
                      value={type.title || ''}
                      onChange={(e) => handleExhibitionTypeChange(index, 'title', e.target.value)}
                      placeholder="Enter stand type title"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`stand-type-cta-text-${index}`}>CTA Text</Label>
                    <Input
                      id={`stand-type-cta-text-${index}`}
                      value={type.ctaText || ''}
                      onChange={(e) => handleExhibitionTypeChange(index, 'ctaText', e.target.value)}
                      placeholder="Enter CTA text"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`stand-type-cta-link-${index}`}>CTA Link</Label>
                    <Input
                      id={`stand-type-cta-link-${index}`}
                      value={type.ctaLink || '/major-countries'}
                      readOnly
                      placeholder="/major-countries"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This link is fixed to "/major-countries"
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`stand-type-description-${index}`}>Description</Label>
                    <Textarea
                      id={`stand-type-description-${index}`}
                      value={type.description || ''}
                      onChange={(e) => handleExhibitionTypeChange(index, 'description', e.target.value)}
                      placeholder="Enter stand type description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>Images</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      {type.images?.map((image, imgIndex) => (
                        <div key={imgIndex} className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              id={`exhibition-type-${index}-image-${imgIndex}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleExhibitionTypeImageUpload(file, index, imgIndex)
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addExhibitionTypeImage(index, imgIndex)}
                              disabled={uploadingImages[`exhibition-type-${index}-image-${imgIndex}`]}
                            >
                              {uploadingImages[`exhibition-type-${index}-image-${imgIndex}`] ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Upload className="h-3 w-3" />
                              )}
                              Upload
                            </Button>
                            {image && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setFormData(prev => {
                                    const exhibitionStandTypes = [...(prev.exhibitionStandTypes || [])]
                                    const images = [...(exhibitionStandTypes[index]?.images || [])]
                                    images[imgIndex] = ''
                                    exhibitionStandTypes[index] = { ...exhibitionStandTypes[index], images }
                                    return { ...prev, exhibitionStandTypes }
                                  })
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          {image && (
                            <div className="relative">
                              <img 
                                src={image} 
                                alt={`Stand type ${index} image ${imgIndex}`} 
                                className="h-32 w-full object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Showcase Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Portfolio Showcase Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portfolio-title">Title</Label>
              <Input
                id="portfolio-title"
                value={formData.portfolioShowcase?.title || ''}
                onChange={(e) => handlePortfolioShowcaseChange('title', e.target.value)}
                placeholder="Enter portfolio title"
              />
            </div>
            <div>
              <Label htmlFor="portfolio-cta-text">CTA Text</Label>
              <Input
                id="portfolio-cta-text"
                value={formData.portfolioShowcase?.ctaText || ''}
                onChange={(e) => handlePortfolioShowcaseChange('ctaText', e.target.value)}
                placeholder="Enter CTA text"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="portfolio-cta-link">CTA Link</Label>
              <Input
                id="portfolio-cta-link"
                value="/portfolio"
                readOnly
                placeholder="/portfolio"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This link is fixed to "/portfolio"
              </p>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="portfolio-description">Description</Label>
              <Textarea
                id="portfolio-description"
                value={formData.portfolioShowcase?.description || ''}
                onChange={(e) => handlePortfolioShowcaseChange('description', e.target.value)}
                placeholder="Enter portfolio description"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Build Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Build Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="build-title">Title</Label>
              <Input
                id="build-title"
                value={formData.buildSection?.title || ''}
                onChange={(e) => handleBuildSectionChange('title', e.target.value)}
                placeholder="Enter build section title"
              />
            </div>
            <div>
              <Label htmlFor="build-highlight">Highlight</Label>
              <Input
                id="build-highlight"
                value={formData.buildSection?.highlight || ''}
                onChange={(e) => handleBuildSectionChange('highlight', e.target.value)}
                placeholder="Enter build section highlight"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="build-description">Description</Label>
              <Textarea
                id="build-description"
                value={formData.buildSection?.description || ''}
                onChange={(e) => handleBuildSectionChange('description', e.target.value)}
                placeholder="Enter build section description"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seo-title">SEO Title</Label>
              <Input
                id="seo-title"
                value={formData.seoTitle || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="Enter SEO title"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="seo-description">SEO Description</Label>
              <Textarea
                id="seo-description"
                value={formData.seoDescription || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Enter SEO description"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="seo-keywords">SEO Keywords</Label>
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