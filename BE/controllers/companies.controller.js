const { QueryTypes } = require("sequelize")
const { db } = require("../db")
const jwt = require('jsonwebtoken')

const authorizationPassword = 'tmo$Q$bG5xR56'

class companies {
    constructor(){};

    async getCompanies(req, res) {
        const companies = await db.query(`
          SELECT company_id, company_name, c.email, c.city_id, city_name, ci.country_id, country_name, 
          co.region_id, region_name, address, telephone
          FROM companies c
          JOIN cities ci ON ci.city_id = c.city_id
          JOIN countries co ON co.country_id = ci.country_id
          JOIN regions re ON re.region_id = co.region_id
          `, { type: QueryTypes.SELECT })
        res.status(200).json(companies)
      }
      
      async validateCompanyNameQuery(req, res, next) {
        const company = req.body.company_name
        const companies = await db.query(`SELECT company_name FROM companies`, {
          type: QueryTypes.SELECT
        })
        const companiesArray = companies.map(company => company.company_name)
        if (req.body.company_name.length >= 1 && req.body.company_name.length <= 64) {
          if (companiesArray.every(name => name !== company)) next()
          else res.status(409).send("The company already exists").end()
        } else res.status(400).send("The company name length is wrong").end()
      }
      
      async createCompany(newCompany, req, res) {
        const inserted = await db.query(`
          INSERT INTO companies (company_name, city_id, address, email, telephone)
          VALUES (:company_name, :city_id, :address, :email, :telephone)
          `, {
          replacements: newCompany,
          type: QueryTypes.INSERT
        })
        const company = await db.query(`
          SELECT company_id, company_name, email, c.city_id, city_name, ci.country_id, country_name, 
          co.region_id, region_name, address, telephone
          FROM companies c
          JOIN cities ci ON ci.city_id = c.city_id
          JOIN countries co ON co.country_id = ci.country_id
          JOIN regions re ON re.region_id = co.region_id
          WHERE company_id = ?
          `, { replacements: [inserted[0]], type: QueryTypes.SELECT })
      
        res.status(201).json(company[0])
      }
      
      async validateCompanyIdQuery(req, res, next) {
        const companyId = +req.params.companyId || req.body.company_id
        const companies = await db.query(`SELECT company_id FROM companies`, {
          type: QueryTypes.SELECT
        })
        const companiesArray = companies.map(id => id.company_id)
        if (companiesArray.includes(companyId)) next()
        else res.status(404).send("The company does not exist").end()
      }
      
      async getCompany(companyId, req, res) {
        const company = await db.query(`
          SELECT company_id, company_name, email, comp.city_id, city_name, ci.country_id, country_name, 
          co.region_id, region_name, address, telephone 
          FROM companies comp
          JOIN cities ci ON ci.city_id = comp.city_id
          JOIN countries co ON co.country_id = ci.country_id
          JOIN regions re ON re.region_id = co.region_id
          WHERE company_id = ?
          `, {
          replacements: [companyId],
          type: QueryTypes.SELECT
        })
        res.status(200).json(company[0])
      }
      
      async validateCompanyNamePutQuery(req, res, next) {
        if (req.body.company_name) {
          const company = req.body.company_name
          const companies = await db.query(`SELECT company_name FROM companies WHERE company_id != ${req.params.companyId}`, {
            type: QueryTypes.SELECT
          })
          const companiesArray = companies.map(company => company.company_name)
          if (req.body.company_name.length >= 1 && req.body.company_name.length <= 64) {
            if (companiesArray.every(name => name !== company)) next()
            else res.status(400).send("The company already exists").end()
          } else res.status(400).send("The company name length is wrong").end()
        } else next()
      }
      
      async validateCityIdPutQuery(req, res, next) {
        if (req.body.city_id) {
          const cityId = req.body.city_id
          const cities = await db.query(`SELECT city_id FROM cities`, {
            type: QueryTypes.SELECT
          })
          const citiesArray = cities.map(id => id.city_id)
          if (citiesArray.includes(cityId)) next()
          else res.status(404).send("The city does not exist").end()
        } else next()
      }
      
      async modifyCompany(companyId, req, res) {
        const company = await db.query(`SELECT * FROM companies WHERE company_id = ?`, {
          replacements: [companyId],
          type: QueryTypes.SELECT
        })
        const newcompany = {
          company_id: companyId,
          company_name: req.body.company_name || company[0].company_name,
          email: req.body.email || company[0].email,
          address: req.body.address || company[0].address,
          telephone: req.body.telephone || company[0].telephone,
          city_id: req.body.city_id || company[0].city_id
        }
        const modified = await db.query(`
          UPDATE companies SET company_name = :company_name, city_id = :city_id, address = :address, 
          email = :email, telephone = :telephone
          WHERE company_id = :company_id
          `, {
          replacements: newcompany,
          type: QueryTypes.UPDATE
        })
        const companyRes = await db.query(`
          SELECT company_id, company_name, email, c.city_id, city_name, ci.country_id, country_name, 
          co.region_id, region_name, address, telephone
          FROM companies c
          JOIN cities ci ON ci.city_id = c.city_id
          JOIN countries co ON co.country_id = ci.country_id
          JOIN regions re ON re.region_id = co.region_id
          WHERE company_id = :company_id
          `, { replacements: newcompany, type: QueryTypes.SELECT })
        res.status(200).json(companyRes)
      }
      
      async deleteCompany(companyId, req, res) {
        const companiesId = await db.query(`SELECT company_id FROM contacts`, {
          type: QueryTypes.SELECT
        })
        const ids = companiesId.map(id => id.company_id)
        if (!ids.includes(companyId)) {
          const company = await db.query(`
              SELECT company_id, company_name, email, c.city_id, city_name, ci.country_id, country_name, 
              co.region_id, region_name, address, telephone
              FROM companies c
              JOIN cities ci ON ci.city_id = c.city_id
              JOIN countries co ON co.country_id = ci.country_id
              JOIN regions re ON re.region_id = co.region_id
              WHERE company_id = ?
              `, { replacements: [companyId], type: QueryTypes.SELECT })
          const deleted = await db.query(`DELETE FROM companies WHERE company_id = ?`, {
            replacements: [companyId],
            type: QueryTypes.DELETE
          })
          res.status(200).json(company[0])
        } else res.status(400).send("You cannot delete this company").end()
      }

};



module.exports = {
    companies
};