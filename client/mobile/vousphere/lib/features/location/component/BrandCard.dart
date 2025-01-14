import 'package:flutter/material.dart';
import 'package:vousphere/core/utils/RandomUtils.dart';
import 'package:vousphere/data/models/Counterpart.dart';


class BrandCard extends StatelessWidget {
  BrandCard({super.key, required this.brand, required this.selectedBrand, required this.onBrandCardTap, required this.showBrandDetail, required this.getDirection});
  final Counterpart? selectedBrand;
  final Counterpart brand;
  Function(Counterpart) onBrandCardTap;
  Function(Counterpart) showBrandDetail;
  Function(Counterpart) getDirection;


  final List<int> avatars = [];

  void randomAvatar() {
    List<int> numbers = List.generate(4, (index) => index);
    numbers.shuffle(RandomUtils.random);
    avatars.addAll(numbers.sublist(0, 3));
  }

  String randomBrandImage() {
    return 'assets/brands/brand${RandomUtils.random.nextInt(5)}.jpg';
  }


  @override
  Widget build(BuildContext context) {
    final isSelected = selectedBrand?.id == brand.id;
    return Container(
      width: 300,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      child: Card(
        elevation: isSelected ? 8 : 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: isSelected
              ? BorderSide(color: Colors.blue.shade300, width: 2)
              : BorderSide.none,
        ),
        child: InkWell(
          onTap: () => onBrandCardTap(brand),
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    ClipOval(
                      child: Image.network(
                          brand.image ?? '',
                          width: 70,
                          height: 70,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Image.asset(
                                randomBrandImage(),
                                width: 70,
                                height: 70,
                                fit: BoxFit.cover,
                            );
                          },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                            Text(
                                brand.name,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                                brand.brand?.address ?? '',
                                style: TextStyle(
                                  color: Colors.grey[600],
                                  fontSize: 13,
                                ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                          onPressed: () => showBrandDetail(brand),
                          icon: const Icon(Icons.info_outline, size: 18),
                          label: const Text('Details'),
                          style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                          ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton.icon(
                          onPressed: () => getDirection(brand),
                          icon: const Icon(Icons.directions, size: 18),
                          label: const Text('Route'),
                          style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              backgroundColor: Colors.blue,
                              foregroundColor: Colors.white,
                          ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
