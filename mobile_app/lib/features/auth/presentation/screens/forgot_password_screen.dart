import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/auth_provider.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});
  @override
  ConsumerState<ForgotPasswordScreen> createState() =>
      _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _formKey   = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  bool _sent       = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    final ok = await ref
        .read(authProvider.notifier)
        .passwordReset(_emailCtrl.text.trim());
    if (!mounted) return;
    // El backend siempre devuelve 200 aunque el email no exista (seguridad)
    if (ok) setState(() => _sent = true);
  }

  @override
  Widget build(BuildContext ctx) {
    final isLoading = ref.watch(authProvider).status == AuthStatus.loading;

    return Scaffold(
      appBar: AppBar(title: const Text('Recuperar contraseña')),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
        child: _sent
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.mark_email_read_outlined,
                      size: 80, color: Colors.green),
                  const SizedBox(height: 20),
                  Text('¡Revisa tu correo!',
                      style: Theme.of(ctx).textTheme.headlineSmall,
                      textAlign: TextAlign.center),
                  const SizedBox(height: 12),
                  Text(
                    'Si ${_emailCtrl.text} está registrado, recibirás un enlace para restablecer tu contraseña.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  OutlinedButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text('Volver al inicio de sesión'),
                  ),
                ],
              )
            : Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.',
                    ),
                    const SizedBox(height: 24),
                    TextFormField(
                      controller: _emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        labelText: 'Correo electrónico',
                        prefixIcon: Icon(Icons.email_outlined),
                        border: OutlineInputBorder(),
                      ),
                      validator: (v) =>
                          v!.contains('@') ? null : 'Email inválido',
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: isLoading ? null : _submit,
                      style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14)),
                      child: isLoading
                          ? const SizedBox(
                              height: 20, width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Text('Enviar enlace'),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}