import { Users, Shield, Key, TrendingUp } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { useUsuario } from '../../hooks/useUsuario';
import { useRol } from '../../hooks/useRol';
import { usePermiso } from '../../hooks/usePermiso';

export const DashboardHome = () => {
  const { user } = useAuth();
  const { usuarios } = useUsuario();
  const { roles } = useRol();
  const { permisos } = usePermiso();

  const stats = [
    {
      title: 'Usuarios',
      value: usuarios.data?.length || 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Roles',
      value: roles.data?.length || 0,
      icon: Shield,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Permisos',
      value: permisos.data?.length || 0,
      icon: Key,
      color: 'bg-green-50 text-green-600',
    },
  ];

  return (
    <div className="p-6">
      {/* Bienvenida */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {user?.first_name || user?.username} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Aquí tienes un resumen del sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};