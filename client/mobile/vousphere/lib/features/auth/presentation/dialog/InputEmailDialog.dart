import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:vousphere/features/auth/presentation/components/Field.dart';

class InputEmailDialog extends StatefulWidget {
  InputEmailDialog({super.key});

  @override
  State<InputEmailDialog> createState() => _InputEmailDialogState();
}

class _InputEmailDialogState extends State<InputEmailDialog> {
  final TextEditingController emailController = TextEditingController();

  final FocusNode emailFocusNode = FocusNode();

  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
        backgroundColor: Colors.white,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Enter your email',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            IconButton(
              onPressed: () {
                  Navigator.of(context).pop();
              },
              icon: const Icon(Icons.close)
            ),
          ],
        ),
        content: SizedBox(
          height: 100,
          child: Field(
                  fieldName: 'Email',
                  controller: emailController,
                  focusNode: emailFocusNode,
                  focusNodeNext: null,
              ),
        ),
        actions: [
            OutlinedButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            FilledButton(
                onPressed: () {
                    String email = emailController.text;
                    if(email.trim().isEmpty) {
                      Fluttertoast.showToast(msg: 'Email is required');
                      return;
                    }
                    final emailRegex = RegExp(r'^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.][a-zA-Z]{2,3})+$');
                    if (!emailRegex.hasMatch(email)) {
                      Fluttertoast.showToast(msg: 'Invalid email');
                      return;
                    }
                    Navigator.pop(context, email);
                },
                style: FilledButton.styleFrom(backgroundColor: Colors.blue.shade700,),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    isLoading ? const SizedBox(
                      width: 10,
                      height: 10,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white,),
                    ) : const SizedBox.shrink(),
                    const SizedBox(width: 4,),
                    const Text('Confirm'),
                  ],
                )
            ),
        ],
    );
  }
}
