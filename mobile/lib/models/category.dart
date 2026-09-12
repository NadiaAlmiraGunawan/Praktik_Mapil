class Category {
  final int id;
  final String name;

  Category({required this.id, required this.name});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] is String ? int.tryParse(json['id']) ?? 0 : json['id'],
      name: json['name'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {'name': name};
}
