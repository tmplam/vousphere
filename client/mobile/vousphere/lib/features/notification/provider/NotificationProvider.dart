import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/Notification.dart';

class NotificationProvider with ChangeNotifier {
  List<NotificationModel> notifications = [];
  bool isLoading = false;
  int page = 1;
  int totalPage = 1;
  int totalNotifications = 0;
  final ApiService apiService;

  NotificationProvider(this.apiService);

  void setLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }

  void clearNotifications() {
    notifications.clear();
    page = 1;
    totalPage = 1;
    totalNotifications = 0;
    notifyListeners();
  }

  Future<void> loadNotifications() async {
    if (isLoading) return;

    setLoading(true);

    try {
      final response = await apiService.dio.get(
        "${ApiConstants.baseUrl}/notification-service/api/notifications",
        queryParameters: {
          "page": page,
          "perPage": 5,
        },
        options: Options(extra: {"requireToken": true}),
      );

      if (response.statusCode == 200 && response.data['isSuccess']) {
        page = response.data["data"]["page"];
        totalPage = response.data["data"]["totalPage"];
        totalNotifications = response.data["data"]["total"];

        final newNotifications = List<NotificationModel>.from(
          response.data["data"]["data"]
              .map((item) => NotificationModel.fromJson(item)),
        );

        for (var notification in newNotifications) {
          if (!notifications.any((n) => n.id == notification.id)) {
            notifications.add(notification);
          }
        }

        setLoading(false);
        notifyListeners();
      }
    } catch (e) {
      print("Error loading notifications: $e");
      setLoading(false);
    }
  }

  Future<void> markAllAsSeen() async {
    try {
      await apiService.dio.patch(
        "${ApiConstants.baseUrl}/notification-service/api/notifications/seen-all",
        options: Options(extra: {"requireToken": true}),
      );

      notifications = notifications.map((notification) {
        return NotificationModel(
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          createdAt: notification.createdAt,
          isSeen: true,
        );
      }).toList();

      notifyListeners();
    } catch (e) {
      print("Error marking all notifications as seen: $e");
    }
  }

  Future<void> markAsSeen(String notificationId) async {
    try {
      await apiService.dio.patch(
        "${ApiConstants.baseUrl}/notification-service/api/notifications/$notificationId/toggle-seen",
        options: Options(extra: {"requireToken": true}),
      );

      final index = notifications.indexWhere((n) => n.id == notificationId);
      if (index != -1) {
        notifications[index] = NotificationModel(
          id: notifications[index].id,
          userId: notifications[index].userId,
          type: notifications[index].type,
          title: notifications[index].title,
          message: notifications[index].message,
          data: notifications[index].data,
          createdAt: notifications[index].createdAt,
          isSeen: true,
        );
        notifyListeners();
      }
    } catch (e) {
      print("Error marking notification as seen: $e");
    }
  }
}
