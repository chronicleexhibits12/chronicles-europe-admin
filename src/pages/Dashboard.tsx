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
import { useHomePage } from '@/hooks/useHomeContent'
import { useAboutPage } from '@/hooks/useAboutContent'
import { Edit, Eye, FileText, CheckCircle, XCircle } from 'lucide-react'

interface PageInfo {
  id: string
  name: string
  path: string
  editPath: string
  status: 'active' | 'inactive'
  lastUpdated: string
  description: string
}

export function Dashboard() {
  const navigate = useNavigate()
  const { data: homePage, loading: homeLoading } = useHomePage()
  const { data: aboutPage, loading: aboutLoading } = useAboutPage()
  const [pages, setPages] = useState<PageInfo[]>([])

  useEffect(() => {
    const pagesData: PageInfo[] = [
      {
        id: 'home',
        name: 'Home Page',
        path: '/',
        editPath: '/admin/home',
        status: homePage?.isActive ? 'active' : 'inactive',
        lastUpdated: homePage?.updatedAt ? new Date(homePage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Main landing page with hero section, services, and company information'
      },
      {
        id: 'about',
        name: 'About Page',
        path: '/about',
        editPath: '/admin/about',
        status: aboutPage?.isActive ? 'active' : 'inactive',
        lastUpdated: aboutPage?.updatedAt ? new Date(aboutPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Company information, team details, services, and statistics'
      }
    ]
    setPages(pagesData)
  }, [homePage, aboutPage])

  const handleEdit = (editPath: string) => {
    navigate(editPath)
  }

  const handlePreview = (path: string) => {
    window.open(path, '_blank')
  }

  const loading = homeLoading || aboutLoading

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
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your website pages and content
          </p>
        </div>
      </div>



      {/* Pages Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Website Pages</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and edit your website content
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-2" />
                    {page.name}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 max-w-md">
                  <p className="truncate">{page.description}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {page.status === 'active' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-green-600 font-medium">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-red-600 font-medium">Inactive</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">
                  {page.lastUpdated}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(page.path)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleEdit(page.editPath)}
                      className="h-8 px-3"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
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