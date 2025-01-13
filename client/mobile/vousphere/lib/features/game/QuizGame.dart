import 'dart:async';
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:intl/intl.dart';
import 'package:vousphere/features/game/Dialog/GameOverDialog.dart';

// Model Classes
class QuizInfo {
  final String id;
  final String name;
  final String description;
  final List<Question> questions;

  QuizInfo({
    required this.id,
    required this.name,
    required this.description,
    required this.questions,
  });
}

class Question {
  final String id;
  final String content;
  final List<Option> options;

  Question({
    required this.id,
    required this.content,
    required this.options,
  });
}

class Option {
  final String id;
  final String content;

  Option({
    required this.id,
    required this.content,
  });
}

class Player {
  final String id;
  final String name;

  Player({required this.id, required this.name});
}

class QuizGame extends StatefulWidget {
  const QuizGame({Key? key}) : super(key: key);

  @override
  State<QuizGame> createState() => _QuizGameState();
}

class _QuizGameState extends State<QuizGame> with TickerProviderStateMixin {
  bool isPlaying = false;
  bool isInWaitingRoom = false;
  int score = 0;
  int questionIndex = 0;
  int timeRemaining = 15;
  String? selectedAnswerId;
  bool hasAnswered = false;
  Timer? _timer;
  final audioPlayer = AudioPlayer();
  late AnimationController _timerAnimationController;
  QuizInfo? quizInfo;
  List<Player> players = [];
  DateTime? gameStartTime;
  late FlutterTts flutterTts;
  late String formattedTime;
  bool showCountdown = false;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _initializeQuizData();
    final now = DateTime.now();
    final futureTime = now.add(Duration(seconds: 60));
    // Định dạng thời gian theo định dạng HH:mm
    formattedTime = DateFormat('HH:mm').format(futureTime);

    // Khởi tạo TTS
    flutterTts = FlutterTts();
  }

  void _initializeAnimations() {
    _timerAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 15),
    );
  }

  void _initializeQuizData() {
    // Hardcoded quiz data
    quizInfo = QuizInfo(
      id: "01945b83-3310-40d7-acbf-13e4cbaf2fd2",
      name: "Quiz for campaign 1",
      description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
      questions: [
        Question(
          id: "f225ef85-8552-4188-9a13-9b5dbda1ce76",
          content: "Ai là người đầu tiên chinh phục Everest",
          options: [
            Option(id: "b78e2408-0339-4e03-85fb-7ba6e3e04e94", content: "Huu"),
            Option(id: "e79d0d37-d2ea-40dc-b815-1ff91a447123", content: "Lam"),
            Option(id: "294db647-1142-4a12-b4f5-a00ab871c0da", content: "HiHi"),
            Option(
                id: "524709e0-4382-4384-b895-6a73413d9bdd", content: "Khiem"),
          ],
        ),
        Question(
          id: "fcb19fd7-1262-4926-972f-1ce6fc57eb2c",
          content: "Huu sinh nam bao nhieu",
          options: [
            Option(id: "725bb7fa-2f6f-4c50-bffd-d83985950e1e", content: "1"),
            Option(id: "1782c804-8aad-4bfa-b6d3-a68161970943", content: "2"),
            Option(id: "789fa2f7-b719-4481-aeef-2f540749d29f", content: "3"),
            Option(id: "a2ae8e38-aaef-4429-ac46-1fa493f7b538", content: "4"),
          ],
        ),
      ],
    );
  }

  void startGame() {
    setState(() {
      isInWaitingRoom = true;
    });

    // Simulate socket connection and player joining
    _simulatePlayersJoining();
  }

  void _simulatePlayersJoining() {
    // Initial players
    players = [
      Player(id: "850dc338-34fc-410e-9986-240a6213a1af", name: "Poirot"),
    ];

    // Simulate new players joining
    Timer.periodic(const Duration(seconds: 3), (timer) {
      if (!isInWaitingRoom) {
        timer.cancel();
        return;
      }

      setState(() {
        players.add(Player(
          id: DateTime.now().toString(),
          name: "Player ${players.length + 1}",
        ));
      });
    });

    // Simulate quiz start after 30 seconds
    Future.delayed(const Duration(seconds: 30), () {
      _showQuizInfo();
    });
  }

  void _showQuizInfo() {
    // Simulate text-to-speech
    audioPlayer.setAsset('assets/audio/quiz_info.mp3');
    audioPlayer.play();

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => QuizInfoCard(
        quizInfo: quizInfo!,
        countdown: 15,
      ),
    );

    // Simulate quiz countdown after 30 seconds
    Future.delayed(const Duration(seconds: 30), () {
      Navigator.of(context).pop();
      _startQuizCountdown();
    });
  }

  void _startQuizCountdown() {
    setState(() {
      timeRemaining = 15;
      showCountdown = true;
    });

    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (timeRemaining > 0) {
          timeRemaining--;
        } else {
          timer.cancel();
          _startQuiz();
        }
      });
    });
  }

  void _startQuiz() {
    setState(() {
      isPlaying = true;
      isInWaitingRoom = false;
      questionIndex = 0;
      timeRemaining = 15;
      selectedAnswerId = null;
      hasAnswered = false;
    });
    _timerAnimationController.reset();
    _timerAnimationController.forward();
    _startQuestionTimer();
  }

  void _startQuestionTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (timeRemaining > 0) {
          timeRemaining--;
        } else {
          timer.cancel();
          _showAnswer();
        }
      });
    });
  }

  void _selectAnswer(String answerId) {
    if (hasAnswered) return;

    setState(() {
      selectedAnswerId = answerId;
      hasAnswered = true;
    });

    // Simulate answer submission
    Future.delayed(const Duration(seconds: 2), () {
      _showAnswer();
    });
  }

  void _showAnswer() {
    // Hardcoded correct answers
    final correctAnswers = [
      "b78e2408-0339-4e03-85fb-7ba6e3e04e94",
      "789fa2f7-b719-4481-aeef-2f540749d29f"
    ];

    if (selectedAnswerId == correctAnswers[questionIndex]) {
      setState(() {
        score += timeRemaining * 10;
      });
    }

    Future.delayed(const Duration(seconds: 3), () {
      if (questionIndex < quizInfo!.questions.length - 1) {
        _nextQuestion();
      } else {
        _endGame();
      }
    });
  }

  void _nextQuestion() {
    setState(() {
      questionIndex++;
      timeRemaining = 15;
      selectedAnswerId = null;
      hasAnswered = false;
    });
    _timerAnimationController.reset();
    _timerAnimationController.forward();
    _startQuestionTimer();
  }

  void _endGame() {
    _timer?.cancel();
    _timerAnimationController.reset();

    // Simulate final results
    final topPlayers = [
      {'rank': 1, 'name': 'Player 2', 'score': 280, 'isUser': false},
      {'rank': 2, 'name': 'You', 'score': score, 'isUser': true},
      {'rank': 3, 'name': 'Player 1', 'score': 150, 'isUser': false},
    ];

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => GameOverDialog(
        score: score,
        topPlayers: topPlayers,
        onClose: () {
          Navigator.of(context).pop();
          setState(() {
            isPlaying = false;
            score = 0;
          });
        },
        hasWonPrize: score > 200,
        prizeAmount: '\$500',
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF000067), Color(0xFF3B3B98)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              _buildHeader(),
              Expanded(
                child: isInWaitingRoom
                    ? _buildWaitingRoom()
                    : isPlaying
                        ? _buildGameScreen()
                        : _buildStartScreen(),
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
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'HQ TRIVIA',
            style: TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          if (isPlaying)
            Text(
              'Score: $score',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildStartScreen() {
    return Center(
      child: ElevatedButton(
        onPressed: startGame,
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
        ),
        child: const Text(
          'Start Game',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }

  Widget _buildWaitingRoom() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Text(
            showCountdown ? '$timeRemaining ' : 'Game starts at $formattedTime',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 24,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            '${players.length} Players Online',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                childAspectRatio: 1,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              itemCount: players.length,
              itemBuilder: (context, index) {
                return PlayerAvatar(
                  name: players[index].name,
                  isCurrentPlayer: index == 0,
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGameScreen() {
    final currentQuestion = quizInfo!.questions[questionIndex];

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          AnimatedProgressBar(
            value: timeRemaining / 15,
            color: Colors.blue,
          ),
          const SizedBox(height: 8),
          Text(
            'Time: $timeRemaining',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 24,
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              currentQuestion.content,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 2,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
              ),
              itemCount: currentQuestion.options.length,
              itemBuilder: (context, index) {
                final option = currentQuestion.options[index];
                bool isSelected = selectedAnswerId == option.id;

                return ElevatedButton(
                  onPressed:
                      hasAnswered ? null : () => _selectAnswer(option.id),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isSelected ? Colors.blue : Colors.white,
                    foregroundColor: isSelected ? Colors.white : Colors.black,
                  ),
                  child: Text(option.content),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    _timerAnimationController.dispose();
    audioPlayer.dispose();
    super.dispose();
  }
}

// UI Components

class PlayerAvatar extends StatelessWidget {
  final String name;
  final bool isCurrentPlayer;

  const PlayerAvatar({
    Key? key,
    required this.name,
    this.isCurrentPlayer = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: isCurrentPlayer
            ? Colors.blue.withOpacity(0.3)
            : Colors.white.withOpacity(0.2),
        border: Border.all(
          color: isCurrentPlayer ? Colors.blue : Colors.white.withOpacity(0.5),
          width: 2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.person,
              color: isCurrentPlayer ? Colors.blue : Colors.white,
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              name,
              style: TextStyle(
                color: isCurrentPlayer ? Colors.blue : Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

class QuizInfoCard extends StatelessWidget {
  final QuizInfo quizInfo;
  final int countdown;

  const QuizInfoCard({
    Key? key,
    required this.quizInfo,
    required this.countdown,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              quizInfo.name,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Text(
              quizInfo.description,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class AnimatedProgressBar extends StatelessWidget {
  final double value;
  final Color color;

  const AnimatedProgressBar({
    Key? key,
    required this.value,
    required this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 8,
      decoration: BoxDecoration(
        color: Colors.grey[300],
        borderRadius: BorderRadius.circular(4),
      ),
      child: FractionallySizedBox(
        alignment: Alignment.centerLeft,
        widthFactor: value.clamp(0.0, 1.0),
        child: Container(
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
      ),
    );
  }
}
