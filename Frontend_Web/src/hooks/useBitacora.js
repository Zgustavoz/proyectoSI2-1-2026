import { useQuery, useMutation } from '@tanstack/react-query';
import { obtenerBitacora, verificarPasswordBitacora } from '../api/bitacora/bitacoraApi';
import toast from 'react-hot-toast';

export const useBitacora = (filtros = {}, habilitado = false) => {
  const bitacora = useQuery({
    queryKey: ['bitacora', filtros],
    queryFn: () => obtenerBitacora(filtros),
    enabled: habilitado,
  });

  const verificarPassword = useMutation({
    mutationFn: verificarPasswordBitacora,
    onError: () => toast.error('Contraseña incorrecta'),
  });

  return { bitacora, verificarPassword };
};