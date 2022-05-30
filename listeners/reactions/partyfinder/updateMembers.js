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
		'❌',
	],
	init: async (client, globals) => {
		// Find exisiting partyfinders that we need to cache upon restart so that reaction tracking works
		const partyFinders = await partyfinderSchema.find()

		for (const party of partyFinders) {
			const channel = await client.channels.fetch(party.channelID)
			const message = party.originalResponseID

			try {
				await channel.messages.fetch(message)
				console.log('Message Cached!')
			} catch (e) {
				console.log(
					'Error trying to cache message : Removing from MongoDB'
				)
				// If we couldn't cache the message, delete it from MongoDB
				await partyfinderSchema.deleteOne({ _id: party._id })
			}
		}
	},
	callback: async (client, reaction, user, remove, globals) => {
		// Check incoming message was created by the partyfinder command
		if (
			reaction.message.interaction.hasOwnProperty('commandName') &&
			reaction.message.interaction.commandName !== 'partyfinder'
		)
			return

		// return when the first reactions are auto added by Cobhamut
		if (reaction.count === 1 && remove === false) return

		// Find the party in MongoDB that we'll need to edit
		const party = await partyfinderSchema.findOne({
			originalResponseID: reaction.message.id,
		})

		// If the party can't be found in MongoDB, return
		if (!party) return

		// Grab globals
		const { green, purple } = globals.colors

		// Grab the data from MongoDB
		const dataDTTZ = JSON.parse(party.dataDTTZ)
		const dataCreator = JSON.parse(party.dataCreator)
		const dataSubmission = JSON.parse(party.dataSubmission)
		const dataPartyComp = JSON.parse(party.dataPartyComp)
		let dataUserRSVP = JSON.parse(party.dataUserRSVP)
		let dataTotalRSVP = parseInt(party.dataTotalRSVP)
		let pfFull = party.pfFull
		const { mentionRole } = party
		const emoji = reaction._emoji.id
		const message = await reaction.message.fetch()

		// If the reaction was ❌ then delete the partyfinder <-- above the return for party full to allow cancelations
		if (reaction._emoji.name === '❌') {
			// return if the person who reacted ❌ did not create the partyfinder
			if (user.id !== dataCreator.memberID) return

			// Delete the partyfinder
			await partyfinderSchema.deleteOne({ _id: party._id })
			return
		}

		// If the party is full, return
		if (party.pfFull) return

		// Determine what role the user selected
		let role = ''
		switch (emoji) {
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
			if (
				isRoleFull(
					role,
					dataUserRSVP,
					dataPartyComp,
					dataSubmission.size,
					dataTotalRSVP
				)
			)
				return

			// If they already RSVP'd remove them from that role
			for (const keyRole in dataUserRSVP) {
				for (
					let iRole = 0;
					iRole < dataUserRSVP[keyRole].length;
					iRole++
				) {
					if (dataUserRSVP[keyRole][iRole] === user.toString()) {
						dataUserRSVP[keyRole].splice(iRole, 1)
						dataTotalRSVP -= 1
					}
				}
			}

			// If the role is not full, add the user to the role
			dataUserRSVP[role].push(user.toString())
			dataTotalRSVP += 1
			if (dataTotalRSVP == dataSubmission.size) {
				pfFull = true
			}
		} else if (remove) {
			for (let iRole = 0; iRole < dataUserRSVP[role].length; iRole++) {
				if (dataUserRSVP[role][iRole] === user.toString()) {
					dataUserRSVP[role].splice(iRole, 1)
					dataTotalRSVP -= 1
				}
			}
		}

		// Update MongoDB
		party.dataUserRSVP = JSON.stringify(dataUserRSVP)
		party.dataTotalRSVP = dataTotalRSVP
		party.pfFull = pfFull
		await party.save()

		// Fetch the full message
		const updatedEmbed = createPFEmbed(
			dataCreator,
			globals,
			pfFull ? green : purple,
			dataDTTZ,
			dataSubmission.description,
			pfFull ? 'Your party is full and has been scheduled!' : '',
			dataPartyComp,
			dataUserRSVP.tanks,
			dataUserRSVP.healers,
			dataUserRSVP.damage,
			dataUserRSVP.fill
		)

		// Update the message to reflect the added/removed user
		await message.edit({
			content: mentionRole ? mentionRole : null,
			embeds: [updatedEmbed],
			allowedMentions: { parse: ['roles', 'users'] },
		})

		// DM all RSVP'd users if the partyfinder is full now
		if (pfFull) {
			for (const keyRole in dataUserRSVP) {
				for (
					let iRole = 0;
					iRole < dataUserRSVP[keyRole].length;
					iRole++
				) {
					const user = await client.users.fetch(
						dataUserRSVP[keyRole][iRole].substring(
							2,
							dataUserRSVP[keyRole][iRole].length - 1
						)
					)
					// Send the DM
					await user.send({
						embeds: [updatedEmbed],
						allowedMentions: { parse: true },
					})
				}
			}
		}

		return
	},
}
