import { Shield, Users } from 'lucide-react';
import { EditButton, DeleteButton, EstadoButton } from '../../../components/ui/buttons/index';

export const RolesTable = ({
  roles, onToggleActive, onEditar, onEliminar,
  puedeEditar, puedeEliminar, puedeCambiarEstado,
}) => {

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['Rol', 'Descripción', 'Permisos', 'Usuarios', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                  No hay roles registrados
                </td>
              </tr>
            ) : (
              roles.map(rol => (
                <tr key={rol.id} className="hover:bg-gray-50 transition-colors">

                  {/* Rol */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        rol.es_admin ? 'bg-black' : 'bg-gray-100'
                      }`}>
                        <Shield className={`w-4 h-4 ${rol.es_admin ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{rol.nombre}</div>
                        {rol.es_admin && (
                          <span className="text-xs text-gray-500">Administrador</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Descripción */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 max-w-xs truncate">
                      {rol.descripcion || <span className="italic text-gray-300">Sin descripción</span>}
                    </p>
                  </td>

                  {/* Permisos */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {rol.permisos_info?.length > 0 ? (
                        <>
                          {rol.permisos_info.slice(0, 3).map(p => (
                            <span key={p.id} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                              {p.nombre}
                            </span>
                          ))}
                          {rol.permisos_info.length > 3 && (
                            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-500 rounded-full">
                              +{rol.permisos_info.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Sin permisos</span>
                      )}
                    </div>
                  </td>

                  {/* Usuarios */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      {rol.usuarios_count}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      rol.is_active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {rol.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  
                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 justify-end">
                      <EstadoButton
                        onClick={() => onToggleActive(rol)}
                        disabled={!puedeCambiarEstado}
                        isActive={rol.is_active}
                      />
                      <EditButton
                        onClick={() => onEditar(rol)}
                        disabled={!puedeEditar}
                      />
                      <DeleteButton
                        onClick={() => onEliminar(rol)}
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