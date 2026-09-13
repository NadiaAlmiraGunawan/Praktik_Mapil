import 'package:flutter/material.dart';

/// Model data Artikel — digabung di sini dulu karena belum ada folder models/
class Article {
  final int id;
  final String title;
  final String content;
  final String category;
  final String author;
  final DateTime createdAt;

  Article({
    required this.id,
    required this.title,
    required this.content,
    required this.category,
    required this.author,
    required this.createdAt,
  });

  factory Article.fromJson(Map<String, dynamic> json) {
    return Article(
      id: json['id'],
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      category: json['category'] ?? 'Umum',
      author: json['author'] ?? 'Anonim',
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
    );
  }

  String get excerpt {
    final plain = content.replaceAll('\n', ' ');
    return plain.length > 100 ? '${plain.substring(0, 100)}...' : plain;
  }
}

/// Halaman Home = daftar artikel, bisa diakses tanpa login.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isLoggedIn = false;

  final List<Article> _dummyArticles = [
    Article(
      id: 1,
      title: 'Memulai Kebiasaan Menulis',
      content: 'Menulis setiap hari, meski cuma beberapa kalimat, bisa membantu merapikan pikiran dan menyimpan ide-ide kecil sebelum hilang.',
      category: 'Produktivitas',
      author: 'Admin',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    Article(
      id: 2,
      title: 'Kenapa Dokumentasi Kode Itu Penting',
      content: 'Kode yang baik bukan cuma yang jalan, tapi juga yang bisa dipahami orang lain (atau diri sendiri di masa depan).',
      category: 'Teknologi',
      author: 'Admin',
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
    ),
  ];

  void _handleAddArticle() {
    if (!_isLoggedIn) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Silakan login dulu untuk membuat artikel')),
      );
      return;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nara')),
      floatingActionButton: FloatingActionButton(
        onPressed: _handleAddArticle,
        child: const Icon(Icons.add),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(20),
        itemCount: _dummyArticles.length,
        separatorBuilder: (_, __) => const SizedBox(height: 14),
        itemBuilder: (context, index) => _ArticleCard(article: _dummyArticles[index]),
      ),
    );
  }
}

class _ArticleCard extends StatelessWidget {
  final Article article;
  const _ArticleCard({required this.article});

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).colorScheme.primary;

    return InkWell(
      onTap: () {},
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                article.category,
                style: TextStyle(color: primaryColor, fontSize: 12, fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 10),
            Text(article.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
            const SizedBox(height: 6),
            Text(article.excerpt, style: const TextStyle(fontSize: 14, color: Colors.black54)),
            const SizedBox(height: 10),
            Text(
              '${article.author} • ${article.createdAt.day}/${article.createdAt.month}/${article.createdAt.year}',
              style: const TextStyle(fontSize: 12, color: Colors.black45),
            ),
          ],
        ),
      ),
    );
  }
}