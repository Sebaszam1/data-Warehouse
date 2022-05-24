const jwt = require('jsonwebtoken')

const authorizationPassword = 'tmo$Q$bG5xR56'

const { validateLoginQuery, validateEmailQuery, validateUserIdQuery, validateEmailPutQuery,
  validateRegionNameQuery, validateRegionIdQuery, validateRegionNamePutQuery,
  validateCountryNameQuery, validateCountryIdQuery, validateCountryNamePutQuery,
  validateRegionIdCountryQuery, validateCityNameQuery, validateCityIdQuery,
  validateCountryIdCityQuery, validateCityNamePutQuery, validateCompanyNameQuery,
  validateCompanyIdQuery, validateCompanyNamePutQuery, validateCityIdPutQuery,
  validateEmailContactsQuery, validateChannelIdQuery, validateContactIdQuery,
  validateEmailContactsPutQuery, validateCompanyIdPutQuery, validateChannelIdPutQuery,
  validateChannelIdAddQuery, validateChannelIdDelQuery, validateChannelNameQuery,
  validateChannelIdExQuery, validateChannelNamePutQuery } = require('./queries.js')


class citiesFunction {
    constructor(){};

    async validateCityName(req, res, next) {
    await validateCityNameQuery(req, res, next)
    }
    
    async validateCityId(req, res, next) {
    await validateCityIdQuery(req, res, next)
    }
    
    async validateCountryIdCity(req, res, next) {
    await validateCountryIdCityQuery(req, res, next)
    }
    
    async validateCityNamePut(req, res, next) {
    await validateCityNamePutQuery(req, res, next)
    }

};

module.exports = {
    citiesFunction
};