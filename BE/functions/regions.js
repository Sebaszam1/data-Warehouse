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


class regionsFunction {
    constructor(){};

    async validateRegionName(req, res, next) {
    await validateRegionNameQuery(req, res, next)
    }
    
    async validateRegionId(req, res, next) {
    await validateRegionIdQuery(req, res, next)
    }
    
    async validateRegionNamePut(req, res, next) {
    await validateRegionNamePutQuery(req, res, next)
    }
};

module.exports = {
    regionsFunction
};