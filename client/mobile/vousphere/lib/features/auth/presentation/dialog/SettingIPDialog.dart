import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/features/auth/presentation/components/Field.dart';

class SettingIpDialog extends StatelessWidget {
  SettingIpDialog({super.key});

  final TextEditingController ipController = TextEditingController();
  final FocusNode ipFocusNode = FocusNode();
  static const _storage = FlutterSecureStorage();

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Colors.white,
      titlePadding: const EdgeInsets.fromLTRB(25, 15, 10, 0),
      title: const Text('Setting server'),
        content: SizedBox(
          height: 100,
          child: Field(
            fieldName: 'IP Address',
            controller: ipController,
            focusNode: ipFocusNode,
            focusNodeNext: null,
          ),
        ),
      actions: [
        OutlinedButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('Cancel')
        ),
        FilledButton(
          onPressed: () async {
            if(ipController.text.isNotEmpty) {
              print('set ip: ${ipController.text}');
              await _storage.write(key: 'baseUrl', value: 'http://${ipController.text}:6000');
            }
            SystemNavigator.pop();
          },
          style: FilledButton.styleFrom(
            backgroundColor: Colors.blue.shade700,
          ),
          child: const Text('OK'),
        ),
      ],
    );
  }
}
