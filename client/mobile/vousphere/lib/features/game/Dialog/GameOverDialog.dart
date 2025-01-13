import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'dart:math' as math;

class GameOverDialog extends StatefulWidget {
  final int score;
  final List<Map<String, dynamic>> topPlayers;
  final VoidCallback onClose;
  final bool hasWonPrize;
  final String? prizeAmount;

  const GameOverDialog({
    Key? key,
    required this.score,
    required this.topPlayers,
    required this.onClose,
    this.hasWonPrize = false,
    this.prizeAmount,
  }) : super(key: key);

  @override
  State<GameOverDialog> createState() => _GameOverDialogState();
}

class _GameOverDialogState extends State<GameOverDialog>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(begin: 0.3, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.elasticOut,
      ),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.4, 1.0, curve: Curves.easeOut),
      ),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _scaleAnimation,
      child: Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
        ),
        elevation: 8,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Colors.white, Color(0xFFF5F5F5)],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildHeader(),
                const SizedBox(height: 24),
                _buildScore(),
                const SizedBox(height: 32),
                _buildLeaderboard(),
                if (widget.hasWonPrize && widget.prizeAmount != null)
                  _buildPrizeSection(),
                const SizedBox(height: 24),
                _buildButtons(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Stack(
      alignment: Alignment.center,
      children: [
        Text(
          'Game Over',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            foreground: Paint()
              ..style = PaintingStyle.stroke
              ..strokeWidth = 6
              ..color = Colors.blue,
          ),
        ),
        const Text(
          'Game Over!',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        if (widget.hasWonPrize)
          Positioned(
            top: -20,
            right: -20,
            child: Transform.rotate(
              angle: -math.pi / 12,
              child: Icon(
                Icons.star,
                size: 48,
                color: Colors.amber[400],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildScore() {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.blue[400]!, Colors.blue[600]!],
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.blue.withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            const Text(
              'Your Score',
              style: TextStyle(
                fontSize: 18,
                color: Colors.white70,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              widget.score.toString(),
              style: const TextStyle(
                fontSize: 36,
                color: Colors.white,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLeaderboard() {
    return Column(
      children: [
        const Text(
          'Top Players',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 16),
        ...widget.topPlayers.asMap().entries.map((entry) {
          final index = entry.key;
          final player = entry.value;
          return FadeTransition(
            opacity: _fadeAnimation,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: Offset(1, 0),
                end: Offset.zero,
              ).animate(
                CurvedAnimation(
                  parent: _controller,
                  curve: Interval(
                    0.4 + (index * 0.1),
                    1.0,
                    curve: Curves.easeOut,
                  ),
                ),
              ),
              child: Container(
                margin: const EdgeInsets.symmetric(vertical: 4),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: player['isUser']
                      ? Colors.blue.withOpacity(0.1)
                      : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: player['isUser']
                        ? Colors.blue.withOpacity(0.3)
                        : Colors.grey.withOpacity(0.2),
                  ),
                ),
                child: Row(
                  children: [
                    _buildRankBadge(player['rank'], index),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        player['name'],
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: player['isUser']
                              ? FontWeight.bold
                              : FontWeight.normal,
                          color: player['isUser']
                              ? Colors.blue[700]
                              : Colors.black87,
                        ),
                      ),
                    ),
                    Text(
                      '${player['score']} pts',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildRankBadge(int rank, int index) {
    final colors = [
      Colors.amber, // Gold
      Colors.grey[400], // Silver
      Colors.brown[300], // Bronze
    ];

    return Container(
      width: 36,
      height: 36,
      decoration: BoxDecoration(
        color:
            index < 3 && colors[index] != null ? colors[index]! : Colors.blue,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: (index < 3 && colors[index] != null
                    ? colors[index]!
                    : Colors.blue)
                .withAlpha((0.3 * 255).toInt()),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
          BoxShadow(
            color: (index < 3 && colors[index] != null
                    ? colors[index]!
                    : Colors.blue)
                .withAlpha((0.3 * 255).toInt()),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Center(
        child: Text(
          '$rank',
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ),
    );
  }

  Widget _buildPrizeSection() {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: Container(
        margin: const EdgeInsets.only(top: 24),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.green[400]!, Colors.green[600]!],
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.green.withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.emoji_events,
              color: Colors.amber[400],
              size: 32,
            ),
            const SizedBox(width: 12),
            Text(
              'You won ${widget.prizeAmount}!',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildButtons() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        ElevatedButton.icon(
          onPressed: () {
            // Add share functionality
          },
          icon: const Icon(Icons.share),
          label: const Text('Share'),
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        ElevatedButton.icon(
          onPressed: widget.onClose,
          icon: const Icon(Icons.refresh),
          label: const Text('Play Again'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.blue,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ],
    );
  }
}
