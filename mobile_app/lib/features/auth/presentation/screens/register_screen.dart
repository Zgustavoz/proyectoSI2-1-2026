import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/auth_provider.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});
  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey      = GlobalKey<FormState>();
  final _usernameCtrl = TextEditingController();
  final _emailCtrl    = TextEditingController();
  final _firstCtrl    = TextEditingController();
  final _lastCtrl     = TextEditingController();
  final _teleCtrl     = TextEditingController();
  final _passCtrl     = TextEditingController();
  final _pass2Ctrl    = TextEditingController();
  bool _obscure       = true;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final ok = await ref.read(authProvider.notifier).registro(
      username:  _usernameCtrl.text.trim(),
      email:     _emailCtrl.text.trim(),
      password:  _passCtrl.text,
      password2: _pass2Ctrl.text,
      firstName: _firstCtrl.text.trim(),
      lastName:  _lastCtrl.text.trim(),
      telefono:  _teleCtrl.text.trim(),
    );
    if (!mounted) return;
    if (ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('¡Cuenta creada! Inicia sesión.')),
      );
      Navigator.pushReplacementNamed(context, '/login');
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(ref.read(authProvider).error ?? 'Error al registrarse')),
      );
    }
  }

  Widget _field(TextEditingController ctrl, String label, IconData icon, {
    TextInputType keyboard = TextInputType.text,
    bool required = true,
    String? Function(String?)? validator,
  }) => Padding(
    padding: const EdgeInsets.only(bottom: 14),
    child: TextFormField(
      controller: ctrl,
      keyboardType: keyboard,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: const OutlineInputBorder(),
      ),
      validator: validator ??
          (required
              ? (v) => v!.trim().isNotEmpty ? null : 'Campo requerido'
              : null),
    ),
  );

  @override
  Widget build(BuildContext ctx) {
    final isLoading = ref.watch(authProvider).status == AuthStatus.loading;

    return Scaffold(
      appBar: AppBar(title: const Text('Crear cuenta')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _field(_firstCtrl, 'Nombre', Icons.badge_outlined),
              _field(_lastCtrl, 'Apellido', Icons.badge_outlined),
              _field(_usernameCtrl, 'Nombre de usuario', Icons.alternate_email),
              _field(_emailCtrl, 'Correo electrónico', Icons.email_outlined,
                keyboard: TextInputType.emailAddress,
                validator: (v) => v!.contains('@') ? null : 'Email inválido'),
              _field(_teleCtrl, 'Teléfono (opcional)', Icons.phone_outlined,
                keyboard: TextInputType.phone, required: false),
              // Contraseña
              Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: TextFormField(
                  controller: _passCtrl,
                  obscureText: _obscure,
                  decoration: InputDecoration(
                    labelText: 'Contraseña',
                    prefixIcon: const Icon(Icons.lock_outline),
                    border: const OutlineInputBorder(),
                    suffixIcon: IconButton(
                      icon: Icon(_obscure
                          ? Icons.visibility_outlined
                          : Icons.visibility_off_outlined),
                      onPressed: () => setState(() => _obscure = !_obscure),
                    ),
                  ),
                  validator: (v) => v!.length >= 8 ? null : 'Mínimo 8 caracteres',
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(bottom: 20),
                child: TextFormField(
                  controller: _pass2Ctrl,
                  obscureText: _obscure,
                  decoration: const InputDecoration(
                    labelText: 'Confirmar contraseña',
                    prefixIcon: Icon(Icons.lock_outline),
                    border: OutlineInputBorder(),
                  ),
                  validator: (v) =>
                      v == _passCtrl.text ? null : 'Las contraseñas no coinciden',
                ),
              ),
              ElevatedButton(
                onPressed: isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14)),
                child: isLoading
                    ? const SizedBox(
                        height: 20, width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Text('Registrarse'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}