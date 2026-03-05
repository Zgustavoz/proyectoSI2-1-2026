import { useState } from 'react';
import { X } from 'lucide-react';
import { usePermiso } from '../../../hooks/usePermiso';

export const CrearPermisoModal = ({ onClose }) => {
  const { crearPermiso } = usePermiso();

  const [form, setForm] = useState({
    nombre: '',
    codename: '',
    descripcion: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'Requerido';
    if (!form.codename.trim()) errs.codename = 'Requerido';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    crearPermiso.mutate(form, { onSuccess: () => onClose() });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Nuevo Permiso</h2>
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
              onChange={handleChange} placeholder="ej: crear"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black ${errors.nombre ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          {/* Codename */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Codename</label>
            <input
              type="text" name="codename" value={form.codename}
              onChange={handleChange} placeholder="ej: can_create"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black font-mono ${errors.codename ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.codename && <p className="text-red-500 text-xs mt-1">{errors.codename}</p>}
            <p className="text-xs text-gray-400 mt-1">Identificador único, sin espacios</p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="descripcion" value={form.descripcion}
              onChange={handleChange} placeholder="Describe qué permite hacer este permiso..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
              Cancelar
            </button>
            <button type="submit" disabled={crearPermiso.isPending}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50">
              {crearPermiso.isPending ? 'Creando...' : 'Crear Permiso'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};