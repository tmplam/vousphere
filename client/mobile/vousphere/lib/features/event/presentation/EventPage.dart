import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/features/event/presentation/components/SearchBox.dart';
import 'package:vousphere/features/event/presentation/components/EventList.dart';
import 'package:vousphere/features/event/presentation/components/TotalEvent.dart';
import 'package:vousphere/features/event/provider/EventProvider.dart';

class EventPage extends StatelessWidget {
  const EventPage({super.key, required this.keyword});

  final String keyword;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => EventProvider(keyword: keyword),
      child: Scaffold(
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
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 5),
          child: Column(
            children: [
              const SizedBox(height: 10,),
              SearchBox(),
              const SizedBox(height: 10,),
              const TotalEvent(),
              const SizedBox(height: 10,),
              const Expanded(child: EventList())
            ],
          ),
        ),
      ),
    );
  }
}
