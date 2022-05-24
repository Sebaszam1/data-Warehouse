const jwt = require('jsonwebtoken')

const authorizationPassword = 'tmo$Q$bG5xR56'

const {
    validateLoginQuery,
    validateEmailQuery,
    validateUserIdQuery,
    validateEmailPutQuery,
    validateRegionNameQuery,
    validateRegionIdQuery,
    validateRegionNamePutQuery,
    validateCountryNameQuery,
    validateCountryIdQuery,
    validateCountryNamePutQuery,
    validateRegionIdCountryQuery,
    validateCityNameQuery,
    validateCityIdQuery,
    validateCountryIdCityQuery,
    validateCityNamePutQuery,
    validateCompanyNameQuery,
    validateCompanyIdQuery,
    validateCompanyNamePutQuery,
    validateCityIdPutQuery,
    validateEmailContactsQuery,
    validateChannelIdQuery,
    validateContactIdQuery,
    validateEmailContactsPutQuery,
    validateCompanyIdPutQuery,
    validateChannelIdPutQuery,
    validateChannelIdAddQuery,
    validateChannelIdDelQuery,
    validateChannelNameQuery,
    validateChannelIdExQuery,
    validateChannelNamePutQuery
} = require('./queries.js')


class usersFunction {
    constructor() {};

    async validateLogin(req, res, next) {
        await validateLoginQuery(req, res, next)
    }

    verifyToken(req, res, next) {
        const fullToken = req.headers.authorization || "0.0.0"
        const token = fullToken.split(' ')[1]
        try {
            jwt.verify(token, authorizationPassword)
            next()
        } catch (error) {
            res.status(401).send(error)
        }
    }

    filterAdmin(req, res, next) {
        const token = req.headers.authorization.split(' ')[1]
        const user = jwt.verify(token, authorizationPassword)
        if (user.perfil === "Admin") {
            next()
        } else {
            res.status(403).send("You do not have administrator permissions").end()
        }
    }

    validateFirstname(req, res, next) {
        const firstname = req.body.firstname
        if (firstname.length >= 1 && firstname.length <= 64) next()
        else res.status(400).send("The firstname length is wrong").end()
    }

    validateLastname(req, res, next) {
        const lastname = req.body.lastname
        if (lastname.length >= 1 && lastname.length <= 64) next()
        else res.status(400).send("The lastname length is wrong").end()
    }

    async validateEmail(req, res, next) {
        await validateEmailQuery(req, res, next)
    }

    validatePassword(req, res, next) {
        const password = req.body.password
        if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*?&#.$($)$-$_]{4,15}$/.test(password)) next()
        else res.status(400).send("The password is wrong").end()
    }
    // Minimum 4 characters
    // Maximum 15 characters
    // At least 1 character
    // At least 1 digit
    // No blank spaces

    validateUser(req, res, next) {
        const userId = +req.params.userId
        const token = jwt.verify(req.headers.authorization.split(' ')[1], authorizationPassword)
        if (token.user_id === userId || token.perfil === "Admin") next()
        else res.status(401).send("You do not have enough permissions").end()
    }

    async validateUserId(req, res, next) {
        await validateUserIdQuery(req, res, next)
    }

    validateFirstnamePut(req, res, next) {
        if (req.body.firstname.length >= 1 && req.body.firstname.length <= 64) next()
        else res.status(400).send("The firstname length is wrong").end()
    }

    validateLastnamePut(req, res, next) {
        if (req.body.lastname.length >= 1 && req.body.lastname.length <= 64) next()
        else res.status(400).send("The lastname length is wrong").end()
    }

    async validateEmailPut(req, res, next) {
        await validateEmailPutQuery(req, res, next)
    }

    validatePerfil(req, res, next) {
        if (req.body.perfil === 'Admin' || req.body.perfil === 'Básico') next()
        else res.status(400).send("The perfil is wrong").end()
    }

    validatePasswordPut(req, res, next) {
        if (req.body.password) {
            if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*?&#.$($)$-$_]{4,15}$/.test(req.body.password)) next()
            else res.status(400).send("The password is wrong").end()
        } else next()
    }
}

module.exports = {
    usersFunction
};