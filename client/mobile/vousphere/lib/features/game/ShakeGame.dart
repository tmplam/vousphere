import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';

class ShakeGame extends StatefulWidget {
  const ShakeGame({Key? key}) : super(key: key);

  @override
  State<ShakeGame> createState() => _ShakeGameState();
}

class _ShakeGameState extends State<ShakeGame> with TickerProviderStateMixin {
  bool isPlaying = false;
  int turns = 3;
  int timeRemaining = 120;
  String? wonItem;
  bool isShaking = false;
  Timer? _timer;
  late AnimationController _shakeController;
  late AnimationController _scaleController;
  late AnimationController _rotateController;

  // Enhanced prize list with rarity and animations
  final List<Map<String, dynamic>> items = [
    {
      'emoji': '👑',
      'name': 'Royal Crown',
      'rarity': 'Legendary',
      'color': Colors.amber,
    },
    {
      'emoji': '💎',
      'name': '1000 Diamonds',
      'rarity': 'Epic',
      'color': Colors.purple,
    },
    {
      'emoji': '🌟',
      'name': 'Star Power',
      'rarity': 'Rare',
      'color': Colors.blue,
    },
    {
      'emoji': '🎁',
      'name': 'Mystery Box',
      'rarity': 'Common',
      'color': Colors.green,
    },
  ];

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
  }

  void _startGame() {
    setState(() {
      isPlaying = true;
      turns = 3;
      timeRemaining = 120;
      wonItem = null;
      _startTimer();
    });
    // Initial animations
    _rotateController.repeat();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (timeRemaining > 0) {
          timeRemaining--;
        } else {
          _endGame();
        }
      });
    });
  }

  void _shake() async {
    if (turns <= 0 || isShaking) return;

    setState(() {
      isShaking = true;
      turns--;
      wonItem = null;
    });

    // Complex shake animation
    for (int i = 0; i < 6; i++) {
      await _shakeController.forward();
      await _shakeController.reverse();
    }

    // Scale animation
    _scaleController.forward().then((_) => _scaleController.reverse());

    // Delayed prize reveal
    Future.delayed(const Duration(seconds: 3), () {
      setState(() {
        isShaking = false;
        if (Random().nextDouble() < 0.7) {
          wonItem = items[Random().nextInt(items.length)]['name'];
        }
      });
    });
  }

  void _endGame() {
    _timer?.cancel();
    _rotateController.stop();
    setState(() {
      isPlaying = false;
    });
  }

  @override
  Widget build(BuildContext context) {
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
              _buildStatsBar(),
              Expanded(
                child: !isPlaying ? _buildWaitingScreen() : _buildGameScreen(),
              ),
            ],
          ),
        ),
      ),
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

  Widget _buildStatsBar() {
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
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStat('TURNS', turns.toString(), Icons.repeat),
          _buildStat(
              'TIME',
              '${timeRemaining ~/ 60}:${(timeRemaining % 60).toString().padLeft(2, '0')}',
              Icons.timer),
          _buildStat('LEVEL', '1', Icons.star),
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.white70, size: 20),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 12,
                  color: Colors.white70,
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWaitingScreen() {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Animated prize showcase
          SizedBox(
            height: 200,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: items.length,
              itemBuilder: (context, index) {
                return Container(
                  width: 150,
                  margin: const EdgeInsets.symmetric(horizontal: 8),
                  decoration: BoxDecoration(
                    color: items[index]['color'].withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: items[index]['color'].withOpacity(0.5),
                      width: 2,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        items[index]['emoji'],
                        style: const TextStyle(fontSize: 40),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        items[index]['name'],
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: items[index]['color'].withOpacity(0.3),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          items[index]['rarity'],
                          style: TextStyle(
                            color: items[index]['color'],
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 40),
          ElevatedButton(
            onPressed: _startGame,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 48, vertical: 16),
              backgroundColor: Colors.white,
              foregroundColor: Colors.blue.shade900,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              elevation: 8,
              shadowColor: Colors.black.withOpacity(0.3),
            ),
            child: const Text(
              'START GAME',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGameScreen() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Animated prize box
          GestureDetector(
            onTap: _shake,
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
          _buildGameStatus(),
        ],
      ),
    );
  }

  Widget _buildGameStatus() {
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
    } else if (wonItem != null) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.green.withOpacity(0.2),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: Colors.green.withOpacity(0.5),
            width: 2,
          ),
        ),
        child: Column(
          children: [
            const Text(
              '🎉 Congratulations! 🎉',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'You won:\n$wonItem',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 20,
                color: Colors.white,
              ),
            ),
          ],
        ),
      );
    } else if (!isShaking && turns > 0) {
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
          'No more turns left!',
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
    _timer?.cancel();
    _shakeController.dispose();
    _scaleController.dispose();
    _rotateController.dispose();
    super.dispose();
  }
}
