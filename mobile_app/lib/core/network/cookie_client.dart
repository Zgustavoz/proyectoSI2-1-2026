import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:path_provider/path_provider.dart';
import '../constants/constants.dart';

class CookieClient {
  static Dio? _dio;
  static PersistCookieJar? _cookieJar;

  static Future<Dio> getInstance() async {
    if (_dio != null) return _dio!;

    final dir = await getApplicationDocumentsDirectory();
    _cookieJar = PersistCookieJar(
      ignoreExpires: false,
      storage: FileStorage('${dir.path}/.cookies/'),
    );

    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl,   // ← clave para que las cookies se asocien bien
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
    ));

    _dio!.interceptors.add(CookieManager(_cookieJar!));

    _dio!.interceptors.add(InterceptorsWrapper(
      onError: (err, handler) async {
        final path = err.requestOptions.path;
        final isRefresh = path.contains('/token/refresh/');
        final isLogin   = path.contains('/token/');

        if (err.response?.statusCode == 401 && !isRefresh && !isLogin) {
          final refreshed = await _tryRefresh();
          if (refreshed) {
            try {
              final opts = err.requestOptions;
              final retryRes = await _dio!.request(
                opts.path,
                options: Options(method: opts.method, headers: opts.headers),
                data: opts.data,
              );
              return handler.resolve(retryRes);
            } catch (e) {
              return handler.next(err);
            }
          }
        }
        return handler.next(err);
      },
    ));

    return _dio!;
  }

  static Future<bool> _tryRefresh() async {
    try {
      final dir = await getApplicationDocumentsDirectory();
      final jar = PersistCookieJar(
        storage: FileStorage('${dir.path}/.cookies/'),
      );
      final refreshDio = Dio(BaseOptions(baseUrl: AppConstants.baseUrl));
      refreshDio.interceptors.add(CookieManager(jar));
      await refreshDio.post('/usuarios/token/refresh/');
      return true;
    } catch (_) {
      return false;
    }
  }

  static Future<void> clearCookies() async {
    await _cookieJar?.deleteAll();
  }
}