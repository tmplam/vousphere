import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';

class SignInWithGoogleButton extends StatelessWidget {
  SignInWithGoogleButton({super.key});


  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email',],
    clientId: 'client id'
  );

  // Future<void> getGoogleAuthToken() async {
  //   try {
  //     print('>>> hahahaha');
  //     final GoogleSignInAccount? account = await _googleSignIn.signIn();
  //     print('>>> account ${account}');
  //     if (account != null) {
  //       final GoogleSignInAuthentication auth = await account.authentication;
  //       print('>>> idToken ${auth.idToken}');
  //       print('>>> accessToken ${auth.idToken}');
  //     }
  //   } catch (error) {
  //     print('Google Sign-In failed: $error');
  //   }
  // }


  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () async {
        // await getGoogleAuthToken();
      },
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.all(5),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Padding(
            padding: const EdgeInsets.all(5),
            child: ClipOval(
              child: Image.asset(
                'assets/icons/google-icon.png',
                width: 15,
                height: 15,
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(
            width: 10,
          ),
          const Text(
            'Sign in with Google',
            style: TextStyle(
                fontSize: 15,
                color: Colors.black
            ),
          ),
        ],
      ),
    );
  }
}
