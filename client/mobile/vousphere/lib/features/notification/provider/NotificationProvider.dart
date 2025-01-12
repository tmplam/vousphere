import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:web_socket_channel/io.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/Notification.dart';

class NotificationProvider with ChangeNotifier {
  List<NotificationModel> notifications = [];
  bool isLoading = false;
  int page = 1;
  int totalPage = 1;
  int totalNotifications = 0;
  int _unreadCount = 0;
  final ApiService apiService;
  IOWebSocketChannel? _channel;
  bool _isConnected = false;

  NotificationProvider(this.apiService) {
    loadNotifications();
    _connectWebSocket();
  }

  int get unreadCount => _unreadCount;
  bool get isConnected => _isConnected;

  void _connectWebSocket() async {
    try {
      print('Attempting to connect to WebSocket...');
      await apiService.loadTokens();
      final token = apiService.token;

      if (token == null) {
        print('No token available');
        return;
      }

      final headers = {
        'Authorization': 'Bearer $token',
      };

      final socket = await WebSocket.connect(
        '${ApiConstants.baseUrlSiglr} /notification-service/hub/notifications/player',
        headers: headers,
      );

      _channel = IOWebSocketChannel(socket);

      // Send initial handshake
      _channel?.sink
          .add(jsonEncode({"protocol": "json", "version": 1}) + '\u001e');
      print('WebSocket handshake sent.');

      _channel?.stream.listen(
        (message) {
          print('WebSocket message received: $message');
          _handleWebSocketMessage(message);
        },
        onDone: () {
          print('WebSocket connection closed.');
          _isConnected = false;
          notifyListeners();
          // Attempt to reconnect after a delay
          Future.delayed(Duration(seconds: 5), _connectWebSocket);
        },
        onError: (error) {
          print('WebSocket error: $error');
          _isConnected = false;
          notifyListeners();
        },
      );

      _isConnected = true;
      notifyListeners();
      print('WebSocket connected.');
    } catch (e) {
      print('WebSocket connection error: $e');
      _isConnected = false;
      notifyListeners();
    }
  }

  void _handleWebSocketMessage(String message) {
    try {
      // Remove the delimiter character before parsing JSON
      final cleanedMessage = message.replaceAll('\u001e', '');
      final data = jsonDecode(cleanedMessage);

      // Check if it's a notification message
      if (data['type'] == 1 && data['target'] == 'ReceivePlayerNotification') {
        final newNotification =
            NotificationModel.fromJson(data['arguments'][0]);

        // Check if notification already exists
        final existingIndex =
            notifications.indexWhere((n) => n.id == newNotification.id);

        if (existingIndex != -1) {
          // Update existing notification
          notifications[existingIndex] = newNotification;
        } else {
          // Add new notification at the beginning of the list
          notifications.insert(0, newNotification);
          totalNotifications++;
        }

        // Update unread count
        _calculateUnreadCount();

        // Notify listeners to update the UI
        notifyListeners();
      } else {
        print('Unhandled WebSocket message type: ${data['type']}');
      }
    } catch (e) {
      print('Error handling WebSocket message: $e');
    }
  }

  @override
  void dispose() {
    _channel?.sink.close();
    super.dispose();
  }

  void setLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }

  void clearNotifications() {
    notifications.clear();
    page = 1;
    totalPage = 1;
    totalNotifications = 0;
    _unreadCount = 0;
    notifyListeners();
  }

  void _calculateUnreadCount() {
    _unreadCount = notifications.where((n) => !n.isSeen).length;
    print('Unread count realtime: $_unreadCount');
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

        if (page == 1) {
          // For first page, replace all notifications
          notifications = newNotifications;
        } else {
          // For subsequent pages, add only unique notifications
          for (var notification in newNotifications) {
            if (!notifications.any((n) => n.id == notification.id)) {
              notifications.add(notification);
            }
          }
        }

        _calculateUnreadCount();
        notifyListeners();
      }
    } catch (e) {
      print("Error loading notifications: $e");
      if (e is DioError) {
        print("DioError details: ${e.response?.data}");
        print("DioError status code: ${e.response?.statusCode}");
      }
    } finally {
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

      _unreadCount = 0;
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

        _calculateUnreadCount();
        notifyListeners();
      }
    } catch (e) {
      print("Error marking notification as seen: $e");
    }
  }
}
