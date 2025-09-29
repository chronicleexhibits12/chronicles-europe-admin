import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { TagInput } from '@/components/ui/tag-input'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { 
  Loader2, 
  Save, 
  Upload, 
  X,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCity } from '@/hooks/useCitiesContent'
import { CitiesService } from '@/data/citiesService'
import { CountriesService } from '@/data/countriesService'
import type { Country } from '@/data/countriesTypes'
import { slugify } from '@/utils/slugify'

interface CityData {
  // Basic city information
  country_slug: string
  city_slug: string
  name: string
  is_active: boolean // Add is_active field
  
  // SEO Metadata
  seo_title: string
  seo_description: string
  seo_keywords: string
  
  // Hero Section
  hero_title: string
  hero_subtitle: string
  hero_background_image_url: string
  hero_background_image_alt: string
  
  // Why Choose Us Section
  why_choose_us_title: string
  why_choose_us_main_image_url: string
  why_choose_us_main_image_alt: string
  why_choose_us_benefits_html: string
  
  // What We Do Section
  what_we_do_title: string
  what_we_do_description_html: string
  
  // Portfolio Section
  portfolio_section_title: string
  portfolio_section_subtitle: string
  portfolio_section_cta_text: string
  portfolio_section_cta_link: string
  
  // Exhibiting Experience Section
  exhibiting_experience_title: string
  exhibiting_experience_subtitle: string
  exhibiting_experience_benefits_html: string
  exhibiting_experience_excellence_title: string
  exhibiting_experience_excellence_subtitle: string
  exhibiting_experience_excellence_points_html: string
}

export function EditCityAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: city, loading, error } = useCity(id || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [availableCountries, setAvailableCountries] = useState<Country[]>([])
  const [loadingCountries, setLoadingCountries] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState<CityData>({
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
    hero_background_image_alt: '',
    
    // Why Choose Us Section
    why_choose_us_title: '',
    why_choose_us_main_image_url: '',
    why_choose_us_main_image_alt: '',
    why_choose_us_benefits_html: '',
    
    // What We Do Section
    what_we_do_title: '',
    what_we_do_description_html: '',
    
    // Portfolio Section
    portfolio_section_title: 'OUR PORTFOLIO',
    portfolio_section_subtitle: 'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.',
    portfolio_section_cta_text: 'View All Projects',
    portfolio_section_cta_link: '/portfolio',
    
    // Exhibiting Experience Section
    exhibiting_experience_title: '',
    exhibiting_experience_subtitle: '',
    exhibiting_experience_benefits_html: '',
    exhibiting_experience_excellence_title: '',
    exhibiting_experience_excellence_subtitle: '',
    exhibiting_experience_excellence_points_html: '',
  })

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

  // Store the original country slug to detect changes
  const [originalCountrySlug, setOriginalCountrySlug] = useState<string>('')

  // Load city data
  useEffect(() => {
    if (city) {
      setFormData({
        country_slug: city.country_slug || '',
        city_slug: city.city_slug || '',
        name: city.name || '',
        is_active: city.is_active !== undefined ? city.is_active : true, // Handle is_active field
        seo_title: city.seo_title || '',
        seo_description: city.seo_description || '',
        seo_keywords: city.seo_keywords || '',
        hero_title: city.hero_title || '',
        hero_subtitle: city.hero_subtitle || '',
        hero_background_image_url: city.hero_background_image_url || '',
        hero_background_image_alt: city.hero_background_image_alt || '',
        why_choose_us_title: city.why_choose_us_title || '',
        why_choose_us_main_image_url: city.why_choose_us_main_image_url || '',
        why_choose_us_main_image_alt: city.why_choose_us_main_image_alt || '',
        why_choose_us_benefits_html: city.why_choose_us_benefits_html || '',
        what_we_do_title: city.what_we_do_title || '',
        what_we_do_description_html: city.what_we_do_description_html || '',
        portfolio_section_title: city.portfolio_section_title || 'OUR PORTFOLIO',
        portfolio_section_subtitle: city.portfolio_section_subtitle || 'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.',
        portfolio_section_cta_text: city.portfolio_section_cta_text || 'View All Projects',
        portfolio_section_cta_link: city.portfolio_section_cta_link || '/portfolio',
        exhibiting_experience_title: city.exhibiting_experience_title || '',
        exhibiting_experience_subtitle: city.exhibiting_experience_subtitle || '',
        exhibiting_experience_benefits_html: city.exhibiting_experience_benefits_html || '',
        exhibiting_experience_excellence_title: city.exhibiting_experience_excellence_title || '',
        exhibiting_experience_excellence_subtitle: city.exhibiting_experience_excellence_subtitle || '',
        exhibiting_experience_excellence_points_html: city.exhibiting_experience_excellence_points_html || '',
      })
      // Store the original country slug
      setOriginalCountrySlug(city.country_slug || '')
    }
  }, [city])

  // State for selected files (not yet uploaded)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})

  const handleSave = async () => {
    if (!id) return
    
    setSaving(true)
    
    try {
      // First, upload any images
      const updatedFormData = { ...formData }
      
      // Handle hero background image upload
      if (selectedFiles.hero_background_image_url) {
        // Delete previous image if it exists
        if (formData.hero_background_image_url) {
          try {
            await CitiesService.deleteImage(formData.hero_background_image_url)
          } catch (deleteError) {
            console.warn('Failed to delete previous image:', deleteError)
          }
        }
        
        const { data, error } = await CitiesService.uploadImage(selectedFiles.hero_background_image_url)
        if (error) throw new Error(error)
        if (!data) throw new Error('No URL returned from upload')
        updatedFormData.hero_background_image_url = data
      }
      
      // Handle why choose us main image upload
      if (selectedFiles.why_choose_us_main_image_url) {
        // Delete previous image if it exists
        if (formData.why_choose_us_main_image_url) {
          try {
            await CitiesService.deleteImage(formData.why_choose_us_main_image_url)
          } catch (deleteError) {
            console.warn('Failed to delete previous image:', deleteError)
          }
        }
        
        const { data, error } = await CitiesService.uploadImage(selectedFiles.why_choose_us_main_image_url)
        if (error) throw new Error(error)
        if (!data) throw new Error('No URL returned from upload')
        updatedFormData.why_choose_us_main_image_url = data
      }

      // Handle country change - remove from old country and add to new country
      let countryUpdateSuccess = true;
      const countryChanged = updatedFormData.country_slug !== originalCountrySlug;
      
      console.log('Country change detected:', countryChanged, 'Original:', originalCountrySlug, 'New:', updatedFormData.country_slug); // Debug log
      
      if (countryChanged) {
        // Remove from the old country if it existed
        if (originalCountrySlug) {
          try {
            console.log('Removing city from old country:', originalCountrySlug); // Debug log
            const { data: oldCountry, error: oldCountryError } = await CountriesService.getCountryBySlug(originalCountrySlug)
            
            if (oldCountryError) {
              console.error('Error fetching old country:', oldCountryError)
              toast.error(`Failed to fetch old country: ${oldCountryError}`)
              countryUpdateSuccess = false;
            } else if (oldCountry) {
              // Remove the city slug from the old country's selected_cities array
              const updatedSelectedCities = (oldCountry.selected_cities || []).filter(
                (slug: string) => slug !== updatedFormData.city_slug
              )
              
              console.log('Updated selected cities for old country:', updatedSelectedCities); // Debug log
              
              // Update the old country with the new selected_cities array
              const { error: updateError } = await CountriesService.updateCountry(oldCountry.id, {
                ...oldCountry,
                selected_cities: updatedSelectedCities
              })
              
              if (updateError) {
                console.error('Error updating old country selected cities:', updateError)
                toast.error(`Failed to update old country selected cities: ${updateError}`)
                countryUpdateSuccess = false;
              } else {
                toast.success(`City removed from ${oldCountry.name} successfully!`)
              }
            }
          } catch (oldCountryUpdateError: any) {
            console.error('Error updating old country with selected city:', oldCountryUpdateError)
            toast.error(`Failed to update old country with selected city: ${oldCountryUpdateError.message || 'Unknown error'}`)
            countryUpdateSuccess = false;
          }
        }
        
        // Add to the new country if it exists
        if (updatedFormData.country_slug) {
          try {
            console.log('Adding city to new country:', updatedFormData.country_slug); // Debug log
            const { data: newCountry, error: newCountryError } = await CountriesService.getCountryBySlug(updatedFormData.country_slug)
            
            if (newCountryError) {
              console.error('Error fetching new country:', newCountryError)
              toast.error(`Failed to fetch new country: ${newCountryError}`)
              countryUpdateSuccess = false;
            } else if (newCountry) {
              // Add the city slug to the new country's selected_cities array if it's not already there
              const updatedSelectedCities = [...(newCountry.selected_cities || [])]
              if (!updatedSelectedCities.includes(updatedFormData.city_slug)) {
                updatedSelectedCities.push(updatedFormData.city_slug)
                
                console.log('Updated selected cities for new country:', updatedSelectedCities); // Debug log
                
                // Update the new country with the new selected_cities array
                const { error: updateError } = await CountriesService.updateCountry(newCountry.id, {
                  ...newCountry,
                  selected_cities: updatedSelectedCities
                })
                
                if (updateError) {
                  console.error('Error updating new country selected cities:', updateError)
                  toast.error(`Failed to update new country selected cities: ${updateError}`)
                  countryUpdateSuccess = false;
                } else {
                  toast.success(`City added to ${newCountry.name} successfully!`)
                }
              } else {
                console.log('City already in new country selected cities'); // Debug log
                // Even if the city is already in the new country, we still consider this a success
                toast.success(`City is already in ${newCountry.name}!`)
              }
            }
          } catch (newCountryUpdateError: any) {
            console.error('Error updating new country with selected city:', newCountryUpdateError)
            toast.error(`Failed to update new country with selected city: ${newCountryUpdateError.message || 'Unknown error'}`)
            countryUpdateSuccess = false;
          }
        }
      } else {
        // No country change, so we consider this a success
        console.log('No country change detected'); // Debug log
        countryUpdateSuccess = true;
      }

      // Only update the city if country updates were successful
      if (countryUpdateSuccess) {
        // Update the city
        const { error: updateError } = await CitiesService.updateCity(id, {
          name: updatedFormData.name,
          city_slug: updatedFormData.city_slug,
          country_slug: updatedFormData.country_slug,
          is_active: updatedFormData.is_active,
          seo_title: updatedFormData.seo_title,
          seo_description: updatedFormData.seo_description,
          seo_keywords: updatedFormData.seo_keywords,
          hero_title: updatedFormData.hero_title,
          hero_subtitle: updatedFormData.hero_subtitle,
          hero_background_image_url: updatedFormData.hero_background_image_url,
          hero_background_image_alt: updatedFormData.hero_background_image_alt,
          why_choose_us_title: updatedFormData.why_choose_us_title,
          why_choose_us_main_image_url: updatedFormData.why_choose_us_main_image_url,
          why_choose_us_main_image_alt: updatedFormData.why_choose_us_main_image_alt,
          why_choose_us_benefits_html: updatedFormData.why_choose_us_benefits_html,
          what_we_do_title: updatedFormData.what_we_do_title,
          what_we_do_description_html: updatedFormData.what_we_do_description_html,
          portfolio_section_title: updatedFormData.portfolio_section_title,
          portfolio_section_subtitle: updatedFormData.portfolio_section_subtitle,
          portfolio_section_cta_text: updatedFormData.portfolio_section_cta_text,
          portfolio_section_cta_link: '/portfolio', // Fixed to /portfolio as requested
          exhibiting_experience_title: updatedFormData.exhibiting_experience_title,
          exhibiting_experience_subtitle: updatedFormData.exhibiting_experience_subtitle,
          exhibiting_experience_benefits_html: updatedFormData.exhibiting_experience_benefits_html,
          exhibiting_experience_excellence_title: updatedFormData.exhibiting_experience_excellence_title,
          exhibiting_experience_excellence_subtitle: updatedFormData.exhibiting_experience_excellence_subtitle,
          exhibiting_experience_excellence_points_html: updatedFormData.exhibiting_experience_excellence_points_html,
        })

        if (updateError) throw new Error(updateError)

        // Update the original country slug to the new one if country update was successful
        if (countryChanged && countryUpdateSuccess) {
          console.log('Updating original country slug from', originalCountrySlug, 'to', updatedFormData.country_slug); // Debug log
          setOriginalCountrySlug(updatedFormData.country_slug);
        }

        // Clear selected files after successful save
        setSelectedFiles({})
        
        toast.success('City updated successfully!')
        navigate('/admin/cities')
      } else {
        toast.error('Failed to update country relationships. City not updated.')
      }
    } catch (error: any) {
      console.error('Error updating city:', error)
      toast.error(`Failed to update city: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File, field: string) => {
    setUploading(field)
    
    try {
      // Store the selected file in state (not uploaded yet)
      setSelectedFiles(prev => ({
        ...prev,
        [field]: file
      }))

      toast.success('Image selected successfully! It will be uploaded when you save changes.')
    } catch (error: any) {
      console.error('Error selecting image:', error)
      toast.error(`Failed to select image: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(null)
    }
  }

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<{field: string, url: string} | null>(null)

  // Function to confirm image deletion
  const confirmImageDeletion = (field: string) => {
    const imageUrl = getImageUrl(field)
    if (imageUrl) {
      setImageToDelete({ field, url: imageUrl })
      setDeleteDialogOpen(true)
    }
  }

  // Function to remove an image (with confirmation)
  const removeImage = async (field: string) => {
    // Check if this is a selected file or an existing one
    const isExistingImage = !!formData[field as keyof CityData];
    
    if (isExistingImage) {
      // For existing images, we need to handle this during save
      // We'll mark it for deletion during save by setting it to empty string
      setFormData(prev => ({
        ...prev,
        [field]: ''
      }));
      
      toast.success('Image marked for removal. It will be deleted when you save changes.');
    } else {
      // Remove selected file
      setSelectedFiles(prev => {
        const newSelectedFiles = { ...prev };
        delete newSelectedFiles[field];
        return newSelectedFiles;
      });
      
      toast.success('Image removed successfully');
    }
  }

  // Handle confirmed image deletion
  const handleConfirmedImageDeletion = async () => {
    if (!imageToDelete) return;
    
    const { field, url: _url } = imageToDelete;
    
    try {
      // Delete from storage
      const { error } = await CitiesService.deleteImage(imageToDelete.url);
      
      if (error) {
        throw new Error(error);
      }
      
      // Update form data to remove the image URL
      setFormData(prev => ({
        ...prev,
        [field]: ''
      }));
      
      toast.success('Image deleted successfully');
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error(`Failed to delete image: ${error.message || 'Unknown error'}`);
    } finally {
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug when city name is changed
    if (field === 'name') {
      const generatedSlug = `exhibition-stand-builder-${slugify(value)}`
      setFormData(prev => ({
        ...prev,
        city_slug: generatedSlug
      }))
    }
  }

  const handleKeywordsChange = (keywords: string[]) => {
    handleInputChange('seo_keywords', keywords.join(', '))
  }

  const getKeywordsArray = () => {
    return formData.seo_keywords ? formData.seo_keywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  // Get image URL for preview (from selected files as preview, or from form data)
  const getImageUrl = (field: string): string => {
    // Check if we have a selected file for preview
    if (selectedFiles[field]) {
      return URL.createObjectURL(selectedFiles[field])
    }
    // Otherwise, use the URL from form data
    const value = formData[field as keyof CityData]
    return typeof value === 'string' ? value : ''
  }

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(selectedFiles).forEach(file => {
        if (file) {
          URL.revokeObjectURL(URL.createObjectURL(file))
        }
      })
    }
  }, [selectedFiles])

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
        Error loading city: {error}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirm Image Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmedImageDeletion}>
              Delete Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Edit City</h1>
        <p className="text-muted-foreground">Edit city information for exhibition stand services</p>
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
                value={formData.name}
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
                <SearchableSelect
                  value={formData.country_slug}
                  onChange={(value) => handleInputChange('country_slug', value)}
                  options={availableCountries
                    .filter(country => country.is_active) // Only show active countries
                    .map((country) => country.slug)}
                  placeholder="Select a country"
                />
              )}
              {/* Display selected country name for better UX */}
              {formData.country_slug && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {availableCountries.find(c => c.slug === formData.country_slug)?.name}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="city_slug">City Slug *</Label>
              <Input
                id="city_slug"
                value={formData.city_slug}
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
                value={formData.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                placeholder="Hero title"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Button</Label>
              <Input
                id="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="hero_background_image_url">Background Image</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      value={formData.hero_background_image_alt}
                      onChange={(e) => handleInputChange('hero_background_image_alt', e.target.value)}
                      placeholder="Alt text for background image"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('hero-bg-upload')?.click()}
                    disabled={uploading === 'hero_background_image_url'}
                  >
                    {uploading === 'hero_background_image_url' ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Choose Image
                  </Button>
                </div>
                {getImageUrl('hero_background_image_url') && (
                  <div className="relative inline-block">
                    <img 
                      src={getImageUrl('hero_background_image_url')} 
                      alt={formData.hero_background_image_alt || "Hero background preview"} 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => {
                        // Check if it's an existing image (from formData) or a selected file
                        const isExistingImage = formData.hero_background_image_url && 
                          getImageUrl('hero_background_image_url') === formData.hero_background_image_url;
                        
                        if (isExistingImage) {
                          confirmImageDeletion('hero_background_image_url');
                        } else {
                          removeImage('hero_background_image_url');
                        }
                      }}
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
                value={formData.why_choose_us_title}
                onChange={(e) => handleInputChange('why_choose_us_title', e.target.value)}
                placeholder="Title"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="why_choose_us_main_image_url">Main Image</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      value={formData.why_choose_us_main_image_alt}
                      onChange={(e) => handleInputChange('why_choose_us_main_image_alt', e.target.value)}
                      placeholder="Alt text for main image"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('why-choose-us-img-upload')?.click()}
                    disabled={uploading === 'why_choose_us_main_image_url'}
                  >
                    {uploading === 'why_choose_us_main_image_url' ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Choose Image
                  </Button>
                </div>
                {getImageUrl('why_choose_us_main_image_url') && (
                  <div className="relative inline-block">
                    <img 
                      src={getImageUrl('why_choose_us_main_image_url')} 
                      alt={formData.why_choose_us_main_image_alt || "Why choose us preview"} 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => {
                        // Check if it's an existing image (from formData) or a selected file
                        const isExistingImage = formData.why_choose_us_main_image_url && 
                          getImageUrl('why_choose_us_main_image_url') === formData.why_choose_us_main_image_url;
                        
                        if (isExistingImage) {
                          confirmImageDeletion('why_choose_us_main_image_url');
                        } else {
                          removeImage('why_choose_us_main_image_url');
                        }
                      }}
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
                content={formData.why_choose_us_benefits_html}
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
                value={formData.what_we_do_title}
                onChange={(e) => handleInputChange('what_we_do_title', e.target.value)}
                placeholder="Title"
              />
            </div>
            <div className="col-span-full">
              <Label>Description (Rich Text)</Label>
              <RichTextEditor
                content={formData.what_we_do_description_html}
                onChange={(newContent) => handleInputChange('what_we_do_description_html', newContent)}
                controlled={true} // Enable controlled mode
              />
            </div>
          </div>
        </div>

        {/* Section 5: Portfolio Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Section 5: Portfolio Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="portfolio_section_title">Title</Label>
              <Input
                id="portfolio_section_title"
                value={formData.portfolio_section_title}
                onChange={(e) => handleInputChange('portfolio_section_title', e.target.value)}
                placeholder="e.g., OUR PORTFOLIO"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="portfolio_section_subtitle">Subtitle</Label>
              <Input
                id="portfolio_section_subtitle"
                value={formData.portfolio_section_subtitle}
                onChange={(e) => handleInputChange('portfolio_section_subtitle', e.target.value)}
                placeholder="e.g., Explore our extensive portfolio..."
              />
            </div>
            <div>
              <Label htmlFor="portfolio_section_cta_text">CTA Text</Label>
              <Input
                id="portfolio_section_cta_text"
                value={formData.portfolio_section_cta_text}
                onChange={(e) => handleInputChange('portfolio_section_cta_text', e.target.value)}
                placeholder="e.g., View All Projects"
              />
            </div>
            <div>
              <Label htmlFor="portfolio_section_cta_link">CTA Link</Label>
              <Input
                id="portfolio_section_cta_link"
                value="/portfolio"
                readOnly
                placeholder="/portfolio"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This link is fixed to "/portfolio"
              </p>
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
                value={formData.exhibiting_experience_title}
                onChange={(e) => handleInputChange('exhibiting_experience_title', e.target.value)}
                placeholder="Title"
              />
            </div>
            <div>
              <Label htmlFor="exhibiting_experience_subtitle">Subtitle</Label>
              <Input
                id="exhibiting_experience_subtitle"
                value={formData.exhibiting_experience_subtitle}
                onChange={(e) => handleInputChange('exhibiting_experience_subtitle', e.target.value)}
                placeholder="Subtitle"
              />
            </div>
            <div className="col-span-full">
              <Label>Benefits Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.exhibiting_experience_benefits_html}
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
                value={formData.exhibiting_experience_excellence_title}
                onChange={(e) => handleInputChange('exhibiting_experience_excellence_title', e.target.value)}
                placeholder="FROM CONCEPT TO SHOWCASE: WE DELIVER"
              />
            </div>
            <div>
              <Label htmlFor="exhibiting_experience_excellence_subtitle">Excellence Subtitle</Label>
              <Input
                id="exhibiting_experience_excellence_subtitle"
                value={formData.exhibiting_experience_excellence_subtitle}
                onChange={(e) => handleInputChange('exhibiting_experience_excellence_subtitle', e.target.value)}
                placeholder="EXCELLENCE!"
              />
            </div>
            <div className="col-span-full">
              <Label>Excellence Points (Rich Text)</Label>
              <RichTextEditor
                content={formData.exhibiting_experience_excellence_points_html}
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
                value={formData.seo_title}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                placeholder="SEO title for the city page"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="seo_description">SEO Description</Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
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

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t space-x-2">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/admin/cities')}
          >
            Cancel
          </Button>
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