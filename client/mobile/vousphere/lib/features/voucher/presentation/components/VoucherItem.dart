import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/core/utils/DateUtils.dart';
import 'package:vousphere/data/models/Event.dart';
import 'package:vousphere/data/models/Voucher.dart';
import 'package:vousphere/features/voucher-detail/presentation/VoucherDetailPage.dart';
import 'package:vousphere/features/voucher/presentation/GiftVoucherPage.dart';
import 'package:vousphere/features/voucher/presentation/dialog/VoucherUsageDialog.dart';
import 'package:vousphere/features/voucher/provider/VoucherProvider.dart';

class VoucherItem extends StatefulWidget {
  const VoucherItem({super.key, required this.voucher});

  final Voucher voucher;

  @override
  State<VoucherItem> createState() => _VoucherItemState();
}

class _VoucherItemState extends State<VoucherItem> {
  @override
  Widget build(BuildContext context) {

    VoucherProvider voucherProvider = Provider.of<VoucherProvider>(context, listen: true);

    Event? event = voucherProvider.getEventById(widget.voucher.eventId);

    bool isDisplay = true;
    if(
      voucherProvider.keyword.isNotEmpty &&
          (event?.name != null
              && !(event!.name.toLowerCase().contains(voucherProvider.keyword.toLowerCase())))
    ) {
      isDisplay = false;
    }

    if(!isDisplay) return const SizedBox.shrink();

    if(voucherProvider.category.toLowerCase() != 'all') {
      if(event?.brand.domain.toLowerCase() != voucherProvider.category.toLowerCase()) {
        isDisplay = false;
      }
    }

    if(!isDisplay) return const SizedBox.shrink();

    bool isActive = widget.voucher.status.toLowerCase() == 'active';
    bool isExpired = widget.voucher.expiredAt.isBefore(DateTime.now());


    return Opacity(
      opacity: isActive && !isExpired ? 1 : 0.4,
      child: Container(
          margin: const EdgeInsets.symmetric(vertical: 4),
          height: 120,
          color: Colors.white,
          child: GestureDetector(
            onTap: () async {
              // await Navigator.push(
              //     context,
              //     PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => VoucherDetailPage(voucher: voucher),));
              if(isActive && !isExpired) {
                await showDialog(context: context, builder: (context) => VoucherUsageDialog(voucher: widget.voucher));
                voucherProvider.setLoading(true);
                await voucherProvider.loadVoucher();
                voucherProvider.setLoading(false);
              }
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
                        event?.image ?? '',
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Image.asset(
                            'assets/icons/voucher-icon.png',
                            fit: BoxFit.cover,
                          );
                        },
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
                          'Voucher of ${event?.name}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          overflow: TextOverflow.ellipsis,
                          maxLines: 2,
                        ),
                        const SizedBox(height: 4,),
                        Row(
                          children: [
                            Icon(Icons.date_range, color: isExpired ? Colors.deepOrange : Colors.green,),
                            const SizedBox(width: 4,),
                            Text(
                              DateTimeUtils.getFormatMMMDD(widget.voucher.expiredAt),
                              style: TextStyle(color: isExpired ? Colors.deepOrange : Colors.green,),
                            ),
                            const SizedBox(width: 8,),
                            Text(
                              DateTimeUtils.getFormatHHmm(widget.voucher.expiredAt),
                              style: TextStyle(color: isExpired ? Colors.deepOrange : Colors.green,),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4,),
                        Row(
                          children: [
                            const Text('Discount: '),
                            Text('${widget.voucher.discount}%', style: TextStyle(color: Colors.blue.shade600),),
                            const Expanded(child: Text('')),
                            TextButton(
                                onPressed: () async {
                                  bool? status = await Navigator.push(
                                      context,
                                      PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => GiftVoucherPage(voucher: widget.voucher,),));
                                  if(status != null && status == true) {
                                    Fluttertoast.showToast(msg: 'Gift voucher successfully');
                                    await voucherProvider.loadVoucher();
                                  }
                                },
                                child: Text('Gift', style: TextStyle(color: Colors.blue.shade600, fontWeight: FontWeight.bold),))
                          ],
                        )
                      ],
                    ),
                  )
                ],
            ),
            // shadowColor: Colors.blue,
                  ),
          )
      ),
    );
  }
}
