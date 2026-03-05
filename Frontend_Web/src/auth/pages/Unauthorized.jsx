import { ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '../../components/ui/buttons/index';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-6xl font-bold text-black mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Acceso denegado</h2>
        <p className="text-gray-500 mb-6 text-sm">
          No tienes permisos para acceder a esta sección.
          Contacta al administrador si crees que es un error.
        </p>
        <BackButton onClick={() => navigate(-1)} className="inline-block bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition" />
      </div>
    </div>
  );
}

export default Unauthorized;