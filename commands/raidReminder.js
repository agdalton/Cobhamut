// Raid reminder command for configuring scheduled reminders for FF14 statics
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const { DateTime } = require('luxon')
const raidReminderSchema = require('../.util/mongo-utils/raidReminder/raidReminderSchema.js')
const getNextReminder = require('../.util/command-utils/raidReminder/getNextReminder.js')

module.exports = {
	name: 'raidreminder',
	guildId: '',
	init: (client, globals) => {
		// Destruct globals
		const { baseImageURL } = globals
		const { purple } = globals.colors

		// Check every second for scheduled raid reminders
		const checkForReminders = async () => {
			// Lookup in MongoDB
			// Send reminders
			reminders = await raidReminderSchema.find({
				nextReminder: { $lte: Date.now() }, // In the past or now
			})

			for (reminder of reminders) {
				const dataCreator = JSON.parse(reminder.dataCreator)
				const {
					title,
					daysOfWeek,
					time,
					timezone,
					friendlyTZ,
					role,
					channel,
					reminderHours,
				} = JSON.parse(reminder.dataSubmission)

				// Find the next reminder
				const nextReminder = getNextReminder(
					daysOfWeek,
					time,
					timezone,
					reminderHours
				)
				// Fetch the guild the raid reminder was scheduled in
				const guild = await client.guilds.fetch(reminder.guildID)
				if (!guild) return // Skip if the guild can't be fetched

				// Fetch the chosen channel of the guild the raid reminder was scheduled in
				const fetchedChannel = await guild.channels.fetch(channel)
				if (!fetchedChannel) return // Skip if the channel can't be fetched

				// Build the reminder embed
				const nextReminderDate = nextReminder.toLocaleString(
					DateTime.DATE_MED_WITH_WEEKDAY
				)

				const embedDescription = reminderHours > 1 ? `${reminderHours} hours!` : `${reminderHours} hour!`
				const embed = new MessageEmbed()
					.setColor(purple)
					.setTitle(title)
					.setDescription(
						`Raid begins in ${embedDescription}`
					)
					.setThumbnail(
						'https://xivapi.com/i/060000/060855_hr1.png'
					)
					.addField('Static', `${role}`)
					.addField('Raid start time', `${time} ${friendlyTZ}`)
					.setFooter({
						text: `${
							dataCreator.memberNick
								? dataCreator.memberNick
								: dataCreator.memberUsername
						} used /raidreminder\nNext reminder @ ${nextReminderDate.substring(
							0,
							nextReminderDate.length - 6
						)} ${nextReminder.toLocaleString(
							DateTime.TIME_SIMPLE
						)} ${nextReminder.offsetNameShort}`,
						iconURL: `${baseImageURL}/avatars/${dataCreator.memberID}/${dataCreator.memberAvatar}.png`,
					})

				// Message the channel with the reminder
				await fetchedChannel.send({
					content: role,
					embeds: [embed],
				})

				// Update the reminder with the next date a reminder should be sent
				await raidReminderSchema.updateOne(
					{
						_id: reminder._id,
					},
					{
						nextReminder: nextReminder.toISO(),
					}
				)
			}

			// Check every second
			setTimeout(checkForReminders, 1000 * 1)
		}

		checkForReminders()
	},
	callback: async (client, interaction, globals) => {
		const command = interaction.options.getSubcommand()
		const data = { client: client }

		// Call the file for the subcommand submitted <-- require(filePath)() automatically calls the file's exported function
		require(`./subcommands/${interaction.commandName}/${command}.js`)(
			interaction,
			data,
			globals
		)

		return
	},
	data: (() => {
		const data = new SlashCommandBuilder()
			.setName('raidreminder')
			.setDescription(
				'Create or manage a starting soon reminder for your static'
			)

		data.addSubcommand((subcommand) =>
			subcommand
				.setName('create')
				.setDescription(
					'Create a new raid reminder for your static'
				)
				.addChannelOption((option) =>
					option
						.setName('channel')
						.setDescription(
							'What channel should the reminder be sent in?'
						)
						.setRequired(true)
				)
				.addRoleOption((option) =>
					option
						.setName('role')
						.setDescription(
							'What role should be pinged for this reminder?'
						)
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName('reminder_hours')
						.setDescription(
							'How many hours before raid starts should the reminder be sent?'
						)
						.setRequired(true)
				)
		)

		data.addSubcommand((subcommand) =>
			subcommand
				.setName('cancel')
				.setDescription(
					'Cancel an existing raid reminder you created'
				)
		)

		data.addSubcommand((subcommand) =>
			subcommand
				.setName('skip')
				.setDescription(
					'Skip the next reminder for one of your raid reminders'
				)
		)

		data.addSubcommand((subcommand) =>
			subcommand
				.setName('info')
				.setDescription(
					'Get details about one of your raid reminders'
				)
		)

		data.addSubcommand((subcommand) =>
			subcommand
				.setName('purge')
				.setDescription(
					'Moderator command. Purge all reminders by users no longer in this server.'
				)
		)

		return data.toJSON()
	})(),
}
