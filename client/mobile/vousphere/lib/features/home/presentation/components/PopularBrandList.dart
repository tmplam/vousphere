import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/Counterpart.dart';
import 'package:vousphere/features/home/presentation/components/PopularBrandItem.dart';

class PopularBrandList extends StatefulWidget {
  const PopularBrandList({super.key});

  @override
  State<PopularBrandList> createState() => _PopularBrandListState();
}

class _PopularBrandListState extends State<PopularBrandList> {

  List<Counterpart> counterparts = [];

  final ApiService apiService = ApiService();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    initData();
  }

  void initData() async {
    try {
      final response = await apiService.dio.get(
          ApiConstants.getPopularBrand,
          queryParameters: {
            "page": 1,
            "perPage": 25,
            "keyword": '',
          },
          options: Options(
              extra: {
                "requireToken": true,
              }
          )
      );
      if(response.statusCode == 200) {
        setState(() {
          counterparts.addAll(
              List<Counterpart>.from(
                  response.data["data"]["data"].map((item) => Counterpart.fromJson(item))
              )
          );
        });
        // print(counterparts);
      }
    }
    catch(e) {
      print("error when load popular brands");
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    if(counterparts.isEmpty) {
      return const SizedBox(
        height: 240,
        child: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: counterparts.map((counterpart) => PopularBrandItem(counterpart: counterpart)).toList(),
      ),
    );
  }
}
