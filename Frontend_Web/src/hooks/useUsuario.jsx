import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  listarUsuarios, getUsuarioID, createUsuario,
  updateUsuario, deleteUsuario, toggleUsuarioActivo, asignarRoles,
} from '../api/usuarios/usuariosApi';

export const useUsuario = (filtros = {}) => {
  const queryClient = useQueryClient();

  const usuarios = useQuery({
    queryKey: ['usuarios', filtros],
    queryFn: () => listarUsuarios(filtros),
    keepPreviousData: true,
  });

  const crearUsuario = useMutation({
    mutationFn: (data) => createUsuario(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      toast.success('Usuario creado exitosamente');
    },
    onError: (error) => {
      toast.error(error?.username?.[0] || error?.email?.[0] || error?.error || 'Error al crear usuario');
    },
  });

  const actualizarUsuario = useMutation({
    mutationFn: ({ id, data }) => updateUsuario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al actualizar usuario');
    },
  });

  const eliminarUsuario = useMutation({
    mutationFn: (id) => deleteUsuario(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al eliminar usuario');
    },
  });

  const toggleActivo = useMutation({
    mutationFn: (id) => toggleUsuarioActivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al cambiar estado');
    },
  });

  const asignarRolesUsuario = useMutation({
    mutationFn: ({ id, roles_ids }) => asignarRoles(id, roles_ids),
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      toast.success('Roles asignados exitosamente');
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al asignar roles');
    },
  });

  return {
    usuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    toggleActivo,
    asignarRolesUsuario,
  };
};