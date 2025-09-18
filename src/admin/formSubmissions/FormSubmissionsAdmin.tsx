import { useState, useMemo } from 'react'
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
import { Trash2, Eye, Search, Download, X } from 'lucide-react'
import { toast } from 'sonner'
import { useFormSubmissions } from '@/hooks/useFormSubmissionsContent'
import { FormSubmissionsService } from '@/data/formSubmissionsService'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'

// Define types directly in the component file to avoid import issues
interface FormSubmission {
  id: string
  formType: string
  submissionData: Record<string, any>
  documents: DocumentMetadata[] | null
  createdAt: string
  updatedAt: string
}

interface DocumentMetadata {
  url: string
  path: string
  file_name: string
  file_size: number
  file_type: string
  field_name: string
}

// Type definition that matches what the hook returns
type HookFormSubmission = {
  id: string
  formType: string
  submissionData: Record<string, any>
  documents: { 
    url: string; 
    path: string; 
    file_name: string; 
    file_size: number; 
    file_type: string;
    field_name: string;
  }[] | null
  createdAt: string
  updatedAt: string
}

export function FormSubmissionsAdmin() {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const { data: formSubmissions, totalCount, loading, error, refetch } = useFormSubmissions(currentPage, pageSize)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState<{id: string, formType: string} | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [formTypeFilter, setFormTypeFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [exportDateFrom, setExportDateFrom] = useState('')
  const [exportDateTo, setExportDateTo] = useState('')
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize)

  // Get unique form types for filter dropdown
  const formTypes = useMemo(() => {
    if (!formSubmissions) return []
    const types = new Set(formSubmissions.map(submission => submission.formType))
    return Array.from(types).sort()
  }, [formSubmissions])

  // Filter form submissions based on all criteria
  const filteredSubmissions = useMemo(() => {
    if (!formSubmissions) return []
    
    return formSubmissions.filter(submission => {
      // Text search
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchesText = submission.formType.toLowerCase().includes(term) ||
          (submission.submissionData && JSON.stringify(submission.submissionData).toLowerCase().includes(term))
        if (!matchesText) return false
      }
      
      // Form type filter
      if (formTypeFilter && submission.formType !== formTypeFilter) {
        return false
      }
      
      // Date range filter
      const submissionDate = new Date(submission.createdAt)
      if (dateFrom && submissionDate < new Date(dateFrom)) {
        return false
      }
      if (dateTo && submissionDate > new Date(dateTo)) {
        return false
      }
      
      return true
    })
  }, [formSubmissions, searchTerm, formTypeFilter, dateFrom, dateTo])

  // Handle selection of a single submission
  const handleSelectSubmission = (id: string) => {
    setSelectedSubmissions(prev => {
      if (prev.includes(id)) {
        return prev.filter(submissionId => submissionId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle select all submissions
  const handleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0) {
      // If all are selected, deselect all
      setSelectedSubmissions([])
    } else {
      // Select all currently filtered submissions
      setSelectedSubmissions(filteredSubmissions.map(submission => submission.id))
    }
  }

  // Check if all submissions are selected
  const areAllSelected = selectedSubmissions.length > 0 && selectedSubmissions.length === filteredSubmissions.length

  const confirmDeleteSubmission = (id: string, formType: string) => {
    setSubmissionToDelete({ id, formType })
    setDeleteDialogOpen(true)
  }

  const confirmBulkDeleteSubmissions = () => {
    setBulkDeleteDialogOpen(true)
  }

  const handleDeleteSubmission = async () => {
    if (!submissionToDelete) return

    try {
      // First, get the submission to retrieve document paths
      const { data: submission } = await FormSubmissionsService.getFormSubmissionById(submissionToDelete.id)
      
      // Delete associated documents from storage if they exist
      if (submission && submission.documents && submission.documents.length > 0) {
        for (const doc of submission.documents) {
          try {
            await (FormSubmissionsService as any).deleteDocument(doc.path)
          } catch (docError) {
            console.warn('Failed to delete document:', doc.path, docError)
          }
        }
      }
      
      // Delete the form submission record
      const { error } = await FormSubmissionsService.deleteFormSubmission(submissionToDelete.id)

      if (error) throw new Error(error)

      toast.success('Form submission deleted successfully')
      refetch()
      setDeleteDialogOpen(false)
      setSubmissionToDelete(null)
    } catch (error: any) {
      console.error('Error deleting form submission:', error)
      toast.error('Failed to delete form submission')
      setDeleteDialogOpen(false)
      setSubmissionToDelete(null)
    }
  }

  const handleBulkDeleteSubmissions = async () => {
    if (selectedSubmissions.length === 0) return

    try {
      let successCount = 0
      let errorCount = 0

      // Process each selected submission
      for (const id of selectedSubmissions) {
        try {
          // First, get the submission to retrieve document paths
          const { data: submission } = await FormSubmissionsService.getFormSubmissionById(id)
          
          // Delete associated documents from storage if they exist
          if (submission && submission.documents && submission.documents.length > 0) {
            for (const doc of submission.documents) {
              try {
                await (FormSubmissionsService as any).deleteDocument(doc.path)
              } catch (docError) {
                console.warn('Failed to delete document:', doc.path, docError)
              }
            }
          }
          
          // Delete the form submission record
          const { error } = await FormSubmissionsService.deleteFormSubmission(id)

          if (error) throw new Error(error)
          successCount++
        } catch (error: any) {
          console.error('Error deleting form submission:', error)
          errorCount++
        }
      }

      if (errorCount === 0) {
        toast.success(`${successCount} form submission(s) deleted successfully`)
      } else if (successCount > 0) {
        toast.success(`${successCount} form submission(s) deleted successfully`)
        toast.error(`${errorCount} form submission(s) failed to delete`)
      } else {
        toast.error('Failed to delete form submissions')
      }

      // Clear selection and refresh data
      setSelectedSubmissions([])
      refetch()
      setBulkDeleteDialogOpen(false)
    } catch (error: any) {
      console.error('Error deleting form submissions:', error)
      toast.error('Failed to delete form submissions')
      setBulkDeleteDialogOpen(false)
    }
  }

  const handleViewSubmission = (submission: HookFormSubmission) => {
    // Convert the hook's submission type to our internal type
    const convertedSubmission: FormSubmission = {
      id: submission.id,
      formType: submission.formType,
      submissionData: submission.submissionData,
      documents: submission.documents,
      createdAt: submission.createdAt,
      updatedAt: submission.updatedAt
    }
    
    setSelectedSubmission(convertedSubmission)
    setViewDialogOpen(true)
  }

  const handleDownloadDocument = (url: string) => {
    window.open(url, '_blank')
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFormTypeFilter('')
    setDateFrom('')
    setDateTo('')
  }

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Export to Excel functionality with date filter
  const handleExportToExcel = () => {
    // Open the export dialog to select date range
    setExportDialogOpen(true)
  }

  const performExport = () => {
    try {
      // Filter form submissions based on export date range if provided
      let exportData = formSubmissions || []
      
      if (exportDateFrom || exportDateTo) {
        exportData = exportData.filter(submission => {
          const submissionDate = new Date(submission.createdAt)
          
          // If start date filter is set, check if submission date is after the filter start date
          if (exportDateFrom && submissionDate < new Date(exportDateFrom)) {
            return false
          }
          
          // If end date filter is set, check if submission date is before the filter end date
          if (exportDateTo && submissionDate > new Date(exportDateTo)) {
            return false
          }
          
          return true
        })
      }
      
      if (exportData.length === 0) {
        toast.error('No data to export for the selected date range')
        return
      }

      // Prepare data for export
      const exportDataFormatted = exportData.map(submission => {
        // Flatten submission data
        const flattenedData: Record<string, any> = {
          id: submission.id,
          formType: submission.formType,
          createdAt: format(new Date(submission.createdAt), 'PPP p'),
          updatedAt: format(new Date(submission.updatedAt), 'PPP p'),
        }

        // Add submission data fields
        if (submission.submissionData) {
          Object.entries(submission.submissionData).forEach(([key, value]) => {
            // Handle complex objects by converting to JSON string
            flattenedData[key] = typeof value === 'object' ? JSON.stringify(value) : value
          })
        }

        // Add document info if exists
        if (submission.documents && submission.documents.length > 0) {
          flattenedData.documentCount = submission.documents.length
          flattenedData.documentNames = submission.documents.map(doc => doc.file_name).join(', ')
        } else {
          flattenedData.documentCount = 0
          flattenedData.documentNames = ''
        }

        return flattenedData
      })

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportDataFormatted)
      
      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Form Submissions')
      
      // Export to Excel file
      XLSX.writeFile(wb, 'form-submissions-export.xlsx')
      
      toast.success('Form submissions exported successfully')
      setExportDialogOpen(false)
      // Reset export date filters
      setExportDateFrom('')
      setExportDateTo('')
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      toast.error('Failed to export form submissions')
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
        Error loading form submissions: {error}
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
              Are you sure you want to delete the form submission for "{submissionToDelete?.formType}"? 
              This will also delete all associated documents from storage.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmission}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedSubmissions.length} form submission(s)? 
              This will also delete all associated documents from storage.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDeleteSubmissions}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Submission Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Submission Details</DialogTitle>
            <DialogDescription>
              Form Type: {selectedSubmission?.formType}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Submission Data</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedSubmission.submissionData && Object.keys(selectedSubmission.submissionData).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedSubmission.submissionData).map(([key, value]) => (
                        <div key={key} className="border-b pb-2">
                          <p className="font-medium text-gray-700">{key}</p>
                          <p className="text-gray-900 break-words">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No submission data available</p>
                  )}
                </div>
              </div>
              
              {selectedSubmission.documents && selectedSubmission.documents.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Uploaded Documents</h3>
                  <div className="space-y-2">
                    {selectedSubmission.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div>
                          <p className="font-medium">{doc.file_name}</p>
                          <p className="text-sm text-gray-500">{doc.file_type} • {formatFileSize(doc.file_size)}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDownloadDocument(doc.url)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-500">
                <p>Submitted: {format(new Date(selectedSubmission.createdAt), 'PPP p')}</p>
                <p>Last Updated: {format(new Date(selectedSubmission.updatedAt), 'PPP p')}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Form Submissions</DialogTitle>
            <DialogDescription>
              Select a date range to filter the export data
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <label htmlFor="exportDateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <Input
                id="exportDateFrom"
                type="date"
                value={exportDateFrom}
                onChange={(e) => setExportDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="exportDateTo" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <Input
                id="exportDateTo"
                type="date"
                value={exportDateTo}
                onChange={(e) => setExportDateTo(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setExportDialogOpen(false)
              setExportDateFrom('')
              setExportDateTo('')
            }}>
              Cancel
            </Button>
            <Button onClick={performExport}>
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Form Submissions</h1>
          <p className="text-muted-foreground mt-2">
            Manage form submissions
          </p>
        </div>
        <div className="flex space-x-2">
          {selectedSubmissions.length > 0 && (
            <Button variant="destructive" onClick={confirmBulkDeleteSubmissions}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {selectedSubmissions.length} Selected
            </Button>
          )}
          <Button onClick={handleExportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Advanced Search and Filters */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {/* Form Type Filter */}
          <div>
            <select
              value={formTypeFilter}
              onChange={(e) => setFormTypeFilter(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All Form Types</option>
              {formTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Date From */}
          <div>
            <Input
              type="date"
              placeholder="From date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          
          {/* Date To */}
          <div>
            <Input
              type="date"
              placeholder="To date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
        
        {/* Clear Filters Button */}
        {(searchTerm || formTypeFilter || dateFrom || dateTo) && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Form Submissions Table */}
      <div className="bg-white rounded-lg border shadow-sm w-full">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Form Submissions</h2>
          <p className="text-sm text-gray-600 mt-1">
            List of all form submissions in the system
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={areAllSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </TableHead>
              <TableHead>Form Type</TableHead>
              <TableHead>Submission Data</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.map((submission) => (
              <TableRow key={submission.id} className={selectedSubmissions.includes(submission.id) ? 'bg-blue-50' : ''}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedSubmissions.includes(submission.id)}
                    onChange={() => handleSelectSubmission(submission.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </TableCell>
                <TableCell className="font-medium">{submission.formType}</TableCell>
                <TableCell>
                  {submission.submissionData ? (
                    <div className="max-w-xs truncate">
                      {Object.entries(submission.submissionData).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium">{key}:</span> {String(value).substring(0, 30)}{String(value).length > 30 ? '...' : ''}
                        </div>
                      ))}
                      {Object.keys(submission.submissionData).length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{Object.keys(submission.submissionData).length - 2} more fields
                        </span>
                      )}
                    </div>
                  ) : 'No data'}
                </TableCell>
                <TableCell>
                  {submission.documents && submission.documents.length > 0 ? (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {submission.documents.length} document{submission.documents.length > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">No documents</span>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(submission.createdAt), 'PPP')}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewSubmission(submission)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmDeleteSubmission(submission.id, submission.formType)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No form submissions found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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