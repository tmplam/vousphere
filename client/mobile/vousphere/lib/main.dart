import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/features/auth/presentation/LoginPage.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';
import 'package:vousphere/shared/widgets/CustomNavigationBar.dart';

void main() async {
  ApiService apiService = ApiService();
  // make sure to load the token from security storage
  await apiService.init();

  runApp(
    ChangeNotifierProvider(
        create: (context) => UserProvider(apiService),
        child: const MyApp(),
    )
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    UserProvider userProvider = Provider.of<UserProvider>(context);
    return MaterialApp(
      title: 'vousphere',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: userProvider.isAuthenticated ? const MyMainPage() : LoginPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class MyMainPage extends StatefulWidget {
  const MyMainPage({super.key});

  @override
  State<MyMainPage> createState() => _MyMainPageState();
}

class _MyMainPageState extends State<MyMainPage> {
  static const List<Widget> pageOptions = <Widget>[
    Center(child: Text('Home')),
    Center(child: Text('Voucher')),
    Center(child: Text('Location')),
    Center(child: Text('Profile')),
  ];

  int selectedIndex = 0;

  void onItemTapped(int index) {
    setState(() {
      selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Row(children: [
            Expanded(
              child: TextField(
                decoration: InputDecoration(
                  contentPadding: EdgeInsets.fromLTRB(0, 12, 0, 4),
                  filled: true,
                  fillColor: Colors.transparent,
                  hoverColor: Colors.transparent,
                  focusColor: Colors.white,
                  hintText: 'Search...',
                  hintStyle: const TextStyle(color: Colors.blueGrey),
                  prefixIcon: const Icon(
                    Icons.search,
                    color: Colors.blueGrey,
                  ),
                  suffixIcon: IconButton(icon: Icon(Icons.clear), onPressed: () {},),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16), // Đặt độ bo góc
                    borderSide: BorderSide.none, // Không có viền khi không focus
                  ),
                  focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide(color: Colors.blue.shade700, width: 0.7)
                  ),
                ),
              ),
            ),
          ]),
          actions: [
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
              child: IconButton(
                  onPressed: () {}, icon: const Icon(Icons.notifications)),
            )
          ],
        ),
        body: Container(
          width: double.infinity,
          color: Colors.white,
          child: pageOptions.elementAt(selectedIndex),
        ),
        bottomNavigationBar: CustomNavigationBar(currentIndex: selectedIndex, onDestinationSelected: onItemTapped));
  }
}
