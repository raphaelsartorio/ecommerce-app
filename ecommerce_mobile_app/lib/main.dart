import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'dart:convert';
import 'models/product.dart';
import 'widgets/sidebar_menu.dart';
import 'state/navigation_state.dart';
import 'state/cart_state.dart';
import 'controllers/page_controller.dart';
import 'screens/orders_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => NavigationState()),
        ChangeNotifierProvider(create: (context) => CartState()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'E-commerce App',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const ProductListPage(title: 'Produtos'),
    );
  }
}

class ProductListPage extends StatefulWidget {
  const ProductListPage({super.key, required this.title});

  final String title;

  @override
  State<ProductListPage> createState() => _ProductListPageState();
}

class _ProductListPageState extends State<ProductListPage> {
  List<Product> products = [];
  List<Product> filteredProducts = [];

  // Filtros
  String searchQuery = '';
  String? selectedCategory;
  String? selectedDepartment;
  String? selectedMaterial;
  String? selectedProvider;
  bool? hasDiscount;

  // Listas de filtro
  Set<String?> categories = {};
  Set<String?> departments = {};
  Set<String?> materials = {};
  Set<String?> providers = {};

  bool isLoading = true;
  String? error;
  bool isTesting = false;
  bool showFilters = false;

  // Scaffold key para controlar o drawer
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  // Configure a URL base de acordo com seu ambiente de desenvolvimento
  static const String baseApiUrl = 'http://10.0.2.2:3000';

  String get _baseUrl => baseApiUrl;

  final TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  // Extrair valores únicos para filtros
  void _extractFilterValues() {
    categories = products.map((product) => product.category).toSet();
    departments = products.map((product) => product.departament).toSet();
    materials = products.map((product) => product.material).toSet();
    providers = products.map((product) => product.provider).toSet();
  }

  // Aplicar filtros
  void applyFilters() {
    setState(() {
      filteredProducts = products.where((product) {
        final nameMatches =
            searchQuery.isEmpty ||
            product.name.toLowerCase().contains(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().contains(
              searchQuery.toLowerCase(),
            );
        final categoryMatches =
            selectedCategory == null || product.category == selectedCategory;
        final departmentMatches =
            selectedDepartment == null ||
            product.departament == selectedDepartment;
        final materialMatches =
            selectedMaterial == null || product.material == selectedMaterial;
        final providerMatches =
            selectedProvider == null || product.provider == selectedProvider;
        final discountMatches =
            hasDiscount == null ||
            (hasDiscount == true && (product.hasDiscount == true)) ||
            (hasDiscount == false &&
                (product.hasDiscount == false || product.hasDiscount == null));
        return nameMatches &&
            categoryMatches &&
            departmentMatches &&
            materialMatches &&
            providerMatches &&
            discountMatches;
      }).toList();
    });
  }

  // Resetar filtros
  void resetFilters() {
    setState(() {
      searchQuery = '';
      selectedCategory = null;
      selectedDepartment = null;
      selectedMaterial = null;
      selectedProvider = null;
      hasDiscount = null;
      searchController.clear();
      filteredProducts = List.from(products);
    });
  }

  Future<void> fetchProducts() async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl/products'));

      if (response.statusCode == 200) {
        final List<dynamic> productsJson = json.decode(response.body);
        setState(() {
          products = productsJson
              .map((json) => Product.fromJson(json))
              .toList();
          filteredProducts = List.from(products);
          isLoading = false;
          _extractFilterValues();
        });
      } else {
        setState(() {
          error = 'Erro ao carregar produtos: ${response.statusCode}';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Erro ao conectar com o servidor: $e';
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final navigationState = Provider.of<NavigationState>(context);

    return PopScope(
      canPop:
          navigationState.currentIndex == 0 &&
          (_scaffoldKey.currentState == null ||
              !_scaffoldKey.currentState!.isDrawerOpen),
      onPopInvoked: (didPop) {
        if (didPop) return;

        if (_scaffoldKey.currentState != null &&
            _scaffoldKey.currentState!.isDrawerOpen) {
          Navigator.of(context).pop();
        } else if (navigationState.currentIndex != 0) {
          navigationState.changeIndex(0);
        }
      },
      child: Scaffold(
        key: _scaffoldKey,
        appBar: AppBar(
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(AppPageController.getTitles()[navigationState.currentIndex]),
            ],
          ),
          leading: IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () {
              if (_scaffoldKey.currentState != null) {
                _scaffoldKey.currentState!.openDrawer();
              }
            },
          ),
          actions: [
            if (navigationState.currentIndex == 0)
              IconButton(
                icon: Icon(
                  showFilters ? Icons.filter_list_off : Icons.filter_list,
                ),
                onPressed: () {
                  setState(() {
                    showFilters = !showFilters;
                  });
                },
                tooltip: 'Filtros',
              ),
          ],
        ),
        drawer: SidebarMenu(baseApiUrl: _baseUrl),
        body: IndexedStack(
          index: navigationState.currentIndex,
          children: [
            RefreshIndicator(
              onRefresh: fetchProducts,
              child: Column(
                children: [
                  if (showFilters) _buildFilters(),
                  Expanded(child: _buildBody()),
                ],
              ),
            ),
            AppPageController.getPages()[1],
          ],
        ),
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.all(12),
      color: Colors.grey[100],
      child: Column(
        children: [
          TextField(
            controller: searchController,
            decoration: InputDecoration(
              hintText: 'Buscar produtos...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(vertical: 0),
            ),
            onChanged: (value) {
              setState(() {
                searchQuery = value;
                applyFilters();
              });
            },
          ),

          const SizedBox(height: 12),

          // Filtros de categoria, departamento e material
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                // Filtro de Categoria
                if (categories.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: DropdownButton<String?>(
                      hint: const Text('Categoria'),
                      value: selectedCategory,
                      onChanged: (value) {
                        setState(() {
                          selectedCategory = value;
                          applyFilters();
                        });
                      },
                      items: [
                        const DropdownMenuItem<String?>(
                          value: null,
                          child: Text('Todas as categorias'),
                        ),
                        ...categories
                            .where((cat) => cat != null)
                            .map(
                              (cat) => DropdownMenuItem<String?>(
                                value: cat,
                                child: Text(cat!),
                              ),
                            )
                            .toList(),
                      ],
                    ),
                  ),

                // Filtro de Departamento
                if (departments.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: DropdownButton<String?>(
                      hint: const Text('Departamento'),
                      value: selectedDepartment,
                      onChanged: (value) {
                        setState(() {
                          selectedDepartment = value;
                          applyFilters();
                        });
                      },
                      items: [
                        const DropdownMenuItem<String?>(
                          value: null,
                          child: Text('Todos os departamentos'),
                        ),
                        ...departments
                            .where((dep) => dep != null)
                            .map(
                              (dep) => DropdownMenuItem<String?>(
                                value: dep,
                                child: Text(dep!),
                              ),
                            )
                            .toList(),
                      ],
                    ),
                  ),

                // Filtro de Material
                if (materials.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: DropdownButton<String?>(
                      hint: const Text('Material'),
                      value: selectedMaterial,
                      onChanged: (value) {
                        setState(() {
                          selectedMaterial = value;
                          applyFilters();
                        });
                      },
                      items: [
                        const DropdownMenuItem<String?>(
                          value: null,
                          child: Text('Todos os materiais'),
                        ),
                        ...materials
                            .where((mat) => mat != null)
                            .map(
                              (mat) => DropdownMenuItem<String?>(
                                value: mat,
                                child: Text(mat!),
                              ),
                            )
                            .toList(),
                      ],
                    ),
                  ),

                // Filtro de Fornecedor
                if (providers.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: DropdownButton<String?>(
                      hint: const Text('Fornecedor'),
                      value: selectedProvider,
                      onChanged: (value) {
                        setState(() {
                          selectedProvider = value;
                          applyFilters();
                        });
                      },
                      items: [
                        const DropdownMenuItem<String?>(
                          value: null,
                          child: Text('Todos os fornecedores'),
                        ),
                        ...providers
                            .where((prov) => prov != null)
                            .map(
                              (prov) => DropdownMenuItem<String?>(
                                value: prov,
                                child: Text(prov!),
                              ),
                            )
                            .toList(),
                      ],
                    ),
                  ),

                // Filtro de Desconto
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: DropdownButton<bool?>(
                    hint: const Text('Desconto'),
                    value: hasDiscount,
                    onChanged: (value) {
                      setState(() {
                        hasDiscount = value;
                        applyFilters();
                      });
                    },
                    items: const [
                      DropdownMenuItem<bool?>(
                        value: null,
                        child: Text('Todos'),
                      ),
                      DropdownMenuItem<bool?>(
                        value: true,
                        child: Text('Com desconto'),
                      ),
                      DropdownMenuItem<bool?>(
                        value: false,
                        child: Text('Sem desconto'),
                      ),
                    ],
                  ),
                ),

                // Botão para limpar filtros
                ElevatedButton.icon(
                  onPressed: () {
                    resetFilters();
                  },
                  icon: const Icon(Icons.clear),
                  label: const Text('Limpar'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBody() {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(error!, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: fetchProducts,
              child: const Text('Tentar Novamente'),
            ),
          ],
        ),
      );
    }

    if (products.isEmpty) {
      return const Center(child: Text('Nenhum produto encontrado'));
    }

    if (filteredProducts.isEmpty) {
      return const Center(
        child: Text('Nenhum produto corresponde aos filtros'),
      );
    }

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          color: Colors.blue[100],
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Produtos encontrados: ${filteredProducts.length}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: GridView.builder(
            padding: const EdgeInsets.all(8),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.7,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemCount: filteredProducts.length,
            itemBuilder: (context, index) {
              final product = filteredProducts[index];
              return Card(
                clipBehavior: Clip.antiAlias,
                margin: EdgeInsets.zero,
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: product.image.isNotEmpty
                              ? Image.network(
                                  product.image,
                                  width: 90,
                                  height: 90,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) =>
                                      Image.asset(
                                        'public/no_image.jpg',
                                        width: 90,
                                        height: 90,
                                        fit: BoxFit.cover,
                                      ),
                                )
                              : Image.asset(
                                  'public/no_image.jpg',
                                  width: 90,
                                  height: 90,
                                  fit: BoxFit.cover,
                                ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        product.name,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      if (product.provider.toLowerCase() == 'brazilian')
                        Padding(
                          padding: const EdgeInsets.only(top: 2, bottom: 2),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.green[50],
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: Colors.green, width: 1),
                            ),
                            child: const Text(
                              'BR BRASILEIRO',
                              style: TextStyle(
                                color: Colors.green,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      if (product.provider.toLowerCase() == 'european')
                        Padding(
                          padding: const EdgeInsets.only(top: 2, bottom: 2),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.amber[100],
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(
                                color: Colors.orange,
                                width: 1,
                              ),
                            ),
                            child: const Text(
                              'EU EUROPEU',
                              style: TextStyle(
                                color: Colors.orange,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      const SizedBox(height: 2),
                      Flexible(
                        child: Text(
                          product.description,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.black87,
                          ),
                        ),
                      ),
                      const SizedBox(height: 2),
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            if (product.category != null)
                              Padding(
                                padding: const EdgeInsets.only(right: 2),
                                child: Chip(
                                  label: Text(product.category!),
                                  backgroundColor: Colors.blue[50],
                                  labelStyle: const TextStyle(fontSize: 10),
                                  visualDensity: VisualDensity.compact,
                                  padding: EdgeInsets.zero,
                                ),
                              ),
                            if (product.departament != null)
                              Padding(
                                padding: const EdgeInsets.only(right: 2),
                                child: Chip(
                                  label: Text(product.departament!),
                                  backgroundColor: Colors.teal[50],
                                  labelStyle: const TextStyle(fontSize: 10),
                                  visualDensity: VisualDensity.compact,
                                  padding: EdgeInsets.zero,
                                ),
                              ),
                            if (product.material != null)
                              Chip(
                                label: Text(product.material!),
                                backgroundColor: Colors.grey[100],
                                labelStyle: const TextStyle(fontSize: 10),
                                visualDensity: VisualDensity.compact,
                                padding: EdgeInsets.zero,
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'R\$ ${product.price.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 15,
                              color: Colors.blueAccent,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(
                              Icons.add_shopping_cart,
                              color: Colors.blueAccent,
                            ),
                            tooltip: 'Adicionar ao carrinho',
                            onPressed: () {
                              Provider.of<CartState>(
                                context,
                                listen: false,
                              ).addProduct(product);
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    '${product.name} adicionado ao carrinho',
                                  ),
                                  duration: const Duration(seconds: 1),
                                  action: SnackBarAction(
                                    label: 'VER CARRINHO',
                                    onPressed: () {
                                      Provider.of<NavigationState>(
                                        context,
                                        listen: false,
                                      ).changeIndex(1);
                                    },
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
