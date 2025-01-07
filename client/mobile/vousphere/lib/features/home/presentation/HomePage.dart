import 'package:flutter/material.dart';
import 'package:vousphere/features/event/presentation/EventPage.dart';
import 'package:vousphere/features/home/presentation/components/EventList.dart';
import 'package:vousphere/features/home/presentation/components/HomeFilter.dart';
import 'package:vousphere/features/home/presentation/components/HomeSearchBox.dart';
import 'package:vousphere/features/home/presentation/components/InviteFriendItem.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 10),
      child: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 10,),
            const HomeSearchBox(),
            const SizedBox(height: 10,),
            const HomeFilter(),
            const SizedBox(height: 10,),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Newest Events', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('See all', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),),
                    IconButton(
                        onPressed: () {
                          Navigator.push(
                              context,
                              PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => EventPage(),));
                        },
                        icon: const Icon(Icons.arrow_forward,)
                    )
                  ],
                )
              ],
            ),
            const EventList(),
            const SizedBox(height: 10,),
            const InviteFriendItem(),
            const SizedBox(height: 10,),
            
          ],
        ),
      ),
    );
  }
}
