import 'package:flutter/material.dart';

class PasswordField extends StatefulWidget {
  const PasswordField({super.key, required this.controller, required this.focusNode, required this.focusNodeNext, required this.isConfirmPassword});
  final TextEditingController controller;
  final FocusNode focusNode;
  final FocusNode? focusNodeNext;
  final bool isConfirmPassword;
  @override
  _PasswordFieldState createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool _isPasswordVisible = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.isConfirmPassword ? 'Confirm password' : 'Password', style: const TextStyle(fontSize: 15)),
        const SizedBox(
          height: 2,
        ),
        TextField(
          focusNode: widget.focusNode,
          controller: widget.controller,
          cursorColor: Colors.blue.shade600,
          obscureText: !_isPasswordVisible,
          decoration: InputDecoration(
            hintText: widget.isConfirmPassword ? 'Retype your password' : 'Enter your password',
            hintStyle: const TextStyle(color: Colors.grey),
            filled: true,
            fillColor: const Color(0xFFEBEFFF),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: const BorderSide(color: Colors.blue, width: 1),
            ),
            contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 15),
            suffixIcon: IconButton(
              icon: Icon(
                _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                color: Colors.grey,
              ),
              onPressed: () {
                setState(() {
                  _isPasswordVisible = !_isPasswordVisible;
                });
              },
            ),
          ),
          onSubmitted: (value) {
            widget.focusNodeNext == null ? FocusScope.of(context).unfocus() :
            FocusScope.of(context).requestFocus(widget.focusNodeNext);
          },
        ),
      ],
    );
  }
}
