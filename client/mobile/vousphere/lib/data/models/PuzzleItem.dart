class PuzzleItem {
  final String id;
  final String imageUrl;
  final String name;
  final int totalPieces;
  final List<int> unlockedPieces;
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
      description: event['description'],
      startTime: DateTime.parse(event['startTime']),
      endTime: DateTime.parse(event['endTime']),
      brandId: event['brandId'],
    );
  }
}
