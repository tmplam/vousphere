import 'package:vousphere/data/models/Brand.dart';

class Counterpart {
  final String id;
  final String name;
  final String email;
  final String phoneNumber;
  final String role;
  final String status;
  final String? imageId;
  final String? image;
  final Brand? brand;

  Counterpart({
    required this.id,
    required this.name,
    required this.email,
    required this.phoneNumber,
    required this.role,
    required this.status,
    this.imageId,
    this.image,
    this.brand,
  });

  factory Counterpart.fromJson(Map<String, dynamic> json) {
    return Counterpart(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phoneNumber: json['phoneNumber'] as String,
      role: json['role'] as String,
      status: json['status'] as String,
      imageId: json['imageId'],
      image: json['image'],
      brand: json['brand'] != null ? Brand.fromJson(json['brand']) : null
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phoneNumber': phoneNumber,
      'role': role,
      'status': status,
      'imageId': imageId,
      'image': image,
      'brand': brand,
    };
  }

  @override
  String toString() {
    // TODO: implement toString
    return toJson().toString();
  }
}