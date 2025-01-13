import 'package:flutter/material.dart';
import 'package:dio/dio.dart'; // Import thư viện dio
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/PuzzleItem.dart';

class PuzzleProvider with ChangeNotifier {
  List<PuzzleItem> puzzles = [];
  bool isLoading = false;
  final ApiService apiService;

  PuzzleProvider(this.apiService) {
    loadPuzzles();
  }

  void setLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }

  Future<void> loadPuzzles() async {
    if (isLoading) return;
    setLoading(true);

    try {
      final response = await apiService.dio.get(
        "/voucher-service/api/vouchers/item-pieces",
        options: Options(extra: {"requireToken": true}),
      );

      if (response.statusCode == 200 && response.data['isSuccess']) {
        final List<dynamic> eventData = response.data['data'];
        puzzles = eventData.map((item) => PuzzleItem.fromJson(item)).toList();
        notifyListeners();
      }
    } catch (e) {
      print("Error loading puzzles: $e");
    } finally {
      setLoading(false);
    }
  }
}
