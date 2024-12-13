import 'package:flutter/material.dart';
import 'package:vousphere/data/models/Voucher.dart';
import 'package:vousphere/features/voucher-detail/presentation/VoucherDetailPage.dart';

class VoucherItem extends StatelessWidget {
  const VoucherItem({super.key, required this.voucher});

  final Voucher voucher;

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        height: 120,
        color: Colors.white,
        child: GestureDetector(
          onTap: () async {
            await Navigator.push(
                context,
                PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => VoucherDetailPage(voucher: voucher),));
          },
          child: Card(
            color: Colors.white,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(10)),
              side: BorderSide(
                color: Colors.grey,
                width: 0.3,
              ),
            ),
            elevation: 2,
            child: Row(
              children: [
                SizedBox(
                  width: 120,
                  height: 120,
                  child: ClipRRect(
                    borderRadius: const BorderRadius.only(topLeft: Radius.circular(10), bottomLeft: Radius.circular(10)),
                    child: Image.network(
                      voucher.image,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(width: 10,),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        voucher.name,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        overflow: TextOverflow.ellipsis,
                        maxLines: 2,
                      ),
                      Text('31/12/2024  10:30:00', style: TextStyle(color: Colors.grey),),
                    ],
                  ),
                )
              ],
          ),
          // shadowColor: Colors.blue,
                ),
        )
    );
  }
}
