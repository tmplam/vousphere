import 'dart:async';
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:video_player/video_player.dart';

class QuizGame extends StatefulWidget {
  const QuizGame({Key? key}) : super(key: key);

  @override
  State<QuizGame> createState() => _QuizGameState();
}

class _QuizGameState extends State<QuizGame> with TickerProviderStateMixin {
  bool isPlaying = false;
  int score = 0;
  int questionIndex = 0;
  int timeRemaining = 10;
  int connectionCount = 1;
  int? selectedAnswerIndex;
  bool hasAnswered = false;
  Timer? _timer;
  final audioPlayer = AudioPlayer();
  late VideoPlayerController _videoController;
  late VideoPlayerController _hiddenVideoController;
  late AnimationController _timerAnimationController;
  late Animation<double> _timerAnimation;

  // Quiz data
  final List<Map<String, dynamic>> quizzes = [
    {
      'question': 'What is the capital of France?',
      'correct_answer': 'Paris',
      'incorrect_answers': ['London', 'Berlin', 'Madrid'],
      'correct_answer_index': 0,
      'audio_url': 'assets/question1.mp3',
    },
    {
      'question': 'Which planet is known as the Red Planet?',
      'correct_answer': 'Mars',
      'incorrect_answers': ['Venus', 'Jupiter', 'Saturn'],
      'correct_answer_index': 0,
      'audio_url': 'assets/question2.mp3',
    },
  ];

  @override
  void initState() {
    super.initState();
    _initializeVideo();
    _initializeAnimations();
  }

  void _initializeAnimations() {
    _timerAnimationController = AnimationController(
      vsync: this,
      duration: Duration(seconds: 10),
    );
    _timerAnimation =
        Tween<double>(begin: 1.0, end: 0.0).animate(_timerAnimationController);
  }

  void _initializeVideo() {
    _videoController = VideoPlayerController.asset('assets/start.mp4')
      ..initialize().then((_) {
        setState(() {});
      });
    _hiddenVideoController = VideoPlayerController.asset('assets/end.mp4')
      ..initialize().then((_) {
        setState(() {});
      });
  }

  void startGame() {
    setState(() {
      isPlaying = true;
      score = 0;
      questionIndex = 0;
      timeRemaining = 10;
      hasAnswered = false;
      selectedAnswerIndex = null;
    });
    _timerAnimationController.reset();
    _timerAnimationController.forward();
    _startTimer();
    _readQuestion();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        if (timeRemaining > 0) {
          timeRemaining--;
          if (timeRemaining == 2) {
            _readAnswer();
          }
        } else {
          if (!hasAnswered) {
            _showCorrectAnswer();
          }
          if (questionIndex < quizzes.length - 1) {
            _nextQuestion();
          } else {
            _endGame();
          }
        }
      });
    });
  }

  void _readQuestion() async {
    try {
      _startSpeaking();
      await audioPlayer.setAsset(quizzes[questionIndex]['audio_url']);
      await audioPlayer.play();
    } catch (e) {
      print('Error playing question audio: $e');
    }
  }

  void _readAnswer() async {
    try {
      _startSpeaking();
      await audioPlayer.setAsset('assets/answer.mp3');
      await audioPlayer.play();
    } catch (e) {
      print('Error playing answer audio: $e');
    }
  }

  void _startSpeaking() {
    if (_videoController.value.isInitialized) {
      _videoController.play();
    }
    if (_hiddenVideoController.value.isInitialized) {
      _hiddenVideoController.pause();
    }
  }

  void _stopSpeaking() {
    if (_videoController.value.isInitialized) {
      _videoController.pause();
    }
    if (_hiddenVideoController.value.isInitialized) {
      _hiddenVideoController.play();
    }
  }

  void _selectAnswer(int index) {
    if (hasAnswered) return;

    setState(() {
      selectedAnswerIndex = index;
      hasAnswered = true;
    });

    _stopSpeaking();
    Future.delayed(Duration(seconds: 3), () {
      _showCorrectAnswer();
    });
  }

  void _showCorrectAnswer() {
    if (selectedAnswerIndex == quizzes[questionIndex]['correct_answer_index']) {
      setState(() {
        score += timeRemaining * (10 + questionIndex);
      });
    }

    Future.delayed(Duration(seconds: 2), () {
      if (questionIndex < quizzes.length - 1) {
        _nextQuestion();
      } else {
        _endGame();
      }
    });
  }

  void _nextQuestion() {
    _timerAnimationController.reset();
    setState(() {
      questionIndex++;
      timeRemaining = 10;
      selectedAnswerIndex = null;
      hasAnswered = false;
    });
    _timerAnimationController.forward();
    _readQuestion();
  }

  void _endGame() {
    _timer?.cancel();
    _timerAnimationController.reset();
    _stopSpeaking();
    setState(() {
      isPlaying = false;
    });
    _showDramaticResults();
  }

  void _showDramaticResults() async {
    // Play dramatic music
    try {
      await audioPlayer.setAsset('assets/dramatic_reveal.mp3');
      await audioPlayer.play();
    } catch (e) {
      print('Error playing dramatic music: $e');
    }

    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation1, animation2) => SafeArea(
          child: Scaffold(
            body: Stack(
              children: [
                // Animated background gradient
                TweenAnimationBuilder(
                  duration: const Duration(seconds: 3),
                  tween: Tween<double>(begin: 0, end: 1),
                  builder: (context, double value, child) {
                    return Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Color.lerp(
                                Colors.black, Colors.purple.shade900, value)!,
                            Color.lerp(
                                Colors.black, Colors.blue.shade900, value)!,
                          ],
                        ),
                      ),
                    );
                  },
                ),

                // Content
                SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const SizedBox(height: 40),
                        // Animated header section
                        TweenAnimationBuilder(
                          duration: const Duration(seconds: 2),
                          tween: Tween<double>(begin: 0, end: 1),
                          builder: (context, double value, child) {
                            return Opacity(
                              opacity: value,
                              child: Transform.translate(
                                offset: Offset(0, 50 * (1 - value)),
                                child: Transform.scale(
                                  scale: 0.5 + (0.5 * value),
                                  child: child,
                                ),
                              ),
                            );
                          },
                          child: Column(
                            children: [
                              ShaderMask(
                                shaderCallback: (Rect bounds) {
                                  return LinearGradient(
                                    colors: [
                                      Colors.amber.shade300,
                                      Colors.amber.shade700
                                    ],
                                  ).createShader(bounds);
                                },
                                child: const Icon(
                                  Icons.emoji_events,
                                  color: Colors.white,
                                  size: 120,
                                ),
                              ),
                              const SizedBox(height: 24),
                              ShaderMask(
                                shaderCallback: (Rect bounds) {
                                  return LinearGradient(
                                    colors: [Colors.white, Colors.white70],
                                  ).createShader(bounds);
                                },
                                child: const Text(
                                  'Game Over!',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 48,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 2,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 40),

                        // Results section
                        FutureBuilder<List<Map<String, dynamic>>>(
                          future: _calculateLeaderboard(),
                          builder: (context, snapshot) {
                            if (!snapshot.hasData) {
                              return const Center(
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 3,
                                ),
                              );
                            }

                            final leaderboard = snapshot.data!;
                            final userRank = _findUserRank(leaderboard);
                            final hasWon = userRank <= 3;

                            return Column(
                              children: [
                                // Score reveal with larger animation
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: Colors.white.withOpacity(0.2),
                                      width: 2,
                                    ),
                                  ),
                                  child: _buildScoreReveal(),
                                ),
                                const SizedBox(height: 32),

                                // Enhanced leaderboard section
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: Colors.white.withOpacity(0.2),
                                      width: 2,
                                    ),
                                  ),
                                  child: _buildLeaderboardSection(
                                      leaderboard, userRank),
                                ),

                                if (hasWon) ...[
                                  const SizedBox(height: 32),
                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.all(24),
                                    decoration: BoxDecoration(
                                      color: Colors.amber.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(
                                        color: Colors.amber.withOpacity(0.3),
                                        width: 2,
                                      ),
                                    ),
                                    child: _buildPrizeSection(userRank),
                                  ),
                                ],
                              ],
                            );
                          },
                        ),
                        const SizedBox(height: 40),

                        // Enhanced close button
                        ElevatedButton(
                          onPressed: () => Navigator.of(context).pop(),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 48,
                              vertical: 20,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            elevation: 8,
                            shadowColor: Colors.black.withOpacity(0.3),
                          ),
                          child: Text(
                            'Close Game',
                            style: TextStyle(
                              color: Colors.purple.shade900,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1,
                            ),
                          ),
                        ),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        transitionDuration: const Duration(milliseconds: 800),
        reverseTransitionDuration: const Duration(milliseconds: 500),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(
            opacity: animation,
            child: child,
          );
        },
      ),
    );
  }

// [Rest of the code remains the same]

  Widget _buildScoreReveal() {
    return TweenAnimationBuilder(
      duration: const Duration(milliseconds: 2000),
      tween: IntTween(begin: 0, end: score),
      builder: (context, int value, child) {
        return Column(
          children: [
            Text(
              'Your Score',
              style: TextStyle(
                color: Colors.white.withOpacity(0.8),
                fontSize: 20,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              value.toString(),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 48,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildLeaderboardSection(
      List<Map<String, dynamic>> leaderboard, int userRank) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Text(
            'You finished #$userRank',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          ...leaderboard.take(3).map((player) => _buildLeaderboardItem(player)),
        ],
      ),
    );
  }

  Widget _buildLeaderboardItem(Map<String, dynamic> player) {
    final isUser = player['isUser'] ?? false;
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isUser ? Colors.white.withOpacity(0.2) : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Text(
            '#${player['rank']}',
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              player['name'],
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: isUser ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
          Text(
            '${player['score']}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrizeSection(int rank) {
    String prizeText = '';
    IconData prizeIcon = Icons.card_giftcard;
    Color prizeColor = Colors.amber;

    switch (rank) {
      case 1:
        prizeText = '\$1,000';
        prizeIcon = Icons.monetization_on;
        prizeColor = Colors.amber;
        break;
      case 2:
        prizeText = '\$500';
        prizeIcon = Icons.monetization_on;
        prizeColor = Colors.grey.shade300;
        break;
      case 3:
        prizeText = '\$250';
        prizeIcon = Icons.monetization_on;
        prizeColor = Colors.orange.shade700;
        break;
    }

    return TweenAnimationBuilder(
      duration: const Duration(seconds: 1),
      tween: Tween<double>(begin: 0, end: 1),
      builder: (context, double value, child) {
        return Opacity(
          opacity: value,
          child: Transform.scale(
            scale: 0.5 + (0.5 * value),
            child: Container(
              margin: const EdgeInsets.only(top: 24),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: prizeColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: prizeColor,
                  width: 2,
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    prizeIcon,
                    color: prizeColor,
                    size: 32,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'You won $prizeText!',
                    style: TextStyle(
                      color: prizeColor,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
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

  Future<List<Map<String, dynamic>>> _calculateLeaderboard() async {
    // Simulate API call to get leaderboard
    await Future.delayed(const Duration(seconds: 2));

    // This would normally come from your backend
    final leaderboard = [
      {'rank': 1, 'name': 'John', 'score': 1200, 'isUser': score >= 1200},
      {
        'rank': 2,
        'name': 'Sarah',
        'score': 1000,
        'isUser': score < 1200 && score >= 1000
      },
      {
        'rank': 3,
        'name': 'Mike',
        'score': 800,
        'isUser': score < 1000 && score >= 800
      },
      // Add more players as needed
    ];

    return leaderboard;
  }

  int _findUserRank(List<Map<String, dynamic>> leaderboard) {
    for (var i = 0; i < leaderboard.length; i++) {
      if (leaderboard[i]['isUser'] == true) {
        return i + 1;
      }
    }
    return leaderboard.length + 1;
  }

  Widget _buildHeader() {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black26,
                      blurRadius: 10,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: ClipOval(
                  child: Image.network(
                    'https://images.sftcdn.net/images/t_app-icon-m/p/fd3bb77a-d857-4919-a1c7-3eee987649e4/1888627682/hq-trivia-icon.png',
                    width: 80,
                    height: 80,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        width: 80,
                        height: 80,
                        color: Colors.grey[300],
                        child: Icon(Icons.quiz, size: 40),
                      );
                    },
                  ),
                ),
              ),
              SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'HQ TRIVIA',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      shadows: [
                        Shadow(
                          color: Colors.black26,
                          offset: Offset(0, 2),
                          blurRadius: 4,
                        ),
                      ],
                    ),
                  ),
                  if (isPlaying)
                    Text(
                      'Question ${questionIndex + 1} of ${quizzes.length}',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.white70,
                      ),
                    ),
                ],
              ),
            ],
          ),
          if (isPlaying)
            Container(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.people,
                    color: Colors.white,
                    size: 20,
                  ),
                  SizedBox(width: 8),
                  Text(
                    '$connectionCount',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
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
                child: isPlaying ? _buildGameScreen() : _buildWaitingScreen(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // [Previous UI building methods remain the same: _buildHeader(), _buildGameScreen(),
  // _buildStats(), _buildStat(), _buildTimerStat(), _buildQuestionCard(),
  // _buildAnswers(), _buildWaitingScreen()]

  Widget _buildGameScreen() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          SizedBox(height: 16),
          _buildStats(),
          Expanded(
            child: Column(
              children: [
                _buildQuestionCard(),
                SizedBox(height: 24),
                _buildAnswers(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStats() {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStat(
              Icons.quiz, 'Question', '${questionIndex + 1}/${quizzes.length}'),
          _buildStat(Icons.people, 'Players', connectionCount.toString()),
          _buildStat(Icons.star, 'Score', score.toString()),
          _buildTimerStat(),
        ],
      ),
    );
  }

  Widget _buildStat(IconData icon, String label, String value) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 20),
          SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.white70,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimerStat() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          AnimatedBuilder(
            animation: _timerAnimation,
            builder: (context, child) {
              return Stack(
                alignment: Alignment.center,
                children: [
                  SizedBox(
                    width: 32,
                    height: 32,
                    child: CircularProgressIndicator(
                      value: _timerAnimation.value,
                      backgroundColor: Colors.white24,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        timeRemaining <= 3 ? Colors.red : Colors.white,
                      ),
                    ),
                  ),
                  Text(
                    timeRemaining.toString(),
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              );
            },
          ),
          SizedBox(height: 4),
          Text(
            'Time',
            style: TextStyle(
              fontSize: 12,
              color: Colors.white70,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuestionCard() {
    return Container(
      margin: EdgeInsets.only(top: 20),
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Text(
              quizzes[questionIndex]['question'],
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                height: 1.3,
              ),
            ),
          ),
          SizedBox(width: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: 100,
              child: AspectRatio(
                aspectRatio: _videoController.value.aspectRatio,
                child: VideoPlayer(_videoController),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnswers() {
    List<String> answers = [
      quizzes[questionIndex]['correct_answer'],
      ...quizzes[questionIndex]['incorrect_answers'],
    ];

    return GridView.count(
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      childAspectRatio: 2.5,
      mainAxisSpacing: 16,
      crossAxisSpacing: 16,
      children: List.generate(answers.length, (index) {
        bool isSelected = selectedAnswerIndex == index;
        bool isCorrect =
            index == quizzes[questionIndex]['correct_answer_index'];
        bool showResult = hasAnswered;

        Color backgroundColor = Colors.white;
        Color borderColor = Colors.transparent;
        if (showResult) {
          if (isCorrect) {
            backgroundColor = Colors.green.shade400;
            borderColor = Colors.green.shade700;
          } else if (isSelected && !isCorrect) {
            backgroundColor = Colors.red.shade400;
            borderColor = Colors.red.shade700;
          }
        } else if (isSelected) {
          backgroundColor = Colors.blue.shade400;
          borderColor = Colors.blue.shade700;
        }

        return AnimatedContainer(
          duration: Duration(milliseconds: 300),
          child: ElevatedButton(
            onPressed: hasAnswered ? null : () => _selectAnswer(index),
            style: ElevatedButton.styleFrom(
              backgroundColor: backgroundColor,
              foregroundColor:
                  showResult || isSelected ? Colors.white : Colors.black87,
              elevation: isSelected ? 8 : 2,
              padding: EdgeInsets.symmetric(horizontal: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: borderColor, width: 2),
              ),
            ),
            child: Text(
              answers[index],
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        );
      }),
    );
  }

  Widget _buildWaitingScreen() {
    return Container(
      padding: EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'Welcome to HQ Trivia!',
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              shadows: [
                Shadow(
                  color: Colors.black26,
                  offset: Offset(0, 2),
                  blurRadius: 4,
                ),
              ],
            ),
          ),
          SizedBox(height: 16),
          Text(
            'Get ready to test your knowledge!',
            style: TextStyle(
              fontSize: 18,
              color: Colors.white70,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 40),
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 10,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: ElevatedButton(
              onPressed: startGame,
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 40, vertical: 20),
                backgroundColor: Colors.white,
                foregroundColor: Color(0xFF000067),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.play_arrow, size: 28),
                  SizedBox(width: 8),
                  Text(
                    'Start Game',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 24),
          _buildLeaderboardButton(),
        ],
      ),
    );
  }

  Widget _buildLeaderboardButton() {
    return TextButton.icon(
      onPressed: () => _showLeaderboard(),
      icon: Icon(Icons.leaderboard, color: Colors.white70),
      label: Text(
        'View Leaderboard',
        style: TextStyle(
          color: Colors.white70,
          fontSize: 16,
        ),
      ),
    );
  }

  void _showLeaderboard() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Leaderboard',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF000067),
              ),
            ),
            SizedBox(height: 20),
            _buildLeaderboardList(),
          ],
        ),
      ),
    );
  }

  Widget _buildLeaderboardList() {
    // Dummy data for demonstration
    final leaderboardData = [
      {'name': 'Player 1', 'score': 1200},
      {'name': 'Player 2', 'score': 1000},
      {'name': 'Player 3', 'score': 800},
    ];

    return ListView.separated(
      shrinkWrap: true,
      itemCount: leaderboardData.length,
      separatorBuilder: (context, index) => Divider(),
      itemBuilder: (context, index) {
        final player = leaderboardData[index];
        return ListTile(
          leading: CircleAvatar(
            backgroundColor: Color(0xFF000067),
            child: Text(
              '${index + 1}',
              style: TextStyle(color: Colors.white),
            ),
          ),
          title: Text(player['name'] as String),
          trailing: Text(
            '${player['score']} pts',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xFF000067),
            ),
          ),
        );
      },
    );
  }

 

  @override
  void dispose() {
    _timer?.cancel();
    audioPlayer.dispose();
    _videoController.dispose();
    _hiddenVideoController.dispose();
    _timerAnimationController.dispose();
    super.dispose();
  }
}
