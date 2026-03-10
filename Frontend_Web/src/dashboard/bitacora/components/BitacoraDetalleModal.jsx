import { User, Tag, Monitor, X } from 'lucide-react';
import { COLORES_ACCION } from '../constants/bitacoraColors';

const BitacoraDetalleModal = ({ registro, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Detalle del registro</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(registro.fecha).toLocaleString('es-BO')}
          </p>
        </div>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-black transition">
          <X size={18} />
        </button>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-4">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Usuario</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-800">{registro.usuario}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Acción</p>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              COLORES_ACCION[registro.accion_code] || 'bg-gray-100 text-gray-600'
            }`}>
              {registro.accion}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Módulo</p>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              {registro.modulo}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">IP</p>
            <div className="flex items-center gap-1 text-sm text-gray-700">
              <Monitor className="w-3.5 h-3.5 text-gray-400" />
              {registro.ip || '—'}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-1">Descripción</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
            {registro.descripcion}
          </p>
        </div>

{registro.datos_extra && Object.keys(registro.datos_extra).length > 0 && (
  <div>
    <p className="text-xs text-gray-400 mb-1">Cambios realizados</p>
    <div className="bg-gray-50 rounded-lg px-3 py-3 space-y-3">

      {/* Edición — muestra antes y después */}
      {registro.datos_extra.cambios && Object.keys(registro.datos_extra.cambios).length > 0 ? (
        Object.entries(registro.datos_extra.cambios).map(([campo, val]) => (
          <div key={campo} className="text-sm">
            <p className="text-xs font-medium text-gray-500 capitalize mb-1">{campo}</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs line-through">
                {String(val.antes)}
              </span>
              <span className="text-gray-400 text-xs">→</span>
              <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
                {String(val.despues)}
              </span>
            </div>
          </div>
        ))
      ) : registro.datos_extra.cambios && Object.keys(registro.datos_extra.cambios).length === 0 ? (
        <p className="text-xs text-gray-400 italic">Sin cambios detectados</p>

      /* Crear — muestra los datos iniciales */
      ) : registro.datos_extra.datos ? (
        Object.entries(registro.datos_extra.datos)
          .filter(([, val]) => val !== null && val !== '')
          .map(([campo, val]) => (
            <div key={campo} className="flex justify-between text-xs">
              <span className="text-gray-500 capitalize">{campo}</span>
              <span className="text-gray-800 font-medium">
                {typeof val === 'boolean' ? (val ? 'Activo' : 'Inactivo') : String(val)}
              </span>
            </div>
          ))

      /* Otros — login, logout, cambiar estado, etc. */
      ) : (
        Object.entries(registro.datos_extra)
          .filter(([, val]) => val !== null && val !== '')
          .map(([campo, val]) => (
            <div key={campo} className="flex justify-between text-xs">
              <span className="text-gray-500 capitalize">{campo.replace(/_/g, ' ')}</span>
              <span className="text-gray-800 font-medium">
                {typeof val === 'boolean' ? (val ? 'Activo' : 'Inactivo') : String(val)}
              </span>
            </div>
          ))
      )}

    </div>
  </div>
)}
      </div>

      <div className="px-6 pb-6">
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Cerrar
        </button>
      </div>

    </div>
  </div>
);

export default BitacoraDetalleModal;