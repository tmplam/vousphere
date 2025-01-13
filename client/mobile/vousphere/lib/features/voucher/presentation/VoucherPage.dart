import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/features/voucher/presentation/components/Filter.dart';
import 'package:vousphere/features/voucher/presentation/components/SearchBox.dart';
import 'package:vousphere/features/voucher/presentation/components/VoucherList.dart';
import 'package:vousphere/features/voucher/provider/VoucherProvider.dart';

class VoucherPage extends StatefulWidget {
  const VoucherPage({super.key});

  @override
  State<VoucherPage> createState() => _VoucherPageState();
}

class _VoucherPageState extends State<VoucherPage> {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
        create: (context) => VoucherProvider(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 5),
          child: Column(
            children: [
              const SizedBox(height: 10,),
              SearchBox(),
              const SizedBox(height: 10,),
              const VoucherFilter(),
              const SizedBox(height: 10,),
              const Expanded(child: VoucherList())
            ],
          ),
        ),
    );
  }
}
