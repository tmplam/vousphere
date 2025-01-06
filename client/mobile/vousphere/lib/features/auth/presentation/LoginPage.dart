import 'package:dio/dio.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/features/auth/presentation/OtpPage.dart';
import 'package:vousphere/features/auth/presentation/components/AppLogo.dart';
import 'package:vousphere/features/auth/presentation/components/Field.dart';
import 'package:vousphere/features/auth/presentation/components/HorizontalLine.dart';
import 'package:vousphere/features/auth/presentation/components/LoginButton.dart';
import 'package:vousphere/features/auth/presentation/components/PasswordField.dart';
import 'package:vousphere/features/auth/presentation/components/RegisterButton.dart';
import 'package:vousphere/features/auth/presentation/components/SignInWithGoogleButton.dart';
import 'package:vousphere/features/auth/presentation/components/SwitchLoginButton.dart';
import 'package:vousphere/features/auth/presentation/dialog/InputEmailDialog.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final ApiService apiService = ApiService();
  late String currentState;
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  final FocusNode passwordFocusNode = FocusNode();
  final FocusNode emailFocusNode = FocusNode();
  final FocusNode nameFocusNode = FocusNode();
  final FocusNode confirmedPasswordFocusNode = FocusNode();
  String? errorMessage;
  String? successMessage;
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    currentState = 'Login';
    passwordFocusNode.addListener(() {
      if (passwordFocusNode.hasFocus) {
        _scrollToFocusedField(passwordFocusNode);
      }
    });
    emailFocusNode.addListener(() {
      if (emailFocusNode.hasFocus) {
        _scrollToFocusedField(emailFocusNode);
      }
    });
    nameFocusNode.addListener(() {
      if (nameFocusNode.hasFocus) {
        _scrollToFocusedField(nameFocusNode);
      }
    });
    confirmedPasswordFocusNode.addListener(() {
      if (confirmedPasswordFocusNode.hasFocus) {
        _scrollToFocusedField(confirmedPasswordFocusNode);
      }
    });
  }

  void login() async {
    setState(() {
      errorMessage = null;
    });

    final email = emailController.text.trim();
    final password = passwordController.text;

    final emailRegex = RegExp(r'^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.][a-zA-Z]{2,3})+$');

    if (email.isEmpty) {
      setState(() {
        errorMessage = "Email cannot be empty.";
      });
      return;
    }
    if (password.isEmpty) {
      setState(() {
        errorMessage = "Password cannot be empty.";
      });
      return;
    }
    if (!emailRegex.hasMatch(email)) {
      setState(() {
        errorMessage = "Email is not in correct format.";
      });
      return;
    }

    setState(() {
      isLoading = true;
    });
    // using apiService to call login api here
    try {
      final response = await apiService.dio.post(
          ApiConstants.login,
          data: {
            "email": email,
            "password": password,
          }
      );
      if(response.statusCode == 200) {
        final accessToken = response.data['data']['accessToken'];
        await apiService.saveTokens(accessToken);

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
    }
    // fake call api, fake token
    // await Future.delayed(const Duration(milliseconds: 2000));
    // await apiService.saveTokens('accessToken', 'refreshToken');
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    userProvider.setIsAuthenticated(true);
    await userProvider.getUser();
    setState(() {
      isLoading = false;
    });
  }

  void register() async {
    setState(() {
      errorMessage = null;
    });
    final email = emailController.text.trim();
    final password = passwordController.text;
    final name = nameController.text.trim();
    final confirmedPassword = confirmPasswordController.text;

    final emailRegex = RegExp(r'^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.][a-zA-Z]{2,3})+$');

    if (email.isEmpty) {
      setState(() {
        errorMessage = "Email cannot be empty.";
      });
      return;
    }
    if (password.length < 6) {
      setState(() {
        errorMessage = "Password must be at least 6 characters";
      });
      return;
    }
    if(confirmedPassword != password) {
      setState(() {
        errorMessage = "Confirmed password does not match";
      });
      return;
    }
    if(name.isEmpty) {
      setState(() {
        errorMessage = "Name cannot be empty";
      });
      return;
    }
    if (!emailRegex.hasMatch(email)) {
      setState(() {
        errorMessage = "Email is not in correct format.";
      });
      return;
    }

    print({
      "email": email,
      "name": name,
      "password": password,
      "isBrand": false,
    });

    setState(() {
      isLoading = true;
    });
    // using apiService to call login api here
    try {
      final response = await apiService.dio.post(
          ApiConstants.register,
          data: {
            "email": email,
            "name": name,
            "password": password,
            "isBrand": false,
          }
      );
      if(response.statusCode == 200) {
        await Navigator.push(
            context,
            PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => OtpPage(email: email,),));

      }
    }
    catch (e) {
      if(e is DioException) {
        if (e.response != null) {
          print("Status code: ${e.response?.statusCode}");
          print("Response data: ${e.response?.data}");
          setState(() {
            errorMessage = e.response?.data["message"];
          });
        } else {
          print("Error message: ${e.message}");
        }


      }
      else {
        print("Something went wrong");
      }
    }

    setState(() {
      isLoading = false;
    });

  }

  @override
  void dispose() {
    passwordController.dispose();
    emailController.dispose();
    nameController.dispose();
    confirmPasswordController.dispose();
    passwordFocusNode.dispose();
    emailFocusNode.dispose();
    nameFocusNode.dispose();
    confirmedPasswordFocusNode.dispose();
    super.dispose();
  }

  void _scrollToFocusedField(FocusNode focusNode) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final context = focusNode.context;
      if (context != null) {
        final RenderBox renderBox = context.findRenderObject() as RenderBox;
        final offset = renderBox.localToGlobal(Offset.zero);
        Future.delayed(const Duration(milliseconds: 350), () {
          var keyboardHeight = MediaQuery.of(context).viewInsets.bottom;
          final fieldBottomPosition = offset.dy + renderBox.size.height;
          final screenHeight = MediaQuery.of(context).size.height;
          if (fieldBottomPosition > screenHeight - keyboardHeight - 10) {
            Scrollable.ensureVisible(
              context,
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
            );
          }
        });
      }
    });
  }

  void _updateState(String newState) {
    FocusScope.of(context).unfocus();
    setState(() {
      currentState = newState;
      errorMessage = null;
      successMessage = null;
    });
    passwordController.clear();
    emailController.clear();
    nameController.clear();
    confirmPasswordController.clear();
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
                        const SizedBox(height: 15),
                        SignInWithGoogleButton(),
                        const HorizontalLine(),
                        SwitchLoginButton(
                            isLoginMode: currentState == 'Login' ? true : false,
                            onMessageChange: _updateState
                        ),
                        const SizedBox(height: 15),
                        if (currentState == "Register") ...[
                            Field(
                                fieldName: 'Email',
                                controller: emailController,
                                focusNode: emailFocusNode,
                                focusNodeNext: passwordFocusNode),
                            const SizedBox(height: 15),
                            PasswordField(
                                controller: passwordController,
                                focusNode: passwordFocusNode,
                                focusNodeNext: confirmedPasswordFocusNode,
                                isConfirmPassword: false,
                            ),
                            const SizedBox(height: 15),
                            PasswordField(
                            controller: confirmPasswordController,
                            focusNode: confirmedPasswordFocusNode,
                            focusNodeNext: nameFocusNode,
                            isConfirmPassword: true,
                          ),
                            const SizedBox(height: 15),
                            Field(
                              fieldName: 'Name',
                              controller: nameController,
                              focusNode: nameFocusNode,
                              focusNodeNext: null),
                            const SizedBox(height: 30),
                            if (errorMessage != null) ...[
                              const SizedBox(height: 20),
                              Text(errorMessage!, style: const TextStyle(color: Colors.red, fontSize: 15),),
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
                            RegisterButton(onPressed: register,),
                            const SizedBox(height: 15,),
                            RichText(
                              text: TextSpan(
                                children: <TextSpan>[
                                  const TextSpan(
                                    text: 'Your have already registered?  ',
                                    style: TextStyle(
                                      color: Colors.grey,
                                    )
                                  ),
                                  TextSpan(
                                      text: "Verify account",
                                      style: const TextStyle(
                                          color: Colors.indigo,
                                          fontWeight: FontWeight.bold,
                                          decoration: TextDecoration.underline
                                      ),
                                      recognizer: TapGestureRecognizer()..onTap = () async {
                                        String? email = await showDialog(context: context, builder: (context) {
                                          return InputEmailDialog();
                                        });
                                        if(email != null) {
                                          try {
                                            final response = await apiService.dio.post(
                                                ApiConstants.resendOtp,
                                                data: {
                                                  "email": email,
                                                }
                                            );
                                            await Navigator.push(
                                                context,
                                                PageRouteBuilder(pageBuilder: (context, animation, secondaryAnimation) => OtpPage(email: email,),));
                                          }
                                          catch (e) {
                                            if(e is DioException) {
                                              if (e.response != null) {
                                                print("Status code: ${e.response?.statusCode}");
                                                print("Response data: ${e.response?.data}");
                                                Fluttertoast.showToast(msg: 'Invalid email');
                                              } else {
                                                print("Error message: ${e.message}");
                                              }
                                            }
                                            else {
                                              print("Something went wrong");
                                            }
                                          }
                                        }
                                      }
                                  ),
                                ]
                              )
                            ),
                            const SizedBox(height: 15),
                          ],
                        if (currentState == "Login") ...[
                            Field(
                                fieldName: 'Email',
                                controller: emailController,
                                focusNode: emailFocusNode,
                                focusNodeNext: passwordFocusNode),
                            const SizedBox(height: 15),
                            PasswordField(
                                controller: passwordController,
                                focusNode: passwordFocusNode,
                                focusNodeNext: null,
                                isConfirmPassword: false,
                            ),
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
                            LoginButton(onPressed: login),
                            const SizedBox(height: 15),
                          ],
                        ]
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
