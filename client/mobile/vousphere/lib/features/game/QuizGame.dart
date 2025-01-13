import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/Event.dart';
import 'package:vousphere/data/models/Game/Player.dart';
import 'package:vousphere/data/models/Game/QuizInfo.dart';
import 'package:web_socket_channel/io.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'dart:io';

class QuizGame extends StatefulWidget {
  final Event event;

  const QuizGame({
    Key? key,
    required this.event,
  }) : super(key: key);

  @override
  State<QuizGame> createState() => _QuizGameState();
}

enum GameState {
  connecting,
  waitingRoom,
  countdown,
  playing,
  showingAnswer,
  finished
}

class _QuizGameState extends State<QuizGame> with TickerProviderStateMixin {
  WebSocketChannel? _channel;
  GameState _gameState = GameState.connecting;
  QuizInfo? quizInfo;
  List<Player> players = [];
  int questionIndex = 0;
  int timeRemaining = 15;
  int score = 0;
  String? selectedAnswerId;
  bool hasAnswered = false;
  Timer? _timer;
  late AnimationController _timerAnimationController;
  String? correctAnswerId;
  late VideoPlayerController _videoController;
  bool _isVideoInitialized = false;

  final _connectionLock = Object();
  bool _isReconnecting = false;
  DateTime? _lastMessageTime;
  Timer? _heartbeatTimer;
  Timer? _reconnectionTimer;
  int _reconnectAttempts = 0;
  static const int maxReconnectAttempts = 5;
  String? token;
  final ApiService apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _initializeVideo();
    _initializeAnimations();
    _connectWebSocket();
    _startHeartbeat();
  }

  Future<void> _initializeVideo() async {
    _videoController = VideoPlayerController.asset('assets/start.mp4');
    await _videoController.initialize();
    _videoController.setLooping(true);
    setState(() {
      _isVideoInitialized = true;
    });
    _videoController.play();
  }

  void _initializeAnimations() {
    _timerAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 15),
    );
  }

  void _startHeartbeat() {
    _heartbeatTimer?.cancel();
    _heartbeatTimer = Timer.periodic(const Duration(seconds: 30), (timer) {
      if (_gameState != GameState.connecting && _channel != null) {
        _sendHeartbeat();
      }
    });
  }

  void _sendHeartbeat() {
    try {
      _channel?.sink.add(jsonEncode({
            "type": 6 // Heartbeat type
          }) +
          '\u001e');
    } catch (e) {
      print('Error sending heartbeat: $e');
    }
  }

  Future<void> _connectWebSocket() async {
    synchronized(_connectionLock, () async {
      if (_isReconnecting) return;
      _isReconnecting = true;

      try {
        await _closeExistingConnection();
        await apiService.loadTokens();
        final token = apiService.token;

        final uri = Uri.parse(
                '${ApiConstants.baseUrlSiglr}/game-service/hub/games/quiz')
            .replace(queryParameters: {'eventId': widget.event.id.toString()});

        final socket = await WebSocket.connect(
          uri.toString(),
          headers: {'Authorization': 'Bearer $token'},
        ).timeout(const Duration(seconds: 10));

        _channel = IOWebSocketChannel(socket);
        _channel?.sink
            .add(jsonEncode({"protocol": "json", "version": 1}) + '\u001e');

        _setupMessageListener();
        _lastMessageTime = DateTime.now();
        _reconnectAttempts = 0;

        setState(() => _gameState = GameState.connecting);
      } catch (e) {
        print('WebSocket connection error: $e');
        _handleConnectionError();
      } finally {
        _isReconnecting = false;
      }
    });
  }

  void _handleWebSocketMessage(dynamic message) {
    try {
      print('WebSocket Game message received: $message');
      final cleanedMessage = message.toString().replaceAll('\u001e', '');
      final data = jsonDecode(cleanedMessage);

      if (data['type'] == 6) return; // Ignore heartbeat messages

      switch (data['target']) {
        case 'ReceiveQuizInfo':
          final quizInfoData = data['arguments'][0];
          setState(() {
            quizInfo = QuizInfo.fromJson(quizInfoData);
            _gameState = GameState.waitingRoom;
          });
          break;

        case 'ReceiveNewPlayerJoined':
          final playerId = data['arguments'][0];
          final playerName = data['arguments'][1];
          setState(() {
            if (!players.any((p) => p.id == playerId)) {
              players.add(Player(id: playerId, name: playerName));
            }
          });
          break;

        case 'ReceiveQuizCountdown':
          setState(() {
            timeRemaining = data['arguments'][0];
            _gameState = GameState.countdown;
          });
          _startCountdownTimer();
          break;

        case 'ReceiveQuestion':
          final newQuestionIndex = data['arguments'][0];
          setState(() {
            questionIndex = newQuestionIndex;
            _gameState = GameState.playing;
            timeRemaining = 18;
            selectedAnswerId = null;
            hasAnswered = false;
            correctAnswerId = null;
          });
          _startQuestionTimer();
          break;

        case 'ReceiveAnswerScore':
          if (!mounted) return;
          final scoreData = data['arguments'][0];
          setState(() {
            score += (scoreData['score'] as num).toInt();
          });
          break;

        case 'ReceiveQuestionAnswer':
          if (!mounted) return;
          final questionIndex = data['arguments'][0];
          final correctOptionIndex = data['arguments'][1];
          setState(() {
            correctAnswerId = quizInfo
                ?.questions[questionIndex].options[correctOptionIndex].id;
            _gameState = GameState.showingAnswer;
          });
          Timer(const Duration(seconds: 3), () {
            if (mounted) {
              setState(() {
                _gameState = GameState.playing;
              });
            }
          });
          break;

        case 'ReceiveQuizResult':
          if (!mounted) return;
          final voucherPercentage = data['arguments'][0] as int?;
          final piece = data['arguments'][1] as int?;
          setState(() {
            _gameState = GameState.finished;
          });
          _videoController.pause(); // Pause video when game is finished
          if (piece != null) {
            _showGameResults(null, piece);
          } else if (voucherPercentage != null) {
            _showGameResults(voucherPercentage, 0);
          }
          break;
      }
    } catch (e) {
      print('Error handling WebSocket message: $e');
    }
  }

  void _startCountdownTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      setState(() {
        if (timeRemaining > 0) {
          timeRemaining--;
        } else {
          timer.cancel();
        }
      });
    });
  }

  void _startQuestionTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      setState(() {
        if (timeRemaining > 0) {
          timeRemaining--;
        } else {
          timer.cancel();
        }
      });
    });
  }

  void _submitAnswer(String optionId, int optionIndex) {
    if (hasAnswered) return;

    setState(() {
      selectedAnswerId = optionId;
      hasAnswered = true;
    });

    _channel?.sink.add(jsonEncode({
          "type": 1,
          "target": "SubmitAnswerAsync",
          "arguments": [optionIndex]
        }) +
        '\u001e');
  }

  void _showGameResults(int? voucherPercentage, int? piece) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        title: Row(
          children: [
            const Icon(Icons.celebration, color: Colors.blueAccent),
            const SizedBox(width: 10),
            const Text(
              'Game Over!',
              style: TextStyle(
                color: Colors.blueAccent,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            voucherPercentage != null
                ? Row(
                    children: [
                      const Icon(Icons.card_giftcard, color: Colors.green),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'You won a $voucherPercentage% discount voucher!',
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 18,
                          ),
                        ),
                      ),
                    ],
                  )
                : Row(
                    children: [
                      const Icon(Icons.pie_chart, color: Colors.orange),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'You won piece ${piece ?? 0}!',
                          style: const TextStyle(
                            color: Colors.blueAccent,
                            fontSize: 18,
                          ),
                        ),
                      ),
                    ],
                  ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop();
            },
            style: TextButton.styleFrom(
              backgroundColor: Colors.blueAccent,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: const Text(
              'Close',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
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
                child: _buildMainContent(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMainContent() {
    switch (_gameState) {
      case GameState.connecting:
        return _buildConnectingScreen();
      case GameState.waitingRoom:
        return _buildWaitingRoom();
      case GameState.countdown:
        return _buildCountdownScreen();
      case GameState.playing:
      case GameState.showingAnswer:
        return _buildGameScreen();
      case GameState.finished:
        return const Center(
            child: Text('Game Over!',
                style: TextStyle(color: Colors.white, fontSize: 24)));
    }
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
          if (_gameState == GameState.playing ||
              _gameState == GameState.showingAnswer)
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

  Widget _buildConnectingScreen() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(color: Colors.white),
          SizedBox(height: 16),
          Text(
            'Connecting to game server...',
            style: TextStyle(color: Colors.white, fontSize: 18),
          ),
        ],
      ),
    );
  }

  Widget _buildWaitingRoom() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          if (_isVideoInitialized)
            Container(
              height: MediaQuery.of(context).size.height * 0.3,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              clipBehavior: Clip.hardEdge,
              child: AspectRatio(
                aspectRatio: _videoController.value.aspectRatio,
                child: VideoPlayer(_videoController),
              ),
            ),
          const SizedBox(height: 24),
          Text(
            'Waiting for players...',
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

  Widget _buildCountdownScreen() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (_isVideoInitialized)
          Container(
            height: MediaQuery.of(context).size.height * 0.3,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            clipBehavior: Clip.hardEdge,
            child: AspectRatio(
              aspectRatio: _videoController.value.aspectRatio,
              child: VideoPlayer(_videoController),
            ),
          ),
        const SizedBox(height: 24),
        Text(
          'Game starts in',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 24,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          '$timeRemaining',
          style: const TextStyle(
            color: Colors.white,
            fontSize: 48,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildGameScreen() {
    if (quizInfo == null) return const SizedBox();

    final currentQuestion = quizInfo!.questions[questionIndex];

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Timer and score section
          LinearProgressIndicator(
            value: timeRemaining / 18,
            backgroundColor: Colors.grey[300],
            valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
          ),
          const SizedBox(height: 8),
          Text(
            timeRemaining > 0 ? 'Time: $timeRemaining' : 'Time Out',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 24,
            ),
          ),

          // Video player section
          if (_isVideoInitialized)
            Container(
              height: MediaQuery.of(context).size.height * 0.3,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              clipBehavior: Clip.hardEdge,
              child: AspectRatio(
                aspectRatio: _videoController.value.aspectRatio,
                child: VideoPlayer(_videoController),
              ),
            ),

          const SizedBox(height: 24),

          // Question section
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

          // Answer options grid
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
                final isSelected = selectedAnswerId == option.id;
                final isCorrect = _gameState == GameState.showingAnswer &&
                    option.id == correctAnswerId;

                Color backgroundColor;
                Color textColor;
                BoxDecoration? decoration;

                if (_gameState == GameState.showingAnswer) {
                  if (option.id == correctAnswerId) {
                    backgroundColor = Colors.white;
                    textColor = Colors.black;
                    decoration = BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.green, width: 2),
                    );
                  } else if (isSelected) {
                    backgroundColor = Colors.grey.withOpacity(0.5);
                    textColor = Colors.white;
                  } else {
                    backgroundColor = Colors.white;
                    textColor = Colors.black;
                  }
                } else {
                  backgroundColor =
                      isSelected ? Colors.grey.withOpacity(0.5) : Colors.white;
                  textColor = isSelected ? Colors.white : Colors.black;
                }

                return GestureDetector(
                  onTap: (!hasAnswered || _gameState == GameState.showingAnswer)
                      ? isSelected
                          ? null
                          : () => _submitAnswer(option.id, index)
                      : null,
                  child: Container(
                    decoration: decoration ??
                        BoxDecoration(
                          color: backgroundColor,
                          borderRadius: BorderRadius.circular(8),
                        ),
                    child: Center(
                      child: Text(
                        option.content,
                        style: TextStyle(
                          color: textColor,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _setupMessageListener() {
    _channel?.stream.listen(
      (message) {
        _lastMessageTime = DateTime.now();
        _handleWebSocketMessage(message);
      },
      onDone: () {
        setState(() => _gameState = GameState.connecting);
        _handleConnectionError();
      },
      onError: (error) {
        print('WebSocket error: $error');
        setState(() => _gameState = GameState.connecting);
        _handleConnectionError();
      },
      cancelOnError: true,
    );
  }

  void _handleConnectionError() {
    if (_reconnectAttempts < maxReconnectAttempts) {
      _reconnectAttempts++;
      final delay = Duration(seconds: _reconnectAttempts * 2);
      _reconnectionTimer?.cancel();
      _reconnectionTimer = Timer(delay, _connectWebSocket);
    } else {
      _showConnectionErrorDialog();
    }
  }

  void _showConnectionErrorDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Connection Error'),
        content: const Text(
            'Unable to connect to the game server. Please try again later.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop();
            },
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Future<void> _closeExistingConnection() async {
    try {
      await _channel?.sink.close();
      _channel = null;
    } catch (e) {
      print('Error closing existing connection: $e');
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _heartbeatTimer?.cancel();
    _reconnectionTimer?.cancel();
    _timerAnimationController.dispose();
    _videoController.dispose();
    _closeExistingConnection();
    super.dispose();
  }

  Future<T> synchronized<T>(
      Object lock, Future<T> Function() computation) async {
    try {
      return await computation();
    } finally {
      // Lock is automatically released when computation completes
    }
  }
}

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
