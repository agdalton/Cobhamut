const { EmbedBuilder } = require('discord.js')
const { DateTime } = require('luxon')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')

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
		const embed = new EmbedBuilder()

		// Return if the user didn't correctly type CANCEL
		if (confirmation !== 'CANCEL') {
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
					} used /raidreminder cancel`,
					iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
				})
			// Update the original message (the one with the select menu) so the menu disappears and is updated with the error
			await interaction.update({ embeds: [embed], components: [] })
			return
		}

		// Find the reminder to get the data
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

		// Delete the reminder from mongoDB
		try {
			await raidReminderSchema.deleteOne({
				_id: mongoId,
			})
		} catch (e) {
			embed.setColor(orange)
				.setTitle('An error occurred')
				.setDescription(
					'An error occurred while trying to cancel this reminder. It has **NOT** been canceled.\n\nWhen interacting with the cancelation dialog, **DO NOT change the Reminder ID field**.'
				)
				.setThumbnail(
					'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
				)
				.setFooter({
					text: `${
						memberData.memberNick
							? memberData.memberNick
							: memberData.memberUsername
					} used /raidreminder cancel`,
					iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
				})
			// Update the original message (the one with the select menu) so the menu disappears and is updated with the error
			await interaction.update({ embeds: [embed], components: [] })
			return
		}

		// Respond with delete confirmation
		embed.setTitle('Cancel a raid reminder')
			.setColor(purple)
			.setDescription(
				'This raid reminder has been canceled successfully.'
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
				{ name: 'Raid days', value: days.join(', '), inline: true },
				{ name: '\u200b', value: '\u200b', inline: true },
				{ name: 'Next reminder', value: '-', inline: true },
				{ name: 'Channel', value: `<#${channel}>`, inline: true },
				{ name: '\u200b', value: '\u200b', inline: true }
			)
			.setFooter({
				text: `${
					memberData.memberNick
						? memberData.memberNick
						: memberData.memberUsername
				} used /raidreminder cancel`,
				iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
			})

		// Update the original message (the one with the select menu) so the menu disappears
		await interaction.update({ embeds: [embed], components: [] })
		// Follow up with the cancel confirmation
		await interaction.followUp({ embeds: [embed], ephemeral: false })
		return
	},
}
