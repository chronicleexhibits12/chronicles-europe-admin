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
import { Search, Plus, Trash2, Edit, Globe, Eye } from 'lucide-react'
import { useCountries } from '@/hooks/useCountriesContent'
import { CountriesService } from '@/data/countriesService'
import { GlobalLocationsService } from '@/data/globalLocationsService'
import { useGlobalLocations } from '@/hooks/useGlobalLocations'
import { slugify } from '@/utils/slugify'

export function CountriesAdmin() {
  const navigate = useNavigate()
  const { data: countries = [], loading, error, refetch } = useCountries()
  const { data: globalLocations } = useGlobalLocations()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [countryToDelete, setCountryToDelete] = useState<{ id: string; name: string } | null>(null)
  const [addCountryDialogOpen, setAddCountryDialogOpen] = useState(false)
  const [newCountryName, setNewCountryName] = useState('')
  const [addingCountry, setAddingCountry] = useState(false)
  const [selectCountryDialogOpen, setSelectCountryDialogOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [creatingCountryPage, setCreatingCountryPage] = useState(false)
  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries
    
    const term = searchTerm.toLowerCase().trim()
    return countries.filter(country => 
      country.name.toLowerCase().includes(term) ||
      country.slug.toLowerCase().includes(term)
    )
  }, [countries, searchTerm])

  const handleViewCountry = (slug: string) => {
    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicleseurope.vercel.app';
    window.open(`${websiteUrl}/${slug}`, '_blank');
  };

  const handleEditCountry = (id: string) => {
    navigate(`/admin/countries/${id}/edit`)
  }

  const confirmDeleteCountry = (id: string, name: string) => {
    setCountryToDelete({ id, name })
    setDeleteDialogOpen(true)
  }

  const handleDeleteCountry = async () => {
    if (!countryToDelete) return

    try {
      // Delete the country from the database
      const { error: deleteError } = await CountriesService.deleteCountry(countryToDelete.id)
      
      if (deleteError) {
        throw new Error(deleteError)
      }
      
      toast.success('Country deleted successfully')
      refetch()
      setDeleteDialogOpen(false)
      setCountryToDelete(null)
    } catch (error: any) {
      console.error('Error deleting country:', error)
      toast.error('Failed to delete country: ' + (error.message || 'Unknown error'))
      setDeleteDialogOpen(false)
      setCountryToDelete(null)
    }
  }

  const openAddCountryDialog = () => {
    setAddCountryDialogOpen(true)
    setNewCountryName('')
  }

  const handleAddCountry = async () => {
    if (!newCountryName.trim()) {
      toast.error('Please enter a country name')
      return
    }

    setAddingCountry(true)
    try {
      // Add the country to the global locations countries array
      if (globalLocations) {
        // Check if country already exists in the array (case-insensitive comparison)
        const countryExists = globalLocations.countries.some(country => 
          country.toLowerCase() === newCountryName.toLowerCase()
        )
        
        if (!countryExists) {
          // Add new country to existing countries
          const updatedCountries = [...globalLocations.countries, newCountryName]
          
          // Update the global locations with the new country list
          const { error: updateError } = await GlobalLocationsService.updateGlobalLocations(globalLocations.id, {
            ...globalLocations,
            countries: updatedCountries
          })
          
          if (updateError) {
            throw new Error(updateError)
          }
          
          // Trigger revalidation
          await GlobalLocationsService.triggerRevalidation('/trade-shows')
          
          toast.success('Country added successfully!')
        } else {
          toast.error('Country already exists!')
        }
      }

      setAddCountryDialogOpen(false)
      setNewCountryName('')
      // We don't need to refetch countries since we're not adding to the countries table
    } catch (error: any) {
      console.error('Error adding country:', error)
      toast.error('Failed to add country: ' + (error.message || 'Unknown error'))
    } finally {
      setAddingCountry(false)
    }
  }

  // Filter existing countries for the add dialog
  const existingCountries = useMemo(() => {
    if (!globalLocations?.countries) return []
    
    return globalLocations.countries
      .sort()
  }, [globalLocations?.countries])

  // Filter countries based on search term in add dialog
  const filteredExistingCountries = useMemo(() => {
    if (!addCountryDialogOpen || !existingCountries) return []
    
    const term = searchTerm.toLowerCase().trim()
    return existingCountries.filter(country => 
      country.toLowerCase().includes(term)
    )
  }, [existingCountries, searchTerm, addCountryDialogOpen])

  const openSelectCountryDialog = () => {
    setSelectCountryDialogOpen(true)
    setSelectedCountry(null)
  }

  const handleCreateCountryPage = async () => {
    if (!selectedCountry) {
      toast.error('Please select a country')
      return
    }

    // Check if country page already exists (case-insensitive comparison)
    const countryExists = countries?.some(country => 
      country.name.toLowerCase() === selectedCountry.toLowerCase()
    )

    if (countryExists) {
      toast.error(`Country page for "${selectedCountry}" already exists!`)
      return
    }

    setCreatingCountryPage(true)
    try {
      // Generate slug for the country
      const slug = `exhibition-stand-builder-${slugify(selectedCountry)}`
      
      // Create country data with default values
      const countryData = {
        slug,
        name: selectedCountry,
        is_active: true,
        seo_title: `Exhibition Stand Builder in ${selectedCountry}`,
        seo_description: `Professional exhibition stand design and build services in ${selectedCountry}. Creative solutions for trade shows and exhibitions.`,
        seo_keywords: `exhibition stand, trade show, ${selectedCountry}, display stands, booth design`,
        hero_title: "EXHIBITION STAND DESIGN AND BUILD IN",
        hero_subtitle: selectedCountry.toUpperCase(),
        hero_background_image_url: "",
        why_choose_us_title: "Why Choose Us for Exhibition Stands in",
        why_choose_us_subtitle: `${selectedCountry}?`,
        why_choose_us_main_image_url: "",
        why_choose_us_benefits_html: "<p>Our team of experts brings creativity and innovation to every project, ensuring your brand stands out at every exhibition.</p>",
        what_we_do_title: "WHAT WE DO?",
        what_we_do_subtitle: "WE DO?",
        what_we_do_description_html: "<p>We specialize in creating custom exhibition stands that perfectly represent your brand and attract your target audience.</p>",
        company_info_title: `DISTINGUISHED EXHIBITION STAND BUILDER IN ${selectedCountry.toUpperCase()}`,
        company_info_content_html: `<p>As a leading exhibition stand builder in ${selectedCountry}, we combine creativity with technical expertise to deliver exceptional results.</p>`,
        best_company_title: `BEST EXHIBITION STAND DESIGN COMPANY IN ${selectedCountry.toUpperCase()} FOR`,
        best_company_subtitle: "EXCEPTIONAL EXPERIENCE",
        best_company_content_html: `<p>Our commitment to excellence has made us the preferred choice for businesses seeking top-quality exhibition stands in ${selectedCountry}.</p>`,
        process_section_title: "The Art And Science Behind Our Exhibition Stand Design & Build Process",
        process_section_steps: [
          {"id": "1", "icon": "💡", "title": "Brief", "description": "Understanding your specific requirements and exhibition goals through detailed briefing sessions."},
          {"id": "2", "icon": "✏️", "title": "3D Visuals", "description": "Creating realistic 3D visualizations to help you envision your exhibition stand before construction."},
          {"id": "3", "icon": "🏭", "title": "Production", "description": "Professional manufacturing in our state-of-the-art facilities with quality control at every step."},
          {"id": "4", "icon": "🚚", "title": "Logistics", "description": "Seamless transportation and delivery to ensure your stand arrives on time and in perfect condition."},
          {"id": "5", "icon": "🔧", "title": "Installation", "description": "Expert installation team ensures proper setup and functionality of all stand components."},
          {"id": "6", "icon": "🎯", "title": "Show Support", "description": "Round-the-clock support throughout your exhibition to address any issues immediately."}
        ],
        cities_section_title: `EXHIBITION STAND BUILDER IN CITIES OF ${selectedCountry.toUpperCase()}`,
        cities_section_subtitle: `Explore our services in major cities across ${selectedCountry}`
      }

      // Create the country
      const { error } = await CountriesService.createCountry(countryData)
      
      if (error) {
        throw new Error(error)
      }

      // Trigger revalidation for the new country page
      await CountriesService.triggerRevalidation(`/${slug}`)

      toast.success('Country page created successfully!')
      setSelectCountryDialogOpen(false)
      setSelectedCountry(null)
      refetch()
    } catch (error: any) {
      console.error('Error creating country page:', error)
      toast.error('Failed to create country page: ' + (error.message || 'Unknown error'))
    } finally {
      setCreatingCountryPage(false)
    }
  }

  // Filter available countries for the dialog
  const availableCountries = useMemo(() => {
    if (!globalLocations?.countries) return []
    
    return globalLocations.countries
      .filter(country => !countries?.some(c => c.name.toLowerCase() === country.toLowerCase()))
      .sort()
  }, [globalLocations?.countries, countries])

  // Filter countries based on search term in dialog
  const filteredAvailableCountries = useMemo(() => {
    if (!selectCountryDialogOpen || !availableCountries) return []
    
    const term = searchTerm.toLowerCase().trim()
    return availableCountries.filter(country => 
      country.toLowerCase().includes(term)
    )
  }, [availableCountries, searchTerm, selectCountryDialogOpen])

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
        Error loading countries: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Add Country Dialog */}
      <Dialog open={addCountryDialogOpen} onOpenChange={(open) => {
        setAddCountryDialogOpen(open)
        if (!open) {
          setSearchTerm('')
          setNewCountryName('')
        }
      }}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Add New Country</DialogTitle>
            <DialogDescription>
              Add a new country to the global locations list. This country will be available for creating country pages.
            </DialogDescription>
          </DialogHeader>
          
          {/* Add New Country Input */}
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="countryName" className="text-right">
                Country Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="countryName"
                  value={newCountryName}
                  onChange={(e) => setNewCountryName(e.target.value)}
                  placeholder="Enter country name"
                />
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search existing countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Existing Countries List */}
          <div className="flex-1 overflow-y-auto border rounded-md max-h-[300px] mt-2">
            <div className="p-2 bg-gray-100 text-sm font-medium border-b">
              Existing Countries ({existingCountries.length})
            </div>
            {filteredExistingCountries.length > 0 ? (
              <div className="divide-y">
                {filteredExistingCountries.map((country, index) => (
                  <div 
                    key={index}
                    className="p-3 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{country}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No countries match your search' : 'No existing countries'}
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setAddCountryDialogOpen(false)
              setSearchTerm('')
              setNewCountryName('')
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCountry} 
              disabled={addingCountry || !newCountryName.trim()}
            >
              {addingCountry ? 'Adding...' : 'Add Country'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Country Dialog */}
      <Dialog open={selectCountryDialogOpen} onOpenChange={(open) => {
        setSelectCountryDialogOpen(open)
        if (!open) {
          setSearchTerm('')
          setSelectedCountry(null)
        }
      }}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create Country Page</DialogTitle>
            <DialogDescription>
              Select a country from the list below to create a new country page.
            </DialogDescription>
          </DialogHeader>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Countries List */}
          <div className="flex-1 overflow-y-auto border rounded-md max-h-[400px]">
            {filteredAvailableCountries.length > 0 ? (
              <div className="divide-y">
                {filteredAvailableCountries.map((country) => (
                  <div 
                    key={country}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedCountry === country ? 'bg-green-50 border-l-4 border-green-500' : ''
                    }`}
                    onClick={() => setSelectedCountry(country)}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                        selectedCountry === country ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                        {selectedCountry === country && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className={selectedCountry === country ? 'font-medium' : ''}>{country}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No countries match your search' : 'No available countries'}
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => {
              setSelectCountryDialogOpen(false)
              setSearchTerm('')
              setSelectedCountry(null)
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCountryPage} 
              disabled={creatingCountryPage || !selectedCountry}
            >
              {creatingCountryPage ? 'Creating...' : 'Create Page'}
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
              Are you sure you want to delete the country "{countryToDelete?.name}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCountry}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Countries</h1>
          <p className="text-muted-foreground mt-2">
            Manage countries and exhibition stand builder pages
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openAddCountryDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Country
          </Button>
          <Button onClick={openSelectCountryDialog} variant="secondary">
            <Globe className="h-4 w-4 mr-2" />
            Create Country Page
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search countries..."
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

      {/* Countries Table */}
      <div className="bg-white rounded-lg border shadow-sm w-full">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Countries</h2>
          <p className="text-sm text-gray-600 mt-1">
            List of all countries in the system
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCountries.map((country) => (
              <TableRow key={country.id}>
                <TableCell className="font-medium">{country.name}</TableCell>
                <TableCell>{country.slug}</TableCell>
                <TableCell>
                  {country.updated_at 
                    ? new Date(country.updated_at).toLocaleDateString() 
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCountry(country.slug)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCountry(country.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmDeleteCountry(country.id, country.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No countries found matching your search' : 'No countries found'}
            </p>
            {!searchTerm && (
              <Button
                variant="default"
                className="mt-4"
                onClick={openAddCountryDialog}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Country
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}