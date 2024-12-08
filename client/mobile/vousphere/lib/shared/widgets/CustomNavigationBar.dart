import 'package:flutter/material.dart';

class CustomNavigationBar extends StatelessWidget {
  CustomNavigationBar({super.key, required this.currentIndex, required this.onDestinationSelected});

  int currentIndex;

  Function(int) onDestinationSelected;

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      backgroundColor: Colors.blueGrey.shade50,
      onDestinationSelected: onDestinationSelected,
      indicatorColor: Colors.blue.shade100,
      selectedIndex: currentIndex,
      destinations: <Widget>[
        NavigationDestination(
          selectedIcon: Icon(Icons.home_rounded, color: Colors.blue.shade900,),
          icon: const Icon(Icons.home_rounded),
          label: 'Home',
        ),
        NavigationDestination(
          selectedIcon: Icon(Icons.airplane_ticket_rounded, color: Colors.blue.shade900,),
          icon: const Icon(Icons.airplane_ticket_rounded),
          label: 'Voucher',
        ),
        NavigationDestination(
          selectedIcon: Icon(Icons.location_on_rounded, color: Colors.blue.shade900,),
          icon: const Icon(Icons.location_on_rounded),
          label: 'Location',
        ),
        NavigationDestination(
          selectedIcon: Icon(Icons.account_circle, color: Colors.blue.shade900,),
          icon: const Icon(Icons.account_circle),
          label: 'Profile',
        ),
      ],
    );
  }
}
