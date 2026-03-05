import { useState } from 'react';
import { X } from 'lucide-react';
import { useUsuario } from '../../../hooks/useUsuario';
import { useRol } from '../../../hooks/useRol';
import { InputField } from '../../../components/ui/forms/InputField';

export const EditarUsuarioModal = ({ usuario, onClose }) => {
  const { actualizarUsuario } = useUsuario();
  const { roles } = useRol();

  const [form, setForm] = useState({
    username: usuario.username || '',
    first_name: usuario.first_name || '',
    last_name: usuario.last_name || '',
    email: usuario.email || '',
    telefono: usuario.telefono || '',
    password: '',
    roles_ids: usuario.roles_info?.map(r => r.id) || [],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleRolToggle = (id) => {
    setForm(prev => ({
      ...prev,
      roles_ids: prev.roles_ids.includes(id)
        ? prev.roles_ids.filter(r => r !== id)
        : [...prev.roles_ids, id],
    }));
  };

  const validar = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Requerido';
    if (!form.first_name.trim()) errs.first_name = 'Requerido';
    if (!form.last_name.trim()) errs.last_name = 'Requerido';
    if (!form.email.trim()) errs.email = 'Requerido';
    if (form.password && form.password.length < 8)
      errs.password = 'Mínimo 8 caracteres';
    if (!form.roles_ids.length)
      errs.roles_ids = 'Selecciona al menos un rol';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const data = { ...form };
    if (!data.password) delete data.password;

    actualizarUsuario.mutate(
      { id: usuario.id, data },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Editar Usuario
            </h2>
            <p className="text-sm text-gray-400">
              @{usuario.username}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="username"
              label="Usuario"
              sensitive
              value={form.username}
              onChange={handleChange}
              error={errors.username}
            />

            <InputField
              name="email"
              label="Email"
              type="email"
              sensitive
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="first_name"
              label="Nombre"
              placeholder="Juan"
              value={form.first_name}
              onChange={handleChange}
              error={errors.first_name}
            />

            <InputField
              name="last_name"
              label="Apellido"
              placeholder="Pérez"
              value={form.last_name}
              onChange={handleChange}
              error={errors.last_name}
            />
          </div>

          <InputField
            name="telefono"
            label="Teléfono (opcional)"
            placeholder="+591 70000000"
            value={form.telefono}
            onChange={handleChange}
            error={errors.telefono}
          />

          <InputField
            name="password"
            label="Nueva Contraseña"
            type="password"
            placeholder="Dejar vacío para no cambiar"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roles
            </label>

            <div className="flex flex-wrap gap-2">
              {roles.data?.map(rol => (
                <button
                  key={rol.id}
                  type="button"
                  onClick={() => handleRolToggle(rol.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    form.roles_ids.includes(rol.id)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rol.nombre}
                </button>
              ))}
            </div>

            {errors.roles_ids && (
              <p className="text-red-500 text-xs mt-1">
                {errors.roles_ids}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={actualizarUsuario.isPending}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50"
            >
              {actualizarUsuario.isPending
                ? 'Guardando...'
                : 'Guardar cambios'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};