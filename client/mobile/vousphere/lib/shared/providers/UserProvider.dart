import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/User.dart';

class UserProvider extends ChangeNotifier {
  final ApiService _apiService;

  UserProvider(this._apiService) {
    setIsAuthenticated(_apiService.token != null);
    if (_apiService.token != null) {
      getUser();
    }
  }

  bool isAuthenticated = false;
  User user = User('id', 'name', 'email', 'phone', 'status', 'role', 'image', 'imageId', {});


  void setIsAuthenticated(bool value) {
    this.isAuthenticated = value;
  }

  Future<void> getUser() async {
    await _apiService.loadTokens();
    try {
      // call api to get info of authenticated user
      final response = await _apiService.dio.get(
          ApiConstants.getProfile,
          options: Options(
            extra: {'requireToken': true},
          )
      );

      if (response.statusCode == 200) {
        user = User.fromJson(response.data['data']);
        print(user);
      }

      // await Future.delayed(const Duration(milliseconds: 200));
      // user = User('id', 'vhkhai', 'Vuong Huynh Khai', '01919239459', 'khai@gmail.com', 'active', 'user');
      notifyListeners();
    } catch (e) {
      if (e is DioException) {
        if (e.response != null) {
          print("Status code: ${e.response?.statusCode}");
          print("Response data: ${e.response?.data}");
        } else {
          print("Error message: ${e.message}");
        }
      }
      else {
        print(e);
      }
    }
  }

  Future<void> logout() async {
    const storage = FlutterSecureStorage();
    await storage.deleteAll();
    isAuthenticated = false;
    notifyListeners();
  }
}