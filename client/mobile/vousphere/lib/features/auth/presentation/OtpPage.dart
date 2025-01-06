import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/features/auth/presentation/components/SubmitOtpButton.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';

import 'components/AppLogo.dart';
import 'components/Field.dart';

class OtpPage extends StatefulWidget {
  const OtpPage({super.key, required this.email});

  final String email;

  @override
  State<OtpPage> createState() => _OtpPageState();
}

class _OtpPageState extends State<OtpPage> {

  final ApiService apiService = ApiService();
  final TextEditingController otpController = TextEditingController();
  final FocusNode otpFocusNode = FocusNode();
  String? errorMessage;
  bool isLoading = false;

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    otpController.dispose();
    otpFocusNode.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        body: ListView(
            padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom + 30
            ),
            children: [
              Row(
                children: [
                  Expanded(flex: 1, child: Container()),
                  Expanded(
                    flex: 10,
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          const SizedBox(height: 15),
                          const AppLogo(),
                          const SizedBox(height: 20),
                          Row(
                            children: [
                              IconButton(
                                  onPressed: () async {
                                    String email = widget.email;
                                    try {
                                      final response = await apiService.dio.post(
                                          ApiConstants.resendOtp,
                                          data: {
                                            "email": email,
                                          }
                                      );
                                      Fluttertoast.showToast(msg: 'OTP has been sent to your email');
                                    }
                                    catch (e) {
                                      if(e is DioException) {
                                        if (e.response != null) {
                                          print("Status code: ${e.response?.statusCode}");
                                          print("Response data: ${e.response?.data}");
                                          setState(() {
                                            errorMessage = "Invalid email or password";
                                          });
                                        } else {
                                          print("Error message: ${e.message}");
                                        }
                                      }
                                      else {
                                        print("Something went wrong");
                                      }
                                      Fluttertoast.showToast(msg: 'Something went wrong, please try later!');
                                    }
                                  },
                                  icon: const Icon(Icons.refresh, color: Colors.blue,),
                              ),
                              const Text('Resend OTP'),
                            ],
                          ),
                          const SizedBox(height: 15),
                          Field(fieldName: 'OTP',
                              controller: otpController,
                              focusNode: otpFocusNode,
                              focusNodeNext: null),
                          const SizedBox(height: 30),
                          if (errorMessage != null) ...[
                              const SizedBox(height: 20),
                              Text(errorMessage!, style: const TextStyle(color: Colors.red, fontSize: 15),),
                              const SizedBox(height: 10),
                          ],
                          if (isLoading) ...[
                              const SizedBox(height: 15),
                              const Center(
                                  child: SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator()
                                  )
                              ),
                              const SizedBox(height: 10),
                          ],
                          SubmitOtpButton(onPressed: () async {
                            if(isLoading) {
                              return;
                            }

                            String email = widget.email;
                            String otp = otpController.text;

                            setState(() {
                              errorMessage = null;
                            });

                            if(otp.trim().length < 6) {
                              setState(() {
                                errorMessage = "OTP must contain 6 digists";
                              });
                              return;
                            }

                            setState(() {
                              isLoading = true;
                            });
                            // using apiService to call login api here
                            try {
                              final response = await apiService.dio.patch(
                                  ApiConstants.verifyEmail,
                                  data: {
                                    "email": email,
                                    "otpCode": otp,
                                  }
                              );
                              if(response.statusCode == 200) {
                                final accessToken = response.data['data']['accessToken'];
                                await apiService.saveTokens(accessToken);
                                final userProvider = Provider.of<UserProvider>(context, listen: false);
                                userProvider.setIsAuthenticated(true);
                                await userProvider.getUser();
                                Navigator.pop(context);
                              }
                            }
                            catch (e) {
                              if(e is DioException) {
                                if (e.response != null) {
                                  print("Status code: ${e.response?.statusCode}");
                                  print("Response data: ${e.response?.data}");
                                  setState(() {
                                    errorMessage = "Invalid email or password";
                                  });
                                } else {
                                  print("Error message: ${e.message}");
                                }
                              }
                              else {
                                print("Something went wrong");
                              }
                              setState(() {
                                errorMessage = "Invalid Code";
                              });
                            }

                            setState(() {
                              isLoading = false;
                            });

                          }
                          ),
                          const SizedBox(height: 15),
                      ],
                    ),
                  ),
                  Expanded(flex: 1, child: Container()),
                ],
              ),
            ]),
        resizeToAvoidBottomInset: false,
      ),
    );
  }
}
