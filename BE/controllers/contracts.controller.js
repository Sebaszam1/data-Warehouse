const { QueryTypes } = require("sequelize")
const { db } = require("../db")
const jwt = require('jsonwebtoken')

const authorizationPassword = 'tmo$Q$bG5xR56'

class contracts {
    constructor(){};

    async getContacts(req, res) {
        const contacts = await db.query(`
          SELECT contact_id, firstname, lastname, cont.email, cont.city_id, ci.city_name, ci.country_id,
          co.country_name, co.region_id, re.region_name, cont.address, cont.company_id, comp.company_name,
          position, interest
          FROM contacts cont 
          JOIN cities ci ON ci.city_id = cont.city_id
          JOIN countries co ON co.country_id = ci.country_id
          JOIN regions re ON re.region_id = co.region_id
          JOIN companies comp ON comp.company_id = cont.company_id
          `, {
          type: QueryTypes.SELECT
        })
        const channels = await db.query(`
          SELECT * FROM contacts_channels cc 
          INNER JOIN channels ch ON cc.channel_id = ch.channel_id`, {
          type: QueryTypes.SELECT
        })
        const contactsAndChannels = contacts.map(contact =>
          Object.assign({}, contact, {
            preferred_channels: channels.filter(channel =>
              channel.contact_id === contact.contact_id)
          }
          ))
        res.status(200).json(contactsAndChannels)
      }
      
      async validateEmailContactsQuery(req, res, next) {
        const email = req.body.email
        const emails = await db.query(`SELECT email FROM contacts`, {
          type: QueryTypes.SELECT
        })
        const emailsArray = emails.map(contact => contact.email)
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
          if (emailsArray.every(e => e != email)) next()
          else res.status(409).send("The email already exists").end()
        } else res.status(400).send("The email is wrong").end()
      }
      
      async validateChannelIdQuery(req, res, next) {
        const channelsBody = req.body.preferred_channels
        const idsBody = channelsBody.map(channel => channel.channel_id)
      
        const channelsIdDB = await db.query(`SELECT channel_id FROM channels`, {
          type: QueryTypes.SELECT
        })
        const channelsArray = channelsIdDB.map(id => id.channel_id)
        if (idsBody.every(id => typeof (id) === "number" && channelsArray.includes(id))) {
          if (idsBody.every(different)) next()
          else res.status(400).send("The channelId is wrong").end()
        } else res.status(400).send("The channelId is wrong").end()
      }
      
      async different(value, index, list) {
        return list.indexOf(value) === index
      }
      
      async createContact(newContact, req, res) {
        const contactInserted = await db.query(`
          INSERT INTO contacts (firstname, lastname, email, city_id, address, company_id, position, interest)
          VALUES (:firstname, :lastname, :email, :city_id, :address, :company_id, :position, :interest)
          `, {
          replacements: newContact,
          type: QueryTypes.INSERT
        })
        return contactInserted[0]
      }
      
      async addChannelsContacts(newContact, contactId, req, res) {
        req.body.preferred_channels.forEach(async channel => await db.query(`
          INSERT INTO contacts_channels (contact_id, channel_id, user_account, preference)
          VALUES (${contactId}, ${channel.channel_id}, '${channel.user_account}', '${channel.preference}')
          `, {
          replacements: req.body.preferred_channels,
          type: QueryTypes.INSERT
        }))
      }
      
      async getContactInserted(contactId, req, res) {
        const contact = await db.query(`
          SELECT contact_id, firstname, lastname, cont.email, cont.city_id, ci.city_name, ci.country_id,
          co.country_name, co.region_id, re.region_name, cont.address, cont.company_id, comp.company_name,
          position, interest
          FROM contacts cont 
          JOIN cities ci ON ci.city_id = cont.city_id
          JOIN countries co ON co.country_id = ci.country_id
          JOIN regions re ON re.region_id = co.region_id
          JOIN companies comp ON comp.company_id = cont.company_id
          WHERE contact_id = ?
          `, {
          replacements: [contactId],
          type: QueryTypes.SELECT
        })
        return contact
      }
      
      async getChannelsInserted(contactId, req, res) {
        const channels = await db.query(`
          SELECT * FROM contacts_channels cc 
          INNER JOIN channels ch ON cc.channel_id = ch.channel_id
          WHERE contact_id = ?`, {
          replacements: [contactId],
          type: QueryTypes.SELECT
        })
        return channels
      }
      
      async validateContactIdQuery(req, res, next) {
        const contactId = +req.params.contactId
        const contacts = await db.query(`SELECT contact_id FROM contacts`, {
          type: QueryTypes.SELECT
        })
        const contactsArray = contacts.map(id => id.contact_id)
        if (contactsArray.includes(contactId)) next()
        else res.status(404).send("The contact does not exist").end()
      }
      
      async getContact(contactId, req, res) {
        const contact = await db.query(`
          SELECT contact_id, firstname, lastname, cont.email, cont.city_id, ci.city_name, ci.country_id,
          co.country_name, co.region_id, re.region_name, cont.address, cont.company_id, comp.company_name,
          position, interest
          FROM contacts cont 
          JOIN cities ci ON ci.city_id = cont.city_id
          JOIN countries co ON co.country_id = ci.country_id
          JOIN regions re ON re.region_id = co.region_id
          JOIN companies comp ON comp.company_id = cont.company_id
          WHERE contact_id = ?
          `, {
          replacements: [contactId],
          type: QueryTypes.SELECT
        })
        const channels = await db.query(`
          SELECT * FROM contacts_channels cc 
          INNER JOIN channels ch ON cc.channel_id = ch.channel_id
          WHERE contact_id = ?`, {
          replacements: [contactId],
          type: QueryTypes.SELECT
        })
        const contactAndChannels = Object.assign({}, contact[0], { preferred_channels: channels })
        res.status(201).json(Object.assign(contactAndChannels))
      }
      
      async validateEmailContactsPutQuery(req, res, next) {
        if (req.body.email) {
          const email = req.body.email
          const emails = await db.query(`SELECT email FROM contacts WHERE contact_id != ${req.params.contactId}`, {
            type: QueryTypes.SELECT
          })
          const emailsArray = emails.map(contact => contact.email)
          if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
            if (emailsArray.every(e => e != email)) next()
            else res.status(409).send("The email already exists").end()
          } else res.status(400).send("The email is wrong").end()
        } else next()
      }
      
      async validateCompanyIdPutQuery(req, res, next) {
        if (req.body.company_id) {
          const companyId = req.body.company_id
          const companies = await db.query(`SELECT company_id FROM companies`, {
            type: QueryTypes.SELECT
          })
          const companiesArray = companies.map(id => id.company_id)
          if (companiesArray.includes(companyId)) next()
          else res.status(404).send("The company does not exist").end()
        } else next()
      }
      
      async validateChannelIdPutQuery(req, res, next) {
        if (req.body.preferred_channels) {
          const channelsBody = req.body.preferred_channels
          const idsBody = channelsBody.map(channel => channel.channel_id)
      
          const channelsIdDB = await db.query(`SELECT channel_id FROM channels`, {
            type: QueryTypes.SELECT
          })
          const channelsArray = channelsIdDB.map(id => id.channel_id)
          if (idsBody.every(id => typeof (id) === "number" && channelsArray.includes(id))) {
            if (idsBody.every(different)) next()
            else res.status(400).send("The channelId is wrong").end()
          } else res.status(400).send("The channelId is wrong").end()
        } else next()
      }
      
      async modifyContact(req, res) {
        const contact = await db.query(`SELECT * FROM contacts WHERE contact_id = ?`, {
          replacements: [req.params.contactId],
          type: QueryTypes.SELECT
        })
      
        const modifiedContact = {
          contact_id: req.params.contactId,
          firstname: req.body.firstname || contact[0].firstname,
          lastname: req.body.lastname || contact[0].lastname,
          email: req.body.email || contact[0].email,
          city_id: req.body.city_id || contact[0].city_id,
          address: req.body.address || contact[0].address,
          company_id: req.body.company_id || contact[0].company_id,
          position: req.body.position || contact[0].position,
          interest: +req.body.interest,
          preferred_channels: req.body.preferred_channels
        }
        const modified = await db.query(`
          UPDATE contacts SET firstname = :firstname, lastname = :lastname, email = :email, city_id = :city_id, 
          address = :address, company_id = :company_id, position = :position, interest = :interest
          WHERE contact_id = :contact_id
          `, {
          replacements: modifiedContact,
          type: QueryTypes.UPDATE
        })
        const deleteChannels = await db.query(`
          DELETE FROM contacts_channels WHERE contact_id = ${req.params.contactId}
          `, { type: QueryTypes.DELETE })
      
        req.body.preferred_channels.forEach(async chan => {
          await db.query(`
          INSERT INTO contacts_channels (contact_id, channel_id, user_account, preference) 
          VALUES (${req.params.contactId}, ${chan.channel_id}, '${chan.user_account}', '${chan.preference}')
          `, {
            replacements: req.body.preferred_channels,
            type: QueryTypes.INSERT
          })
        })
      
        const contactRes = await db.query(`
          SELECT contact_id, firstname, lastname, cont.email, cont.city_id, ci.city_name, ci.country_id,
          co.country_name, co.region_id, re.region_name, cont.company_id, cont.address, comp.company_name,
          position, interest
          FROM contacts cont 
          JOIN cities ci ON ci.city_id = cont.city_id
          JOIN countries co ON co.country_id = ci.country_id
          JOIN regions re ON re.region_id = co.region_id
          JOIN companies comp ON comp.company_id = cont.company_id
          WHERE contact_id = ?
          `, {
          replacements: [req.params.contactId],
          type: QueryTypes.SELECT
        })
        const channels = await db.query(`
          SELECT * FROM contacts_channels cc 
          INNER JOIN channels ch ON cc.channel_id = ch.channel_id
          WHERE contact_id = ?`, {
          replacements: [req.params.contactId],
          type: QueryTypes.SELECT
        })
        const contactAndChannels = Object.assign({}, contactRes[0], { preferred_channels: channels })
        res.status(201).json(Object.assign(contactAndChannels))
      }
      
      async deleteContact(contactId, req, res) {
        const contact = await db.query(`SELECT * FROM contacts WHERE contact_id = ?`, {
          replacements: [contactId],
          type: QueryTypes.SELECT
        })
        const channels = await db.query(`SELECT * FROM contacts_channels WHERE contact_id = ?`, {
          replacements: [contactId],
          type: QueryTypes.SELECT
        })
        const deleted = await db.query(`DELETE FROM contacts WHERE contact_id = ?`, {
          replacements: [contactId],
          type: QueryTypes.DELETE
        })
        const deletedChannels = await db.query(`DELETE FROM contacts_channels WHERE contact_id = ?`, {
          replacements: [contactId],
          type: QueryTypes.DELETE
        })
        const contactAndChannels = Object.assign({}, contact[0], { preferred_channels: channels })
        res.status(200).json(Object.assign(contactAndChannels))
      }
      
      async validateChannelIdAddQuery(req, res, next) {
        const channelId = req.body.channel_id
        const channels = await db.query(`SELECT channel_id FROM channels`, {
          type: QueryTypes.SELECT
        })
        const channelsArray = channels.map(id => id.channel_id)
      
        const channelsContact = await db.query(`
          SELECT * FROM contacts_channels cc 
          INNER JOIN channels ch ON cc.channel_id = ch.channel_id
          WHERE contact_id = ?`, {
          replacements: [req.params.contactId],
          type: QueryTypes.SELECT
        })
        const channelsContactArray = channelsContact.map(cc => cc.channel_id)
      
        if (channelsArray.includes(channelId)) {
          if (channelsContactArray.includes(channelId)) {
            res.status(400).send("The contact already has that channel").end()
          } else next()
        } else res.status(404).send("The channel does not exist").end()
      }
      
      async validateChannelIdDelQuery(req, res, next) {
        const channelId = +req.params.channelId
        const channelsContact = await db.query(`
          SELECT * FROM contacts_channels cc 
          INNER JOIN channels ch ON cc.channel_id = ch.channel_id
          WHERE contact_id = ?`, {
          replacements: [+req.params.contactId],
          type: QueryTypes.SELECT
        })
        const channelsContactArray = channelsContact.map(cc => cc.channel_id)
        if (channelsContactArray.includes(channelId)) next()
        else res.status(404).send("The contact does not have that channel").end()
      }
      
      async addChannel(newContChan, req, res) {
        const inserted = await db.query(`
          INSERT INTO contacts_channels (contact_id, channel_id, user_account, preference)
          VALUES (:contact_id, :channel_id, :user_account, :preference)
          `, {
          replacements: newContChan,
          type: QueryTypes.INSERT
        })
        const channels = await db.query(`
          SELECT contact_id, cc.channel_id, channel_name, user_account, preference
          FROM contacts_channels cc 
          JOIN channels ch ON cc.channel_id = ch.channel_id 
          WHERE contact_id = :contact_id
          `, {
          replacements: newContChan,
          type: QueryTypes.SELECT
        })
        res.status(201).json(channels)
      }
      
      async deleteChannelContact(newContChan, req, res) {
        const deleted = await db.query(`DELETE FROM contacts_channels 
          WHERE contact_id = :contact_id AND channel_id = :channel_id`, {
          replacements: newContChan,
          type: QueryTypes.DELETE
        })
        res.status(200).send("Channel successfully removed").end()
      }
      
      async getResults(req, res) {
        const searchValue = req.body.search_value
        const contacts = await db.query(`
          SELECT contact_id, firstname, lastname, cont.email, cont.city_id, ci.city_name, ci.country_id,
          co.country_name, co.region_id, re.region_name, cont.address, cont.company_id, comp.company_name,
          position, interest
          FROM contacts cont 
          JOIN cities ci ON ci.city_id = cont.city_id
          JOIN countries co ON co.country_id = ci.country_id
          JOIN regions re ON re.region_id = co.region_id
          JOIN companies comp ON comp.company_id = cont.company_id
          WHERE firstname LIKE '%${searchValue}%' OR lastname LIKE '%${searchValue}%' OR cont.email LIKE '%${searchValue}%'
          OR ci.city_name LIKE '${searchValue}%' OR co.country_name LIKE '${searchValue}%' OR re.region_name LIKE '${searchValue}%'
          OR cont.address LIKE '${searchValue}%' OR comp.company_name LIKE '${searchValue}%' OR position LIKE '%${searchValue}%'
          OR interest LIKE '${searchValue}%'
          `, {
          replacements: [searchValue],
          type: QueryTypes.SELECT
        })
        const channels = await db.query(`
          SELECT * FROM contacts_channels cc 
          INNER JOIN channels ch ON cc.channel_id = ch.channel_id`, {
          type: QueryTypes.SELECT
        })
        const contactsAndChannels = contacts.map(contact =>
          Object.assign({}, contact, {
            preferred_channels: channels.filter(channel =>
              channel.contact_id === contact.contact_id)
          }
          ))
        res.status(200).json(contactsAndChannels)
      }
}

module.exports = {
    contracts
};