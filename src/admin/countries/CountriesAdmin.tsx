import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Search, Plus, Trash2, Edit3, Globe } from 'lucide-react'
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
        );
        
        if (!countryExists) {
          // Add new country to existing countries
          const updatedCountries = [...globalLocations.countries, newCountryName];
          
          // Update the global locations with the new country list
          const { error: updateError } = await GlobalLocationsService.updateGlobalLocations(globalLocations.id, {
            ...globalLocations,
            countries: updatedCountries
          });
          
          if (updateError) {
            throw new Error(updateError);
          }
          
          // Trigger revalidation
          await GlobalLocationsService.triggerRevalidation('/trade-shows');
          
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
    );

    if (countryExists) {
      toast.error(`Country page for "${selectedCountry}" already exists!`);
      return;
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
      <Dialog open={addCountryDialogOpen} onOpenChange={setAddCountryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Country</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCountryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCountry} disabled={addingCountry || !newCountryName.trim()}>
              {addingCountry ? 'Adding...' : 'Add Country'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Country Dialog */}
      <Dialog open={selectCountryDialogOpen} onOpenChange={setSelectCountryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Country Page</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="selectCountry" className="text-right">
                Select Country
              </Label>
              <div className="col-span-3">
                <select
                  id="selectCountry"
                  value={selectedCountry || ''}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a country</option>
                  {globalLocations?.countries
                    .filter(country => !countries?.some(c => c.name.toLowerCase() === country.toLowerCase()))
                    .map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectCountryDialogOpen(false)}>
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
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the country "{countryToDelete?.name}"?</p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Countries Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage countries for exhibition stand builder pages
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
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

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map((country) => (
          <Card key={country.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {country.name}
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground mb-3">
                Slug: {country.slug}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditCountry(country.id)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => confirmDeleteCountry(country.id, country.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No countries found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchTerm ? 'No countries match your search.' : 'Get started by adding a new country.'}
          </p>
        </div>
      )}
    </div>
  )
}