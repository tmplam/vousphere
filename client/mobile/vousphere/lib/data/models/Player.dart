class Player {
  final String id;
  final String name;
  final String email;
  final String status;

  Player({
    required this.id,
    required this.name,
    required this.email,
    required this.status,
  });

  factory Player.fromJson(Map<String, dynamic> json) {
    return Player(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      status: json['status'] ?? '',
    );
  }
}
