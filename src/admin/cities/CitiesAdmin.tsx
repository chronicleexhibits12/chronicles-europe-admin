import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Search, Plus, Trash2, Edit3, MapPin } from 'lucide-react'
import { useCities } from '@/hooks/useCitiesContent'
import { CitiesService } from '@/data/citiesService'
import { GlobalLocationsService } from '@/data/globalLocationsService'
import { useGlobalLocations } from '@/hooks/useGlobalLocations'
import { slugify } from '@/utils/slugify'

export function CitiesAdmin() {
  const navigate = useNavigate()
  const { data: cities = [], loading, error, refetch } = useCities()
  const { data: globalLocations } = useGlobalLocations()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cityToDelete, setCityToDelete] = useState<{ id: string; name: string } | null>(null)
  const [addCityDialogOpen, setAddCityDialogOpen] = useState(false)
  const [newCityName, setNewCityName] = useState('')
  const [addingCity, setAddingCity] = useState(false)
  const [selectCityDialogOpen, setSelectCityDialogOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [creatingCityPage, setCreatingCityPage] = useState(false)

  const filteredCities = useMemo(() => {
    if (!searchTerm) return cities
    
    const term = searchTerm.toLowerCase().trim()
    return cities.filter(city => 
      city.name.toLowerCase().includes(term) ||
      city.country_slug.toLowerCase().includes(term) ||
      city.city_slug.toLowerCase().includes(term)
    )
  }, [cities, searchTerm])

  const handleEditCity = (id: string) => {
    navigate(`/admin/cities/${id}/edit`)
  }

  const confirmDeleteCity = (id: string, name: string) => {
    setCityToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  const handleDeleteCity = async () => {
    if (!cityToDelete) return

    try {
      // Delete the city from the database
      const { error: deleteError } = await CitiesService.deleteCity(cityToDelete.id)
      
      if (deleteError) {
        throw new Error(deleteError)
      }
      
      toast.success('City deleted successfully')
      refetch()
      setDeleteDialogOpen(false)
      setCityToDelete(null)
    } catch (error: any) {
      console.error('Error deleting city:', error)
      toast.error('Failed to delete city: ' + (error.message || 'Unknown error'))
      setDeleteDialogOpen(false)
      setCityToDelete(null)
    }
  }

  const openAddCityDialog = () => {
    setAddCityDialogOpen(true)
    setNewCityName('')
  }

  const handleAddCity = async () => {
    if (!newCityName.trim()) {
      toast.error('Please enter a city name')
      return
    }

    setAddingCity(true)
    try {
      // Add the city to the global locations cities array
      if (globalLocations) {
        // Check if city already exists in the array (case-insensitive comparison)
        const cityExists = globalLocations.cities.some(city => 
          city.toLowerCase() === newCityName.toLowerCase()
        );
        
        if (!cityExists) {
          // Add new city to existing cities
          const updatedCities = [...globalLocations.cities, newCityName];
          
          // Update the global locations with the new city list
          const { error: updateError } = await GlobalLocationsService.updateGlobalLocations(globalLocations.id, {
            ...globalLocations,
            cities: updatedCities
          });
          
          if (updateError) {
            throw new Error(updateError);
          }
          
          // Trigger revalidation for the trade shows page
          await GlobalLocationsService.triggerRevalidation('/trade-shows');
          
          toast.success('City added successfully!')
        } else {
          toast.error('City already exists!')
        }
      }

      setAddCityDialogOpen(false)
      setNewCityName('')
      // We don't need to refetch cities since we're not adding to the cities table
    } catch (error: any) {
      console.error('Error adding city:', error)
      toast.error('Failed to add city: ' + (error.message || 'Unknown error'))
    } finally {
      setAddingCity(false)
    }
  }

  const openSelectCityDialog = () => {
    setSelectCityDialogOpen(true)
    setSelectedCity(null)
  }

  const handleCreateCityPage = async () => {
    if (!selectedCity) {
      toast.error('Please select a city')
      return
    }

    // Check if city page already exists (case-insensitive comparison)
    const cityExists = cities?.some(city => 
      city.name.toLowerCase() === selectedCity.toLowerCase()
    );

    if (cityExists) {
      toast.error(`City page for "${selectedCity}" already exists!`);
      return;
    }

    setCreatingCityPage(true)
    try {
      // Generate slug for the city
      const citySlug = `exhibition-stand-builder-${slugify(selectedCity)}`
      
      // Create city data with default values
      const cityData = {
        name: selectedCity,
        city_slug: citySlug,
        country_slug: '', // Will be set by user in the create form
        is_active: true,
        seo_title: `Exhibition Stand Builder in ${selectedCity}`,
        seo_description: `Professional exhibition stand design and build services in ${selectedCity}. Creative solutions for trade shows and exhibitions.`,
        seo_keywords: `exhibition stand, trade show, ${selectedCity}, display stands, booth design`,
        hero_title: "EXHIBITION STAND DESIGN AND BUILD IN",
        hero_subtitle: selectedCity.toUpperCase(),
        hero_background_image_url: "",
        why_choose_us_title: "Why Choose Us for Exhibition Stands in",
        why_choose_us_subtitle: `${selectedCity}?`,
        why_choose_us_main_image_url: "",
        why_choose_us_benefits_html: "<p>Our team of experts brings creativity and innovation to every project, ensuring your brand stands out at every exhibition.</p>",
        what_we_do_title: "WHAT WE DO?",
        what_we_do_subtitle: "WE DO?",
        what_we_do_description_html: "<p>We specialize in creating custom exhibition stands that perfectly represent your brand and attract your target audience.</p>",
        portfolio_title_template: `PORTFOLIO OF EXHIBITION STANDS IN ${selectedCity.toUpperCase()}`,
        exhibiting_experience_title: "EXHIBITING EXPERIENCE",
        exhibiting_experience_subtitle: `Excellence in ${selectedCity}`,
        exhibiting_experience_benefits_html: "<p>With years of experience in the exhibition industry, we understand what it takes to make your brand stand out.</p>",
        exhibiting_experience_excellence_title: "EXCELLENCE IN EXHIBITION STAND DESIGN",
        exhibiting_experience_excellence_subtitle: "Our commitment to quality",
        exhibiting_experience_excellence_points_html: "<ul><li>Expert Design Team</li><li>Quality Materials</li><li>Timely Delivery</li><li>Exceptional Support</li></ul>"
      }

      // Directly create the city page instead of redirecting
      const { error: createError } = await CitiesService.createCity(cityData)
      
      if (createError) {
        throw new Error(createError)
      }

      toast.success('City page created successfully!')
      setSelectCityDialogOpen(false)
      setSelectedCity(null)
      refetch()
    } catch (error: any) {
      console.error('Error creating city page:', error)
      toast.error('Failed to create city page: ' + (error.message || 'Unknown error'))
    } finally {
      setCreatingCityPage(false)
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
        Error loading cities: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Add City Dialog */}
      <Dialog open={addCityDialogOpen} onOpenChange={setAddCityDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New City</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cityName" className="text-right">
                City Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="cityName"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  placeholder="Enter city name"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCityDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCity} disabled={addingCity || !newCityName.trim()}>
              {addingCity ? 'Adding...' : 'Add City'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select City Dialog */}
      <Dialog open={selectCityDialogOpen} onOpenChange={setSelectCityDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create City Page</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="selectCity" className="text-right">
                Select City
              </Label>
              <div className="col-span-3">
                <select
                  id="selectCity"
                  value={selectedCity || ''}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a city</option>
                  {globalLocations?.cities
                    .filter(city => !cities?.some(c => c.name.toLowerCase() === city.toLowerCase()))
                    .map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectCityDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCityPage} 
              disabled={creatingCityPage || !selectedCity}
            >
              {creatingCityPage ? 'Creating...' : 'Create Page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the city "{cityToDelete?.name}"?</p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCity}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cities Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage cities for exhibition stand builder pages
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={openAddCityDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add City
          </Button>
          <Button onClick={openSelectCityDialog} variant="secondary">
            <MapPin className="h-4 w-4 mr-2" />
            Create City Page
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <Card key={city.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {city.name}
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground mb-3">
                <div>Slug: {city.city_slug}</div>
                <div>Country: {city.country_slug}</div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditCity(city.id)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => confirmDeleteCity(city.id, city.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No cities found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchTerm ? 'No cities match your search.' : 'Get started by adding a new city.'}
          </p>
        </div>
      )}
    </div>
  )
}