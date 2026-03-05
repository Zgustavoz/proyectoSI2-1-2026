import  { BackButton } from '../../components/ui/buttons/index';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md px-4">
        <h1 className="text-8xl font-bold text-black mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Página no encontrada</h2>
        <p className="text-gray-500 mb-6 text-sm">
          La página que buscas no existe o fue movida.
        </p>
        <BackButton className="inline-block bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition" />
      </div>
    </div>
  );
}

export default NotFound;