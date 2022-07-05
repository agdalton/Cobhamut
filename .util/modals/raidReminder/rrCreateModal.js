const { data } = require('../../../commands/raidReminder')
const { DateTime } = require('luxon')
const { MessageEmbed } = require('discord.js')
const interactionReply = require('../../command-utils/interactionReply')
const getNextReminder = require('../../command-utils/raidReminder/getNextReminder')
const sendInputError = require('../../command-utils/raidReminder/sendInputError')
const validateInputs = require('../../command-utils/raidReminder/validateInputs')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema')

// Respond to the create raid reminder command and create the reminder in MongoDB
module.exports = {
	name: 'rrCreateModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { baseImageURL } = globals
		const { purple, red } = globals.colors

		// Setup member data to pass as necessary <-- this is data about the person who sent the command
		const memberData = {
			memberID: interaction.member.user.id,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nickname,
			memberAvatar: interaction.member.user.avatar,
		}

		// Prevent more than 20 reminders per user
		const raidReminders = await raidReminderSchema.find({
			dataCreator: `"memberID":"${memberData.memberID}"`,
		})

		if (raidReminders.length === 20) {
			const embed = new MessageEmbed()
				.setColor(red)
				.setTitle('Failed to create raid reminder')
				.setDescription(
					'You can only create a maximum of 20 raid reminders per person. Please cancel an existing one and try again.'
				)
				.setThumbnail(
					'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
				)
				.setFooter({
					text: `${
						memberData.memberNick
							? memberData.memberNick
							: memberData.memberUsername
					} used /raidreminder`,
					iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
				})

			interactionReply(interaction, null, [embed], null, true, false)
			return
		}

		// Get modal inputs
		const { fields } = interaction
		const title = fields.getTextInputValue('rrTitle').trim()
		const days = fields.getTextInputValue('rrDays').trim()
		const time = fields.getTextInputValue('rrTime').trim()
		const timezone = fields
			.getTextInputValue('rrTimezone')
			.trim()
			.toUpperCase()
		const roleChannelHours = fields
			.getTextInputValue('rrRoleChannelHours')
			.trim()

		// Validate time and timezone
		const inputs = validateInputs(days, time, timezone, roleChannelHours)

		if (!inputs.isValid) {
			sendInputError(interaction, memberData, globals, inputs)
			return
		}

		// Validate the channel is a real channel
		try {
			// Fetch the guild the partyfinder was scheduled in
			const guild = await client.guilds.fetch(interaction.guildId)
			if (!guild) throw new Error() // Skip if the guild can't be fetched

			// Fetch the channel of the guild the partyfinder was scheduled in
			const channel = await guild.channels.fetch(inputs.channel)
			if (!channel) throw new Error() // Skip if the channel can't be fetched (i.e deleted)

			if (channel.type !== 'GUILD_TEXT') throw new Error() // If the selected channel is not a text channel, throw an error
		} catch (e) {
			inputs.isValid = false
			inputs.err.push({
				field: 'Channel',
				message: "Cobhamut could not validate the channel you selected.\n\nPlease ensure you're selecting a **text channel** from the pop-up list in Discord and that the selection is NOT a channel category (folder icon)",
			})

			sendInputError(interaction, memberData, globals, inputs)
			return
		}

		// Get the date of the next reminder to be sent
		const nextReminder = getNextReminder(
			inputs.days,
			time,
			inputs.timezone,
			inputs.reminderHours
		)

		// Create the reminder in MongoDB
		await new raidReminderSchema({
			nextReminder: nextReminder.toISO(), // ISODate of when the next reminder should be sent
			reminderChannel: inputs.channel,
			mentionRole: inputs.role,
			dataCreator: JSON.stringify(memberData), // JSON.stringify() object containing data about the user who ran the command creating the raidReminder
			dataSubmission: JSON.stringify({
				title: title,
				days: days,
				daysOfWeek: inputs.days,
				time: time,
				timezone: timezone,
				role: inputs.role,
				channel: inputs.channel,
				reminderHours: inputs.reminderHours,
			}), // JSON.stringify() object containing data about the command submission
			guildID: interaction.guildId, // Discord server ID of the server the command was sent from
			channelID: interaction.channelId, // Discord channel ID of the channel the command was sent from
		}).save()

		// Respond with success
		const embed = new MessageEmbed()
			.setTitle('Raid reminders')
			.setDescription('Raid reminder created successfully!')
			.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
			.setColor(purple)
			.addField('Title', title)
			.addField(
				'Next reminder',
				`${nextReminder.toLocaleString(
					DateTime.DATE_MED_WITH_WEEKDAY
				)} ${nextReminder.toLocaleString(DateTime.TIME_SIMPLE)} ${
					nextReminder.offsetNameShort
				}`
			)
			.addField('Channel', `<#${inputs.channel}>`)
			.setFooter({
				text: `${
					memberData.memberNick
						? memberData.memberNick
						: memberData.memberUsername
				} used /raidreminder`,
				iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
			})

		interactionReply(interaction, null, [embed], null, true, false)

		return
	},
}
