import 'package:flutter/material.dart';
import 'package:vousphere/features/voucher/model/VoucherCategory.dart';

class VoucherFilter extends StatefulWidget {
  const VoucherFilter({super.key});

  @override
  State<VoucherFilter> createState() => _VoucherFilterState();
}

class _VoucherFilterState extends State<VoucherFilter> {
  int selectedIndex = 0;

  static final categories = [
    VoucherCategory('All', const Icon(Icons.dataset, color: Colors.white,)),
    VoucherCategory('Food', const Icon(Icons.fastfood_outlined, color: Colors.white)),
    VoucherCategory('Drink', const Icon(Icons.local_drink_outlined, color: Colors.white)),
    VoucherCategory('Restaurant', const Icon(Icons.local_restaurant_outlined, color: Colors.white)),
    VoucherCategory('Shopping', const Icon(Icons.shopping_bag_outlined, color: Colors.white)),
    VoucherCategory('Music', const Icon(Icons.music_note_outlined, color: Colors.white)),
    VoucherCategory('Car', const Icon(Icons.car_repair_outlined, color: Colors.white)),
  ];
  
  Widget _buildItem(int index, VoucherCategory item) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: ChoiceChip(
        label: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              item.icon,
              const SizedBox(width: 6,),
              Text(item.name),
            ],
          ),
        ),
        selected: index == selectedIndex,
        onSelected: (bool selected) {
          setState(() {
            selectedIndex = index;
          });
        },
        selectedColor: VoucherCategory.colors[index],
        backgroundColor: VoucherCategory.colors[index].withOpacity(0.4),
        labelStyle: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
          fontSize: 16
        ),
        shape: const StadiumBorder(
          side: BorderSide.none,
        ),
        side: BorderSide.none,
        showCheckmark: false,
      ),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ...categories.asMap().entries.map((entry,) {
            return _buildItem(entry.key, entry.value);
          }),
          const SizedBox(width: 5,)
        ]
      ),
    );
  }
}
