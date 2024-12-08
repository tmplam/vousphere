import 'package:flutter/material.dart';

class RegisterButton extends StatelessWidget {
  final VoidCallback? onPressed;
  const RegisterButton({super.key, this.onPressed});
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Container(
            margin: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [
                  Color.fromRGBO(147, 144, 248, 1),
                  Color.fromRGBO(57, 120, 209, 1)
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: ElevatedButton(
                onPressed: onPressed,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  foregroundColor: Colors.white,
                ),
                child: const Text(
                  'Register',
                  style: TextStyle(fontSize: 15),
                )),
          ),
        ),
      ],
    );
  }
}
