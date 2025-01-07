import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/features/auth/presentation/LoginPage.dart';
import 'package:vousphere/features/home/presentation/HomePage.dart';
import 'package:vousphere/features/profile/presentation/ProfilePage.dart';
import 'package:vousphere/features/voucher/presentation/VoucherPage.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';
import 'package:vousphere/shared/widgets/CustomNavigationBar.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
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
    HomePage(),
    VoucherPage(),
    Center(child: Text('Location')),
    ProfilePage(),
  ];

  int selectedIndex = 0;
  
  String _getTitle(int selectedIndex) {
    if(selectedIndex == 0) {
      return "Voushere";
    }
    else if(selectedIndex == 1) {
      return "My Vouchers";
    }
    else if(selectedIndex == 2) {
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
          title: Text(_getTitle(selectedIndex), style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade700),),
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
