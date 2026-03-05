class UsuarioModel {
  final int id;           // ← int, no String
  final String username;
  final String email;
  final String firstName;
  final String lastName;
  final List<String> roles;
  final bool esAdmin;

  const UsuarioModel({
    required this.id,
    required this.username,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.roles,
    required this.esAdmin,
  });

  factory UsuarioModel.fromJson(Map<String, dynamic> j) => UsuarioModel(
        id:        j['id'] as int,
        username:  j['username'] ?? '',
        email:     j['email'] ?? '',
        firstName: j['first_name'] ?? '',
        lastName:  j['last_name'] ?? '',
        roles:     List<String>.from((j['roles'] ?? []).map((r) => r.toString())),
        esAdmin:   j['es_admin'] ?? false,
      );
}