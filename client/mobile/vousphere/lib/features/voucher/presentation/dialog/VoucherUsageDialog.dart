import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:vousphere/data/models/Voucher.dart';
import 'package:vousphere/features/voucher/presentation/QRPage.dart';

class VoucherUsageDialog extends StatefulWidget {
  const VoucherUsageDialog({super.key, required this.voucher});
  final Voucher voucher;

  @override
  State<VoucherUsageDialog> createState() => _VoucherUsageDialogState();
}

class _VoucherUsageDialogState extends State<VoucherUsageDialog> {

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
              Text(widget.voucher.code, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue.shade600),)
            ],
          ),
          const SizedBox(height: 10,),
          IconButton(
              onPressed: () async {
                bool? status = await Navigator.push(
                    context,
                    PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => QRPage(id: widget.voucher.id,),));
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
