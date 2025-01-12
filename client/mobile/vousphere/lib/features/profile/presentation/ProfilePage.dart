import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/data/models/User.dart';
import 'package:vousphere/features/profile-edit/presentation/ProfileEditPage.dart';
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

    UserProvider userProvider = Provider.of<UserProvider>(context, listen: true);
    User user = userProvider.user;

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
                user.image ?? '',
                width: 100,
                height: 100,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Image.asset(
                    'assets/avatars/avatar0.png',
                    width: 100,
                    height: 100,
                    fit: BoxFit.cover,
                  );
                },
              ),
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  user.name,
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                IconButton(
                    onPressed: () {
                      Navigator.push(
                          context,
                          PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => const ProfileEditPage(),));
                    },
                    icon: const Icon(Icons.edit),
                    tooltip: "Edit your profile",
                ),
              ],
            ),
            const SizedBox(height: 15),
            Row(
              children: [
                const SizedBox(width: 10,),
                Icon(Icons.date_range, color: Colors.black.withOpacity(0.6),),
                const SizedBox(width: 6,),
                Text(
                  user.player?['dateOfBirth'] ?? 'Date of birth',
                  style: const TextStyle(color: Colors.black54, fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 5),
            Row(
              children: [
                const SizedBox(width: 10,),
                Icon(Icons.phone, color: Colors.black.withOpacity(0.6),),
                const SizedBox(width: 6,),
                Text(
                  user.phoneNumber.isNotEmpty ? user.phoneNumber : 'Phone',
                  style: const TextStyle(color: Colors.black54, fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 5),
            Row(
              children: [
                const SizedBox(width: 10,),
                Icon(Icons.mail, color: Colors.black.withOpacity(0.6),),
                const SizedBox(width: 6,),
                Text(
                  user.email,
                  style: const TextStyle(color: Colors.black54, fontSize: 16),
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
              onTap: () {
                showModalBottomSheet(
                  context: context,
                  backgroundColor: Colors.transparent,
                  builder: (context) => const AddPlayTurnDialog(),
                );
              },
              leading: Icon(Icons.add, color: Colors.blue.shade700),
              title: const Text('Add Play Turn'),
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
