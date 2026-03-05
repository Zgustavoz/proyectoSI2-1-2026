import { useState } from 'react';
import { X } from 'lucide-react';
import { useRol } from '../../../hooks/useRol';
import { usePermiso } from '../../../hooks/usePermiso';

export const CrearRolModal = ({ onClose }) => {
  const { crearRol } = useRol();
  const { permisos } = usePermiso({ activo: true });

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    es_admin: false,
    permisos_ids: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handlePermisoToggle = (id) => {
    setForm(prev => ({
      ...prev,
      permisos_ids: prev.permisos_ids.includes(id)
        ? prev.permisos_ids.filter(p => p !== id)
        : [...prev.permisos_ids, id],
    }));
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'Requerido';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    crearRol.mutate(form, { onSuccess: () => onClose() });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Nuevo Rol</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text" name="nombre" value={form.nombre}
              onChange={handleChange} placeholder="ej: vendedor"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.nombre ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="descripcion" value={form.descripcion}
              onChange={handleChange} placeholder="Describe las responsabilidades de este rol..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Es admin */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox" name="es_admin" id="es_admin"
              checked={form.es_admin} onChange={handleChange}
              className="w-4 h-4 accent-black"
            />
            <div>
              <label htmlFor="es_admin" className="text-sm font-medium text-gray-700 cursor-pointer">
                Rol de administrador
              </label>
              <p className="text-xs text-gray-400">Tendrá acceso total al sistema</p>
            </div>
          </div>

          {/* Permisos */}
          {!form.es_admin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permisos
                <span className="ml-1 text-xs text-gray-400 font-normal">
                  ({form.permisos_ids.length} seleccionados)
                </span>
              </label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
                {permisos.isLoading ? (
                  <p className="text-sm text-gray-400 text-center py-4">Cargando permisos...</p>
                ) : permisos.data?.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No hay permisos disponibles</p>
                ) : (
                  <div className="space-y-2">
                    {permisos.data?.map(permiso => (
                      <label key={permiso.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={form.permisos_ids.includes(permiso.id)}
                          onChange={() => handlePermisoToggle(permiso.id)}
                          className="w-4 h-4 accent-black"
                        />
                        <div>
                          <span className="text-sm text-gray-700 group-hover:text-black transition">
                            {permiso.nombre}
                          </span>
                          <span className="ml-2 text-xs text-gray-400">{permiso.codename}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
              Cancelar
            </button>
            <button type="submit" disabled={crearRol.isPending}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50">
              {crearRol.isPending ? 'Creando...' : 'Crear Rol'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};