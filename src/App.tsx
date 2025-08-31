import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Layout } from '@/components/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Stands } from '@/pages/Stands'
import { About } from '@/pages/About'
import { CustomStands } from '@/pages/CustomStands'
import { HomeAdmin } from '@/admin/home/HomeAdmin'
import { AboutAdmin } from '@/admin/about/AboutAdmin'
import { CustomStandsAdmin } from '@/admin/customStands/CustomStandsAdmin'
import { Toaster } from 'sonner'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Public routes */}
          <Route path="/about" element={<About />} />
          <Route path="/custom-stands" element={<CustomStands />} />
          
          {/* Protected admin routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="stands" element={<Stands />} />
            <Route path="admin/home" element={<HomeAdmin />} />
            <Route path="admin/about" element={<AboutAdmin />} />
            <Route path="admin/custom-stands" element={<CustomStandsAdmin />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  )
}

export default App
