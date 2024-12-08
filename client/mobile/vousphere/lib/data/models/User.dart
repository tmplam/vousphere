class User {
  String id;
  String username;
  String name;
  String phone;
  String email;
  String status;
  String role;

  User(this.id, this.username, this.name, this.phone, this.email, this.status, this.role);

  // convert Json to User
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      json['id'],
      json['username'],
      json['name'],
      json['phone'],
      json['email'],
      json['status'],
      json['role']
    );
  }

  // convert User to Json
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'name': name,
      'phone': phone,
      'email': email,
      'status': status,
      'role': role
    };
  }
}