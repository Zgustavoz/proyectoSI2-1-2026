import instancia from "../../config/axios";

export const listarUsuarios = async (params = {}) => {
  const response = await instancia.get('/usuarios/usuarios/', { params });
  return response.data;
};

export const getUsuarioID = async (id) => {
  const response = await instancia.get(`/usuarios/usuarios/${id}/`);
  return response.data;
};

export const createUsuario = async (data) => {
  const response = await instancia.post('/usuarios/usuarios/', data);
  return response.data;
};

export const updateUsuario = async (id, data) => {
  const response = await instancia.put(`/usuarios/usuarios/${id}/`, data);
  return response.data;
};

export const deleteUsuario = async (id) => {
  const response = await instancia.delete(`/usuarios/usuarios/${id}/`);
  return response.data;
};

export const toggleUsuarioActivo = async (id) => {
  const response = await instancia.post(`/usuarios/usuarios/${id}/toggle_active/`);
  return response.data;
};

export const asignarRoles = async (id, roles_ids) => {
  const response = await instancia.post(`/usuarios/usuarios/${id}/asignar_roles/`, { roles_ids });
  return response.data;
};