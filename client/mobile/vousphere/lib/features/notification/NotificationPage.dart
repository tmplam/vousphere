import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class NotificationPage extends StatefulWidget {
  const NotificationPage({Key? key}) : super(key: key);

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  late List<Map<String, dynamic>> _notifications;

  @override
  void initState() {
    super.initState();
    _notifications = [
      {
        'id': 'guid-1',
        'type': 'GAME_EVENT',
        'title': 'New Game Event: Lucky Shake 🎮',
        'message':
            'Coffee House just launched a new shake game event with prizes up to 500K VND',
        'data': {
          'eventId': 'evt-123',
          'brandName': 'Coffee House',
          'startTime':
              DateTime.now().add(const Duration(hours: 2)).toIso8601String(),
          'endTime':
              DateTime.now().add(const Duration(days: 7)).toIso8601String(),
          'totalPrizes': '500.000 VND',
          'gameType': 'SHAKE_GAME',
        },
        'createdAt': DateTime.now()
            .subtract(const Duration(minutes: 5))
            .toIso8601String(),
        'isSeen': false,
        'priority': 'high',
      },
      {
        'id': 'guid-2',
        'type': 'VOUCHER_RECEIVED',
        'title': 'Congratulations! New Voucher Received 🎁',
        'message': 'You won a 50% discount voucher from Pizza Express',
        'data': {
          'voucherId': 'VC789012',
          'brandName': 'Pizza Express',
          'value': '50%',
          'expiryDate':
              DateTime.now().add(const Duration(days: 30)).toIso8601String(),
          'qrCode': 'qr_data_here',
          'usageType': 'OFFLINE',
          'status': 'ACTIVE'
        },
        'createdAt':
            DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
        'isSeen': false,
        'priority': 'high',
      },
      {
        'id': 'guid-3',
        'type': 'ITEM_GIFT',
        'title': 'New Gift Received! 🎉',
        'message':
            'Your friend Minh has sent you a Gold Token for the Lucky Draw game',
        'data': {
          'fromUser': 'Minh',
          'fromUserId': 'user123',
          'itemId': 'item789',
          'itemName': 'Gold Token',
          'gameId': 'game456',
          'gameName': 'Lucky Draw'
        },
        'createdAt':
            DateTime.now().subtract(const Duration(hours: 5)).toIso8601String(),
        'isSeen': true,
        'priority': 'medium',
      },
      {
        'id': 'guid-4',
        'type': 'GAME_TURNS',
        'title': 'Free Game Turns! 🎮',
        'message': 'You received 5 free game turns for sharing on Facebook',
        'data': {
          'turnsReceived': 5,
          'reason': 'FACEBOOK_SHARE',
          'totalTurns': 15,
          'gameId': 'game456',
          'gameName': 'Lucky Draw'
        },
        'createdAt':
            DateTime.now().subtract(const Duration(days: 1)).toIso8601String(),
        'isSeen': true,
        'priority': 'low',
      },
      {
        'id': 'guid-5',
        'type': 'VOUCHER_EXPIRING',
        'title': 'Voucher Expiring Soon! ⚠️',
        'message': 'Your Coffee House voucher will expire in 24 hours',
        'data': {
          'voucherId': 'VC123456',
          'brandName': 'Coffee House',
          'value': '100.000 VND',
          'expiryDate':
              DateTime.now().add(const Duration(days: 1)).toIso8601String(),
          'qrCode': 'qr_data_here',
          'usageType': 'OFFLINE',
          'status': 'ACTIVE'
        },
        'createdAt':
            DateTime.now().subtract(const Duration(days: 2)).toIso8601String(),
        'isSeen': true,
        'priority': 'high',
      },
    ];
  }

  void _markAsSeen(String notificationId) {
    setState(() {
      final index = _notifications.indexWhere((n) => n['id'] == notificationId);
      if (index != -1) {
        _notifications[index] = {
          ..._notifications[index],
          'isSeen': true,
        };
      }
    });
  }

  void _markAllAsSeen() {
    setState(() {
      _notifications = _notifications
          .map((notification) => {
                ...notification,
                'isSeen': true,
              })
          .toList();
    });
  }

  void _deleteNotification(String notificationId) {
    setState(() {
      _notifications.removeWhere((n) => n['id'] == notificationId);
    });
  }

  void _handleNotificationTap(Map<String, dynamic> notification) {
    _markAsSeen(notification['id']);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          child: Container(
            width: double.infinity,
            constraints: const BoxConstraints(maxWidth: 400),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header with icon and title
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blue[50],
                    borderRadius:
                        const BorderRadius.vertical(top: Radius.circular(16)),
                  ),
                  child: Row(
                    children: [
                      _buildNotificationIcon(notification['type']),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              notification['title'],
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _formatDate(notification['createdAt']),
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                      _buildPriorityBadge(notification['priority']),
                    ],
                  ),
                ),

                // Message content
                Container(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    notification['message'],
                    style: const TextStyle(
                      fontSize: 16,
                      height: 1.5,
                    ),
                  ),
                ),

                // Divider
                Divider(color: Colors.grey[200], height: 1),

                // Details section
                Container(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.info_outline,
                              size: 18, color: Colors.blue),
                          const SizedBox(width: 8),
                          Text(
                            'Additional Details',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey[800],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ...notification['data'].entries.map((entry) => Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${entry.key}:',
                                  style: TextStyle(
                                    color: Colors.grey[600],
                                    fontSize: 14,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    '${entry.value}',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          )),
                    ],
                  ),
                ),

                // Actions
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                    borderRadius: const BorderRadius.vertical(
                        bottom: Radius.circular(16)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton.icon(
                        icon: const Icon(Icons.share_outlined),
                        label: const Text('Share'),
                        onPressed: () {
                          // Handle share functionality
                        },
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: () => Navigator.of(context).pop(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 24, vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text('Done'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: _buildAppBar(),
      body: _buildBody(),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    final unreadCount = _notifications.where((n) => !n['isSeen']).length;

    return AppBar(
      elevation: 0,
      backgroundColor: Colors.white,
      title: Row(
        children: [
          const Text(
            'Notifications',
            style: TextStyle(
              color: Colors.black87,
              fontWeight: FontWeight.w600,
              fontSize: 24,
            ),
          ),
          if (unreadCount > 0) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.blue[600],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                '$unreadCount',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ],
      ),
      actions: [
        if (unreadCount > 0)
          TextButton.icon(
            icon: const Icon(Icons.done_all, color: Colors.blue),
            label: const Text(
              '',
              style: TextStyle(color: Colors.blue),
            ),
            onPressed: _markAllAsSeen,
          ),
        IconButton(
          icon: const Icon(Icons.filter_list, color: Colors.black87),
          onPressed: () {
            // Handle filter
          },
          tooltip: 'Filter notifications',
        ),
      ],
    );
  }

  Widget _buildBody() {
    return _notifications.isEmpty
        ? _buildEmptyState()
        : RefreshIndicator(
            onRefresh: () async {
              // Handle refresh
              await Future.delayed(const Duration(seconds: 1));
            },
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 8),
              itemCount: _notifications.length,
              itemBuilder: (context, index) {
                final notification = _notifications[index];
                return _buildNotificationCard(context, notification);
              },
            ),
          );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.notifications_none_outlined,
            size: 120,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 24),
          Text(
            'All Caught Up!',
            style: TextStyle(
              fontSize: 20,
              color: Colors.grey[800],
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'No new notifications at the moment',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () {
              // Handle refresh
            },
            icon: const Icon(Icons.refresh),
            label: const Text('Refresh'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(
      BuildContext context, Map<String, dynamic> notification) {
    return Dismissible(
      key: Key(notification['id']),
      background: _buildDismissBackground(),
      secondaryBackground: _buildDeleteBackground(),
      confirmDismiss: (direction) async {
        if (direction == DismissDirection.startToEnd) {
          _markAsSeen(notification['id']);
          return false;
        } else {
          final shouldDelete = await showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: const Text('Delete Notification'),
                content: const Text(
                    'Are you sure you want to delete this notification?'),
                actions: [
                  TextButton(
                    child: const Text('Cancel'),
                    onPressed: () => Navigator.of(context).pop(false),
                  ),
                  TextButton(
                    child: const Text('Delete'),
                    onPressed: () => Navigator.of(context).pop(true),
                  ),
                ],
              );
            },
          );
          if (shouldDelete == true) {
            _deleteNotification(notification['id']);
          }
          return false;
        }
      },
      child: Card(
        elevation: 0,
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: Colors.grey[200]!,
            width: 1,
          ),
        ),
        child: InkWell(
          onTap: () => _handleNotificationTap(notification),
          borderRadius: BorderRadius.circular(12),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              color: notification['isSeen'] ? Colors.white : Colors.blue[50],
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildNotificationIcon(notification['type']),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                notification['title'],
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: notification['isSeen']
                                      ? FontWeight.w500
                                      : FontWeight.w600,
                                  color: Colors.black87,
                                ),
                              ),
                            ),
                            _buildPriorityBadge(notification['priority']),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          notification['message'],
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 8),
                        _buildNotificationFooter(notification),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDismissBackground() {
    return Container(
      alignment: Alignment.centerLeft,
      padding: const EdgeInsets.only(left: 20),
      color: Colors.green[400],
      child: const Icon(
        Icons.check,
        color: Colors.white,
      ),
    );
  }

  Widget _buildDeleteBackground() {
    return Container(
      alignment: Alignment.centerRight,
      padding: const EdgeInsets.only(right: 20),
      color: Colors.red[400],
      child: const Icon(
        Icons.delete_outline,
        color: Colors.white,
      ),
    );
  }

  Widget _buildNotificationIcon(String type) {
    IconData icon;
    Color color;
    Color backgroundColor;

    switch (type) {
      case 'ORDER':
        icon = Icons.shopping_bag_outlined;
        color = Colors.purple[700]!;
        backgroundColor = Colors.purple[50]!;
        break;
      case 'PROMO':
        icon = Icons.local_offer_outlined;
        color = Colors.green[600]!;
        backgroundColor = Colors.green[50]!;
        break;
      case 'ACHIEVEMENT':
        icon = Icons.emoji_events_outlined;
        color = Colors.amber[700]!;
        backgroundColor = Colors.amber[50]!;
        break;
      case 'DELIVERY':
        icon = Icons.local_shipping_outlined;
        color = Colors.blue[600]!;
        backgroundColor = Colors.blue[50]!;
        break;
      case 'SYSTEM':
        icon = Icons.security_outlined;
        color = Colors.red[600]!;
        backgroundColor = Colors.red[50]!;
        break;
      default:
        icon = Icons.notifications_outlined;
        color = Colors.grey[600]!;
        backgroundColor = Colors.grey[100]!;
    }

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(
        icon,
        size: 24,
        color: color,
      ),
    );
  }

  Widget _buildPriorityBadge(String priority) {
    Color color;
    switch (priority) {
      case 'high':
        color = Colors.red[400]!;
        break;
      case 'medium':
        color = Colors.orange[400]!;
        break;
      default:
        color = Colors.grey[400]!;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        priority.toUpperCase(),
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  Widget _buildNotificationFooter(Map<String, dynamic> notification) {
    return Row(
      children: [
        Icon(
          Icons.access_time,
          size: 14,
          color: Colors.grey[500],
        ),
        const SizedBox(width: 4),
        Text(
          _formatDate(notification['createdAt']),
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[500],
          ),
        ),
        const Spacer(),
        if (!notification['isSeen'])
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.blue[600],
            ),
          ),
      ],
    );
  }

  String _formatDate(String dateString) {
    final date = DateTime.parse(dateString);
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inHours < 1) {
      final minutes = difference.inMinutes;
      return '$minutes ${minutes == 1 ? 'minute' : 'minutes'} ago';
    } else if (difference.inDays < 1) {
      final hours = difference.inHours;
      return '$hours ${hours == 1 ? 'hour' : 'hours'} ago';
    } else if (difference.inDays < 7) {
      final days = difference.inDays;
      return '$days ${days == 1 ? 'day' : 'days'} ago';
    } else {
      return DateFormat('MMM d, y').format(date);
    }
  }
}
