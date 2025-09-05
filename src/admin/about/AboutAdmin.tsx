import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { useAboutPage } from '@/hooks/useAboutContent'
import type { AboutPage, AboutCompanyStat, AboutService } from '@/data/aboutTypes'
import { AboutPageService } from '@/data/aboutService'
import { Upload, Save, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { TagInput } from '@/components/ui/tag-input'

export function AboutAdmin() {
  const { data: aboutPage, loading, error, updateAboutPage, uploadImage } = useAboutPage()
  const [saving, setSaving] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({})
  
  // Form state
  const [formData, setFormData] = useState<Partial<AboutPage>>({})
  
  // File input refs
  const heroImageRef = useRef<HTMLInputElement>(null)
  const teamImageRef = useRef<HTMLInputElement>(null)
  const serviceImageRefs = useRef<{ [key: number]: HTMLInputElement | null }>({})

  // Update form data when about page loads
  useEffect(() => {
    if (aboutPage) {
      setFormData(aboutPage)
    }
  }, [aboutPage])

  const handleInputChange = (section: keyof AboutPage, field: string, value: string) => {
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
          handleInputChange(section as keyof AboutPage, field, result.data)
          // Trigger revalidation after successful image upload
          AboutPageService.triggerRevalidation()
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

  const handleStatChange = (index: number, field: keyof AboutCompanyStat, value: string | number) => {
    setFormData(prev => {
      const stats = [...(prev.companyStats || [])]
      stats[index] = { ...stats[index], [field]: value }
      return { ...prev, companyStats: stats }
    })
  }

  const deleteStat = (index: number) => {
    setFormData(prev => {
      const stats = [...(prev.companyStats || [])]
      stats.splice(index, 1)
      return { ...prev, companyStats: stats }
    })
  }



  const handleServiceChange = (index: number, field: keyof AboutService, value: string | boolean | number) => {
    setFormData(prev => {
      const services = [...(prev.services || [])]
      services[index] = { ...services[index], [field]: value }
      return { ...prev, services }
    })
  }

  const handleServiceImageUpload = async (file: File, index: number) => {
    const uploadKey = `service-${index}`
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }))

    const uploadPromise = uploadImage(file, 'services')
    
    toast.promise(uploadPromise, {
      loading: 'Uploading service image...',
      success: (result) => {
        if (result.data) {
          handleServiceChange(index, 'image', result.data)
          // Trigger revalidation after successful image upload
          AboutPageService.triggerRevalidation()
          return 'Service image uploaded successfully!'
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

  const deleteService = (index: number) => {
    setFormData(prev => {
      const services = [...(prev.services || [])]
      services.splice(index, 1)
      return { ...prev, services }
    })
  }

  const handleKeywordsChange = (keywords: string[]) => {
    handleInputChange('meta', 'keywords', keywords.join(', '))
  }

  const getKeywordsArray = () => {
    return formData.meta?.keywords ? formData.meta.keywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  const handleSave = async () => {
    if (!aboutPage?.id) return

    setSaving(true)
    
    const savePromise = updateAboutPage(aboutPage.id, formData)
    
    toast.promise(savePromise, {
      loading: 'Saving changes...',
      success: (result) => {
        if (result.data) {
          return 'About page updated successfully!'
        } else {
          throw new Error(result.error || 'Update failed')
        }
      },
      error: (error) => `Failed to save: ${error.message || 'Unknown error'}`
    })

    try {
      await savePromise
      // Trigger revalidation after successful save
      await AboutPageService.triggerRevalidation()
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
        <p>Error loading about page: {error}</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">About Page Content</h1>
        <p className="text-muted-foreground">Edit your about page content and images</p>
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
              <Label htmlFor="hero-bg">Background Image</Label>
              <div className="flex gap-2">
                <Input
                  id="hero-bg"
                  value={formData.hero?.backgroundImage || ''}
                  onChange={(e) => handleInputChange('hero', 'backgroundImage', e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
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

        {/* Section 2: Company Information */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2 (Company Information)</h2>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="years-business">Years in Business</Label>
                <Input
                  id="years-business"
                  value={formData.companyInfo?.yearsInBusiness || ''}
                  onChange={(e) => handleInputChange('companyInfo', 'yearsInBusiness', e.target.value)}
                  placeholder="e.g., 25+"
                />
              </div>
              
              <div>
                <Label htmlFor="years-label">Years Label</Label>
                <Input
                  id="years-label"
                  value={formData.companyInfo?.yearsLabel || ''}
                  onChange={(e) => handleInputChange('companyInfo', 'yearsLabel', e.target.value)}
                  placeholder="e.g., YEARS"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="who-we-are">Who We Are Title</Label>
              <Input
                id="who-we-are"
                value={formData.companyInfo?.whoWeAreTitle || ''}
                onChange={(e) => handleInputChange('companyInfo', 'whoWeAreTitle', e.target.value)}
                placeholder="Enter who we are title"
              />
            </div>
            
            <div>
              <Label htmlFor="company-description">Company Description</Label>
              <RichTextEditor
                content={formData.companyInfo?.description || ''}
                onChange={(content) => handleInputChange('companyInfo', 'description', content)}
                placeholder="Enter company description..."
              />
            </div>
            
            <div>
              <div className="mb-2">
                <Label>Company Quotes</Label>
              </div>
              
              <div className="space-y-3">
                {formData.companyInfo?.quotes?.map((quote, index) => (
                  <div key={index}>
                    <Textarea
                      value={quote}
                      onChange={(e) => {
                        const quotes = [...(formData.companyInfo?.quotes || [])]
                        quotes[index] = e.target.value
                        setFormData(prev => ({
                          ...prev,
                          companyInfo: {
                            ...prev.companyInfo,
                            quotes
                          }
                        }))
                      }}
                      placeholder={`Enter quote ${index + 1}`}
                      className="w-full"
                      rows={2}
                    />
                  </div>
                ))}
                
                {(!formData.companyInfo?.quotes || formData.companyInfo.quotes.length === 0) && (
                  <p className="text-sm text-muted-foreground">No quotes added yet. Click "Add Quote" to add one.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Facts Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 3 (Facts Section)</h2>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="facts-title">Facts Title</Label>
              <Input
                id="facts-title"
                value={formData.factsSection?.title || ''}
                onChange={(e) => handleInputChange('factsSection', 'title', e.target.value)}
                placeholder="Enter facts title"
              />
            </div>
            
            <div>
              <Label htmlFor="facts-description">Facts Description</Label>
              <Textarea
                id="facts-description"
                value={formData.factsSection?.description || ''}
                onChange={(e) => handleInputChange('factsSection', 'description', e.target.value)}
                placeholder="Enter facts description"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Company Statistics */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 4 (Company Statistics)</h2>
          
          <div>
            <div className="mb-3">
              <Label>Statistics</Label>
            </div>
            
            <div className="space-y-4">
              {formData.companyStats?.map((stat, index) => (
                <div key={stat.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Stat {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteStat(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Value</Label>
                      <Input
                        type="number"
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, 'value', parseInt(e.target.value) || 0)}
                        placeholder="Enter value"
                      />
                    </div>
                    
                    <div>
                      <Label>Icon</Label>
                      <Input
                        value={stat.icon}
                        onChange={(e) => handleStatChange(index, 'icon', e.target.value)}
                        placeholder="Enter icon"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      placeholder="Enter label"
                    />
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={stat.description}
                      onChange={(e) => handleStatChange(index, 'description', e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Team Information */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 5 (Team Information)</h2>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="team-title">Team Title</Label>
              <Input
                id="team-title"
                value={formData.teamInfo?.title || ''}
                onChange={(e) => handleInputChange('teamInfo', 'title', e.target.value)}
                placeholder="Enter team title"
              />
            </div>
            
            <div>
              <Label htmlFor="team-description">Team Description</Label>
              <Textarea
                id="team-description"
                value={formData.teamInfo?.description || ''}
                onChange={(e) => handleInputChange('teamInfo', 'description', e.target.value)}
                placeholder="Enter team description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="team-image">Team Image</Label>
              <div className="flex gap-2">
                <Input
                  id="team-image"
                  value={formData.teamInfo?.teamImage || ''}
                  onChange={(e) => handleInputChange('teamInfo', 'teamImage', e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
                <input
                  ref={teamImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'team', 'teamImage')
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => teamImageRef.current?.click()}
                  disabled={uploadingImages['team-teamImage']}
                >
                  {uploadingImages['team-teamImage'] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {formData.teamInfo?.teamImage && (
                <div className="relative inline-block mt-2">
                  <img
                    src={formData.teamInfo.teamImage}
                    alt="Team"
                    className="h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 6: Services */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 6 (Services)</h2>
          
          <div>
            <div className="mb-3">
              <Label>Services</Label>
            </div>
            
            <div className="space-y-4">
              {formData.services?.map((service, index) => (
                <div key={service.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Service {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteService(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={service.title}
                      onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                      placeholder="Enter service title"
                    />
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={service.description}
                      onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                      placeholder="Enter service description"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label>Image</Label>
                    <div className="flex gap-2">
                      <Input
                        value={service.image}
                        onChange={(e) => handleServiceChange(index, 'image', e.target.value)}
                        placeholder="Enter image URL"
                        className="flex-1"
                      />
                      <input
                        ref={(el) => {
                          if (el) serviceImageRefs.current[index] = el
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleServiceImageUpload(file, index)
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => serviceImageRefs.current[index]?.click()}
                        disabled={uploadingImages[`service-${index}`]}
                      >
                        {uploadingImages[`service-${index}`] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {service.image && (
                      <div className="relative inline-block mt-2">
                        <img
                          src={service.image}
                          alt={`Service ${index + 1}`}
                          className="h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
                onChange={(e) => handleInputChange('meta', 'title', e.target.value)}
                placeholder="SEO title for the about page"
              />
            </div>
            
            <div>
              <Label htmlFor="meta-description">SEO Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta?.description || ''}
                onChange={(e) => handleInputChange('meta', 'description', e.target.value)}
                placeholder="SEO description for the about page"
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
