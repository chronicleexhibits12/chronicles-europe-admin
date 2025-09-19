import { useState, useMemo, useEffect } from 'react'
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Plus, Edit, Trash2, Eye, Download, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTradeShows } from '@/hooks/useTradeShowsContent'
import { TradeShowsService } from '@/data/tradeShowsService'
import * as XLSX from 'xlsx'

export function TradeShowsAdmin() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const { data: tradeShows, totalCount, loading, error, refetch } = useTradeShows(currentPage, pageSize)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tradeShowToDelete, setTradeShowToDelete] = useState<{id: string, title: string} | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [updatingShowId, setUpdatingShowId] = useState<string | null>(null)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [allTradeShows, setAllTradeShows] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'expired' | 'upcoming'>('all')

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize)

  // Get website URL from environment variables, with fallback
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicleseurope.vercel.app'

  // Helper function to determine if a trade show is expired or upcoming
  const getTradeShowStatus = (tradeShow: any) => {
    if (!tradeShow.endDate) return 'ongoing'
    const endDate = new Date(tradeShow.endDate)
    const today = new Date()
    return endDate < today ? 'expired' : 'upcoming'
  }

  // Get all trade shows for global search and sorting
  const getAllTradeShows = async () => {
    if (!searchTerm) return
    setSearchLoading(true)
    try {
      const { data, error } = await TradeShowsService.getTradeShows()
      if (error) throw new Error(error)
      // Sort by created date (newest first) when searching
      const sortedData = data?.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || []
      setAllTradeShows(sortedData)
    } catch (error: any) {
      console.error('Error fetching all trade shows:', error)
      toast.error('Failed to search trade shows')
    } finally {
      setSearchLoading(false)
    }
  }

  // Effect to fetch all trade shows when search term changes
  useEffect(() => {
    if (searchTerm) {
      getAllTradeShows()
    } else {
      setAllTradeShows([])
    }
  }, [searchTerm])

  // Filter all trade shows based on search term and status
  const globalFilteredTradeShows = useMemo(() => {
    if (!allTradeShows.length) return []
    
    // First apply search filter
    let filtered = allTradeShows
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = allTradeShows.filter(show => 
        show.title.toLowerCase().includes(term) ||
        (show.organizer && show.organizer.toLowerCase().includes(term)) || // organizer column is used for the hero section CTA
        (show.location && show.location.toLowerCase().includes(term)) ||
        (show.city && show.city.toLowerCase().includes(term)) ||
        (show.country && show.country.toLowerCase().includes(term))
      )
    }
    
    // Then apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(show => getTradeShowStatus(show) === statusFilter)
    }
    
    return filtered
  }, [allTradeShows, searchTerm, statusFilter])

  // Sort trade shows by created date (newest first) for regular view
  const sortedTradeShows = useMemo(() => {
    if (!tradeShows) return []
    return [...tradeShows].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [tradeShows])

  // Filter trade shows based on search term and status
  const filteredTradeShows = useMemo(() => {
    if (!sortedTradeShows) return sortedTradeShows || []
    
    // First apply search filter
    let filtered = sortedTradeShows
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = sortedTradeShows.filter(show => 
        show.title.toLowerCase().includes(term) ||
        (show.organizer && show.organizer.toLowerCase().includes(term)) || // organizer column is used for the hero section CTA
        (show.location && show.location.toLowerCase().includes(term)) ||
        (show.city && show.city.toLowerCase().includes(term)) ||
        (show.country && show.country.toLowerCase().includes(term))
      )
    }
    
    // Then apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(show => getTradeShowStatus(show) === statusFilter)
    }
    
    return filtered
  }, [sortedTradeShows, searchTerm, statusFilter])

  // Determine which trade shows to display
  const displayTradeShows = searchTerm ? globalFilteredTradeShows : filteredTradeShows
  const displayTotalCount = searchTerm ? globalFilteredTradeShows.length : filteredTradeShows.length

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

  // Pagination functions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPaginationItems = () => {
    const items = []
    
    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => goToPage(1)} 
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    )
    
    if (totalPages <= 1) return items
    
    // Show ellipsis if there are pages between first and current range
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
    
    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => goToPage(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    
    // Show ellipsis if there are pages between current range and last
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => goToPage(totalPages)} 
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }
    
    return items
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

  // Update the refetch function to maintain sorting

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

      {/* Search Bar and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search trade shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            {searchLoading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
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
        
        {/* Status Filter Buttons */}
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'upcoming' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setStatusFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button 
            variant={statusFilter === 'expired' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setStatusFilter('expired')}
          >
            Expired
          </Button>
        </div>
      </div>

      {/* Trade Shows Table */}
      <div className="bg-white rounded-lg border shadow-sm w-full">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Trade Shows</h2>
          <p className="text-sm text-gray-600 mt-1">
            {searchTerm || statusFilter !== 'all'
              ? `Found ${displayTotalCount} result${displayTotalCount !== 1 ? 's' : ''}${searchTerm ? ` for "${searchTerm}"` : ''}${statusFilter !== 'all' ? ` (${statusFilter})` : ''}`
              : `Showing ${Math.min(displayTradeShows.length, pageSize)} of ${totalCount} trade shows`}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayTradeShows.map((tradeShow, index) => {
              const status = getTradeShowStatus(tradeShow)
              return (
                <TableRow key={tradeShow.id}>
                  <TableCell className="font-medium">
                    {searchTerm 
                      ? displayTotalCount - index 
                      : totalCount - ((currentPage - 1) * pageSize) - index}
                  </TableCell>
                  <TableCell className="font-medium">{tradeShow.title}</TableCell>
                  <TableCell>{tradeShow.location}</TableCell>
                  <TableCell>
                    {tradeShow.startDate && tradeShow.endDate 
                      ? new Date(tradeShow.startDate).toLocaleDateString() + ' - ' + new Date(tradeShow.endDate).toLocaleDateString()
                      : 'Not specified'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      status === 'expired' 
                        ? 'bg-red-100 text-red-800' 
                        : status === 'upcoming' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {tradeShow.createdAt 
                      ? new Date(tradeShow.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {tradeShow.updatedAt 
                      ? new Date(tradeShow.updatedAt).toLocaleDateString()
                      : 'N/A'}
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
              );
            })}
          </TableBody>
        </Table>

        {displayTradeShows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' ? 'No trade shows found matching your filters' : 'No trade shows found'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
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

      {/* Pagination */}
      {!searchTerm && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}