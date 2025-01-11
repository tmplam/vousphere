import 'package:vousphere/data/models/Brand.dart';

class Event {
  String id;
  String name;
  String description;
  String image;
  String status;
  DateTime startTime;
  DateTime endTime;
  Brand brand;
  List<Map<String, dynamic>> voucherTypes;
  int totalVouchers;
  int totalPublishedVouchers;
  List<Map<String, dynamic>> games;

  Event({
    required this.id,
    required this.name,
    required this.description,
    required this.image,
    required this.status,
    required this.startTime,
    required this.endTime,
    required this.brand,
    required this.voucherTypes,
    required this.totalVouchers,
    required this.totalPublishedVouchers,
    required this.games,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      image: json['image'] ?? '',
      status: json['status'] ?? '',
      startTime:
          DateTime.parse(json['startTime'] ?? DateTime.now().toIso8601String()),
      endTime:
          DateTime.parse(json['endTime'] ?? DateTime.now().toIso8601String()),
      brand: Brand.fromJson(json['brand'] ?? {}),
      voucherTypes: List<Map<String, dynamic>>.from(
          json['voucherTypes']?.map((item) => item as Map<String, dynamic>) ??
              []), 
      totalVouchers: json['totalVouchers'] ?? 0,
      totalPublishedVouchers: json['totalPublishedVouchers'] ?? 0,
      games: List<Map<String, dynamic>>.from(
          json['games']?.map((item) => item as Map<String, dynamic>) ?? []),
    );
  }
}
