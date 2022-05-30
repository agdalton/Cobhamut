const mongoose = require('mongoose')

const reqString = {
	type: String,
	required: true,
}

// Create the schema we're going to use in MongoDB <-- These keys are basically column names
const partyfinderSchema = new mongoose.Schema({
	date: {
		type: Date,
		required: true,
	}, // ISODate of when the party is scheduled to start
	dataDTTZ: reqString, // JSON.stringify() object containing data about date, time, and timezone for the party
	dataCreator: reqString, // JSON.stringify() object containing data about the user who ran the command creating the partyfinder
	dataSubmission: reqString, // JSON.stringify() object containing data about the command submission
	dataPartyComp: reqString, // JSON.stringify() object containing data about the party composition, excluding fill role
	dataUserRSVP: {
		type: String,
		required: false,
	}, // JSON.stringify() object containing arrays of user snowflakes for each role of users who signed up for the partyfinder
	dataTotalRSVP: {
		type: Number,
		required: true,
	}, // Total number of users who have signed up to the partyfinder
	pfFull: {
		type: Boolean,
		required: true,
	}, // true or false, is the party full
	guildID: reqString, // Discord server ID of the server the command was sent from
	channelID: reqString, // Discord channel ID of the channel the command was sent from
	originalResponseID: reqString, // Discord Message ID of the message that tracks RSVPs (the message people react to)
	mentionRole: { // Discord role snowflake pinged by the partyfinder command in the reply content
		type: String,
		required: false,
	},
	reminderSent: { type: Boolean, required: true },
})

const collectionName = 'cobhamut-partyfinders'

module.exports =
	mongoose.model[collectionName] ||
	mongoose.model(collectionName, partyfinderSchema)
