import { useState } from 'react';
import { useUsuario } from '../../../hooks/useUsuario';
import { useRol } from '../../../hooks/useRol';
import { useAuth } from '../../../auth/context/AuthContext';
import { UsuariosTable } from '../components/UsuariosTable';
import { CrearUsuarioModal } from '../components/CrearUsuarioModal';
import { EditarUsuarioModal } from '../components/EditarUsuarioModal';
import { Loading } from '../../../components/Loading';
import { Users, Plus, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CreateButton } from '../../../components/ui/buttons/index';

export const UsuariosPage = () => {
  const { tienePermiso } = useAuth();

  // Filtros
  const [search, setSearch] = useState('');
  const [rolFiltro, setRolFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [page, setPage] = useState(1);

  const filtros = {
    search: search || undefined,
    'roles[]': rolFiltro || undefined,
    activo: estadoFiltro || undefined,
    fecha_desde: fechaDesde || undefined,
    fecha_hasta: fechaHasta || undefined,
    page,
  };

  const { usuarios, toggleActivo, eliminarUsuario } = useUsuario(filtros);
  const { roles } = useRol();

  const [modalCrear, setModalCrear] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const puedeCrear = tienePermiso('crear');
  const puedeEditar = tienePermiso('editar');
  const puedeEliminar = tienePermiso('eliminar');
  const puedeCambiarEstado = tienePermiso('cambiar estado');

  const handleToggleActive = (usuario) => {
    const accion = usuario.is_active ? 'desactivar' : 'activar';
    if (window.confirm(`¿Estás seguro de ${accion} a "${usuario.username}"?`)) {
      toggleActivo.mutate(usuario.id);
    }
  };

  const handleEliminar = (usuario) => {
    if (window.confirm(`¿Eliminar a "${usuario.username}"? Esta acción no se puede deshacer.`)) {
      eliminarUsuario.mutate(usuario.id);
    }
  };

  const limpiarFiltros = () => {
    setSearch('');
    setRolFiltro('');
    setEstadoFiltro('');
    setFechaDesde('');
    setFechaHasta('');
    setPage(1);
  };

  const hayFiltros = search || rolFiltro || estadoFiltro || fechaDesde || fechaHasta;

  // Paginación — el backend devuelve { count, next, previous, results }
  const data = usuarios.data;
  const totalUsuarios = data?.count || 0;
  const totalPages = Math.ceil(totalUsuarios / 10);
  const listaUsuarios = data?.results || [];

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Usuarios
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {totalUsuarios} usuarios registrados
          </p>
        </div>
        <CreateButton
          onClick={() => setModalCrear(true)}
          disabled={!puedeCrear}
        >
          Nuevo Usuario
        </CreateButton>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Buscador */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por nombre, usuario o email..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Filtro por rol */}
          <select
            value={rolFiltro}
            onChange={(e) => { setRolFiltro(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
          >
            <option value="">Todos los roles</option>
            {roles.data?.map(rol => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>

          {/* Filtro por estado */}
          <select
            value={estadoFiltro}
            onChange={(e) => { setEstadoFiltro(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>

          {/* Fecha desde */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => { setFechaDesde(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => { setFechaHasta(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
            />
          </div>

          {/* Limpiar filtros */}
          {hayFiltros && (
            <div className="flex items-end">
              <button
                onClick={limpiarFiltros}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <X size={14} />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      {usuarios.isLoading ? <Loading /> : (
        <>
          <UsuariosTable
            usuarios={listaUsuarios}
            onToggleActive={handleToggleActive}
            onEditar={(usuario) => setUsuarioAEditar(usuario)}
            onEliminar={handleEliminar}
            puedeEditar={puedeEditar}
            puedeEliminar={puedeEliminar}
            puedeCambiarEstado={puedeCambiarEstado}
          />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Página {page} de {totalPages} — {totalUsuarios} usuarios
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Números de página */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) => p === '...' ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        page === p
                          ? 'bg-black text-white'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))
                }

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modales */}
      {modalCrear && <CrearUsuarioModal onClose={() => setModalCrear(false)} />}
      {usuarioAEditar && (
        <EditarUsuarioModal
          usuario={usuarioAEditar}
          onClose={() => setUsuarioAEditar(null)}
        />
      )}
    </div>
  );
};