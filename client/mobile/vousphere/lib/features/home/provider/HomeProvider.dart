import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/Event.dart';

class HomeProvider with ChangeNotifier {
  List<Event> events = [];
  bool isLoading = false;
  ApiService apiService = ApiService();

  void setLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }
  void clearListKnowledge() {
    events.clear();
    notifyListeners();
  }

  Future<void> loadEvent() async {
    try {
      final response = await apiService.dio.get(
          ApiConstants.getEvents,
          queryParameters: {
            "page": 1,
            "perPage": 10,
            "keyword": '',
          },
          options: Options(
              extra: {
                "requireToken": true,
              }
          )
      );
      if(response.statusCode == 200) {
        events.addAll(
            List<Event>.from(
                response.data["data"]["data"].map((item) => Event.fromJson(item))
            )
        );

        notifyListeners();
      }
    }
    catch(e) {
      print("Error when load events");
      print(e);
    }

  }
}