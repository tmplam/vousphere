import 'package:flutter/material.dart';
import 'package:vousphere/data/models/Event.dart';
import 'package:vousphere/features/event/presentation/components/EventItem.dart';

class EventList extends StatefulWidget {
  const EventList({super.key});

  @override
  State<EventList> createState() => _EventListState();
}

class _EventListState extends State<EventList> {

  List<Event> events = [
    Event('id', 'Sale 12/12 ten that la dai luon ne', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s', DateTime.now(), true, 20, 'Nha Trang, Khanh Hoa'),
    Event('id', 'Sale 12/12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s', DateTime.now(), true, 20, 'Nha Trang, Khanh Hoa'),
    Event('id', 'Sale 12/12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s', DateTime.now(), true, 20, 'Nha Trang, Khanh Hoa'),
    Event('id', 'Sale 12/12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s', DateTime.now(), true, 20, 'Nha Trang, Khanh Hoa'),
    Event('id', 'Sale 12/12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s', DateTime.now(), true, 20, 'Nha Trang, Khanh Hoa'),
    Event('id', 'Sale 12/12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s', DateTime.now(), true, 20, 'Nha Trang, Khanh Hoa'),
    Event('id', 'Sale 12/12', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s', DateTime.now(), true, 20, 'Nha Trang, Khanh Hoa'),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        shrinkWrap: true,
        itemCount: events.length,
        itemBuilder: (context, index) {
          return EventItem(event: events[index],);
        }
    );
  }
}
