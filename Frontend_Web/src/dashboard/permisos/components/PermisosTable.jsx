import { Key } from 'lucide-react';
import { EditButton, DeleteButton, EstadoButton } from '../../../components/ui/buttons/index';

export const PermisosTable = ({
  permisos, onToggleActive, onEditar, onEliminar,
  puedeEditar, puedeEliminar, puedeCambiarEstado,
}) => {

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['Permiso', 'Codename', 'Descripción', 'Estado', 'Creado', 'Acciones'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {permisos.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                  No hay permisos registrados
                </td>
              </tr>
            ) : (
              permisos.map(permiso => (
                <tr key={permiso.id} className="hover:bg-gray-50 transition-colors">

                  {/* Permiso */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Key className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{permiso.nombre}</span>
                    </div>
                  </td>

                  {/* Codename */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-mono">
                      {permiso.codename}
                    </code>
                  </td>

                  {/* Descripción */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 max-w-xs truncate">
                      {permiso.descripcion || <span className="italic text-gray-300">Sin descripción</span>}
                    </p>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      permiso.is_active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {permiso.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  {/* Fecha */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-500">
                      {new Date(permiso.fecha_creacion).toLocaleDateString('es-BO')}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 justify-end">
                      <EstadoButton
                        onClick={() => onToggleActive(permiso)}
                        disabled={!puedeCambiarEstado}
                        isActive={permiso.is_active}
                      />
                      <EditButton
                        onClick={() => onEditar(permiso)}
                        disabled={!puedeEditar}
                      />
                      <DeleteButton
                        onClick={() => onEliminar(permiso)}
                        disabled={!puedeEliminar}
                      />
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};