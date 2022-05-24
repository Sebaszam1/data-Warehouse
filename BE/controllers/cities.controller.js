const { QueryTypes } = require("sequelize")
const { db } = require("../db")
const jwt = require('jsonwebtoken')

const authorizationPassword = 'tmo$Q$bG5xR56'

class cities {
    constructor(){};

        async getCities(req, res) {
            const cities = await db.query(`SELECT * FROM cities`, { type: QueryTypes.SELECT })
            res.status(200).json(cities)
        }
      
      async validateCityNameQuery(req, res, next) {
        const city = req.body.city_name
        const cities = await db.query(`SELECT city_name FROM cities`, {
          type: QueryTypes.SELECT
        })
        const citiesArray = cities.map(city => city.city_name)
        if (req.body.city_name.length >= 1 && req.body.city_name.length <= 64) {
          if (citiesArray.every(name => name !== city)) next()
          else res.status(409).send("The city already exists").end()
        } else res.status(400).send("The city name length is wrong").end()
      }
      
      async createCity(country_id, city_name, req, res) {
        const inserted = await db.query(`
          INSERT INTO cities (country_id, city_name)
          VALUES (:country_id, :city_name)
          `, {
          replacements: { country_id, city_name },
          type: QueryTypes.INSERT
        })
        res.status(201).json(Object.assign({}, { city_id: inserted[0], country_id: country_id, city_name: city_name }))
      }
      
      async validateCityIdQuery(req, res, next) {
        const cityId = +req.params.cityId || req.body.city_id
        const cities = await db.query(`SELECT city_id FROM cities`, {
          type: QueryTypes.SELECT
        })
        const citiesArray = cities.map(id => id.city_id)
        if (citiesArray.includes(cityId)) next()
        else res.status(404).send("The city does not exist").end()
      }
      
      async getCity(cityId, req, res) {
        const city = await db.query(`
          SELECT * FROM cities WHERE city_id = ?
          `, {
          replacements: [cityId],
          type: QueryTypes.SELECT
        })
        res.status(200).json(city[0])
      }
      
      async validateCountryIdCityQuery(req, res, next) {
        if (req.body.country_id) {
          const countryId = req.body.country_id
          const countries = await db.query(`SELECT country_id FROM countries`, {
            type: QueryTypes.SELECT
          })
          const countriesArray = countries.map(id => id.country_id)
          if (countriesArray.includes(countryId)) next()
          else res.status(404).send("The country does not exist").end()
        } else next()
      }
      
      async validateCityNamePutQuery(req, res, next) {
        const city = req.body.city_name
        const cities = await db.query(`SELECT city_name FROM cities WHERE city_id != ${req.params.cityId}`, {
          type: QueryTypes.SELECT
        })
        const citiesArray = cities.map(city => city.city_name)
        if (req.body.city_name.length >= 1 && req.body.city_name.length <= 64) {
          if (citiesArray.every(name => name !== city)) next()
          else res.status(409).send("The city already exists").end()
        } else res.status(400).send("The city name length is wrong").end()
      }
      
      async modifyCity(cityId, req, res) {
        const city = await db.query(`SELECT * FROM cities WHERE city_id = ?`, {
          replacements: [cityId],
          type: QueryTypes.SELECT
        })
        const newCity = {
          city_id: cityId,
          country_id: req.body.country_id || city[0].country_id,
          city_name: req.body.city_name || city[0].city_name
        }
        const modified = await db.query(`
          UPDATE cities SET city_name = :city_name, country_id = :country_id 
          WHERE city_id = :city_id
          `, {
          replacements: newCity,
          type: QueryTypes.UPDATE
        })
        res.status(200).json(newCity)
      }
      
      async deleteCity(cityId, req, res) {
        const city = await db.query(`SELECT * FROM cities WHERE city_id = ?`, {
          replacements: [cityId],
          type: QueryTypes.SELECT
        })
      
        const citiesIdContacts = await db.query(`SELECT city_id FROM contacts`, {
          type: QueryTypes.SELECT
        })
        const idsContacts = citiesIdContacts.map(id => id.city_id)
      
        const citiesIdCompanies = await db.query(`SELECT city_id FROM companies`, {
          type: QueryTypes.SELECT
        })
        const idsCompanies = citiesIdCompanies.map(id => id.city_id)
      
        if (!idsContacts.includes(cityId) && !idsCompanies.includes(cityId)) {
          const deleted = await db.query(`DELETE FROM cities WHERE city_id = ?`, {
            replacements: [cityId],
            type: QueryTypes.DELETE
          })
          res.status(200).json(city)
        } else res.status(400).send("You cannot delete this city").end()
      }

}

module.exports = {
    cities
};