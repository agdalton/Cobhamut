// Partyfinder command for creating and scheduling parties in FF14 for things like raids!
const { SlashCommandBuilder } = require('@discordjs/builders')
const { DateTime } = require('luxon')
const createPFEmbed = require('../.util/command-utils/partyfinder/createPFEmbed')
const partyfinderSchema = require('../.util/mongo-utils/partyfinder/partyfinderSchema')

module.exports = {
	name: 'partyfinder',
	guildId: '',
	init: (client, globals) => {
		const { green, red } = globals.colors
		// Check every second for scheduled partyfinders
		const checkForParties = async () => {
			// Lookup in MongoDB <-- Date is stored in Epoch seconds, so compare it to now
			let partyFinders = await partyfinderSchema.find({
				$or: [
					{ date: Date.now() + 60 * 30 }, // 30 minutes from now
					{ date: { $lte: Date.now() } }, // in the past or now
				],
			})

			for (const party of partyFinders) {
				const dataDTTZ = JSON.parse(party.dataDTTZ)
				const dataCreator = JSON.parse(party.dataCreator)
				const dataSubmission = JSON.parse(party.dataSubmission)
				const dataPartyComp = JSON.parse(party.dataPartyComp)
				const dataUserRSVP = JSON.parse(party.dataUserRSVP)
				const { pfFull, guildID, channelID } = party

				// Fetch the guild the partyfinder was scheduled in
				const guild = await client.guilds.fetch(guildID)
				if (!guild) continue // Skip if the guild can't be fetched

				// Fetch the channel of the guild the partyfinder was scheduled in
				const channel = await guild.channels.fetch(channelID)
				if (!channel) continue // Skip if the channel can't be fetched (i.e deleted)

				// Set the description based on if it's a reminder or not
				let description = 'Your party is starting now!'
				if (party.date > Date.now())
					description =
						'Your party is scheduled to begin in 30 minutes!'

				// If the party is not full, concat the description to indicate that
				if (!pfFull)
					description =
						description.substring(0, description.length - 1) +
						', but is NOT FULL!'

				// Create the embed for the message to be sent to the channel and DM'd to the members
				const embed = createPFEmbed(
					dataCreator,
					globals,
					pfFull ? green : red, // If not full, make the embed red
					dataDTTZ,
					dataSubmission.description,
					description,
					dataPartyComp,
					dataUserRSVP.tanks,
					dataUserRSVP.healers,
					dataUserRSVP.damage,
					dataUserRSVP.fill
				)

				// Send the message and DMs
				const userList = dataUserRSVP.tanks.concat(
					dataUserRSVP.healers,
					dataUserRSVP.damage,
					dataUserRSVP.fill
				)

				// Message the channel and mention the users
				await channel.send({
					content: userList.join(),
					embeds: [embed],
				})

				for (let iUser = 0; iUser < userList.length; iUser++) {
					// Fetch the user from the client <-- remove the <: at the start and > at the end
					const user = await client.users.fetch(
						userList[iUser].substring(
							2,
							userList[iUser].length - 1
						)
					)

					// Send a DM to the user
					await user.send({
						embeds: [embed],
						allowedMentions: { parse: true },
					})
				}

				// If the scheduled start time is passed, delete the record from MongoDB
				if (party.date <= Date.now())
					await partyfinderSchema.deleteOne({ _id: party._id })
			}

			// Check every second since we're working with Epoch time
			setTimeout(checkForParties, 1000 * 1)
		}

		checkForParties()
	},
	callback: async (client, interaction, globals) => {
		const command = interaction.options.getSubcommand()
		const data = {}

		require(`./subcommands/${interaction.commandName}/${command}.js`)(
			interaction,
			data,
			globals
		)

		return
	},
	data: (() => {
		// Primary command settings
		const data = new SlashCommandBuilder()
			.setName('partyfinder')
			.setDescription('Create or manage a party finder for FF14')

		// New subcommand
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('new')
				.setDescription(
					'Create a new party finder for a FF14 group'
				)
				.addStringOption((option) =>
					option
						.setName('size')
						.setDescription(
							'The number of players in the party'
						)
						.setRequired(true)
						.addChoices(
							{ name: '4 Players', value: '4' },
							{ name: '8 Players', value: '8' },
							{ name: '24 Players', value: '24' }
						)
				)
		)

		return data.toJSON()
	})(),
}
