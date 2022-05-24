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


class countriesFunction {
    constructor(){};

    async validateCountryName(req, res, next) {
    await validateCountryNameQuery(req, res, next)
    }
    
    async validateCountryId(req, res, next) {
    await validateCountryIdQuery(req, res, next)
    }
    
    async validateCountryNamePut(req, res, next) {
    await validateCountryNamePutQuery(req, res, next)
    }
    
    async validateRegionIdCountry(req, res, next) {
    await validateRegionIdCountryQuery(req, res, next)
    }

};

module.exports = {
    countriesFunction
};