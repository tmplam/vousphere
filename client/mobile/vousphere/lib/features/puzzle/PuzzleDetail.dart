import 'package:flutter/material.dart';
import 'package:vousphere/features/puzzle/EmailShareDialog.dart';
import 'package:vousphere/features/puzzle/PuzzleItem.dart';

class PuzzleDetail extends StatefulWidget {
  final PuzzleItem puzzle;

  const PuzzleDetail({Key? key, required this.puzzle}) : super(key: key);

  @override
  _PuzzleDetailState createState() => _PuzzleDetailState();
}

class _PuzzleDetailState extends State<PuzzleDetail> {
  Set<int> selectedPieces = {};
  Set<int> sharedPieces = {};

  // Calculate position and size for each puzzle piece
  Widget _buildPuzzlePiece(
      int index, bool isUnlocked, bool isSelected, bool isShared) {
    final int rows = widget.puzzle.totalPieces == 4 ? 2 : 3;
    final int cols = widget.puzzle.totalPieces == 4 ? 2 : 3;

    // Calculate the position of this piece in the grid
    final int row = index ~/ cols;
    final int col = index % cols;

    return LayoutBuilder(
      builder: (context, constraints) {
        return GestureDetector(
          onTap: (isUnlocked && !isShared)
              ? () {
                  setState(() {
                    if (isSelected) {
                      selectedPieces.remove(index);
                    } else {
                      selectedPieces.add(index);
                    }
                  });
                }
              : null,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border:
                  isSelected ? Border.all(color: Colors.blue, width: 2) : null,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Stack(
                children: [
                  // Image piece with custom painting
                  AspectRatio(
                    aspectRatio: 1,
                    child: ClipRect(
                      child: Transform.scale(
                        scale: rows.toDouble(),
                        alignment: Alignment(
                          -1 + 2 * col / (cols - 1),
                          -1 + 2 * row / (rows - 1),
                        ),
                        child: Image.network(
                          widget.puzzle.imageUrl,
                          fit: BoxFit.cover,
                          color:
                              !isUnlocked || isShared ? Colors.grey[300] : null,
                          colorBlendMode: !isUnlocked || isShared
                              ? BlendMode.saturation
                              : BlendMode.srcIn,
                        ),
                      ),
                    ),
                  ),
                  if (isSelected)
                    Container(
                      color: Colors.blue.withOpacity(0.3),
                      child: const Center(
                        child: Icon(
                          Icons.check_circle,
                          color: Colors.white,
                          size: 32,
                        ),
                      ),
                    ),
                  if (isShared)
                    Container(
                      color: Colors.black.withOpacity(0.3),
                      child: const Center(
                        child: Icon(
                          Icons.share,
                          color: Colors.white,
                          size: 32,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  void _showShareOptions() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (BuildContext context) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${selectedPieces.length} pieces selected',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: const Icon(Icons.share),
                title: const Text('Share Selected Pieces'),
                onTap: () {
                  Navigator.pop(context);
                  _handleShareProcess();
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _handleShareProcess() {
    showDialog(
      context: context,
      builder: (BuildContext context) => EmailShareDialog(
        selectedCount: selectedPieces.length,
      ),
    ).then((email) {
      if (email != null) {
        setState(() {
          sharedPieces.addAll(selectedPieces);
          selectedPieces.clear();
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Shared with $email'),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(10),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.puzzle.name),
        elevation: 0,
        actions: [
          if (selectedPieces.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.share),
              onPressed: _showShareOptions,
            ),
        ],
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: widget.puzzle.totalPieces == 4 ? 2 : 3,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        itemCount: widget.puzzle.totalPieces,
        itemBuilder: (context, index) {
          final isUnlocked = widget.puzzle.unlockedPieces.contains(index);
          final isSelected = selectedPieces.contains(index);
          final isShared = sharedPieces.contains(index);

          return _buildPuzzlePiece(index, isUnlocked, isSelected, isShared);
        },
      ),
    );
  }
}
