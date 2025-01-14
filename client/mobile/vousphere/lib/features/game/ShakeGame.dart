import 'dart:async';
import 'dart:math';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';

class ShakeGame extends StatefulWidget {
  final dynamic event;
  const ShakeGame({Key? key, required this.event}) : super(key: key);

  @override
  State<ShakeGame> createState() => _ShakeGameState();
}

class _ShakeGameState extends State<ShakeGame> with TickerProviderStateMixin {
  final ApiService apiService = ApiService();
  bool isShaking = false;
  late AnimationController _shakeController;
  late AnimationController _scaleController;
  late AnimationController _rotateController;

  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _rotateController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );
    _rotateController.repeat();
  }

  void _playGame(UserProvider userProvider) async {
    final remainingPlays = userProvider.user.player?['numberOfPlays'] ?? 0;
    if (remainingPlays <= 0 || isShaking) return;

    setState(() {
      isShaking = true;
    });

    for (int i = 0; i < 6; i++) {
      await _shakeController.forward();
      await _shakeController.reverse();
    }

    _scaleController.forward().then((_) => _scaleController.reverse());

    try {
      final response =
          await apiService.dio.post("/game-service/api/games/shaking-game/play",
              queryParameters: {
                "eventId": widget.event.id,
              },
              options: Options(extra: {
                "requireToken": true,
              }));

      if (response.statusCode == 200 && response.data["isSuccess"]) {
        final data = response.data["data"];
        await userProvider
            .getUser(); // Refresh user data to get updated plays count
        _showRewardDialog(data);
      }
    } catch (e) {
      print("Error playing game: $e");
    } finally {
      setState(() {
        isShaking = false;
      });
    }
  }

  void _showRewardDialog(Map<String, dynamic> reward) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: const Text(
            '🎉 Congratulations!',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                reward["itemPiece"] <= 0 && reward["discount"] <= 0
                    ? 'Better luck next time!'
                    : reward["itemPiece"] > 0
                        ? 'You won ${reward["itemPiece"]} pieces!'
                        : reward["discount"] > 0
                            ? 'You won a ${reward["discount"]}% discount!'
                            : 'Better luck next time!',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 20,
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => Navigator.of(context).pop(),
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                ),
                child: const Text('OK'),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<UserProvider>(
      builder: (context, userProvider, child) {
        final remainingPlays = userProvider.user.player?['numberOfPlays'] ?? 0;

        return Scaffold(
          body: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.blue.shade900,
                  Colors.purple.shade900,
                ],
              ),
            ),
            child: SafeArea(
              child: Column(
                children: [
                  _buildHeader(),
                  _buildTurnsCounter(remainingPlays),
                  Expanded(
                    child: _buildGameScreen(userProvider),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(20)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Image.network(
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPaC7cj4_qxIrYj2PlR9cHBBL6cKjUqONnw15V924QnT9DBOp84r8diWCZ-C3JTDGRNs0&usqp=CAU',
              width: 50,
              height: 50,
            ),
          ),
          const SizedBox(width: 16),
          Text(
            'LUCKY SHAKE',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              shadows: [
                Shadow(
                  color: Colors.black.withOpacity(0.3),
                  offset: const Offset(0, 2),
                  blurRadius: 4,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTurnsCounter(int remainingPlays) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 2,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.repeat, color: Colors.white70, size: 24),
          const SizedBox(width: 8),
          Text(
            'Plays left: $remainingPlays',
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGameScreen(UserProvider userProvider) {
    final remainingPlays = userProvider.user.player?['numberOfPlays'] ?? 0;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          GestureDetector(
            onTap: () => _playGame(userProvider),
            child: AnimatedBuilder(
              animation: Listenable.merge([
                _shakeController,
                _scaleController,
                _rotateController,
              ]),
              builder: (context, child) {
                return Transform.translate(
                  offset: Offset(
                    sin(_shakeController.value * 2 * pi) * 10,
                    cos(_shakeController.value * 2 * pi) * 10,
                  ),
                  child: Transform.rotate(
                    angle: _rotateController.value * 2 * pi / 20,
                    child: Transform.scale(
                      scale: 1 + _scaleController.value * 0.2,
                      child: Container(
                        width: 180,
                        height: 180,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.amber.shade400,
                              Colors.amber.shade700,
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(30),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.amber.withOpacity(0.3),
                              blurRadius: 20,
                              spreadRadius: 5,
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.card_giftcard,
                          size: 80,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 40),
          _buildGameStatus(remainingPlays),
        ],
      ),
    );
  }

  Widget _buildGameStatus(int remainingPlays) {
    if (isShaking) {
      return Column(
        children: [
          const CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
          ),
          const SizedBox(height: 16),
          Text(
            'Shaking...',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white.withOpacity(0.8),
            ),
          ),
        ],
      );
    } else if (remainingPlays > 0) {
      return Text(
        'Tap the box to shake!',
        style: TextStyle(
          fontSize: 20,
          color: Colors.white.withOpacity(0.8),
        ),
      );
    } else {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.red.withOpacity(0.2),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: Colors.red.withOpacity(0.5),
            width: 2,
          ),
        ),
        child: const Text(
          'No more plays left!',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      );
    }
  }

  @override
  void dispose() {
    _shakeController.dispose();
    _scaleController.dispose();
    _rotateController.dispose();
    super.dispose();
  }
}
