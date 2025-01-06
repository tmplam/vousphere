class User {
  String id;
  String name;
  String email;
  String phoneNumber;
  String status;
  String role;
  String? imageId;
  String? image;
  Map<String, dynamic>? player;

  User(this.id, this.name, this.email, this.phoneNumber, this.status, this.role, this.imageId, this.image, this.player);

  // convert Json to User
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      json['id'],
      json['name'],
      json['email'],
      json['phoneNumber'],
      json['status'],
      json['role'],
      json['imageId'],
      json['image'],
      json['player'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phoneNumber': phoneNumber,
      'status': status,
      'role': role,
      'imageId': imageId,
      'image': image,
      'player': player,
    };
  }

  // Convert User to String
  @override
  String toString() {
    return toJson().toString();
    // return '''
    // User {
    //   id: $id,
    //   name: $name,
    //   email: $email,
    //   phoneNumber: $phoneNumber,
    //   status: $status,
    //   role: $role,
    //   imageId: $imageId,
    //   image: $image,
    //   player: $player
    // }''';
  }

}