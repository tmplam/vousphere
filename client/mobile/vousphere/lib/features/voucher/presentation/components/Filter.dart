import 'package:flutter/material.dart';
import 'package:vousphere/data/models/FilterCategory.dart';

class VoucherFilter extends StatefulWidget {
  const VoucherFilter({super.key});

  @override
  State<VoucherFilter> createState() => _VoucherFilterState();
}

class _VoucherFilterState extends State<VoucherFilter> {
  int selectedIndex = 0;

  static final categories = [
    FilterCategory('All', const Icon(Icons.dataset, color: Colors.white,)),
    FilterCategory('Food', const Icon(Icons.fastfood_outlined, color: Colors.white)),
    FilterCategory('Drink', const Icon(Icons.local_drink_outlined, color: Colors.white)),
    FilterCategory('Restaurant', const Icon(Icons.local_restaurant_outlined, color: Colors.white)),
    FilterCategory('Shopping', const Icon(Icons.shopping_bag_outlined, color: Colors.white)),
    FilterCategory('Music', const Icon(Icons.music_note_outlined, color: Colors.white)),
    FilterCategory('Car', const Icon(Icons.car_repair_outlined, color: Colors.white)),
  ];
  
  Widget _buildItem(int index, FilterCategory item) {
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
        selectedColor: FilterCategory.colors[index],
        backgroundColor: FilterCategory.colors[index].withOpacity(0.4),
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
