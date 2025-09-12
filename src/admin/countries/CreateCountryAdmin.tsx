import { useState, useEffect } from 'react'
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
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { CountriesService } from '@/data/countriesService'
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
  })

  // State for selected files (not yet uploaded)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  
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

  const handleRichTextChange = (field: string, content: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: content
    }))
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
      toast.error(`Failed to select image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploading(null)
    }
  }

  // Get image URL for preview (from selected files as preview, or from form data)
  const getImageUrl = (field: string): string => {
    // Check if we have a selected file for preview
    if (selectedFiles[field]) {
      return URL.createObjectURL(selectedFiles[field])
    }
    // Otherwise, use the URL from form data
    const fieldValue = formData[field as keyof typeof formData];
    return typeof fieldValue === 'string' ? fieldValue : ''
  }

  // Function to remove an image
  const removeImage = (field: string) => {
    // Remove selected file
    setSelectedFiles(prev => {
      const newSelectedFiles = { ...prev };
      delete newSelectedFiles[field];
      return newSelectedFiles;
    });
    
    // Also clear the field value if it's a URL
    if (formData[field as keyof typeof formData]) {
      setFormData(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    toast.success('Image removed successfully');
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      // First, upload any images
      const updatedFormData = { ...formData }
      
      // Handle hero background image upload
      if (selectedFiles.hero_background_image_url) {
        const { data, error } = await CountriesService.uploadImage(selectedFiles.hero_background_image_url)
        if (error) throw new Error(error)
        if (!data) throw new Error('No URL returned from upload')
        updatedFormData.hero_background_image_url = data
      }
      
      // Handle why choose us main image upload
      if (selectedFiles.why_choose_us_main_image_url) {
        const { data, error } = await CountriesService.uploadImage(selectedFiles.why_choose_us_main_image_url)
        if (error) throw new Error(error)
        if (!data) throw new Error('No URL returned from upload')
        updatedFormData.why_choose_us_main_image_url = data
      }

      const { error } = await CountriesService.createCountry({
        slug: updatedFormData.slug,
        name: updatedFormData.name,
        is_active: updatedFormData.is_active,
        seo_title: updatedFormData.seo_title,
        seo_description: updatedFormData.seo_description,
        seo_keywords: updatedFormData.seo_keywords,
        hero_title: updatedFormData.hero_title,
        hero_subtitle: updatedFormData.hero_subtitle,
        hero_background_image_url: updatedFormData.hero_background_image_url,
        why_choose_us_title: updatedFormData.why_choose_us_title,
        why_choose_us_subtitle: updatedFormData.why_choose_us_subtitle,
        why_choose_us_main_image_url: updatedFormData.why_choose_us_main_image_url,
        why_choose_us_benefits_html: updatedFormData.why_choose_us_benefits_html,
        what_we_do_title: updatedFormData.what_we_do_title,
        what_we_do_subtitle: updatedFormData.what_we_do_subtitle,
        what_we_do_description_html: updatedFormData.what_we_do_description_html,
        company_info_title: updatedFormData.company_info_title,
        company_info_content_html: updatedFormData.company_info_content_html,
        best_company_title: updatedFormData.best_company_title,
        best_company_subtitle: updatedFormData.best_company_subtitle,
        best_company_content_html: updatedFormData.best_company_content_html,
        process_section_title: updatedFormData.process_section_title,
        process_section_steps: updatedFormData.process_section_steps,
        cities_section_title: updatedFormData.cities_section_title,
        cities_section_subtitle: updatedFormData.cities_section_subtitle,
      })

      if (error) throw new Error(error)
      
      // Clear selected files after successful save
      setSelectedFiles({})
      
      toast.success('Country created successfully!')
      navigate('/admin/countries')
    } catch (error: any) {
      console.error('Error creating country:', error)
      toast.error(`Failed to create country: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
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

  return (
    <div className="w-full">
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
              <div className="space-y-2">
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
              <div className="space-y-2">
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
                controlled={true} // Enable controlled mode
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
                Save Country
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}