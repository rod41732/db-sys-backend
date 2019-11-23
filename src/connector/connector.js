const mysql = require('mysql');

const config = require('../config');
let connection = mysql.createConnection(config.mysql);

// Models 
const User = require('../schema/user');
const Promotion = require('../schema/promotion');
const PromotionInBranch = require('../schema/promotion-in-branch');
const Branch = require('../schema/branch');
const Product = require('../schema/product');

class MySQLConnector {
  static async connect() {
    connection.query("SELECT 1 + 1 as solution", (err, results, fields) => {
      if (err) throw err;
      console.log('The solution is: ', results[0].solution);
    });
  }

  static async dropTables() {
    const tables = [User.TABLE_NAME, Promotion.TABLE_NAME, Branch.TABLE_NAME, PromotionInBranch.TABLE_NAME];
    for (let table of tables)
      await this.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    await this.commit();
  }

  static async createTables() {
    console.log(
      await this.query(`CREATE TABLE IF NOT EXISTS ${User.TABLE_NAME} (
        username VARCHAR(255) PRIMARY KEY,
        passwordHash VARCHAR(255),
        role VARCHAR(32) NOT NULL
      );`)
    );
    
    // console.log('create table', User.TABLE_NAME, results, fields);
    console.log(
      await this.query(`CREATE TABLE IF NOT EXISTS ${Promotion.TABLE_NAME} (
        PromotionID INT PRIMARY KEY AUTO_INCREMENT,
        PType VARCHAR(32),
        PStartDate DATE,
        PEndDate DATE,
        PDetail VARCHAR(64)
      );`)
    )

    console.log(
      await this.query(`CREATE TABLE IF NOT EXISTS ${Branch.TABLE_NAME} (
        BranchID INT PRIMARY KEY AUTO_INCREMENT,
        BranchName VARCHAR(64),
        Location VARCHAR(64),
        PhoneNo VARCHAR(10)
      );`)
    )

    console.log(
      await this.query(`CREATE TABLE IF NOT EXISTS ${PromotionInBranch.TABLE_NAME} (
        PromotionID INT,
        BranchID INT,
        CONSTRAINT pk_pair PRIMARY KEY (PromotionID, BranchID),
        FOREIGN KEY (PromotionID) REFERENCES ${Promotion.TABLE_NAME}(PromotionID),
        FOREIGN KEY (BranchID) REFERENCES ${Branch.TABLE_NAME}(BranchID)
      );`)
    )

    console.log(
      await this.query(`CREATE TABLE IF NOT EXISTS ${Product.TABLE_NAME} (
        ProductID INT PRIMARY KEY AUTO_INCREMENT,
        ProductName VARCHAR(64) NOT NULL,
        AmountInStock INT,
        DefaultPrice DECIMAL(2),
        ProductType VARCHAR(20),
        Image VARCHAR(400)
      )`)
    )
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
          resolve(results);
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
          resolve(results);
        }
      });
    })
  }
}

module.exports = MySQLConnector;