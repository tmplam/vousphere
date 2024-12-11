import 'package:flutter/material.dart';
import 'package:vousphere/features/voucher/presentation/components/Filter.dart';
import 'package:vousphere/features/voucher/presentation/components/SearchBox.dart';
import 'package:vousphere/features/voucher/presentation/components/VoucherList.dart';

class VoucherPage extends StatefulWidget {
  const VoucherPage({super.key});

  @override
  State<VoucherPage> createState() => _VoucherPageState();
}

class _VoucherPageState extends State<VoucherPage> {
  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 5),
      child: Column(
        children: [
          SizedBox(height: 10,),
          SearchBox(),
          SizedBox(height: 10,),
          VoucherFilter(),
          SizedBox(height: 10,),
          Expanded(child: VoucherList())
        ],
      ),
    );
  }
}
