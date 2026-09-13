import 'package:flutter/material.dart';
import '../homepage/home.dart'; // pakai class Article yang sudah ada di sana

/// Halaman pencarian artikel berdasarkan judul atau kategori.
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();

  List<Article> _results = [];
  bool _hasSearched = false;

  // TODO: Ganti dengan data asli dari ArticleService/API
  final List<Article> _allArticles = [
    Article(
      id: 1,
      title: 'Memulai Kebiasaan Menulis',
      content:
          'Menulis setiap hari, meski cuma beberapa kalimat, bisa membantu merapikan pikiran dan menyimpan ide-ide kecil sebelum hilang.',
      category: 'Produktivitas',
      author: 'Admin',
      createdAt: DateTime.now().subtract(
        const Duration(days: 1),
      ),
    ),
    Article(
      id: 2,
      title: 'Kenapa Dokumentasi Kode Itu Penting',
      content:
          'Kode yang baik bukan cuma yang jalan, tapi juga yang bisa dipahami orang lain (atau diri sendiri di masa depan).',
      category: 'Teknologi',
      author: 'Admin',
      createdAt: DateTime.now().subtract(
        const Duration(days: 3),
      ),
    ),
    Article(
      id: 3,
      title: 'Mengenal Flutter',
      content:
          'Flutter digunakan untuk membuat aplikasi mobile dari satu basis kode untuk Android dan iOS.',
      category: 'Teknologi',
      author: 'Admin',
      createdAt: DateTime.now().subtract(
        const Duration(days: 5),
      ),
    ),
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _handleSearch(String query) {
    setState(() {
      if (query.trim().isEmpty) {
        _results = [];
        _hasSearched = false;
        return;
      }

      _hasSearched = true;

      final lowerQuery = query.toLowerCase();

      _results = _allArticles.where((article) {
        return article.title.toLowerCase().contains(lowerQuery) ||
            article.category.toLowerCase().contains(lowerQuery);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).colorScheme.primary;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Cari Artikel',
          style: TextStyle(
            color: Colors.white,
          ),
        ),
        backgroundColor: Colors.brown,
        iconTheme: const IconThemeData(
          color: Colors.white,
        ),
      ),

      body: Column(
        children: [
          // =========================
          // SEARCH FIELD
          // =========================
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              autofocus: true,
              onChanged: _handleSearch,

              decoration: InputDecoration(
                hintText: 'Cari judul atau kategori...',

                // Warna placeholder
                hintStyle: const TextStyle(
                  color: Colors.black45,
                ),

                // Icon search
                prefixIcon: const Icon(
                  Icons.search,
                  color: Colors.brown,
                ),

                // Tombol hapus
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(
                          Icons.clear,
                          color: Colors.brown,
                        ),
                        onPressed: () {
                          _searchController.clear();
                          _handleSearch('');
                        },
                      )
                    : null,

                // Tidak menggunakan background
                filled: false,

                // Garis bawah ketika tidak dipilih
                enabledBorder: const UnderlineInputBorder(
                  borderSide: BorderSide(
                    color: Colors.brown,
                    width: 2,
                  ),
                ),

                // Garis bawah ketika sedang mengetik
                focusedBorder: const UnderlineInputBorder(
                  borderSide: BorderSide(
                    color: Colors.brown,
                    width: 2,
                  ),
                ),
              ),
            ),
          ),

          // =========================
          // HASIL PENCARIAN
          // =========================
          Expanded(
            child: !_hasSearched
                ? const Center(
                    child: Text(
                      'Ketik sesuatu untuk mulai mencari',
                      style: TextStyle(
                        color: Colors.black45,
                      ),
                    ),
                  )
                : _results.isEmpty
                    ? const Center(
                        child: Text(
                          'Artikel tidak ditemukan',
                          style: TextStyle(
                            color: Colors.black45,
                          ),
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                        ),
                        itemCount: _results.length,
                        separatorBuilder: (_, __) =>
                            const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final article = _results[index];

                          return _SearchResultCard(
                            article: article,
                            primaryColor: primaryColor,
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}

// =====================================================
// SEARCH RESULT CARD
// =====================================================

class _SearchResultCard extends StatelessWidget {
  final Article article;
  final Color primaryColor;

  const _SearchResultCard({
    required this.article,
    required this.primaryColor,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        // TODO: Navigator.push ke halaman Detail Artikel
      },
      borderRadius: BorderRadius.circular(16),

      child: Container(
        padding: const EdgeInsets.all(16),

        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),

          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // =========================
            // CATEGORY
            // =========================
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 10,
                vertical: 4,
              ),

              decoration: BoxDecoration(
                color: primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),

              child: Text(
                article.category,
                style: TextStyle(
                  color: primaryColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),

            const SizedBox(height: 10),

            // =========================
            // TITLE
            // =========================
            Text(
              article.title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),

            const SizedBox(height: 6),

            // =========================
            // EXCERPT
            // =========================
            Text(
              article.excerpt,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.black54,
              ),
            ),
          ],
        ),
      ),
    );
  }
}