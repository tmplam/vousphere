import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/User.dart';
import 'package:vousphere/data/models/Voucher.dart';
import 'package:vousphere/features/profile-edit/presentation/components/CustomTextField.dart';

class GiftVoucherPage extends StatefulWidget {
  const GiftVoucherPage({super.key, required this.voucher});
  final Voucher voucher;

  @override
  State<GiftVoucherPage> createState() => _GiftVoucherPageState();
}

class _GiftVoucherPageState extends State<GiftVoucherPage> {

  ApiService apiService = ApiService();

  TextEditingController emailController = TextEditingController();
  FocusNode emailFocusNode = FocusNode();
  bool isLoading = false;

  User? user;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Gift Voucher', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade700),),
      ),
      body: Container(
        height: MediaQuery.of(context).size.height,
        color: Colors.white,
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 20),
            Container(
              margin: const EdgeInsets.fromLTRB(0, 15, 0, 6),
              child: const Row(
                children: [
                  Icon(Icons.person),
                  SizedBox(width: 4,),
                  Text('Recipient Email '),
                  Text('*', style: TextStyle(color: Colors.red),)
                ],
              ),
            ),
            // TextField for Name
            CustomTextField(controller: emailController, hinText: "Enter recipient's email", focusNode: emailFocusNode,),
            const SizedBox(height: 20,),
            if(user == null)
              FilledButton(
                onPressed: () async {
                    if(isLoading) {
                      return;
                    }
                    String email = emailController.text;

                    setState(() {
                      isLoading = true;
                    });
                    try {
                      final response = await apiService.dio.get(
                          '/user-service/api/users/players',
                          queryParameters: {
                            "keyword": email,
                          },
                          options: Options(
                            extra: {
                              "requireToken": true,
                            }
                          )
                      );

                      if(response.statusCode == 200) {
                        setState(() {
                          user = User.fromJson(response.data['data'][0]);
                        });
                      }

                    }
                    catch(err) {
                      print('Error when search user');
                      Fluttertoast.showToast(msg: 'Failed to find the recipient');
                      print(err);
                    }

                    setState(() {
                      isLoading = false;
                    });
                },
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    isLoading ? const SizedBox(
                      width: 10,
                      height: 10,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white,),
                    ) : const SizedBox.shrink(),
                    const SizedBox(width: 4,),
                    const Text('Next'),
                  ],
                )
            ),
            if(user != null)
              ...[
                Row(
                  children: [
                    ClipOval(
                      child: Image.network(
                        user!.image ?? '',
                        width: 28,
                        height: 28,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Image.asset(
                            'assets/avatars/avatar0.png',
                            width: 28,
                            height: 28,
                            fit: BoxFit.cover,
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 8,),
                    Text(user!.name, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue.shade700),),
                    const SizedBox(width: 10,),
                    const Icon(Icons.check, color: Colors.green, size: 28,)
                  ],
                ),
                const SizedBox(height: 20,),
                FilledButton(
                    onPressed: () async {
                      if(isLoading) {
                        return;
                      }

                      setState(() {
                        isLoading = true;
                      });
                      try {
                        final response = await apiService.dio.post(
                            '/voucher-service/api/vouchers/gift',
                            data: {
                              "recipientId": user!.id,
                              "voucherId": widget.voucher.id,
                            },
                            options: Options(
                                extra: {
                                  "requireToken": true,
                                }
                            )
                        );

                        Navigator.of(context).pop(true);
                      }
                      catch(err) {
                        print('Error when gift voucher');
                        Fluttertoast.showToast(msg: 'Failed to send this voucher to the recipient');
                        print(err);
                      }
                    },
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        isLoading ? const SizedBox(
                          width: 10,
                          height: 10,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white,),
                        ) : const SizedBox.shrink(),
                        const SizedBox(width: 4,),
                        const Text('Confirm'),
                      ],
                    )
                ),
              ],
          ],
        ),
      ),
    );
  }
}
