import 'package:vousphere/data/models/Game/Question.dart';

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

  factory QuizInfo.fromJson(Map<String, dynamic> json) {
    return QuizInfo(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      questions:
          (json['questions'] as List).map((q) => Question.fromJson(q)).toList(),
    );
  }
}
