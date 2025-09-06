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
import { useTradeShows } from '@/hooks/useTradeShowsContent'
import { TradeShowsService } from '@/data/tradeShowsService'

export function TradeShowsAdmin() {
  const navigate = useNavigate()
  const { data: tradeShows, loading, error, refetch } = useTradeShows()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tradeShowToDelete, setTradeShowToDelete] = useState<{id: string, title: string} | null>(null)

  const handleCreateTradeShow = () => {
    navigate('/admin/trade-shows/create')
  }

  const handleEditTradeShow = (id: string) => {
    navigate(`/admin/trade-shows/${id}/edit`)
  }

  const confirmDeleteTradeShow = (id: string, title: string) => {
    setTradeShowToDelete({ id, title })
    setDeleteDialogOpen(true)
  }

  const handleDeleteTradeShow = async () => {
    if (!tradeShowToDelete) return

    try {
      const { error } = await TradeShowsService.deleteTradeShow(tradeShowToDelete.id)

      if (error) throw new Error(error)

      toast.success('Trade show deleted successfully')
      refetch()
      setDeleteDialogOpen(false)
      setTradeShowToDelete(null)
    } catch (error: any) {
      console.error('Error deleting trade show:', error)
      toast.error('Failed to delete trade show')
      setDeleteDialogOpen(false)
      setTradeShowToDelete(null)
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
        Error loading trade shows: {error}
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
              Are you sure you want to delete the trade show "{tradeShowToDelete?.title}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTradeShow}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trade Shows</h1>
          <p className="text-muted-foreground mt-2">
            Manage trade shows and exhibitions
          </p>
        </div>
        <Button onClick={handleCreateTradeShow}>
          <Plus className="h-4 w-4 mr-2" />
          Add Trade Show
        </Button>
      </div>

      {/* Trade Shows Table */}
      <div className="bg-white rounded-lg border shadow-sm w-full">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Trade Shows</h2>
          <p className="text-sm text-gray-600 mt-1">
            List of all trade shows in the system
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradeShows.map((tradeShow) => (
              <TableRow key={tradeShow.id}>
                <TableCell className="font-medium">{tradeShow.title}</TableCell>
                <TableCell>{tradeShow.category}</TableCell>
                <TableCell>{tradeShow.location}</TableCell>
                <TableCell>
                  {tradeShow.startDate && tradeShow.endDate 
                    ? `${new Date(tradeShow.startDate).toLocaleDateString()} - ${new Date(tradeShow.endDate).toLocaleDateString()}`
                    : 'Not specified'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/trade-shows/${tradeShow.slug}`, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTradeShow(tradeShow.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmDeleteTradeShow(tradeShow.id, tradeShow.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {tradeShows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No trade shows found</p>
            <Button
              variant="default"
              className="mt-4"
              onClick={handleCreateTradeShow}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Trade Show
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}