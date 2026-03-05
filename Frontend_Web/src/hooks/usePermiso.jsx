import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  listarPermisos,
//   getPermisoID,
  createPermiso,
  updatePermiso,
  deletePermiso,
  togglePermisoActivo,
} from '../api/permisos/permisosApi';

export const usePermiso = (filtros = {}) => {
  const queryClient = useQueryClient();

  const permisos = useQuery({
    queryKey: ['permisos', filtros],
    queryFn: () => listarPermisos(filtros),
  });

//   const permisoPorId = (id) => useQuery({
//     queryKey: ['permiso', id],
//     queryFn: () => getPermisoID(id),
//     enabled: !!id,
//   });

  const crearPermiso = useMutation({
    mutationFn: (data) => createPermiso(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['permisos']);
      toast.success('Permiso creado exitosamente');
    },
    onError: (error) => {
      toast.error(error?.error || error?.nombre?.[0] || 'Error al crear permiso');
    },
  });

  const actualizarPermiso = useMutation({
    mutationFn: ({ id, data }) => updatePermiso(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['permisos']);
      toast.success('Permiso actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al actualizar permiso');
    },
  });

  const eliminarPermiso = useMutation({
    mutationFn: (id) => deletePermiso(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['permisos']);
      toast.success('Permiso eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al eliminar permiso');
    },
  });

  const toggleActivo = useMutation({
    mutationFn: (id) => togglePermisoActivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['permisos']);
    },
    onError: (error) => {
      toast.error(error?.error || 'Error al cambiar estado');
    },
  });

  return {
    permisos,
    // permisoPorId,
    crearPermiso,
    actualizarPermiso,
    eliminarPermiso,
    toggleActivo,
  };
};