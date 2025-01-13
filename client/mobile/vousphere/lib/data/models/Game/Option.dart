class Option {
  final String id;
  final String content;

  Option({
    required this.id,
    required this.content,
  });

  factory Option.fromJson(Map<String, dynamic> json) {
    return Option(
      id: json['id'],
      content: json['content'],
    );
  }
}