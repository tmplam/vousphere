import 'package:vousphere/data/models/Game/Option.dart';

class Question {
  final String id;
  final String content;
  final List<Option> options;

  Question({
    required this.id,
    required this.content,
    required this.options,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'],
      content: json['content'],
      options:
          (json['options'] as List).map((o) => Option.fromJson(o)).toList(),
    );
  }
}
