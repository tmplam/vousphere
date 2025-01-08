class ApiConstants {
  // static const String baseUrl = "http://localhost:6000";
  static const String baseUrl = "http://192.168.1.102:6000";
  static const String login = "/user-service/api/users/sign-in";
  static const String register = "/user-service/api/users/sign-up";
  static const String getProfile = "/user-service/api/users/profile";
  static const String updateProfile = "/user-service/api/users/player-info";
  static const String uploadImage = "/media-service/api/medias/upload-image";
  static const String updateAvatar = "/user-service/api/users/image";
  static const String verifyEmail = "/user-service/api/users/verify-email";
  static const String resendOtp = "/user-service/api/users/resend-otp";
}
