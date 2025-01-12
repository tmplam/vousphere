import 'package:latlong2/latlong.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DirectionsService {
  static const String _baseUrl =
      'https://router.project-osrm.org/route/v1/driving';

  Future<RouteResult> getRouteBetweenPoints(LatLng start, LatLng end) async {
    try {
      final response = await http.get(
        Uri.parse(
            '$_baseUrl/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<dynamic> coordinates =
            data['routes'][0]['geometry']['coordinates'];

        final points = coordinates.map((coord) {
          return LatLng(coord[1].toDouble(), coord[0].toDouble());
        }).toList();

        return RouteResult(
          points: points.cast<LatLng>(),
          distance: data['routes'][0]['distance'].toDouble(),
          duration: data['routes'][0]['duration'].toDouble(),
        );
      } else {
        throw Exception('Failed to load directions');
      }
    } catch (e) {
      throw Exception('Error getting directions: $e');
    }
  }
}

class RouteResult {
  final List<LatLng> points;
  final double distance;
  final double duration;

  RouteResult({
    required this.points,
    required this.distance,
    required this.duration,
  });
}
