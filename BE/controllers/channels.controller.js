const { QueryTypes } = require("sequelize")
const { db } = require("../db")
const jwt = require('jsonwebtoken')

const authorizationPassword = 'tmo$Q$bG5xR56'

class channels {
    constructor(){};

    async getChannels(req, res) {
        const channels = await db.query(`SELECT * FROM channels`, { type: QueryTypes.SELECT })
        res.status(200).json(channels)
      }
      
      async validateChannelNameQuery(req, res, next) {
        const channel = req.body.channel_name
        const channels = await db.query(`SELECT channel_name FROM channels`, {
          type: QueryTypes.SELECT
        })
        const channelsArray = channels.map(channel => channel.channel_name)
        if (req.body.channel_name.length >= 1 && req.body.channel_name.length <= 64) {
          if (channelsArray.every(name => name !== channel)) next()
          else res.status(400).send("The channel already exists").end()
        } else res.status(400).send("The channel name length is wrong").end()
      }
      
      async createChannel(channel_name, req, res) {
        const inserted = await db.query(`
          INSERT INTO channels (channel_name)
          VALUES (:channel_name)
          `, {
          replacements: { channel_name },
          type: QueryTypes.INSERT
        })
        res.status(201).json(Object.assign({}, { channel_id: inserted[0] }, { channel_name }))
      }
      
      async validateChannelIdExQuery(req, res, next) {
        const channelId = +req.params.channelId
        const channels = await db.query(`SELECT channel_id FROM channels`, {
          type: QueryTypes.SELECT
        })
        const channelsArray = channels.map(id => id.channel_id)
        if (channelsArray.includes(channelId)) next()
        else res.status(404).send("The channel does not exist").end()
      }
      
      async getChannel(channelId, req, res) {
        const channel = await db.query(`
          SELECT * FROM channels WHERE channel_id = ?
          `, {
          replacements: [channelId],
          type: QueryTypes.SELECT
        })
        res.status(200).json(channel[0])
      }
      
      async validateChannelNamePutQuery(req, res, next) {
        if (req.body.channel_name) {
          const channel = req.body.channel_name
          const channels = await db.query(`SELECT channel_name FROM channels`, {
            type: QueryTypes.SELECT
          })
          const channelsArray = channels.map(channel => channel.channel_name)
          if (req.body.channel_name.length >= 1 && req.body.channel_name.length <= 64) {
            if (channelsArray.every(name => name !== channel)) next()
            else res.status(400).send("The channel already exists").end()
          } else res.status(400).send("The channel name length is wrong").end()
        } else next()
      }
      
      async modifyChannel(channelId, req, res) {
        const channel = await db.query(`SELECT * FROM channels WHERE channel_id = ?`, {
          replacements: [channelId],
          type: QueryTypes.SELECT
        })
        const newChannel = {
          channelId: channelId,
          channelName: req.body.channel_name || channel[0].channel_name
        }
        const modified = await db.query(`
          UPDATE channels SET channel_name = :channelName WHERE channel_id = :channelId
          `, {
          replacements: newChannel,
          type: QueryTypes.UPDATE
        })
        res.status(200).json(newChannel)
      }
      
      async deleteChannel(channelId, req, res) {
        const channel = await db.query(`SELECT * FROM channels WHERE channel_id = ?`, {
          replacements: [channelId],
          type: QueryTypes.SELECT
        })
        const deleted = await db.query(`DELETE FROM channels WHERE channel_id = ?`, {
          replacements: [channelId],
          type: QueryTypes.DELETE
        })
        res.status(200).json(channel)
      }

};


module.exports = {
    channels
};