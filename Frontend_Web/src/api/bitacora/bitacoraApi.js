import api from '../../config/axios';

export const verificarPasswordBitacora = async (password) => {
  const { data } = await api.post('usuarios/bitacora/verificar/', { password });
  return data;
};

export const obtenerBitacora = async (filtros = {}) => {
  const { data } = await api.get('usuarios/bitacora/', { params: filtros });
  return data;
};