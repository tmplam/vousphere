import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';

class TotalFavoriteEvent extends StatelessWidget {
  const TotalFavoriteEvent({super.key});

  @override
  Widget build(BuildContext context) {

    UserProvider userProvider = Provider.of<UserProvider>(context, listen: true);

    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        const SizedBox(width: 10,),
        Text(
            'Total events: ${userProvider.favoriteEvents.length}',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
        ),
      ],
    );
  }
}
