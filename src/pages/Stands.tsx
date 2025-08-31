import { useState, useEffect } from 'react'
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
import { useCustomStandsPage } from '@/hooks/useCustomStandsContent'
import { Edit, Building } from 'lucide-react'

interface StandInfo {
  id: string
  name: string
  path: string
  editPath: string
  lastUpdated: string
  description: string
}

export function Stands() {
  const navigate = useNavigate()
  const { data: customStandsPage, loading: customStandsLoading } = useCustomStandsPage()
  const [stands, setStands] = useState<StandInfo[]>([])

  useEffect(() => {
    const standsData: StandInfo[] = [
      {
        id: 'custom-stands',
        name: 'Custom Exhibition Stands',
        path: '/custom-stands',
        editPath: '/admin/custom-stands',
        lastUpdated: customStandsPage?.updatedAt ? new Date(customStandsPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Custom exhibition stands design and build services information'
      }
    ]
    setStands(standsData)
  }, [customStandsPage])

  const handleEdit = (editPath: string) => {
    navigate(editPath)
  }



  const loading = customStandsLoading

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exhibition Stands</h1>
          <p className="text-muted-foreground mt-2">
            Manage your exhibition stands content and information
          </p>
        </div>
      </div>

      {/* Stands Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Exhibition Stands</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and edit your exhibition stands content
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stand Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stands.map((stand) => (
              <TableRow key={stand.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 text-gray-400 mr-2" />
                    {stand.name}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 max-w-md">
                  <p className="truncate">{stand.description}</p>
                </TableCell>
                <TableCell className="text-gray-600">
                  {stand.lastUpdated}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleEdit(stand.editPath)}
                    className="h-8 px-3"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}