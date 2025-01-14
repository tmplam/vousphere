import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/core/utils/DateUtils.dart';
import 'package:vousphere/data/models/Event.dart';
import 'package:vousphere/features/event-detail/presentation/EventDetailPage.dart';
import 'package:vousphere/features/home/provider/HomeProvider.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';

class EventItem extends StatelessWidget {
  const EventItem({super.key, required this.event});

  final Event event;

  @override
  Widget build(BuildContext context) {
    UserProvider userProvider =
        Provider.of<UserProvider>(context, listen: true);
    HomeProvider homeProvider =
        Provider.of<HomeProvider>(context, listen: true);

    bool isDisplay = true;

    if (homeProvider.category.toLowerCase() != 'all') {
      if (event.brand.domain.toLowerCase() !=
          homeProvider.category.toLowerCase()) {
        isDisplay = false;
      }
    }
    if (!isDisplay) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.fromLTRB(0, 0, 10, 0),
      child: GestureDetector(
        onTap: () async {
          await Navigator.push(
              context,
              PageRouteBuilder(
                pageBuilder: (context, animation, secondaryAnimation) =>
                    EventDetailPage(
                  event: event,
                ),
              ));
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
                        errorBuilder: (context, error, stackTrace) {
                          return Image.asset(
                            'assets/brands/brand3.jpg',
                            fit: BoxFit.cover,
                            height: 120,
                            width: 240,
                          );
                        },
                      ),
                    ),
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding:
                            EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          children: [
                            Text(
                              event.startTime.day.toString(),
                              style: const TextStyle(
                                color: Colors.red,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              DateTimeUtils.getMonthMMM(event.startTime),
                              style: const TextStyle(
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
                      child: userProvider.isFavorite(event.id)
                          ? Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                color: Colors.red.shade50,
                              ),
                              child: IconButton(
                                onPressed: () async {
                                  userProvider.removeFromFavorite(event.id);
                                },
                                icon: const Icon(
                                  Icons.favorite,
                                  color: Colors.red,
                                ),
                              ))
                          : Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(8),
                                color: Colors.white,
                              ),
                              child: IconButton(
                                onPressed: () async {
                                  userProvider.addToFavorite(event.id);
                                },
                                icon: const Icon(
                                  Icons.favorite_border_outlined,
                                  color: Colors.red,
                                ),
                              )),
                    ),
                  ],
                ),

                const SizedBox(height: 8),

                // Title
                SizedBox(
                  width: 240,
                  child: Text(
                    event.name,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),

                const SizedBox(height: 8),

                // Avatars and Count
                Row(
                  children: [
                    const SizedBox(
                      width: 40,
                      child: Stack(
                        children: [
                          CircleAvatar(
                            radius: 16,
                            backgroundImage:
                                AssetImage('assets/icons/voucher-icon.png'),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '+${event.totalVouchers} Vouchers',
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
                    Icon(
                      Icons.location_on,
                      size: 20,
                      color: Colors.blue.shade700,
                    ),
                    const SizedBox(width: 4),
                    SizedBox(
                      width: 200,
                      child: Text(
                        event.brand.address ?? 'HCMC, Vietnam',
                        overflow: TextOverflow.ellipsis,
                      ),
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
