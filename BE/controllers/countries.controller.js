const { QueryTypes } = require("sequelize")
const { db } = require("../db")
const jwt = require('jsonwebtoken')

const authorizationPassword = 'tmo$Q$bG5xR56'

class countries {
    constructor(){};

        async getCountries(req, res) {
            const countries = await db.query(`SELECT * FROM countries`, { type: QueryTypes.SELECT })
            res.status(200).json(countries)
        }
      
      async validateCountryNameQuery(req, res, next) {
        const country = req.body.country_name
        const countries = await db.query(`SELECT country_name FROM countries`, {
          type: QueryTypes.SELECT
        })
        const countriesArray = countries.map(country => country.country_name)
        if (req.body.country_name.length >= 1 && req.body.country_name.length <= 64) {
          if (countriesArray.every(name => name !== country)) next()
          else res.status(409).send("The country already exists").end()
        } else res.status(400).send("The country name length is wrong").end()
      }
      
      async createCountry(country_name, region_id, req, res) {
        const inserted = await db.query(`
          INSERT INTO countries (region_id, country_name)
          VALUES (:region_id, :country_name)
          `, {
          replacements: { country_name, region_id },
          type: QueryTypes.INSERT
        })
        res.status(201).json(Object.assign({}, { country_id: inserted[0], region_id: region_id, country_name: country_name }))
      }
      
      async validateCountryIdQuery(req, res, next) {
        const countryId = +req.params.countryId || req.body.country_id
        const countries = await db.query(`SELECT country_id FROM countries`, {
          type: QueryTypes.SELECT
        })
        const countriesArray = countries.map(id => id.country_id)
        if (countriesArray.includes(countryId)) next()
        else res.status(404).send("The country does not exist").end()
      }
      
      async getCountry(countryId, req, res) {
        const country = await db.query(`
          SELECT * FROM countries WHERE country_id = ?
          `, {
          replacements: [countryId],
          type: QueryTypes.SELECT
        })
        res.status(200).json(country[0])
      }
      
      async validateCountryNamePutQuery(req, res, next) {
        const country = req.body.country_name
        const countries = await db.query(`SELECT country_name FROM countries WHERE country_id != ${req.params.countryId}`, {
          type: QueryTypes.SELECT
        })
        const countriesArray = countries.map(country => country.country_name)
        if (req.body.country_name.length >= 1 && req.body.country_name.length <= 64) {
          if (countriesArray.every(name => name !== country)) next()
          else res.status(409).send("The country already exists").end()
        } else res.status(400).send("The country name length is wrong").end()
      }
      
      async modifyCountry(countryId, req, res) {
        const country = await db.query(`SELECT * FROM countries WHERE country_id = ?`, {
          replacements: [countryId],
          type: QueryTypes.SELECT
        })
        const newCountry = {
          country_id: countryId,
          region_id: req.body.region_id || country[0].region_id,
          country_name: req.body.country_name || country[0].country_name
        }
        const modified = await db.query(`
          UPDATE countries SET country_name = :country_name, region_id = :region_id 
          WHERE country_id = :country_id
          `, {
          replacements: newCountry,
          type: QueryTypes.UPDATE
        })
        res.status(200).json(newCountry)
      }
      
      async validateRegionIdCountryQuery(req, res, next) {
        if (req.body.region_id) {
          const regionId = req.body.region_id
          const regions = await db.query(`SELECT region_id FROM regions`, {
            type: QueryTypes.SELECT
          })
          const regionsArray = regions.map(id => id.region_id)
          if (regionsArray.includes(regionId)) next()
          else res.status(404).send("The region does not exist").end()
        } else next()
      }
      
      async deleteCountry(countryId, req, res) {
        const country = await db.query(`SELECT * FROM countries WHERE country_id = ?`, {
          replacements: [countryId],
          type: QueryTypes.SELECT
        })
      
        const countriesId = await db.query(`SELECT country_id FROM cities`, {
          type: QueryTypes.SELECT
        })
        const ids = countriesId.map(id => id.country_id)
      
        if (!ids.includes(countryId)) {
          const deleted = await db.query(`DELETE FROM countries WHERE country_id = ?`, {
            replacements: [countryId],
            type: QueryTypes.DELETE
          })
          res.status(200).json(country[0])
        } else res.status(400).send("You cannot delete this country").end()
      }
      
      async getCitiesCountry(countryId, req, res) {
        const cities = await db.query(`
          SELECT * FROM cities WHERE country_id = ?
          `, {
          replacements: [countryId],
          type: QueryTypes.SELECT
        })
        res.status(200).json(cities)
      }

}

module.exports = {
    countries
};