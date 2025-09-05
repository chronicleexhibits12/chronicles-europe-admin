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
            <Route path="admin/about" element={<AboutAdmin />} />
            <Route path="admin/custom-stands" element={<CustomStandsAdmin />} />
            <Route path="admin/double-decker-stands" element={<DoubleDeckStandsAdmin />} />
            <Route path="admin/modular-stands" element={<ModularStandsAdmin />} />
            <Route path="admin/pavilion-stands" element={<PavilionStandsAdmin />} />
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