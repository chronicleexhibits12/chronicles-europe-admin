import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { useCountry } from '@/hooks/useCountriesContent'
import { CountriesService } from '@/data/countriesService'
import { TagInput } from '@/components/ui/tag-input'
import { slugify } from '@/utils/slugify'

interface ProcessStep {
  id: string
  icon: string
  title: string
  description: string
}

interface CountryData {
  // Basic country information
  slug: string
  name: string
  is_active: boolean
  
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
  
  // Company Info Section
  company_info_title: string
  company_info_content_html: string
  
  // Best Company Section
  best_company_title: string
  best_company_subtitle: string
  best_company_content_html: string
  
  // Process Section
  process_section_title: string
  process_section_subtitle_html: string
  process_section_steps: ProcessStep[]
  
  // Cities Section
  cities_section_title: string
  cities_section_subtitle: string
}

export function EditCountryAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: country, loading, error } = useCountry(id || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState<CountryData>({
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
    portfolio_section_title: '',
    portfolio_section_subtitle: '',
    portfolio_section_cta_text: '',
    portfolio_section_cta_link: '/portfolio',
    
    // Company Info Section
    company_info_title: '',
    company_info_content_html: '',
    
    // Best Company Section
    best_company_title: '',
    best_company_subtitle: '',
    best_company_content_html: '',
    
    // Process Section
    process_section_title: '',
    process_section_subtitle_html: '',
    process_section_steps: [] as ProcessStep[],
    
    // Cities Section
    cities_section_title: '',
    cities_section_subtitle: '',
  })

  // Load country data
  useEffect(() => {
    if (country) {
      // Parse process steps if they exist as a JSON string
      let processSteps: ProcessStep[] = []
      if (country.process_section_steps) {
        try {
          if (typeof country.process_section_steps === 'string') {
            processSteps = JSON.parse(country.process_section_steps)
          } else if (Array.isArray(country.process_section_steps)) {
            processSteps = country.process_section_steps
          }
        } catch (e) {
          console.error('Error parsing process steps:', e)
          processSteps = []
        }
      }

      // Ensure we always have 6 process steps
      if (processSteps.length === 0) {
        // Use default prefilled steps if no steps exist
        processSteps = [
          {"id": "1", "icon": "💡", "title": "Brief", "description": "Understanding your specific requirements and exhibition goals through detailed briefing sessions."},
          {"id": "2", "icon": "✏️", "title": "3D Visuals", "description": "Creating realistic 3D visualizations to help you envision your exhibition stand before construction."},
          {"id": "3", "icon": "🏭", "title": "Production", "description": "Professional manufacturing in our state-of-the-art facilities with quality control at every step."},
          {"id": "4", "icon": "🚚", "title": "Logistics", "description": "Seamless transportation and delivery to ensure your stand arrives on time and in perfect condition."},
          {"id": "5", "icon": "🔧", "title": "Installation", "description": "Expert installation team ensures proper setup and functionality of all stand components."},
          {"id": "6", "icon": "🎯", "title": "Show Support", "description": "Round-the-clock support throughout your exhibition to address any issues immediately."}
        ]
      } else if (processSteps.length < 6) {
        // Pad with default steps if less than 6
        const defaultSteps = [
          {"id": "1", "icon": "💡", "title": "Brief", "description": "Understanding your specific requirements and exhibition goals through detailed briefing sessions."},
          {"id": "2", "icon": "✏️", "title": "3D Visuals", "description": "Creating realistic 3D visualizations to help you envision your exhibition stand before construction."},
          {"id": "3", "icon": "🏭", "title": "Production", "description": "Professional manufacturing in our state-of-the-art facilities with quality control at every step."},
          {"id": "4", "icon": "🚚", "title": "Logistics", "description": "Seamless transportation and delivery to ensure your stand arrives on time and in perfect condition."},
          {"id": "5", "icon": "🔧", "title": "Installation", "description": "Expert installation team ensures proper setup and functionality of all stand components."},
          {"id": "6", "icon": "🎯", "title": "Show Support", "description": "Round-the-clock support throughout your exhibition to address any issues immediately."}
        ]
        // Merge existing steps with default steps
        for (let i = processSteps.length; i < 6; i++) {
          processSteps.push(defaultSteps[i])
        }
      } else if (processSteps.length > 6) {
        // Truncate to 6 steps if more than 6
        processSteps = processSteps.slice(0, 6)
      }

      const loadedData: CountryData = {
        slug: country.slug || '',
        name: country.name || '',
        is_active: country.is_active !== undefined ? country.is_active : true,
        seo_title: country.seo_title || '',
        seo_description: country.seo_description || '',
        seo_keywords: country.seo_keywords || '',
        hero_title: country.hero_title || '',
        hero_subtitle: country.hero_subtitle || '',
        hero_background_image_url: country.hero_background_image_url || '',
        hero_background_image_alt: country.hero_background_image_alt || '',
        why_choose_us_title: country.why_choose_us_title || '',
        why_choose_us_main_image_url: country.why_choose_us_main_image_url || '',
        why_choose_us_main_image_alt: country.why_choose_us_main_image_alt || '',
        why_choose_us_benefits_html: country.why_choose_us_benefits_html || '',
        what_we_do_title: country.what_we_do_title || '',
        what_we_do_description_html: country.what_we_do_description_html || '',
        portfolio_section_title: country.portfolio_section_title || 'OUR PORTFOLIO',
        portfolio_section_subtitle: country.portfolio_section_subtitle || 'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.',
        portfolio_section_cta_text: country.portfolio_section_cta_text || 'View All Projects',
        portfolio_section_cta_link: country.portfolio_section_cta_link || '/portfolio',
        company_info_title: country.company_info_title || '',
        company_info_content_html: country.company_info_content_html || '',
        best_company_title: country.best_company_title || '',
        best_company_subtitle: country.best_company_subtitle || '',
        best_company_content_html: country.best_company_content_html || '',
        process_section_title: country.process_section_title || '',
        process_section_subtitle_html: country.process_section_subtitle_html || '',
        process_section_steps: processSteps,
        cities_section_title: country.cities_section_title || '',
        cities_section_subtitle: country.cities_section_subtitle || '',
      }

      setFormData(loadedData)
    }
  }, [country])

  // State for selected files (not yet uploaded)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<{field: string, url: string} | null>(null)

  // Get image URL for preview (from selected files as preview, or from form data)
  const getImageUrl = (field: string): string => {
    // Check if we have a selected file for preview
    if (selectedFiles[field]) {
      return URL.createObjectURL(selectedFiles[field])
    }
    // Otherwise, use the URL from form data
    const fieldValue = formData[field as keyof CountryData];
    return typeof fieldValue === 'string' ? fieldValue : ''
  }

  // Function to handle image upload (for new images)
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
      toast.error(`Failed to select image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploading(null)
    }
  }

  // Function to remove an image
  const removeImage = (field: string) => {
    // Check if this is a selected file or an existing one
    const isExistingImage = !!formData[field as keyof CountryData];
    
    if (isExistingImage) {
      // For existing images, we'll mark it for deletion during save
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
    
    const { field, url } = imageToDelete;
    
    try {
      // Delete from storage
      const { error } = await CountriesService.deleteImage(url);
      
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
            await CountriesService.deleteImage(formData.hero_background_image_url)
          } catch (deleteError) {
            console.warn('Failed to delete previous image:', deleteError)
          }
        }
        
        const { data, error } = await CountriesService.uploadImage(selectedFiles.hero_background_image_url)
        if (error) throw new Error(error)
        if (!data) throw new Error('No URL returned from upload')
        updatedFormData.hero_background_image_url = data
      }
      
      // Handle why choose us main image upload
      if (selectedFiles.why_choose_us_main_image_url) {
        // Delete previous image if it exists
        if (formData.why_choose_us_main_image_url) {
          try {
            await CountriesService.deleteImage(formData.why_choose_us_main_image_url)
          } catch (deleteError) {
            console.warn('Failed to delete previous image:', deleteError)
          }
        }
        
        const { data, error } = await CountriesService.uploadImage(selectedFiles.why_choose_us_main_image_url)
        if (error) throw new Error(error)
        if (!data) throw new Error('No URL returned from upload')
        updatedFormData.why_choose_us_main_image_url = data
      }

      const { error } = await CountriesService.updateCountry(id, {
        slug: updatedFormData.slug,
        name: updatedFormData.name,
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
        company_info_title: updatedFormData.company_info_title,
        company_info_content_html: updatedFormData.company_info_content_html,
        best_company_title: updatedFormData.best_company_title,
        best_company_subtitle: updatedFormData.best_company_subtitle,
        best_company_content_html: updatedFormData.best_company_content_html,
        process_section_title: updatedFormData.process_section_title,
        process_section_subtitle_html: updatedFormData.process_section_subtitle_html,
        process_section_steps: updatedFormData.process_section_steps,
        cities_section_title: updatedFormData.cities_section_title,
        cities_section_subtitle: updatedFormData.cities_section_subtitle,
      })

      if (error) throw new Error(error)
      
      // Clear selected files after successful save
      setSelectedFiles({})
      
      toast.success('Country updated successfully!')
      navigate('/admin/countries')
    } catch (error: any) {
      console.error('Error updating country:', error)
      toast.error(`Failed to update country: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug when country name is changed
    if (field === 'name') {
      const generatedSlug = `exhibition-stand-builder-${slugify(value)}`
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

  // Function to confirm image deletion
  const confirmImageDeletion = (field: string) => {
    const imageUrl = formData[field as keyof CountryData];
    if (typeof imageUrl === 'string') {
      setImageToDelete({ field, url: imageUrl });
      setDeleteDialogOpen(true);
    }
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
        <p>Error loading country: {error}</p>
      </div>
    )
  }

  if (!country) {
    return (
      <div className="text-center">
        <p>Country not found</p>
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
        <h1 className="text-2xl font-bold mb-2">Edit Country</h1>
        <p className="text-muted-foreground">Edit country details and content</p>
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
                placeholder="e.g., exhibition-stand-builder-france"
                readOnly
              />
              <p className="text-sm text-muted-foreground mt-1">
                Slug is automatically generated as "exhibition-stand-builder-[country-name]"
              </p>
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
              <Label htmlFor="hero_subtitle">Button Title</Label>
              <Input
                id="hero_subtitle"
                value={formData.hero_subtitle}
                onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                placeholder="e.g., FRANCE"
              />
            </div>
            <div className="md:col-span-2">
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
                    onClick={() => {
                      const fileInput = document.getElementById('hero-background-file-input')
                      if (fileInput) {
                        fileInput.click()
                      }
                    }}
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
                      alt={formData.hero_background_image_alt || "Hero preview"} 
                      className="h-32 object-cover rounded border"
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
              </div>
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
            <div className="md:col-span-2">
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
                    onClick={() => {
                      const fileInput = document.getElementById('why-choose-us-main-file-input')
                      if (fileInput) {
                        fileInput.click()
                      }
                    }}
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
                      className="h-32 object-cover rounded border"
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
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Benefits HTML Content</Label>
              <RichTextEditor
                content={formData.why_choose_us_benefits_html || ''}
                onChange={(content) => handleRichTextChange('why_choose_us_benefits_html', content)}
                controlled={true} // Enable controlled mode
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
            <div className="md:col-span-2">
              <Label>Description HTML Content</Label>
              <RichTextEditor
                content={formData.what_we_do_description_html || ''}
                onChange={(content) => handleRichTextChange('what_we_do_description_html', content)}
                controlled={true} // Enable controlled mode
              />
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Portfolio Section</h2>
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
                controlled={true} // Enable controlled mode
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
                controlled={true} // Enable controlled mode
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
              <Label>Subtitle</Label>
              <RichTextEditor
                content={formData.process_section_subtitle_html || ''}
                onChange={(content) => handleRichTextChange('process_section_subtitle_html', content)}
                controlled={true}
              />
            </div>
            <div>
              <Label>Process Steps</Label>
              <div className="space-y-4">
                {formData.process_section_steps.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Step {index + 1}</h3>
                      {/* Remove button removed to make steps non-removable */}
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
                {/* Add Process Step button removed to keep constant 6 steps */}
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
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-800 mb-2">City Management</h3>
                <p className="text-sm text-blue-700">
                  Cities for this country are managed automatically. When you create a city in the Cities section 
                  and select this country, it will automatically appear on this country's page.
                </p>
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
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}