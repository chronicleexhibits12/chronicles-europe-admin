import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
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
import { CountriesService } from '@/data/countriesService'
import { CitiesService } from '@/data/citiesService'
import type { City } from '@/data/citiesTypes'
import { TagInput } from '@/components/ui/tag-input'
import { slugify } from '@/utils/slugify'

interface ProcessStep {
  id: string
  icon: string
  title: string
  description: string
}

export function CreateCountryAdmin() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [availableCities, setAvailableCities] = useState<City[]>([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter cities based on search term
  const filteredCities = useMemo(() => {
    if (!searchTerm) return availableCities
    const term = searchTerm.toLowerCase()
    return availableCities.filter(city => 
      city.name.toLowerCase().includes(term) || 
      city.city_slug.toLowerCase().includes(term)
    )
  }, [availableCities, searchTerm])

  // Form state
  const [formData, setFormData] = useState({
    // Basic country information
    slug: '',
    name: '',
    is_active: true,
    
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
    
    // Company Info Section
    company_info_title: '',
    company_info_content_html: '',
    
    // Best Company Section
    best_company_title: '',
    best_company_subtitle: '',
    best_company_content_html: '',
    
    // Process Section
    process_section_title: '',
    process_section_steps: [
      {"id": "1", "icon": "💡", "title": "Brief", "description": "Understanding your specific requirements and exhibition goals through detailed briefing sessions."},
      {"id": "2", "icon": "✏️", "title": "3D Visuals", "description": "Creating realistic 3D visualizations to help you envision your exhibition stand before construction."},
      {"id": "3", "icon": "🏭", "title": "Production", "description": "Professional manufacturing in our state-of-the-art facilities with quality control at every step."},
      {"id": "4", "icon": "🚚", "title": "Logistics", "description": "Seamless transportation and delivery to ensure your stand arrives on time and in perfect condition."},
      {"id": "5", "icon": "🔧", "title": "Installation", "description": "Expert installation team ensures proper setup and functionality of all stand components."},
      {"id": "6", "icon": "🎯", "title": "Show Support", "description": "Round-the-clock support throughout your exhibition to address any issues immediately."}
    ] as ProcessStep[],
    
    // Cities Section
    cities_section_title: '',
    cities_section_subtitle: '',
    
    // Selected Cities
    selected_cities: [] as string[],
  })

  // Load available cities for selection
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true)
        const { data: cities, error } = await CitiesService.getCities()
        
        if (error) throw new Error(error)
        
        setAvailableCities(cities || [])
      } catch (error: any) {
        console.error('Error fetching cities:', error)
        toast.error('Failed to load available cities')
      } finally {
        setLoadingCities(false)
      }
    }
    
    fetchCities()
  }, [])

  // Temporary state for selected files (not yet uploaded)
  const [tempFiles, setTempFiles] = useState<Record<string, File>>({})
  
  // Temporary state for image previews
  const [tempImages, setTempImages] = useState<Record<string, string>>({})
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<{field: string, url: string} | null>(null)

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

  // Get image URL for preview (from temp images first, then from form data)
  const getImageUrl = (field: string): string => {
    // Check if we have a temporary preview URL
    if (tempImages[field]) {
      return tempImages[field]
    }
    // Otherwise, use the URL from form data
    const fieldValue = formData[field as keyof typeof formData];
    return typeof fieldValue === 'string' ? fieldValue : ''
  }

  // Function to remove an image (with confirmation)
  const removeImage = async (field: string) => {
    // Check if this is a temporary image or an existing one
    const isTempImage = !!tempImages[field];
    const isTempFile = !!tempFiles[field];
    
    if (isTempImage || isTempFile) {
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
      
      toast.success('Image removed successfully');
    }
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      // First, upload any pending files
      const uploadedImages: Record<string, string> = {}
      
      for (const [field, file] of Object.entries(tempFiles)) {
        try {
          // Upload the file
          const { data, error } = await CountriesService.uploadImage(file)
          
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
        ...formData,
        ...uploadedImages
      }

      const { error } = await CountriesService.createCountry({
        slug: dataToSave.slug,
        name: dataToSave.name,
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
        company_info_title: dataToSave.company_info_title,
        company_info_content_html: dataToSave.company_info_content_html,
        best_company_title: dataToSave.best_company_title,
        best_company_subtitle: dataToSave.best_company_subtitle,
        best_company_content_html: dataToSave.best_company_content_html,
        process_section_title: dataToSave.process_section_title,
        process_section_steps: dataToSave.process_section_steps,
        cities_section_title: dataToSave.cities_section_title,
        cities_section_subtitle: dataToSave.cities_section_subtitle,
        selected_cities: dataToSave.selected_cities,
      })

      if (error) throw new Error(error)
      
      // Clear temp states after successful save
      setTempFiles({})
      setTempImages({})
      
      toast.success('Country created successfully!')
      navigate('/admin/countries')
    } catch (error: any) {
      console.error('Error creating country:', error)
      toast.error(`Failed to create country: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug when country name is changed
    if (field === 'name') {
      const generatedSlug = slugify(value)
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug
      }))
    }
  }

  const handleRichTextChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleKeywordsChange = (keywords: string[]) => {
    handleInputChange('seo_keywords', keywords.join(', '))
  }

  const getKeywordsArray = () => {
    return formData.seo_keywords ? formData.seo_keywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  // Process steps handlers
  const updateProcessStep = (index: number, field: keyof ProcessStep, value: string) => {
    setFormData(prev => {
      const updatedSteps = [...prev.process_section_steps]
      updatedSteps[index] = {
        ...updatedSteps[index],
        [field]: value
      }
      return {
        ...prev,
        process_section_steps: updatedSteps
      }
    })
  }

  const toggleCitySelection = (citySlug: string) => {
    setFormData(prev => {
      const selected = [...prev.selected_cities]
      const index = selected.indexOf(citySlug)
      
      if (index >= 0) {
        // Remove if already selected
        selected.splice(index, 1)
      } else {
        // Add if not selected
        selected.push(citySlug)
      }
      
      return {
        ...prev,
        selected_cities: selected
      }
    })
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
            <Button variant="destructive" onClick={() => {
              if (imageToDelete) {
                handleInputChange(imageToDelete.field, '')
                setDeleteDialogOpen(false)
                setImageToDelete(null)
                toast.success('Image removed successfully')
              }
            }}>
              Delete Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Create New Country</h1>
        <p className="text-muted-foreground">Add a new country to the exhibition stand services</p>
      </div>

      {/* Form */}
      <form className="space-y-8" onSubmit={(e) => {
        e.preventDefault(); // Prevent page reload
        handleSave();
      }}>
        {/* Basic Information Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Country Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., France"
              />
            </div>
            <div>
              <Label htmlFor="slug">Country Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="e.g., france"
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input
                id="hero_title"
                value={formData.hero_title}
                onChange={(e) => handleInputChange('hero_title', e.target.value)}
                placeholder="e.g., EXHIBITION STAND DESIGN AND BUILD IN"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
              <Input
                id="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                placeholder="e.g., FRANCE"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="hero_background_image_url">Background Image</Label>
              <div className="flex items-start space-x-4">
                <Input
                  id="hero_background_image_url"
                  value={getImageUrl('hero_background_image_url')}
                  onChange={(e) => handleInputChange('hero_background_image_url', e.target.value)}
                  placeholder="Enter image URL or upload below"
                  className="flex-1"
                />
                <div className="flex flex-col">
                  <input
                    id="hero-background-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      e.preventDefault()
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(file, 'hero_background_image_url')
                      }
                    }}
                    disabled={uploading === 'hero_background_image_url'}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fileInput = document.getElementById('hero-background-file-input')
                      if (fileInput) {
                        fileInput.click()
                      }
                    }}
                    disabled={uploading === 'hero_background_image_url'}
                  >
                    {uploading === 'hero_background_image_url' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                  {getImageUrl('hero_background_image_url') && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => removeImage('hero_background_image_url')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {getImageUrl('hero_background_image_url') && (
                <div className="mt-2 relative inline-block">
                  <img 
                    src={getImageUrl('hero_background_image_url')} 
                    alt="Hero preview" 
                    className="h-32 object-cover rounded border"
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
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Why Choose Us Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="why_choose_us_title">Title</Label>
              <Input
                id="why_choose_us_title"
                value={formData.why_choose_us_title}
                onChange={(e) => handleInputChange('why_choose_us_title', e.target.value)}
                placeholder="e.g., Why Choose Us for Exhibition Stands in"
              />
            </div>
            <div>
              <Label htmlFor="why_choose_us_subtitle">Subtitle</Label>
              <Input
                id="why_choose_us_subtitle"
                value={formData.why_choose_us_subtitle}
                onChange={(e) => handleInputChange('why_choose_us_subtitle', e.target.value)}
                placeholder="e.g., France?"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="why_choose_us_main_image_url">Main Image</Label>
              <div className="flex items-start space-x-4">
                <Input
                  id="why_choose_us_main_image_url"
                  value={getImageUrl('why_choose_us_main_image_url')}
                  onChange={(e) => handleInputChange('why_choose_us_main_image_url', e.target.value)}
                  placeholder="Enter image URL or upload below"
                  className="flex-1"
                />
                <div className="flex flex-col">
                  <input
                    id="why-choose-us-main-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      e.preventDefault()
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(file, 'why_choose_us_main_image_url')
                      }
                    }}
                    disabled={uploading === 'why_choose_us_main_image_url'}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fileInput = document.getElementById('why-choose-us-main-file-input')
                      if (fileInput) {
                        fileInput.click()
                      }
                    }}
                    disabled={uploading === 'why_choose_us_main_image_url'}
                  >
                    {uploading === 'why_choose_us_main_image_url' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                  {getImageUrl('why_choose_us_main_image_url') && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => removeImage('why_choose_us_main_image_url')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {getImageUrl('why_choose_us_main_image_url') && (
                <div className="mt-2 relative inline-block">
                  <img 
                    src={getImageUrl('why_choose_us_main_image_url')} 
                    alt="Why choose us preview" 
                    className="h-32 object-cover rounded border"
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
            </div>
            <div className="md:col-span-2">
              <Label>Benefits HTML Content</Label>
              <RichTextEditor
                content={formData.why_choose_us_benefits_html || ''}
                onChange={(content) => handleRichTextChange('why_choose_us_benefits_html', content)}
              />
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">What We Do Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="what_we_do_title">Title</Label>
              <Input
                id="what_we_do_title"
                value={formData.what_we_do_title}
                onChange={(e) => handleInputChange('what_we_do_title', e.target.value)}
                placeholder="e.g., WHAT WE DO?"
              />
            </div>
            <div>
              <Label htmlFor="what_we_do_subtitle">Subtitle</Label>
              <Input
                id="what_we_do_subtitle"
                value={formData.what_we_do_subtitle}
                onChange={(e) => handleInputChange('what_we_do_subtitle', e.target.value)}
                placeholder="e.g., WE DO?"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Description HTML Content</Label>
              <RichTextEditor
                content={formData.what_we_do_description_html || ''}
                onChange={(content) => handleRichTextChange('what_we_do_description_html', content)}
              />
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Company Info Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company_info_title">Title</Label>
              <Input
                id="company_info_title"
                value={formData.company_info_title}
                onChange={(e) => handleInputChange('company_info_title', e.target.value)}
                placeholder="e.g., DISTINGUISHED EXHIBITION STAND BUILDER IN FRANCE"
              />
            </div>
            <div>
              <Label>Content HTML</Label>
              <RichTextEditor
                content={formData.company_info_content_html || ''}
                onChange={(content) => handleRichTextChange('company_info_content_html', content)}
              />
            </div>
          </div>
        </div>

        {/* Best Company Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Best Company Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="best_company_title">Title</Label>
              <Input
                id="best_company_title"
                value={formData.best_company_title}
                onChange={(e) => handleInputChange('best_company_title', e.target.value)}
                placeholder="e.g., BEST EXHIBITION STAND DESIGN COMPANY IN FRANCE FOR"
              />
            </div>
            <div>
              <Label htmlFor="best_company_subtitle">Subtitle</Label>
              <Input
                id="best_company_subtitle"
                value={formData.best_company_subtitle}
                onChange={(e) => handleInputChange('best_company_subtitle', e.target.value)}
                placeholder="e.g., EXCEPTIONAL EXPERIENCE"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Content HTML</Label>
              <RichTextEditor
                content={formData.best_company_content_html || ''}
                onChange={(content) => handleRichTextChange('best_company_content_html', content)}
              />
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Process Section</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="process_section_title">Title</Label>
              <Input
                id="process_section_title"
                value={formData.process_section_title}
                onChange={(e) => handleInputChange('process_section_title', e.target.value)}
                placeholder="e.g., The Art And Science Behind Our Exhibition Stand Design & Build Process"
              />
            </div>
            <div>
              <Label>Process Steps</Label>
              <div className="space-y-4">
                {formData.process_section_steps.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Step {index + 1}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`step-icon-${index}`}>Icon</Label>
                        <Input
                          id={`step-icon-${index}`}
                          value={step.icon}
                          onChange={(e) => updateProcessStep(index, 'icon', e.target.value)}
                          placeholder="e.g., 💡"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`step-title-${index}`}>Title</Label>
                        <Input
                          id={`step-title-${index}`}
                          value={step.title}
                          onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                          placeholder="Step title"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`step-description-${index}`}>Description</Label>
                      <Textarea
                        id={`step-description-${index}`}
                        value={step.description}
                        onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                        placeholder="Step description"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Cities Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cities_section_title">Title</Label>
              <Input
                id="cities_section_title"
                value={formData.cities_section_title}
                onChange={(e) => handleInputChange('cities_section_title', e.target.value)}
                placeholder="e.g., EXHIBITION STANDS IN"
              />
            </div>
            <div>
              <Label htmlFor="cities_section_subtitle">Subtitle</Label>
              <Input
                id="cities_section_subtitle"
                value={formData.cities_section_subtitle}
                onChange={(e) => handleInputChange('cities_section_subtitle', e.target.value)}
                placeholder="e.g., FRANCE"
              />
            </div>
            <div className="md:col-span-2">
              {/* City Selection */}
              <div>
                <Label>Select Cities</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Select cities to be displayed on this country's page
                </p>
                
                {loadingCities ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Loading cities...</span>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    {/* Search Input */}
                    <div className="p-3 border-b">
                      <Input
                        placeholder="Search cities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Cities List */}
                    <div className="max-h-60 overflow-y-auto">
                      {availableCities.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No cities available. Create some cities first.
                        </p>
                      ) : filteredCities.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No cities match your search.
                        </p>
                      ) : (
                        <div className="space-y-1 p-2">
                          {filteredCities.map((city) => (
                            <div 
                              key={city.id} 
                              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                            >
                              <input
                                type="checkbox"
                                id={`city-${city.id}`}
                                checked={formData.selected_cities.includes(city.city_slug)}
                                onChange={() => toggleCitySelection(city.city_slug)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label 
                                htmlFor={`city-${city.id}`} 
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                              >
                                <div className="font-medium">{city.name}</div>
                                <div className="text-xs text-muted-foreground">{city.city_slug}</div>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {formData.selected_cities.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Selected cities:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.selected_cities.map((citySlug) => {
                        const city = availableCities.find(c => c.city_slug === citySlug)
                        return (
                          <span 
                            key={citySlug} 
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {city ? city.name : citySlug}
                            <button
                              type="button"
                              className="ml-2 inline-flex items-center rounded-full hover:bg-blue-200"
                              onClick={() => toggleCitySelection(citySlug)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Metadata Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                placeholder="SEO title for the country page"
              />
            </div>
            <div>
              <Label htmlFor="seo_description">SEO Description</Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                placeholder="SEO description for the country page"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
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
            onClick={() => navigate('/admin/countries')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
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
                Save Country
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}