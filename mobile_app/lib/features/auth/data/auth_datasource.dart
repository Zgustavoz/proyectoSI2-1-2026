import 'package:dio/dio.dart';
import '../../../core/network/cookie_client.dart';
import '../domain/usuario_model.dart';

class AuthDatasource {
  Future<void> login(String username, String password) async {
    final dio = await CookieClient.getInstance();
    try {
      await dio.post(
        '/usuarios/token/',
        data: {'username': username, 'password': password},
      );
    } on DioException catch (e) {
      _handleError(e);
    }
  }

  Future<void> registro({
    required String username,
    required String email,
    required String password,
    required String password2,
    required String firstName,
    required String lastName,
    String telefono = '',
  }) async {
    final dio = await CookieClient.getInstance();
    try {
      await dio.post(
        '/usuarios/registro/',
        data: {
          'username':   username,
          'email':      email,
          'password':   password,
          'password2':  password2,
          'first_name': firstName,
          'last_name':  lastName,
          'telefono':   telefono,
        },
      );
    } on DioException catch (e) {
      _handleError(e);
    }
  }

  Future<UsuarioModel> getPerfil() async {
    final dio = await CookieClient.getInstance();
    try {
      final res = await dio.get('/usuarios/perfil/');
      return UsuarioModel.fromJson(res.data);
    } on DioException catch (e) {
      _handleError(e);
      rethrow;
    }
  }

  Future<void> passwordReset(String email) async {
    final dio = await CookieClient.getInstance();
    try {
      await dio.post(
        '/usuarios/password-reset/',
        data: {'email': email},
      );
    } on DioException catch (e) {
      _handleError(e);
    }
  }

  Future<void> logout() async {
    final dio = await CookieClient.getInstance();
    try {
      await dio.post('/usuarios/logout/');
    } catch (_) {}
    await CookieClient.clearCookies();
  }

  void _handleError(DioException e) {
    final data = e.response?.data;
    if (data is Map) {
      final msg = data.values.first;
      throw Exception(msg is List ? msg.first : msg.toString());
    }
    throw Exception('Error de conexión. Verifica tu internet.');
  }
}