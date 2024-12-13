import 'package:flutter/material.dart';
import 'package:vousphere/data/models/Event.dart';

class EventDetailPage extends StatelessWidget {
  const EventDetailPage({super.key, required this.event});

  final Event event;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Event Detail', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade700),),
      ),
      body: const Placeholder(),
    );
  }
}
