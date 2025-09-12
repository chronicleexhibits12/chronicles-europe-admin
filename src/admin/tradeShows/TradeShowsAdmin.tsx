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
import { Plus, Edit, Trash2, Eye, Download, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTradeShows } from '@/hooks/useTradeShowsContent'
import { TradeShowsService } from '@/data/tradeShowsService'
import * as XLSX from 'xlsx'

export function TradeShowsAdmin() {
  const navigate = useNavigate()
  const { data: tradeShows, loading, error, refetch } = useTradeShows()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tradeShowToDelete, setTradeShowToDelete] = useState<{id: string, title: string} | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingShowId, setUpdatingShowId] = useState<string | null>(null)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')

  // Get website URL from environment variables, with fallback
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicleseurope.vercel.app'

  // Filter trade shows based on search term
  const filteredTradeShows = useMemo(() => {
    if (!tradeShows || !searchTerm) return tradeShows || []
    
    const term = searchTerm.toLowerCase()
    return tradeShows.filter(show => 
      show.title.toLowerCase().includes(term) ||
      (show.location && show.location.toLowerCase().includes(term)) ||
      (show.city && show.city.toLowerCase().includes(term)) ||
      (show.country && show.country.toLowerCase().includes(term))
    )
  }, [tradeShows, searchTerm])

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

  const toggleTradeShowStatus = async (tradeShow: any) => {
    setUpdatingShowId(tradeShow.id)
    try {
      // Toggle the isActive status
      const { error } = await TradeShowsService.updateTradeShow(tradeShow.id, {
        ...tradeShow,
        isActive: !tradeShow.isActive
      });
      
      if (error) throw new Error(error);
      
      toast.success(!tradeShow.isActive ? 'Trade show published successfully' : 'Trade show unpublished successfully');
      refetch();
    } catch (error: any) {
      console.error('Error updating trade show status:', error);
      toast.error('Failed to update trade show status');
    } finally {
      setUpdatingShowId(null)
    }
  }

  const exportToExcel = () => {
    try {
      // Filter trade shows based on date range if provided
      let exportData = tradeShows || []
      
      if (startDateFilter || endDateFilter) {
        exportData = exportData.filter(show => {
          // If start date filter is set, check if show's end date is after the filter start date
          if (startDateFilter && show.endDate) {
            const filterStartDate = new Date(startDateFilter)
            const showEndDate = new Date(show.endDate)
            if (showEndDate < filterStartDate) return false
          }
          
          // If end date filter is set, check if show's start date is before the filter end date
          if (endDateFilter && show.startDate) {
            const filterEndDate = new Date(endDateFilter)
            const showStartDate = new Date(show.startDate)
            if (showStartDate > filterEndDate) return false
          }
          
          return true
        })
      }
      
      // Prepare data for export
      const exportDataFormatted = exportData.map(show => ({
        Slug: show.slug,
        Title: show.title,
        'Start Date': show.startDate ? new Date(show.startDate).toLocaleDateString() : '',
        'End Date': show.endDate ? new Date(show.endDate).toLocaleDateString() : '',
        City: show.city || '',
        Country: show.country || ''
      }))

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportDataFormatted)
      
      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Trade Shows')
      
      // Export to file
      XLSX.writeFile(wb, 'trade-shows-export.xlsx')
      
      toast.success('Excel file exported successfully')
      setExportDialogOpen(false)
      // Reset filters after export
      setStartDateFilter('')
      setEndDateFilter('')
    } catch (error: any) {
      console.error('Error exporting to Excel:', error)
      toast.error('Failed to export Excel file')
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

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Trade Shows</DialogTitle>
            <DialogDescription>
              Select a date range to filter the export data
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                id="startDate"
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Input
                id="endDate"
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={exportToExcel}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Updating Status Popup */}
      <Dialog open={updatingShowId !== null}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <DialogTitle className="text-center mb-2">Updating Status</DialogTitle>
            <DialogDescription className="text-center">
              Please wait while we update the trade show status...
            </DialogDescription>
          </div>
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
        <div className="flex gap-2">
          <Button onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
          <Button onClick={handleCreateTradeShow}>
            <Plus className="h-4 w-4 mr-2" />
            Add Trade Show
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search trade shows..."
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
              <TableHead>Location</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTradeShows.map((tradeShow) => (
              <TableRow key={tradeShow.id}>
                <TableCell className="font-medium">{tradeShow.title}</TableCell>
                <TableCell>{tradeShow.location}</TableCell>
                <TableCell>
                  {tradeShow.startDate && tradeShow.endDate 
                    ? new Date(tradeShow.startDate).toLocaleDateString() + ' - ' + new Date(tradeShow.endDate).toLocaleDateString()
                    : 'Not specified'}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleTradeShowStatus(tradeShow)}
                    disabled={updatingShowId === tradeShow.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      tradeShow.isActive ? 'bg-blue-600' : 'bg-gray-200'
                    } ${updatingShowId === tradeShow.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        tradeShow.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(websiteUrl + '/top-trade-shows-in-europe/' + tradeShow.slug, '_blank')}
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

        {filteredTradeShows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No trade shows found matching your search' : 'No trade shows found'}
            </p>
            {!searchTerm && (
              <Button
                variant="default"
                className="mt-4"
                onClick={handleCreateTradeShow}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Trade Show
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}