class Voucher {
  final String id;
  final String ownerId;
  final String brandId;
  final String eventId;
  final String gameId;
  final int discount;
  final String code;
  final String status;
  final DateTime issuedAt;
  final DateTime expiredAt;
  final DateTime? redeemedAt;

  Voucher({
    required this.id,
    required this.ownerId,
    required this.brandId,
    required this.eventId,
    required this.gameId,
    required this.discount,
    required this.code,
    required this.status,
    required this.issuedAt,
    required this.expiredAt,
    this.redeemedAt,
  });

  // Factory constructor to create a Voucher from JSON
  factory Voucher.fromJson(Map<String, dynamic> json) {
    return Voucher(
      id: json['id'],
      ownerId: json['ownerId'],
      brandId: json['brandId'],
      eventId: json['eventId'],
      gameId: json['gameId'],
      discount: json['discount'],
      code: json['code'],
      status: json['status'],
      issuedAt: DateTime.parse(json['issuedAt']),
      expiredAt: DateTime.parse(json['expiredAt']),
      redeemedAt: json['redeemedAt'] != null ? DateTime.parse(json['redeemedAt']) : null,
    );
  }

  // Method to convert a Voucher to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ownerId': ownerId,
      'brandId': brandId,
      'eventId': eventId,
      'gameId': gameId,
      'discount': discount,
      'code': code,
      'status': status,
      'issuedAt': issuedAt.toIso8601String(),
      'expiredAt': expiredAt.toIso8601String(),
      'redeemedAt': redeemedAt?.toIso8601String(),
    };
  }

  @override
  String toString() {
    // TODO: implement toString
    return toJson().toString();
  }
}
