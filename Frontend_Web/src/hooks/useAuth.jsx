import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  iniciarSesion,
  cerrarSesion,
  registrarUsuario,
  solicitarRecuperacion,
  restablecerPassword,
  loginConGoogle,
  obtenerPerfil,
  cambiarPassword,
} from '../api/auth/authApi';
import { useAuth as useAuthContext } from '../auth/context/AuthContext';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login: contextLogin, logout: contextLogout } = useAuthContext();

  const login = useMutation({
    mutationFn: iniciarSesion,
    onSuccess: async () => {
      const perfil = await obtenerPerfil();
      contextLogin(perfil);
      toast.success('¡Inicio de sesión exitoso!');
      const esEmpleado = perfil.es_admin || perfil.roles_info?.some(r => r.nombre === 'empleado');
      navigate(esEmpleado ? '/dashboard' : '/cliente');
    },
    onError: (error) => {
      const msg = error?.response?.data?.detail || 'Credenciales incorrectas';
      toast.error(msg);
    },
  });

  const registro = useMutation({
    mutationFn: registrarUsuario,
    onSuccess: (data) => {
      toast.success(data.message || '¡Registro exitoso!');
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al registrarse');
    },
  });

  const recuperarPassword = useMutation({
    mutationFn: ({ email }) => solicitarRecuperacion(email),
    onSuccess: (data) => {
      toast.success(data.message || 'Revisa tu email');
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al solicitar recuperación');
    },
  });

  const restablecer = useMutation({
    mutationFn: restablecerPassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Contraseña actualizada');
      setTimeout(() => navigate('/login'), 2000);
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al restablecer contraseña');
    },
  });

  const googleLogin = useMutation({
    mutationFn: loginConGoogle,
    onSuccess: async () => {
      const perfil = await obtenerPerfil();
      contextLogin(perfil);
      toast.success('¡Inicio de sesión exitoso!');
      const esEmpleado = perfil.es_admin || perfil.roles_info?.some(r => r.nombre === 'empleado');
      navigate(esEmpleado ? '/dashboard' : '/cliente');
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al iniciar sesión con Google');
    },
  });

  const cambiarClave = useMutation({
    mutationFn: cambiarPassword,
    onSuccess: () => {
      toast.success('Contraseña actualizada exitosamente');
    },
    onError: (error) => {
      toast.error(error?.old_password?.[0] || error?.error || 'Error al cambiar contraseña');
    },
  });

  const logout = async () => {
    try {
      await cerrarSesion();
    } catch {
      // si falla igual limpiamos
    }
    contextLogout();
    queryClient.clear();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  return {
    login,
    registro,
    recuperarPassword,
    restablecer,
    googleLogin,
    cambiarClave,
    logout,
  };
};