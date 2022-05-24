
const { Sequelize } = require("sequelize")

const db = new Sequelize("data_warehouse", "root", "", {
  host: "localhost", // "192.168.64.2"
  port: 3306,
  dialect: "mysql"
})

module.exports = { db }