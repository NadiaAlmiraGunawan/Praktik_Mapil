class Article {
  final int id;
  final String title;
  final String content;
  final String category;
  final int? categoryId;
  final String? imageUrl;
  final DateTime createdAt;

  Article({
    required this.id,
    required this.title,
    required this.content,
    required this.category,
    this.categoryId,
    this.imageUrl,
    required this.createdAt,
  });

  factory Article.fromJson(Map<String, dynamic> json) {
    // Endpoint GET /posts & /posts/:id (leftJoin) bentuknya:
    //   { posts: {...}, categories: {...} | null }
    // Endpoint GET /saved (relational query) bentuknya:
    //   { id, title, ..., category: {...} }
    final postData = json['posts'] ?? json;
    final categoryData = json['categories'] ?? json['category'];

    return Article(
      id: postData['id'],
      title: postData['title'] ?? '',
      content: postData['content'] ?? '',
      category: categoryData != null ? (categoryData['name'] ?? 'Umum') : 'Umum',
      categoryId: postData['categoryId'],
      imageUrl: postData['imageUrl'],
      createdAt: DateTime.tryParse(postData['createdAt']?.toString() ?? '') ?? DateTime.now(),
    );
  }

  String get excerpt {
    final plain = content.replaceAll('\n', ' ');
    return plain.length > 100 ? '${plain.substring(0, 100)}...' : plain;
  }
}