import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Search, Plus, Trash2, Edit, MapPin, Eye } from 'lucide-react'
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
        )
        
        if (!cityExists) {
          // Add new city to existing cities
          const updatedCities = [...globalLocations.cities, newCityName]
          
          // Update the global locations with the new city list
          const { error: updateError } = await GlobalLocationsService.updateGlobalLocations(globalLocations.id, {
            ...globalLocations,
            cities: updatedCities
          })
          
          if (updateError) {
            throw new Error(updateError)
          }
          
          // Trigger revalidation for the trade shows page
          await GlobalLocationsService.triggerRevalidation('/trade-shows')
          
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

  // Filter existing cities for the add dialog
  const existingCities = useMemo(() => {
    if (!globalLocations?.cities) return []
    
    return globalLocations.cities
      .sort()
  }, [globalLocations?.cities])

  // Filter cities based on search term in add dialog
  const filteredExistingCities = useMemo(() => {
    if (!addCityDialogOpen || !existingCities) return []
    
    const term = searchTerm.toLowerCase().trim()
    return existingCities.filter(city => 
      city.toLowerCase().includes(term)
    )
  }, [existingCities, searchTerm, addCityDialogOpen])

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
    )

    if (cityExists) {
      toast.error(`City page for "${selectedCity}" already exists!`)
      return
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

      // Trigger revalidation for the new city page (will be at root level until country is set)
      await CitiesService.triggerRevalidation(`/${citySlug}`)

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

  // Filter available cities for the dialog
  const availableCities = useMemo(() => {
    if (!globalLocations?.cities) return []
    
    return globalLocations.cities
      .filter(city => !cities?.some(c => c.name.toLowerCase() === city.toLowerCase()))
      .sort()
  }, [globalLocations?.cities, cities])

  // Filter cities based on search term in dialog
  const filteredAvailableCities = useMemo(() => {
    if (!selectCityDialogOpen || !availableCities) return []
    
    const term = searchTerm.toLowerCase().trim()
    return availableCities.filter(city => 
      city.toLowerCase().includes(term)
    )
  }, [availableCities, searchTerm, selectCityDialogOpen])

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

  const handleViewCity = (citySlug: string) => {
    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicleseurope.vercel.app';
    window.open(`${websiteUrl}/${citySlug}`, '_blank');
  };

  return (
    <div className="space-y-6 w-full">
      {/* Add City Dialog */}
      <Dialog open={addCityDialogOpen} onOpenChange={(open) => {
        setAddCityDialogOpen(open)
        if (!open) {
          setSearchTerm('')
          setNewCityName('')
        }
      }}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add New City</DialogTitle>
            <DialogDescription>
              Add a new city to the global locations list. This city will be available for creating city pages.
            </DialogDescription>
          </DialogHeader>
          
          {/* Add New City Input */}
          <div className="grid gap-4 py-2">
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
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search existing cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Existing Cities List */}
          <div className="flex-1 overflow-y-auto border rounded-md max-h-[300px] mt-2">
            <div className="p-2 bg-gray-100 text-sm font-medium border-b">
              Existing Cities ({existingCities.length})
            </div>
            {filteredExistingCities.length > 0 ? (
              <div className="divide-y">
                {filteredExistingCities.map((city, index) => (
                  <div 
                    key={index}
                    className="p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{city}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No cities match your search' : 'No existing cities'}
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setAddCityDialogOpen(false)
              setSearchTerm('')
              setNewCityName('')
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCity} 
              disabled={addingCity || !newCityName.trim()}
            >
              {addingCity ? 'Adding...' : 'Add City'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select City Dialog */}
      <Dialog open={selectCityDialogOpen} onOpenChange={(open) => {
        setSelectCityDialogOpen(open)
        if (!open) {
          setSearchTerm('')
          setSelectedCity(null)
        }
      }}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create City Page</DialogTitle>
            <DialogDescription>
              Select a city from the list below to create a new city page.
            </DialogDescription>
          </DialogHeader>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Cities List */}
          <div className="flex-1 overflow-y-auto border rounded-md max-h-[400px]">
            {filteredAvailableCities.length > 0 ? (
              <div className="divide-y">
                {filteredAvailableCities.map((city) => (
                  <div 
                    key={city}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedCity === city ? 'bg-green-50 border-l-4 border-green-500' : ''
                    }`}
                    onClick={() => setSelectedCity(city)}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                        selectedCity === city ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                        {selectedCity === city && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className={selectedCity === city ? 'font-medium' : ''}>{city}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No cities match your search' : 'No available cities'}
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setSelectCityDialogOpen(false)
              setSearchTerm('')
              setSelectedCity(null)
            }}>
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
            <DialogDescription>
              Are you sure you want to delete the city "{cityToDelete?.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cities</h1>
          <p className="text-muted-foreground mt-2">
            Manage cities and exhibition stand builder pages
          </p>
        </div>
        <div className="flex gap-2">
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

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        {searchTerm && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSearchTerm('')}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Cities Table */}
      <div className="bg-white rounded-lg border shadow-sm w-full">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Cities</h2>
          <p className="text-sm text-gray-600 mt-1">
            List of all cities in the system
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City Slug</TableHead>
              <TableHead>Country Slug</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCities.map((city) => (
              <TableRow key={city.id}>
                <TableCell className="font-medium">{city.name}</TableCell>
                <TableCell>{city.city_slug}</TableCell>
                <TableCell>{city.country_slug}</TableCell>
                <TableCell>
                  {city.updated_at 
                    ? new Date(city.updated_at).toLocaleDateString() 
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCity(city.city_slug)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCity(city.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmDeleteCity(city.id, city.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No cities found matching your search' : 'No cities found'}
            </p>
            {!searchTerm && (
              <Button
                variant="default"
                className="mt-4"
                onClick={openAddCityDialog}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First City
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}