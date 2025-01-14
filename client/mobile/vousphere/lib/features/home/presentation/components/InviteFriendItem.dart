import 'package:flutter/material.dart';

class InviteFriendItem extends StatelessWidget {
  const InviteFriendItem({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.cyanAccent.shade700,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const SizedBox(width: 20,),
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Invite your friends', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),),
              const SizedBox(height: 5,),
              const Text('Get 20\$ for tiker', style: TextStyle(color: Colors.white),),
              const SizedBox(height: 5,),
              FilledButton(
                  onPressed: () {}, child: const Text('Invite')
              )
            ],
          ),
          const SizedBox(width: 30,),
          Image.asset('assets/icons/giftbox.png', width: 120, height: 120, fit: BoxFit.cover,),
        ],
      ),
    );
  }
}
