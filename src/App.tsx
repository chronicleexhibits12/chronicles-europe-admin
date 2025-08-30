import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Layout } from '@/components/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { About } from '@/pages/About'
import { HomeAdmin } from '@/admin/home/HomeAdmin'
import { AboutAdmin } from '@/admin/about/AboutAdmin'
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
            <Route path="admin/home" element={<HomeAdmin />} />
            <Route path="admin/about" element={<AboutAdmin />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  )
}

export default App
