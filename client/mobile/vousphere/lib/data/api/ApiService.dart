import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

class ApiService {
  final Dio _dio = Dio();
  static const _storage = FlutterSecureStorage();

  String? _accessToken;
  // String? _refreshToken;

  String? get token => _accessToken;
  Dio get dio => _dio;

  Future<void> init() async {
    await loadTokens();
  }

  ApiService() {
    _dio.options.baseUrl = ApiConstants.baseUrl;
    _dio.options.connectTimeout = const Duration(seconds: 60);
    _dio.options.receiveTimeout = const Duration(seconds: 60);

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final requireToken = options.extra['requireToken'] ?? false;

        if (requireToken) {
          // if (_accessToken == null || await isTokenExpired()) {
          //   await refreshAccessToken();
          // }
          options.headers['Authorization'] = 'Bearer $_accessToken';
        }
        return handler.next(options);
      },
      onResponse: (response, handler) {
        return handler.next(response);
      },
      onError: (DioException e, handler) {
        return handler.next(e);
      },
    ));

    loadTokens();
  }

  Future<void> loadTokens() async {
    _accessToken = await _storage.read(key: 'accessToken');
    // _refreshToken = await _storage.read(key: 'refreshToken');
  }

  Future<void> saveTokens(String accessToken) async {
    await _storage.write(key: 'accessToken', value: accessToken);
    // await _storage.write(key: 'refreshToken', value: refreshToken);
  }

  // Future<bool> isTokenExpired() async {
  //   if (_accessToken == null) return true;
  //   try {
  //     final parts = _accessToken!.split('.');
  //     if (parts.length != 3) throw Exception('Invalid token format');
  //
  //     final payload = json.decode(
  //       utf8.decode(base64Url.decode(base64Url.normalize(parts[1]))),
  //     );
  //     final exp = payload['exp'] as int;
  //     final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
  //     return exp - now <= 20;
  //   } catch (e) {
  //     return true;
  //   }
  // }

  // Future<void> refreshAccessToken() async {
  //   await loadTokens();
  //   try {
  //     final response = await _dio.get(
  //       ApiConstants.refreshToken,
  //       queryParameters: {
  //         'refreshToken': _refreshToken,
  //       },
  //     );
  //
  //     if (response.statusCode == 200) {
  //       final newAccessToken = response.data['token']['accessToken'];
  //       _accessToken = newAccessToken;
  //       await saveTokens(newAccessToken, _refreshToken!);
  //     } else {
  //       throw Exception('Failed to refresh token');
  //     }
  //   } catch (e) {
  //     throw Exception('Error refreshing token: $e');
  //   }
  // }
}
