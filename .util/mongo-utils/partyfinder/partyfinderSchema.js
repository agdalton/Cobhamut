const mongoose = require('mongoose')

const reqString = {
	type: String,
	required: true,
}

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
	guildID: reqString,
	channelID: reqString,
	originalResponse: reqString,
	originalResponseID: reqString,
})

const collectionName = 'cobhamut-partyfinders'

module.exports =
	mongoose.model[collectionName] ||
	mongoose.model(collectionName, partyfinderSchema)