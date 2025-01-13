import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:latlong2/latlong.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/Counterpart.dart';
import 'package:vousphere/features/location/component/BrandCard.dart';
import 'package:vousphere/features/location/component/BrandDetails.dart';
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
  final ApiService apiService = ApiService();

  Counterpart? selectedBrand;
  List<LatLng>? routePoints;
  LatLng? currentLocation;
  bool isLoadingLocation = true;
  bool isLoadingRoute = false;

  final List<Counterpart> nearbyBrands = [
    // Brand(
    //   brandId: '1',
    //   name: 'Starbucks Coffee',
    //   latitude: 10.884755405794309,
    //   longitude: 106.78849039008193,
    //   address: '123 Main Street',
    //   domain: 'starbucks.com',
    // ),
    // Brand(
    //   brandId: '2',
    //   name: 'McDonald\'s',
    //   latitude: 10.886119890621906,
    //   longitude: 106.78369217942999,
    //   address: '456 Nguyen Hue Boulevard',
    //   domain: 'mcdonalds.com',
    // ),
  ];
  List<Counterpart> filteredNearbyBrands = [];

  @override
  void initState() {
    super.initState();
    _initializeLocation();
  }

  Future<void> _initializeLocation() async {

    setState(() {
      isLoadingLocation = true;
    });

    try {
      final location = await _locationService.getCurrentLocation();
      if (location != null) {
        setState(() {
          currentLocation = location;
          _mapController.move(location, 15);
        });
        await initNearByBrands();

        _locationService.getLocationStream().listen((newLocation) {
          setState(() => currentLocation = newLocation);
        });
      } else {
        _showError('Could not get current location');
      }
    } catch (e) {
      _showError('Error getting location');
    } finally {
      setState(() {
        isLoadingLocation = false;
      });
    }
  }

  Future<void> initNearByBrands() async {
    try {
      final response = await apiService.dio.get(
          ApiConstants.getNearbyBrand,
          queryParameters: {
            "latitude" : currentLocation?.latitude,
            "longitude": currentLocation?.longitude,
            "radius": 10,
            "page": 1,
            "perPage": 50,
          },
      );
      if(response.statusCode == 200) {
        setState(() {
          nearbyBrands.clear();
          nearbyBrands.addAll(
              List<Counterpart>.from(
                  response.data["data"]["data"].map((item) => Counterpart.fromJson(item))
              )
          );
          filteredNearbyBrands = nearbyBrands;
        });
      }
    }
    catch (e) {
      if(e is DioException) {
        if (e.response != null) {
          print("Status code: ${e.response?.statusCode}");
          print("Response data: ${e.response?.data}");
          _showError('Failed to load nearby brands');
        } else {
          print("Error message: ${e.message}");
        }
      }
      else {
        print("Something went wrong");
        print(e);
      }
    }
  }

  void _showError(String message) {
    Fluttertoast.showToast(msg: message);
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
          isLoadingLocation ?
            const Center(child: CircularProgressIndicator()) :
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
          itemCount: filteredNearbyBrands.length,
          itemBuilder: (context, index) {
            final brand = filteredNearbyBrands[index];
            return BrandCard(brand: brand, selectedBrand: selectedBrand, getDirection: _getDirections, onBrandCardTap: _onBrandCardTap, showBrandDetail: _showBrandDetails,);
          },
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
          .where((brand) => brand.brand?.latitude != null && brand.brand?.longitude != null)
          .map((brand) => Marker(
                point: LatLng(brand.brand!.latitude!, brand.brand!.longitude!),
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

  Widget _buildBrandMarker(Counterpart brand) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      decoration: BoxDecoration(
        color:
            selectedBrand?.id == brand.id ? Colors.blue : Colors.red,
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
                  onChanged: (value) {
                    if (value.isEmpty) {
                      setState(() {
                        filteredNearbyBrands = nearbyBrands;
                      });
                    }
                  },
                  onSubmitted: (keyword) {
                    setState(() {
                      filteredNearbyBrands = nearbyBrands.where((brand) {
                        return brand.name.toLowerCase().contains(keyword.toLowerCase());
                      }).toList();
                      selectedBrand = null;
                    });
                  },
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

  void _onBrandCardTap(Counterpart brand) {
    setState(() {
      selectedBrand = brand;
      _mapController.move(
        LatLng(brand.brand!.latitude!, brand.brand!.longitude!),
        _mapController.zoom,
      );
    });
  }

  void _onBrandMarkerTap(Counterpart brand) {
    setState(() {
      selectedBrand = brand;
      routePoints = null;
    });
    _mapController.move(
      LatLng(brand.brand!.latitude!, brand.brand!.longitude!),
      _mapController.zoom,
    );
  }

  void _centerOnCurrentLocation() {
    if (currentLocation != null) {
      _mapController.move(currentLocation!, 15);
    }
  }

  void _getDirections(Counterpart brand) async {
    if (currentLocation == null) return;

    setState(() {
      isLoadingRoute = true;
    });

    try {
      final route = await _directionsService.getRouteBetweenPoints(
        currentLocation!,
        LatLng(brand.brand!.latitude!, brand.brand!.longitude!),
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

  void _showBrandDetails(Counterpart brand) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => BrandDetails(brand: brand, currentLocation: currentLocation, getDirection: _getDirections)
    );
  }

}
