import { useState } from 'react';
import { ClipboardList, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBitacora } from '../../../hooks/useBitacora';
import { Loading } from '../../../components/Loading';
import { ExportButton } from '../../../components/ui/buttons/index';
import BitacoraPasswordModal from '../components/BitacoraPasswordModal';
import BitacoraTable from '../components/BitacoraTable';

const ACCIONES = [
  { value: 'LOGIN',          label: 'Inicio de sesión' },
  { value: 'LOGOUT',         label: 'Cierre de sesión' },
  { value: 'CREAR',          label: 'Crear' },
  { value: 'EDITAR',         label: 'Editar' },
  { value: 'ELIMINAR',       label: 'Eliminar' },
  { value: 'CAMBIAR_ESTADO', label: 'Cambiar estado' },
  { value: 'EXPORTAR',       label: 'Exportar' },
  { value: 'COMPRA',         label: 'Compra' },
  { value: 'PEDIDO',         label: 'Pedido' },
  { value: 'PAGO',           label: 'Pago' },
];

export const BitacoraPage = () => {
  const [acceso, setAcceso]           = useState(false);
  const [showModal, setShowModal]     = useState(true);
  const [search, setSearch]           = useState('');
  const [accionFiltro, setAccion]     = useState('');
  const [moduloFiltro, setModulo]     = useState('');
  const [fechaDesde, setFechaDesde]   = useState('');
  const [fechaHasta, setFechaHasta]   = useState('');
  const [page, setPage]               = useState(1);

  const filtros = {
    usuario:     search      || undefined,
    accion:      accionFiltro || undefined,
    modulo:      moduloFiltro || undefined,
    fecha_desde: fechaDesde  || undefined,
    fecha_hasta: fechaHasta  || undefined,
    page,
  };

  const { bitacora, verificarPassword } = useBitacora(filtros, acceso);

  const handleVerificar = async (password) => {
    await verificarPassword.mutateAsync(password);
    setAcceso(true);
    setShowModal(false);
  };

  const limpiarFiltros = () => {
    setSearch(''); setAccion(''); setModulo('');
    setFechaDesde(''); setFechaHasta(''); setPage(1);
  };

  const hayFiltros = search || accionFiltro || moduloFiltro || fechaDesde || fechaHasta;
  const data        = bitacora.data;
  const total       = data?.count || 0;
  const totalPages  = data?.pages || 1;
  const registros   = data?.results || [];

  // Sin acceso → solo modal
  if (!acceso) {
    return showModal ? (
      <BitacoraPasswordModal
        onSuccess={handleVerificar}
        onClose={() => window.history.back()}
      />
    ) : null;
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            Bitácora
          </h1>
          <p className="text-gray-500 text-sm mt-1">{total} registros</p>
        </div>
        <ExportButton
          empresa="MI EMPRESA"
          titulo="Bitácora del Sistema"
          metadata={{
            'Total registros': total,
            'Filtro acción':   accionFiltro || 'Todos',
            'Filtro módulo':   moduloFiltro || 'Todos',
            'Fecha desde':     fechaDesde   || '-',
            'Fecha hasta':     fechaHasta   || '-',
          }}
          secciones={[{
            titulo: 'Bitácora',
            columnas: ['Usuario', 'Acción', 'Módulo', 'Descripción', 'IP', 'Fecha'],
            datos: registros,
            mapearDatos: (r) => [
              r.usuario,
              r.accion,
              r.modulo,
              r.descripcion,
              r.ip || '—',
              new Date(r.fecha).toLocaleString('es-BO'),
            ],
          }]}
        />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por usuario..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <select
            value={accionFiltro}
            onChange={(e) => { setAccion(e.target.value); setPage(1); }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
          >
            <option value="">Todas las acciones</option>
            {ACCIONES.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>

          <input
            type="text"
            value={moduloFiltro}
            onChange={(e) => { setModulo(e.target.value); setPage(1); }}
            placeholder="Filtrar por módulo..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
          />

          <div>
            <label className="block text-xs text-gray-500 mb-1">Desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => { setFechaDesde(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => { setFechaHasta(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-600"
            />
          </div>

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
      {bitacora.isLoading ? <Loading /> : (
        <>
          <BitacoraTable registros={registros} />

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">
                Página {page} de {totalPages} — {total} registros
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
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
                  ))}
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
    </div>
  );
};