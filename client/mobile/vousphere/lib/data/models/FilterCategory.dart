import 'package:flutter/material.dart';

class FilterCategory {

  static List<Color> colors = [Colors.red, Colors.green, Colors.blue, Colors.yellow, Colors.pink, Colors.amber, Colors.deepPurple, Colors.lightGreen, Colors.deepOrangeAccent];

  String name;
  Icon icon;
  FilterCategory(this.name, this.icon);
}