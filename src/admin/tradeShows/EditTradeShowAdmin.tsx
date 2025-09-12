import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { TagInput } from '@/components/ui/tag-input'
import { Loader2, Save, Upload, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useTradeShow } from '@/hooks/useTradeShowsContent'
import { TradeShowsService } from '@/data/tradeShowsService'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function EditTradeShowAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: tradeShow, loading, error, refetch } = useTradeShow(id || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [newCity, setNewCity] = useState('')
  const [newCountry, setNewCountry] = useState('')
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false)
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    // Basic information
    slug: '',
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    location: '',
    country: '',
    city: '',
    website: '',
    
    // Images
    logo: '',
    logoAlt: '',
    
    // SEO Metadata
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    
    // Status
    isActive: true
  })

  // Fetch available cities and countries from trade_shows_page table
  useEffect(() => {
    const fetchAvailableLocations = async () => {
      try {
        const { data: pageData, error } = await TradeShowsService.getTradeShowsPage()
        
        if (error) {
          console.error('Error fetching trade shows page data:', error)
          toast.error(`Failed to fetch location data: ${error}`)
          return
        }
        
        if (pageData) {
          setAvailableCities(pageData.cities || [])
          setAvailableCountries(pageData.countries || [])
        }
      } catch (error: any) {
        console.error('Error fetching available locations:', error)
        toast.error(`Failed to fetch available locations: ${error.message || 'Unknown error'}`)
      }
    }
    
    fetchAvailableLocations()
  }, [])

  // Initialize form with trade show data
  useEffect(() => {
    if (tradeShow) {
      setFormData({
        slug: tradeShow.slug || '',
        title: tradeShow.title || '',
        content: tradeShow.content || '',
        startDate: tradeShow.startDate || '',
        endDate: tradeShow.endDate || '',
        location: tradeShow.location || '',
        country: tradeShow.country || '',
        city: tradeShow.city || '',
        website: tradeShow.website || '',
        logo: tradeShow.logo || '',
        logoAlt: tradeShow.logoAlt || '',
        metaTitle: tradeShow.metaTitle || '',
        metaDescription: tradeShow.metaDescription || '',
        metaKeywords: tradeShow.metaKeywords || '',
        isActive: tradeShow.isActive
      })
    }
  }, [tradeShow])

  const handleSave = async () => {
    if (!id) return
    
    setSaving(true)
    
    try {
      const { error } = await TradeShowsService.updateTradeShow(id, {
        slug: formData.slug,
        title: formData.title,
        content: formData.content,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        country: formData.country,
        city: formData.city,
        website: formData.website,
        logo: formData.logo,
        logoAlt: formData.logoAlt,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
        isActive: formData.isActive
      })

      if (error) throw new Error(error)
      
      // Refresh the data after successful save
      await refetch()
      
      toast.success('Trade show updated successfully!')
      navigate('/admin/trade-shows')
    } catch (error: any) {
      console.error('Error updating trade show:', error)
      toast.error(`Failed to update trade show: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File, field: string) => {
    setUploading(field)
    
    try {
      const { data, error } = await TradeShowsService.uploadImage(file)
      
      if (error) throw new Error(error)
      if (!data) throw new Error('No URL returned from upload')
      
      // Update form data with the uploaded image URL
      setFormData(prev => ({
        ...prev,
        [field]: data
      }))
      
      toast.success('Image uploaded successfully!')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(`Failed to upload image: ${error.message || 'Unknown error'}`)
    } finally {
      setUploading(null)
    }
  }

  const removeImage = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: ''
    }))
    toast.success('Image removed successfully')
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-fill location when city or country is changed
    if (field === 'city' || field === 'country') {
      const newCity = field === 'city' ? value : formData.city
      const newCountry = field === 'country' ? value : formData.country
      
      // Only update location if both city and country have values
      if (newCity && newCountry) {
        setFormData(prev => ({
          ...prev,
          location: `${newCity}, ${newCountry}`
        }))
      } else if (newCity || newCountry) {
        // If only one has a value, use that
        setFormData(prev => ({
          ...prev,
          location: (newCity || newCountry) as string
        }))
      }
    }
  }

  const handleKeywordsChange = (keywords: string[]) => {
    handleInputChange('metaKeywords', keywords.join(', '))
  }

  const getKeywordsArray = () => {
    return formData.metaKeywords ? formData.metaKeywords.split(',').map(k => k.trim()).filter(k => k) : []
  }

  // Get image URL for preview
  const getImageUrl = (field: string): string => {
    const value = formData[field as keyof typeof formData]
    return typeof value === 'string' ? value : ''
  }

  // Add a new city to the available cities list
  const addCity = async () => {
    if (!newCity.trim()) return
    
    try {
      // Get current page data
      const { data: pageData, error: fetchError } = await TradeShowsService.getTradeShowsPage()
      
      if (fetchError) throw new Error(fetchError)
      
      if (pageData) {
        // Check if city already exists in the array (case-insensitive comparison)
        const cityExists = pageData.cities.some(city => 
          city.toLowerCase() === newCity.trim().toLowerCase()
        );
        
        if (!cityExists) {
          // Add new city to existing cities
          const updatedCities = [...(pageData.cities || []), newCity.trim()]
          
          // Update the trade shows page with the new city list
          const { error: updateError } = await TradeShowsService.updateTradeShowsPage(pageData.id, {
            ...pageData,
            cities: updatedCities
          })
          
          if (updateError) throw new Error(updateError)
          
          // Update local state
          setAvailableCities(updatedCities)
          // Auto-select the newly added city
          handleInputChange('city', newCity.trim())
          setNewCity('')
          setIsCityDialogOpen(false)
          toast.success('City added successfully!')
        } else {
          // Find the existing city with correct casing
          const existingCity = pageData.cities.find(city => 
            city.toLowerCase() === newCity.trim().toLowerCase()
          );
          // Auto-select the existing city
          if (existingCity) {
            handleInputChange('city', existingCity)
          }
          toast.error('City already exists!')
          setNewCity('')
          setIsCityDialogOpen(false)
        }
      }
    } catch (error: any) {
      console.error('Error adding city:', error)
      toast.error(`Failed to add city: ${error.message || 'Unknown error'}`)
    }
  }

  // Add a new country to the available countries list
  const addCountry = async () => {
    if (!newCountry.trim()) return
    
    try {
      // Get current page data
      const { data: pageData, error: fetchError } = await TradeShowsService.getTradeShowsPage()
      
      if (fetchError) throw new Error(fetchError)
      
      if (pageData) {
        // Check if country already exists in the array (case-insensitive comparison)
        const countryExists = pageData.countries.some(country => 
          country.toLowerCase() === newCountry.trim().toLowerCase()
        );
        
        if (!countryExists) {
          // Add new country to existing countries
          const updatedCountries = [...(pageData.countries || []), newCountry.trim()]
          
          // Update the trade shows page with the new country list
          const { error: updateError } = await TradeShowsService.updateTradeShowsPage(pageData.id, {
            ...pageData,
            countries: updatedCountries
          })
          
          if (updateError) throw new Error(updateError)
          
          // Update local state
          setAvailableCountries(updatedCountries)
          // Auto-select the newly added country
          handleInputChange('country', newCountry.trim())
          setNewCountry('')
          setIsCountryDialogOpen(false)
          toast.success('Country added successfully!')
        } else {
          // Find the existing country with correct casing
          const existingCountry = pageData.countries.find(country => 
            country.toLowerCase() === newCountry.trim().toLowerCase()
          );
          // Auto-select the existing country
          if (existingCountry) {
            handleInputChange('country', existingCountry)
          }
          toast.error('Country already exists!')
          setNewCountry('')
          setIsCountryDialogOpen(false)
        }
      }
    } catch (error: any) {
      console.error('Error adding country:', error)
      toast.error(`Failed to add country: ${error.message || 'Unknown error'}`)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
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
        Error loading trade show: {error}
      </div>
    )
  }

  if (!tradeShow && !loading) {
    return (
      <div className="p-8 text-center text-red-600">
        Trade show not found
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Edit Trade Show</h1>
        <p className="text-muted-foreground">Update trade show information</p>
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
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., ESC Congress 2025"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="e.g., esc-congress-2025"
                required
              />
            </div>
            <div>
              <Label htmlFor="isActive">Published</Label>
              <div className="mt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            {/* Logo fields added here, right after publish toggle */}
            <div>
              <Label htmlFor="logo">Logo Image</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    disabled={uploading === 'logo'}
                  >
                    {uploading === 'logo' ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Choose Logo
                  </Button>
                </div>
                {getImageUrl('logo') && (
                  <div className="relative inline-block">
                    <img 
                      src={getImageUrl('logo')} 
                      alt="Logo preview" 
                      className="h-20 w-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage('logo')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    e.preventDefault();
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file, 'logo')
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="logoAlt">Logo Alt Text</Label>
              <Input
                id="logoAlt"
                value={formData.logoAlt}
                onChange={(e) => handleInputChange('logoAlt', e.target.value)}
                placeholder="e.g., ESC Congress Logo"
              />
            </div>
            {/* Event Details fields added here */}
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Paris, France"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <div className="flex gap-2">
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a country</option>
                  {availableCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Country</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newCountryInput" className="text-right">
                          Country
                        </Label>
                        <Input
                          id="newCountryInput"
                          value={newCountry}
                          onChange={(e) => setNewCountry(e.target.value)}
                          className="col-span-3"
                          placeholder="Enter country name"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCountryDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addCountry}>Add Country</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <div className="flex gap-2">
                <select
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a city</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New City</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="newCityInput" className="text-right">
                          City
                        </Label>
                        <Input
                          id="newCityInput"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="col-span-3"
                          placeholder="Enter city name"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCityDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addCity}>Add City</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="e.g., https://www.escardio.org"
              />
            </div>
            <div className="col-span-full">
              <Label>Content (Rich Text)</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(newContent) => handleInputChange('content', newContent)}
                controlled={true}
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="admin-section">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">SEO Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="metaTitle">SEO Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                placeholder="SEO title for the trade show page"
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="metaDescription">SEO Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                placeholder="SEO description for the trade show page"
                rows={3}
              />
            </div>
            <div className="col-span-full">
              <Label htmlFor="metaKeywords">SEO Keywords</Label>
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
                Update Trade Show
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}