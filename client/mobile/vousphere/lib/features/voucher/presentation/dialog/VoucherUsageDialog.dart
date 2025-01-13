import 'package:flutter/material.dart';
import 'package:vousphere/data/models/Voucher.dart';

class VoucherUsageDialog extends StatelessWidget {
  const VoucherUsageDialog({super.key, required this.voucher});
  final Voucher voucher;

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: Colors.white,
      titlePadding: const EdgeInsets.fromLTRB(25, 15, 10, 0),
      title: const Text('Voucher Usage'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text('Enter code:  '),
              Text(voucher.code, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue.shade600),)
            ],
          ),
          const SizedBox(height: 10,),
          IconButton(
              onPressed: () {

              },
              icon: Icon(Icons.qr_code)
          ),
        ],
      ),
      actions: [
        FilledButton(
          onPressed: () {
            Navigator.of(context).pop();
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
