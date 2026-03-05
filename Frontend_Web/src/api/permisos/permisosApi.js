import instancia from "../../config/axios";

export const listarPermisos = async (params = {}) => {
  const response = await instancia.get('/usuarios/permisos/', { params });
  return response.data;
};

// export const getPermisoID = async (id) => {
//   const response = await instancia.get(`/usuarios/permisos/${id}/`);
//   return response.data;
// };

export const createPermiso = async (data) => {
  const response = await instancia.post('/usuarios/permisos/', data);
  return response.data;
};

export const updatePermiso = async (id, data) => {
  const response = await instancia.put(`/usuarios/permisos/${id}/`, data);
  return response.data;
};

export const deletePermiso = async (id) => {
  const response = await instancia.delete(`/usuarios/permisos/${id}/`);
  return response.data;
};

export const togglePermisoActivo = async (id) => {
  const response = await instancia.post(`/usuarios/permisos/${id}/toggle_active/`);
  return response.data;
};