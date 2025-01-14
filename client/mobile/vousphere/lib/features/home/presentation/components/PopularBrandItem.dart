import 'package:flutter/material.dart';
import 'package:vousphere/core/utils/RandomUtils.dart';
import 'package:vousphere/data/models/Counterpart.dart';

class PopularBrandItem extends StatelessWidget {
  PopularBrandItem({super.key, required this.counterpart});

  final Counterpart counterpart;

  final List<int> avatars = [];

  void randomAvatar() {
    List<int> numbers = List.generate(4, (index) => index);
    numbers.shuffle(RandomUtils.random);
    avatars.addAll(numbers.sublist(0, 3));
  }

  String randomBrandImage() {
    return 'assets/brands/brand${RandomUtils.random.nextInt(5)}.jpg';
  }

  @override
  Widget build(BuildContext context) {
    randomAvatar();

    return Container(
      margin: const EdgeInsets.fromLTRB(0, 0, 10, 0),
      child: GestureDetector(
        onTap: () async {
          // await Navigator.push(
          //     context,
          //     PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => EventDetailPage(event: event,),));
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
                    SizedBox(
                      width: 240,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          ClipOval(
                            child: Image.network(
                              counterpart.image ?? '',
                              width: 100,
                              height: 100,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Image.asset(
                                  randomBrandImage(),
                                  width: 100,
                                  height: 100,
                                  fit: BoxFit.cover,
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Title
                    SizedBox(
                      width: 240,
                      child: Text(
                        textAlign: TextAlign.center,
                        counterpart.name,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),

                    Row(
                      children: [
                        const Icon(
                          Icons.phone,
                          size: 20,
                          color: Colors.green,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          counterpart.phoneNumber,
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Avatars and Count
                    Row(
                      children: [
                        SizedBox(
                          width: 90,
                          child: Stack(
                            children: [
                              CircleAvatar(
                                radius: 16,
                                backgroundImage: AssetImage('assets/avatars/avatar${avatars[0]}.png'),
                              ),
                              Positioned(
                                left: 25,
                                child: CircleAvatar(
                                  radius: 16,
                                  backgroundImage: AssetImage('assets/avatars/avatar${avatars[1]}.png'),
                                ),
                              ),
                              Positioned(
                                left: 50,
                                child: CircleAvatar(
                                  radius: 16,
                                  backgroundImage: AssetImage('assets/avatars/avatar${avatars[2]}.png'),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          '+20 Going',
                          style: TextStyle(
                            color: Colors.blue.shade700,
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
                        Container(
                          width: 200,
                          child: Text(
                            counterpart.brand?.address ?? 'HCMC, Vietnam',
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
