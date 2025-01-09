import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/data/models/Event.dart';
import 'package:vousphere/features/event-detail/presentation/EventDetailPage.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';

class EventItem extends StatelessWidget {
  const EventItem({super.key, required this.event});

  final Event event;

  @override
  Widget build(BuildContext context) {

    UserProvider userProvider = Provider.of<UserProvider>(context, listen: true);

    return Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        height: 120,
        color: Colors.white,
        child: GestureDetector(
          onTap: () async {
            await Navigator.push(
                context,
                PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => EventDetailPage(event: event),));
          },
          child: Card(
            color: Colors.white,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(10)),
              side: BorderSide(
                color: Colors.grey,
                width: 0.3,
              ),
            ),
            elevation: 2,
            child: Row(
              children: [
                SizedBox(
                  width: 120,
                  height: 120,
                  child: ClipRRect(
                    borderRadius: const BorderRadius.only(topLeft: Radius.circular(10), bottomLeft: Radius.circular(10)),
                    child: Image.network(
                      event.image,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Image.network(
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s',
                            fit: BoxFit.cover,
                        );
                      },
                    ),
                  ),
                ),
                const SizedBox(width: 10,),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              event.name,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                              overflow: TextOverflow.ellipsis,
                              maxLines: 2,
                            ),
                            Row(
                              children: [
                                const Icon(Icons.calendar_today, color: Colors.green, size: 15,),
                                const SizedBox(width: 10),
                                Text(
                                  event.startTime.toIso8601String(),
                                  style: const TextStyle(fontSize: 14),
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                const Icon(Icons.timer, color: Colors.redAccent, size: 15,),
                                const SizedBox(width: 10),
                                Text(
                                  event.endTime.toIso8601String(),
                                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      userProvider.isFavorite(event.id)
                      ? Container(
                          margin: const EdgeInsets.fromLTRB(0, 0, 10, 0),
                          decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              color: Colors.red.shade50,
                          ),
                          child: IconButton(
                              onPressed: () async {
                                await userProvider.removeFromFavorite(event.id);
                              },
                              icon: const Icon(Icons.favorite, color: Colors.red)
                          )
                      )
                      : Container(
                          margin: const EdgeInsets.fromLTRB(0, 0, 10, 0),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            color: Colors.white,
                          ),
                          child: IconButton(
                            onPressed: () async {
                              await userProvider.addToFavorite(event.id);
                            },
                            icon: const Icon(Icons.favorite_outline, color: Colors.red),
                          )
                      ),
                    ],
                  ),
                )
              ],
          ),
          // shadowColor: Colors.blue,
                ),
        )
    );
  }
}
