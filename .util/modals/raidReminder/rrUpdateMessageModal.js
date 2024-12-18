const { EmbedBuilder } = require('discord.js')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')

module.exports = {
	name: 'rrUpdateMessageModal',
	callback: async (client, interaction, globals) => {
		// Destruct globals
		const { baseImageURL } = globals
		const { orange, purple } = globals.colors

		// Get modal inputs
		const { fields } = interaction
		const mongoIds = fields.getTextInputValue('rrMongoIds').split(',')
		const message = fields.getTextInputValue('rrMessage').trim()

		// Get data about the user who submitted the command
		const memberData = {
			memberID: interaction.member.user.id,
			memberUsername: interaction.member.user.username,
			memberNick: interaction.member.nickname,
			memberAvatar: interaction.member.user.avatar,
		}

		// Create embed reply
		const embed = new EmbedBuilder()

		// Build a query for mongo with all the IDs
		const query = { $or: [] }
		for (let i = 0; i < mongoIds.length; i++) {
			query.$or.push({
				_id: mongoIds[i],
			})
		}

		// Find the reminder to get the data
		const reminders = await raidReminderSchema.find(query)

		const err = []
		const updatedReminders = []
		for (const reminder of reminders) {
			const reminderData = JSON.parse(reminder.dataSubmission)
			// Update the message
			reminderData.message = message

			updatedReminders.push(
				`**${reminderData.title}**\n${reminderData.days.join(
					', '
				)} @ ${reminderData.time} ${reminderData.friendlyTZ} | ${
					reminderData.reminderHours
				} hour reminder`
			)

			// Delete the reminder from mongoDB
			try {
				await raidReminderSchema.updateOne(
					{
						_id: reminder._id,
					},
					{
						dataSubmission: JSON.stringify(reminderData),
					}
				)
			} catch (e) {
				err.push(updatedReminders[updatedReminders.length - 1])
			}
		}

		// If any errors occurred
		if (err.length > 0) {
			embed.setColor(orange)
				.setTitle('An error occurred')
				.setDescription(
					'An error occurred while trying to update the below reminder(s). They have **NOT** been updated.\n\nWhen interacting with the update message dialog, **DO NOT change the Reminder IDs field**.'
				)
				.setThumbnail(
					'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/htc/37/warning-sign_26a0.png'
				)
				.addFields({
					name: 'Reminders NOT updated',
					value: `>>> ${err.join('\n\n')}`,
				})
				.setFooter({
					text: `${
						memberData.memberNick
							? memberData.memberNick
							: memberData.memberUsername
					} used /raidreminder update-message`,
					iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
				})
			// Update the original message (the one with the select menu) so the menu disappears and is updated with the error
			await interaction.update({
				embeds: [embed],
				components: [],
			})
			return
		}
		// Respond with delete confirmation
		embed.setTitle("Update a raid reminder's message")
			.setColor(purple)
			.setDescription(
				'This raid reminder has been updated successfully.'
			)
			.setThumbnail('https://xivapi.com/i/060000/060855_hr1.png')
			.addFields(
				{
					name: 'Updated Reminders',
					value: `>>> ${updatedReminders.join('\n\n')}`,
				},
				{ name: 'Message', value: `>>> ${message}` }
			)
			.setFooter({
				text: `${
					memberData.memberNick
						? memberData.memberNick
						: memberData.memberUsername
				} used /raidreminder update-message`,
				iconURL: `${baseImageURL}/avatars/${memberData.memberID}/${memberData.memberAvatar}.png`,
			})

		// Update the original message (the one with the select menu) so the menu disappears
		await interaction.update({ embeds: [embed], components: [] })
		return
	},
}
