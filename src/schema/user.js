class User {
  constructor(username, password, role) {
    this.username = username;
    this.password = password;
    this.role = role;
  }

  isAdmin() {
    return this.role === "admin";
  }

  valid() {
    return this.username && this.password; // both not empty
  }
}
User.TABLE_NAME = 'Users';

module.exports = User;