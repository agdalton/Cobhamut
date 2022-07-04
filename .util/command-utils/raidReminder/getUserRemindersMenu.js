const { MessageActionRow, MessageSelectMenu } = require('discord.js')
const raidReminderSchema = require('../../mongo-utils/raidReminder/raidReminderSchema.js')

module.exports = async (userId) => {
	// Find all raid reminders scheduled by the user
	const raidReminders = await raidReminderSchema.find({
		dataCreator: { $regex: `"memberID":"${userId}"` },
	})

	// Build a list and present it to the user
	const reminderChoices = []
	for (const reminder of raidReminders) {
		const reminderData = JSON.parse(reminder.dataSubmission)

		reminderChoices.push({
			label: reminderData.title,
			description: `${reminderData.days} @ ${reminderData.time} ${reminderData.timezone}`,
			value: reminder._id.toString(),
		})
	}

	return new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId('rrCancelSelectMenu')
			.setPlaceholder('Nothing selected')
			.addOptions(reminderChoices)
	)
}
