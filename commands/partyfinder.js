// Partyfinder command for creating and scheduling parties in FF14 for things like raids!
const { SlashCommandBuilder } = require('@discordjs/builders')
const { DateTime } = require('luxon')
const sendReminder = require('../.util/command-utils/partyfinder/sendReminder')
const partyfinderSchema = require('../.util/mongo-utils/partyfinder/partyfinderSchema')

module.exports = {
	name: 'partyfinder',
	guildId: '',
	init: (client, globals) => {
		// Check every second for scheduled partyfinders
		const checkForParties = async () => {
			// Lookup in MongoDB
			// Find parties starting in less than 30 minutes that haven't had a reminder sent
			const dt30MinFromNow = DateTime.now() // <-- Luxon DateTime because Date.now() math didn't play nice with MongoDB query
				.plus({ minutes: 30 })
				.toUTC()
				.toISO({ includeOffset: true })
			let partyfinders = await partyfinderSchema.find({
				$and: [
					{ date: { $lte: dt30MinFromNow } }, // 30 minutes from  now in Epoch seconds
					{ reminderSent: false },
				],
			})

			sendReminder(
				client,
				partyfinders,
				'Your party is starting in less than 30 minutes!',
				globals
			)

			// Set reminderSent to true in MongoDB <-- prevents an akh corning of reminders
			await partyfinderSchema.updateMany(
				{
					$and: [
						{ date: { $lte: dt30MinFromNow } },
						{ reminderSent: false },
					],
				},
				{ reminderSent: true }
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
			.setDescription('Create a new partyfinder for a group in FF14')

		// New subcommand
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('create')
				.setDescription(
					'Create a new party finder for a FF14 group'
				)
				.addStringOption((option) => {
					option
						.setName('description')
						.setDescription("What's the partyfinder for?")
						.setRequired(true)
				})
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
				.addRoleOption((option) =>
					option
						.setName('ping')
						.setDescription(
							"Ping a role to let members know you're recruiting"
						)
				)
				.addStringOption((option) => {
					option
						.setName('date')
						.setDescription(
							'Month and day (M/dd) the partyfinder will take place'
						)
				})
				.addStringOption((option) => {
					option
						.setName('time')
						.setDescription(
							'Time (HH:mm) the partyfinder will take place. REQUIRED IF A DATE IS ENTERED'
						)
				})
				.addStringOption((option) => {
					option
						.setName('ampm')
						.setDescription(
							'AM or PM. REQUIRED IF A DATE AND TIME IS ENTERED'
						)
						.addChoices(
							{
								name: 'AM',
								value: 'am',
							},
							{ name: 'PM', value: 'pm' }
						)
				})
				.addStringOption((option) => {
					option
						.setName('timezone')
						.setDescription(
							'Timezone to use for the partyfinder. REQUIRED IF A DATE AND TIME IS ENTERED'
						)
						.addChoices(
							{
								name: 'Pacific',
								value: 'America/Los_Angeles',
							},
							{
								name: 'Central',
								value: 'America/Chicago',
							},
							{
								name: 'Eastern',
								value: 'America/New_York',
							}
						)
				})
		)

		// Help subcommand
		data.addSubcommand((subcommand) =>
			subcommand
				.setName('help')
				.setDescription('How to use /partyfinder new')
		)

		return data.toJSON()
	})(),
}
