import 'package:flutter/material.dart';
import 'package:vousphere/data/models/Voucher.dart';
import 'package:vousphere/features/voucher/presentation/components/VoucherItem.dart';

class VoucherList extends StatefulWidget {
  const VoucherList({super.key});

  @override
  State<VoucherList> createState() => _VoucherListState();
}

class _VoucherListState extends State<VoucherList> {

  List<Voucher> vouchers = [
    Voucher('', '', 'Voucher xin xo con bo cuoi', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQMBsfYZ74qO3YUXuZHKx9A5tpdQJyhuPECw&s', DateTime.now()),
    Voucher('', '', 'Voucher xin xo con bo cuoi', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQMBsfYZ74qO3YUXuZHKx9A5tpdQJyhuPECw&s', DateTime.now()),
    Voucher('', '', 'Voucher xin xo con bo cuoi', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQMBsfYZ74qO3YUXuZHKx9A5tpdQJyhuPECw&s', DateTime.now()),
    Voucher('', '', 'Voucher xin xo con bo cuoi', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQMBsfYZ74qO3YUXuZHKx9A5tpdQJyhuPECw&s', DateTime.now()),
    Voucher('', '', 'Voucher xin xo con bo cuoi', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQMBsfYZ74qO3YUXuZHKx9A5tpdQJyhuPECw&s', DateTime.now()),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        shrinkWrap: true,
        itemCount: vouchers.length,
        itemBuilder: (context, index) {
          return VoucherItem(voucher: vouchers[index],);
        }
    );
  }
}
