import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import './features/auth/domain/auth_provider.dart';
import './features/auth/presentation/screens/login_screen.dart';
import 'features/auth/presentation/screens/register_screen.dart';
import 'features/auth/presentation/screens/forgot_password_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mi App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const AuthGate(),
      routes: {
        '/login':           (_) => const LoginScreen(),
        '/registro':        (_) => const RegisterScreen(),
        '/forgot-password': (_) => const ForgotPasswordScreen(),
      },
    );
  }
}

class AuthGate extends ConsumerWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final status = ref.watch(authProvider).status;

    switch (status) {
      case AuthStatus.initial:
      case AuthStatus.loading:
        return const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        );
      case AuthStatus.authenticated:
        return Scaffold(
          backgroundColor: Colors.white,
          body: SafeArea(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 72, height: 72,
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(Icons.check, color: Colors.white, size: 36),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    '¡Bienvenido, ${ref.watch(authProvider).usuario?.username ?? ''}!',
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text('Login exitoso ✅', style: TextStyle(color: Colors.grey)),
                  const SizedBox(height: 40),
                  SizedBox(
                    width: 200,
                    height: 48,
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.logout, color: Colors.black),
                      label: const Text('Cerrar sesión',
                          style: TextStyle(color: Colors.black, fontWeight: FontWeight.w600)),
                      onPressed: () => ref.read(authProvider.notifier).logout(),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Colors.black),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      default:
        return const LoginScreen();
    }
  }
}