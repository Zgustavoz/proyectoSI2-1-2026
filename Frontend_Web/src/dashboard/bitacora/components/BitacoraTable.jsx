import { useState } from 'react';
import { Calendar, Monitor, User, Tag, Info, Eye, X } from 'lucide-react';
import BitacoraDetalleModal from './BitacoraDetalleModal';
import { COLORES_ACCION } from '../constants/bitacoraColors';

const BitacoraTable = ({ registros }) => {
  const [seleccionado, setSeleccionado] = useState(null);

  if (!registros?.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center text-gray-400 text-sm">
        No hay registros en la bitácora
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Usuario', 'Acción', 'Módulo', 'Descripción', 'IP', 'Fecha', ''].map((h, i) => (
                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registros.map(registro => (
                <tr key={registro.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <span className="text-sm text-gray-700">{registro.usuario}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      COLORES_ACCION[registro.accion_code] || 'bg-gray-100 text-gray-600'
                    }`}>
                      {registro.accion}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Tag className="w-3 h-3" />
                      {registro.modulo}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-xs truncate">
                      {registro.descripcion}
                    </p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Monitor className="w-3 h-3" />
                      {registro.ip || '—'}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(registro.fecha).toLocaleString('es-BO')}
                    </div>
                  </td>

                  {/* Botón detalle */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSeleccionado(registro)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-black border border-gray-200 rounded-lg transition"
                    >
                      <Eye size={13} />
                      Detalle
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {seleccionado && (
        <BitacoraDetalleModal
          registro={seleccionado}
          onClose={() => setSeleccionado(null)}
        />
      )}
    </>
  );
};

export default BitacoraTable;