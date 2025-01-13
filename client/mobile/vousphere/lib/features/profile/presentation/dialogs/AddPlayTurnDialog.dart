import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:vousphere/features/profile/presentation/GiftPlayTurnPage.dart';
import 'package:vousphere/features/voucher/presentation/GiftVoucherPage.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';

class AddPlayTurnDialog extends StatelessWidget {
  const AddPlayTurnDialog({super.key});

  @override
  Widget build(BuildContext context) {

    UserProvider userProvider = Provider.of<UserProvider>(context);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Play Turns',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          ListTile(
            leading: const Icon(Icons.facebook, color: Colors.blue),
            title: const Text('Share on Facebook'),
            onTap: () => _shareOnFacebook(context),
          ),
          const Divider(),
          ListTile(
            leading: Icon(Icons.person_add, color: Colors.blue.shade700),
            title: const Text('Give gifts to friends'),
            onTap: () async {
              bool? status = await Navigator.push(
                  context,
                  PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => const GiftPlayTurnPage(),));
              if(status != null && status == true) {
                Fluttertoast.showToast(msg: 'Gift play turn successfully');
                await userProvider.getUser();
                Navigator.of(context).pop();
              }
            },
          ),
        ],
      ),
    );
  }

  Future<void> _shareOnFacebook(BuildContext context) async {
    try {
      final result = await Share.shareWithResult(
        'Check out this awesome app! 🎉 Play with me on [Vousphere]! 🕹️\nhttps://vousphere.com',
        subject: 'Join me on [Vousphere]!',
      );

      if (context.mounted) {
        if (result.status == ShareResultStatus.success) {
          _showShareResultDialog(
            context,
            true,
            'Successfully shared! You\'ve earned a play turn.',
          );
        } else if (result.status == ShareResultStatus.dismissed) {
          _showShareResultDialog(
            context,
            false,
            'Sharing was cancelled. Try again to earn a play turn.',
          );
        }
      }
    } catch (e) {
      if (context.mounted) {
        _showShareResultDialog(
          context,
          false,
          'Could not open sharing options. Please try again.',
        );
      }
    }
  }

  void _showShareResultDialog(
      BuildContext context, bool success, String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: success ? Colors.green.shade50 : Colors.red.shade50,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    success ? Icons.check_circle : Icons.error,
                    color: success ? Colors.green : Colors.red,
                    size: 40,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  success ? 'Success!' : 'Oops!',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  message,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.grey.shade700,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      if (success) {
                        Navigator.of(context).pop();
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: success ? Colors.green : Colors.blue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(success ? 'Great!' : 'Try Again'),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
