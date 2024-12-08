import 'package:flutter/material.dart';

class SwitchLoginButton extends StatefulWidget {
  const SwitchLoginButton({super.key, required this.isLoginMode, required this.onMessageChange});

  final bool isLoginMode;
  final Function(String) onMessageChange;

  @override
  State<SwitchLoginButton> createState() => _SwitchLoginButtonState();
}

class _SwitchLoginButtonState extends State<SwitchLoginButton> {
  @override
  Widget build(BuildContext context) {
    return Card(
      color: const Color.fromRGBO(219, 226, 255, 1),
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20)
      ),
      child: Row(
        children: [
          Expanded(
            child: widget.isLoginMode ?
            Container(
              margin: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color.fromRGBO(147, 144, 248, 1), Color.fromRGBO(57, 120, 209, 1)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text(
                    'Login',
                    style: TextStyle(
                        fontSize: 15
                    ),
                  )
              ),
            ) :
            TextButton(
                onPressed: () {widget.onMessageChange('Login');},
                style: TextButton.styleFrom(
                  backgroundColor: const Color.fromRGBO(219, 226, 255, 1),
                  foregroundColor: Colors.black87,
                ),
                child: const Text(
                  'Login',
                  style: TextStyle(
                      fontSize: 15
                  ),
                )
            ),
          ),
          Expanded(
            child: widget.isLoginMode ?
            TextButton(
                onPressed: () {widget.onMessageChange('Register');},
                style: TextButton.styleFrom(
                  backgroundColor: const Color.fromRGBO(219, 226, 255, 1),
                  foregroundColor: Colors.black87,
                ),
                child: const Text(
                  'Register',
                  style: TextStyle(
                      fontSize: 15
                  ),
                )
            ) :
            Container(
              margin: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color.fromRGBO(147, 144, 248, 1), Color.fromRGBO(57, 120, 209, 1)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text(
                    'Register',
                    style: TextStyle(
                        fontSize: 15
                    ),
                  )
              ),
            ),
          ),
        ],
      ),
    );
  }
}
