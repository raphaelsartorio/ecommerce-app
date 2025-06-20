import 'package:flutter/material.dart';
import '../screens/dummy_screen.dart';
import '../screens/checkout_screen.dart';

class AppPageController {
  static List<String> getTitles() {
    return ['Produtos', 'Checkout'];
  }

  static List<Widget> getPages() {
    return [
      const DummyScreen(
        title: 'Produtos',
        icon: Icons.shopping_bag,
        color: Colors.blue,
      ),
      const CheckoutScreen(),
    ];
  }
}
