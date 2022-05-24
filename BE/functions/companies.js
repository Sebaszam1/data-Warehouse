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


class companiesFunction {
    constructor() {};

    async validateCompanyName(req, res, next) {
        await validateCompanyNameQuery(req, res, next)
    }

    validateAddress(req, res, next) {
        const address = req.body.address
        if (address.length >= 1 && address.length <= 64) next()
        else res.status(400).send("The address is wrong").end()
    }

    async validateEmailCompanies(req, res, next) {
        const email = req.body.email
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) next()
        else res.status(400).send("The email is wrong").end()
    }

    validateTelephone(req, res, next) {
        const telephone = req.body.telephone
        if (telephone.length >= 1 && telephone.length <= 64) next()
        else res.status(400).send("The telephone is wrong").end()
    }

    async validateCompanyId(req, res, next) {
        await validateCompanyIdQuery(req, res, next)
    }

    async validateCompanyNamePut(req, res, next) {
        await validateCompanyNamePutQuery(req, res, next)
    }

    async validateCityIdPut(req, res, next) {
        await validateCityIdPutQuery(req, res, next)
    }

    async validateAddressPut(req, res, next) {
        const address = req.body.address
        if (address.length >= 1 && address.length <= 64) next()
        else res.status(400).send("The address is wrong").end()
    }

};

module.exports = {
    companiesFunction
};