class Brand {
  String brandId;
  String name;
  double latitude;
  double longitude;
  String address;
  String domain;

  Brand({
    required this.brandId,
    required this.name,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.domain,
  });

  factory Brand.fromJson(Map<String, dynamic> json) {
    return Brand(
      brandId: json['brandId'] as String,
      name: json['name'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      address: json['address'] as String,
      domain: json['domain'] as String,
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
