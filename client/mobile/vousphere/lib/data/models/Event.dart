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
  dynamic totalVouchers;
  dynamic totalPublishedVouchers;
  List<Map<String, dynamic>> games;
  Map<String, dynamic>? item;
  bool isFavorite;

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
    required this.item,
    required this.isFavorite,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      image: json['image'] as String,
      status: json['status'] as String,
      startTime: DateTime.parse(json['startTime']),
      endTime: DateTime.parse(json['endTime']),
      brand: Brand.fromJson(json['brand'] as Map<String, dynamic>),
      voucherTypes: json['voucherTypes'] != null ? List<Map<String, dynamic>>.from(json['voucherTypes']) : [],
      totalVouchers: json['totalVouchers'],
      totalPublishedVouchers: json['totalPublishedVouchers'],
      games: json['games'] != null ? List<Map<String, dynamic>>.from(json['games']) : [],
      item: json['item'],
      isFavorite: true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'image': image,
      'status': status,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime.toIso8601String(),
      'brand': brand.toJson(),
      'voucherTypes': voucherTypes,
      'totalVouchers': totalVouchers,
      'totalPublishedVouchers': totalPublishedVouchers,
      'games': games,
      'item': item,
      'isFavorite': isFavorite,
    };
  }

  @override
  String toString() {
    return toJson().toString();
  }
}
