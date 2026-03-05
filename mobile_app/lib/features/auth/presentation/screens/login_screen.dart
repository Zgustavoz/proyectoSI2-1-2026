import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/auth_provider.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});
  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey      = GlobalKey<FormState>();
  final _usernameCtrl = TextEditingController();
  final _passCtrl     = TextEditingController();
  bool _obscure       = true;

  @override
  void dispose() {
    _usernameCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    await ref.read(authProvider.notifier)
        .login(_usernameCtrl.text.trim(), _passCtrl.text);
    if (!mounted) return;
    final state = ref.read(authProvider);
    if (state.status == AuthStatus.error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(state.error ?? 'Error al iniciar sesión'),
          backgroundColor: Colors.black,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = ref.watch(authProvider).status == AuthStatus.loading;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ── Header ──────────────────────────────────
                Column(
                  children: [
                    Container(
                      width: 52, height: 52,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(Icons.lock, color: Colors.white, size: 24),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Bienvenido',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Inicia sesión en tu cuenta',
                      style: TextStyle(fontSize: 14, color: Colors.grey),
                    ),
                  ],
                ),

                const SizedBox(height: 32),

                // ── Card ────────────────────────────────────
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.04),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(28),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [

                        // ── Usuario ──────────────────────────
                        const Text('Usuario',
                            style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: Colors.black)),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _usernameCtrl,
                          style: const TextStyle(fontSize: 14),
                          decoration: InputDecoration(
                            hintText: 'Ingresa tu usuario',
                            hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
                            prefixIcon: const Icon(Icons.person_outline, size: 18, color: Colors.grey),
                            contentPadding: const EdgeInsets.symmetric(vertical: 14),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: const BorderSide(color: Colors.black, width: 2),
                            ),
                          ),
                          validator: (v) =>
                              v!.trim().isNotEmpty ? null : 'Ingresa tu usuario',
                        ),

                        const SizedBox(height: 18),

                        // ── Contraseña ───────────────────────
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Contraseña',
                                style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.black)),
                            GestureDetector(
                              onTap: () => Navigator.pushNamed(context, '/forgot-password'),
                              child: const Text(
                                '¿Olvidaste tu contraseña?',
                                style: TextStyle(fontSize: 13, color: Colors.grey),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _passCtrl,
                          obscureText: _obscure,
                          style: const TextStyle(fontSize: 14),
                          decoration: InputDecoration(
                            hintText: 'Ingresa tu contraseña',
                            hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
                            prefixIcon: const Icon(Icons.lock_outline, size: 18, color: Colors.grey),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                size: 18,
                                color: Colors.grey,
                              ),
                              onPressed: () => setState(() => _obscure = !_obscure),
                            ),
                            contentPadding: const EdgeInsets.symmetric(vertical: 14),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: const BorderSide(color: Color(0xFFD1D5DB)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: const BorderSide(color: Colors.black, width: 2),
                            ),
                          ),
                          validator: (v) =>
                              v!.isNotEmpty ? null : 'Ingresa tu contraseña',
                        ),

                        const SizedBox(height: 22),

                        // ── Botón submit ─────────────────────
                        SizedBox(
                          height: 48,
                          child: ElevatedButton(
                            onPressed: isLoading ? null : _submit,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.black,
                              foregroundColor: Colors.white,
                              disabledBackgroundColor: Colors.black54,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              elevation: 0,
                            ),
                            child: isLoading
                                ? const SizedBox(
                                    width: 18, height: 18,
                                    child: CircularProgressIndicator(
                                      color: Colors.white, strokeWidth: 2))
                                : const Text(
                                    'Iniciar sesión',
                                    style: TextStyle(
                                        fontWeight: FontWeight.w600, fontSize: 15)),
                          ),
                        ),

                        const SizedBox(height: 20),

                        // ── Divider ──────────────────────────
                        Row(children: [
                          const Expanded(child: Divider(color: Color(0xFFE5E7EB))),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 10),
                            child: Text('O continúa con',
                                style: TextStyle(
                                    fontSize: 12, color: Colors.grey[500])),
                          ),
                          const Expanded(child: Divider(color: Color(0xFFE5E7EB))),
                        ]),

                        const SizedBox(height: 16),

                        // ── Google ───────────────────────────
                        SizedBox(
                          height: 48,
                          child: OutlinedButton.icon(
                            onPressed: isLoading ? null : _loginGoogle,
                            icon: _GoogleIcon(),
                            label: const Text(
                              'Continuar con Google',
                              style: TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.w500,
                                  fontSize: 14),
                            ),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Color(0xFFD1D5DB)),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 20),

                        // ── Registro ─────────────────────────
                        Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                          const Text('¿No tienes cuenta? ',
                              style: TextStyle(fontSize: 13, color: Colors.grey)),
                          GestureDetector(
                            onTap: () => Navigator.pushNamed(context, '/registro'),
                            child: const Text(
                              'Regístrate',
                              style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.black,
                                  fontWeight: FontWeight.w600),
                            ),
                          ),
                        ]),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _loginGoogle() async {
    final ok = await ref.read(authProvider.notifier).loginWithGoogle();
    if (!mounted) return;
    if (!ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(ref.read(authProvider).error ?? 'Error con Google'),
          backgroundColor: Colors.black,
        ),
      );
    }
  }
}

// Ícono SVG de Google dibujado con Canvas
class _GoogleIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 20, height: 20,
      child: CustomPaint(painter: _GooglePainter()),
    );
  }
}

class _GooglePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final s = size.width;
    // G azul
    canvas.drawArc(
      Rect.fromLTWH(0, 0, s, s), -0.3, 4.5, false,
      Paint()..color = const Color(0xFF4285F4)..style = PaintingStyle.stroke..strokeWidth = s * 0.18,
    );
    // rojo
    canvas.drawArc(
      Rect.fromLTWH(0, 0, s, s), 3.14, 1.1, false,
      Paint()..color = const Color(0xFFEA4335)..style = PaintingStyle.stroke..strokeWidth = s * 0.18,
    );
    // amarillo
    canvas.drawArc(
      Rect.fromLTWH(0, 0, s, s), 4.24, 0.85, false,
      Paint()..color = const Color(0xFFFBBC05)..style = PaintingStyle.stroke..strokeWidth = s * 0.18,
    );
    // verde
    canvas.drawArc(
      Rect.fromLTWH(0, 0, s, s), 5.09, 0.7, false,
      Paint()..color = const Color(0xFF34A853)..style = PaintingStyle.stroke..strokeWidth = s * 0.18,
    );
    // barra horizontal del G
    final p = Paint()..color = const Color(0xFF4285F4)..strokeWidth = s * 0.18..strokeCap = StrokeCap.round;
    canvas.drawLine(Offset(s * 0.5, s * 0.5), Offset(s * 0.95, s * 0.5), p);
  }

  @override
  bool shouldRepaint(_) => false;
}