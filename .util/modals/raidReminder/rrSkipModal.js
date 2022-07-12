const { MessageEmbed } = require('discord.js')
const { DateTime } = require('luxon')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')
const getNextReminder = require('../../command-utils/raidReminder/getNextReminder.js')

module.exports = {
	name: 'rrSkipModal',
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

		// Return if the user didn't correctly type SKIP
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
			// Update the original message (the one with the select menu) so the menu disappears and is updated with the error
			await interaction.update({ embeds: [embed], components: [] })
			return
		}

		// Modify the next reminder in mongoDB
		let nextReminder = ''
		let newNextReminder = ''
		try {
			const reminder = await raidReminderSchema.findOne({
				_id: mongoId,
			})

			const { daysOfWeek, time, timezone, reminderHours } = JSON.parse(
				reminder.dataSubmission
			)
			// Get the current next reminder
			nextReminder = getNextReminder(
				daysOfWeek,
				time,
				timezone,
				reminderHours
			)

			// Remove the day index of the next reminder from daysOfWeek so that the next reminder is skipped
			const filteredDays = daysOfWeek.filter((value, index, arr) => {
				return value !== nextReminder.weekday
			})

			newNextReminder = getNextReminder(
				daysOfWeek.length > 1 ? filteredDays : daysOfWeek,
				time,
				timezone,
				reminderHours
			)

			if (daysOfWeek.length === 1)
				newNextReminder = newNextReminder.plus({ days: 7 })

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
			// Update the original message (the one with the select menu) so the menu disappears and is updated with the error
			await interaction.update({ embeds: [embed], components: [] })
			return
		}

		// Respond with skip confirmation <-- Find the reminder again since it was last retrieved in a try/catch and we know it exists at this point
		const reminder = await raidReminderSchema.findOne({
			_id: mongoId,
		})

		const {
			title,
			message,
			days,
			time,
			friendlyTZ,
			role,
			channel,
			reminderHours,
		} = JSON.parse(reminder.dataSubmission)

		const nextReminderDate = newNextReminder.toLocaleString(
			DateTime.DATE_MED_WITH_WEEKDAY
		)

		embed.setTitle('Skip a raid reminder')
			.setColor(purple)
			.setDescription(
				'This raid reminder has been skipped successfully. The next reminder is listed below.'
			)
			.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
			.addField('Title', title)
			.addField('Message', `>>> ${message}`)
			.addField('Static', role)
			.addField(
				'Raid start time',
				`${time} ${friendlyTZ} | ${reminderHours} hour reminder`,
				true
			)
			.addField('Raid days', days.join(', '), true)
			.addField('\u200b', '\u200b', true)
			.addField(
				'Next reminder',
				`${nextReminderDate.substring(
					0,
					nextReminderDate.length - 6
				)} ${newNextReminder.toLocaleString(
					DateTime.TIME_SIMPLE
				)} ${newNextReminder.offsetNameShort}`,
				true
			)
			.addField('Channel', `<#${channel}>`, true)
			.addField('\u200b', '\u200b', true)
			.setFooter({
				text: `${
					memberData.memberNick
						? memberData.memberNick
						: memberData.memberUsername
				} used /raidreminder skip`,
				iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
			})

		// Update the original message (the one with the select menu) so the menu disappears
		await interaction.update({ embeds: [embed], components: [] })
		// Follow up with the skip confirmation
		await interaction.followUp({ embeds: [embed], ephemeral: false })
		return
	},
}
