import { useState } from 'react';
import { usePermiso } from '../../../hooks/usePermiso';
import { useAuth } from '../../../auth/context/AuthContext';
import { PermisosTable } from '../components/PermisosTable';
import { CrearPermisoModal } from '../components/CrearPermisoModal';
import { EditarPermisoModal } from '../components/EditarPermisoModal';
import { Loading } from '../../../components/Loading';
import { Key } from 'lucide-react';
import { CreateButton } from '../../../components/ui/buttons/index'

export const PermisosPage = () => {
  const { tienePermiso } = useAuth();
  const { permisos, toggleActivo, eliminarPermiso } = usePermiso();

  const [modalCrear, setModalCrear] = useState(false);
  const [permisoAEditar, setPermisoAEditar] = useState(null);

  const puedeCrear = tienePermiso('crear');
  const puedeEditar = tienePermiso('editar');
  const puedeEliminar = tienePermiso('eliminar');
  const puedeCambiarEstado = tienePermiso('cambiar estado');

  const handleToggleActive = (permiso) => {
    const accion = permiso.is_active ? 'desactivar' : 'activar';
    if (window.confirm(`¿Estás seguro de ${accion} el permiso "${permiso.nombre}"?`)) {
      toggleActivo.mutate(permiso.id);
    }
  };

  const handleEliminar = (permiso) => {
    if (window.confirm(`¿Eliminar el permiso "${permiso.nombre}"? Esta acción no se puede deshacer.`)) {
      eliminarPermiso.mutate(permiso.id);
    }
  };

  if (permisos.isLoading) return <Loading />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-6 h-6" />
            Permisos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {permisos.data?.length || 0} permisos registrados
          </p>
        </div>
        <CreateButton
          onClick={() => setModalCrear(true)}
          disabled={!puedeCrear}
        >
          Nuevo Permiso
        </CreateButton>
      </div>

      {/* Tabla */}
      <PermisosTable
        permisos={permisos.data || []}
        onToggleActive={handleToggleActive}
        onEditar={(permiso) => setPermisoAEditar(permiso)}
        onEliminar={handleEliminar}
        puedeEditar={puedeEditar}
        puedeEliminar={puedeEliminar}
        puedeCambiarEstado={puedeCambiarEstado}
      />

      {/* Modales */}
      {modalCrear && <CrearPermisoModal onClose={() => setModalCrear(false)} />}
      {permisoAEditar && (
        <EditarPermisoModal
          permiso={permisoAEditar}
          onClose={() => setPermisoAEditar(null)}
        />
      )}
    </div>
  );
};