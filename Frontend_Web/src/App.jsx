//src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/context/AuthContext'

// Auth pages
import Login from './auth/pages/Login'
import Registro from './auth/pages/Registro'
import RecuperarPassword from './auth/pages/RecuperarPassword'
import RestablecerPassword from './auth/pages/RestablecerPassword'
import Unauthorized from './auth/pages/Unauthorized'
import NotFound from './auth/pages/NotFound'
import ProtectedRoute from './auth/components/ProtectedRoute'
import { DashboardLayout } from './dashboard/Dashboard'
import { DashboardHome } from './dashboard/pages/DashboardHome'
import ClienteDashboard from './cliente/Cliente'
import { Loading } from './components/Loading'
import { UsuariosPage } from './dashboard/usuarios/pages/UsuariosPage'
import { RolesPage } from './dashboard/roles/pages/RolesPage'
import { PermisosPage } from './dashboard/permisos/pages/PermisosPage'
import { BitacoraPage } from './dashboard/bitacora/pages/BitacoraPage'

function App() {
  const { user, loading } = useAuth()

  if (loading) return <Loading />

  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/reset-password/:uid/:token" element={<RestablecerPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Dashboard - solo empleados/admin */}
      <Route path="/dashboard" element={ <ProtectedRoute requiredRoles={['admin', 'empleado']}> <DashboardLayout /></ProtectedRoute> } >
        <Route index element={<DashboardHome />} />
        <Route path="usuarios" element={ <ProtectedRoute requiredRoles={['gestionar usuarios']}> <UsuariosPage /> </ProtectedRoute> } />
        <Route path="roles" element={ <ProtectedRoute requiredRoles={['admin']}> <RolesPage /> </ProtectedRoute> } />
        <Route path="permisos" element={ <ProtectedRoute requiredRoles={['admin']}> <PermisosPage /> </ProtectedRoute> } />
        <Route path="bitacora" element={ <ProtectedRoute requiredRoles={['admin']}> <BitacoraPage /> </ProtectedRoute>} />
      </Route>

      {/* Cliente */}
      <Route path="/cliente" element={ <ProtectedRoute requiredRoles={['cliente']}> <ClienteDashboard /> </ProtectedRoute>} >
        {/* Rutas específicas del cliente */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App