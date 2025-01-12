import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:vousphere/data/models/Brand.dart';
import 'package:vousphere/service/DirectionService.dart';
import 'package:vousphere/service/LocationService.dart';

class LocationPage extends StatefulWidget {
  const LocationPage({Key? key}) : super(key: key);

  @override
  State<LocationPage> createState() => _LocationPageState();
}

class _LocationPageState extends State<LocationPage> {
  final MapController _mapController = MapController();
  final LocationService _locationService = LocationService();
  final DirectionsService _directionsService = DirectionsService();

  Brand? selectedBrand;
  List<LatLng>? routePoints;
  LatLng? currentLocation;
  bool isLoadingLocation = true;
  bool isLoadingRoute = false;

  final List<Brand> nearbyBrands = [
    Brand(
      brandId: '1',
      name: 'Starbucks Coffee',
      latitude: 10.884755405794309,
      longitude: 106.78849039008193,
      address: '123 Main Street',
      domain: 'starbucks.com',
    ),
    Brand(
      brandId: '2',
      name: 'McDonald\'s',
      latitude: 10.886119890621906,
      longitude: 106.78369217942999,
      address: '456 Nguyen Hue Boulevard',
      domain: 'mcdonalds.com',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _initializeLocation();
  }

  Future<void> _initializeLocation() async {
    setState(() => isLoadingLocation = true);

    try {
      final location = await _locationService.getCurrentLocation();
      if (location != null) {
        setState(() {
          currentLocation = location;
          _mapController.move(location, 15);
        });

        _locationService.getLocationStream().listen((newLocation) {
          setState(() => currentLocation = newLocation);
        });
      } else {
        _showError('Could not get current location');
      }
    } catch (e) {
      _showError('Error getting location');
    } finally {
      setState(() => isLoadingLocation = false);
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: currentLocation ?? const LatLng(10.8231, 106.6297),
              initialZoom: 10,
              minZoom: 8,
              maxZoom: 18,
              onTap: (_, __) {
                setState(() {
                  selectedBrand = null;
                  routePoints = null;
                });
              },
            ),
            children: [
              TileLayer(
                urlTemplate:
                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                subdomains: const ['a', 'b', 'c'],
                userAgentPackageName: 'com.example.app',
              ),
              if (routePoints != null)
                PolylineLayer(
                  polylines: [
                    Polyline(
                      points: routePoints!,
                      strokeWidth: 4,
                      color: Colors.blue,
                    ),
                  ],
                ),
              MarkerLayer(
                markers: _buildMarkers(),
              ),
            ],
          ),
          _buildSearchBar(),
          if (isLoadingLocation)
            const Center(child: CircularProgressIndicator()),
          _buildHorizontalBrandList(),
          if (isLoadingRoute) _buildLoadingRouteIndicator(),
        ],
      ),
    );
  }

  Widget _buildHorizontalBrandList() {
    return Positioned(
      left: 0,
      right: 0,
      bottom: 16,
      height: 180,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 8),
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: nearbyBrands.length,
          itemBuilder: (context, index) {
            final brand = nearbyBrands[index];
            return _buildBrandCard(brand);
          },
        ),
      ),
    );
  }

  Widget _buildBrandCard(Brand brand) {
    final isSelected = selectedBrand?.brandId == brand.brandId;
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
          onTap: () => _onBrandCardTap(brand),
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        Icons.store,
                        size: 30,
                        color: Colors.grey[400],
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
                            brand.address,
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
                        onPressed: () => _showBrandDetails(brand),
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
                        onPressed: () => _getDirections(brand),
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

  List<Marker> _buildMarkers() {
    final markers = <Marker>[];

    if (currentLocation != null) {
      markers.add(
        Marker(
          point: currentLocation!,
          width: 24,
          height: 24,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.blue,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(
              Icons.my_location,
              color: Colors.white,
              size: 16,
            ),
          ),
        ),
      );
    }

    markers.addAll(
      nearbyBrands
          .where((brand) => brand.latitude != null && brand.longitude != null)
          .map((brand) => Marker(
                point: LatLng(brand.latitude!, brand.longitude!),
                width: 24,
                height: 40,
                child: GestureDetector(
                  onTap: () => _onBrandMarkerTap(brand),
                  child: _buildBrandMarker(brand),
                ),
              )),
    );

    return markers;
  }

  Widget _buildBrandMarker(Brand brand) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      decoration: BoxDecoration(
        color:
            selectedBrand?.brandId == brand.brandId ? Colors.blue : Colors.red,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: const Icon(
        Icons.location_on,
        color: Colors.white,
        size: 16,
      ),
    );
  }

  Widget _buildSearchBar() {
    return Positioned(
      top: 40,
      left: 16,
      right: 16,
      child: SafeArea(
        child: Container(
          height: 50,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Search brands...',
                    prefixIcon: const Icon(Icons.search),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.my_location),
                onPressed: _centerOnCurrentLocation,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingRouteIndicator() {
    return Positioned(
      top: 100,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 8,
        ),
        color: Colors.black87,
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Colors.white,
              ),
            ),
            SizedBox(width: 8),
            Text(
              'Loading route...',
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }

  void _onBrandCardTap(Brand brand) {
    setState(() {
      selectedBrand = brand;
      _mapController.move(
        LatLng(brand.latitude!, brand.longitude!),
        _mapController.zoom,
      );
    });
  }

  void _onBrandMarkerTap(Brand brand) {
    setState(() {
      selectedBrand = brand;
      routePoints = null;
    });
    _mapController.move(
      LatLng(brand.latitude!, brand.longitude!),
      _mapController.zoom,
    );
  }

  void _centerOnCurrentLocation() {
    if (currentLocation != null) {
      _mapController.move(currentLocation!, 15);
    }
  }

  Future<void> _getDirections(Brand brand) async {
    if (currentLocation == null) return;

    setState(() {
      isLoadingRoute = true;
    });

    try {
      final route = await _directionsService.getRouteBetweenPoints(
        currentLocation!,
        LatLng(brand.latitude!, brand.longitude!),
      );

      setState(() {
        routePoints = route.points;
      });

      final bounds = LatLngBounds.fromPoints(route.points);
      _mapController.fitBounds(
        bounds,
        options: const FitBoundsOptions(padding: EdgeInsets.all(50.0)),
      );
    } catch (e) {
      _showError('Failed to load directions. Please try again.');
    } finally {
      setState(() {
        isLoadingRoute = false;
      });
    }
  }

  void _showBrandDetails(Brand brand) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
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
                    Container(
                      height: 160,
                      color: Colors.grey[200],
                      child: Center(
                        child: Icon(
                          Icons.store,
                          size: 64,
                          color: Colors.grey[400],
                        ),
                      ),
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
                          _buildDetailRow(Icons.location_on, brand.address),
                          const SizedBox(height: 12),
                          _buildDetailRow(Icons.language, brand.domain),
                          if (currentLocation != null) ...[
                            const SizedBox(height: 12),
                            _buildDetailRow(
                              Icons.directions,
                              '${const Distance().as(
                                    LengthUnit.Kilometer,
                                    currentLocation!,
                                    LatLng(brand.latitude!, brand.longitude!),
                                  ).toStringAsFixed(1)} km away',
                            ),
                          ],
                          const SizedBox(height: 24),
                          ElevatedButton.icon(
                            onPressed: () {
                              Navigator.pop(context);
                              _getDirections(brand);
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
