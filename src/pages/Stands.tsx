import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { useCustomStandsPage } from '@/hooks/useCustomStandsContent'
import { useDoubleDeckStandsContent } from '@/hooks/useDoubleDeckStandsContent'
import { useModularStandsContent } from '@/hooks/useModularStandsContent'
import { usePavilionStandsPage } from '@/hooks/usePavilionStandsContent'
import { Edit, Building, Eye } from 'lucide-react'

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
  const { content: doubleDeckStandsPage, loading: doubleDeckStandsLoading } = useDoubleDeckStandsContent()
  const { content: modularStandsPage, loading: modularStandsLoading } = useModularStandsContent()
  const { data: pavilionStandsPage, loading: pavilionStandsLoading } = usePavilionStandsPage()
  const [stands, setStands] = useState<StandInfo[]>([])

  // Get website URL from environment variables, with fallback
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicleexhibits.eu'

  useEffect(() => {
    const standsData: StandInfo[] = [
      {
        id: 'custom-stands',
        name: 'Custom Exhibition Stands',
        path: '/custom-exhibition-stand/',
        editPath: '/admin/custom-stands',
        lastUpdated: customStandsPage?.updatedAt ? new Date(customStandsPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Custom exhibition stands design and build services information'
      },
      {
        id: 'double-decker-stands',
        name: 'Double Storey Exhibition Stands',
        path: '/double-storey-exhibition-stand/',
        editPath: '/admin/double-decker-stands',
        lastUpdated: doubleDeckStandsPage?.updatedAt ? new Date(doubleDeckStandsPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Double storey exhibition stands design and build services information'
      },
      {
        id: 'modular-stands',
        name: 'Modular Exhibition Stands',
        path: '/modular-exhibition-stand/',
        editPath: '/admin/modular-stands',
        lastUpdated: modularStandsPage?.updatedAt ? new Date(modularStandsPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Modular exhibition stands design and build services information'
      },
      {
        id: 'pavilion-stands',
        name: 'Country Pavilion Exhibition Stands',
        path: '/country-pavilion-exhibition-stand/',
        editPath: '/admin/pavilion-stands',
        lastUpdated: pavilionStandsPage?.updatedAt ? new Date(pavilionStandsPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Country pavilion exhibition stands design and build services information'
      }
    ]
    setStands(standsData)
  }, [customStandsPage, doubleDeckStandsPage, modularStandsPage, pavilionStandsPage])

  const handleEdit = (editPath: string, event: React.MouseEvent) => {
    // If Ctrl key is pressed, open in new tab
    if (event.ctrlKey) {
      window.open(editPath, '_blank');
    } else {
      navigate(editPath);
    }
  }

  const loading = customStandsLoading || doubleDeckStandsLoading || modularStandsLoading || pavilionStandsLoading

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
                  <div className="flex justify-end gap-2">
                    <a 
                      href={`${websiteUrl}${stand.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 h-8"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </a>
                    <a
                      href={stand.editPath}
                      onClick={(e) => {
                        e.preventDefault();
                        handleEdit(stand.editPath, e);
                      }}
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 h-8"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}