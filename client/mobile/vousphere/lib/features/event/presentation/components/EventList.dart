import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/data/models/Event.dart';
import 'package:vousphere/features/event/presentation/components/EventItem.dart';
import 'package:vousphere/features/event/provider/EventProvider.dart';

class EventList extends StatefulWidget {
  const EventList({super.key});

  @override
  State<EventList> createState() => _EventListState();
}

class _EventListState extends State<EventList> {

  // List<Event> events = [
  //   Event(
  //       id: 'id',
  //       name: 'Sale 12/12',
  //       description: 'Description of the event',
  //       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s',
  //       status: 'pending',
  //       startTime: DateTime.now(),
  //       endTime: DateTime.now(),
  //       isFavorite: true,
  //       brand: Brand(brandId: 'brandId', name: 'name', latitude: 12, longitude: 13, address: 'Nha Trang, Khanh Hoa', domain: 'Food'),
  //       games: [
  //         {
  //           "gameId": "shaking-game",
  //           "popUpItemsEnabled": true,
  //           "startTime": null,
  //           "quizzCollectionId": null
  //         }
  //       ],
  //       item: {
  //         "imageId": "82d0ac7b-ffe1-404e-bdfa-7e02a45a99dd",
  //         "image": "https://vouspherestorageaccount.blob.core.windows.net/images/5997758f-fabf-46c9-ae13-7ad9b38948ab",
  //         "numberPieces": 4
  //       },
  //       totalPublishedVouchers: 35,
  //       totalVouchers: 70,
  //       voucherTypes: [
  //         {
  //           "id": "efbf5fea-e306-4d2c-a51f-578dd3934941",
  //           "discount": 10,
  //           "total": 10,
  //           "remaining": 10
  //         },
  //         {
  //           "id": "3f5a7787-221e-4aca-9ba9-0e499b218dff",
  //           "discount": 20,
  //           "total": 5,
  //           "remaining": 5
  //         }
  //       ]
  //   ),
  //   Event(
  //       id: 'id',
  //       name: 'Sale 12/12',
  //       description: 'Description of the event',
  //       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s',
  //       status: 'pending',
  //       startTime: DateTime.now(),
  //       endTime: DateTime.now(),
  //       isFavorite: true,
  //       brand: Brand(brandId: 'brandId', name: 'name', latitude: 12, longitude: 13, address: 'Nha Trang, Khanh Hoa', domain: 'Food'),
  //       games: [
  //         {
  //           "gameId": "shaking-game",
  //           "popUpItemsEnabled": true,
  //           "startTime": null,
  //           "quizzCollectionId": null
  //         }
  //       ],
  //       item: {
  //         "imageId": "82d0ac7b-ffe1-404e-bdfa-7e02a45a99dd",
  //         "image": "https://vouspherestorageaccount.blob.core.windows.net/images/5997758f-fabf-46c9-ae13-7ad9b38948ab",
  //         "numberPieces": 4
  //       },
  //       totalPublishedVouchers: 35,
  //       totalVouchers: 70,
  //       voucherTypes: [
  //         {
  //           "id": "efbf5fea-e306-4d2c-a51f-578dd3934941",
  //           "discount": 10,
  //           "total": 10,
  //           "remaining": 10
  //         },
  //         {
  //           "id": "3f5a7787-221e-4aca-9ba9-0e499b218dff",
  //           "discount": 20,
  //           "total": 5,
  //           "remaining": 5
  //         }
  //       ]
  //   ),
  //   Event(
  //       id: 'id',
  //       name: 'Sale 12/12',
  //       description: 'Description of the event',
  //       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl13KjAzVkCUVnOpE25hpI7lbNNzF3DXwukQ&s',
  //       status: 'pending',
  //       startTime: DateTime.now(),
  //       endTime: DateTime.now(),
  //       isFavorite: true,
  //       brand: Brand(brandId: 'brandId', name: 'name', latitude: 12, longitude: 13, address: 'Nha Trang, Khanh Hoa', domain: 'Food'),
  //       games: [
  //         {
  //           "gameId": "shaking-game",
  //           "popUpItemsEnabled": true,
  //           "startTime": null,
  //           "quizzCollectionId": null
  //         }
  //       ],
  //       item: {
  //         "imageId": "82d0ac7b-ffe1-404e-bdfa-7e02a45a99dd",
  //         "image": "https://vouspherestorageaccount.blob.core.windows.net/images/5997758f-fabf-46c9-ae13-7ad9b38948ab",
  //         "numberPieces": 4
  //       },
  //       totalPublishedVouchers: 35,
  //       totalVouchers: 70,
  //       voucherTypes: [
  //         {
  //           "id": "efbf5fea-e306-4d2c-a51f-578dd3934941",
  //           "discount": 10,
  //           "total": 10,
  //           "remaining": 10
  //         },
  //         {
  //           "id": "3f5a7787-221e-4aca-9ba9-0e499b218dff",
  //           "discount": 20,
  //           "total": 5,
  //           "remaining": 5
  //         }
  //       ]
  //   ),
  // ];

  Future<void> initData() async {
    EventProvider provider = Provider.of<EventProvider>(context, listen: false);
    provider.setLoading(true);
    provider.clearListEvent();
    try {
      await provider.loadEvent();
    } catch (e) {
    }
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      initData();
    });
  }

  @override
  Widget build(BuildContext context) {
    EventProvider eventProvider = Provider.of<EventProvider>(context, listen: true);
    List<Event> events = eventProvider.events;

    if(eventProvider.isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    return ListView.builder(
        shrinkWrap: true,
        itemCount: events.length,
        itemBuilder: (context, index) {
          return EventItem(event: events[index],);
        }
    );
  }
}
