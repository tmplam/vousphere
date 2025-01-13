import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/features/auth/presentation/LoginPage.dart';
import 'package:vousphere/features/home/presentation/HomePage.dart';
import 'package:vousphere/features/location/LocationPage.dart';
import 'package:vousphere/features/notification/NotificationPage.dart';
import 'package:vousphere/features/notification/provider/NotificationProvider.dart';
import 'package:vousphere/features/profile/presentation/ProfilePage.dart';
import 'package:vousphere/features/voucher/presentation/VoucherPage.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';
import 'package:vousphere/shared/widgets/CustomNavigationBar.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ApiConstants.loadBaseUrl();
  ApiService apiService = ApiService();
  await apiService.init();


  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => UserProvider(apiService),
        ),
        ChangeNotifierProvider(
          create: (context) => NotificationProvider(apiService),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

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
    HomePage(),
    VoucherPage(),
    LocationPage(),
    ProfilePage(),
  ];

  int selectedIndex = 0;

  String _getTitle(int selectedIndex) {
    if (selectedIndex == 0) {
      return "Voushere";
    } else if (selectedIndex == 1) {
      return "My Vouchers";
    } else if (selectedIndex == 2) {
      return "Location";
    }
    return "Profile";
  }

  void onItemTapped(int index) {
    setState(() {
      selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          _getTitle(selectedIndex),
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.blue.shade700,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
            child: Stack(
              children: [
                IconButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ChangeNotifierProvider.value(
                          value: Provider.of<NotificationProvider>(context,
                              listen: true),
                          child: const NotificationPage(),
                        ),
                      ),
                    );
                  },
                  icon: const Icon(Icons.notifications),
                ),
                Consumer<NotificationProvider>(
                  builder: (context, provider, child) {
                    return provider.unreadCount > 0
                        ? Positioned(
                            right: 1,
                            top: 2,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.red.shade600,
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.2),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                                border: Border.all(
                                  color: Colors.white,
                                  width: 1.5,
                                ),
                              ),
                              constraints: const BoxConstraints(
                                minWidth: 18,
                                minHeight: 18,
                              ),
                              child: Center(
                                child: Text(
                                  provider.unreadCount > 99
                                      ? '99+'
                                      : '${provider.unreadCount}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    height: 1,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ),
                          )
                        : const SizedBox
                            .shrink(); // More efficient than empty Container
                  },
                )
              ],
            ),
          ),
        ],
      ),
      body: Container(
        width: double.infinity,
        color: Colors.white,
        child: pageOptions.elementAt(selectedIndex),
      ),
      bottomNavigationBar: CustomNavigationBar(
        currentIndex: selectedIndex,
        onDestinationSelected: onItemTapped,
      ),
    );
  }
}
