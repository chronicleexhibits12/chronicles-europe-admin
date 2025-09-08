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
import { useCustomStandsPage } from '@/hooks/useCustomStandsContent'
import { useTradeShowsPage } from '@/hooks/useTradeShowsContent'
import { useBlogPage } from '@/hooks/useBlogContent'
import { useTestimonialsPage } from '@/data/hooks/useTestimonialsContent'
import { Edit, FileText, Eye } from 'lucide-react'

interface PageInfo {
  id: string
  name: string
  path: string
  editPath: string
  lastUpdated: string
  description: string
}

export function Pages() {
  const navigate = useNavigate()
  const { data: homePage, loading: homeLoading } = useHomePage()
  const { data: aboutPage, loading: aboutLoading } = useAboutPage()
  const { data: customStandsPage, loading: customStandsLoading } = useCustomStandsPage()
  const { data: tradeShowsPage, loading: tradeShowsLoading } = useTradeShowsPage()
  const { data: blogPage, loading: blogLoading } = useBlogPage()
  const { data: testimonialsPage, loading: testimonialsLoading } = useTestimonialsPage()
  const [pages, setPages] = useState<PageInfo[]>([])

  // Get website URL from environment variables, with fallback
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicleseurope.vercel.app'

  useEffect(() => {
    const pagesData: PageInfo[] = [
      {
        id: 'home',
        name: 'Home Page',
        path: '/',
        editPath: '/admin/home',
        lastUpdated: homePage?.updatedAt ? new Date(homePage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Main landing page with hero section, services, and company information'
      },
      {
        id: 'about',
        name: 'About Page',
        path: '/about',
        editPath: '/admin/about-us',
        lastUpdated: aboutPage?.updatedAt ? new Date(aboutPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Company information, team details, services, and statistics'
      },
      {
        id: 'trade-shows',
        name: 'Trade Shows Page',
        path: '/top-trade-shows-in-europe',
        editPath: '/admin/trade-shows-page',
        lastUpdated: tradeShowsPage?.updatedAt ? new Date(tradeShowsPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Trade shows and exhibitions landing page'
      },
      {
        id: 'blog',
        name: 'Blog Page',
        path: '/blog',
        editPath: '/admin/blog-page',
        lastUpdated: blogPage?.updatedAt ? new Date(blogPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Blog landing page with all posts'
      },
      {
        id: 'testimonials',
        name: 'Testimonials Page',
        path: '/review',
        editPath: '/admin/testimonials',
        lastUpdated: testimonialsPage?.updatedAt ? new Date(testimonialsPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Client testimonials and reviews'
      }
    ]
    setPages(pagesData)
  }, [homePage, aboutPage, customStandsPage, tradeShowsPage, blogPage, testimonialsPage])

  const handleEdit = (editPath: string) => {
    navigate(editPath)
  }

  const handleView = (path: string) => {
    // Open the website page in a new tab using the environment variable
    window.open(`${websiteUrl}${path}`, '_blank')
  }

  const loading = homeLoading || aboutLoading || customStandsLoading || tradeShowsLoading || blogLoading || testimonialsLoading

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
          <h1 className="text-3xl font-bold text-foreground">Pages</h1>
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
                <TableCell className="text-gray-600">
                  {page.lastUpdated}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(page.path)}
                      className="h-8 px-3"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
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