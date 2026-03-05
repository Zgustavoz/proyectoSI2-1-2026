import instancia from "../../config/axios";

export const listarRoles = async (params = {}) => {
  const response = await instancia.get('/usuarios/roles/', { params });
  return response.data;
};

export const getRolID = async (id) => {
  const response = await instancia.get(`/usuarios/roles/${id}/`);
  return response.data;
};

export const createRol = async (data) => {
  const response = await instancia.post('/usuarios/roles/', data);
  return response.data;
};

export const updateRol = async (id, data) => {
  const response = await instancia.put(`/usuarios/roles/${id}/`, data);
  return response.data;
};

export const deleteRol = async (id) => {
  const response = await instancia.delete(`/usuarios/roles/${id}/`);
  return response.data;
};

export const toggleRolActivo = async (id) => {
  const response = await instancia.post(`/usuarios/roles/${id}/toggle_active/`);
  return response.data;
};

export const asignarPermisos = async (id, permisos_ids) => {
  const response = await instancia.post(`/usuarios/roles/${id}/asignar_permisos/`, { permisos_ids });
  return response.data;
};