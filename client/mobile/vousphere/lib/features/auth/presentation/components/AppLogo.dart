import 'package:flutter/material.dart';

class AppLogo extends StatelessWidget {
  const AppLogo({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Padding(
          padding: const EdgeInsets.all(15),
          child: ClipOval(
            child: Image.asset(
              'assets/icons/flutter.png',
              width: 30,
              height: 30,
              fit: BoxFit.cover,
            ),
          ),
        ),
        const Text(
          'Vousphere',
          style: TextStyle(
              fontSize: 30,
              fontWeight: FontWeight.bold,
              color: Color.fromRGBO(20, 80, 163, 1)
          ),
        ),
      ],
    );
  }
}
