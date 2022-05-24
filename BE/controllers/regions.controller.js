const { QueryTypes } = require("sequelize")
const { db } = require("../db")


class region {
    constructor(){};

    async getRegions(req, res) {
        const regions = await db.query(`SELECT * FROM regions`, { type: QueryTypes.SELECT })
        res.status(200).json(regions)
      }
      
      async validateRegionNameQuery(req, res, next) {
        const region = req.body.region_name
        const regions = await db.query(`SELECT region_name FROM regions`, {
          type: QueryTypes.SELECT
        })
        const regionsArray = regions.map(region => region.region_name)
        if (req.body.region_name.length >= 1 && req.body.region_name.length <= 64) {
          if (regionsArray.every(name => name !== region)) next()
          else res.status(409).send("The region already exists").end()
        } else res.status(400).send("The region name length is wrong").end()
      }
      
      async createRegion(newRegion, req, res) {
        const inserted = await db.query(`
          INSERT INTO regions (region_name)
          VALUES (:newRegion)
          `, {
          replacements: { newRegion },
          type: QueryTypes.INSERT
        })
        res.status(201).json(Object.assign({}, { region_id: inserted[0] }, { newRegion }))
      }
      
      async validateRegionIdQuery(req, res, next) {
        const regionId = +req.params.regionId || +req.body.region_id
        const regions = await db.query(`SELECT region_id FROM regions`, {
          type: QueryTypes.SELECT
        })
        const regionsArray = regions.map(id => id.region_id)
        if (regionsArray.includes(regionId)) next()
        else res.status(404).send("The region does not exist").end()
      }
      
      async getRegion(regionId, req, res) {
        const region = await db.query(`
          SELECT * FROM regions WHERE region_id = ?
          `, {
          replacements: [regionId],
          type: QueryTypes.SELECT
        })
        res.status(200).json(region[0])
      }
      
      async validateRegionNamePutQuery(req, res, next) {
        const region = req.body.region_name
        const regions = await db.query(`SELECT region_name FROM regions WHERE region_id != ${req.params.regionId}`, {
          type: QueryTypes.SELECT
        })
        const regionsArray = regions.map(region => region.region_name)
        if (req.body.region_name.length >= 1 && req.body.region_name.length <= 64) {
          if (regionsArray.every(name => name !== region)) next()
          else res.status(409).send("The region already exists").end()
        } else res.status(400).send("The region name length is wrong").end()
      }
      
      async modifyRegion(regionId, req, res) {
        const region = await db.query(`SELECT * FROM regions WHERE region_id = ?`, {
          replacements: [regionId],
          type: QueryTypes.SELECT
        })
        const newRegion = {
          regionId: regionId,
          regionName: req.body.region_name || region[0].region_name
        }
        const modified = await db.query(`
          UPDATE regions SET region_name = :regionName WHERE region_id = :regionId
          `, {
          replacements: newRegion,
          type: QueryTypes.UPDATE
        })
        res.status(200).json(newRegion)
      }
      
      async deleteRegion(regionId, req, res) {
        const region = await db.query(`SELECT * FROM regions WHERE region_id = ?`, {
          replacements: [regionId],
          type: QueryTypes.SELECT
        })
      
        const regionsId = await db.query(`SELECT region_id FROM countries`, {
          type: QueryTypes.SELECT
        })
        const ids = regionsId.map(id => id.region_id)
        if (!ids.includes(regionId)) {
          const deleted = await db.query(`DELETE FROM regions WHERE region_id = ?`, {
            replacements: [regionId],
            type: QueryTypes.DELETE
          })
          res.status(200).json(region)
        } else res.status(400).send("You cannot delete this region").end()
      }
      
      async getCountriesRegion(regionId, req, res) {
        const countries = await db.query(`
          SELECT * FROM countries WHERE region_id = ?
          `, {
          replacements: [regionId],
          type: QueryTypes.SELECT
        })
        res.status(200).json(countries)
      }
      
      async getCitiesRegion(regionId, req, res) {
        const cities = await db.query(`
          SELECT city_id, co.country_id, re.region_id, city_name 
          FROM cities ci
          JOIN countries co ON co.country_id = ci.country_id 
          JOIN regions re ON re.region_id = co.region_id 
          WHERE re.region_id = ?
          `, {
          replacements: [regionId],
          type: QueryTypes.SELECT
        })
        res.status(200).json(cities)
      }
      
      async getRegionsCountriesCities(req, res) {
        const regions = await db.query(`SELECT * FROM regions`, { type: QueryTypes.SELECT })
        const countries = await db.query(`SELECT * FROM countries`, { type: QueryTypes.SELECT })
        const cities = await db.query(`SELECT * FROM cities`, { type: QueryTypes.SELECT })
      
        const countriesAndCities = countries.map(country =>
          Object.assign({}, country, {
            cities: cities.filter(city =>
              city.country_id === country.country_id)
          }
          ))
      
        const regionsCountriesAndCities = regions.map(region =>
          Object.assign({}, region, {
            countries: countriesAndCities.filter(country =>
              country.region_id === region.region_id)
          }
          ))
        res.status(200).json(regionsCountriesAndCities)
      }
}

module.exports = {
    region
};