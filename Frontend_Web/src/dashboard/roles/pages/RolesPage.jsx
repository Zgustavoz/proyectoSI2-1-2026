import { useState } from 'react';
import { useRol } from '../../../hooks/useRol';
import { useAuth } from '../../../auth/context/AuthContext';
import { RolesTable } from '../components/RolesTable';
import { CrearRolModal } from '../components/CrearRolModal';
import { EditarRolModal } from '../components/EditarRolModal';
import { Loading } from '../../../components/Loading';
import { Shield } from 'lucide-react';
import { CreateButton } from '../../../components/ui/buttons/index'

export const RolesPage = () => {
  const { tienePermiso } = useAuth();
  const { roles, toggleActivo, eliminarRol } = useRol();

  const [modalCrear, setModalCrear] = useState(false);
  const [rolAEditar, setRolAEditar] = useState(null);

  const puedeCrear = tienePermiso('crear');
  const puedeEditar = tienePermiso('editar');
  const puedeEliminar = tienePermiso('eliminar');
  const puedeCambiarEstado = tienePermiso('cambiar estado');

  const handleToggleActive = (rol) => {
    const accion = rol.is_active ? 'desactivar' : 'activar';
    if (window.confirm(`¿Estás seguro de ${accion} el rol "${rol.nombre}"?`)) {
      toggleActivo.mutate(rol.id);
    }
  };

  const handleEliminar = (rol) => {
    if (window.confirm(`¿Eliminar el rol "${rol.nombre}"? Esta acción no se puede deshacer.`)) {
      eliminarRol.mutate(rol.id);
    }
  };

  if (roles.isLoading) return <Loading />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Roles
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {roles.data?.length || 0} roles registrados
          </p>
        </div>
          <CreateButton
            onClick={() => setModalCrear(true)}
            disabled={!puedeCrear}
          >
            Nuevo Rol
          </CreateButton>
      </div>

      {/* Tabla */}
      <RolesTable
        roles={roles.data || []}
        onToggleActive={handleToggleActive}
        onEditar={(rol) => setRolAEditar(rol)}
        onEliminar={handleEliminar}
        puedeEditar={puedeEditar}
        puedeEliminar={puedeEliminar}
        puedeCambiarEstado={puedeCambiarEstado}
      />

      {/* Modales */}
      {modalCrear && <CrearRolModal onClose={() => setModalCrear(false)} />}
      {rolAEditar && (
        <EditarRolModal
          rol={rolAEditar}
          onClose={() => setRolAEditar(null)}
        />
      )}
    </div>
  );
};