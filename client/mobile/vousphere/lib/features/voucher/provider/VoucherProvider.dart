import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/Event.dart';
import 'package:vousphere/data/models/Voucher.dart';

class VoucherProvider with ChangeNotifier {
  List<Event> events = [];
  List<Voucher> vouchers = [];
  bool isLoading = false;
  ApiService apiService = ApiService();

  void setLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }

  Future<void> loadVoucher() async {
    try {
      await loadEvent();
      final response = await apiService.dio.get(
          ApiConstants.getVouchers,
          queryParameters: {
            "page": 1,
            "perPage": 50,
          },
          options: Options(
              extra: {
                "requireToken": true,
              }
          )
      );
      if(response.statusCode == 200) {
        vouchers.clear();
        vouchers.addAll(
            List<Voucher>.from(
                response.data["data"]["data"].map((item) => Voucher.fromJson(item))
            )
        );
        notifyListeners();
      }
    }
    catch(e) {
      print("Error when load vouchers");
      print(e);
    }
  }

  Future<void> loadEvent() async {
    try {
      final response = await apiService.dio.get(
          ApiConstants.getEvents,
          queryParameters: {
            "page": 1,
            "perPage": 50,
            "keyword": '',
          },
          options: Options(
              extra: {
                "requireToken": true,
              }
          )
      );
      if(response.statusCode == 200) {
        events.clear();
        events.addAll(
            List<Event>.from(
                response.data["data"]["data"].map((item) => Event.fromJson(item))
            )
        );
      }
    }
    catch(e) {
      print("Error when load events");
      print(e);
    }
  }


  Event? getEventById(String id) {
    for(Event event in events) {
      if(event.id == id) {
        return event;
      }
    }
    return null;
  }

  String keyword = '';

  String category = 'All';

  void handleSearch(String value) {
      print('voucher search: $value');
      keyword = value;
      notifyListeners();
  }

  void handleFilter(String value) {
    print('filter voucher: $value');
    category = value;
    notifyListeners();
  }

}