const { EmbedBuilder } = require('discord.js')
const { DateTime } = require('luxon')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')
const interactionReply = require('../../command-utils/interactionReply')
const getNextReminder = require('../../command-utils/raidReminder/getNextReminder.js')

module.exports = {
	name: 'rrInfoSelectMenu',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { baseImageURL } = globals
		const { red, purple } = globals.colors

		// Get select menu value
		const selectedItem = interaction.values[0]

		// Get data about the user who submitted the command
		const memberData = {
			memberID: interaction.member.user.id,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nickname,
			memberAvatar: interaction.member.user.avatar,
		}

		// Create embed reply
		const embed = new EmbedBuilder().setTitle('Raid reminder info')

		// Get the reminder
		const reminder = await raidReminderSchema.findOne({
			_id: selectedItem,
		})

		if (reminder.length === 0) {
			embed.setColor(red)
				.setDescription(
					"Unable to retrieve the raid reminder's information."
				)
				.setFooter({
					text: `${
						memberData.memberNick
							? memberData.memberNick
							: memberData.memberUsername
					} used /raidreminder info`,
					iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
				})

			// Update the original message (the one with the select menu) so the menu disappears and is updated with the error
			await interaction.update({ embeds: [embed], components: [] })
			return
		}

		const nextReminder = reminder.nextReminder.toISOString()
		const {
			title,
			message,
			days,
			time,
			timezone,
			friendlyTZ,
			role,
			channel,
			reminderHours,
		} = JSON.parse(reminder.dataSubmission)

		// Respond with the reminder info
		const dtNextReminder = DateTime.fromISO(nextReminder)
			.setLocale('en-US')
			.setZone(timezone)
		const nextReminderDate = dtNextReminder.toLocaleString(
			DateTime.DATE_MED_WITH_WEEKDAY
		)

		embed.setColor(purple)
			.setDescription(
				'Retrieved the below information about this raid reminder.'
			)
			.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
			.addFields(
				{ name: 'Title', value: title },
				{ name: 'Message', value: `>>> ${message}` },
				{ name: 'Static', value: role },
				{
					name: 'Raid start time',
					value: `${time} ${friendlyTZ} | ${reminderHours} hour reminder`,
					inline: true,
				},
				{
					name: 'Raid days',
					value: days.join(', '),
					inline: true,
				},
				{
					name: '\u200b',
					value: '\u200b',
					inline: true,
				},
				{
					name: 'Next reminder',
					value: `${nextReminderDate.substring(
						0,
						nextReminderDate.length - 6
					)} ${dtNextReminder.toLocaleString(
						DateTime.TIME_SIMPLE
					)} ${friendlyTZ}`,
					inline: true,
				},
				{ name: 'Channel', value: `<#${channel}>`, inline: true },
				{
					name: '\u200b',
					value: '\u200b',
					inline: true,
				}
			)
			.setFooter({
				text: `${
					memberData.memberNick
						? memberData.memberNick
						: memberData.memberUsername
				} used /raidreminder info`,
				iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
			})

		// Update the original message (the one with the select menu) so the menu disappears and is updated with the new reply with the info
		await interaction.update({ embeds: [embed], components: [] })
		return
	},
}
