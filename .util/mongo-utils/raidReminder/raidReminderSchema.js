const mongoose = require('mongoose')

const reqString = {
	type: String,
	required: true,
}

// Create the schema we're going to use in MongoDB <-- These keys are basically column names
const raidReminderSchema = new mongoose.Schema({
	nextReminder: {
		type: Date,
		required: true,
	}, // ISODate of when the next reminder should be sent
	reminderChannel: reqString,
	mentionRole: reqString,
	dataCreator: reqString, // JSON.stringify() object containing data about the user who ran the command creating the raidReminder
	dataSubmission: reqString, // JSON.stringify() object containing data about the command submission
	guildID: reqString, // Discord server ID of the server the command was sent from
	channelID: reqString, // Discord channel ID of the channel the command was sent from
})

const collectionName = 'cobhamut-raidReminders'

module.exports =
	mongoose.model[collectionName] ||
	mongoose.model(collectionName, raidReminderSchema)
