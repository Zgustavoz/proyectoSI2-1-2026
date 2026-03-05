import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RestablecerPasswordPage = () => {
  const { uid, token } = useParams();
  const { restablecer } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [form, setForm] = useState({ password: '', password2: '' });
  const [errors, setErrors] = useState({});
  const [exito, setExito] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (form.password.length < 8) errs.password = 'Mínimo 8 caracteres';
    if (form.password !== form.password2) errs.password2 = 'Las contraseñas no coinciden';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    restablecer.mutate({ uid, token, password: form.password }, {
      onSuccess: () => setExito(true)
    });
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-1">Nueva contraseña</h1>
          <p className="text-gray-500 text-sm">Ingresa tu nueva contraseña</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          {exito ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-black">¡Contraseña actualizada!</h2>
              <p className="text-gray-500 text-sm">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <Link to="/login"
                className="block w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium text-center">
                Ir al login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-black mb-2">Nueva contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className={`w-full border rounded-lg pl-10 pr-11 py-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black transition ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword2 ? "text" : "password"}
                    name="password2"
                    value={form.password2}
                    onChange={handleChange}
                    placeholder="Repite tu contraseña"
                    className={`w-full border rounded-lg pl-10 pr-11 py-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black transition ${errors.password2 ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  <button type="button" onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition">
                    {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password2 && <p className="text-red-500 text-xs mt-1">{errors.password2}</p>}
              </div>

              <button
                type="submit"
                disabled={restablecer.isPending}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50"
              >
                {restablecer.isPending ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestablecerPasswordPage;