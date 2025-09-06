import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { TagInput } from '@/components/ui/tag-input'
import { Loader2, Save, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { CitiesService } from '@/data/citiesService'
import { CountriesService } from '@/data/countriesService'
import type { Country } from '@/data/countriesTypes'
import { slugify } from '@/utils/slugify'

export function CreateCityAdmin() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [availableCountries, setAvailableCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic city information
    country_slug: '',
    city_slug: '',
    name: '',
    is_active: true, // Add is_active field with default true
    
    // SEO Metadata
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    
    // Hero Section
    hero_title: '',
    hero_subtitle: '',
    hero_background_image_url: '',
    
    // Why Choose Us Section
    why_choose_us_title: '',
    why_choose_us_subtitle: '',
    why_choose_us_main_image_url: '',
    why_choose_us_benefits_html: '',
    
    // What We Do Section
    what_we_do_title: '',
    what_we_do_subtitle: '',
    what_we_do_description_html: '',
    
    // Portfolio Section
    portfolio_title_template: '',
    
    // Exhibiting Experience Section
    exhibiting_experience_title: '',
    exhibiting_experience_subtitle: '',
    exhibiting_experience_benefits_html: '',
    exhibiting_experience_excellence_title: '',
    exhibiting_experience_excellence_subtitle: '',
    exhibiting_experience_excellence_points_html: '',
  })

  // Temporary state for unsaved changes
  const [tempFormData, setTempFormData] = useState({ ...formData })

  // Load available countries for selection
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true)
        const { data: countries, error } = await CountriesService.getCountries()
        
        if (error) throw new Error(error)
        
        setAvailableCountries(countries || [])
      } catch (error: any) {
        console.error('Error fetching countries:', error)
        toast.error('Failed to load available countries')
      } finally {
        setLoadingCountries(false)
      }
    }
    
    fetchCountries()
  }, [])

  // Update temp form data when formData changes
  useEffect(() => {
    setTempFormData({ ...formData })
  }, [formData])

  // Temporary state for selected files (not yet uploaded)
  const [tempFiles, setTempFiles] = useState<Record<string, File>>({})

  // Temporary state for uploaded images (not yet saved)
  const [tempImages, setTempImages] = useState<Record<string, string>>({})

  // Cleanup temporary files and preview URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke object URLs to free memory
      Object.values(tempImages).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [tempImages])

  // Cleanup temporary images when component unmounts
  useEffect(() => {
    return () => {
      // Delete all temporary images if they exist
      Object.values(tempImages).forEach(async (imageUrl) => {
        if (imageUrl) {
          try {
            await CitiesService.deleteImage(imageUrl)
          } catch (error) {
            console.warn('Failed to delete temporary image on unmount:', error)
          }
        }
      })
    }
  }, [tempImages])

  const handleSave = async () => {
    setSaving(true)
    
    // Update formData with tempFormData before saving
    setFormData(tempFormData)
    
    try {
      // First, upload any pending files
      const uploadedImages: Record<string, string> = {}
      
      for (const [field, file] of Object.entries(tempFiles)) {
        try {
          // Upload the file
          const { data, error } = await CitiesService.uploadImage(file)
          
          if (error) throw new Error(error)
          if (!data) throw new Error('No URL returned from upload')
          
          uploadedImages[field] = data
        } catch (uploadError) {
          console.error(`Failed to upload image for field ${field}:`, uploadError)
          toast.error(`Failed to upload image for field ${field}`)
          throw uploadError
        }
      }

      // Merge form data with newly uploaded images
      const dataToSave = {
        ...tempFormData,
        ...uploadedImages
      }

      // Create the city first
      const { data: createdCity, error: createError } = await CitiesService.createCity({
        name: dataToSave.name,
        city_slug: dataToSave.city_slug,
        country_slug: dataToSave.country_slug,
        is_active: dataToSave.is_active,
        seo_title: dataToSave.seo_title,
        seo_description: dataToSave.seo_description,
        seo_keywords: dataToSave.seo_keywords,
        hero_title: dataToSave.hero_title,
        hero_subtitle: dataToSave.hero_subtitle,
        hero_background_image_url: dataToSave.hero_background_image_url,
        why_choose_us_title: dataToSave.why_choose_us_title,
        why_choose_us_subtitle: dataToSave.why_choose_us_subtitle,
        why_choose_us_main_image_url: dataToSave.why_choose_us_main_image_url,
        why_choose_us_benefits_html: dataToSave.why_choose_us_benefits_html,
        what_we_do_title: dataToSave.what_we_do_title,
        what_we_do_subtitle: dataToSave.what_we_do_subtitle,
        what_we_do_description_html: dataToSave.what_we_do_description_html,
        portfolio_title_template: dataToSave.portfolio_title_template,
        exhibiting_experience_title: dataToSave.exhibiting_experience_title,
        exhibiting_experience_subtitle: dataToSave.exhibiting_experience_subtitle,
        exhibiting_experience_benefits_html: dataToSave.exhibiting_experience_benefits_html,
        exhibiting_experience_excellence_title: dataToSave.exhibiting_experience_excellence_title,
        exhibiting_experience_excellence_subtitle: dataToSave.exhibiting_experience_excellence_subtitle,
        exhibiting_experience_excellence_points_html: dataToSave.exhibiting_experience_excellence_points_html,
      })

      if (createError) throw new Error(createError)

      // If a country is selected, add this city to the country's selected_cities array
      if (dataToSave.country_slug && createdCity) {
        try {
          console.log('Adding city to country:', dataToSave.country_slug); // Debug log
          // Get the country by slug
          const { data: country, error: countryError } = await CountriesService.getCountryBySlug(dataToSave.country_slug)
          
          if (countryError) {
            console.error('Error fetching country:', countryError)
            toast.error(`Failed to fetch country: ${countryError}`)
          } else if (country) {
            // Add the city slug to the country's selected_cities array if it's not already there
            const updatedSelectedCities = [...(country.selected_cities || [])]
            if (!updatedSelectedCities.includes(dataToSave.city_slug)) {
              updatedSelectedCities.push(dataToSave.city_slug)
              
              console.log('Updated selected cities for country:', updatedSelectedCities); // Debug log
              
              // Update the country with the new selected_cities array
              const { error: updateError } = await CountriesService.updateCountry(country.id, {
                ...country,
                selected_cities: updatedSelectedCities
              })
              
              if (updateError) {
                console.error('Error updating country:', updateError)
                toast.error(`Failed to update country: ${updateError}`)
              } else {
                console.log('Successfully updated country with new city'); // Debug log
              }
            }
          }
        } catch (countryError: any) {
          console.error('Error updating country with new city:', countryError)
          toast.error(`Failed to update country with new city: ${countryError.message || 'Unknown error'}`)
        }
      }

      toast.success('City created successfully!')
      navigate('/admin/cities')
    } catch (error: any) {
      console.error('Error creating city:', error)
      toast.error(`Failed to create city: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setTempFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug when city name is changed
    if (field === 'name') {
      const generatedSlug = `exhibition-stand-builder-${slugify(value)}`
      setTempFormData(prev => ({
        ...prev,
        city_slug: generatedSlug
      }))
    }
  }

  const handleImageUpload = async (file: File, field: string) => {
    setUploading(field)
    
    try {
      // Store the selected file in temp state (not uploaded yet)
      setTempFiles(prev => ({
        ...prev,
        [field]: file
      }))

      // Also store a preview URL for immediate preview
      const previewUrl = URL.createObjectURL(file)
      setTempImages(prev => ({
        ...prev,
        [field]: previewUrl
      }))

      toast.success('Image selected successfully! It will be uploaded when you save changes.')
    } catch (error: any) {
      console.error('Error selecting image:', error)
      toast.error(`Failed to select image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploading(null)
    }
  }

  const removeImage = async (field: string) => {
    // Remove temporary image/file
    setTempImages(prev => {
      const newTempImages = { ...prev };
      if (newTempImages[field]) {
        // Revoke the object URL to free memory
        if (newTempImages[field].startsWith('blob:')) {
          URL.revokeObjectURL(newTempImages[field]);
        }
        delete newTempImages[field];
      }
      return newTempImages;
    });
    
    setTempFiles(prev => {
      const newTempFiles = { ...prev };
      delete newTempFiles[field];
      return newTempFiles;
    });
    
    // Also clear the field value
    setTempFormData(prev => ({
      ...prev,
      [field]: ''
    }));
    
    toast.success('Image removed successfully');
  }

  const handleKeywordsChange = (keywords: string[]) => {
    handleInputChange('seo_keywords', keywords.join(', '))
  }

  const getKeywordsArray = () => {
    return tempFormData.seo_keywords ? tempFormData.seo_keywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  // Get image URL for preview (from temp images first, then from form data)
  const getImageUrl = (field: string): string => {
    // Check if we have a temporary preview URL
    if (tempImages[field]) {
      return tempImages[field]
    }
    // Otherwise, use the URL from temp form data
    const value = tempFormData[field as keyof typeof tempFormData]
    return typeof value === 'string' ? value : ''
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create New City</h1>
        <p className="text-muted-foreground">Add a new city to the exhibition stand services</p>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={(e) => {
        e.preventDefault(); // Prevent page reload
        handleSave();
      }}>
        {/* Section 1: Basic Information */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 1: Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">City Name *</Label>
              <Input
                id="name"
                value={tempFormData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Paris"
              />
            </div>
            <div>
              <Label htmlFor="country_slug">Country *</Label>
              {loadingCountries ? (
                <div className="flex items-center p-2 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading countries...</span>
                </div>
              ) : (
                <select
                  id="country_slug"
                  value={tempFormData.country_slug}
                  onChange={(e) => handleInputChange('country_slug', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a country</option>
                  {availableCountries
                    .filter(country => country.is_active) // Only show active countries
                    .map((country) => (
                      <option key={country.id} value={country.slug}>
                        {country.name}
                      </option>
                    ))}
                </select>
              )}
            </div>
            <div>
              <Label htmlFor="city_slug">City Slug *</Label>
              <Input
                id="city_slug"
                value={tempFormData.city_slug}
                onChange={(e) => handleInputChange('city_slug', e.target.value)}
                placeholder="e.g., exhibition-stand-builder-paris"
                readOnly
              />
              <p className="text-sm text-muted-foreground mt-1">
                Slug is automatically generated as "exhibition-stand-builder-[city-name]"
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 2: Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={tempFormData.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                placeholder="Hero title"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Input
                id="hero_subtitle"
                value={tempFormData.hero_subtitle}
                onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                placeholder="Hero subtitle"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="hero_background_image_url">Background Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="hero_background_image_url"
                    value={getImageUrl('hero_background_image_url')}
                    onChange={(e) => handleInputChange('hero_background_image_url', e.target.value)}
                    placeholder="Image URL or upload below"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('hero-bg-upload')?.click()}
                    disabled={uploading === 'hero_background_image_url'}
                  >
                    {uploading === 'hero_background_image_url' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {getImageUrl('hero_background_image_url') && (
                  <div className="relative inline-block">
                    <img 
                      src={getImageUrl('hero_background_image_url')} 
                      alt="Hero background preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('hero_background_image_url')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <input
                  id="hero-bg-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    e.preventDefault();
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'hero_background_image_url')
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Why Choose Us Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 3: Why Choose Us Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="why_choose_us_title">Title</Label>
              <Input
                id="why_choose_us_title"
                value={tempFormData.why_choose_us_title}
                onChange={(e) => handleInputChange('why_choose_us_title', e.target.value)}
                placeholder="Title"
              />
            </div>
            <div>
              <Label htmlFor="why_choose_us_subtitle">Subtitle</Label>
              <Input
                id="why_choose_us_subtitle"
                value={tempFormData.why_choose_us_subtitle}
                onChange={(e) => handleInputChange('why_choose_us_subtitle', e.target.value)}
                placeholder="Subtitle"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="why_choose_us_main_image_url">Main Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="why_choose_us_main_image_url"
                    value={getImageUrl('why_choose_us_main_image_url')}
                    onChange={(e) => handleInputChange('why_choose_us_main_image_url', e.target.value)}
                    placeholder="Image URL or upload below"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('why-choose-us-img-upload')?.click()}
                    disabled={uploading === 'why_choose_us_main_image_url'}
                  >
                    {uploading === 'why_choose_us_main_image_url' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {getImageUrl('why_choose_us_main_image_url') && (
                  <div className="relative inline-block">
                    <img 
                      src={getImageUrl('why_choose_us_main_image_url')} 
                      alt="Why choose us preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('why_choose_us_main_image_url')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <input
                  id="why-choose-us-img-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    e.preventDefault();
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'why_choose_us_main_image_url')
                  }}
                />
              </div>
            </div>
            <div className="col-span-full">
              <Label>Benefits Content (Rich Text)</Label>
              <RichTextEditor
                content={tempFormData.why_choose_us_benefits_html}
                onChange={(newContent) => handleInputChange('why_choose_us_benefits_html', newContent)}
                controlled={true} // Enable controlled mode
              />
            </div>
          </div>
        </div>

        {/* Section 4: What We Do Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 4: What We Do Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="what_we_do_title">Title</Label>
              <Input
                id="what_we_do_title"
                value={tempFormData.what_we_do_title}
                onChange={(e) => handleInputChange('what_we_do_title', e.target.value)}
                placeholder="Title"
              />
            </div>
            <div>
              <Label htmlFor="what_we_do_subtitle">Subtitle</Label>
              <Input
                id="what_we_do_subtitle"
                value={tempFormData.what_we_do_subtitle}
                onChange={(e) => handleInputChange('what_we_do_subtitle', e.target.value)}
                placeholder="Subtitle"
              />
            </div>
            <div className="col-span-full">
              <Label>Description (Rich Text)</Label>
              <RichTextEditor
                content={tempFormData.what_we_do_description_html}
                onChange={(newContent) => handleInputChange('what_we_do_description_html', newContent)}
                controlled={true} // Enable controlled mode
              />
            </div>
          </div>
        </div>

        {/* Section 5: Portfolio Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 5: Portfolio Section</h2>
          <div className="w-full">
            <div>
              <Label htmlFor="portfolio_title_template">Portfolio Title Template</Label>
              <Input
                id="portfolio_title_template"
                value={tempFormData.portfolio_title_template}
                onChange={(e) => handleInputChange('portfolio_title_template', e.target.value)}
                placeholder="e.g., Our Portfolio in {city_name}"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Exhibiting Experience Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 6: Exhibiting Experience Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exhibiting_experience_title">Title</Label>
              <Input
                id="exhibiting_experience_title"
                value={tempFormData.exhibiting_experience_title}
                onChange={(e) => handleInputChange('exhibiting_experience_title', e.target.value)}
                placeholder="Title"
              />
            </div>
            <div>
              <Label htmlFor="exhibiting_experience_subtitle">Subtitle</Label>
              <Input
                id="exhibiting_experience_subtitle"
                value={tempFormData.exhibiting_experience_subtitle}
                onChange={(e) => handleInputChange('exhibiting_experience_subtitle', e.target.value)}
                placeholder="Subtitle"
              />
            </div>
            <div className="col-span-full">
              <Label>Benefits Content (Rich Text)</Label>
              <RichTextEditor
                content={tempFormData.exhibiting_experience_benefits_html}
                onChange={(newContent) => handleInputChange('exhibiting_experience_benefits_html', newContent)}
                controlled={true} // Enable controlled mode
              />
            </div>
          </div>
        </div>

        {/* Section 7: Excellence Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 7: Excellence Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exhibiting_experience_excellence_title">Excellence Title</Label>
              <Input
                id="exhibiting_experience_excellence_title"
                value={tempFormData.exhibiting_experience_excellence_title}
                onChange={(e) => handleInputChange('exhibiting_experience_excellence_title', e.target.value)}
                placeholder="FROM CONCEPT TO SHOWCASE: WE DELIVER"
              />
            </div>
            <div>
              <Label htmlFor="exhibiting_experience_excellence_subtitle">Excellence Subtitle</Label>
              <Input
                id="exhibiting_experience_excellence_subtitle"
                value={tempFormData.exhibiting_experience_excellence_subtitle}
                onChange={(e) => handleInputChange('exhibiting_experience_excellence_subtitle', e.target.value)}
                placeholder="EXCELLENCE!"
              />
            </div>
            <div className="col-span-full">
              <Label>Excellence Points (Rich Text)</Label>
              <RichTextEditor
                content={tempFormData.exhibiting_experience_excellence_points_html}
                onChange={(newContent) => handleInputChange('exhibiting_experience_excellence_points_html', newContent)}
                controlled={true} // Enable controlled mode
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={tempFormData.seo_title}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                placeholder="SEO title for the city page"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="seo_description">SEO Description</Label>
              <Textarea
                id="seo_description"
                value={tempFormData.seo_description}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                placeholder="SEO description for the city page"
                rows={3}
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="seo_keywords">SEO Keywords</Label>
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
            variant="outline"
            onClick={() => navigate('/admin/cities')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save City
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}