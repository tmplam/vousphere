import 'dart:math';
import 'package:flutter/material.dart';

class VoucherCategory {

  static List<Color> colors = [Colors.red, Colors.green, Colors.blue, Colors.yellow, Colors.pink, Colors.amber, Colors.deepPurple, Colors.lightGreen, Colors.deepOrangeAccent];

  String name;
  Icon icon;
  VoucherCategory(this.name, this.icon);
}