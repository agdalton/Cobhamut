// Update the members of a partyfinder
const createPFEmbed = require('../../../.util/command-utils/partyfinder/createPFEmbed')
const isRoleFull = require('../../../.util/command-utils/partyfinder/isRoleFull')
const partyfinderSchema = require('../../../.util/mongo-utils/partyfinder/partyfinderSchema')

module.exports = {
	applicableEmoji: [
		'977771775960174652',
		'977771776253775932',
		'977771775859494942',
		'977774943154618368',
	],
	init: async (client) => {
		// Find exisiting messages that we need to cache upon restart so that reaction tracking works
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
		if (reaction.count === 1 && remove === false) return

		// Find the document in MongoDB that we'll need to edit
		const doc = await partyfinderSchema.findOne({
			originalResponseID: reaction.message.id,
		})

		if (!doc) return
		if (doc.pfFull) return

		// Grab the data from MongoDB
		const dataDTTZ = JSON.parse(doc.dataDTTZ)
		const dataCreator = JSON.parse(doc.dataCreator)
		const dataSubmission = JSON.parse(doc.dataSubmission)
		const dataPartyComp = JSON.parse(doc.dataPartyComp)
		let dataUserRSVP = JSON.parse(doc.dataUserRSVP)
		let dataTotalRSVP = doc.dataTotalRSVP
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
				role = 'damage'
				break
			case '977774943154618368':
				role = 'fill'
				break
		}

		// Return if the selected role is full and it's not a remove
		if (!remove) {
			if (isRoleFull(role, dataUserRSVP, dataPartyComp, dataTotalRSVP))
				return

			// If the role is not full, add the user to the role
			dataUserRSVP[role].push(user.id)
			dataTotalRSVP = dataTotalRSVP++
		} else if (remove) {
			for (let iRole = 0; iRole < dataUserRSVP[role].length; iRole++) {
				if (dataUserRSVP[role][iRole] === user.id) {
					dataUserRSVP[role][iRole].splice(i, 1)
					dataTotalRSVP = dataTotalRSVP--
					break
				}
			}
		}

		// Fetch the full message
		const message = await reaction.message.fetch()
		const updatedEmbed = createPFEmbed(
			dataCreator,
			globals,
			dataDTTZ,
			dataSubmission.description,
			dataPartyComp,
			dataUserRSVP.tanks,
			dataUserRSVP.healers,
			dataUserRSVP.damage,
			dataUserRSVP.fill
		)

		console.log(updatedEmbed)

		message.edit(
			null,
			[updatedEmbed],
			{ parse: true },
			null,
			null,
			null,
			null
		)

		return
	},
}
