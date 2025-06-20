import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/navigation_state.dart';
import '../state/cart_state.dart';
import '../screens/orders_screen.dart';

class SidebarMenu extends StatelessWidget {
  final String baseApiUrl;

  const SidebarMenu({super.key, required this.baseApiUrl});
  @override
  Widget build(BuildContext context) {
    final navigationState = Provider.of<NavigationState>(context);
    final cartState = Provider.of<CartState>(context);

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'E-commerce App',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'API: $baseApiUrl',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
                const Spacer(),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.shopping_bag),
            title: const Text('Produtos'),
            selected: navigationState.currentIndex == 0,
            selectedTileColor: Colors.blue.withOpacity(0.1),
            selectedColor: Theme.of(context).colorScheme.primary,
            onTap: () {
              navigationState.changeIndex(0);
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.shopping_cart),
            title: const Text('Checkout'),
            selected: navigationState.currentIndex == 1,
            selectedTileColor: Colors.blue.withOpacity(0.1),
            selectedColor: Theme.of(context).colorScheme.primary,
            trailing: Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.red,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                '${cartState.count}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            onTap: () {
              navigationState.changeIndex(1);
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.receipt_long),
            title: const Text('Pedidos Realizados'),
            onTap: () {
              Navigator.pop(context);
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => OrdersScreen(baseApiUrl: baseApiUrl),
                ),
              );
            },
          ),
          const Divider(),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Text(
              'v1.0.0',
              style: TextStyle(color: Colors.grey, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }
}
