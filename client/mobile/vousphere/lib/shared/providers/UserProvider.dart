import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/Event.dart';
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
  List<Event> favoriteEvents = [];


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
      await getFavoriteEvents();
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


  Future<void> getFavoriteEvents() async {
    try {
      // call api to get list favorite
      favoriteEvents.clear();
      final response = await _apiService.dio.get(
          ApiConstants.getFavorite,
          options: Options(
            extra: {'requireToken': true},
          )
      );

      if (response.statusCode == 200) {
        favoriteEvents.addAll(
            List<Event>.from(
                response.data["data"]["data"].map((item) => Event.fromJson(item))
            )
        );
      }
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


  bool isFavorite(String id) {
    for(Event event in favoriteEvents) {
      if(event.id == id) {
        return true;
      }
    }
    return false;
  }


  Future<void> addToFavorite(String id) async {
    try {
      final response = await _apiService.dio.post(
          ApiConstants.addToFavorite,
          data: {
            "eventId": id,
          },
          options: Options(
            extra: {'requireToken': true},
          )
      );

      await getFavoriteEvents();
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

  Future<void> removeFromFavorite(String id) async {
    try {
      final response = await _apiService.dio.delete(
          ApiConstants.removeFromFavorite.replaceFirst(":eventId", id),
          options: Options(
            extra: {'requireToken': true},
          )
      );

      await getFavoriteEvents();
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

}