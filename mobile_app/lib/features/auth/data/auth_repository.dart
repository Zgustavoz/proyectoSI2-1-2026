//mobile_app/lib/features/auth/data/auth_repository.dart
import 'auth_datasource.dart';
import '../domain/usuario_model.dart';
import 'google_auth_datasource.dart';

class AuthRepository {
  final _ds = AuthDatasource();

  Future<void> login(String username, String password) =>
      _ds.login(username, password);

  Future<void> registro({
    required String username,
    required String email,
    required String password,
    required String password2,
    required String firstName,
    required String lastName,
    String telefono = '',
  }) => _ds.registro(
        username:  username,
        email:     email,
        password:  password,
        password2: password2,
        firstName: firstName,
        lastName:  lastName,
        telefono:  telefono,
      );

  Future<UsuarioModel> getPerfil() => _ds.getPerfil();

  Future<void> passwordReset(String email) => _ds.passwordReset(email);
  Future<void> loginWithGoogle() => GoogleAuthDatasource().loginWithGoogle();
  Future<void> logout() => _ds.logout();
}