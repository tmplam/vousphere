class Piece {
  final String id;
  final String ownerId;
  final String eventId;
  final String brandId;
  final String gameId;
  final int pieceIndex;
  final int count;
  final DateTime issuedAt;

  Piece({
    required this.id,
    required this.ownerId,
    required this.eventId,
    required this.brandId,
    required this.gameId,
    required this.pieceIndex,
    required this.count,
    required this.issuedAt,
  });

  factory Piece.fromJson(Map<String, dynamic> json) {
    return Piece(
      id: json['id'],
      ownerId: json['ownerId'],
      eventId: json['eventId'],
      brandId: json['brandId'],
      gameId: json['gameId'],
      pieceIndex: json['pieceIndex'],
      count: json['count'],
      issuedAt: DateTime.parse(json['issuedAt']),
    );
  }

  Piece copyWith({
    String? id,
    String? ownerId,
    String? eventId,
    String? brandId,
    String? gameId,
    int? pieceIndex,
    int? count,
    DateTime? issuedAt,
  }) {
    return Piece(
      id: id ?? this.id,
      ownerId: ownerId ?? this.ownerId,
      eventId: eventId ?? this.eventId,
      brandId: brandId ?? this.brandId,
      gameId: gameId ?? this.gameId,
      pieceIndex: pieceIndex ?? this.pieceIndex,
      count: count ?? this.count,
      issuedAt: issuedAt ?? this.issuedAt,
    );
  }
}
