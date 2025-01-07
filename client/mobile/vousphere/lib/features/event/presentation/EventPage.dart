import 'package:flutter/material.dart';
import 'package:vousphere/features/event/presentation/components/SearchBox.dart';
import 'package:vousphere/features/event/presentation/components/EventList.dart';

class EventPage extends StatefulWidget {
  const EventPage({super.key});

  @override
  State<EventPage> createState() => _EventPageState();
}

class _EventPageState extends State<EventPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Events',
          style: TextStyle(
              fontWeight: FontWeight.bold, color: Colors.blue.shade700),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ),
      body: const Padding(
        padding: EdgeInsets.symmetric(horizontal: 5),
        child: Column(
          children: [
            SizedBox(height: 10,),
            SearchBox(),
            SizedBox(height: 10,),
            Expanded(child: EventList())
          ],
        ),
      ),
    );
  }
}
