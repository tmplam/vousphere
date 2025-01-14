import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/data/models/PuzzleItem.dart';
import 'package:vousphere/features/puzzle/EmailShareDialog.dart';
import 'package:vousphere/features/puzzle/provider/PuzzleProvider.dart';

class PuzzleDetail extends StatefulWidget {
  final PuzzleItem puzzle;

  const PuzzleDetail({Key? key, required this.puzzle}) : super(key: key);

  @override
  _PuzzleDetailState createState() => _PuzzleDetailState();
}

class _PuzzleDetailState extends State<PuzzleDetail> {
  Set<int> selectedPieces = {};
  Set<int> sharedPieces = {};

  Widget _buildPuzzlePiece(
      int index, bool isUnlocked, bool isSelected, bool isShared) {
    final int rows = widget.puzzle.totalPieces == 4 ? 2 : 3;
    final int cols = widget.puzzle.totalPieces == 4 ? 2 : 3;

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
              onPressed: () => _showShareOptions(context),
            ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              widget.puzzle.description,
              style: Theme.of(context).textTheme.bodyMedium,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Expanded(
            child: GridView.builder(
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

                return _buildPuzzlePiece(
                    index, isUnlocked, isSelected, isShared);
              },
            ),
          ),
          _buildExchangeButton(), // Add this line
        ],
      ),
    );
  }

  void _showShareOptions(BuildContext context) {
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
                  _handleShareProcess(context);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _handleShareProcess(BuildContext context) {
    final selectedPiecesData = selectedPieces
        .map((index) =>
            widget.puzzle.pieces.firstWhere((p) => p.pieceIndex == index))
        .toList();

    showDialog(
      context: context,
      builder: (BuildContext context) => EmailShareDialog(
        selectedCount: selectedPieces.length,
        selectedPieces: selectedPiecesData,
        puzzleId: widget.puzzle.id,
      ),
    ).then((email) async {
      // Make this async
      if (email != null) {
        // Update local state
        setState(() {
          sharedPieces.addAll(selectedPieces);
          selectedPieces.clear();
        });

        // Refresh puzzles data
        await Provider.of<PuzzleProvider>(context, listen: false).loadPuzzles();

        if (mounted) {
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
      }
    });
  }

  // Exchange
  Widget _buildExchangeButton() {
    // Check if all pieces are unlocked
    final bool canExchange =
        widget.puzzle.unlockedPieces.length == widget.puzzle.totalPieces;

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: ElevatedButton(
        onPressed: canExchange ? () => _handleExchange(context) : null,
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(double.infinity, 50),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
          backgroundColor: canExchange ? Colors.blue : Colors.grey,
        ),
        child: Text(
          'Exchange Voucher',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: canExchange
                ? Colors.black
                : const Color.fromARGB(255, 177, 176, 176),
          ),
        ),
      ),
    );
  }

  Future<void> _handleExchange(BuildContext context) async {
    try {
      final provider = Provider.of<PuzzleProvider>(context, listen: false);
      final success = await provider.exchangeVoucher(widget.puzzle.id);

      if (!mounted) return;

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Voucher exchanged successfully!'),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(10),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content:
                const Text('Failed to exchange voucher. Please try again.'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            margin: const EdgeInsets.all(10),
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('An error occurred. Please try again later.'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          margin: const EdgeInsets.all(10),
        ),
      );
    }
  }
}
