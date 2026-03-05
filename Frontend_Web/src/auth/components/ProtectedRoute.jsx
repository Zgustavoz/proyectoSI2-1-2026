import { Navigate } from 'react-router-dom' 
import { useAuth } from '../context/AuthContext' 
import Unauthorized from '../pages/Unauthorized' 
import { Loading } from '../../components/Loading' 

function ProtectedRoute({
  children,
  requiredPermission = null,
  requiredRoles = [],
}) {
  const { user, loading, tienePermiso } = useAuth()

  if (loading) return <Loading /> 

  if (!user) return <Navigate to="/login" replace /> 

  if (user.es_admin) return children 

  if (requiredPermission) {
    if (!tienePermiso(requiredPermission)) { return <Unauthorized />  }
  }

  if (requiredRoles.length > 0) {
    const tieneRol = requiredRoles.some(rol => user.roles?.includes(rol)) 
    if (!tieneRol) return <Unauthorized /> 
  }


  return children 
}

export default ProtectedRoute 