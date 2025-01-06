import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http_parser/http_parser.dart';
import 'package:provider/provider.dart';
import 'package:vousphere/core/constants/ApiConstants.dart';
import 'package:vousphere/data/api/ApiService.dart';
import 'package:vousphere/data/models/User.dart';
import 'package:vousphere/features/profile-edit/presentation/components/CustomTextField.dart';
import 'package:vousphere/features/profile-edit/presentation/components/DateInputField.dart';
import 'package:vousphere/shared/providers/UserProvider.dart';

class ProfileEditPage extends StatefulWidget {
  const ProfileEditPage({super.key});

  @override
  State<ProfileEditPage> createState() => _ProfileEditPageState();
}

class _ProfileEditPageState extends State<ProfileEditPage> {

  final TextEditingController nameController = TextEditingController();
  final TextEditingController phoneNumberController = TextEditingController();
  final TextEditingController dobController = TextEditingController();

  final FocusNode nameFocusNode = FocusNode();
  final FocusNode phoneNumberFocusNode = FocusNode();

  String selectedGender = '';
  bool isLoading = false;
  bool isUpdateAvatar = false;
  final ApiService apiService = ApiService();

  Future<void> updateProfile() async {
    nameFocusNode.unfocus();
    phoneNumberFocusNode.unfocus();

    if(isLoading) {
      return;
    }

    String name = nameController.text;
    String phoneNumber = phoneNumberController.text;
    String dateOfBirth = dobController.text;

    if(name.trim().isEmpty) {
      Fluttertoast.showToast(msg: 'Name is required');
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final response = await apiService.dio.put(
          ApiConstants.updateProfile,
          data: {
            "name": name,
            "phoneNumber": phoneNumber,
            "dateOfBirth": dateOfBirth,
            "gender": selectedGender,
          },
          options: Options(
              extra: {
                "requireToken": true,
              }
          )
      );

        Fluttertoast.showToast(msg: 'Update profile successfully');
        UserProvider userProvider = Provider.of<UserProvider>(context, listen: false);
        await userProvider.getUser();

    }
    catch (e) {
      if(e is DioException) {
        if (e.response != null) {
          print("Status code: ${e.response?.statusCode}");
          print("Response data: ${e.response?.data}");
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

  Future<void> updateAvatar() async {
      if(isUpdateAvatar) {
        return;
      }
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.image,
      );

      if (result != null) {

        setState(() {
          isUpdateAvatar = true;
        });

        PlatformFile file = result.files.single;
        try {
          MultipartFile multipartFile;
          if (!kIsWeb) {
            // handle in mobile or desktop
            if (file.path == null) throw Exception('File path is null');
            multipartFile = await MultipartFile.fromFile(
                file.path!,
                filename: file.name,
                contentType: MediaType('image', file.extension!)
            );
          } else {
            // handle in web
            multipartFile = MultipartFile.fromBytes(
                file.bytes!,
                filename: file.name,
                contentType: MediaType('image', file.extension!)
            );
          }

          // create form data
          final formData = FormData.fromMap({
            'file': multipartFile,
          });

          // call api
          final response = await apiService.dio.post(
              ApiConstants.uploadImage,
              data: formData,
              options: Options(
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  }
              )
          );

          if(response.statusCode == 200) {
            // upload success
            String imageId = response.data['data']['imageId'];
            final updateAvatarResponse = await apiService.dio.patch(
              ApiConstants.updateAvatar,
              data: {
                "imageId": imageId,
              },
              options: Options(
                  extra: {
                    "requireToken": true,
                  }
              ),
            );

            // update avatar success
            Fluttertoast.showToast(msg: 'Update avatar successfully');
            UserProvider userProvider = Provider.of<UserProvider>(context, listen: false);
            await userProvider.getUser();
          }
        }
        catch(e) {
          if(e is DioException) {
            if (e.response != null) {
              print("Status code: ${e.response?.statusCode}");
              print("Response data: ${e.response?.data}");
            } else {
              print("Error message: ${e.message}");
            }
          }
          else {
            print("Something went wrong");
          }
        }

        setState(() {
          isUpdateAvatar = false;
        });
      }

  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    UserProvider userProvider = Provider.of<UserProvider>(context, listen: false);
    User user = userProvider.user;
    selectedGender = user.player?['gender'];
    nameController.text = user.name;
    phoneNumberController.text = user.phoneNumber;
    dobController.text = user.player?['dateOfBirth'] ?? 'yyyy-MM-dd';
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    nameController.dispose();
    phoneNumberController.dispose();
    dobController.dispose();
    nameFocusNode.dispose();
    phoneNumberFocusNode.dispose();
  }

  @override
  Widget build(BuildContext context) {

    UserProvider userProvider = Provider.of<UserProvider>(context, listen: true);
    User user = userProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: Text('Profile', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.blue.shade700),),
      ),
      body: Container(
        height: MediaQuery.of(context).size.height,
        color: Colors.white,
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 20),
            Row(
              children: [
                ClipOval(
                  child: Image.network(
                    user.image ?? 'https://static.vecteezy.com/system/resources/thumbnails/022/385/025/small_2x/a-cute-surprised-black-haired-anime-girl-under-the-blooming-sakura-ai-generated-photo.jpg',
                    width: 100,
                    height: 100,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(width: 20,),
                FilledButton(
                    onPressed: updateAvatar,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        isUpdateAvatar ? const SizedBox(
                          width: 10,
                          height: 10,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white,),
                        ) : const SizedBox.shrink(),
                        const SizedBox(width: 4,),
                        const Icon(Icons.upload),
                        const SizedBox(width: 4,),
                        const Text('Upload Image'),
                      ],
                    )
                )
              ],
            ),
            const SizedBox(height: 10),
            Container(
              margin: const EdgeInsets.fromLTRB(0, 15, 0, 6),
              child: const Row(
                children: [
                  Icon(Icons.person),
                  SizedBox(width: 4,),
                  Text('Name '),
                  Text('*', style: TextStyle(color: Colors.red),)
                ],
              ),
            ),
            // TextField for Name
            CustomTextField(controller: nameController, hinText: 'Full name', focusNode: nameFocusNode,),
            Container(
              margin: const EdgeInsets.fromLTRB(0, 15, 0, 6),
              child: const Row(
                children: [
                  Icon(Icons.phone),
                  SizedBox(width: 4,),
                  Text('Phone '),
                ],
              ),
            ),
            // TextField for Name
            CustomTextField(controller: phoneNumberController, hinText: '+84', focusNode: phoneNumberFocusNode,),
            Container(
              margin: const EdgeInsets.fromLTRB(0, 15, 0, 6),
              child: const Row(
                children: [
                  Icon(Icons.date_range),
                  SizedBox(width: 4,),
                  Text('Date of birth '),
                ],
              ),
            ),
            // TextField for Name
            DateInput(nameFocusNode, phoneNumberFocusNode, dobController),
            Container(
              margin: const EdgeInsets.fromLTRB(0, 15, 0, 6),
              child: const Row(
                children: [
                  Icon(Icons.male),
                  Icon(Icons.female),
                  SizedBox(width: 4,),
                  Text('Gender '),
                ],
              ),
            ),
            // TextField for Name
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Radio<String>(
                      value: "Male",
                      groupValue: selectedGender,
                      onChanged: (String? value) {
                        setState(() {
                          selectedGender = value!;
                        });
                      },
                    ),
                    const Text("Male"),
                  ],
                ),
                Row(
                  children: [
                    Radio<String>(
                      value: "Female",
                      groupValue: selectedGender,
                      onChanged: (String? value) {
                        setState(() {
                          selectedGender = value!;
                        });
                      },
                    ),
                    const Text("Female"),
                  ],
                ),
                Row(
                  children: [
                    Radio<String>(
                      value: "Unknown",
                      groupValue: selectedGender,
                      onChanged: (String? value) {
                        setState(() {
                          selectedGender = value!;
                        });
                      },
                    ),
                    const Text("Unknown"),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20,),
            FilledButton(
                onPressed: updateProfile,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    isLoading ? const SizedBox(
                      width: 10,
                      height: 10,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white,),
                    ) : const SizedBox.shrink(),
                    const SizedBox(width: 4,),
                    const Text('Save'),
                  ],
                )
            ),
          ],
        ),
      ),
    );
  }
}
