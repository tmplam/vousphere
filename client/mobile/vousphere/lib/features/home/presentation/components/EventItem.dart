import 'package:flutter/material.dart';
import 'package:vousphere/data/models/Event.dart';
import 'package:vousphere/features/event-detail/presentation/EventDetailPage.dart';

class EventItem extends StatelessWidget {
  const EventItem({super.key, required this.event});

  final Event event;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(0, 0, 10, 0),
      child: GestureDetector(
        onTap: () async {
          await Navigator.push(
              context,
              PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => EventDetailPage(event: event,),));
        },
        child: Card(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Image and Date
                Stack(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        event.image,
                        height: 120,
                        width: 240,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          children: [
                            Text(
                              event.day.day.toString(),
                              style: const TextStyle(
                                color: Colors.red,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              'Mar',
                              style: TextStyle(
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            color: Colors.red.shade50
                          ),
                          child: IconButton(onPressed: () {}, icon: Icon(Icons.favorite, color: Colors.red,))
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 8),

                // Title
                Text(
                  event.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),

                const SizedBox(height: 8),

                // Avatars and Count
                Row(
                  children: [
                    const SizedBox(
                      width: 100,
                      child: Stack(
                        children: [
                          CircleAvatar(
                            radius: 16,
                            backgroundImage: NetworkImage('https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png'),
                          ),
                          Positioned(
                            left: 25,
                            child: CircleAvatar(
                              radius: 16,
                              backgroundImage: NetworkImage('https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png'),
                            ),
                          ),
                          Positioned(
                            left: 50,
                            child: CircleAvatar(
                              radius: 16,
                              backgroundImage: NetworkImage('https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png'),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '+${event.numberOfPeople} Going',
                      style: TextStyle(
                        color: Colors.blue.shade700,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 8),

                // Location
                Row(
                  children: [
                    const Icon(
                      Icons.location_on,
                      size: 20,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      event.address,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
