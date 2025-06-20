class Product {  final String id;
  final String name;
  final String description;
  final String? category;
  final double price;
  final String? material;
  final String? departament;
  final String image;
  final String provider;
  final bool? hasDiscount;
  final String? discountValue;

  Product({
    required this.id,
    required this.name,
    required this.description,
    this.category,
    required this.price,
    this.material,
    this.departament,
    required this.image,
    required this.provider,
    this.hasDiscount,
    this.discountValue,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'].toString(),
      name: json['name'].toString(),
      description: json['description'].toString(),
      category: json['category']?.toString(),
      price: (json['price'] as num).toDouble(),
      material: json['material']?.toString(),
      departament: json['departament']?.toString(),
      image: json['image'].toString(),
      provider: json['provider'].toString(),
      hasDiscount: json['hasDiscount'] != null 
          ? json['hasDiscount'] is bool 
              ? json['hasDiscount'] 
              : json['hasDiscount'].toString().toLowerCase() == 'true'
          : false,
      discountValue: json['discountValue']?.toString() ?? '0',
    );
  }
}
