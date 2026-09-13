import 'package:flutter/material.dart';
import 'package:mobile/homepage/home.dart';
import 'package:mobile/search/search.dart';
import 'package:salomon_bottom_bar/salomon_bottom_bar.dart';
// import 'saved/saved.dart';
// import 'profile/profile.dart';

/// Wrapper utama dengan SalomonBottomBar 4 tab: Home, Search, Simpan, Profile.
class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    SearchScreen(),
    // SavedScreen(),
    // ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.brown,
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: SalomonBottomBar(
              currentIndex: _currentIndex,
              onTap: (index) => setState(() => _currentIndex = index),
              items: [
                SalomonBottomBarItem(
                  icon: const Icon(Icons.home),
                  title: const Text('Home'),
                  selectedColor: Colors.white,
                  unselectedColor : Colors.white
                ),
                SalomonBottomBarItem(
                  icon: const Icon(Icons.search),
                  title: const Text('Cari'),
                  selectedColor:  Colors.white,
                  unselectedColor: Colors.white
                ),
                SalomonBottomBarItem(
                  icon: const Icon(Icons.bookmark),
                  title: const Text('Simpan'),
                  selectedColor: Colors.white,
                   unselectedColor: Colors.white

                ),
                SalomonBottomBarItem(
                  icon: const Icon(Icons.person),
                  title: const Text('Profil'),
                  selectedColor: Colors.white,
                  unselectedColor: Colors.white

                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}