import { Mail, Phone, Calendar } from 'lucide-react';
import { EditButton, DeleteButton, EstadoButton } from '../../../components/ui/buttons/index';

export const UsuariosTable = ({
  usuarios,
  onToggleActive,
  onEditar,
  onEliminar,
  puedeEditar,
  puedeEliminar,
  puedeCambiarEstado,
}) => {

  const getRolesDisplay = (usuario) => {
    if (!usuario.roles_info?.length)
      return <span className="text-gray-400 text-xs italic">Sin rol</span>;

    const primeros  = usuario.roles_info.slice(0, 2);
    const restantes = usuario.roles_info.length - 2;

    return (
      <div className="flex items-center gap-1 flex-wrap">
        {primeros.map(rol => (
          <span key={rol.id} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
            {rol.nombre}
          </span>
        ))}
        {restantes > 0 && (
          <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
            +{restantes}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['Usuario', 'Contacto', 'Roles', 'Registro', 'Estado', 'Acciones'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map(usuario => (
                <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">

                  {/* Usuario */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          {usuario.first_name?.[0] || usuario.username?.[0] || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {usuario.first_name} {usuario.last_name}
                        </div>
                        <div className="text-xs text-gray-400">@{usuario.username}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contacto */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail className="w-3 h-3" />
                        {usuario.email}
                      </div>
                      {usuario.telefono && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Phone className="w-3 h-3" />
                          {usuario.telefono}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Roles */}
                  <td className="px-6 py-4">{getRolesDisplay(usuario)}</td>

                  {/* Registro */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(usuario.date_joined).toLocaleDateString('es-BO')}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      usuario.is_active
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {usuario.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 justify-end">
                      <EstadoButton
                        onClick={() => onToggleActive(usuario)}
                        disabled={!puedeCambiarEstado}
                        isActive={usuario.is_active}
                      />
                      <EditButton
                        onClick={() => onEditar(usuario)}
                        disabled={!puedeEditar}
                      />
                      <DeleteButton
                        onClick={() => onEliminar(usuario)}
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