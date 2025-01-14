import 'package:vousphere/data/models/Piece.dart';

class PuzzleItem {
  final String id;
  final String imageUrl;
  final String name;
  final int totalPieces;
  final List<int> unlockedPieces;
  final List<Piece> pieces;
  final String description;
  final DateTime startTime;
  final DateTime endTime;
  final String brandId;

  PuzzleItem({
    required this.id,
    required this.imageUrl,
    required this.name,
    required this.totalPieces,
    required this.unlockedPieces,
    required this.pieces,
    required this.description,
    required this.startTime,
    required this.endTime,
    required this.brandId,
  });

  factory PuzzleItem.fromJson(Map<String, dynamic> json) {
    final event = json['event'];
    final itemPieces = json['itemPieces'] as List<dynamic>;

    return PuzzleItem(
      id: event['id'],
      imageUrl: event['item']['image'],
      name: event['name'],
      totalPieces: event['item']['numberPieces'],
      unlockedPieces:
          itemPieces.map<int>((piece) => piece['pieceIndex'] as int).toList(),
      pieces: itemPieces.map<Piece>((piece) => Piece.fromJson(piece)).toList(),
      description: event['description'],
      startTime: DateTime.parse(event['startTime']),
      endTime: DateTime.parse(event['endTime']),
      brandId: event['brandId'],
    );
  }

  PuzzleItem copyWith({
    String? id,
    String? imageUrl,
    String? name,
    int? totalPieces,
    List<int>? unlockedPieces,
    List<Piece>? pieces,
    String? description,
    DateTime? startTime,
    DateTime? endTime,
    String? brandId,
  }) {
    return PuzzleItem(
      id: id ?? this.id,
      imageUrl: imageUrl ?? this.imageUrl,
      name: name ?? this.name,
      totalPieces: totalPieces ?? this.totalPieces,
      unlockedPieces: unlockedPieces ?? List<int>.from(this.unlockedPieces),
      pieces: pieces ?? List<Piece>.from(this.pieces),
      description: description ?? this.description,
      startTime: startTime ?? this.startTime,
      endTime: endTime ?? this.endTime,
      brandId: brandId ?? this.brandId,
    );
  }
}
