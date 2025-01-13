import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';

class QRPage extends StatelessWidget {
  const QRPage({super.key, required this.id});

  final String id;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('QR', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade700),),
      ),
      body: Container(
        height: MediaQuery.of(context).size.height,
        color: Colors.white,
        padding: const EdgeInsets.all(10),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(
              maxWidth: 300,
              maxHeight: 300,
            ),
            child: QrImageView(
              data: '${ApiConstants.baseUrl}/voucher-service/api/vouchers/${id}/redeem',
              version: QrVersions.auto,
              size: 200.0,
              gapless: false,
            ),
          ),
        )
      ),
    );
  }
}
