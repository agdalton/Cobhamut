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
	},
	dataDTTZ: reqString,
	dataCreator: reqString,
	dataSubmission: reqString,
	dataPartyComp: reqString,
	dataUserRSVP: {
		type: String,
		required: false,
	},
	dataTotalRSVP: {
		type: Number,
		required: true,
	},
	pfFull: {
		type: Boolean,
		required: true,
	},
	guildID: reqString,
	channelID: reqString,
	originalResponseID: reqString,
})

const collectionName = 'cobhamut-partyfinders'

module.exports =
	mongoose.model[collectionName] ||
	mongoose.model(collectionName, partyfinderSchema)
