const { QueryTypes } = require("sequelize")
const { db } = require("../db")
const jwt = require('jsonwebtoken')

const authorizationPassword = 'tmo$Q$bG5xR56'

class users {
    constructor(){};

     async selectUserLogin(username, password, req, res) {
        const user = await db.query(`SELECT * FROM users WHERE email = :username && password = :password`, {
          replacements: { username, password },
          type: QueryTypes.SELECT
        })
        const perfil = user[0].perfil
        const user_id = user[0].user_id
        res.status(200).json(Object.assign({}, { token: jwt.sign({ username, perfil, user_id }, authorizationPassword) }, { perf: perfil }))
      };
      
      async validateLoginQuery(req, res, next) {
        const { username, password } = req.body
        const user = await db.query(`SELECT * FROM users WHERE email = :username && password = :password`, {
          replacements: { username, password },
          type: QueryTypes.SELECT
        })
        if (user[0]) next()
        else res.status(400).send("Invalid credentials").end()
      };
      
      async getUsers(req, res) {
        const users = await db.query(`
          SELECT user_id, firstname, lastname, email, perfil FROM users
          `, {
          type: QueryTypes.SELECT
        })
        res.status(200).json(users)
      };
      
      async createUser(newUser, req, res) {
        const inserted = await db.query(`
          INSERT INTO users (firstname, lastname, email, perfil, password)
          VALUES (:firstname, :lastname, :email, :perfil, :password)
          `, {
          replacements: newUser,
          type: QueryTypes.INSERT
        })
        const { firstname, lastname, email } = newUser
        res.status(201).json(Object.assign({}, { user_id: inserted[0] },
          { firstname: firstname, lastname: lastname, email: email }, { perfil: "Básico" }))
        return console.log('ok');
      };
      
      async validateEmailQuery(req, res, next) {
        const email = req.body.email
        const emails = await db.query(`SELECT email FROM users`, {
          type: QueryTypes.SELECT
        })
        const emailsArray = emails.map(user => user.email)
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
          if (emailsArray.every(e => e != email)) next()
          else res.status(409).send("The email already exists").end()
        } else res.status(400).send("The email is wrong").end()
      }
      
      async validateUserIdQuery(req, res, next) {
        const userId = +req.params.userId
        const users = await db.query(`SELECT user_id FROM users`, {
          type: QueryTypes.SELECT
        })
        const usersArray = users.map(id => id.user_id)
        if (usersArray.includes(userId)) next()
        else res.status(404).send("The user does not exist").end()
      }
      
      async getUser(userId, req, res) {
        const user = await db.query(`
          SELECT user_id, firstname, lastname, email, perfil FROM users WHERE user_id = ?
          `, {
          replacements: [userId],
          type: QueryTypes.SELECT
        })
        res.status(200).json(user[0])
      }
      
      async validateEmailPutQuery(req, res, next) {
        const email = req.body.email
        const emails = await db.query(`SELECT email FROM users WHERE user_id != ${req.params.userId}`, {
          type: QueryTypes.SELECT
        })
        const emailsArray = emails.map(user => user.email)
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
          if (emailsArray.every(e => e != email)) next()
          else res.status(409).send("The email already exists").end()
        } else res.status(400).send("The email is wrong").end()
      }
      
      async modifyUser(userId, req, res) {
        const user = await db.query(`SELECT * FROM users WHERE user_id = ?`, {
          replacements: [userId],
          type: QueryTypes.SELECT
        })
        const password = req.body.password || user[0].password
        const newUser = {
          user_id: userId,
          firstname: req.body.firstname || user[0].firstname,
          lastname: req.body.lastname || user[0].lastname,
          email: req.body.email || user[0].email,
          perfil: req.body.perfil || user[0].perfil,
          password: req.body.password
      
        }
        const modified = await db.query(`
          UPDATE users SET firstname = :firstname, lastname = :lastname, email = :email, perfil = :perfil, 
          password = :password WHERE user_id = :user_id
          `, {
          replacements: Object.assign({}, newUser, { password: password }),
          type: QueryTypes.UPDATE
        })
        res.status(200).json({
          user_id: newUser.user_id, firstname: newUser.firstname, lastname: newUser.lastname,
          email: newUser.email, perfil: newUser.perfil
        })
      }
      
      async deleteUser(userId, req, res) {
        const user = await db.query(`SELECT * FROM users WHERE user_id = ?`, {
          replacements: [userId],
          type: QueryTypes.SELECT
        })
        const deleted = await db.query(`DELETE FROM users WHERE user_id = ?`, {
          replacements: [userId],
          type: QueryTypes.DELETE
        })
        const { user_id, firstname, lastname, email, perfil } = user[0]
        res.status(200).json({ user_id, firstname, lastname, email, perfil })
      }
};

module.exports = {
    users
};