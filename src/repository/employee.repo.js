const bcrypt = require('bcrypt');
const connector = require('../connector/connector');
const Employee = require('../schema/employee');

const TempTable = "Temp_TB";

class EmployeeRepository {
    static async getEmployeeTableWithoutPassword() {
        await connector.query(`CREATE TABLE ${TempTable} SELECT * FROM ${Employee.TABLE_NAME};
        ALTER TABLE ${TempTable} DROP Password;`)
    }

    static async clearTemporaryEmployeeTable() {
        await connector.query(`DROP TABLE IF EXISTS ${TempTable};`)
    }

    static async getAllEmployees() {
        await this.getEmployeeTableWithoutPassword();
        employees = await connector.query(`SELECT * FROM ${TempTable};`);
        await this.clearTemporaryEmployeeTable();
        return employees;
    }

    static async getEmployee(EmpID) {
        await this.getEmployeeTableWithoutPassword();
        employee = await connector.query(`SELECT * FROM ${TempTable} WHERE EmpID = ${EmpID};`);
        await this.clearTemporaryEmployeeTable();
        return employees;
    }

    static async getEmployeesByUsername(username) {
        const result = await connector.queryPrep(`SELECT * FROM ${Employee.TABLE_NAME}
        WHERE ?? = ?`, ['Username', username]);
        return result;
    }

    static async newEmployee(EmpData) {
        EmpData.Password = await bcrypt.hash(EmpData.Password, 10);
        const result = await connector.queryPrep(`INSERT INTO ${Employee.TABLE_NAME} SET ?`, EmpData);
        await connector.commit();
        return result;
    }

    static async deleteEmployee(EmpID) {
        const result = await connector.queryPrep(`DELETE FROM ${Employee.TABLE_NAME} WHERE EmpID = ?`,
        [EmpID]);
        await connector.commit();
        return result;
    }
}

module.exports = EmployeeRepository;