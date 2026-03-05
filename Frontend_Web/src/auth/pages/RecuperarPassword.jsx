import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RecuperarPasswordPage = () => {
  const { recuperarPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    recuperarPassword.mutate({ email }, {
      onSuccess: () => setEnviado(true)
    });
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-1">Recuperar contraseña</h1>
          <p className="text-gray-500 text-sm">Te enviaremos un enlace a tu email</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          {enviado ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-black">Email enviado</h2>
              <p className="text-gray-500 text-sm">
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <Link to="/login"
                className="block w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium text-center mt-4">
                Volver al login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={recuperarPassword.isPending}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50"
              >
                {recuperarPassword.isPending ? 'Enviando...' : 'Enviar enlace'}
              </button>

              <Link to="/login"
                className="flex items-center justify-center gap-2 text-gray-500 hover:text-black transition text-sm">
                <ArrowLeft size={16} />
                Volver al login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecuperarPasswordPage;