import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Layout } from '@/components/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Stands } from '@/pages/Stands'
import { Pages } from '@/pages/Pages'
import { HomeAdmin } from '@/admin/home/HomeAdmin'
import { AboutAdmin } from '@/admin/about/AboutAdmin'
import { CustomStandsAdmin } from '@/admin/customStands/CustomStandsAdmin'
import { DoubleDeckStandsAdmin } from '@/admin/doubleDeckStands/DoubleDeckStandsAdmin'
import { ModularStandsAdmin } from '@/admin/modularStands/ModularStandsAdmin'
import { PavilionStandsAdmin } from '@/admin/pavilionStands/PavilionStandsAdmin'
import { CitiesAdmin } from '@/admin/cities/CitiesAdmin'
import { CreateCityAdmin } from '@/admin/cities/CreateCityAdmin'
import { EditCityAdmin } from '@/admin/cities/EditCityAdmin'
import { CountriesAdmin } from '@/admin/countries/CountriesAdmin'
import { CreateCountryAdmin } from '@/admin/countries/CreateCountryAdmin'
import { EditCountryAdmin } from '@/admin/countries/EditCountryAdmin'
import { TradeShowsPageAdmin } from '@/admin/tradeShowsPage/TradeShowsPageAdmin'
import { TradeShowsAdmin } from '@/admin/tradeShows/TradeShowsAdmin'
import { CreateTradeShowAdmin } from '@/admin/tradeShows/CreateTradeShowAdmin'
import { EditTradeShowAdmin } from '@/admin/tradeShows/EditTradeShowAdmin'
import { BlogPageAdmin } from '@/admin/blog/BlogPageAdmin'
import { BlogPostsAdmin } from '@/admin/blog/BlogPostsAdmin'
import { CreateBlogPostAdmin } from '@/admin/blog/CreateBlogPostAdmin'
import { EditBlogPostAdmin } from '@/admin/blog/EditBlogPostAdmin'
import { TestimonialsAdmin } from '@/admin/testimonials/TestimonialsAdmin'
import { ServicesAdmin } from '@/admin/services/ServicesAdmin'
import { PortfolioAdmin } from '@/admin/portfolio/PortfolioAdmin'
import { Toaster } from 'sonner'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected admin routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="pages" element={<Pages />} />
            <Route path="stands" element={<Stands />} />
            <Route path="admin/home" element={<HomeAdmin />} />
            <Route path="admin/about-us" element={<AboutAdmin />} />
            <Route path="admin/custom-stands" element={<CustomStandsAdmin />} />
            <Route path="admin/double-decker-stands" element={<DoubleDeckStandsAdmin />} />
            <Route path="admin/modular-stands" element={<ModularStandsAdmin />} />
            <Route path="admin/pavilion-stands" element={<PavilionStandsAdmin />} />
            <Route path="admin/trade-shows-page" element={<TradeShowsPageAdmin />} />
            <Route path="admin/trade-shows" element={<TradeShowsAdmin />} />
            <Route path="admin/trade-shows/create" element={<CreateTradeShowAdmin />} />
            <Route path="admin/trade-shows/:id/edit" element={<EditTradeShowAdmin />} />
            <Route path="admin/blog-page" element={<BlogPageAdmin />} />
            <Route path="admin/blog-posts" element={<BlogPostsAdmin />} />
            <Route path="admin/blog-posts/create" element={<CreateBlogPostAdmin />} />
            <Route path="admin/blog-posts/:id/edit" element={<EditBlogPostAdmin />} />
            <Route path="admin/testimonials" element={<TestimonialsAdmin />} />
            <Route path="admin/services" element={<ServicesAdmin />} />
            <Route path="admin/portfolio" element={<PortfolioAdmin />} />
            <Route path="admin/cities" element={<CitiesAdmin />} />
            <Route path="admin/cities/create" element={<CreateCityAdmin />} />
            <Route path="admin/cities/:id/edit" element={<EditCityAdmin />} />
            <Route path="admin/countries" element={<CountriesAdmin />} />
            <Route path="admin/countries/create" element={<CreateCountryAdmin />} />
            <Route path="admin/countries/:id/edit" element={<EditCountryAdmin />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  )
}

export default App