import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  listarRoles,
//   getRolID,
  createRol,
  updateRol,
  deleteRol,
  toggleRolActivo,
  asignarPermisos,
} from '../api/roles/rolesApi';

export const useRol = (filtros = {}) => {
  const queryClient = useQueryClient();

  const roles = useQuery({
    queryKey: ['roles', filtros],
    queryFn: () => listarRoles(filtros),
  });

//   const rolPorId = (id) => useQuery({
//     queryKey: ['rol', id],
//     queryFn: () => getRolID(id),
//     enabled: !!id,
//   });

  const crearRol = useMutation({
    mutationFn: (data) => createRol(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      toast.success('Rol creado exitosamente');
    },
    onError: (error) => {
      toast.error(error?.error || error?.nombre?.[0] || 'Error al crear rol');
    },
  });

  const actualizarRol = useMutation({
    mutationFn: ({ id, data }) => updateRol(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      toast.success('Rol actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al actualizar rol');
    },
  });

  const eliminarRol = useMutation({
    mutationFn: (id) => deleteRol(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      toast.success('Rol eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al eliminar rol');
    },
  });

  const toggleActivo = useMutation({
    mutationFn: (id) => toggleRolActivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al cambiar estado');
    },
  });

  const asignarPermisosRol = useMutation({
    mutationFn: ({ id, permisos_ids }) => asignarPermisos(id, permisos_ids),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles']);
      toast.success('Permisos asignados exitosamente');
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al asignar permisos');
    },
  });

  return {
    roles,
    // rolPorId,
    crearRol,
    actualizarRol,
    eliminarRol,
    toggleActivo,
    asignarPermisosRol,
  };
};