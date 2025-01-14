import 'package:flutter/material.dart';
import 'package:vousphere/features/favorite-event/presentation/components/FavoriteEventList.dart';
import 'package:vousphere/features/favorite-event/presentation/components/TotalFavoriteEvent.dart';

class FavoriteEventPage extends StatelessWidget {
  const FavoriteEventPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Favorite events',
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
            SizedBox(height: 20,),
            TotalFavoriteEvent(),
            SizedBox(height: 10,),
            Expanded(child: FavoriteEventList()),
            SizedBox(height: 10,),
          ],
        ),
      ),
    );
  }
}
