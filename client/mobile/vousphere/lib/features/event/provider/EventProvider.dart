import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/Event.dart';

class EventProvider with ChangeNotifier {
  EventProvider({required this.keyword});
  String keyword;

  List<Event> events = [];
  bool isLoading = false;
  int page = 1;
  int totalPage = 1;
  int totalEvents = 0;
  ApiService apiService = ApiService();

  void setLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }

  void clearListEvent() {
    events.clear();
    page = 1;
    totalPage = 1;
    totalEvents = 0;
    notifyListeners();
  }

  void setKeyword(String value) {
    this.keyword = value;
    setLoading(true);
    clearListEvent();
    loadEvent();
  }

  Future<void> loadEvent() async {
    // await Future.delayed(Duration(seconds: 3));
    try {
      final response = await apiService.dio.get(ApiConstants.getEvents,
          queryParameters: {
            "page": page,
            "perPage": 50,
            "keyword": keyword,
          },
          options: Options(extra: {
            "requireToken": true,
          }));
      if (response.statusCode == 200) {
        page = response.data["data"]["page"];
        totalPage = response.data["data"]["totalPage"];
        totalEvents = response.data["data"]["total"];
        events.addAll(List<Event>.from(
            response.data["data"]["data"].map((item) => Event.fromJson(item))));
        setLoading(false);
        notifyListeners();
      }
    } catch (e) {
      print("Error when load event");
      print(e);
    }
  }
}
