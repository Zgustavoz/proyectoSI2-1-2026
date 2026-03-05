import instancia from "../../config/axios";

export const iniciarSesion = async (credentials) => {
  const response = await instancia.post('/usuarios/token/', credentials);
  return response.data;
};

export const cerrarSesion = async () => {
  const response = await instancia.post('/usuarios/logout/');
  return response.data;
};

export const obtenerPerfil = async () => {
  const response = await instancia.get('/usuarios/perfil/');
  return response.data;
};

export const registrarUsuario = async (userData) => {
  const response = await instancia.post('/usuarios/registro/', userData);
  return response.data;
};

export const solicitarRecuperacion = async (email) => {
  const response = await instancia.post('/usuarios/password-reset/', { email });
  return response.data;
};

export const restablecerPassword = async (data) => {
  const response = await instancia.post(
    `/usuarios/restablecer-password/${data.uid}/${data.token}/`,
    { new_password: data.password }
  );
  return response.data;
};

export const loginConGoogle = async (token) => {
  const response = await instancia.post('/usuarios/auth/google/', { token });
  return response.data;
};

export const cambiarPassword = async (data) => {
  const response = await instancia.post('/usuarios/cambiar-password/', data);
  return response.data;
};