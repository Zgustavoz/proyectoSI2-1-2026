import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConstants {
  static String get baseUrl =>
      dotenv.env['API_URL_BACKEND'] ?? 'http://localhost:8000';

  static String get googleClientIdWeb =>
      dotenv.env['GOOGLE_CLIENT_ID_WEB'] ?? '';

  static String get googleClientIdAndroid =>
      dotenv.env['GOOGLE_CLIENT_ID_ANDROID'] ?? '';

  static String get loginUrl       => '$baseUrl/usuarios/token/';
  static String get refreshUrl     => '$baseUrl/usuarios/token/refresh/';
  static String get logoutUrl      => '$baseUrl/usuarios/logout/';
  static String get registroUrl    => '$baseUrl/usuarios/registro/';
  static String get perfilUrl      => '$baseUrl/usuarios/perfil/';
  static String get passResetUrl   => '$baseUrl/usuarios/password-reset/';
  static String get googleLoginUrl => '$baseUrl/usuarios/auth/google/';
}