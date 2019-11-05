const connector = require('../connector/connector');
const User = require('../schema/user');

class UserRepository {
  static async getUserByName(name) {
    return await connector.queryPrep(`SELECT * from ${User.TABLE_NAME} where username = ?`, [name]);
  }

  static async createUser(username, password, role) {
    const resp = connector.queryPrep(`
        INSERT INTO ${User.TABLE_NAME} (username, passwordHash, role) 
        VALUES (?, ?, ?)
    `, [username, password, role]);
    await connector.commit();
    return resp;
  }
}

module.exports = UserRepository