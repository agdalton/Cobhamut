const { MessageEmbed } = require('discord.js')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')

module.exports = {
	name: 'rrUpdateMessageModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { baseImageURL } = globals
		const { orange, purple } = globals.colors

		// Get modal inputs
		const { fields } = interaction
		const mongoId = fields.getTextInputValue('rrMongoId').trim()
		const message = fields.getTextInputValue('rrMessage').trim()

		// Get data about the user who submitted the command
		const memberData = {
			memberID: interaction.member.user.id,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nickname,
			memberAvatar: interaction.member.user.avatar,
		}

		// Create embed reply
		const embed = new MessageEmbed()

		// Find the reminder to get the data
		const reminder = await raidReminderSchema.findOne({
			_id: mongoId,
		})

		const reminderData = JSON.parse(reminder.dataSubmission)
		// Update the message
		reminderData.message = message

		// Delete the reminder from mongoDB
		try {
			await raidReminderSchema.UpdateOne(
				{
					dataSubmission: JSON.stringify(reminderData),
				},
				{
					_id: mongoId,
				}
			)
		} catch (e) {
			embed.setColor(orange)
				.setTitle('An error occurred')
				.setDescription(
					'An error occurred while trying to update this reminder. It has **NOT** been updated.\n\nWhen interacting with the update message dialog, **DO NOT change the Reminder ID field**.'
				)
				.setThumbnail(
					'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
				)
				.setFooter({
					text: `${
						memberData.memberNick
							? memberData.memberNick
							: memberData.memberUsername
					} used /raidreminder update-message`,
					iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
				})
			// Update the original message (the one with the select menu) so the menu disappears and is updated with the error
			await interaction.update({ embeds: [embed], components: [] })
			return
		}

		// Respond with delete confirmation
		embed.setTitle("Update a raid reminder's message")
			.setColor(purple)
			.setDescription(
				'This raid reminder has been updated successfully.'
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
			.addField('Next reminder', '-', true)
			.addField('Channel', `<#${channel}>`, true)
			.addField('\u200b', '\u200b', true)
			.setFooter({
				text: `${
					memberData.memberNick
						? memberData.memberNick
						: memberData.memberUsername
				} used /raidreminder update-message`,
				iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
			})

		// Update the original message (the one with the select menu) so the menu disappears
		await interaction.update({ embeds: [], components: [] })
		// Follow up with the cancel confirmation
		await interaction.followUp({ embeds: [embed], ephemeral: false })
		return
	},
}
