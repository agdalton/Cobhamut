// Partyfinder command for creating and scheduling parties in FF14 for things like raids!
const { SlashCommandBuilder } = require('@discordjs/builders')
const sendReminder = require('../.util/command-utils/partyfinder/sendReminder')
const partyfinderSchema = require('../.util/mongo-utils/partyfinder/partyfinderSchema')

module.exports = {
	name: 'partyfinder',
	guildId: '',
	init: (client, globals) => {
		// Check every second for scheduled partyfinders
		const checkForParties = async () => {
			// Lookup in MongoDB <-- Mongo can compare ISO dates to Epoch
			// Find parties starting in 30 minutes and send the reminder
			let partyfinders = await partyfinderSchema.find({
				date: {
					$dateAdd: {
						startDate: Date.now(),
						unit: 'minute',
						amount: 30,
					},
				}, // 30 minutes from now
			})

			sendReminder(
				client,
				partyfinders,
				'Your party is starting in 30 minutes!',
				globals
			)

			// Send reminders for parties starting NOW
			partyfinders = await partyfinderSchema.find({
				date: { $lte: Date.now() }, // In the past or now
			})

			sendReminder(
				client,
				partyfinders,
				'Your party is starting now!',
				globals
			)

			// Delete the parties that are starting now <-- prevent the great akh corning
			await partyfinderSchema.deleteMany({
				date: { $lte: Date.now() },
			})

			// Check every second
			setTimeout(checkForParties, 1000 * 1)
		}

		checkForParties()
	},
	callback: async (client, interaction, globals) => {
		const command = interaction.options.getSubcommand()
		const data = {}

		// Call the file for the subcommand submitted <-- require(filePath)() automatically calls the file's exported function
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
