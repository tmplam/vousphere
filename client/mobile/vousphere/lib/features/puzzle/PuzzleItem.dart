class PuzzleItem {
  final String id;
  final String imageUrl;
  final String name;
  final int totalPieces;
  final List<int> unlockedPieces;

  PuzzleItem({
    required this.id,
    required this.imageUrl,
    required this.name,
    required this.totalPieces,
    required this.unlockedPieces,
  });
}
