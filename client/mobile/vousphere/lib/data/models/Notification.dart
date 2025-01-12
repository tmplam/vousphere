class NotificationModel {
  final String id;
  final String userId;
  final String type;
  final String title;
  final String message;
  final Map<String, dynamic> data;
  final DateTime createdAt;
  final bool isSeen;

  NotificationModel({
    required this.id,
    required this.userId,
    required this.type,
    required this.title,
    required this.message,
    required this.data,
    required this.createdAt,
    required this.isSeen,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'],
      userId: json['userId'],
      type: json['type'],
      title: json['title'],
      message: json['message'],
      data: json['data'],
      createdAt: DateTime.parse(json['createdAt']),
      isSeen: json['isSeen'],
    );
  }
}
