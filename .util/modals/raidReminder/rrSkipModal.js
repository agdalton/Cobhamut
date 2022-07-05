const { MessageEmbed } = require('discord.js')
const { DateTime } = require('luxon')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')
const interactionReply = require('../../command-utils/interactionReply')
const getNextReminder = require('../../command-utils/raidReminder/getNextReminder.js')

module.exports = {
	name: 'rrCancelModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { baseImageURL } = globals
		const { orange, purple } = globals.colors

		// Get modal inputs
		const { fields } = interaction
		const mongoId = fields.getTextInputValue('rrMongoId').trim()
		const confirmation = fields.getTextInputValue('rrConfirm').trim()

		// Get data about the user who submitted the command
		const memberData = {
			memberID: interaction.member.user.id,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nickname,
			memberAvatar: interaction.member.user.avatar,
		}

		// Create embed reply
		const embed = new MessageEmbed()

		// Return if the user didn't correctly type CANCEL
		if (confirmation !== 'SKIP') {
			embed.setColor(orange)
				.setTitle('An error occurred')
				.setDescription(
					'Invalid confirmation from the cancel dialog. To cancel a raid reminder, type "CANCEL" (in all caps) into the cancelation dialog when prompted.'
				)
				.setThumbnail(
					'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
				)
				.setFooter({
					text: `${
						memberData.memberNick
							? memberData.memberNick
							: memberData.memberUsername
					} used /raidreminder skip`,
					iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
				})

			interactionReply(interaction, null, [embed], null, true, false)
			return
		}

		// Modify the next reminder in mongoDB
		try {
			const reminder = await raidReminderSchema.findOne({
				_id: mongoId,
			})

			const { daysOfWeek, time, timezone, reminderHours } = JSON.parse(
				reminder.dataSubmission
			)
			// Get the current next reminder
			const nextReminder = getNextReminder(
				daysOfWeek,
				time,
				timezone,
				reminderHours
			)

			// Remove the day index of the next reminder from daysOfWeek so that the next reminder is skipped
			const filteredDays = daysOfWeek.filter((value, index, arr) => {
				return value !== nextReminder.weekday
			})

			const newNextReminder = getNextReminder(
				filteredDays,
				time,
				timezone,
				reminderHours
			)

			await raidReminderSchema.updateOne(
				{
					_id: mongoId,
				},
				{ nextReminder: newNextReminder.toISO() }
			)
		} catch (e) {
			embed.setColor(orange)
				.setTitle('An error occurred')
				.setDescription(
					'An error occurred while trying to skip this reminder. It has **NOT** been skipped.\n\nWhen interacting with the skip dialog, **DO NOT change the Reminder ID field**.'
				)
				.setThumbnail(
					'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
				)
				.setFooter({
					text: `${
						memberData.memberNick
							? memberData.memberNick
							: memberData.memberUsername
					} used /raidreminder skip`,
					iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
				})

			interactionReply(interaction, null, [embed], null, true, false)
			return
		}

		// Respond with skip confirmation
		embed.setTitle('Skip a raid reminder')
			.setColor(purple)
			.setDescription(
				'Your raid reminder has been skipped successfully. The next reminder is listed below.'
			)
			.addField(
				'Next reminder',
				`${nextReminder.toLocaleString(
					DateTime.DATE_MED_WITH_WEEKDAY
				)} ${nextReminder.toLocaleString(DateTime.TIME_SIMPLE)} ${
					nextReminder.offsetNameShort
				}`
			)
			.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
			.setFooter({
				text: `${
					memberData.memberNick
						? memberData.memberNick
						: memberData.memberUsername
				} used /raidreminder skip`,
				iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
			})

		interactionReply(interaction, null, [embed], null, true, false)
		return
	},
}
