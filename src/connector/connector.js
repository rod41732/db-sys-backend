const mysql = require('mysql');

const config = require('../config');
let connection = mysql.createConnection(config.mysql);

const User = require('../schema/user');

class MySQLConnector {
  static async connect() {
    connection.query("SELECT 1 + 1 as solution", (err, results, fields) => {
      if (err) throw err;
      console.log('The solution is: ', results[0].solution);
    });
  }

  static async creatTables() {
    let {results, fields } = await this.query(`CREATE TABLE IF NOT EXISTS ${User.TABLE_NAME} (
      username VARCHAR(255) PRIMARY KEY,
      passwordHash VARCHAR(255),
      role VARCHAR(32) NOT NULL
    );`)
    console.log('create table', User.TABLE_NAME, results, fields);
  }

  static async commit() {
    return new Promise((resolve, reject) => {
      connection.commit((err) => {
        if (err) {
          reject(err)
        } else {
          resolve(null);
        }
      });
    })
  }

  // cb is (error, results, fields)
  static async query(query) {
    return new Promise((resolve, reject) => {
      connection.query(query, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            results, fields,
          });
        }
      });
    })
  }

  // cb is (error, results, fields)
  static async queryPrep(prep, options) {
    return new Promise((resolve, reject) => {
      const query = mysql.format(prep, options);
      connection.query(query,(err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            results, fields,
          });
        }
      });
    })
  }
}

module.exports = MySQLConnector;