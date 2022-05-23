// Update the members of a partyfinder
const partyfinderSchema = require('../../../.util/mongo-utils/partyfinder/partyfinderSchema')

module.exports = {
	applicableEmoji: [
		'977771775960174652',
		'977771776253775932',
		'977771775859494942',
		'977774943154618368',
	],
	init: async (client) => {
		const docs = await partyfinderSchema.find()

		for (const doc of docs) {
			const channel = await client.channels.fetch(doc.channelID)
			const message = doc.originalResponseID

			await channel.messages.fetch(message)
			console.log('Message Cached!')
		}
	},
	callback: async (reaction, user, remove, globals) => {
		// Check incoming message was created by the partyfinder command
		if (
			reaction.message.interaction.hasOwnProperty('commandName') &&
			reaction.message.interaction.commandName !== 'partyfinder'
		)
			return

		// Find the document in MongoDB that we'll need to edit
		const doc = await partyfinderSchema.findOne({
			originalResponseID: reaction.message.id,
		})

		if (!doc) return
        if (doc.pfFull) return
		if (reaction.count === 1 && remove === false) return

		// Grab the data from MongoDB
		const dataDTTZ = JSON.parse(doc.dataDTTZ)
		const dataCreator = JSON.parse(doc.dataCreator)
		const dataSubmission = JSON.parse(doc.dataSubmission)
		const dataPartyComp = JSON.parse(doc.dataPartyComp)
		const dataUserRSVP = JSON.parse(doc.dataUserRSVP)
        const dataTotalRSVP = doc.dataTotalRSVP
		const guildID = doc.guildID
		const channelID = doc.channelID
		const originalResponseID = doc.originalResponseID
		const emoji = reaction._emoji.id

		// Determine what role the user selected
		let role = ''
		switch (emoji) {
			// Tank
			case '977771775960174652':
				role = 'tanks'
				break
			case '977771776253775932':
				role = 'healers'
				break
			case '977771775859494942':
				role = 'dps'
				break
			case '977774943154618368':
				role = 'fill'
				break
		}

		return
	},
}
