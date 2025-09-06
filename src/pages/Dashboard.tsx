import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useHomePage } from '@/hooks/useHomeContent'
import { useAboutPage } from '@/hooks/useAboutContent'
import { useCustomStandsPage } from '@/hooks/useCustomStandsContent'
import { FileText, Eye, Calendar } from 'lucide-react'

interface PageInfo {
  id: string
  name: string
  path: string
  editPath: string
  lastUpdated: string
  description: string
}

export function Dashboard() {
  const navigate = useNavigate()
  const { data: homePage, loading: homeLoading } = useHomePage()
  const { data: aboutPage, loading: aboutLoading } = useAboutPage()
  const { data: customStandsPage, loading: customStandsLoading } = useCustomStandsPage()
  const [pages, setPages] = useState<PageInfo[]>([])

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
        path: '/about-us',
        editPath: 'admin/about-us',
        lastUpdated: aboutPage?.updatedAt ? new Date(aboutPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Company information, team details, services, and statistics'
      },
      {
        id: 'custom-stands',
        name: 'Custom Stands Page',
        path: '/custom-stands',
        editPath: '/admin/custom-stands',
        lastUpdated: customStandsPage?.updatedAt ? new Date(customStandsPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Custom exhibition stands design and build services information'
      }
    ]
    setPages(pagesData)
  }, [homePage, aboutPage, customStandsPage])

  // Calculate statistics
  const totalPages = pages.length
  const recentlyUpdatedCount = pages.filter(page => page.lastUpdated !== 'Never').length

  const loading = homeLoading || aboutLoading || customStandsLoading

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
            Welcome to your content management system
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pages</p>
              <p className="text-2xl font-bold text-gray-900">{totalPages}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recently Updated</p>
              <p className="text-2xl font-bold text-gray-900">{recentlyUpdatedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Your Admin Panel</h2>
          <p className="text-gray-600 mb-4">
            Use the navigation menu to manage your website content. You can edit pages, update stands information, and more.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate('/pages')}>
              <FileText className="h-4 w-4 mr-2" />
              Manage Pages
            </Button>
            <Button variant="outline" onClick={() => window.open('https://chronicleseurope.vercel.app', '_blank')}>
              <Eye className="h-4 w-4 mr-2" />
              View Website
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}