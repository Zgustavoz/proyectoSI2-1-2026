//src/auth/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { obtenerPerfil } from "../../api/auth/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const construirUsuario = (perfil) => ({
    id: perfil.id,
    username: perfil.username,
    email: perfil.email,
    first_name: perfil.first_name,
    last_name: perfil.last_name,
    roles: perfil.roles_info?.map(r => r.nombre) || [],
    permisos: perfil.permisos || [],
    permisos_nombres: perfil.permisos_nombres || [],
    es_admin: perfil.es_admin,
    is_online: perfil.is_online,
  });
  
  useEffect(() => {
    obtenerPerfil()
      .then((perfil) => setUser(construirUsuario(perfil)))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (perfilData) => setUser(construirUsuario(perfilData));
  const logout = () => setUser(null);

  const tieneAcceso = (rolesRequeridos = []) => {
    if (user?.es_admin) return true;
    if (!rolesRequeridos.length) return true;
    return rolesRequeridos.some(rol => user?.roles?.includes(rol));
  };

  const tienePermiso = (namePermiso) => {
    if (user?.es_admin) return true;
    return user?.permisos_nombres?.includes(namePermiso) || false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, tienePermiso, tieneAcceso }}>
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext);