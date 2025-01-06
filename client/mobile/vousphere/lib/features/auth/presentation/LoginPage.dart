import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/features/auth/presentation/components/AppLogo.dart';
import 'package:vousphere/features/auth/presentation/components/Field.dart';
import 'package:vousphere/features/auth/presentation/components/HorizontalLine.dart';
import 'package:vousphere/features/auth/presentation/components/LoginButton.dart';
import 'package:vousphere/features/auth/presentation/components/PasswordField.dart';
import 'package:vousphere/features/auth/presentation/components/RegisterButton.dart';
import 'package:vousphere/features/auth/presentation/components/SignInWithGoogleButton.dart';
import 'package:vousphere/features/auth/presentation/components/SwitchLoginButton.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final ApiService apiService = ApiService();
  late String currentState;
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();

  final FocusNode usernameFocusNode = FocusNode();
  final FocusNode passwordFocusNode = FocusNode();
  final FocusNode emailFocusNode = FocusNode();
  final FocusNode confirmPasswordFocusNode = FocusNode();
  String? errorMessage;
  String? successMessage;
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    currentState = 'Login';
    usernameFocusNode.addListener(() {
      if (usernameFocusNode.hasFocus) {
        _scrollToFocusedField(usernameFocusNode);
      }
    });
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
    confirmPasswordFocusNode.addListener(() {
      if (confirmPasswordFocusNode.hasFocus) {
        _scrollToFocusedField(confirmPasswordFocusNode);
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

  @override
  void dispose() {
    usernameController.dispose();
    passwordController.dispose();
    emailController.dispose();
    confirmPasswordController.dispose();
    usernameFocusNode.dispose();
    passwordFocusNode.dispose();
    emailFocusNode.dispose();
    confirmPasswordFocusNode.dispose();
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
    usernameController.clear();
    passwordController.clear();
    emailController.clear();
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
                                fieldName: 'Username',
                                controller: usernameController,
                                focusNode: usernameFocusNode,
                                focusNodeNext: currentState == "Register" ? emailFocusNode : passwordFocusNode),
                            const SizedBox(height: 15),
                            Field(
                                fieldName: 'Email',
                                controller: emailController,
                                focusNode: emailFocusNode,
                                focusNodeNext: passwordFocusNode),
                            const SizedBox(height: 15),
                            PasswordField(
                                controller: passwordController,
                                focusNode: passwordFocusNode,
                                focusNodeNext: confirmPasswordFocusNode,
                                isConfirmPassword: false,
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
                          ] else if (currentState == "Register") ...[
                            PasswordField(
                              controller: confirmPasswordController,
                              focusNode: confirmPasswordFocusNode,
                              focusNodeNext: null,
                              isConfirmPassword: true,
                            ),
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
                            ],
                            if (successMessage != null) ...[
                              const SizedBox(height: 20),
                              Text(
                                successMessage!,
                                style: const TextStyle(color: Colors.green, fontSize: 15),
                              ),
                            ],
                            const SizedBox(height: 15),
                            RegisterButton(onPressed: () {},),
                          ]
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
