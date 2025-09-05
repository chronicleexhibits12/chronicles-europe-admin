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
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useCities } from '@/hooks/useCitiesContent'
import { CitiesService } from '@/data/citiesService'

export function CitiesAdmin() {
  const navigate = useNavigate()
  const { data: cities, loading, error, refetch } = useCities()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cityToDelete, setCityToDelete] = useState<{id: string, name: string} | null>(null)

  const handleCreateCity = () => {
    navigate('/admin/cities/create')
  }

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
      const { error } = await CitiesService.deleteCity(cityToDelete.id)

      if (error) throw new Error(error)

      toast.success('City deleted successfully')
      refetch()
      setDeleteDialogOpen(false)
      setCityToDelete(null)
    } catch (error: any) {
      console.error('Error deleting city:', error)
      toast.error('Failed to delete city')
      setDeleteDialogOpen(false)
      setCityToDelete(null)
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
            Manage cities for exhibition stand services
          </p>
        </div>
        <Button onClick={handleCreateCity}>
          <Plus className="h-4 w-4 mr-2" />
          Add City
        </Button>
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
              <TableHead>City Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>City Slug</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city.id}>
                <TableCell className="font-medium">{city.name}</TableCell>
                <TableCell>{city.country_slug}</TableCell>
                <TableCell>{city.city_slug}</TableCell>
                <TableCell>
                  {city.updated_at ? new Date(city.updated_at).toLocaleDateString() : 'Never'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/countries/${city.country_slug}/${city.city_slug}`, '_blank')}
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

        {cities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No cities found</p>
            <Button
              variant="default"
              className="mt-4"
              onClick={handleCreateCity}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First City
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}