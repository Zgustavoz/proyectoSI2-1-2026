import 'package:google_sign_in/google_sign_in.dart';
import 'package:dio/dio.dart';
import '../../../core/constants/constants.dart';
import '../../../core/network/cookie_client.dart';

class GoogleAuthDatasource {
  final _googleSignIn = GoogleSignIn(
    serverClientId: AppConstants.googleClientIdWeb, // ← web client ID
    scopes: ['email', 'profile'],
  );

  Future<void> loginWithGoogle() async {
    final account = await _googleSignIn.signIn();
    if (account == null) throw Exception('Login cancelado');

    final auth = await account.authentication;
    final accessToken = auth.accessToken;
    if (accessToken == null) throw Exception('No se pudo obtener el token de Google');

    final dio = await CookieClient.getInstance();
    try {
      await dio.post(
        '/usuarios/auth/google/',
        data: {'token': accessToken},
      );
    } on DioException catch (e) {
      final data = e.response?.data;
      if (data is Map) {
        throw Exception(data['error'] ?? data.values.first);
      }
      throw Exception('Error al iniciar sesión con Google');
    }
  }

  Future<void> signOut() async {
    await _googleSignIn.signOut();
  }
}