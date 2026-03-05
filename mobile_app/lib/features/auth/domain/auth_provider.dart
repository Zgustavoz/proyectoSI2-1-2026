//mobile_app/lib/features/auth/domain/auth_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/auth_repository.dart';
import 'usuario_model.dart';

final authRepositoryProvider = Provider((_) => AuthRepository());

enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

class AuthState {
  final AuthStatus status;
  final UsuarioModel? usuario;
  final String? error;

  const AuthState({
    this.status = AuthStatus.initial,
    this.usuario,
    this.error,
  });

  AuthState copyWith({AuthStatus? status, UsuarioModel? usuario, String? error}) =>
      AuthState(
        status:  status  ?? this.status,
        usuario: usuario ?? this.usuario,
        error:   error,
      );
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repo;
  AuthNotifier(this._repo) : super(const AuthState()) {
    _checkSession();
  }

  // Al iniciar la app, verifica si hay sesión activa
  Future<void> _checkSession() async {
    try {
      final user = await _repo.getPerfil();
      state = AuthState(status: AuthStatus.authenticated, usuario: user);
    } catch (e) {
      state = AuthState(status: AuthStatus.unauthenticated);
    }
  }

  Future<bool> login(String username, String password) async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      await _repo.login(username, password);
      final user = await _repo.getPerfil();
      state = AuthState(   // ← usamos constructor directo, no copyWith
        status: AuthStatus.authenticated,
        usuario: user,
      );
      return true;
    } catch (e) {
      state = AuthState(
        status: AuthStatus.error,
        error: e.toString().replaceAll('Exception: ', ''),
      );
      return false;
    }
  }

  Future<bool> registro({
    required String username,
    required String email,
    required String password,
    required String password2,
    required String firstName,
    required String lastName,
    String telefono = '',
  }) async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      await _repo.registro(
        username:  username,
        email:     email,
        password:  password,
        password2: password2,
        firstName: firstName,
        lastName:  lastName,
        telefono:  telefono,
      );
      state = state.copyWith(status: AuthStatus.unauthenticated);
      return true;
    } catch (e) {
      state = state.copyWith(status: AuthStatus.error, error: e.toString().replaceAll('Exception: ', ''));
      return false;
    }
  }

  Future<bool> passwordReset(String email) async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      await _repo.passwordReset(email);
      state = state.copyWith(status: AuthStatus.unauthenticated);
      return true;
    } catch (e) {
      state = state.copyWith(status: AuthStatus.error, error: e.toString().replaceAll('Exception: ', ''));
      return false;
    }
  }

  Future<bool> loginWithGoogle() async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      await _repo.loginWithGoogle();
      final user = await _repo.getPerfil();
      state = state.copyWith(status: AuthStatus.authenticated, usuario: user);
      return true;
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.error,
        error: e.toString().replaceAll('Exception: ', ''),
      );
      return false;
    }
  }

  Future<void> logout() async {
    await _repo.logout();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(ref.read(authRepositoryProvider)),
);