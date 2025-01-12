import 'package:flutter/material.dart';
import 'package:vousphere/features/puzzle/PuzzleDetail.dart';
import 'package:vousphere/features/puzzle/PuzzleItem.dart';

class PuzzleClollection extends StatefulWidget {
  const PuzzleClollection({Key? key}) : super(key: key);

  @override
  _PuzzleClollectionState createState() => _PuzzleClollectionState();
}

class _PuzzleClollectionState extends State<PuzzleClollection> {
  final List<PuzzleItem> puzzles = [
    PuzzleItem(
      id: '1',
      imageUrl: 'https://i.pravatar.cc/300',
      name: 'Black Panther',
      totalPieces: 9,
      unlockedPieces: [0, 1, 3, 4],
    ),
    PuzzleItem(
      id: '2',
      imageUrl: 'https://i.pravatar.cc/301',
      name: 'Mystery Hero',
      totalPieces: 4,
      unlockedPieces: [0],
    ),
  ];

  void _showPuzzleDetails(PuzzleItem puzzle) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (BuildContext context) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                height: 4,
                width: 40,
                margin: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              ListTile(
                leading: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    puzzle.imageUrl,
                    width: 48,
                    height: 48,
                    fit: BoxFit.cover,
                  ),
                ),
                title: Text(puzzle.name),
                subtitle: Text(
                    '${puzzle.unlockedPieces.length}/${puzzle.totalPieces} pieces collected'),
                trailing: TextButton(
                  onPressed: () {
                    Navigator.pop(context);
                    _navigateToPuzzleGame(puzzle);
                  },
                  child: const Text('View Collection'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _navigateToPuzzleGame(PuzzleItem puzzle) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PuzzleDetail(puzzle: puzzle),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Puzzle Collection'),
        elevation: 0,
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: 0.8,
        ),
        itemCount: puzzles.length,
        itemBuilder: (context, index) {
          final puzzle = puzzles[index];
          return GestureDetector(
            onTap: () => _showPuzzleDetails(puzzle),
            child: Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Expanded(
                    flex: 3,
                    child: ClipRRect(
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(16),
                      ),
                      child: Image.network(
                        puzzle.imageUrl,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Expanded(
                    flex: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            puzzle.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              LinearProgressIndicator(
                                value: puzzle.unlockedPieces.length /
                                    puzzle.totalPieces,
                                backgroundColor: Colors.grey[200],
                                valueColor: AlwaysStoppedAnimation<Color>(
                                    Colors.blue[700]!),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${puzzle.unlockedPieces.length}/${puzzle.totalPieces} collected',
                                style: TextStyle(
                                  color: Colors.grey[600],
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
