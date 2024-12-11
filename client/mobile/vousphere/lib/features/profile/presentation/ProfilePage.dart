import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/features/profile/presentation/dialogs/LogoutDialog.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {

  void logout() async {
    bool? status = await showDialog(
        context: context,
        builder: (context) => const LogoutDialog()
    );
    if(status != null && status!) {
      UserProvider userProvider = Provider.of<UserProvider>(context, listen: false);
      await userProvider.logout();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height,
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(10, 4, 10, 4),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 20),
            ClipOval(
              child: Image.network(
                'https://static.vecteezy.com/system/resources/thumbnails/022/385/025/small_2x/a-cute-surprised-black-haired-anime-girl-under-the-blooming-sakura-ai-generated-photo.jpg',
                width: 100,
                height: 100,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 10),
            const Text(
              'Em Gai Xinh Dep',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 15),
            Row(
              children: [
                const SizedBox(width: 10,),
                Icon(Icons.location_on, color: Colors.black.withOpacity(0.6),),
                const SizedBox(width: 6,),
                const Text(
                  'Ho Chi Minh City, Vietnam',
                  style: TextStyle(color: Colors.black54, fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 5),
            Row(
              children: [
                const SizedBox(width: 10,),
                Icon(Icons.phone, color: Colors.black.withOpacity(0.6),),
                const SizedBox(width: 6,),
                const Text(
                  '0919239459',
                  style: TextStyle(color: Colors.black54, fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 5),
            Row(
              children: [
                const SizedBox(width: 10,),
                Icon(Icons.mail, color: Colors.black.withOpacity(0.6),),
                const SizedBox(width: 6,),
                const Text(
                  'emgaixinhdep@gmail.com',
                  style: TextStyle(color: Colors.black54, fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Divider(color: Colors.grey,),
            ListTile(
                onTap: () {},
                leading: Icon(Icons.airplane_ticket_outlined, color: Colors.blue.shade700),
                title: const Text('My Vouchers'),
                splashColor: Colors.blue.shade50,
                selectedColor: Colors.blue.shade50,
                hoverColor: Colors.blue.shade50
            ),
            ListTile(
              onTap: () {},
              leading: Icon(Icons.extension_outlined, color: Colors.blue.shade700),
              title: const Text('Puzzle Collection'),
            ),
            ListTile(
              onTap: () {},
              leading: Icon(Icons.history, color: Colors.blue.shade700),
              title: const Text('History'),
            ),
            ListTile(
              onTap: () {},
              leading: Icon(Icons.favorite_border_outlined, color: Colors.blue.shade700),
              title: const Text('Your favorite'),
            ),
            ListTile(
              onTap: () {},
              leading: Icon(Icons.payment, color: Colors.blue.shade700),
              title: const Text('Payment'),
            ),
            ListTile(
              onTap: () {},
              leading: Icon(Icons.share, color: Colors.blue.shade700),
              title: const Text('Tell your friend'),
            ),
            ListTile(
              onTap: () {},
              leading: Icon(Icons.manage_accounts_outlined, color: Colors.blue.shade700),
              title: const Text('Support'),
            ),
            ListTile(
              onTap: () {},
              leading: Icon(Icons.settings_outlined, color: Colors.blue.shade700),
              title: const Text('Setting'),
            ),
            ListTile(
              onTap: logout,
              leading: Icon(Icons.logout, color: Colors.blue.shade700),
              title: const Text('Logout'),
            ),

          ],
        ),
      ),
    );
  }
}
