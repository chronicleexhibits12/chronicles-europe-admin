import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
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
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCountries } from '@/hooks/useCountriesContent'
import { CountriesService } from '@/data/countriesService'

export function CountriesAdmin() {
  const navigate = useNavigate()
  const { data: countries, loading, error, refetch } = useCountries()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [countryToDelete, setCountryToDelete] = useState<{id: string, name: string} | null>(null)

  const handleCreateCountry = () => {
    navigate('/admin/countries/create')
  }

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
      const { error } = await CountriesService.deleteCountry(countryToDelete.id)

      if (error) throw new Error(error)

      toast.success('Country deleted successfully')
      refetch()
      setDeleteDialogOpen(false)
      setCountryToDelete(null)
    } catch (error: any) {
      console.error('Error deleting country:', error)
      toast.error('Failed to delete country')
      setDeleteDialogOpen(false)
      setCountryToDelete(null)
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
    <div className="space-y-6">
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
            Manage countries for exhibition stand services
          </p>
        </div>
        <Button onClick={handleCreateCountry}>
          <Plus className="h-4 w-4 mr-2" />
          Add Country
        </Button>
      </div>

      {/* Countries Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Countries</h2>
          <p className="text-sm text-gray-600 mt-1">
            List of all countries in the system
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cities Selected</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((country) => (
              <TableRow key={country.id}>
                <TableCell className="font-medium">{country.name}</TableCell>
                <TableCell>{country.slug}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    country.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {country.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>{country.selected_cities?.length || 0} cities</TableCell>
                <TableCell>
                  {country.updated_at ? new Date(country.updated_at).toLocaleDateString() : 'Never'}
                </TableCell>
                <TableCell className="text-right space-x-2">
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

        {countries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No countries found</p>
            <Button
              variant="default"
              className="mt-4"
              onClick={handleCreateCountry}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Country
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}