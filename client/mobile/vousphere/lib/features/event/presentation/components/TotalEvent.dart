import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/features/event/provider/EventProvider.dart';

class TotalEvent extends StatelessWidget {
  const TotalEvent({super.key});

  @override
  Widget build(BuildContext context) {

    EventProvider eventProvider = Provider.of<EventProvider>(context, listen: true);

    if(eventProvider.isLoading) {
      return const SizedBox.shrink();
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        const SizedBox(width: 10,),
        Text(
            'Total events: ${eventProvider.totalEvents}',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
        ),
      ],
    );
  }
}
