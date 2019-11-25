const mysql = require('mysql');

const config = require('../config');
let connection = mysql.createConnection(config.mysql);

// Models 
const Employee = require('../schema/employee');
const Promotion = require('../schema/promotion');
const PromotionInBranch = require('../schema/promotion-in-branch');
const Branch = require('../schema/branch');
const Product = require('../schema/product');
const Transaction = require('../schema/transaction');
const ProductLine = require('../schema/product-line');

class MySQLConnector {
  static async connect() {
    connection.query("SELECT 1 + 1 as solution", (err, results, fields) => {
      if (err) throw err;
      console.log('The solution is: ', results[0].solution);
    });
  }

  static async dropTables() {
    const tables = [Employee.TABLE_NAME, Promotion.TABLE_NAME, Branch.TABLE_NAME, PromotionInBranch.TABLE_NAME];
    for (let table of tables)
      await this.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    await this.commit();
  }

  static async createTables() {
    console.log(
      await this.query(`CREATE TABLE IF NOT EXISTS ${Employee.TABLE_NAME} (
        EmpID INT PRIMARY KEY AUTO_INCREMENT,
        Username VARCHAR(40),
        Password VARCHAR(400),
        BranchID INT,
        FirstName VARCHAR(40),
        LastName VARCHAR(40),
        Age INT,
        BirthDate DATE,
        StreetNo VARCHAR(60),
        SubDistrict VARCHAR(25),
        District VARCHAR(25),
        Province VARCHAR(25),
        ZipCode INT(5),
        HasLeft BOOL,
        Email VARCHAR(60),
        PhoneNo VARCHAR(10),
        IsFullTime BOOL NOT NULL,
        IsPartTime BOOL NOT NULL,
        IsManager BOOL NOT NULL,
        FOREIGN KEY (BranchID) REFERENCES ${Branch.TABLE_NAME}(BranchID)
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
        ProdID INT PRIMARY KEY AUTO_INCREMENT,
        ProdName VARCHAR(64) NOT NULL,
        AmountInStock INT,
        DefaultPrice DECIMAL(10,2),
        ProdType VARCHAR(20),
        Image VARCHAR(400)
      )`)
    )

    console.log(
      await this.query(`CREATE TABLE IF NOT EXISTS ${Transaction.TABLE_NAME} (
        TransID INT PRIMARY KEY AUTO_INCREMENT,
        Amount INT NOT NULL,
        TransDate DATE NOT NULL,
        BranchID INT,
        CardID INT,
        FOREIGN KEY (BranchID) REFERENCES Branches(BranchID)
      )`)
    )

    console.log(
      await this.query(`CREATE TABLE IF NOT EXISTS ${ProductLine.TABLE_NAME} (
        TransID INT,
        ProdID INT,
        NumBuy INT,
        Price DECIMAL(10,2),
        CONSTRAINT PK_ProdLine PRIMARY KEY (TransID, ProdID),
        FOREIGN KEY (TransID) REFERENCES Transactions(TransID),
        FOREIGN KEY (ProdID) REFERENCES Product(ProdID)
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
      console.log(query);
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