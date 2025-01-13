import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/data/models/Voucher.dart';
import 'package:vousphere/features/voucher/presentation/components/VoucherItem.dart';
import 'package:vousphere/features/voucher/provider/VoucherProvider.dart';

class VoucherList extends StatefulWidget {
  const VoucherList({super.key});

  @override
  State<VoucherList> createState() => _VoucherListState();
}

class _VoucherListState extends State<VoucherList> {

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      initData();
    });
  }

  Future<void> initData() async {
    VoucherProvider provider =
    Provider.of<VoucherProvider>(context, listen: false);
    provider.setLoading(true);
    try {
      await provider.loadVoucher();
      provider.setLoading(false);
    } catch (e) {
      Fluttertoast.showToast(msg: 'Failed to load voucher');
    }
  }

  @override
  Widget build(BuildContext context) {
    VoucherProvider voucherProvider = Provider.of<VoucherProvider>(context, listen: true);

    if(voucherProvider.isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if(voucherProvider.vouchers.isEmpty) {
      return Center(
        child: Text('There is no voucher', style: TextStyle(color: Colors.blue.shade700, fontSize: 16),),
      );
    }

    return ListView.builder(
        shrinkWrap: true,
        itemCount: voucherProvider.vouchers.length,
        itemBuilder: (context, index) {
          return VoucherItem(voucher: voucherProvider.vouchers[index],);
        }
    );
  }
}
