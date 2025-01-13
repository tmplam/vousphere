import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/features/voucher/provider/VoucherProvider.dart';

class SearchBox extends StatelessWidget {
  SearchBox({super.key});
  final FocusNode searchFocusNode = FocusNode();

  @override
  Widget build(BuildContext context) {

    VoucherProvider voucherProvider = Provider.of<VoucherProvider>(context, listen: true);

    return Row(
      children: [
        const SizedBox(width: 5,),
        Expanded(
          child: TextField(
            focusNode: searchFocusNode,
            onSubmitted: (value) {
              voucherProvider.handleSearch(value);
            },
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.fromLTRB(0, 12, 0, 4),
              filled: true,
              fillColor: Colors.blueGrey.withOpacity(0.06),
              hoverColor: Colors.transparent,
              focusColor: Colors.white,
              hintText: 'Search...',
              hintStyle: const TextStyle(color: Colors.blueGrey),
              prefixIcon: const Icon(
                Icons.search,
                color: Colors.blueGrey,
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(color: Colors.blue.shade700, width: 0.7)
              ),
            ),
          ),
        ),
        const SizedBox(width: 5,),
      ],
    );
  }
}
