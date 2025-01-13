import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import 'package:vousphere/core/utils/RandomUtils.dart';
import 'package:vousphere/data/models/Counterpart.dart';

class BrandDetails extends StatelessWidget {
  BrandDetails({super.key, required this.brand, required this.currentLocation, required this.getDirection});
  final Counterpart brand;
  final LatLng? currentLocation;
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
    return Container(
      height: MediaQuery.of(context).size.height * 0.6,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          Container(
            margin: const EdgeInsets.symmetric(vertical: 12),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ClipOval(
                        child: Image.network(
                          brand.image ?? '',
                          width: 120,
                          height: 120,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Image.asset(
                              randomBrandImage(),
                              width: 120,
                              height: 120,
                              fit: BoxFit.cover,
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          brand.name,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        _buildDetailRow(Icons.location_on, brand.brand?.address ?? ''),
                        const SizedBox(height: 12),
                        _buildDetailRow(Icons.language, brand.brand?.domain ?? ''),
                        if (currentLocation != null) ...[
                          const SizedBox(height: 12),
                          _buildDetailRow(
                            Icons.directions,
                            '${const Distance().as(
                              LengthUnit.Kilometer,
                              currentLocation!,
                              LatLng(brand.brand!.latitude!, brand.brand!.longitude!),
                            ).toStringAsFixed(1)} km away',
                          ),
                        ],
                        const SizedBox(height: 24),
                        ElevatedButton.icon(
                          onPressed: () {
                            Navigator.pop(context);
                            getDirection(brand);
                          },
                          icon: const Icon(Icons.directions),
                          label: const Text('Get Directions'),
                          style: ElevatedButton.styleFrom(
                            minimumSize: const Size(double.infinity, 50),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );

  }


  Widget _buildDetailRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.grey[600]),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[800],
            ),
          ),
        ),
      ],
    );
  }
}
