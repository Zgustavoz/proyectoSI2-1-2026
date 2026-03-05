import { Eye, EyeOff, Lock, User, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RegistroPage = () => {
  const { registro } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    password: '',
    password2: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const validar = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Requerido';
    if (!form.email.trim()) errs.email = 'Requerido';
    if (!form.first_name.trim()) errs.first_name = 'Requerido';
    if (!form.last_name.trim()) errs.last_name = 'Requerido';
    if (!form.password) errs.password = 'Requerido';
    if (form.password.length < 8) errs.password = 'Mínimo 8 caracteres';
    if (form.password !== form.password2) errs.password2 = 'Las contraseñas no coinciden';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    registro.mutate(form);
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* Cabecera */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black mb-1">Crear cuenta</h1>
          <p className="text-gray-500 text-sm">Completa el formulario para registrarte</p>
        </div>

        {/* Formulario */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nombres */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Nombre</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Juan"
                  className={`w-full border rounded-lg pl-3 pr-4 py-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black transition ${errors.first_name ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Apellido</label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Pérez"
                  className={`w-full border rounded-lg pl-3 pr-4 py-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black transition ${errors.last_name ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
              </div>
            </div>

            {/* Usuario */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Usuario</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="juanperez"
                className={`w-full border rounded-lg pl-3 pr-4 py-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black transition ${errors.username ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="juan@email.com"
                className={`w-full border rounded-lg pl-3 pr-4 py-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black transition ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="+591 70000000"
                className={`w-full border rounded-lg pl-3 pr-4 py-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-black transition ${errors.telefono ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Contraseña</label>
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

            {/* Confirmar contraseña */}
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

            {/* Botón */}
            <button
              type="submit"
              disabled={registro.isPending}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50 mt-2"
            >
              {registro.isPending ? 'Registrando...' : 'Crear cuenta'}
            </button>

            <p className="text-center text-gray-500 text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-black font-medium hover:underline">Inicia sesión</Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistroPage;