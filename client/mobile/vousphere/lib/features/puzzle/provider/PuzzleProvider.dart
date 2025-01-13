import 'package:flutter/material.dart';
import 'package:dio/dio.dart'; // Import thư viện dio
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/Player.dart';
import 'package:vousphere/data/models/PuzzleItem.dart';

class PuzzleProvider with ChangeNotifier {
  List<PuzzleItem> puzzles = [];
  bool isLoading = false;
  final ApiService apiService;

  PuzzleProvider(this.apiService) {
    loadPuzzles();
  }

  void setLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }

  Future<void> loadPuzzles() async {
    if (isLoading) return;
    setLoading(true);

    try {
      final response = await apiService.dio.get(
        "/voucher-service/api/vouchers/item-pieces",
        options: Options(extra: {"requireToken": true}),
      );

      if (response.statusCode == 200 && response.data['isSuccess']) {
        final List<dynamic> eventData = response.data['data'];
        puzzles = eventData.map((item) => PuzzleItem.fromJson(item)).toList();
        notifyListeners();
      }
    } catch (e) {
      print("Error loading puzzles: $e");
    } finally {
      setLoading(false);
    }
  }

  Future<List<Player>> searchPlayers(String email) async {
    try {
      final response = await apiService.dio.get(
        "/user-service/api/users/players",
        queryParameters: {"keyword": email},
        options: Options(extra: {"requireToken": true}),
      );

      if (response.statusCode == 200 && response.data['isSuccess']) {
        final List<dynamic> players = response.data['data'];
        return players.map((player) => Player.fromJson(player)).toList();
      }
      return [];
    } catch (e) {
      print("Error searching players: $e");
      return [];
    }
  }

  Future<bool> giftPiece({
    required String recipientId,
    required String itemPieceId,
    required int quantity,
  }) async {
    try {
      final response = await apiService.dio.post(
        "/voucher-service/api/item-pieces/gift",
        data: {
          "recipientId": recipientId,
          "itemPieceId": itemPieceId,
          "quantity": quantity,
        },
        options: Options(extra: {"requireToken": true}),
      );

      if (response.statusCode == 204) {
        // Update local state after successful gift
        updatePuzzleAfterGift(itemPieceId, quantity);
        return true;
      }
      return false;
    } catch (e) {
      print("Error gifting piece: $e");
      return false;
    }
  }

  void updatePuzzleAfterGift(String itemPieceId, int quantity) {
    final puzzleIndex = puzzles.indexWhere(
        (puzzle) => puzzle.pieces.any((piece) => piece.id == itemPieceId));

    if (puzzleIndex != -1) {
      final puzzle = puzzles[puzzleIndex];
      final pieceIndex =
          puzzle.pieces.indexWhere((piece) => piece.id == itemPieceId);

      if (pieceIndex != -1) {
        // Create a new list of puzzles to ensure state update
        final updatedPuzzles = List<PuzzleItem>.from(puzzles);
        final updatedPieces = List.of(puzzle.pieces);
        final currentPiece = updatedPieces[pieceIndex];
        updatedPieces[pieceIndex] =
            currentPiece.copyWith(count: currentPiece.count - quantity);

        updatedPuzzles[puzzleIndex] = puzzle.copyWith(pieces: updatedPieces);
        puzzles = updatedPuzzles; // Assign the new list
        notifyListeners();
      }
    }
  }

  Future<bool> exchangeVoucher(String eventId) async {
    try {
      final response = await apiService.dio.post(
        "/voucher-service/api/vouchers/item-pieces-to-voucher",
        data: {"eventId": eventId},
        options: Options(extra: {"requireToken": true}),
      );

      if (response.statusCode == 200 && response.data['isSuccess']) {
        await loadPuzzles(); // Refresh puzzles after successful exchange
        return true;
      }
      return false;
    } catch (e) {
      print("Error exchanging voucher: $e");
      return false;
    }
  }

  // Optional: Add method to refresh puzzles after gifting
  Future<void> refreshPuzzlesAfterGift() async {
    await loadPuzzles();
  }
}
