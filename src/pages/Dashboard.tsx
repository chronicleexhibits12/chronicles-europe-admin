import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useHomePage } from '@/hooks/useHomeContent'
import { useAboutPage } from '@/hooks/useAboutContent'
import { useCustomStandsPage } from '@/hooks/useCustomStandsContent'
import { FileText, Eye, Calendar, Mail, BookOpen, MapPin, Globe } from 'lucide-react'
// Add the new hooks for statistics
import { useFormSubmissions } from '@/hooks/useFormSubmissionsContent'
import { useBlogPosts } from '@/hooks/useBlogContent'
import { useTradeShows } from '@/hooks/useTradeShowsContent'
import { useCities } from '@/hooks/useCitiesContent'
import { useCountries } from '@/hooks/useCountriesContent'

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
  
  // Add hooks for statistics
  const { data: formSubmissions, loading: formSubmissionsLoading } = useFormSubmissions()
  const { data: blogPosts, loading: blogPostsLoading } = useBlogPosts()
  const { data: tradeShows, loading: tradeShowsLoading } = useTradeShows()
  const { data: cities, loading: citiesLoading } = useCities()
  const { data: countries, loading: countriesLoading } = useCountries()
  
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
        path: '/custom-booth-design-and-build',
        editPath: '/admin/custom-stands',
        lastUpdated: customStandsPage?.updatedAt ? new Date(customStandsPage.updatedAt).toLocaleDateString() : 'Never',
        description: 'Custom exhibition stands design and build services information'
      }
    ]
    setPages(pagesData)
  }, [homePage, aboutPage, customStandsPage])

  // Calculate statistics
  const totalPages = pages.length
  const totalFormSubmissions = formSubmissions?.length || 0
  const totalBlogPosts = blogPosts?.length || 0
  const totalTradeShows = tradeShows?.length || 0
  const totalCities = cities?.length || 0
  const totalCountries = countries?.length || 0

  const loading = homeLoading || aboutLoading || customStandsLoading || 
                  formSubmissionsLoading || blogPostsLoading || tradeShowsLoading || 
                  citiesLoading || countriesLoading

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Form Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{totalFormSubmissions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blog Posts</p>
              <p className="text-2xl font-bold text-gray-900">{totalBlogPosts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Trade Shows</p>
              <p className="text-2xl font-bold text-gray-900">{totalTradeShows}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <MapPin className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cities</p>
              <p className="text-2xl font-bold text-gray-900">{totalCities}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Globe className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Countries</p>
              <p className="text-2xl font-bold text-gray-900">{totalCountries}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Button 
            onClick={() => navigate('/admin/form-submissions')} 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24"
          >
            <Mail className="h-5 w-5 mb-1" />
            <span>Form Submissions</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/admin/blog-posts')} 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24"
          >
            <BookOpen className="h-5 w-5 mb-1" />
            <span>Blog Posts</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/admin/trade-shows')} 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24"
          >
            <Calendar className="h-5 w-5 mb-1" />
            <span>Trade Shows</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/admin/cities')} 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24"
          >
            <MapPin className="h-5 w-5 mb-1" />
            <span>Cities</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/admin/countries')} 
            variant="outline" 
            className="flex flex-col items-center justify-center h-24"
          >
            <Globe className="h-5 w-5 mb-1" />
            <span>Countries</span>
          </Button>
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