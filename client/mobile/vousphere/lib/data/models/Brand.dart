class Brand {
  String brandId;
  String name;
  double? latitude;
  double? longitude;
  String address;
  String domain;

  Brand({
    required this.brandId,
    required this.name,
    this.latitude,
    this.longitude,
    required this.address,
    required this.domain,
  });

  factory Brand.fromJson(Map<String, dynamic> json) {
    return Brand(
      brandId: json['brandId'] ?? '',
      name: json['name'] ?? '',
      latitude: json['latitude'] != null
          ? (json['latitude'] as num).toDouble()
          : null,
      longitude: json['longitude'] != null
          ? (json['longitude'] as num).toDouble()
          : null,
      address: json['address'] ?? '',
      domain: json['domain'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'brandId': brandId,
      'name': name,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'domain': domain,
    };
  }

  @override
  String toString() {
    return toJson().toString();
  }
}
