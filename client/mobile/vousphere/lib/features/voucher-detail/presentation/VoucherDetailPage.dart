import 'package:flutter/material.dart';
import 'package:vousphere/data/models/Voucher.dart';

class VoucherDetailPage extends StatelessWidget {
  const VoucherDetailPage({super.key, required this.voucher});
  final Voucher voucher;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Voucher Detail', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade700),),
      ),
      body: const Placeholder(),
    );
  }
}
