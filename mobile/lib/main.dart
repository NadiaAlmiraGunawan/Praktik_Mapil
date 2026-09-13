import 'package:flutter/material.dart';
import 'homepage/home.dart';

void main() {
  runApp(const NaraApp());
}

class NaraApp extends StatelessWidget {
  const NaraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Nara',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF2F5233),
        scaffoldBackgroundColor: const Color(0xFFFBF9F4),
      ),
      home: const HomeScreen(),
    );
  }
}