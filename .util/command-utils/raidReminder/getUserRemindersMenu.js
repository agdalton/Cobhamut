const { MessageActionRow, MessageSelectMenu } = require('discord.js')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')

module.exports = async (userId, customId) => {
	// Find all raid reminders scheduled by the user
	const raidReminders = await raidReminderSchema.find({
		dataCreator: { $regex: `"memberID":"${userId}"` },
	})

	// If the user has reminders, build the select menu
	if (raidReminders.length > 0) {
		// Build a list and present it to the user
		const reminderChoices = []
		for (const reminder of raidReminders) {
			const reminderData = JSON.parse(reminder.dataSubmission)

			reminderChoices.push({
				label: reminderData.title,
				description: `${reminderData.days.join(', ')} @ ${
					reminderData.time
				} ${reminderData.friendlyTZ} | ${
					reminderData.reminderHours
				} hour reminder`,
				value: reminder._id.toString(),
			})
		}

		return new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId(customId)
				.setPlaceholder('Nothing selected')
				.addOptions(reminderChoices)
				.setMaxValues(20)
		)
	}

	return
}
